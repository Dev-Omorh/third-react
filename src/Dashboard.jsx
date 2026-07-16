import { useState, useEffect } from "react";

import Navbar from "./component/Navbar";
import StatsCard from "./component/StatsCard";
import DataTable from "./component/DataTable";
import data from "./Data";

function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("YOUR_API_URL")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const total = data.length;

  const valid = data.filter((item) => item.status === "valid").length;

  const violated = data.filter((item) => item.status === "violated").lenght;

  return (
    <div>
      <Navbar />

      <div>
        <div className="p-6">
          <StatsCard title="Total Records" value={total} />

          <StatsCard title="Validated" value={valid} />

          <StatsCard title="Violated" value={violated} />
        </div>

        <DataTable records={data} />
      </div>
    </div>
  );
}

export default Dashboard;
