"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check, BanIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AiSuggestion({
  value,
  fieldType,
  onApply,
}: {
  value: string;
  fieldType: string;
  onApply: (improvedValue: string) => void;
}) {
  const [suggestion, setSuggestion] = useState("");
  const [isImproving, setIsImproving] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [suggestionCount, setSuggestionCount] = useState(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (disabled) return;

    if (!value || value.trim().length < 15) {
      setSuggestion("");
      setIsImproving(false);
      return;
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const timer = setTimeout(async () => {
      setIsImproving(true);
      try {
        const res = await fetch("/api/improve-field", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: value, fieldType }),
          signal: controller.signal,
        });

        if (!res.ok) throw new Error("API request failed");

        const data = await res.json();

        if (data.suggestion) {
          let cleanSuggestion = data.suggestion.trim();
          if (cleanSuggestion.startsWith('"') && cleanSuggestion.endsWith('"')) {
            cleanSuggestion = cleanSuggestion.slice(1, -1).trim();
          }
          if (cleanSuggestion && cleanSuggestion !== value.trim()) {
            setSuggestion(cleanSuggestion);
            setSuggestionCount((n) => n + 1);
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error(err);
        }
      } finally {
        setIsImproving(false);
      }
    }, 750);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, fieldType, disabled]);

  if (disabled) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <BanIcon className="w-3 h-3 shrink-0" />
        <span>AI suggestions disabled for this field.</span>
        <button
          type="button"
          onClick={() => {
            setDisabled(false);
          }}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Re-enable
        </button>
      </div>
    );
  }

  if (suggestionCount >= 2 && !suggestion && !isImproving) {
    return (
      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3 shrink-0" />
        <span>AI suggestions are on.</span>
        <button
          type="button"
          onClick={() => setDisabled(true)}
          className="underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Disable for this field
        </button>
      </div>
    );
  }

  if (!suggestion && !isImproving) return null;

  return (
    <div className="mt-2 text-sm text-foreground p-3 rounded-md bg-primary/5 border border-primary/20 flex flex-col gap-2 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-medium text-primary">
          <Sparkles className="w-4 h-4" />
          {isImproving ? "AI is reviewing your text..." : "AI Suggestion"}
        </div>
        {suggestionCount >= 2 && (
          <button
            type="button"
            onClick={() => {
              controllerRef.current?.abort();
              setIsImproving(false);
              setSuggestion("");
              setDisabled(true);
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Disable for this field
          </button>
        )}
      </div>
      {suggestion && !isImproving && (
        <>
          <p className="italic text-muted-foreground leading-relaxed">"{suggestion}"</p>
          <Button
            size="sm"
            variant="secondary"
            className="w-fit mt-1 h-7 text-xs bg-primary/10 hover:bg-primary/20 text-primary border-none"
            onClick={() => {
              onApply(suggestion);
              setSuggestion("");
            }}
          >
            <Check className="w-3 h-3 mr-1" />
            Apply Suggestion
          </Button>
        </>
      )}
    </div>
  );
}
