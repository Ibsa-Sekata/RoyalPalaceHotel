import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, Shield } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";
import { apiRequest } from "../../api/client.js";

export default function SetupAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [alreadyHasAdmin, setAlreadyHasAdmin] = useState(false);

  useEffect(() => {
    apiRequest("/users/count")
      .then(res => {
        if (!res.data.canBootstrap) setAlreadyHasAdmin(true);
      })
      .catch(() => {});
  }, []);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await apiRequest("/users/bootstrap", { method: "POST", body: form });
      const user = await login(form.email, form.password);
      if (user.role === "ADMIN") navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (alreadyHasAdmin) {
    return (
      <section className="auth-page">
        <div className="auth-photo">
          <div className="brand">
            <Crown />
            <span><b>ROYAL PALACE</b><small>HOTEL & RESORT</small></span>
          </div>
          <div>
            <h2>Setup<br/><em>already complete.</em></h2>
            <p>An administrator account already exists.</p>
          </div>
        </div>
        <div className="auth-form" style={{ textAlign: "center" }}>
          <Shield size={48} color="#a17b36" style={{ margin: "0 auto 16px" }}/>
          <h1>Setup complete</h1>
          <p>An admin already exists for this hotel.</p>
          <Link to="/login" className="btn btn-gold full-width">Go to login</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-page">
      <div className="auth-photo">
        <div className="brand">
          <Crown />
          <span><b>ROYAL PALACE</b><small>HOTEL & RESORT</small></span>
        </div>
        <div>
          <h2>Create the<br/><em>first admin.</em></h2>
          <p>Your hotel setup begins here. Only one account can be created.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Crown className="auth-crown" />
        <span className="eyebrow">FIRST-TIME SETUP</span>
        <h1>Setup admin</h1>
        <p>This account will manage everything at Royal Palace.</p>

        <label>Full name
          <input required value={form.fullName} onChange={update("fullName")} placeholder="Admin name"/>
        </label>
        <label>Email address
          <input type="email" required value={form.email} onChange={update("email")} placeholder="admin@example.com"/>
        </label>
        <label>Phone (optional)
          <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+251..."/>
        </label>
        <label>Password
          <input type="password" required minLength="8" value={form.password} onChange={update("password")} placeholder="At least 8 characters"/>
        </label>

        {error && <small style={{ color: "#c05d5d" }}>{error}</small>}

        <button className="btn btn-gold full-width" disabled={loading}>
          {loading ? "Creating admin..." : "Create admin account"}
        </button>

        <Link className="text-link" to="/">Return to hotel website</Link>
      </form>
    </section>
  );
}