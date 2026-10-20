import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useParams, useNavigate } from "react-router-dom";

function EditShareholder({ isOpen, closeModal, onUpdateShareholder }) {
  const { id } = useParams(); // Get shareholderId from URL
  const navigate = useNavigate();
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
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        console.log("Token:", token);
        // Fetch shareholder details
        const shareholderResponse = await fetch(
          `http://localhost:5000/api/shareholders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!shareholderResponse.ok)
          throw new Error("Failed to fetch shareholder");
        const shareholderData = await shareholderResponse.json();

        // Fetch companies for the dropdown
        const companiesResponse = await fetch(
          "http://localhost:5000/api/companies",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!companiesResponse.ok) throw new Error("Failed to fetch companies");
        const companiesData = await companiesResponse.json();

        // Find the current company mapping
        const mappingResponse = await fetch(
          `http://localhost:5000/api/companies/${shareholderData.companyId}/shareholders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!mappingResponse.ok)
          throw new Error("Failed to fetch shareholder mapping");
        const mappingData = await mappingResponse.json();

        setCompanies(companiesData);
        setFormData({
          shareholderName: shareholderData.ShareholderName,
          email: shareholderData.Email || "",
          phone: shareholderData.Phone || "",
          address: shareholderData.Address || "",
          dateJoined: shareholderData.DateJoined
            ? new Date(shareholderData.DateJoined).toISOString().split("T")[0]
            : "",
          shareQt: mappingData.ShareQt || "",
          ownershipPercentage: mappingData.OwnershipPercentage || "",
          dateAcquired: mappingData.DateAcquired
            ? new Date(mappingData.DateAcquired).toISOString().split("T")[0]
            : "",
          status: shareholderData.Status,
          companyId:
            shareholderData.companyId || companiesData[0]?.CompanyId || "",
        });
      } catch (err) {
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) fetchData();
  }, [id, isOpen]);

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
    } else if (
      isNaN(parseInt(formData.shareQt)) ||
      parseInt(formData.shareQt) <= 0
    ) {
      newErrors.shareQt = "Number of Shares must be a positive number";
    }
    if (!formData.ownershipPercentage) {
      newErrors.ownershipPercentage = "Ownership Percentage is required";
    } else if (
      isNaN(parseFloat(formData.ownershipPercentage)) ||
      parseFloat(formData.ownershipPercentage) <= 0 ||
      parseFloat(formData.ownershipPercentage) > 100
    ) {
      newErrors.ownershipPercentage = "Ownership % must be between 0 and 100";
    }
    if (!formData.companyId) newErrors.companyId = "Please select a company";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Update shareholder details
      const shareholderResponse = await fetch(
        `http://localhost:5000/api/shareholders/${id}`,
        {
          method: "PUT",
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
        throw new Error("Failed to update shareholder");

      // Update shareholder mapping
      const mappingResponse = await fetch(
        `http://localhost:5000/api/companies/${formData.companyId}/shareholders/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ShareQt: parseInt(formData.shareQt),
            OwnershipPercentage: parseFloat(formData.ownershipPercentage),
            DateAcquired: formData.dateAcquired || null,
          }),
        }
      );
      if (!mappingResponse.ok)
        throw new Error("Failed to update shareholder mapping");

      const updatedShareholder = {
        ShareholderId: id,
        ShareholderName: formData.shareholderName,
        Email: formData.email,
        ShareQt: parseInt(formData.shareQt),
        OwnershipPercentage: parseFloat(formData.ownershipPercentage),
        DateJoined: formData.dateJoined
          ? new Date(formData.dateJoined).toLocaleDateString()
          : null,
        Status: formData.status,
      };
      onUpdateShareholder(updatedShareholder);
      closeModal();
      navigate("/shareholders"); // Redirect to shareholders list
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
                  Edit Shareholder
                </Dialog.Title>
                {fetchError && (
                  <p className="text-red-500 text-sm mb-4">{fetchError}</p>
                )}
                {errors.submit && (
                  <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
                )}
                {loading ? (
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0101f7]"></div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.phone}
                        </p>
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.shareQt}
                        </p>
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
                          errors.companyId
                            ? "border-red-500"
                            : "border-gray-300"
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
                    <div className="mt-6 flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded-md hover:bg-gray-300 transition"
                        aria-label="Cancel"
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 bg-[#0101f7] text-white rounded-md hover:bg-blue-800 transition ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        aria-label="Update Shareholder"
                        disabled={loading}
                      >
                        {loading ? "Updating..." : "Update Shareholder"}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default EditShareholder;
