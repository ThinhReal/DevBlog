import { Router } from 'express';
import { z } from 'zod';
import { Category } from '../models/Category.js';
import { Blog } from '../models/Blog.js';
import { requireAuth } from '../middleware/auth.js';
import { toSlug } from '../utils/slug.js';

const router = Router();

const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  order: z.number().int().optional(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  slug: z.string().min(1).max(100).optional(),
  icon: z.string().max(50).optional(),
  order: z.number().int().optional(),
});

router.get('/', async (_req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 });
  res.json(categories);
});

router.post('/', requireAuth, async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { name, icon, order } = parsed.data;
  const slug = parsed.data.slug ?? toSlug(name);

  const existing = await Category.findOne({ slug });
  if (existing) {
    res.status(409).json({ error: 'Category slug already exists' });
    return;
  }

  const maxOrder = await Category.findOne().sort({ order: -1 }).select('order');
  const category = await Category.create({
    name,
    slug,
    icon: icon ?? 'Folder',
    order: order ?? (maxOrder?.order ?? 0) + 1,
  });

  res.status(201).json(category);
});

router.put('/:id', requireAuth, async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  if (parsed.data.name) category.name = parsed.data.name;
  if (parsed.data.slug) category.slug = parsed.data.slug;
  if (parsed.data.icon) category.icon = parsed.data.icon;
  if (parsed.data.order !== undefined) category.order = parsed.data.order;

  if (parsed.data.name && !parsed.data.slug) {
    category.slug = toSlug(parsed.data.name);
  }

  try {
    await category.save();
    res.json(category);
  } catch {
    res.status(409).json({ error: 'Category slug already exists' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  const blogCount = await Blog.countDocuments({ categoryId: category._id });
  if (blogCount > 0) {
    res.status(409).json({
      error: 'Cannot delete category with existing blogs',
      blogCount,
    });
    return;
  }

  await category.deleteOne();
  res.status(204).send();
});

export default router;
