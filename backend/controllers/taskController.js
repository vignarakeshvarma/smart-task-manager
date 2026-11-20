const db = require('../config/db');

exports.getTasks = async (req, res) => {
  try {
    const { search = '', status = '' } = req.query;
    let sql = 'SELECT * FROM tasks WHERE title LIKE ?';
    const params = [`%${search}%`];

    if (status === 'pending' || status === 'completed') {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC';
    const [rows] = await db.execute(sql, params);
    res.json(rows);
  } catch (error) {
    console.error('getTasks:', error.message);
    res.status(500).json({ message: 'Could not fetch tasks.' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description = '' } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }

    const [result] = await db.execute(
      'INSERT INTO tasks (title, description) VALUES (?, ?)',
      [title.trim(), description.trim()]
    );

    const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('createTask:', error.message);
    res.status(500).json({ message: 'Could not create task.' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description = '', status } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: 'Task title is required.' });
    }
    if (!['pending', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Status must be pending or completed.' });
    }

    const [result] = await db.execute(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ?',
      [title.trim(), description.trim(), status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error('updateTask:', error.message);
    res.status(500).json({ message: 'Could not update task.' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('deleteTask:', error.message);
    res.status(500).json({ message: 'Could not delete task.' });
  }
};
