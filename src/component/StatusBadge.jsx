function StatusBadge({ status }) {
  return status === "PASSED" ? (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
      PASSED
    </span>
  ) : (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
      FLAGGED
    </span>
  );
}

export default StatusBadge;
