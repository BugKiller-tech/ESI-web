'use client';

import * as Popover from '@radix-ui/react-popover';
import { useState, useEffect, useRef } from 'react';

type SearchableDropdownProps = {
  items: string[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
};

export default function SearchableDropdown({
  items,
  value,
  onSelect,
  placeholder = 'Select...',
  loading = false,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = items.filter((item) =>
    item.toLowerCase().startsWith(query.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        (prev - 1 + filtered.length) % filtered.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filtered[highlightedIndex];
      if (selected) {
        onSelect(selected);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  useEffect(() => {
    setHighlightedIndex(0);
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div className="w-full relative">
      <Popover.Root open={open} onOpenChange={(val) => !loading && setOpen(val)}>
        <Popover.Trigger asChild>
          <button
            className="w-full border px-4 py-1 rounded bg-white shadow text-left relative disabled:opacity-50 outline-none"
            disabled={loading}
          >
            {value || placeholder}
            {loading && (
              <div className="absolute inset-0 flex justify-center items-center bg-white/80 rounded">
                <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              </div>
            )}
          </button>
        </Popover.Trigger>

        {!loading && (
          <Popover.Portal>
            <Popover.Content
              side="bottom"
              align="start"
              sideOffset={4}
              className="bg-white p-2 rounded shadow border w-[--radix-popover-trigger-width]"
            >
              <input
                ref={inputRef}
                className="w-full px-2 py-1 border mb-2 rounded outline-none"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="max-h-40 overflow-y-auto space-y-1">
                {filtered.map((item, idx) => (
                  <div
                    key={idx + item}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-blue-900 ${idx === highlightedIndex
                        ? 'bg-blue-500 text-white'
                        : 'hover:bg-gray-100'
                      }`}
                    onClick={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    {item}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="text-gray-400 px-2 py-1">No results</div>
                )}
              </div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </Popover.Root>
    </div>
  );
}