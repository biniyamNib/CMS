import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function AddDesignation({ isOpen, closeModal, onAddDesignation }) {
  const [formData, setFormData] = useState({
    name: '',
    jobDescription: '',
    noOfPosition: '',
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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.jobDescription.trim()) newErrors.jobDescription = 'Job Description is required';
    if (!formData.noOfPosition) {
      newErrors.noOfPosition = 'Number of Positions is required';
    } else if (isNaN(formData.noOfPosition) || formData.noOfPosition <= 0) {
      newErrors.noOfPosition = 'Number of Positions must be a positive number';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newDesignation = {
      designationId: crypto.randomUUID(),
      companyId: 'sample-company-id-001',
      organizationalStructureId: 'sample-org-id-001', // Placeholder; replace with dynamic value if needed
      name: formData.name,
      jobDescription: formData.jobDescription,
      noOfPosition: parseInt(formData.noOfPosition),
      createdDate: new Date().toLocaleDateString(),
      updatedDate: new Date().toLocaleDateString(),
      status: formData.status,
      isActive: formData.status === 'Active',
    };
    onAddDesignation(newDesignation);
    setFormData({
      name: '',
      jobDescription: '',
      noOfPosition: '',
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
                  Add New Designation
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Designation Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
                      Job Description
                    </label>
                    <textarea
                      id="jobDescription"
                      name="jobDescription"
                      value={formData.jobDescription}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.jobDescription ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Job Description"
                    />
                    {errors.jobDescription && <p className="text-red-500 text-xs mt-1">{errors.jobDescription}</p>}
                  </div>
                  <div>
                    <label htmlFor="noOfPosition" className="block text-sm font-medium text-gray-700">
                      Number of Positions
                    </label>
                    <input
                      id="noOfPosition"
                      name="noOfPosition"
                      type="number"
                      value={formData.noOfPosition}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.noOfPosition ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Number of Positions"
                    />
                    {errors.noOfPosition && <p className="text-red-500 text-xs mt-1">{errors.noOfPosition}</p>}
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
                    aria-label="Add Designation"
                  >
                    Add Designation
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

export default AddDesignation;