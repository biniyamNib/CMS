const Input = ({ label, id, type = 'text', value, onChange, placeholder, required }) => {
    return (
      <div className="mb-4">
        <label htmlFor={id} className="block text-gray-700 text-sm font-medium mb-2">
          {label}
        </label>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required={required}
        />
      </div>
    );
  };
  
  export default Input;