import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { foodOrdersApi } from "../../api/foodOrdersApi.js";
import { useAuth } from "../../context/useAuth.js";
import { io } from "socket.io-client";

export default function FoodOrdering() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState({});
  const [orderType, setOrderType] = useState("ROOM_SERVICE");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([foodOrdersApi.menu(), user ? foodOrdersApi.mine() : Promise.resolve({ data: [] })])
      .then(([menu, history]) => { setCategories(menu.data || []); setOrders(history.data || []); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;
    const base = (import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1").replace(/\/api\/v1\/?$/, "");
    const socket = io(base, { auth: { token: localStorage.getItem("token") } });
    const updateOrder = (order) => setOrders((current) => current.some((item) => item.id === order.id)
      ? current.map((item) => item.id === order.id ? order : item)
      : [order, ...current]);
    socket.on("order:status", updateOrder);
    socket.on("order:updated", updateOrder);
    return () => socket.disconnect();
  }, [user]);

  const cartItems = useMemo(() => Object.values(cart), [cart]);
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const add = (item) => setCart((current) => ({ ...current, [item.id]: { ...item, quantity: (current[item.id]?.quantity || 0) + 1 } }));
  const change = (id, quantity) => setCart((current) => {
    const next = { ...current };
    if (quantity < 1) delete next[id]; else next[id] = { ...next[id], quantity };
    return next;
  });

  const submit = async () => {
    if (!user) return navigate("/login", { state: { from: "/food-ordering" } });
    if (!cartItems.length) return setError("Add at least one item to your order.");
    setError(""); setMessage("");
    try {
      const response = await foodOrdersApi.create({
        items: cartItems.map((item) => ({ menuItemId: item.id, quantity: item.quantity, specialInstructions: item.instructions || "" })),
        orderType,
        deliveryLocation: location,
        notes,
      });
      setOrders((current) => [response.data, ...current]);
      setCart({}); setNotes(""); setLocation("");
      setMessage(`Order ${response.data.orderNumber} submitted to the kitchen.`);
    } catch (e) { setError(e.message); }
  };

  return (
    <section className="section internal-section">
      <div className="page-hero small-hero"><div className="internal-page-container"><h1>Food ordering</h1><p>Enjoy Royal Palace favourites wherever you are.</p></div></div>
      {error && <p style={{ color: "#c05d5d" }}>{error}</p>}
      {message && <p style={{ color: "#39845a" }}>{message}</p>}
      {loading ? <p className="empty-state">Loading menu...</p> : (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 330px", gap: 24 }}>
          <div>
            {categories.map((category) => <section key={category.id} style={{ marginBottom: 24 }}>
              <h2>{category.name}</h2><p style={{ color: "#8892a0" }}>{category.description}</p>
              <div className="room-grid">
                {category.items.map((item) => <article className="room-card" key={item.id}>
                  {item.image && <img className="room-image" src={item.image} alt={item.name} />}
                  <div className="room-card-body"><h3>{item.name}</h3><p>{item.description}</p><b>ETB {Number(item.price).toLocaleString()}</b><button className="btn btn-gold full-width" onClick={() => add(item)}>Add to order</button></div>
                </article>)}
              </div>
            </section>)}
          </div>
          <aside className="form-card" style={{ alignSelf: "start", position: "sticky", top: 80 }}>
            <h2>Your order</h2>
            {cartItems.length === 0 ? <p>Your cart is empty.</p> : cartItems.map((item) => <div key={item.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 10 }}><span>{item.name}<br /><small>ETB {Number(item.price).toLocaleString()}</small></span><span><button onClick={() => change(item.id, item.quantity - 1)}>-</button> {item.quantity} <button onClick={() => change(item.id, item.quantity + 1)}>+</button></span></div>)}
            <label>Order type<select value={orderType} onChange={(e) => setOrderType(e.target.value)}><option value="DINE_IN">Dine-in</option><option value="ROOM_SERVICE">Room service</option><option value="TAKEAWAY">Takeaway</option></select></label>
            <label>{orderType === "ROOM_SERVICE" ? "Room number" : orderType === "DINE_IN" ? "Table number" : "Pickup name"}<input value={location} onChange={(e) => setLocation(e.target.value)} /></label>
            <label>Special instructions<textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
            <p><b>Subtotal:</b> ETB {subtotal.toLocaleString()}<br /><small>VAT is calculated at checkout.</small></p>
            <button className="btn btn-gold full-width" onClick={submit}>Submit order</button>
            <Link to="/my-bookings" className="text-link" style={{ marginTop: 12 }}>View stay and order history</Link>
          </aside>
        </div>
      )}
      {orders.length > 0 && <section style={{ marginTop: 36 }}><h2>Recent orders</h2>{orders.map((order) => <div key={order.id} className="form-card" style={{ marginBottom: 10 }}><b>{order.orderNumber}</b> · {order.status} · ETB {Number(order.totalAmount).toLocaleString()}<div>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(", ")}</div></div>)}</section>}
    </section>
  );
}
