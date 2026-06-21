import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { createBlog, fetchBlog, updateBlog } from '../api/blogs';
import { fetchCategories } from '../api/categories';
import type { Category, ContentBlock, SourceLink } from '../types';

const emptySourceLink = (): SourceLink => ({ label: '', url: '' });

const emptyParagraph = (): ContentBlock => ({ type: 'paragraph', text: '', keyPoint: '' });
const CODE_LANGUAGES = [
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
] as const;

const CODE_PLACEHOLDERS: Record<string, string> = {
  java: `public class Hello {
  public static void main(String[] args) {
    System.out.println("Hello, world!");
  }
}`,
  python: `print("Hello, world!")`,
};

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
  const [content, setContent] = useState<ContentBlock[]>([emptyParagraph()]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
        setContent(blog.content.length ? blog.content : [emptyParagraph()]);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [id]);

  function moveBlock(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= content.length) return;
    const updated = [...content];
    [updated[index], updated[next]] = [updated[next], updated[index]];
    setContent(updated);
  }

  function updateBlock(index: number, block: ContentBlock) {
    setContent(content.map((b, i) => (i === index ? block : b)));
  }

  function removeBlock(index: number) {
    if (content.length <= 1) return;
    setContent(content.filter((_, i) => i !== index));
  }

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
      content: content.filter((b) => {
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

      <h1 className="text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">{isEdit ? 'Edit Blog' : 'Create Blog'}</h1>

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg text-foreground">Source Links</h2>
            <button
              type="button"
              onClick={() => setSourceLinks([...sourceLinks, emptySourceLink()])}
              className="flex items-center gap-1 text-sm text-link hover:text-link-hover font-medium"
            >
              <Plus className="w-4 h-4" /> Add link
            </button>
          </div>
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
        </section>

        <section>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-lg text-foreground">Content Blocks</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setContent([...content, emptyParagraph()])}
                className="text-sm px-3 py-1 rounded border border-border-strong text-muted hover:text-foreground"
              >
                + Paragraph
              </button>
              <button
                type="button"
                onClick={() => setContent([...content, emptyCode()])}
                className="text-sm px-3 py-1 rounded border border-border-strong text-muted hover:text-foreground"
              >
                + Code
              </button>
              <button
                type="button"
                onClick={() =>
                  setContent([...content, { type: 'heading', level: 2, text: '' }])
                }
                className="text-sm px-3 py-1 rounded border border-border-strong text-muted hover:text-foreground"
              >
                + Heading
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {content.map((block, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-border bg-input/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase text-muted">{block.type}</span>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveBlock(index, -1)} className="p-1 text-muted hover:text-foreground">
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => moveBlock(index, 1)} className="p-1 text-muted hover:text-foreground">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => removeBlock(index)} className="p-1 text-muted hover:text-danger">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {block.type === 'paragraph' && (
                  <div className="space-y-3">
                    <textarea
                      value={block.text}
                      onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                      placeholder="Write your content..."
                    />
                    <div>
                      <label className="block text-xs text-muted font-medium mb-1">
                        Key point <span className="font-normal">(shown on hover when reading)</span>
                      </label>
                      <input
                        type="text"
                        value={block.keyPoint ?? ''}
                        onChange={(e) =>
                          updateBlock(index, { ...block, keyPoint: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                        placeholder="Main takeaway for this paragraph..."
                      />
                    </div>
                  </div>
                )}

                {block.type === 'heading' && (
                  <div className="flex gap-2">
                    <select
                      value={block.level}
                      onChange={(e) =>
                        updateBlock(index, { ...block, level: Number(e.target.value) })
                      }
                      className="px-2 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>
                          H{n}
                        </option>
                      ))}
                    </select>
                    <input
                      value={block.text}
                      onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                      className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                    />
                  </div>
                )}

                {block.type === 'code' && (
                  <>
                    <div className="flex gap-4 items-center flex-wrap">
                      <select
                        value={block.language}
                        onChange={(e) => {
                          const language = e.target.value;
                          updateBlock(index, {
                            ...block,
                            language,
                            runnable: language === 'python' ? block.runnable : false,
                          });
                        }}
                        className="px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                      >
                        {!CODE_LANGUAGES.some((l) => l.value === block.language) && (
                          <option value={block.language}>{block.language}</option>
                        )}
                        {CODE_LANGUAGES.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {block.language === 'python' && (
                        <label className="flex items-center gap-2 text-sm text-muted">
                          <input
                            type="checkbox"
                            checked={block.runnable}
                            onChange={(e) =>
                              updateBlock(index, { ...block, runnable: e.target.checked })
                            }
                          />
                          Runnable (Python in browser)
                        </label>
                      )}
                    </div>
                    <textarea
                      value={block.code}
                      onChange={(e) => updateBlock(index, { ...block, code: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm font-mono"
                      placeholder={
                        CODE_PLACEHOLDERS[block.language] ?? '// Your code here'
                      }
                    />
                  </>
                )}
              </div>
            ))}
          </div>
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
