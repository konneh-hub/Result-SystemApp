import React, { useState, useEffect } from 'react';
import { Box, Button, Dialog, TextField, CircularProgress } from '@mui/material';
import { userApi } from '../../api/userApi';
import DataTable from '../../components/tables/DataTable';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', firstName: '', lastName: '', role: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAll();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ email: '', firstName: '', lastName: '', role: '' });
    setOpenDialog(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData(user);
    setOpenDialog(true);
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await userApi.update(editingUser.id, formData);
      } else {
        await userApi.create(formData);
      }
      setOpenDialog(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.delete(userId);
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'role', label: 'Role' },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <h2>Users Management</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
        >
          Add User
        </Button>
      </Box>

      <DataTable
        columns={columns}
        rows={users}
        loading={loading}
        pagination={true}
        search={true}
        export={true}
        actions={(row) => [
          <Button
            key="edit"
            size="small"
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => handleEditUser(row)}
          >
            Edit
          </Button>,
          <Button
            key="delete"
            size="small"
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDeleteUser(row.id)}
          >
            Delete
          </Button>,
        ]}
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <TextField
            fullWidth
            label="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="First Name"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Last Name"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            <option value="admin">Admin</option>
            <option value="lecturer">Lecturer</option>
            <option value="hod">HOD</option>
            <option value="dean">Dean</option>
            <option value="exam_officer">Exam Officer</option>
            <option value="student">Student</option>
          </TextField>
          <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleSaveUser}>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
};

export default UsersManagement;
