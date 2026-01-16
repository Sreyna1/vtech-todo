import { useEffect, useState } from "react";
import { Todo } from "../types/todo";
import { v4 as uuid } from "uuid";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/todo")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const handleSubmit = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    if (!text.trim()) return alert("Todo cannot be empty");

    const duplicate = todos.find((t) => t.todo === text);
    if (duplicate) return alert("Duplicate todo!");

    if (editingId) {
      setTodos(
        todos.map((t) =>
          t.id === editingId ? { ...t, todo: text } : t
        )
      );
      setEditingId(null);
    } else {
      const newTodo: Todo = {
        id: uuid(),
        todo: text,
        isCompleted: false,
        createdAt: Date.now(),
      };

      await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      setTodos([...todos, newTodo]);
    }

    setText("");
  };

  const filteredTodos = todos.filter((t) =>
    t.todo.toLowerCase().includes(text.toLowerCase())
  );

  // ✅ RETURN GOES HERE
  return (
    <main>
      <h1>HOME PAGE LOADED</h1>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleSubmit}
        placeholder="Type todo and press Enter"
      />

      {filteredTodos.length === 0 ? (
        <p>No result. Create a new one instead!</p>
      ) : (
        <ul>
          {filteredTodos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{
                  textDecoration: todo.isCompleted ? "line-through" : "none",
                }}
              >
                {todo.todo}
              </span>

              <button
                    onClick={() => {
                        setEditingId(todo.id);
                        setText(todo.todo);
                    }}
                    >
                    Edit
                    </button>


              <button
                onClick={() =>
                  setTodos(todos.filter((t) => t.id !== todo.id))
                }
              >
                Remove
              </button>

              <button
                onClick={() =>
                  setTodos(
                    todos.map((t) =>
                      t.id === todo.id
                        ? { ...t, isCompleted: !t.isCompleted }
                        : t
                    )
                  )
                }
              >
                {todo.isCompleted ? "Incomplete" : "Complete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
