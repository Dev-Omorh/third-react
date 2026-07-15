import TableRow from "./TableRow";

function DataTable({ records }) {
  return (
    <div>
      <table className="w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">Customer</th>
            <th className="p-4">Amount</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {records.map((record) => (
            <TableRow key={record.id} record={record} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
