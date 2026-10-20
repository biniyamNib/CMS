// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Modal, Form, Input, Select, Checkbox, Button, Alert } from 'antd';
// import { updateUser, clearError } from '../slices/userSlice';
// import { fetchRoles } from '../slices/roleSlice';

// const { Option } = Select;

// function EditUser({ open, onClose, user, onUpdateUser }) {
//   const dispatch = useDispatch();
//   const { error, loading } = useSelector((state) => state.users);
//   const { roles } = useSelector((state) => state.roles);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (open && user) {
//       form.setFieldsValue({
//         username: user.username || '',
//         email: user.email || '',
//         RoleId: user.RoleId || '',
//         status: user.status || 'Active',
//         enable2FA: !!user.twoFactorSecret,
//       });
//       dispatch(fetchRoles());
//       dispatch(clearError());
//     }
//   }, [open, user, dispatch, form]);

//   const onFinish = async (values) => {
//     try {
//       const updatedUser = {
//         username: values.username,
//         email: values.email,
//         RoleId: values.RoleId,
//         status: values.status,
//         enable2FA: values.enable2FA,
//       };
//       await dispatch(updateUser({ id: user.userId, userData: updatedUser })).unwrap();
//       onUpdateUser(updatedUser);
//       onClose();
//     } catch (err) {
//       form.setFields([
//         {
//           name: 'email',
//           errors: err === 'Email already exists' ? ['Email already exists'] : [],
//         },
//       ]);
//     }
//   };

//   return (
//     <Modal
//       title="Edit User"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       style={{ borderRadius: '8px' }}
//     >
//       {error && (
//         <Alert
//           message={error}
//           type="error"
//           showIcon
//           style={{ marginBottom: '16px' }}
//           closable
//           onClose={() => dispatch(clearError())}
//         />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{
//           username: '',
//           email: '',
//           RoleId: '',
//           status: 'Active',
//           enable2FA: false,
//         }}
//       >
//         <Form.Item
//           name="username"
//           label="Username"
//           rules={[{ required: true, message: 'Please enter username' }]}
//         >
//           <Input placeholder="Enter username" />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label="Email"
//           rules={[
//             { required: true, message: 'Please enter email' },
//             { type: 'email', message: 'Invalid email format' },
//           ]}
//         >
//           <Input placeholder="Enter email" />
//         </Form.Item>
//         <Form.Item
//           name="RoleId"
//           label="Role"
//           rules={[{ required: true, message: 'Please select a role' }]}
//         >
//           <Select placeholder="Select Role">
//             <Option value="">Select Role</Option>
//             {roles.map((role) => (
//               <Option key={role.RoleId} value={role.RoleId}>
//                 {role.RoleName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="status"
//           label="Status"
//           rules={[{ required: true, message: 'Please select status' }]}
//         >
//           <Select>
//             <Option value="Active">Active</Option>
//             <Option value="Inactive">Inactive</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item name="enable2FA" valuePropName="checked">
//           <Checkbox>Enable Two-Factor Authentication</Checkbox>
//         </Form.Item>
//         <div style={{ textAlign: 'right' }}>
//           <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Update User
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// }

// export default EditUser;









// Updated

// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Modal, Form, Input, Select, Checkbox, Button, Alert } from 'antd';
// import { updateUser, clearError } from '../slices/userSlice';
// import { fetchRoles } from '../slices/roleSlice';
// import { fetchCompanies } from '../slices/companySlice';

// const { Option } = Select;

// function EditUser({ open, onClose, user, onUpdateUser }) {
//   const dispatch = useDispatch();
//   const { error, loading } = useSelector((state) => state.users);
//   const { roles } = useSelector((state) => state.roles);
//   const { companies } = useSelector((state) => state.companies);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     if (open && user) {
//       console.log('EditUser user:', user);
//       form.setFieldsValue({
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         username: user.username || '',
//         email: user.email || '',
//         RoleId: user.RoleId || undefined,
//         status: user.status || 'Active',
//         enable2FA: !!user.twoFactorSecret,
//         companies: typeof user.companies === 'string' ? user.companies.split(', ').filter(Boolean).map(name => {
//           const company = companies.find(c => c.CompanyName === name);
//           return company ? company.CompanyId : null;
//         }).filter(Boolean) : [],
//       });
//       dispatch(fetchRoles());
//       dispatch(fetchCompanies());
//       dispatch(clearError());
//     }
//   }, [open, user, dispatch, form, companies]);

