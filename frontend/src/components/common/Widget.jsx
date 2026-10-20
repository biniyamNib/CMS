// Widget Component
function Widget({ title, value, icon, delay }) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md hover:scale-105 transition duration-300 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-center">
        <span className="text-3xl mr-4">{icon}</span>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-2xl text-gray-600">{value}</p>
        </div>
      </div>
    </div>
  );
}