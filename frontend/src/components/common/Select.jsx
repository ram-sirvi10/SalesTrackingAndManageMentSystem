const Select = ({ label, options = [] }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-gray-600">{label}</label>
    <select className="border rounded-lg px-3 py-2 text-sm">
      {options.map((opt, i) => (
        <option key={i}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Select;
