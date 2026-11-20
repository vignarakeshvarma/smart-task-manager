import { useCallback, useEffect, useMemo, useState } from 'react';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tasks`;

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('search', search.trim());
      if (filter !== 'all') params.set('status', filter);
      const response = await fetch(`${API}?${params.toString()}`);
      if (!response.ok) throw new Error('Unable to load tasks');
      setTasks(await response.json());
      setMessage('');
    } catch (error) {
      setMessage(`${error.message}. Check that the backend and MySQL are running.`);
    } finally {
      setLoading(false);
    }
  }, [search, filter]);

  useEffect(() => { loadTasks(); }, [loadTasks]);

  const counts = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length
  }), [tasks]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!title.trim()) return;
    const payload = { title, description, status: 'pending' };

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed');
      setTitle('');
      setDescription('');
      setEditingId(null);
      setMessage(editingId ? 'Task updated.' : 'Task added.');
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function startEdit(task) {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`${API}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: task.title,
          description: task.description || '',
          status: task.status === 'completed' ? 'pending' : 'completed'
        })
      });
      if (!response.ok) throw new Error('Could not update task');
      await loadTasks();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function deleteTask(id) {
    if (!window.confirm('Delete this task?')) return;
    try {
      const response = await fetch(`${API}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Could not delete task');
      await loadTasks();
      setMessage('Task deleted.');
    } catch (error) {
      setMessage(error.message);
    }
  }

  function cancelEdit() {
    setEditingId(null);
    setTitle('');
    setDescription('');
  }

  return (
    <main className="app-shell">
      <div className="container py-5">
        <header className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <p className="eyebrow mb-1">PLAN SMARTER · GET MORE DONE</p>
            <h1 className="fw-bold mb-1">Smart Task Manager</h1>
            <p className="text-secondary mb-0">Your day, organized in one place.</p>
          </div>
          <span className="badge rounded-pill text-bg-light border px-3 py-2">Full Stack Project</span>
        </header>

        <section className="row g-3 mb-4">
          <Stat label="Visible tasks" value={counts.total} />
          <Stat label="Pending" value={counts.pending} />
          <Stat label="Completed" value={counts.completed} />
        </section>

        <section className="card border-0 shadow-sm p-3 p-md-4 mb-4">
          <h2 className="h5 fw-bold mb-3">{editingId ? 'Edit task' : 'Add a new task'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-5">
                <label className="form-label">Task title</label>
                <input className="form-control" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Prepare for coding assessment" maxLength="150" required />
              </div>
              <div className="col-md-5">
                <label className="form-label">Description</label>
                <input className="form-control" value={description} onChange={e => setDescription(e.target.value)}
                  placeholder="Add a short note (optional)" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-primary w-100" type="submit">
                  {editingId ? 'Save changes' : 'Add task'}
                </button>
              </div>
            </div>
            {editingId && <button type="button" className="btn btn-link px-0 mt-2" onClick={cancelEdit}>Cancel edit</button>}
          </form>
        </section>

        <section className="card border-0 shadow-sm p-3 p-md-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <h2 className="h5 fw-bold mb-0">Your tasks</h2>
            <div className="d-flex flex-wrap gap-2">
              <input className="form-control search-box" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..." />
              <select className="form-select filter-box" value={filter} onChange={e => setFilter(e.target.value)}>
                <option value="all">All tasks</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {message && <div className="alert alert-info py-2" role="status">{message}</div>}
          {loading ? <p className="text-secondary">Loading tasks...</p> :
            tasks.length === 0 ? <div className="empty-state">No tasks found. Add your first task above.</div> :
            <div className="list-group list-group-flush">
              {tasks.map(task => (
                <div className="list-group-item task-row px-0 py-3" key={task.id}>
                  <div className="d-flex align-items-start gap-3">
                    <input className="form-check-input mt-1" type="checkbox" checked={task.status === 'completed'}
                      onChange={() => toggleTask(task)} aria-label={`Mark ${task.title} complete`} />
                    <div className="flex-grow-1 min-w-0">
                      <div className={`task-title ${task.status === 'completed' ? 'done' : ''}`}>{task.title}</div>
                      {task.description && <p className="text-secondary small mb-1">{task.description}</p>}
                      <span className={`badge ${task.status === 'completed' ? 'text-bg-success' : 'text-bg-warning'}`}>
                        {task.status}
                      </span>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(task)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => deleteTask(task.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </section>
        <footer className="text-center text-secondary small mt-4">Built with React · Express · Node.js · MySQL</footer>
      </div>
    </main>
  );
}

function Stat({ label, value }) {
  return <div className="col-md-4"><div className="stat-card h-100">
    <div className="text-secondary small">{label}</div><div className="display-6 fw-bold">{value}</div>
  </div></div>;
}
