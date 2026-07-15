import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import data from "../data/data";

function Dashboard() {
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
