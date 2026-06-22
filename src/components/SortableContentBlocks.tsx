import { useCallback, useRef, useState } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { getHeadingClassName } from '../lib/headingStyles';
import { reorderBlocks, type EditorBlock } from '../lib/editorBlocks';
import type { ContentBlock } from '../types';

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

interface SortableContentBlocksProps {
  blocks: EditorBlock[];
  onChange: (blocks: EditorBlock[]) => void;
  listEndRef: React.RefObject<HTMLDivElement | null>;
  addButtons: React.ReactNode;
}

export function SortableContentBlocks({
  blocks,
  onChange,
  listEndRef,
  addButtons,
}: SortableContentBlocksProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const updateBlock = useCallback(
    (index: number, block: ContentBlock) => {
      onChange(blocks.map((b, i) => (i === index ? { ...block, clientId: b.clientId } : b)));
    },
    [blocks, onChange]
  );

  const removeBlock = useCallback(
    (index: number) => {
      if (blocks.length <= 1) return;
      onChange(blocks.filter((_, i) => i !== index));
    },
    [blocks, onChange]
  );

  const findDropTarget = useCallback(
    (clientY: number): string | null => {
      for (const block of blocks) {
        const el = blockRefs.current.get(block.clientId);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (clientY < rect.top + rect.height / 2) {
          return block.clientId;
        }
      }
      return blocks[blocks.length - 1]?.clientId ?? null;
    },
    [blocks]
  );

  const commitReorder = useCallback(
    (fromId: string, targetId: string) => {
      const fromIndex = blocks.findIndex((b) => b.clientId === fromId);
      const toIndex = blocks.findIndex((b) => b.clientId === targetId);
      if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return;
      onChange(reorderBlocks(blocks, fromIndex, toIndex));
    },
    [blocks, onChange]
  );

  function handleGripPointerDown(e: React.PointerEvent, clientId: string) {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDraggingId(clientId);
    setOverId(clientId);
  }

  function handleGripPointerMove(e: React.PointerEvent) {
    if (!draggingId) return;
    const target = findDropTarget(e.clientY);
    if (target) setOverId(target);
  }

  function handleGripPointerUp(e: React.PointerEvent) {
    if (draggingId && overId) {
      commitReorder(draggingId, overId);
    }
    setDraggingId(null);
    setOverId(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
  }

  return (
    <>
      <div className="space-y-3">
        {blocks.map((block, index) => {
          const isDragging = draggingId === block.clientId;
          const isDropTarget = overId === block.clientId && draggingId !== block.clientId;

          return (
            <div
              key={block.clientId}
              ref={(el) => {
                if (el) blockRefs.current.set(block.clientId, el);
                else blockRefs.current.delete(block.clientId);
              }}
              className={`
                flex gap-2 rounded-xl border bg-input/50 transition-all duration-150
                ${isDragging ? 'opacity-50 scale-[0.99] border-accent shadow-md z-10' : 'border-border'}
                ${isDropTarget ? 'border-accent ring-2 ring-accent/30' : ''}
              `}
            >
              <button
                type="button"
                aria-label="Drag to reorder"
                className={`
                  shrink-0 flex items-center justify-center w-10 cursor-grab active:cursor-grabbing
                  text-muted hover:text-accent border-r border-border rounded-l-xl
                  touch-none select-none transition-colors
                  ${isDragging ? 'text-accent bg-accent/10' : 'hover:bg-accent/5'}
                `}
                onPointerDown={(e) => handleGripPointerDown(e, block.clientId)}
                onPointerMove={handleGripPointerMove}
                onPointerUp={handleGripPointerUp}
                onPointerCancel={handleGripPointerUp}
              >
                <GripVertical className="w-5 h-5" />
              </button>

              <div className="flex-1 min-w-0 p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs uppercase text-muted font-medium">{block.type}</span>
                  <button
                    type="button"
                    onClick={() => removeBlock(index)}
                    className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                    aria-label="Remove block"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
                        Key point{' '}
                        <span className="font-normal">(shown on hover when reading)</span>
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
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-muted font-medium mr-1">Level:</span>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => updateBlock(index, { ...block, level: n })}
                          className={`
                            px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all active:scale-95
                            ${
                              block.level === n
                                ? 'bg-accent/15 border-accent text-accent scale-95'
                                : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
                            }
                          `}
                        >
                          H{n}
                        </button>
                      ))}
                    </div>
                    <input
                      value={block.text}
                      onChange={(e) => updateBlock(index, { ...block, text: e.target.value })}
                      placeholder="Heading text..."
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground text-sm"
                    />
                    <div className="px-3 py-2 rounded-lg bg-background border border-dashed border-border">
                      <p className="text-xs text-muted mb-1">Preview</p>
                      <p className={getHeadingClassName(block.level)}>
                        {block.text || (
                          <span className="text-muted italic font-normal text-sm">
                            Heading {block.level} preview
                          </span>
                        )}
                      </p>
                    </div>
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
                      placeholder={CODE_PLACEHOLDERS[block.language] ?? '// Your code here'}
                    />
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={listEndRef} className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
        {addButtons}
      </div>

      <p className="text-xs text-muted mt-2">
        Hold the grip handle on the left of a block and drag up or down to reorder.
      </p>
    </>
  );
}