//   const onFinish = async (values) => {
//     try {
//       const updatedUser = {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         username: values.username,
//         email: values.email,
//         RoleId: values.RoleId || null, // Allow null if no role selected
//         status: values.status,
//         enable2FA: values.enable2FA,
//         companies: values.companies || [],
//       };
//       await dispatch(updateUser({ id: user.userId, userData: updatedUser })).unwrap();
//       onUpdateUser(updatedUser);
//       onClose();
//     } catch (err) {
//       form.setFields([
//         {
//           name: 'email',
//           errors: err === 'Email already exists' ? ['Email already exists'] : [],
//         },
//       ]);
//     }
//   };

//   return (
//     <Modal
//       title="Edit User"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       style={{ borderRadius: '8px' }}
//     >
//       {error && (
//         <Alert
//           message={error}
//           type="error"
//           showIcon
//           style={{ marginBottom: '16px' }}
//           closable
//           onClose={() => dispatch(clearError())}
//         />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{
//           firstName: '',
//           lastName: '',
//           username: '',
//           email: '',
//           RoleId: undefined,
//           status: 'Active',
//           enable2FA: false,
//           companies: [],
//         }}
//       >
//         <Form.Item
//           name="firstName"
//           label="First Name"
//           rules={[{ required: true, message: 'Please enter first name' }]}
//         >
//           <Input placeholder="Enter first name" />
//         </Form.Item>
//         <Form.Item
//           name="lastName"
//           label="Last Name"
//           rules={[{ required: true, message: 'Please enter last name' }]}
//         >
//           <Input placeholder="Enter last name" />
//         </Form.Item>
//         <Form.Item
//           name="username"
//           label="Username"
//           rules={[{ required: true, message: 'Please enter username' }]}
//         >
//           <Input placeholder="Enter username" />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label="Email"
//           rules={[
//             { required: true, message: 'Please enter email' },
//             { type: 'email', message: 'Invalid email format' },
//           ]}
//         >
//           <Input placeholder="Enter email" />
//         </Form.Item>
//         <Form.Item
//           name="RoleId"
//           label="Role"
//           rules={[{ required: true, message: 'Please select a role' }]}
//         >
//           <Select placeholder="Select Role" allowClear>
//             {roles.map((role) => (
//               <Option key={role.RoleId} value={role.RoleId}>
//                 {role.RoleName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="status"
//           label="Status"
//           rules={[{ required: true, message: 'Please select status' }]}
//         >
//           <Select>
//             <Option value="Active">Active</Option>
//             <Option value="Inactive">Inactive</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="companies"
//           label="Assigned Companies"
//           rules={[{ required: false }]}
//         >
//           <Select mode="multiple" placeholder="Select companies" allowClear>
//             {companies.map((company) => (
//               <Option key={company.CompanyId} value={company.CompanyId}>
//                 {company.CompanyName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item name="enable2FA" valuePropName="checked">
//           <Checkbox>Enable Two-Factor Authentication</Checkbox>
//         </Form.Item>
//         <div style={{ textAlign: 'right' }}>
//           <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Update User
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// }

// export default EditUser;





// Latest

// import React, { useEffect, useRef } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { Modal, Form, Input, Select, Checkbox, Button, Alert } from 'antd';
// import { updateUser, clearError } from '../slices/userSlice';
// import { fetchRoles } from '../slices/roleSlice';
// import { fetchCompanies } from '../slices/companySlice';

// const { Option } = Select;

// function EditUser({ open, onClose, user, onUpdateUser }) {
//   const dispatch = useDispatch();
//   const { error, loading } = useSelector((state) => state.users);
//   const { roles } = useSelector((state) => state.roles);
//   const { companies } = useSelector((state) => state.companies);
//   const [form] = Form.useForm();
//   const isInitialMount = useRef(true); // Prevent useEffect from resetting form after initial mount

