import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import AdminPageHeader from "../../components/AdminPageHeader.jsx";
import { foodOrdersApi } from "../../api/foodOrdersApi.js";
import { SOCKET_URL } from "../../config.js";

const columns = [
  ["PENDING", "New Orders", "CONFIRMED", "Accept"],
  ["CONFIRMED", "Accepted Orders", "PREPARING", "Start preparation"],
  ["PREPARING", "Preparing Orders", "READY", "Mark ready"],
  ["READY", "Ready Orders", "DELIVERED", "Complete"],
  ["DELIVERED", "Completed Orders", null, null],
];

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const load = () => foodOrdersApi.kitchen().then((response) => setOrders(response.data || [])).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    const socket = io(SOCKET_URL, { auth: { token: localStorage.getItem("token") } });
    const refresh = (order) => setOrders((current) => {
      const exists = current.some((item) => item.id === order.id);
      return exists ? current.map((item) => item.id === order.id ? order : item) : [...current, order];
    });
    socket.on("order:created", refresh);
    socket.on("order:status", refresh);
    socket.on("order:updated", refresh);
    return () => socket.disconnect();
  }, []);

  const grouped = useMemo(() => Object.fromEntries(columns.map(([status]) => [status, orders.filter((order) => order.status === status)])), [orders]);
  const transition = async (id, status) => {
    try { const response = await foodOrdersApi.transition(id, status); setOrders((current) => current.map((order) => order.id === id ? response.data : order)); }
    catch (e) { setError(e.message); }
  };

  return <><AdminPageHeader title="Kitchen dashboard" description="Live food orders from every guest channel." action={<button className="btn btn-light" onClick={load}>Refresh</button>} />
    {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(190px, 1fr))", gap: 12, overflowX: "auto" }}>
      {columns.map(([status, title, next, action]) => <section key={status} className="panel" style={{ minWidth: 190, padding: 12 }}><h3>{title} ({grouped[status].length})</h3>
        {grouped[status].map((order) => <article key={order.id} style={{ border: "1px solid #eef0f3", borderRadius: 8, padding: 12, marginBottom: 10, background: "#fff" }}>
          <b>{order.orderNumber}</b><div style={{ fontSize: 11, color: "#66717d", margin: "5px 0" }}>{order.guest?.fullName} · {order.deliveryLocation || "No location"}</div>
          <ul style={{ paddingLeft: 18, fontSize: 12 }}>{order.items.map((item) => <li key={item.id}>{item.quantity} × {item.name}{item.specialInstructions && ` — ${item.specialInstructions}`}</li>)}</ul>
          {order.notes && <small>Note: {order.notes}</small>}
          {next && <button className="btn btn-small btn-gold full-width" onClick={() => transition(order.id, next)}>{action}</button>}
        </article>)}
      </section>)}
    </div>
  </>;
}
