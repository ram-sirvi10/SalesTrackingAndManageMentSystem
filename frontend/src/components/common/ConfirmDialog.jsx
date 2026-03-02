const ConfirmDialog = () => (
  <div className="card">
    <h3 className="font-semibold mb-4">Are you sure?</h3>
    <div className="flex justify-end gap-3">
      <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
      <button className="px-4 py-2 bg-red-600 text-white rounded">
        Confirm
      </button>
    </div>
  </div>
);

export default ConfirmDialog;
