import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

function AddLicense({ isOpen, closeModal, onAddLicense }) {
  const [formData, setFormData] = useState({
    licenseNo: '',
    type: '',
    licenseDate: '',
    expireDate: '',
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
    if (!formData.licenseNo.trim()) newErrors.licenseNo = 'License Number is required';
    if (!formData.type.trim()) newErrors.type = 'License Type is required';
    if (!formData.licenseDate) {
      newErrors.licenseDate = 'Issue Date is required';
    } else if (new Date(formData.licenseDate) > new Date()) {
      newErrors.licenseDate = 'Issue Date cannot be in the future';
    }
    if (!formData.expireDate) {
      newErrors.expireDate = 'Expiry Date is required';
    } else if (new Date(formData.expireDate) <= new Date(formData.licenseDate)) {
      newErrors.expireDate = 'Expiry Date must be after Issue Date';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newLicense = {
      licenseId: crypto.randomUUID(),
      companyId: 'sample-company-id-001',
      licenseNo: formData.licenseNo,
      type: formData.type,
      licenseDate: new Date(formData.licenseDate).toLocaleDateString(),
      expireDate: new Date(formData.expireDate).toLocaleDateString(),
      createdDate: new Date().toLocaleDateString(),
      updatedDate: new Date().toLocaleDateString(),
      status: formData.status,
    };
    onAddLicense(newLicense);
    setFormData({
      licenseNo: '',
      type: '',
      licenseDate: '',
      expireDate: '',
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
                  Add New License
                </Dialog.Title>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="licenseNo" className="block text-sm font-medium text-gray-700">
                      License Number
                    </label>
                    <input
                      id="licenseNo"
                      name="licenseNo"
                      type="text"
                      value={formData.licenseNo}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.licenseNo ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="License Number"
                    />
                    {errors.licenseNo && <p className="text-red-500 text-xs mt-1">{errors.licenseNo}</p>}
                  </div>
                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                      License Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.type ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="License Type"
                    >
                      <option value="">Select Type</option>
                      <option value="Trading">Trading</option>
                      <option value="Construction">Construction</option>
                      <option value="Manufacturing">Manufacturing</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                  </div>
                  <div>
                    <label htmlFor="licenseDate" className="block text-sm font-medium text-gray-700">
                      Issue Date
                    </label>
                    <input
                      id="licenseDate"
                      name="licenseDate"
                      type="date"
                      value={formData.licenseDate}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.licenseDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Issue Date"
                    />
                    {errors.licenseDate && <p className="text-red-500 text-xs mt-1">{errors.licenseDate}</p>}
                  </div>
                  <div>
                    <label htmlFor="expireDate" className="block text-sm font-medium text-gray-700">
                      Expiry Date
                    </label>
                    <input
                      id="expireDate"
                      name="expireDate"
                      type="date"
                      value={formData.expireDate}
                      onChange={handleChange}
                      className={`w-full p-2 border ${errors.expireDate ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Expiry Date"
                    />
                    {errors.expireDate && <p className="text-red-500 text-xs mt-1">{errors.expireDate}</p>}
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
                      <option value="Expired">Expired</option>
                      <option value="Suspended">Suspended</option>
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
                    aria-label="Add License"
                  >
                    Add License
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

export default AddLicense;