import { useCallback, useEffect, useState } from "react";
import "./adminPages.css";

const API = "http://localhost:5000/api";

export default function RiskBasedBlocking() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState(null);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API}/admin/risk-based-blocking`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Unable to load risk records.");
      setRecords(result.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  async function blockCustomer(record) {
    const customer = record.customer;
    if (!customer?.id || customer.isLocked) return;
    const reason = `Risk-based security block. Risk score: ${record.score}/100; level: ${record.level}; reasons: ${Array.isArray(record.reasons) ? record.reasons.join(", ") : "Risk rule triggered"}.`;
    if (!window.confirm(`Block ${customer.fullName || "this customer"}? They will be unable to use their account until an admin unblocks them.`)) return;
    setBusyId(record.id);
    setMessage("");
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API}/admin/customers/${customer.id}/block`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.message || "Could not block customer.");
      setMessage(`${customer.fullName || "Customer"} has been blocked successfully.`);
      await loadRecords();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  }

  const riskColor = (level) => level === "HIGH" ? "#b42318" : level === "MEDIUM" ? "#b54708" : "#067647";
  const reasonText = (reasons) => Array.isArray(reasons) ? reasons.join(", ") : typeof reasons === "string" ? reasons : "No reason details";

  return (
    <div>
      <div className="page-heading">
        <div>
          <h2>Risk-Based Transaction Blocking</h2>
          <p>Review transaction risk scores and decide whether a high-risk customer account should be blocked.</p>
        </div>
        <button className="green-button" onClick={loadRecords} disabled={loading}>Refresh</button>
      </div>

      <div className="admin-card" style={{ marginBottom: 18 }}>
        <h3>How Risk Analysis Works</h3>
        <p><strong>High transaction amount:</strong> BDT 100,000 or more adds 35 risk points.</p>
        <p><strong>High transaction frequency:</strong> 5 or more transactions in the previous hour adds 30 points.</p>
        <p><strong>High hourly volume:</strong> Previous hourly total plus this transfer reaching BDT 200,000 adds 25 points.</p>
        <p><strong>Decision:</strong> 0–29 = Low (allow), 30–59 = Medium (OTP verification), 60+ = High (automatically block that transfer).</p>
        <p className="muted">Admin can review the recorded risk events below and manually block the customer's account. Medium/Low risk records are not automatically blocked.</p>
      </div>

      {error && <div className="form-error" style={{ marginBottom: 12 }}>{error}</div>}
      {message && <div className="form-success" style={{ marginBottom: 12 }}>{message}</div>}

      <div className="admin-card">
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <h3>Transaction Risk Records</h3>
          <span className="muted">Latest 200 records</span>
        </div>
        {loading ? <p>Loading risk records…</p> : records.length === 0 ? <p>No transaction risk records found yet.</p> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 850 }}>
              <thead><tr>{["Date", "Customer", "Account", "Risk Score", "Level", "Reasons", "Decision", "Action"].map((heading) => <th key={heading} style={{ textAlign: "left", padding: 10, borderBottom: "1px solid #ddd" }}>{heading}</th>)}</tr></thead>
              <tbody>{records.map((record) => <tr key={record.id}>
                <td style={{ padding: 10, borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>{new Date(record.createdAt).toLocaleString()}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{record.customer?.fullName || `Customer #${record.customerId}`}<br/><small>{record.customer?.mobileNumber || ""}</small></td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{record.account?.accountNumber || `Account #${record.accountId}`}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee", fontWeight: 700 }}>{record.score}/100</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee", color: riskColor(record.level), fontWeight: 700 }}>{record.level}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee", minWidth: 180 }}>{reasonText(record.reasons)}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{record.decision}</td>
                <td style={{ padding: 10, borderBottom: "1px solid #eee" }}>{!record.customer ? "—" : record.customer.isLocked ? <span style={{ color: "#b42318", fontWeight: 700 }}>Blocked</span> : <button className="danger-button" disabled={busyId === record.id} onClick={() => blockCustomer(record)}>{busyId === record.id ? "Blocking…" : "Block Account"}</button>}</td>
              </tr>)}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
