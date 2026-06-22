import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Code2, Heading, Type } from 'lucide-react';
import { createBlog, fetchBlog, updateBlog } from '../api/blogs';
import { fetchCategories } from '../api/categories';
import { AddBlockButton } from '../components/AddBlockButton';
import { SortableContentBlocks } from '../components/SortableContentBlocks';
import {
  fromEditorBlock,
  toEditorBlock,
  toEditorBlocks,
  type EditorBlock,
} from '../lib/editorBlocks';
import type { Category, ContentBlock, SourceLink } from '../types';

const emptySourceLink = (): SourceLink => ({ label: '', url: '' });

const emptyParagraph = (): ContentBlock => ({ type: 'paragraph', text: '', keyPoint: '' });

const emptyCode = (): ContentBlock => ({
  type: 'code',
  language: 'java',
  code: '',
  runnable: false,
});

export function BlogEditorPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [summary, setSummary] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [progress, setProgress] = useState(0);
  const [sourceLinks, setSourceLinks] = useState<SourceLink[]>([emptySourceLink()]);
  const [content, setContent] = useState<EditorBlock[]>([toEditorBlock(emptyParagraph())]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [clickedAdd, setClickedAdd] = useState<string | null>(null);
  const [clickedAddLink, setClickedAddLink] = useState(false);
  const contentEndRef = useRef<HTMLDivElement>(null);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addLinkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flashAddButton(key: string) {
    if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
    setClickedAdd(key);
    clickTimeoutRef.current = setTimeout(() => setClickedAdd(null), 450);
  }

  function addContentBlock(block: ContentBlock) {
    setContent((prev) => [...prev, toEditorBlock(block)]);
    flashAddButton(block.type);
    requestAnimationFrame(() => {
      contentEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }

  function addSourceLink() {
    setSourceLinks((prev) => [...prev, emptySourceLink()]);
    if (addLinkTimeoutRef.current) clearTimeout(addLinkTimeoutRef.current);
    setClickedAddLink(true);
    addLinkTimeoutRef.current = setTimeout(() => setClickedAddLink(false), 450);
  }

  useEffect(() => {
    fetchCategories().then((cats) => {
      setCategories(cats);
      if (cats[0]) setCategoryId((prev) => prev || cats[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!id) return;
    fetchBlog(id)
      .then((blog) => {
        setTitle(blog.title);
        setCategoryId(
          typeof blog.categoryId === 'string' ? blog.categoryId : blog.categoryId._id
        );
        setSummary(blog.summary);
        setTagsInput(blog.tags.join(', '));
        setProgress(blog.progress);
        setSourceLinks(blog.sourceLinks.length ? blog.sourceLinks : [emptySourceLink()]);
        setContent(
          blog.content.length ? toEditorBlocks(blog.content) : [toEditorBlock(emptyParagraph())]
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      title,
      categoryId,
      summary,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      progress,
      content: content
        .map(fromEditorBlock)
        .filter((b) => {
          if (b.type === 'paragraph') return b.text.trim();
          if (b.type === 'heading') return b.text.trim();
          if (b.type === 'code') return b.code.trim();
          return false;
        }),
      sourceLinks: sourceLinks.filter((l) => l.label.trim() && l.url.trim()),
    };

    try {
      const blog = isEdit && id ? await updateBlog(id, payload) : await createBlog(payload);
      navigate(`/blogs/${blog._id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-4 sm:p-6 lg:p-8 text-muted">Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <Link
        to={isEdit && id ? `/blogs/${id}` : '/'}
        className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Cancel
      </Link>

      <h1 className="text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">
        {isEdit ? 'Edit Blog' : 'Create Blog'}
      </h1>

      {error && <p className="text-danger mb-4 font-medium">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-muted mb-1">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
                required
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Progress ({progress}%)</label>
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full mt-3"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Summary</label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Tags (comma-separated)</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, TypeScript, Python"
              className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground"
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg text-foreground mb-4">Source Links</h2>
          <div className="space-y-3">
            {sourceLinks.map((link, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const updated = [...sourceLinks];
                    updated[i] = { ...link, label: e.target.value };
                    setSourceLinks(updated);
                  }}
                  placeholder="Label"
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm"
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...sourceLinks];
                    updated[i] = { ...link, url: e.target.value };
                    setSourceLinks(updated);
                  }}
                  placeholder="https://..."
                  type="url"
                  className="sm:flex-[2] w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground text-sm"
                />
                <button
                  type="button"
                  onClick={() => setSourceLinks(sourceLinks.filter((_, j) => j !== i))}
                  className="p-2 text-muted hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <AddBlockButton
              label="Add link"
              icon={<Plus className="w-4 h-4" />}
              active={clickedAddLink}
              onClick={addSourceLink}
            />
          </div>
        </section>

        <section>
          <h2 className="text-lg text-foreground mb-4">Content Blocks</h2>
          <SortableContentBlocks
            blocks={content}
            onChange={setContent}
            listEndRef={contentEndRef}
            addButtons={
              <>
                <AddBlockButton
                  label="Paragraph"
                  icon={<Type className="w-4 h-4" />}
                  active={clickedAdd === 'paragraph'}
                  onClick={() => addContentBlock(emptyParagraph())}
                />
                <AddBlockButton
                  label="Code"
                  icon={<Code2 className="w-4 h-4" />}
                  active={clickedAdd === 'code'}
                  onClick={() => addContentBlock(emptyCode())}
                />
                <AddBlockButton
                  label="Heading"
                  icon={<Heading className="w-4 h-4" />}
                  active={clickedAdd === 'heading'}
                  onClick={() =>
                    addContentBlock({ type: 'heading', level: 2, text: '' })
                  }
                />
              </>
            }
          />
        </section>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-purple-600 text-white font-medium hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
}
