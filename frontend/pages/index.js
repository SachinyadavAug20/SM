import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState("MEMBER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fillDemo = (selectedRole) => {
    setRole(selectedRole);
    if (selectedRole === "MEMBER") {
      setEmail("sachin@society.com");
      setPassword("sachin123");
    } else {
      setEmail("admin@society.com");
      setPassword("admin123");
    }
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Invalid credentials. Please try again.");
        setLoading(false);
        return;
      }

      const user = await res.json();
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "MEMBER") {
        router.push("/member");
      } else {
        router.push("/committee");
      }
    } catch (err) {
      setError("Cannot connect to backend server. Make sure Spring Boot is running on port 8080.");
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Society Management System</span>
      </nav>

      <div className="container" style={{ maxWidth: "460px", marginTop: "40px" }}>
        <div className="card">
          <h2 className="card-title" style={{ textAlign: "center", marginBottom: "20px" }}>
            Account Login
          </h2>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Select Role</label>
              <select
                className="form-control"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="MEMBER">Society Member</option>
                <option value="COMMITTEE">Committee Member</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="name@society.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e0e0e0" }}>
            <p style={{ fontSize: "12px", color: "#6c757d", marginBottom: "10px", textAlign: "center" }}>
              Quick Fill Demo Accounts
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, fontSize: "12px", padding: "8px" }}
                onClick={() => fillDemo("MEMBER")}
              >
                Member (sachin)
              </button>
              <button
                type="button"
                className="btn btn-outline"
                style={{ flex: 1, fontSize: "12px", padding: "8px" }}
                onClick={() => fillDemo("COMMITTEE")}
              >
                Committee (admin)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
