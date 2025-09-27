// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";

// A tiny helper. In real apps you'd use uuid(), but for local apps Date.now() is fine.
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const LS_KEY = "todoapp:v1:tasks";
const LS_THEME_KEY = "todoapp:v1:theme";

export default function App() {
  // ----------------------------
  // App-level state
  // ----------------------------
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");           // search by title/tag
  const [filter, setFilter] = useState("all");      // all | active | completed | overdue | today
  const [sortBy, setSortBy] = useState("created");  // created | due | priority
  const [theme, setTheme] = useState("dark");       // dark | light (default dark per your design)

  // ----------------------------
  // LocalStorage: load on mount
  // ----------------------------
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
      setTasks(Array.isArray(saved) ? saved : []);
    } catch {
      setTasks([]);
    }
    const savedTheme = localStorage.getItem(LS_THEME_KEY);
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);

  // ----------------------------
  // LocalStorage: persist on change
  // ----------------------------
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(LS_THEME_KEY, theme);
    // Apply theme at the root (best DX with Tailwind)
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  // ----------------------------
  // CRUD
  // ----------------------------
  const addTask = (partial) => {
    // partial = { title, dueDate (string|""), priority, tags (array) }
    const newTask = {
      id: genId(),
      title: partial.title.trim(),
      completed: false,
      priority: partial.priority,        // "low" | "medium" | "high"
      dueDate: partial.dueDate || "",    // ISO string or ""
      tags: partial.tags || [],          // array of strings
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // ----------------------------
  // Derived lists: filter + search + sort
  // ----------------------------
  const todayISO = new Date().toISOString().slice(0, 10); // yyyy-mm-dd

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const isOverdue = (t) =>
      !!t.dueDate && !t.completed && t.dueDate < todayISO;

    const isToday = (t) => !!t.dueDate && t.dueDate === todayISO;

    let out = tasks.filter((t) => {
      // filter by status
      if (filter === "active" && t.completed) return false;
      if (filter === "completed" && !t.completed) return false;
      if (filter === "overdue" && !isOverdue(t)) return false;
      if (filter === "today" && !isToday(t)) return false;

      // search in title or tags
      if (!q) return true;
      const inTitle = t.title.toLowerCase().includes(q);
      const inTags = t.tags.some((tag) => tag.toLowerCase().includes(q));
      return inTitle || inTags;
    });

    // sort
    out.sort((a, b) => {
      if (sortBy === "created") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "due") {
        // Empty due dates go to the end
        return (a.dueDate || "9999-12-31") > (b.dueDate || "9999-12-31") ? 1 : -1;
      }
      if (sortBy === "priority") {
        const rank = { high: 0, medium: 1, low: 2 };
        return rank[a.priority] - rank[b.priority];
      }
      return 0;
    });

    return out;
  }, [tasks, filter, query, sortBy, todayISO]);

  // ----------------------------
  // UI helpers
  // ----------------------------
  const remaining = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 transition-colors dark:bg-zinc-900 dark:text-zinc-100 bg-white text-zinc-900">
      {/* App container */}
      <div className="mx-auto max-w-3xl px-4 py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Tasks</h1>
            <p className="text-sm text-zinc-400">{remaining} remaining</p>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-800 hover:text-white transition"
            aria-label="Toggle dark mode"
          >
            {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
          </button>
        </header>

        {/* Controls */}
        <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or tag…"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="today">Due Today</option>
            <option value="overdue">Overdue</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-zinc-900 dark:text-white"
          >
            <option value="created">Sort: Created</option>
            <option value="due">Sort: Due date</option>
            <option value="priority">Sort: Priority</option>
          </select>
        </section>

        {/* Input */}
        <TodoInput onAdd={addTask} />

        {/* List */}
        <TodoList
          tasks={filtered}
          onToggle={toggleTask}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />

        {/* Footer tip */}
        <p className="mt-8 text-xs text-zinc-500">
          Pro tip: press <kbd className="rounded bg-zinc-800 px-1">Enter</kbd> to add,
          use <span className="font-medium">#tags</span> and <span className="font-medium">@due:2025-12-31</span> in the title. (Feature idea to add later!)
        </p>
      </div>
    </div>
  );
}
