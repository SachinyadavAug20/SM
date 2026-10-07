import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function CommitteeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [members, setMembers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsedUser = JSON.parse(stored);
    if (parsedUser.role !== "COMMITTEE") {
      router.push("/");
      return;
    }
    setUser(parsedUser);
    loadCommitteeData();
  }, []);

  const loadCommitteeData = async () => {
    try {
      const resMembers = await fetch("http://localhost:8080/api/committee/members");
      if (resMembers.ok) {
        const membersData = await resMembers.json();
        setMembers(membersData);
      }

      const resComplaints = await fetch("http://localhost:8080/api/committee/complaints");
      if (resComplaints.ok) {
        const complaintsData = await resComplaints.json();
        setComplaints(complaintsData);
      }

      const resNotices = await fetch("http://localhost:8080/api/committee/notices");
      if (resNotices.ok) {
        const noticesData = await resNotices.json();
        setNotices(noticesData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveComplaint = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/committee/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "RESOLVED" }),
      });
      if (res.ok) {
        setMessage("Complaint marked as resolved.");
        loadCommitteeData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotice = async (e) => {
    e.preventDefault();
    if (!noticeTitle || !noticeContent) return;

    try {
      const res = await fetch("http://localhost:8080/api/committee/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noticeTitle,
          content: noticeContent,
        }),
      });

      if (res.ok) {
        setNoticeTitle("");
        setNoticeContent("");
        setMessage("Notice posted successfully to all members.");
        loadCommitteeData();
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

  const paidCount = members.filter((m) => m.maintenancePaid).length;
  const pendingCount = members.length - paidCount;
  const pendingComplaintsCount = complaints.filter((c) => c.status === "PENDING").length;

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-brand">Society Management System - Committee Panel</span>
        <div className="navbar-user">
          <span>{user.name}</span>
          <button className="btn btn-outline" onClick={handleLogout} style={{ padding: "6px 12px", fontSize: "12px" }}>
            Logout
          </button>
        </div>
      </nav>

      <div className="container">
        {message && <div className="alert alert-success">{message}</div>}

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Members</div>
            <div className="stat-number">{members.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Bills Paid</div>
            <div className="stat-number" style={{ color: "#28a745" }}>{paidCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Bills Pending</div>
            <div className="stat-number" style={{ color: "#dc3545" }}>{pendingCount}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Open Complaints</div>
            <div className="stat-number" style={{ color: "#fd7e14" }}>{pendingComplaintsCount}</div>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Society Members & Maintenance Bills</h3>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Flat No</th>
                  <th>Member Name</th>
                  <th>Email</th>
                  <th>Maintenance Bill</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: "600" }}>{m.flatNumber}</td>
                    <td>{m.name}</td>
                    <td>{m.email}</td>
                    <td>Rs. {m.maintenanceAmount}</td>
                    <td>
                      <span className={`badge ${m.maintenancePaid ? "badge-paid" : "badge-pending"}`}>
                        {m.maintenancePaid ? "PAID" : "PENDING"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid-2">
          <div className="card">
            <h3 className="card-title">Latest Member Complaints</h3>
            {complaints.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#6c757d" }}>No complaints recorded.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {complaints.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: "12px",
                      border: "1px solid #e9ecef",
                      borderRadius: "6px",
                      backgroundColor: c.status === "PENDING" ? "#fffdf5" : "#ffffff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <div>
                        <span style={{ fontWeight: "600", fontSize: "15px" }}>{c.title}</span>
                        <span style={{ fontSize: "12px", color: "#6c757d", marginLeft: "8px" }}>
                          ({c.memberName} - Flat {c.flatNumber})
                        </span>
                      </div>
                      <span className={`badge ${c.status === "RESOLVED" ? "badge-resolved" : "badge-pending"}`}>
                        {c.status}
                      </span>
                    </div>
                    <p style={{ fontSize: "13px", color: "#495057", marginBottom: "8px" }}>{c.description}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "#868e96" }}>{c.createdAt}</span>
                      {c.status === "PENDING" && (
                        <button
                          className="btn btn-success"
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                          onClick={() => handleResolveComplaint(c.id)}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="card">
              <h3 className="card-title">Send Notice to All Members</h3>
              <form onSubmit={handleSendNotice}>
                <div className="form-group">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lift maintenance schedule"
                    required
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notice Content</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Write notice details for society members..."
                    required
                    value={noticeContent}
                    onChange={(e) => setNoticeContent(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
                  Publish Notice
                </button>
              </form>
            </div>

            <div className="card">
              <h3 className="card-title">Published Notices</h3>
              {notices.length === 0 ? (
                <p style={{ fontSize: "14px", color: "#6c757d" }}>No notices posted yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {notices.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: "12px",
                        backgroundColor: "#f8f9fa",
                        borderLeft: "4px solid #1a73e8",
                        borderRadius: "4px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "600", fontSize: "14px" }}>{n.title}</span>
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
