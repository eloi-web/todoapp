// src/components/TodoList.jsx
import TodoItem from "./TodoItem";

/**
 * Presentational component: render list & empty state.
 * Keeps logic out of here; receives everything via props.
 */
export default function TodoList({ tasks, onToggle, onUpdate, onDelete }) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 p-8 text-center text-zinc-400">
        Nothing here yet. Add your first task(todo) above ✨
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((t) => (
        <TodoItem
          key={t.id}
          task={t}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
