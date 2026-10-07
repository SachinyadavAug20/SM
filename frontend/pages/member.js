import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MemberDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== "MEMBER") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    loadMemberData(parsedUser.id);
  }, []);

  const loadMemberData = async (memberId) => {
    try {
      const resUser = await fetch(`http://localhost:8080/api/members/${memberId}`);
      if (resUser.ok) {
        const userData = await resUser.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      const resComplaints = await fetch(`http://localhost:8080/api/members/${memberId}/complaints`);
      if (resComplaints.ok) {
        const complaintsData = await resComplaints.json();
        setComplaints(complaintsData);
      }

      const resNotices = await fetch("http://localhost:8080/api/members/notices");
      if (resNotices.ok) {
        const noticesData = await resNotices.json();
        setNotices(noticesData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayMaintenance = async () => {
    window.open("https://pay.google.com", "_blank");
    try {
      const res = await fetch(`http://localhost:8080/api/members/${user.id}/pay`, {
        method: "POST",
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
        setMessage("Redirecting to Google Pay. Maintenance status updated to Paid.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      const res = await fetch("http://localhost:8080/api/members/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          flatNumber: user.flatNumber,
          memberName: user.name,
          memberId: user.id,
        }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setMessage("Complaint submitted successfully.");
        loadMemberData(user.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Society Management System</span>
        <div className="navbar-user">
          <span>{user.name} ({user.flatNumber})</span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "6px 12px", fontSize: "12px" }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {message && <div className="alert alert-success">{message}</div>}

        <div className="card">
          <h3 className="card-title">Maintenance Bill Details</h3>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <p style={{ fontSize: "14px", color: "#6c757d" }}>Flat Number</p>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>{user.flatNumber}</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6c757d" }}>Monthly Maintenance</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: "#1a73e8" }}>Rs. {user.maintenanceAmount}</p>
            </div>
            <div>
              <p style={{ fontSize: "14px", color: "#6c757d" }}>Payment Status</p>
              <span className={`badge ${user.maintenancePaid ? "badge-paid" : "badge-pending"}`}>
                {user.maintenancePaid ? "PAID" : "PENDING"}
              </span>
            </div>
            <div>
              {!user.maintenancePaid ? (
                <button className="btn btn-primary" onClick={handlePayMaintenance}>
                  Pay Maintenance (Google Pay)
                </button>
              ) : (
                <button className="btn btn-outline" disabled style={{ cursor: "default" }}>
                  Bill Settled
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid-2">
          <div>
            <div className="card">
              <h3 className="card-title">File a Complaint</h3>
              <form onSubmit={handleComplaintSubmit}>
                <div className="form-group">
                  <label className="form-label">Issue Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lift not working in Wing A"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Provide details of the problem..."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Submit Complaint
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="card-title">My Filed Complaints</h3>
              {complaints.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#6c757d" }}>No complaints registered yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {complaints.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: "12px",
                        border: "1px solid #e9ecef",
                        borderRadius: "6px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontWeight: "600", fontSize: "15px" }}>{item.title}</span>
                        <span className={`badge ${item.status === "RESOLVED" ? "badge-resolved" : "badge-pending"}`}>
                          {item.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#495057", marginBottom: "6px" }}>{item.description}</p>
                      <p style={{ fontSize: "12px", color: "#868e96" }}>Date: {item.createdAt}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card">
              <h3 className="card-title">Society Notice Board</h3>
              {notices.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#6c757d" }}>No notices posted yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "14px",
                        backgroundColor: "#f8f9fa",
                        borderLeft: "4px solid #1a73e8",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "600", fontSize: "15px" }}>{n.title}</span>
                        <span style={{ fontSize: "12px", color: "#868e96" }}>{n.postedDate}</span>
                      </div>
                      <p style={{ fontSize: "13px", color: "#495057" }}>{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
