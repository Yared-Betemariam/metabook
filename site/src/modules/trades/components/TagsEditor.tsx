"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit2, Plus, X, XIcon } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

interface TagsEditorProps {
  value: string[];
  onChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function TagsEditor({ value, onChange, disabled }: TagsEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeTag = (indexToRemove: number) => {
    onChange(value.filter((_, index) => index !== indexToRemove));
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(value[index]);
  };

  const saveEdit = () => {
    if (editingIndex !== null) {
      const trimmedValue = editValue.trim();
      if (trimmedValue && !value.includes(trimmedValue)) {
        const newTags = [...value];
        newTags[editingIndex] = trimmedValue;
        onChange(newTags);
      }
      setEditingIndex(null);
      setEditValue("");
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="flex flex-col my-2 gap-1">
      {!disabled && (
        <div className="flex gap-2">
          <Input
            disabled={disabled}
            placeholder="Add a tag..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            variant={"outline"}
            className="border-dashed rounded-full bg-zinc-100"
            onClick={addTag}
            disabled={
              !inputValue.trim() ||
              value.includes(inputValue.trim()) ||
              disabled
            }
            size="icon"
          >
            <Plus className="size-5" />
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-1.5">
        {value.map((tag, index) => (
          <div key={index} className="flex items-center">
            {editingIndex === index && !disabled ? (
              <div className="flex items-center gap-1 bg-secondary/20 rounded-full p-1">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  className="h-6 text-xs border-none py-0 bg-emerald-900/10 shadow-none rounded-full focus-visible:ring-0"
                  autoFocus
                />
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={saveEdit}
                  className="size-6  p-0 aspect-square rounded-full"
                >
                  <Check className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={cancelEdit}
                  className="size-6  p-0 aspect-square rounded-full"
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <Badge
                variant="secondary"
                className="flex items-center bg-secondary/20 border drop-shadow gap-1 pl-4 pr-1 py-1 text-black rounded-full"
              >
                <span className="mr-2 text-sm">{tag}</span>
                {!disabled && (
                  <>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => startEditing(index)}
                      className="size-6  p-0 aspect-square rounded-full"
                    >
                      <Edit2 className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeTag(index)}
                      className="size-6 p-0 aspect-square rounded-full"
                    >
                      <X className="size-4" />
                    </Button>
                  </>
                )}
              </Badge>
            )}
          </div>
        ))}
      </div>

      {value.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No tags added yet. Add some tags to categorize your content.
        </p>
      )}
    </div>
  );
}
