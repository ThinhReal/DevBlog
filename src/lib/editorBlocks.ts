import type { ContentBlock } from '../types';

export type EditorBlock = ContentBlock & { clientId: string };

export function toEditorBlock(block: ContentBlock): EditorBlock {
  return { ...block, clientId: crypto.randomUUID() };
}

export function toEditorBlocks(blocks: ContentBlock[]): EditorBlock[] {
  return blocks.map(toEditorBlock);
}

export function fromEditorBlock(block: EditorBlock): ContentBlock {
  const { clientId: _, ...rest } = block;
  return rest;
}

export function reorderBlocks<T>(items: T[], fromIndex: number, toIndex: number): T[] {
  if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return items;
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}
