import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

function AddShareholder({ isOpen, closeModal, onAddShareholder }) {
  const [formData, setFormData] = useState({
    shareholderName: "",
    email: "",
    phone: "",
    address: "",
    dateJoined: "",
    shareQt: "",
    ownershipPercentage: "",
    dateAcquired: "",
    status: "Active",
    companyId: "",
  });
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [companyError, setCompanyError] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/companies", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Token:", token);
        if (!response.ok) throw new Error("Failed to fetch companies");
        const data = await response.json();
        setCompanies(data);
        if (data.length > 0)
          setFormData((prev) => ({ ...prev, companyId: data[0].CompanyId }));
      } catch (err) {
        setCompanyError(err.message);
      }
    };
    if (isOpen) fetchCompanies();
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.shareholderName.trim())
      newErrors.shareholderName = "Shareholder Name is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number";
    }
    if (!formData.shareQt) {
      newErrors.shareQt = "Number of Shares is required";
    } else if (isNaN(formData.shareQt) || formData.shareQt <= 0) {
      newErrors.shareQt = "Number of Shares must be a positive number";
    }
    if (!formData.ownershipPercentage) {
      newErrors.ownershipPercentage = "Ownership Percentage is required";
    } else if (
      isNaN(formData.ownershipPercentage) ||
      formData.ownershipPercentage <= 0 ||
      formData.ownershipPercentage > 100
    ) {
      newErrors.ownershipPercentage = "Ownership % must be between 0 and 100";
    }
    if (!formData.companyId) newErrors.companyId = "Please select a company";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const shareholderResponse = await fetch(
        "http://localhost:5000/api/shareholders",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ShareholderName: formData.shareholderName,
            Email: formData.email,
            Phone: formData.phone,
            Address: formData.address,
            DateJoined: formData.dateJoined || null,
            Status: formData.status,
          }),
        }
      );
      if (!shareholderResponse.ok)
        throw new Error("Failed to create shareholder");
      const shareholderData = await shareholderResponse.json();
      console.log("Shareholder creation response:", shareholderData); // Debug log
      const shareholderId = shareholderData.shareholderId;

      const mappingPayload = {
        shareholderId,
        ShareQt: parseInt(formData.shareQt),
        OwnershipPercentage: parseFloat(formData.ownershipPercentage),
        DateAcquired: formData.dateAcquired || null,
      };
      console.log("Mapping payload:", mappingPayload); // Debug log
      const mappingResponse = await fetch(
        `http://localhost:5000/api/companies/${formData.companyId}/shareholders`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappingPayload),
        }
      );
      if (!mappingResponse.ok)
        throw new Error("Failed to map shareholder to company");

      const newShareholder = {
        ShareholderId: shareholderId,
        ShareholderName: formData.shareholderName,
        Email: formData.email,
        ShareQt: parseInt(formData.shareQt),
        OwnershipPercentage: parseFloat(formData.ownershipPercentage),
        DateJoined: formData.dateJoined
          ? new Date(formData.dateJoined).toLocaleDateString()
          : null,
        Status: formData.status,
      };
      onAddShareholder(newShareholder);
      setFormData({
        shareholderName: "",
        email: "",
        phone: "",
        address: "",
        dateJoined: "",
        shareQt: "",
        ownershipPercentage: "",
        dateAcquired: "",
        status: "Active",
        companyId: companies.length > 0 ? companies[0].CompanyId : "",
      });
      setErrors({});
      closeModal();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
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
          <div className="fixed inset-0 backdrop-blur-xs" />
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
                  Add New Shareholder
                </Dialog.Title>
                {companyError && (
                  <p className="text-red-500 text-sm mb-4">{companyError}</p>
                )}
                {errors.submit && (
                  <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
                )}
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="shareholderName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Shareholder Name
                    </label>
                    <input
                      id="shareholderName"
                      name="shareholderName"
                      type="text"
                      value={formData.shareholderName}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.shareholderName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Shareholder Name"
                    />
                    {errors.shareholderName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.shareholderName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Address"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateJoined"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date Joined
                    </label>
                    <input
                      id="dateJoined"
                      name="dateJoined"
                      type="date"
                      value={formData.dateJoined}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Date Joined"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="shareQt"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Number of Shares
                    </label>
                    <input
                      id="shareQt"
                      name="shareQt"
                      type="number"
                      value={formData.shareQt}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.shareQt ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Number of Shares"
                    />
                    {errors.shareQt && (
                      <p className="text-red-500 text-xs mt-1">{errors.shareQt}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="ownershipPercentage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ownership Percentage
                    </label>
                    <input
                      id="ownershipPercentage"
                      name="ownershipPercentage"
                      type="number"
                      step="0.01"
                      value={formData.ownershipPercentage}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.ownershipPercentage
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Ownership Percentage"
                    />
                    {errors.ownershipPercentage && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.ownershipPercentage}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dateAcquired"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Date Acquired
                    </label>
                    <input
                      id="dateAcquired"
                      name="dateAcquired"
                      type="date"
                      value={formData.dateAcquired}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]"
                      aria-label="Date Acquired"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
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
                  <div>
                    <label
                      htmlFor="companyId"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <select
                      id="companyId"
                      name="companyId"
                      value={formData.companyId}
                      onChange={handleChange}
                      className={`w-full p-2 border ${
                        errors.companyId ? "border-red-500" : "border-gray-300"
                      } rounded-md focus:ring-[#0101f7] focus:border-[#0101f7]`}
                      aria-label="Company"
                    >
                      {companies.map((company) => (
                        <option
                          key={company.CompanyId}
                          value={company.CompanyId}
                        >
                          {company.CompanyName}
                        </option>
                      ))}
                    </select>
                    {errors.companyId && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.companyId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition"
                    aria-label="Cancel"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className={`px-4 py-2 bg-[#0101f7] text-white rounded-md hover:bg-blue-800 transition ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    aria-label="Add Shareholder"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Shareholder"}
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

export default AddShareholder;