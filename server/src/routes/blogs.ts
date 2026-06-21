import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Blog } from '../models/Blog.js';
import { Category } from '../models/Category.js';
import { requireAuth } from '../middleware/auth.js';
import { toSlug } from '../utils/slug.js';

const router = Router();

const sourceLinkSchema = z.object({
  label: z.string().min(1),
  url: z.string().url(),
});

const contentBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('paragraph'), text: z.string(), keyPoint: z.string().optional() }),
  z.object({
    type: z.literal('heading'),
    level: z.number().int().min(1).max(6),
    text: z.string().min(1),
  }),
  z.object({
    type: z.literal('code'),
    language: z.string().min(1),
    code: z.string(),
    runnable: z.boolean().default(false),
  }),
]);

const blogBodySchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  categoryId: z.string().min(1),
  summary: z.string().min(1).max(500),
  tags: z.array(z.string()).default([]),
  progress: z.number().min(0).max(100).default(0),
  content: z.array(contentBlockSchema).default([]),
  sourceLinks: z.array(sourceLinkSchema).default([]),
});

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = toSlug(base);
  let suffix = 0;

  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const query: Record<string, unknown> = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };

    const exists = await Blog.findOne(query);
    if (!exists) return candidate;
    suffix += 1;
  }
}

router.get('/', async (req, res) => {
  const { categoryId, search } = req.query;
  const filter: Record<string, unknown> = {};

  if (typeof categoryId === 'string' && categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({ error: 'Invalid categoryId' });
      return;
    }
    filter.categoryId = categoryId;
  }

  if (typeof search === 'string' && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ title: regex }, { summary: regex }, { tags: regex }];
  }

  const blogs = await Blog.find(filter)
    .populate('categoryId', 'name slug icon')
    .sort({ updatedAt: -1 });

  res.json(blogs);
});

router.get('/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ error: 'Invalid blog id' });
    return;
  }

  const blog = await Blog.findById(req.params.id).populate('categoryId', 'name slug icon');
  if (!blog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  res.json(blog);
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = blogBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
    res.status(400).json({ error: 'Invalid categoryId' });
    return;
  }

  const category = await Category.findById(data.categoryId);
  if (!category) {
    res.status(400).json({ error: 'Category not found' });
    return;
  }

  const slug = data.slug ? toSlug(data.slug) : await uniqueSlug(data.title);

  try {
    const blog = await Blog.create({
      ...data,
      slug,
      categoryId: category._id,
    });

    const populated = await Blog.findById(blog._id).populate('categoryId', 'name slug icon');
    res.status(201).json(populated);
  } catch {
    res.status(409).json({ error: 'Blog slug already exists' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid blog id' });
    return;
  }

  const parsed = blogBodySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  const data = parsed.data;
  if (!mongoose.Types.ObjectId.isValid(data.categoryId)) {
    res.status(400).json({ error: 'Invalid categoryId' });
    return;
  }

  const category = await Category.findById(data.categoryId);
  if (!category) {
    res.status(400).json({ error: 'Category not found' });
    return;
  }

  const titleChanged = blog.title !== data.title;

  blog.title = data.title;
  blog.categoryId = category._id;
  blog.summary = data.summary;
  blog.tags = data.tags;
  blog.progress = data.progress;
  blog.set('content', data.content);
  blog.set('sourceLinks', data.sourceLinks);

  if (data.slug) {
    blog.slug = toSlug(data.slug);
  } else if (titleChanged) {
    blog.slug = await uniqueSlug(data.title, blog._id.toString());
  }

  try {
    await blog.save();
    const populated = await Blog.findById(blog._id).populate('categoryId', 'name slug icon');
    res.json(populated);
  } catch {
    res.status(409).json({ error: 'Blog slug already exists' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const id = String(req.params.id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: 'Invalid blog id' });
    return;
  }

  const blog = await Blog.findByIdAndDelete(id);
  if (!blog) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }

  res.status(204).send();
});

export default router;
