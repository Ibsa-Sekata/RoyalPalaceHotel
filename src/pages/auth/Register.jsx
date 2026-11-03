import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Crown, Eye, EyeOff } from "lucide-react";
import { authApi } from "../../api/authApi.js";
import { useAuth } from "../../context/useAuth.js";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await authApi.register(form.fullName, form.email, form.password, form.phone);
      await login(form.email, form.password);
      navigate("/my-bookings");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-photo">
        <div className="brand">
          <Crown />
          <span><b>ROYAL PALACE</b><small>HOTEL & RESORT</small></span>
        </div>
        <div>
          <h2>Your journey<br/><em>starts here.</em></h2>
          <p>Create an account for a more personal stay.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Crown className="auth-crown" />
        <h1>Create account</h1>
        <p>Join us for a more personal experience.</p>

        <label>Full name
          <input required value={form.fullName} onChange={update("fullName")} placeholder="Your full name"/>
        </label>
        <label>Email address
          <input type="email" required value={form.email} onChange={update("email")} placeholder="you@example.com"/>
        </label>
        <label>Phone (optional)
          <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+251..."/>
        </label>
        <label>Password
          <div className="password-wrap">
            <input type={showPassword ? "text" : "password"} required minLength="8" value={form.password} onChange={update("password")} placeholder="At least 8 characters"/>
            <button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        {error && <small style={{ color: "#c05d5d" }}>{error}</small>}

        <button className="btn btn-gold full-width" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
        <p className="form-note">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </section>
  );
}