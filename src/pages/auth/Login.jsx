import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Crown, Eye } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const user = await login(email, password);
      const from = location.state?.from;

      if (user.role === "ADMIN") {
        navigate(from && from.startsWith("/admin") ? from : "/admin");
      } else if (user.role === "GUEST") {
        navigate(from && (from.startsWith("/my-") || from === "/booking") ? from : "/my-bookings");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Login failed");
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
          <h2>Welcome to<br/><em>your next chapter.</em></h2>
          <p>Exceptional stays begin with a thoughtful welcome.</p>
        </div>
      </div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <Crown className="auth-crown" />
        <span className="eyebrow">SIGN IN</span>
        <h1>Welcome back</h1>
        <p>Sign in to your account.</p>

        <label>
          Email address
          <input type="email" required placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <div className="password-wrap">
            <input type="password" required placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <Eye size={16} />
          </div>
        </label>

        {error && <small style={{ color: "#c05d5d" }}>{error}</small>}

        <button className="btn btn-gold full-width" disabled={loading}>
          {loading ? "Signing inÃ¢â‚¬Â¦" : "Sign in"}
        </button>

        <Link className="text-link" to="/">Ã¢â€ Â Return to hotel website</Link>
      </form>
    </section>
  );
}