
export const fetchTasks = async () => {
  const res = await fetch('/api/tasks');
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const fetchUsers = async () => {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
};

export const saveTask = async (task) => {
  const method = task.id === null ? 'POST' : 'PUT';
  const url = task.id === null ? '/api/tasks' : `/api/tasks/${task.id}`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...task,
      userId: task.userId === '' ? null : Number(task.userId),
    }),
  });
  if (!res.ok) throw new Error('Failed to save task');
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
};