import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from '../api/categories';
import { ApiError } from '../api/client';
import type { Category } from '../types';
import { IconPicker } from '../components/IconPicker';
import { getCategoryIcon } from '../lib/categoryIcons';

export function CategoryManagePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('Folder');
  const [showForm, setShowForm] = useState(false);

  function load() {
    setLoading(true);
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  function openCreate() {
    setEditing(null);
    setName('');
    setIcon('Folder');
    setShowForm(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setName(cat.name);
    setIcon(cat.icon);
    setShowForm(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      if (editing) {
        await updateCategory(editing._id, { name, icon });
      } else {
        await createCategory({ name, icon });
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete');
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-muted hover:text-foreground mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl text-foreground">Manage Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      {error && <p className="text-danger mb-4 font-medium">{error}</p>}

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-4 sm:p-6 rounded-xl border border-border bg-input space-y-4"
        >
          <h2 className="text-foreground">{editing ? 'Edit Category' : 'New Category'}</h2>
          <div>
            <label className="block text-sm text-muted mb-1">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-2">Icon</label>
            <IconPicker value={icon} onChange={setIcon} />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
            >
              {editing ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg border border-border-strong text-muted text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-muted">Loading...</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/80"
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = getCategoryIcon(cat.icon);
                  return (
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-card border border-border text-accent">
                      <Icon className="w-5 h-5" />
                    </span>
                  );
                })()}
                <div>
                  <p className="text-foreground font-medium">{cat.name}</p>
                  <p className="text-xs text-muted">{cat.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-muted hover:text-foreground"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="p-2 text-muted hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
