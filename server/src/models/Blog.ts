import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const sourceLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const contentBlockSchema = new Schema(
  {
    type: { type: String, required: true, enum: ['paragraph', 'heading', 'code'] },
    text: { type: String },
    keyPoint: { type: String },
    level: { type: Number },
    language: { type: String },
    code: { type: String },
    runnable: { type: Boolean, default: false },
  },
  { _id: false }
);

const blogSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    summary: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    content: { type: [contentBlockSchema], default: [] },
    sourceLinks: { type: [sourceLinkSchema], default: [] },
  },
  { timestamps: true }
);

export type BlogDocument = InferSchemaType<typeof blogSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Blog = mongoose.model('Blog', blogSchema);
