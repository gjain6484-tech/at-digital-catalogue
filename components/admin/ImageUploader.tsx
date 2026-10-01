'use client';

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type ImageUploaderProps = {
  previewUrl: string | null;
  existingUrl: string;
  fileName?: string;
  disabled?: boolean;
  uploading?: boolean;
  onFile: (file: File | null) => void;
  onRemove: () => void;
};

export function ImageUploader({ previewUrl, existingUrl, fileName, disabled, uploading, onFile, onRemove }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const image = previewUrl || existingUrl;
  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    onFile(event.target.files?.[0] ?? null);
    event.target.value = "";
  };
  const dropFile = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    if (!disabled) onFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-4"><span className="text-xs font-medium uppercase tracking-[0.12em] text-muted">Product image</span><span className="text-[11px] text-muted">JPG, PNG, WEBP or GIF · 5 MB max</span></div>
      <input ref={inputRef} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={chooseFile} disabled={disabled} />
      {image ? (
        <div className="overflow-hidden rounded-lg border border-line bg-bone">
          <div className="relative aspect-[16/9] min-h-52"><img src={image} alt="Product image preview" className="h-full w-full object-contain" />{uploading && <div className="absolute inset-x-0 bottom-0 bg-ink px-4 py-3 text-xs text-white">Uploading image…</div>}</div>
          <div className="flex flex-col gap-3 border-t border-line bg-paper p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="truncate text-xs text-muted">{fileName || "Current catalogue image"}</p>
            <div className="flex gap-2"><Button variant="secondary" className="min-h-9 px-3 py-1 text-xs" onClick={() => inputRef.current?.click()} disabled={disabled}>Replace</Button><Button variant="quiet" className="min-h-9 px-3 py-1 text-xs" onClick={onRemove} disabled={disabled}>Remove</Button></div>
          </div>
        </div>
      ) : (
        <div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={dropFile} className={`flex min-h-60 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center transition ${dragging ? "border-ink bg-bone" : "border-[#cbc8c1] bg-[#faf9f7]"}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-8 w-8 fill-none stroke-current text-muted" strokeWidth="1.5"><path d="M12 16V4m0 0L8 8m4-4 4 4" /><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></svg>
          <p className="mt-5 font-display text-2xl tracking-[-0.02em]">Drop an image here</p><p className="mt-2 text-sm text-muted">or choose a file from your device</p>
          <Button variant="secondary" className="mt-6" onClick={() => inputRef.current?.click()} disabled={disabled}>Choose image</Button>
        </div>
      )}
    </div>
  );
}
