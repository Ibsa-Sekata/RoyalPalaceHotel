import React, { useEffect, useState } from "react";
import { BedDouble, CalendarCheck, Wallet, ChartNoAxesCombined, ArrowUpRight, Clock3 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import { Link } from "react-router-dom";
import StatCard from "../../components/StatCard.jsx";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { reportsApi } from "../../api/reportsApi.js";

const colors = ["#C6A15B", "#263e55", "#d9c79e"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    reportsApi.dashboard()
      .then(res => setData(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="empty-state">Loading dashboard…</p>;
  if (error) return <p style={{ color: "#c05d5d" }}>{error}</p>;

  const {
    totalRevenue, totalBookings, occupiedRooms, totalRooms,
    occupancyRate, revenueData, occupancyData, recentBookings,
  } = data;

  return (
    <>
      <AdminPageHeader
        title="Dashboard overview"
        description="Live data from your Neon database."
        action={<Link to="/admin/bookings" className="btn btn-gold">+ View bookings</Link>}
      />

      <div className="stat-grid">
        <StatCard icon={Wallet} label="Total revenue" value={`ETB ${(totalRevenue/1000).toFixed(0)}K`} change="—"/>
        <StatCard icon={BedDouble} label="Occupied rooms" value={`${occupiedRooms} / ${totalRooms}`} change="—"/>
        <StatCard icon={CalendarCheck} label="Total bookings" value={String(totalBookings)} change="—"/>
        <StatCard icon={ChartNoAxesCombined} label="Occupancy rate" value={`${occupancyRate}%`} change="—"/>
      </div>

      <div className="dashboard-charts">
        <section className="panel revenue-panel">
          <div className="panel-heading">
            <div><h2>Revenue overview</h2><p>Grouped by booking month</p></div>
          </div>
          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData.length ? revenueData : [{month:"—", revenue:0}]} margin={{top:12,right:12,left:-18,bottom:0}}>
                <defs>
                  <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C6A15B" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#C6A15B" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e9e6df"/>
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{fill:"#7b7c7e",fontSize:11}}/>
                <YAxis tickLine={false} axisLine={false} tick={{fill:"#7b7c7e",fontSize:11}}/>
                <Tooltip formatter={v=>[`ETB ${v}k`,"Revenue"]}/>
                <Area type="monotone" dataKey="revenue" stroke="#C6A15B" strokeWidth={2.5} fill="url(#goldFill)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel occupancy-panel">
          <div className="panel-heading">
            <div><h2>Room occupancy</h2><p>Live room status</p></div>
          </div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={occupancyData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={86} paddingAngle={4} stroke="none">
                  {occupancyData.map((entry, i) => <Cell key={entry.name} fill={colors[i]}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center"><b>{occupancyRate}%</b><small>Occupied</small></div>
          </div>
          <div className="legend-list">
            {occupancyData.map((x, i) => (
              <div key={x.name}><span><i style={{background:colors[i]}}/>{x.name}</span><b>{x.value}</b></div>
            ))}
          </div>
        </section>
      </div>

      <div className="dashboard-bottom">
        <section className="panel">
          <div className="panel-heading">
            <div><h2>Recent bookings</h2><p>Latest activity</p></div>
            <Link className="text-link" to="/admin/bookings">View all <ArrowUpRight size={15}/></Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Booking #</th><th>Guest</th><th>Room</th><th>Status</th><th>Amount</th></tr></thead>
              <tbody>
                {recentBookings.length === 0 ? (
                  <tr><td colSpan="5" className="empty-state">No bookings yet.</td></tr>
                ) : recentBookings.map(b => (
                  <tr key={b.id}>
                    <td className="gold-text">{b.bookingNumber}</td>
                    <td>{b.guest?.fullName}</td>
                    <td>{b.room?.roomNumber}</td>
                    <td><span className={`status status-${b.status.toLowerCase().replace(/_/g,"-")}`}>{b.status.replace("_"," ")}</span></td>
                    <td>ETB {Number(b.totalAmount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel arrivals-panel">
          <div className="panel-heading">
            <div><h2>Recent activity</h2><p>Latest updates</p></div>
            <Clock3 size={17}/>
          </div>
          {recentBookings.length === 0 ? (
            <p className="empty-state">No activity yet.</p>
          ) : recentBookings.map(b => (
            <div className="arrival-row" key={b.id}>
              <span className="guest-avatar">{(b.guest?.fullName||"?").split(" ").map(x=>x[0]).join("").slice(0,2)}</span>
              <span><b>{b.guest?.fullName || "Guest"}</b><small>{b.room?.name || "—"}</small></span>
              <time>{new Date(b.createdAt).toLocaleDateString()}</time>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
