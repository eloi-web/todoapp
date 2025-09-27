// src/components/TodoItem.jsx
import { useState } from "react";

const priorityChip = {
  low: "bg-zinc-800 text-zinc-300",
  medium: "bg-amber-600/20 text-amber-300",
  high: "bg-green-600/20 text-green-300",
};

export default function TodoItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);

  const overdue =
    !!task.dueDate && !task.completed && task.dueDate < new Date().toISOString().slice(0, 10);

  const saveEdit = () => {
    const next = draft.trim();
    if (next && next !== task.title) {
      onUpdate(task.id, { title: next });
    }
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center justify-between rounded-xl border border-zinc-800 text-zinc-900 bg-zinc-900/60 px-4 py-3 dark:bg-zinc-100 dark:text-zinc-900 transition hover:border-zinc-700">
      {/* Left: checkbox + title */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-5 w-5 cursor-pointer accent-emerald-500"
          aria-label="Toggle completed"
        />

        {isEditing ? (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
            autoFocus
            className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        ) : (
          <div
            className={`text-sm ${task.completed ? "line-through text-zinc-500 dark:text-zinc-500" : "text-zinc-500 dark:text-zinc-500"}`}
            onDoubleClick={() => setIsEditing(true)} // quick inline edit
            title="Double click to edit"
          >
            {task.title}
          </div>
        )}
      </div>

      {/* Right: meta + actions */}
      <div className="flex items-center gap-2">
        {task.dueDate && (
          <span
            className={`rounded-md px-2 py-0.5 text-xs ${
              overdue ? "bg-rose-600/20 text-rose-300" : "bg-zinc-800 text-zinc-300"
            }`}
            title={overdue ? "Overdue" : "Due date"}
          >
            📅 {task.dueDate}
          </span>
        )}

        <span
          className={`rounded-md px-2 py-0.5 text-xs ${priorityChip[task.priority]}`}
          title={`Priority: ${task.priority}`}
        >
          {task.priority}
        </span>

        {task.tags?.length > 0 && (
          <div className="hidden gap-1 sm:flex">
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-900">
                #{tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-900">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          onClick={() => setIsEditing((v) => !v)}
          className="rounded-md px-2 py-1 text-xs text-zinc-300 hover:bg-amber-200"
          title="Edit"
        >
          ✏️
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="rounded-md px-2 py-1 text-xs text-rose-300 hover:bg-rose-600/20"
          title="Delete"
        >
          🗑
        </button>
      </div>
    </div>
  );
}