//   useEffect(() => {
//     if (open && user && isInitialMount.current) {
//       console.log('EditUser user prop:', user); // Debug: Log user prop
//       const companyIds = typeof user.companies === 'string' && user.companies !== 'None'
//         ? user.companies
//             .split(', ')
//             .filter(Boolean)
//             .map(name => {
//               const company = companies.find(c => c.CompanyName === name);
//               return company ? company.CompanyId : null;
//             })
//             .filter(Boolean)
//         : [];

//       form.setFieldsValue({
//         firstName: user.firstName || '',
//         lastName: user.lastName || '',
//         username: user.username || '',
//         email: user.email || '',
//         RoleId: user.RoleId || undefined,
//         status: user.status || 'Active',
//         enable2FA: !!user.twoFactorSecret,
//         companies: companyIds,
//       });

//       dispatch(fetchRoles());
//       dispatch(fetchCompanies());
//       dispatch(clearError());
//       isInitialMount.current = false; // Mark initial mount as complete
//     }

//     // Reset form and ref when modal closes
//     return () => {
//       if (!open) {
//         form.resetFields();
//         isInitialMount.current = true;
//       }
//     };
//   }, [open, user, dispatch, form, companies]);

//   const onFinish = async (values) => {
//     try {
//       console.log('Form values submitted:', values); // Debug: Log form values
//       const updatedUser = {
//         firstName: values.firstName,
//         lastName: values.lastName,
//         username: values.username,
//         email: values.email,
//         RoleId: values.RoleId || null,
//         status: values.status,
//         enable2FA: values.enable2FA,
//         companies: values.companies || [],
//       };
//       const result = await dispatch(updateUser({ id: user.userId, userData: updatedUser })).unwrap();
//       console.log('Update user result:', result); // Debug: Log API response
//       onUpdateUser(result.user); // Pass updated user to parent
//       onClose();
//     } catch (err) {
//       console.error('Update user error:', err); // Debug: Log error
//       form.setFields([
//         {
//           name: 'email',
//           errors: err.message === 'Email already exists' ? ['Email already exists'] : [err.message || 'Failed to update user'],
//         },
//       ]);
//     }
//   };

//   return (
//     <Modal
//       title="Edit User"
//       open={open}
//       onCancel={onClose}
//       footer={null}
//       style={{ borderRadius: '8px' }}
//     >
//       {error && (
//         <Alert
//           message={error}
//           type="error"
//           showIcon
//           style={{ marginBottom: '16px' }}
//           closable
//           onClose={() => dispatch(clearError())}
//         />
//       )}
//       <Form
//         form={form}
//         layout="vertical"
//         onFinish={onFinish}
//         initialValues={{
//           firstName: '',
//           lastName: '',
//           username: '',
//           email: '',
//           RoleId: undefined,
//           status: 'Active',
//           enable2FA: false,
//           companies: [],
//         }}
//       >
//         <Form.Item
//           name="firstName"
//           label="First Name"
//           rules={[{ required: true, message: 'Please enter first name' }]}
//         >
//           <Input placeholder="Enter first name" />
//         </Form.Item>
//         <Form.Item
//           name="lastName"
//           label="Last Name"
//           rules={[{ required: true, message: 'Please enter last name' }]}
//         >
//           <Input placeholder="Enter last name" />
//         </Form.Item>
//         <Form.Item
//           name="username"
//           label="Username"
//           rules={[{ required: true, message: 'Please enter username' }]}
//         >
//           <Input placeholder="Enter username" />
//         </Form.Item>
//         <Form.Item
//           name="email"
//           label="Email"
//           rules={[
//             { required: true, message: 'Please enter email' },
//             { type: 'email', message: 'Invalid email format' },
//           ]}
//         >
//           <Input placeholder="Enter email" />
//         </Form.Item>
//         <Form.Item
//           name="RoleId"
//           label="Role"
//           rules={[{ required: true, message: 'Please select a role' }]}
//         >
//           <Select placeholder="Select Role" allowClear>
//             {roles.map((role) => (
//               <Option key={role.RoleId} value={role.RoleId}>
//                 {role.RoleName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="status"
//           label="Status"
//           rules={[{ required: true, message: 'Please select status' }]}
//         >
//           <Select>
//             <Option value="Active">Active</Option>
//             <Option value="Inactive">Inactive</Option>
//           </Select>
//         </Form.Item>
//         <Form.Item
//           name="companies"
//           label="Assigned Companies"
//           rules={[{ required: false }]}
//         >
//           <Select mode="multiple" placeholder="Select companies" allowClear>
//             {companies.map((company) => (
//               <Option key={company.CompanyId} value={company.CompanyId}>
//                 {company.CompanyName}
//               </Option>
//             ))}
//           </Select>
//         </Form.Item>
//         <Form.Item name="enable2FA" valuePropName="checked">
//           <Checkbox>Enable Two-Factor Authentication</Checkbox>
//         </Form.Item>
//         <div style={{ textAlign: 'right' }}>
//           <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Update User
//           </Button>
//         </div>
//       </Form>
//     </Modal>
//   );
// }

