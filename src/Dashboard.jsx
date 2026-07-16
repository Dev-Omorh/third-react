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

  const passed = data.filter((item) => item.status === "PASSED").length;

  const flagged = data.filter((item) => item.status === "FLAGGED").lenght;

  return (
    <div>
      <Navbar />

      <div>
        <div className="p-6">
          <StatsCard title="TOTAL RECORDS" value={total} />

          <StatsCard title="PASSED" value={passed} />

          <StatsCard title="FLAGGED" value={flagged} />
        </div>

        <DataTable records={data} />
      </div>
    </div>
  );
}

export default Dashboard;
