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
            <button
              className="bg-blue-600 text-white px-3 py-1 rounded"
              onClick={() => alert(record.customer)}
            >
              View
            </button>
          ) : (
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={() => alert("Escalating" + record.customer)}
            >
              Escalate
            </button>
          )}
        </td>
      </tr>
    </div>
  );
}

export default TableRow;
