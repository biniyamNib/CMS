import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function AddOrganizationalUnit({ isOpen, closeModal, onAddUnit, organizationalUnits }) {
  const [formData, setFormData] = useState({
    structureName: '',
    structureType: '',
    reportingToId: '',
    category: '',
    status: 'Active',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.structureName.trim()) newErrors.structureName = 'Structure Name is required';
    if (!formData.structureType.trim()) newErrors.structureType = 'Structure Type is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newUnit = {
      orgStructureId: crypto.randomUUID(),
      companyId: 'sample-company-id', // Replace with dynamic company context if needed
      reportingToId: formData.reportingToId || null,
      structureName: formData.structureName,
      structureType: formData.structureType,
      reportingType: 'Direct', // Default, can be expanded
      category: formData.category || null,
      createdDate: new Date().toLocaleDateString(),
      updatedDate: new Date().toLocaleDateString(),
      status: formData.status,
      isLeaf: false, // Assume not a leaf until children are added
    };
    onAddUnit(newUnit);
    setFormData({
      structureName: '',
      structureType: '',
      reportingToId: '',
      category: '',
      status: 'Active',
    });
    setErrors({});
    closeModal();
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <Dialog.Title className="text-lg font-semibold text-gray-800 mb-4">
                  Add Organizational Unit
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="structureName" className="block text-sm font-medium text-gray-700">
                      Structure Name
                    </label>
                    <input
                      id="structureName"
                      name="structureName"
                      type="text"
                      value={formData.structureName}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.structureName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Structure Name"
                    />
                    {errors.structureName && <p className="text-red-500 text-xs mt-1">{errors.structureName}</p>}
                  </div>
                  <div>
                    <label htmlFor="structureType" className="block text-sm font-medium text-gray-700">
                      Structure Type
                    </label>
                    <select
                      id="structureType"
                      name="structureType"
                      value={formData.structureType}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.structureType ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Structure Type"
                    >
                      <option value="">Select Type</option>
                      <option value="Department">Department</option>
                      <option value="Division">Division</option>
                      <option value="Team">Team</option>
                    </select>
                    {errors.structureType && <p className="text-red-500 text-xs mt-1">{errors.structureType}</p>}
                  </div>
                  <div>
                    <label htmlFor="reportingToId" className="block text-sm font-medium text-gray-700">
                      Reports To
                    </label>
                    <select
                      id="reportingToId"
                      name="reportingToId"
                      value={formData.reportingToId}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Reports To"
                    >
                      <option value="">None</option>
                      {organizationalUnits.map((unit) => (
                        <option key={unit.orgStructureId} value={unit.orgStructureId}>
                          {unit.structureName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <input
                      id="category"
                      name="category"
                      type="text"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Category"
                    />
                  </div>
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-[#0101f7] text-white rounded-md hover:bg-blue-800 transition"
                    aria-label="Add Unit"
                  >
                    Add Unit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddOrganizationalUnit;