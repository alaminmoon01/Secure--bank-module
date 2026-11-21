import { useState } from "react";
import DeviceCard from "../../modules/device-monitoring/components/DeviceCard";
import "../../modules/device-monitoring/styles/DeviceMonitoring.css";
import "./adminPages.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const show = (value) => value === null || value === undefined || value === "" ? "Not available" : (typeof value === "object" ? JSON.stringify(value) : value);
const date = (value) => value ? new Date(value).toLocaleString() : "Not available";

function Info({ label, value, mono = false }) {
  return <div className="dm-info-item"><span>{label}</span><strong className={mono ? "dm-mono" : ""}>{show(value)}</strong></div>;
}

export default function DeviceManagement() {
  const [accountNumber, setAccountNumber] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function request(path, options = {}) {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("Admin session not found. Please sign in again.");
    const response = await fetch(`${API_URL}${path}`, { ...options, headers: { Authorization: `Bearer ${token}`, ...(options.body ? { "Content-Type": "application/json" } : {}), ...options.headers } });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.success === false) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
  }

  async function handleSearch(event) {
    event.preventDefault();
    const value = accountNumber.trim();
    if (!value) { setError("Please enter a bank account number."); setResult(null); return; }
    setLoading(true); setError(""); setNotice(""); setResult(null);
    try { const data = await request(`/admin/device-monitoring/account/${encodeURIComponent(value)}`); setResult(data.data); }
    catch (err) { setError(err.message || "Unable to connect to the server."); }
    finally { setLoading(false); }
  }

  async function changeCustomerAccess(block) {
    if (!result?.customer?.id) return;
    const reason = block ? window.prompt("Enter a reason for blocking this customer:", "Security review") : "";
    if (block && reason === null) return;
    setActionLoading(true); setError(""); setNotice("");
    try {
      const action = block ? "block" : "unblock";
      const data = await request(`/admin/customers/${result.customer.id}/${action}`, { method: "POST", ...(block ? { body: JSON.stringify({ reason: reason.trim() || "Blocked by bank administrator" }) } : {}) });
      setNotice(data.message || `Customer ${action} successful.`);
      const refreshed = await request(`/admin/device-monitoring/account/${encodeURIComponent(result.accountNumber)}`);
      setResult(refreshed.data);
    } catch (err) { setError(err.message || "Unable to update customer access."); }
    finally { setActionLoading(false); }
  }

  const customer = result?.customer;
  const blocked = Boolean(customer?.isLocked || !customer?.isActive);

  return (
    <section className="admin-page device-management-page dm-modern">
      <header className="admin-page-header"><div><h1>Device & Security Monitoring</h1><p>Search a bank account to review customer identity, registered devices, network details and consented GPS data.</p></div></header>
      <form className="dm-admin-search" onSubmit={handleSearch}>
        <label htmlFor="device-account-number">Search customer by account number</label>
        <div className="dm-admin-search-row"><input id="device-account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="e.g. SB17940600611939829" /><button type="submit" disabled={loading}>{loading ? "Searching…" : "Search customer"}</button></div>
      </form>
      {error && <div className="dm-admin-error" role="alert">{error}</div>}
      {notice && <div className="dm-admin-notice" role="status">{notice}</div>}

      {customer && <div className="dm-admin-results">
        <section className="dm-panel dm-customer-panel">
          <div className="dm-panel-heading"><div><span className="dm-eyebrow">CUSTOMER PROFILE</span><h2>{show(customer.fullName)}</h2><p className="dm-subtitle">Account {result.accountNumber}</p></div><span className={`dm-status-pill ${blocked ? "is-blocked" : "is-active"}`}>{blocked ? "BLOCKED" : "ACTIVE"}</span></div>
          <div className="dm-info-grid"><Info label="Mobile number" value={customer.mobileNumber}/><Info label="Email address" value={customer.email}/><Info label="Account status" value={result.accountStatus}/><Info label="Customer status" value={customer.isActive ? "Active" : "Inactive"}/><Info label="Account locked" value={customer.isLocked ? "Yes" : "No"}/><Info label="Lock reason" value={customer.lockReason}/></div>
          <div className="dm-access-actions"><div><strong>{blocked ? "Customer access is restricted" : "Customer access is enabled"}</strong><p>{blocked ? "This customer cannot log in or use protected customer APIs." : "You can block this customer if a security concern is identified."}</p></div>{blocked ? <button className="dm-unblock-btn" type="button" disabled={actionLoading} onClick={() => changeCustomerAccess(false)}>{actionLoading ? "Please wait…" : "Unblock customer"}</button> : <button className="dm-block-btn" type="button" disabled={actionLoading} onClick={() => changeCustomerAccess(true)}>{actionLoading ? "Please wait…" : "Block customer"}</button>}</div>
        </section>

        <div className="dm-section-title"><div><span className="dm-eyebrow">DEVICE INVENTORY</span><h2>Registered devices</h2></div><span className="dm-count">{customer.devices?.length || 0} device(s)</span></div>
        {customer.devices?.length ? customer.devices.map((device) => {
          const hasGPS = device.gpsLatitude != null && device.gpsLongitude != null;
          const gpsMap = hasGPS ? `https://www.google.com/maps?q=${device.gpsLatitude},${device.gpsLongitude}` : null;
          return <article className="dm-device-section" key={device.id}>
            <div className="dm-device-topline"><div><span className="dm-eyebrow">REGISTERED DEVICE</span><h3>{show(device.deviceName)}</h3><p>{show(device.deviceType)} · {show(device.operatingSystem)} · {show(device.browser)} {show(device.browserVersion)}</p></div><span className={`dm-status-pill ${String(device.status || "unknown").toLowerCase() === "approved" ? "is-active" : "is-muted"}`}>{show(device.status)}</span></div>
            <DeviceCard device={{ ...device, lastSeen: device.lastUsedAt || device.createdAt }} />
            <div className="dm-detail-grid">
              <section className="dm-detail-card"><h4><span>01</span> Network & IP intelligence</h4><div className="dm-info-grid"><Info label="IP address" value={device.ipAddress} mono/><Info label="Country" value={device.ipCountry}/><Info label="Region" value={device.ipRegion}/><Info label="City" value={device.ipCity}/><Info label="Internet provider" value={device.ipIsp}/><Info label="Approx. IP coordinates" value={device.ipLatitude != null && device.ipLongitude != null ? `${device.ipLatitude}, ${device.ipLongitude}` : "Not available"}/></div></section>
              <section className="dm-detail-card"><h4><span>02</span> GPS location & consent</h4><div className="dm-info-grid"><Info label="Latitude" value={device.gpsLatitude}/><Info label="Longitude" value={device.gpsLongitude}/><Info label="Accuracy" value={device.gpsAccuracy != null ? `${device.gpsAccuracy} meters` : null}/><Info label="Permission status" value={device.gpsPermissionStatus}/><Info label="GPS collected" value={date(device.gpsCollectedAt)}/></div>{hasGPS ? <div className="dm-map-actions"><a href={gpsMap} target="_blank" rel="noreferrer">Open GPS location in Google Maps ↗</a></div> : <p className="dm-muted-note">GPS coordinates are unavailable. The customer may have denied location permission or no location was collected.</p>}</section>
              {hasGPS && <div className="dm-map-frame-wrap"><iframe title={`GPS location for ${device.deviceName || "customer device"}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://maps.google.com/maps?q=${device.gpsLatitude},${device.gpsLongitude}&z=15&output=embed`}/></div>}
              <section className="dm-detail-card"><h4><span>03</span> Device fingerprint & configuration</h4><div className="dm-info-grid"><Info label="Screen resolution" value={device.screenResolution}/><Info label="Language" value={device.language}/><Info label="Timezone" value={device.timezone}/><Info label="Fingerprint" value={device.fingerprintHash} mono/><Info label="User agent" value={device.userAgent}/></div></section>
              <section className="dm-detail-card"><h4><span>04</span> Device activity & security</h4><div className="dm-info-grid"><Info label="First registered" value={date(device.createdAt)}/><Info label="Last seen" value={date(device.lastUsedAt)}/><Info label="Failed attempts" value={device.failedAttempts}/><Info label="Device locked" value={device.isLocked ? "Yes" : "No"}/><Info label="Device active" value={device.isActive ? "Yes" : "No"}/><Info label="Locked at" value={date(device.lockedAt)}/></div></section>
            </div>
          </article>;
        }) : <div className="dm-empty">No registered devices found for this customer.</div>}
      </div>}
    </section>
  );
}
