function StatusBadge({ status }) {
  return status === "valid" ? (
    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
      Valid
    </span>
  ) : (
    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
      Violation
    </span>
  );
}

export default StatusBadge;
