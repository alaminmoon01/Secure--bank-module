import { useEffect, useMemo, useState } from "react";
import "./adminPages.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const dateText = value => value ? new Date(value).toLocaleString("en-BD", { dateStyle: "medium", timeStyle: "short" }) : "—";
const money = value => new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT" }).format(Number(value || 0));

export default function ActivityHistory() {
  const [data, setData] = useState({ loginActivities: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("logins");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  async function load() {
    setLoading(true); setError("");
    try {
      const response = await fetch(`${API}/admin/security/overview`, { headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Could not load activity history.");
      setData({ loginActivities: result.data.loginActivities || [], transactions: result.data.transactions || [] });
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  const logins = useMemo(() => data.loginActivities.filter(x => (status === "ALL" || (status === "SUCCESS" ? x.success : !x.success)) && `${x.mobileNumber} ${x.customer?.fullName || ""} ${x.ipAddress || ""}`.toLowerCase().includes(search.toLowerCase())), [data, status, search]);
  const transactions = useMemo(() => data.transactions.filter(x => (status === "ALL" || x.status === status) && `${x.transactionId} ${x.account?.customer?.fullName || ""} ${x.account?.accountNumber || ""} ${x.recipientAccount || ""}`.toLowerCase().includes(search.toLowerCase())), [data, status, search]);

  return <div className="activity-history-page">
    <div className="page-heading"><div><h2>Login & Transaction History</h2><p>Administrative view of recorded customer login activity and banking transactions.</p></div><button className="green-button" onClick={load}>↻ Refresh</button></div>
    <div className="admin-stat-grid"><div className="admin-stat"><p>Login records</p><h3>{data.loginActivities.length}</h3><small>Recorded login attempts</small></div><div className="admin-stat"><p>Transactions</p><h3>{data.transactions.length}</h3><small>Recorded transaction entries</small></div><div className="admin-stat"><p>Successful logins</p><h3>{data.loginActivities.filter(x=>x.success).length}</h3><small>Verified successful attempts</small></div></div>
    <div className="admin-card" style={{marginTop:18}}>
      <div className="activity-history-controls"><div className="activity-tabs"><button className={tab==="logins"?"active":""} onClick={()=>{setTab("logins");setStatus("ALL")}}>Login activity</button><button className={tab==="transactions"?"active":""} onClick={()=>{setTab("transactions");setStatus("ALL")}}>Transaction history</button></div><input aria-label="Search activity" placeholder="Search customer, account, IP or transaction..." value={search} onChange={e=>setSearch(e.target.value)}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="ALL">All statuses</option>{(tab==="logins"?["SUCCESS","FAILED"]:["SUCCESS","PENDING","BLOCKED","FAILED"]).map(x=><option key={x} value={x}>{x}</option>)}</select></div>
      {loading ? <p>Loading activity records...</p> : error ? <div className="form-error">{error} <button onClick={load}>Retry</button></div> : tab==="logins" ? <div className="table-responsive"><table className="admin-table"><thead><tr><th>Date & time</th><th>Customer</th><th>Mobile</th><th>IP address</th><th>Status</th><th>Reason</th></tr></thead><tbody>{logins.map(x=><tr key={x.id}><td>{dateText(x.createdAt)}</td><td>{x.customer?.fullName || "Unmatched customer"}</td><td>{x.mobileNumber}</td><td>{x.ipAddress || "—"}</td><td><span className={`status-tag ${x.success?"success":"danger"}`}>{x.success?"SUCCESS":"FAILED"}</span></td><td>{x.reason || "—"}</td></tr>)}</tbody></table>{!logins.length&&<p>No matching login records.</p>}</div> : <div className="table-responsive"><table className="admin-table"><thead><tr><th>Date & time</th><th>Transaction ID</th><th>Customer</th><th>From account</th><th>Recipient</th><th>Type</th><th>Amount</th><th>Status</th></tr></thead><tbody>{transactions.map(x=><tr key={x.id}><td>{dateText(x.createdAt)}</td><td>{x.transactionId}</td><td>{x.account?.customer?.fullName || "—"}</td><td>{x.account?.accountNumber || "—"}</td><td>{x.recipientAccount || "—"}</td><td>{x.type}</td><td>{money(x.amount)}</td><td>{x.status}</td></tr>)}</tbody></table>{!transactions.length&&<p>No matching transaction records.</p>}</div>}
    </div>
  </div>;
}
