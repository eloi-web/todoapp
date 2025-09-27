// src/components/TodoInput.jsx
import { useState } from "react";

/**
 * This component focuses on *input UX* and validation.
 * It keeps its own form state, then emits a well-formed task to App via onAdd().
 */
export default function TodoInput({ onAdd }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");      // yyyy-mm-dd
  const [priority, setPriority] = useState("medium");
  const [tagsRaw, setTagsRaw] = useState("");      // comma-separated

  const canSubmit = title.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onAdd({ title, dueDate, priority, tags });

    // reset
    setTitle("");
    setDueDate("");
    setPriority("medium");
    setTagsRaw("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-5"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        className="col-span-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
      />

      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
        aria-label="Due date"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
        aria-label="Priority"
      >
        <option value="low">Low ⬇</option>
        <option value="medium">Medium ⏺</option>
        <option value="high">High ⬆</option>
      </select>

      <input
        value={tagsRaw}
        onChange={(e) => setTagsRaw(e.target.value)}
        placeholder="tags (comma, separated)"
        className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
      />

      <button
        type="submit"
        disabled={!canSubmit}
        className="sm:col-span-5 mt-1 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Add Task
      </button>
    </form>
  );
}
