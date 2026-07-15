import StatusBadge from "./StatusBadge";

function TableRow({ record }) {
  return (
    <div>
      <tr className="border-b">
        <td className="p-4">{record.customer}</td>
        <td className="p-4">#{record.amount}</td>
        <td className="p-4">
          <StatusBadge status={record.status} />
        </td>
        <td className="p-4">
          {record.status === "valid" ? (
            <button className="text-blue-600">View</button>
          ) : (
            <button className="text-red-600">Escalate</button>
          )}
        </td>
      </tr>
    </div>
  );
}

export default TableRow;
