import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Select,
  Table,
  Tag,
  Button,
  message,
  Spin,
  Space,
} from "antd";
import {
  UserAddOutlined,
  UserDeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import {
  assignUserToOrgStructure,
  fetchOrgStructures,
} from "../slices/orgStructureSlice";
import { fetchUsers } from "../slices/userSlice";
import { fetchRoles } from "../slices/roleSlice";

const { Option } = Select;

const UserAssignmentModal = ({
  visible,
  onCancel,
  orgStructureId,
  companyId,
  existingUsers = [],
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  // const { token } = useSelector(state => state.auth);
  const { users: allCompanyUsers, loading: usersLoading } = useSelector(
    (state) => state.users
  );
  const { roles: allRoles, loading: rolesLoading } = useSelector(
    (state) => state.roles
  );
  const [loading, setLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState([]);

  useEffect(() => {
    if (visible) {
      // Load necessary data when modal becomes visible
      dispatch(fetchUsers());
      dispatch(fetchRoles());

      // Initialize with existing users if provided
      if (existingUsers.length > 0) {
        setAssignedUsers(existingUsers);
      }
    }
  }, [visible, dispatch, existingUsers]);

  const handleAssignUser = async (values) => {
    try {
      setLoading(true);

      await dispatch(
        assignUserToOrgStructure({
          orgStructureId,
          userId: values.userId,
          roleId: values.roleId,
          companyId,
        })
      ).unwrap();

      // Refresh the org structure data
      dispatch(fetchOrgStructures({ companyId }));

      // Update local state
      const newUser = allCompanyUsers.find((u) => u.userId === values.userId);
      const newRole = allRoles.find((r) => r.RoleId === values.roleId);

      if (newUser && newRole) {
        setAssignedUsers((prev) => [
          ...prev,
          {
            UserId: newUser.userId,
            Username: newUser.username,
            Role: newRole.RoleName,
            RoleId: newRole.RoleId,
          },
        ]);
      }

      message.success("User assigned successfully");
      form.resetFields();
    } catch (error) {
      message.error(`Failed to assign user: ${error}`);
      console.error("Assign user error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    Modal.confirm({
      title: "Remove user from this unit?",
      content: "This will revoke their access to resources in this unit.",
      onOk: async () => {
        try {
          setLoading(true);

          // In a real app, you would dispatch an action to remove the user
          // For now, we'll just update the local state
          setAssignedUsers((prev) => prev.filter((u) => u.UserId !== userId));

          message.success("User removed from unit");
        } catch (error) {
          message.error(`Failed to remove user: ${error}`);
          console.error("Remove user error:", error);
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const columns = [
    {
      title: "User",
      dataIndex: "Username",
      key: "Username",
    },
    {
      title: "Role",
      dataIndex: "Role",
      key: "Role",
      render: (role) => <Tag color="blue">{role}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<UserDeleteOutlined />}
          type="text"
          danger
          onClick={() => handleRemoveUser(record.UserId)}
          disabled={loading}
        />
      ),
    },
  ];

  // Filter out already assigned users
  const availableUsers =
    allCompanyUsers?.filter(
      (user) => !assignedUsers.some((u) => u.UserId === user.userId)
    ) || [];

  return (
    <Modal
      title={`Manage Users for Unit`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Spin spinning={usersLoading || rolesLoading || loading}>
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Assign New User</h3>
          <Form form={form} layout="inline" onFinish={handleAssignUser}>
            <Form.Item
              name="userId"
              rules={[{ required: true, message: "Please select a user" }]}
            >
              <Select
                placeholder="Select user"
                style={{ width: 200 }}
                loading={usersLoading}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {availableUsers.map((user) => (
                  <Option key={user.userId} value={user.userId}>
                    {user.username}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="roleId"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select
                placeholder="Select role"
                style={{ width: 150 }}
                loading={rolesLoading}
              >
                {allRoles?.map((role) => (
                  <Option key={role.RoleId} value={role.RoleId}>
                    {role.RoleName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<UserAddOutlined />}
                loading={loading}
              >
                Assign
              </Button>
            </Form.Item>
          </Form>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Assigned Users</h3>
          <Table
            columns={columns}
            dataSource={assignedUsers}
            rowKey="UserId"
            pagination={false}
            size="small"
            locale={{
              emptyText: "No users assigned to this unit yet",
            }}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default UserAssignmentModal;
