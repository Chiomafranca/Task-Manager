import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl,
  InputLabel, Button, Card, CardContent, CardActions,
  Grid, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { fetchTasks, fetchUsers, saveTask, deleteTask } from '../../api/taskApi';

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ status: '', priority: '', userId: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks()
      .then((data) => setTasks(data.tasks))
      .catch(() => alert('Error loading tasks'));

    fetchUsers()
      .then((data) => setUsers(data.users))
      .catch(() => alert('Error loading users'));
  }, []);

  const filteredTasks = tasks.filter((task) => (
    (filters.status === '' || task.status === filters.status) &&
    (filters.priority === '' || task.priority === filters.priority) &&
    (filters.userId === '' || task.userId === Number(filters.userId))
  ));

  const handleFilterChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDialogChange = (field) => (e) => {
    setEditingTask((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleDialogSave = () => {
    if (!editingTask.title.trim()) return alert('Title is required');
    saveTask(editingTask)
      .then((res) => {
        const saved = res.task;
        setTasks((prev) => {
          if (editingTask.id === null) return [...prev, saved];
          return prev.map((t) => (t.id === saved.id ? saved : t));
        });
        setDialogOpen(false);
        setEditingTask(null);
      })
      .catch(() => alert('Error saving task'));
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1200,
        mx: 'auto',
        pt: 2,
        px: 2,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
     
      <Box
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="center"
        gap={2}
        width="100%"
        mb={2}
      >
        <Box display="flex" alignItems="center" gap={1} sx={{ minWidth: 150 }}>
          <AssignmentTurnedInIcon />
          <Typography variant="h6" fontWeight="bold">
            Task Manager
          </Typography>
        </Box>

        {['status', 'priority', 'userId'].map((field) => (
          <FormControl key={field} sx={{ minWidth: 150 }} size="small">
            <InputLabel>{field.charAt(0).toUpperCase() + field.slice(1)}</InputLabel>
            <Select
              value={filters[field]}
              onChange={handleFilterChange(field)}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
            >
              <MenuItem value="">All</MenuItem>
              {field === 'status' && ['todo', 'in-progress', 'done'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              {field === 'priority' && ['high', 'medium', 'low'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
              {field === 'userId' && users.map((user) => <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>)}
            </Select>
          </FormControl>
        ))}

        <Button
          variant="contained"
          onClick={() => {
            setEditingTask({ id: null, title: '', description: '', status: 'todo', priority: 'medium', userId: '' });
            setDialogOpen(true);
          }}
          sx={{ height: 40 }}
        >
          Add Task
        </Button>
      </Box>

      {/* Task Grid */}
      <Grid container spacing={2} justifyContent="center">
        {filteredTasks.map((task) => (
          <Grid item xs={12} sm={6} md={4} key={task.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography color="text.secondary">{task.description}</Typography>
                <Typography>Status: {task.status}</Typography>
                <Typography>Priority: {task.priority}</Typography>
                <Typography>
                  Assigned to: {users.find((u) => u.id === task.userId)?.name || 'Unassigned'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => {
                  setEditingTask(task);
                  setDialogOpen(true);
                }}>Edit</Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    deleteTask(task.id)
                      .then(() => setTasks((prev) => prev.filter((t) => t.id !== task.id)))
                      .catch(() => alert('Error deleting task'));
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredTasks.length === 0 && (
          <Typography sx={{ mx: 'auto', mt: 4 }}>No tasks match the filters.</Typography>
        )}
      </Grid>

      
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingTask?.id ? 'Edit Task' : 'Add Task'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Title"
            fullWidth
            margin="dense"
            value={editingTask?.title || ''}
            onChange={handleDialogChange('title')}
          />
          <TextField
            label="Description"
            fullWidth
            margin="dense"
            multiline
            minRows={3}
            value={editingTask?.description || ''}
            onChange={handleDialogChange('description')}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select value={editingTask?.status || 'todo'} onChange={handleDialogChange('status')}>
              <MenuItem value="todo">To Do</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select value={editingTask?.priority || 'medium'} onChange={handleDialogChange('priority')}>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>User</InputLabel>
            <Select value={editingTask?.userId || ''} onChange={handleDialogChange('userId')}>
              <MenuItem value="">Unassigned</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleDialogSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