// export default EditUser;


// Very Latest


import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Form, Input, Select, Checkbox, Button, Alert } from 'antd';
import { updateUser, clearError } from '../slices/userSlice';
import { fetchRoles } from '../slices/roleSlice';
import { fetchCompanies } from '../slices/companySlice';

const { Option } = Select;

function EditUser({ open, onClose, user, onUpdateUser }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.users);
  const { roles } = useSelector((state) => state.roles);
  const { companies } = useSelector((state) => state.companies);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [form] = Form.useForm();
  const isSuperAdmin = currentUser?.primaryRole === 'SuperAdmin' || currentUser?.roles?.includes('SuperAdmin');

  useEffect(() => {
    if (open && user) {
      form.setFieldsValue({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        RoleId: user.RoleId || '',
        status: user.status || 'Active',
        enable2FA: !!user.twoFactorSecret,
        companies: isSuperAdmin ? (user.companies?.split(', ') || []) : undefined,
      });
      dispatch(fetchRoles());
      if (isSuperAdmin) dispatch(fetchCompanies());
      dispatch(clearError());
    }
  }, [open, user, dispatch, form, isSuperAdmin]);

  const onFinish = async (values) => {
    try {
      const updatedUser = {
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        email: values.email,
        RoleId: values.RoleId,
        status: values.status,
        enable2FA: values.enable2FA,
        companies: isSuperAdmin ? values.companies : undefined,
      };
      await dispatch(updateUser({ id: user.userId, userData: updatedUser })).unwrap();
      onUpdateUser(updatedUser);
      onClose();
    } catch (err) {
      form.setFields([
        {
          name: 'email',
          errors: err === 'Email already exists' ? ['Email already exists'] : [],
        },
      ]);
    }
  };

  return (
    <Modal
      title="Edit User"
      open={open}
      onCancel={onClose}
      footer={null}
      style={{ borderRadius: '8px' }}
    >
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
          closable
          onClose={() => dispatch(clearError())}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          firstName: '',
          lastName: '',
          username: '',
          email: '',
          RoleId: '',
          status: 'Active',
          enable2FA: false,
          companies: [],
        }}
      >
        <Form.Item
          name="firstName"
          label="First Name"
          rules={[{ required: true, message: 'Please enter first name' }]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Last Name"
          rules={[{ required: true, message: 'Please enter last name' }]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please enter username' }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Invalid email format' },
          ]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>
        <Form.Item
          name="RoleId"
          label="Role"
          rules={[{ required: true, message: 'Please select a role' }]}
        >
          <Select placeholder="Select Role" allowClear>
            {roles.map((role) => (
              <Option key={role.RoleId} value={role.RoleId}>
                {role.RoleName}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </Form.Item>
        {isSuperAdmin && (
          <Form.Item
            name="companies"
            label="Assigned Companies"
            rules={[{ required: false }]}
          >
            <Select mode="multiple" placeholder="Select companies" allowClear>
              {companies.map((company) => (
                <Option key={company.CompanyId} value={company.CompanyId}>
                  {company.CompanyName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="enable2FA" valuePropName="checked">
          <Checkbox>Enable Two-Factor Authentication</Checkbox>
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }} disabled={loading}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update User
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default EditUser;