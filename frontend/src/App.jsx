import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000") + "/api/tasks/"

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [emailTaskId, setEmailTaskId] = useState(null)
  const [emailTo, setEmailTo] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    axios.get(API_URL).then((response) => {
      setTasks(response.data)
    })
  }

  const addTask = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    axios.post(API_URL, { title: title, description: description, completed: false }).then(() => {
      setTitle("")
      setDescription("")
      fetchTasks()
    })
  }

  const toggleCompleted = (task) => {
    axios.patch(API_URL + task.id + "/", { completed: !task.completed }).then(() => {
      fetchTasks()
    })
  }

  const deleteTask = (id) => {
    axios.delete(API_URL + id + "/").then(() => {
      fetchTasks()
    })
  }

  const sendEmail = (task) => {
    if (!emailTo.includes("@")) return
    const subject = "Task: " + task.title
    const body =
      task.title +
      "\n" +
      (task.description ? task.description + "\n" : "") +
      "\nCreated: " +
      formatDate(task.created_at)
    window.location.href =
      "mailto:" + emailTo.trim() +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body)
    setEmailTaskId(null)
    setEmailTo("")
  }

  const pending = tasks.filter((t) => !t.completed)
  const completed = tasks.filter((t) => t.completed)

  const smallBtn = {
    background: "#eef2ff",
    color: "#4f46e5",
    border: "none",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "pointer",
  }

  const dateStyle = { margin: "6px 0 0", fontSize: "12px", color: "#94a3b8" }

  const renderTask = (task) => (
    <div key={task.id} className={task.completed ? "task-card completed" : "task-card"}>
      <div style={{ flex: 1 }}>
        <div className="task-content" onClick={() => toggleCompleted(task)}>
          <p className="task-title">{task.title}</p>
          {task.description && <p className="task-desc">{task.description}</p>}
          <p style={dateStyle}>Created: {formatDate(task.created_at)}</p>
          {task.completed && task.completed_at && (
            <p style={dateStyle}>Completed: {formatDate(task.completed_at)}</p>
          )}
        </div>

        <div style={{ marginTop: "8px" }}>
          {emailTaskId === task.id ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                placeholder="name@email.com"
                style={{ flex: 1, padding: "6px 8px", border: "1px solid #dbe1ea", borderRadius: "6px", fontSize: "13px" }}
              />
              <button style={smallBtn} onClick={() => sendEmail(task)}>Send</button>
              <button
                style={{ ...smallBtn, background: "#f1f5f9", color: "#64748b" }}
                onClick={() => { setEmailTaskId(null); setEmailTo("") }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button style={smallBtn} onClick={() => setEmailTaskId(task.id)}>Send by email</button>
          )}
        </div>
      </div>
      <button className="delete-btn" title="Delete" onClick={() => deleteTask(task.id)}>x</button>
    </div>
  )

  return (
    // Adicionado estilo para garantir que o rodapé vá para o final da tela
    <div className="app" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <h1>Task Manager</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title..."
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)..."
          rows={2}
        />
        <button type="submit">Add Task</button>
      </form>

      <div className="task-columns">
        <div className="task-column">
          <h2>Pending ({pending.length})</h2>
          {pending.map(renderTask)}
          {pending.length === 0 && <p className="empty">No pending tasks</p>}
        </div>

        <div className="task-column">
          <h2>Completed ({completed.length})</h2>
          {completed.map(renderTask)}
          {completed.length === 0 && <p className="empty">No completed tasks</p>}
        </div>
      </div>

      {/* 👇 AGORA O RODAPÉ ESTÁ DENTRO DO RETURN, NO LUGAR CERTO! 👇 */}
      <footer style={{ 
        marginTop: "auto", 
        padding: "20px", 
        textAlign: "center", 
        fontSize: "11px", 
        color: "#6b7280", 
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc"
      }}>
        <div style={{ textTransform: "uppercase", marginBottom: "4px" }}>
          Powered by getconnect
        </div>
        <div>
          Melvin Fernandes
        </div>
      </footer>

    </div>
  )
}

export default App