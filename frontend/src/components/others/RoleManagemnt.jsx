import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../common/Input';
import Button from '../common/Button';
import Notification from '../common/Notification';
//import { getRoles, addRole, updateRole, deleteRole } from '../services/roleService';

       const RoleManagement = () => {
         const [roles, setRoles] = useState([]);
         const [formData, setFormData] = useState({
           name: '',
           description: '',
         });
         const [editingId, setEditingId] = useState(null);
         const [error, setError] = useState('');
         const [notifications, setNotifications] = useState([]);
         const navigate = useNavigate();

         // Mock user role (replace with auth context)
         const userRole = 'Admin';

         useEffect(() => {
           if (userRole === 'Admin') {
             const fetchRoles = async () => {
               try {
                 const data = await mockGetRoles();
                 setRoles(data);
               } catch (err) {
                 setError('Failed to load roles.');
               }
             };
             fetchRoles();
           } else {
             setError('Unauthorized access.');
             navigate('/dashboard');
           }
         }, [navigate]);

         // Mock data fetching function
         const mockGetRoles = async () => {
           return [
             { id: 1, name: 'Admin', description: 'Full system access' },
             { id: 2, name: 'HR', description: 'Manage employees and licenses' },
             { id: 3, name: 'Shareholder', description: 'View shares and reports' },
           ];
         };

         const handleChange = (e) => {
           const { id, value } = e.target;
           setFormData((prev) => ({ ...prev, [id]: value }));
         };

         const handleSubmit = async (e) => {
           e.preventDefault();
           setError('');

           if (userRole !== 'Admin') {
             setError('You are not authorized to perform this action.');
             return;
           }

           if (!formData.name.trim()) {
             setError('Role name is required.');
             return;
           }
           if (roles.some((role) => role.name.toLowerCase() === formData.name.toLowerCase() && role.id !== editingId)) {
             setError('Role name already exists.');
             return;
           }
           if (!formData.description.trim()) {
             setError('Description is required.');
             return;
           }

           try {
             const newRole = { ...formData };
             if (editingId) {
               // Mock update
               setRoles((prev) =>
                 prev.map((role) => (role.id === editingId ? { ...newRole, id: editingId } : role))
               );
               setNotifications([...notifications, {
                 id: Date.now(),
                 message: `Role "${newRole.name}" updated successfully.`,
                 type: 'success',
               }]);
               setEditingId(null);
             } else {
               // Mock add
               setRoles((prev) => [...prev, { ...newRole, id: prev.length + 1 }]);
               setNotifications([...notifications, {
                 id: Date.now(),
                 message: `Role "${newRole.name}" added successfully.`,
                 type: 'success',
               }]);
             }
             setFormData({ name: '', description: '' });
           } catch (err) {
             setError('An error occurred. Please try again.');
           }
         };

         const handleEdit = (role) => {
           setFormData({
             name: role.name,
             description: role.description,
           });
           setEditingId(role.id);
         };

         const handleDelete = async (id, name) => {
           if (userRole !== 'Admin') {
             setError('You are not authorized to perform this action.');
             return;
           }
           try {
             setRoles((prev) => prev.filter((role) => role.id !== id));
             setNotifications([...notifications, {
               id: Date.now(),
               message: `Role "${name}" deleted successfully.`,
               type: 'success',
             }]);
           } catch (err) {
             setError('Failed to delete role.');
           }
         };

         const handleCancelEdit = () => {
           setFormData({ name: '', description: '' });
           setEditingId(null);
         };

         const closeNotification = (id) => {
           setNotifications((prev) => prev.filter((notif) => notif.id !== id));
         };

         return (
           <div className="min-h-screen bg-gray-100">
             <header className="bg-blue-600 text-white p-4">
               <h1 className="text-2xl font-bold">Role Management</h1>
             </header>
             <main className="p-6">
               <div className="max-w-7xl mx-auto">
                 <h2 className="text-xl font-semibold mb-4">Manage Roles</h2>
                 {notifications.map((notif) => (
                   <Notification
                     key={notif.id}
                     message={notif.message}
                     type={notif.type}
                     onClose={() => closeNotification(notif.id)}
                   />
                 ))}
                 {error && (
                   <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                 )}
                 <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
                   <h3 className="text-lg font-medium mb-4">
                     {editingId ? 'Edit Role' : 'Add New Role'}
                   </h3>
                   <form onSubmit={handleSubmit}>
                     <Input
                       label="Role Name"
                       id="name"
                       type="text"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="Enter role name (e.g., Admin)"
                       required
                     />
                     <Input
                       label="Description"
                       id="description"
                       type="text"
                       value={formData.description}
                       onChange={handleChange}
                       placeholder="Enter role description"
                       required
                     />
                     <div className="flex space-x-4">
                       <Button type="submit">
                         {editingId ? 'Update Role' : 'Add Role'}
                       </Button>
                       {editingId && (
                         <Button
                           type="button"
                           className="bg-gray-600 hover:bg-gray-700"
                           onClick={handleCancelEdit}
                         >
                           Cancel
                         </Button>
                       )}
                     </div>
                   </form>
                 </div>
                 <div className="bg-white p-6 rounded-lg shadow-md">
                   <h3 className="text-lg font-medium mb-4">Roles</h3>
                   {roles.length === 0 ? (
                     <p className="text-gray-600">No roles found.</p>
                   ) : (
                     <table className="w-full border-collapse">
                       <thead>
                         <tr className="bg-gray-200">
                           <th className="border p-2 text-left">Role Name</th>
                           <th className="border p-2 text-left">Description</th>
                           <th className="border p-2 text-left">Actions</th>
                         </tr>
                       </thead>
                       <tbody>
                         {roles.map((role) => (
                           <tr key={role.id} className="hover:bg-gray-50">
                             <td className="border p-2">{role.name}</td>
                             <td className="border p-2">{role.description}</td>
                             <td className="border p-2">
                               <button
                                 className="text-blue-600 hover:underline mr-2"
                                 onClick={() => handleEdit(role)}
                               >
                                 Edit
                               </button>
                               <button
                                 className="text-red-600 hover:underline"
                                 onClick={() => handleDelete(role.id, role.name)}
                               >
                                 Delete
                               </button>
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   )}
                 </div>
                 <p className="text-gray-600 text-sm text-center mt-4">
                   Return to{' '}
                   <a
                     href="/admin/dashboard"
                     className="text-blue-600 hover:underline"
                   >
                     Dashboard
                   </a>
                 </p>
               </div>
             </main>
           </div>
         );
       };

       export default RoleManagement;