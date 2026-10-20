import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tree, TreeNode } from "react-organizational-chart";
import {
  fetchOrgStructures,
  createOrgStructure,
  updateOrgStructure,
  deleteOrgStructure,
} from "../slices/orgStructureSlice";
import { logout } from "../slices/authSlice";
import { Button, Modal, Card, Tag, Spin, Alert, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import OrgStructureForm from "../forms/OrgStructureForm";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import moment from "moment";
import { Form } from "antd";
import UserAssignmentModal from "../forms/UserAssignmentModal";

const OrgStructureChart = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orgStructures, loading, error } = useSelector(
    (state) => state.orgStructures
  );
  const { token } = useSelector((state) => state.auth);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [form] = Form.useForm();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to view the organizational chart");
      dispatch(logout());
      navigate("/login");
      return;
    }
    if (!companyId) {
      toast.error("Company ID is required");
      navigate("/org-structure");
      return;
    }
    dispatch(fetchOrgStructures({ companyId }))
      .unwrap()
      .catch((err) => console.error("Failed to fetch org structures:", err));
  }, [token, companyId, dispatch, navigate]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleAddChild = () => {
    if (!selectedNode) {
      toast.warning("Please select a parent node first");
      return;
    }
    setFormMode("create");
    form.resetFields();
    form.setFieldsValue({
      ReportingToId: selectedNode.OrgStructureId,
      CompanyId: companyId,
    });
    setIsModalVisible(true);
  };

  const handleCreateRoot = () => {
    setFormMode("create");
    form.resetFields();
    form.setFieldsValue({ ReportingToId: null, CompanyId: companyId });
    setIsModalVisible(true);
  };

  const handleEdit = () => {
    if (!selectedNode) {
      toast.warning("Please select a node to edit");
      return;
    }
    setFormMode("edit");
    form.setFieldsValue({
      StructureName: selectedNode.StructureName,
      Description: selectedNode.Description || "",
      Category: selectedNode.Category || "Operational",
      StructureType: selectedNode.ExpiryDate ? "Temporary" : "Permanent",
      ExpiryDate: selectedNode.ExpiryDate
        ? moment(selectedNode.ExpiryDate)
        : null,
      ReportingType: selectedNode.ReportingType || "Direct",
      isLeaf: selectedNode.isLeaf || false,
      CompanyId: companyId,
    });
    setIsModalVisible(true);
  };

  const handleDelete = () => {
    if (!selectedNode) {
      toast.warning("Please select a node to delete");
      return;
    }
    Modal.confirm({
      title: "Confirm Delete",
      content: `Are you sure you want to delete "${selectedNode.StructureName}" and its children?`,
      okText: "Delete",
      okType: "danger",
      onOk: () => {
        dispatch(
          deleteOrgStructure({
            orgStructureId: selectedNode.OrgStructureId,
            companyId,
          })
        )
          .unwrap()
          .then(() => {
            toast.success("Structure deleted successfully");
            setSelectedNode(null);
          })
          .catch((err) => toast.error(`Failed to delete: ${err}`));
      },
    });
  };

  const handleFormSubmit = (values) => {
    const payload = {
      CompanyId: companyId,
      StructureName: values.StructureName,
      Description: values.Description || null,
      Category: values.Category,
      ReportingToId: values.ReportingToId || null,
      ExpiryDate: values.ExpiryDate ? values.ExpiryDate.toISOString() : null,
      ReportingType: values.ReportingType,
      StructureType: values.StructureType,
    };

    if (formMode === "create") {
      dispatch(createOrgStructure({ companyId, data: payload }))
        .unwrap()
        .then(() => {
          toast.success("Structure created successfully");
          setIsModalVisible(false);
          dispatch(fetchOrgStructures({ companyId }));
        })
        .catch((err) => toast.error(`Failed to create: ${err}`));
    } else {
      dispatch(
        updateOrgStructure({
          orgStructureId: selectedNode.OrgStructureId,
          companyId,
          data: payload,
        })
      )
        .unwrap()
        .then(() => {
          toast.success("Structure updated successfully");
          setIsModalVisible(false);
          dispatch(fetchOrgStructures({ companyId }));
        })
        .catch((err) => toast.error(`Failed to update: ${err}`));
    }
  };

  const renderNode = (node) => {
    if (!node || !node.OrgStructureId) {
      console.warn("Invalid node:", node);
      return null;
    }
    const children = Array.isArray(orgStructures)
      ? orgStructures.filter((s) => s?.ReportingToId === node.OrgStructureId)
      : [];
    const isTemporary = !!node.ExpiryDate;
    const isLeaf = node.isLeaf || children.length === 0;
    const isRoot = !node.ReportingToId;

    return (
      <TreeNode
        key={node.OrgStructureId}
        label={
          <div
            className={`p-3 border rounded cursor-pointer transition-all ${
              isRoot
                ? "bg-blue-100 border-blue-500"
                : selectedNode?.OrgStructureId === node.OrgStructureId
                ? "bg-blue-50 border-blue-300"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={() => handleNodeClick(node)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold flex items-center">
                  {node.StructureName || "Unknown"}
                  {isTemporary && (
                    <Tag color="purple" className="ml-2">
                      Temporary
                    </Tag>
                  )}
                  {isRoot && (
                    <Tag color="gold" className="ml-2">
                      Root
                    </Tag>
                  )}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Category:</span>{" "}
                  {node.Category || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Reporting Type:</span>{" "}
                  {node.ReportingType || "N/A"}
                </p>
                {node.Description && (
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Description:</span>{" "}
                    {node.Description}
                  </p>
                )}
              </div>
              <div className="flex space-x-1">
                <Tag color={isLeaf ? "green" : "blue"}>
                  {isLeaf ? "Leaf" : "Branch"}
                </Tag>
              </div>
            </div>
            {node.Users?.length > 0 ? (
              <div className="mt-2">
                <p className="text-xs font-semibold text-gray-500">MEMBERS:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {node.Users.map((u) => (
                    <Tag key={u.UserId} icon={<TeamOutlined />} color="cyan">
                      {u.Username} ({u.Role})
                    </Tag>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-gray-400 mt-2">No members assigned</p>
            )}
          </div>
        }
      >
        {children.map((child) => renderNode(child))}
      </TreeNode>
    );
  };

  if (!companyId) {
    return (
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div
            className={`flex-1 mt-[88px] mx-4 mb-6 p-6 bg-[#F5F5F5] min-h-[280px] transition-all duration-300 ease-in-out ${
              collapsed ? "ml-[96px]" : "ml-[266px]"
            }`}
          >
            <Alert
              message="Error"
              description="Please select a company."
              type="error"
              showIcon
            />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div
            className={`flex-1 mt-[88px] mx-4 mb-6 p-6 bg-[#F5F5F5] min-h-[280px] transition-all duration-300 ease-in-out ${
              collapsed ? "ml-[96px]" : "ml-[266px]"
            }`}
          >
            <Spin size="large" tip="Loading organizational chart..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div
            className={`flex-1 mt-[88px] mx-4 mb-6 p-6 bg-[#F5F5F5] min-h-[280px] transition-all duration-300 ease-in-out ${
              collapsed ? "ml-[96px]" : "ml-[266px]"
            }`}
          >
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              action={
                <Button
                  type="primary"
                  danger
                  onClick={() => dispatch(fetchOrgStructures({ companyId }))}
                >
                  Retry
                </Button>
              }
            />
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(orgStructures)) {
    console.error("orgStructures is not an array:", orgStructures);
    return (
      <div>
        <Navbar />
        <div className="flex">
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
          <div
            className={`flex-1 mt-[88px] mx-4 mb-6 p-6 bg-[#F5F5F5] min-h-[280px] transition-all duration-300 ease-in-out ${
              collapsed ? "ml-[96px]" : "ml-[266px]"
            }`}
          >
            <Alert
              message="Error"
              description="Invalid data received."
              type="error"
              showIcon
            />
          </div>
        </div>
      </div>
    );
  }

  const rootStructures = orgStructures.filter((s) => !s?.ReportingToId);
  const displayStructures =
    rootStructures.length > 0 ? rootStructures : orgStructures;

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={`flex-1 mt-[88px] mx-4 mb-6 p-6 bg-[#F5F5F5] min-h-[280px] transition-all duration-300 ease-in-out ${
            collapsed ? "ml-[96px]" : "ml-[266px]"
          }`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Organizational Structure</h2>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddChild}
                disabled={!selectedNode}
              >
                Add Child Unit
              </Button>
              <Button
                type="primary"
                icon={<TeamOutlined />}
                onClick={() => setUserModalVisible(true)}
                disabled={!selectedNode}
              >
                Manage Users
              </Button>
              <Button
                icon={<EditOutlined />}
                onClick={handleEdit}
                disabled={!selectedNode}
              >
                Edit
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                disabled={!selectedNode}
              >
                Delete
              </Button>
            </Space>
          </div>
          <Card>
            {displayStructures.length > 0 ? (
              <div style={{ overflowX: "auto" }}>
                <Tree
                  lineWidth="2px"
                  lineColor="#d1d5db"
                  lineBorderRadius="4px"
                  label={
                    <div className="p-3 bg-blue-100 border border-blue-300 rounded font-bold text-center">
                      Company Structure
                    </div>
                  }
                >
                  {displayStructures.map((root) => renderNode(root))}
                </Tree>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No organizational structure found.
                </p>
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={handleCreateRoot}
                >
                  Create Root Structure
                </Button>
              </div>
            )}
          </Card>

          {/* Org Structure Form Modal */}
          <Modal
            title={`${
              formMode === "create" ? "Create" : "Edit"
            } Organizational Unit`}
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
            destroyOnClose
          >
            <OrgStructureForm
              form={form}
              mode={formMode}
              onSubmit={handleFormSubmit}
              companyId={companyId}
              parentId={
                formMode === "create" ? selectedNode?.OrgStructureId : null
              }
            />
          </Modal>

          {/* User Assignment Modal */}
          <UserAssignmentModal
            visible={userModalVisible}
            onCancel={() => setUserModalVisible(false)}
            orgStructureId={selectedNode?.OrgStructureId}
            companyId={companyId}
            existingUsers={selectedNode?.Users || []}
          />
        </div>
      </div>
    </div>
  );
};

export default OrgStructureChart;
