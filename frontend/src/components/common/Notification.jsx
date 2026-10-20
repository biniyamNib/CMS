const Notification = ({ message, type, onClose }) => {
const bgColor = {
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}[type] || 'bg-blue-500';

return (
  <div className={`fixed top-4 right-4 p-4 rounded-lg text-white ${bgColor} shadow-lg z-50`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 font-bold">×</button>
    </div>
  </div>
);
};

export default Notification;