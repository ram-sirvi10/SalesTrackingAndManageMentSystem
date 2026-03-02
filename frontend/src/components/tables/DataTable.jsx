const DataTable = ({ columns, data }) => (
  <table className="w-full text-sm">
    <thead className="text-gray-500 border-b">
      <tr>
        {columns.map((col, i) => (
          <th key={i} className="py-2 text-left">
            {col}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, i) => (
        <tr key={i} className="border-b">
          {row.map((cell, j) => (
            <td key={j} className="py-2">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export default DataTable;
