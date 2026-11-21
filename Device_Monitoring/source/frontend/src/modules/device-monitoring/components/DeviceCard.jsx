
export default function DeviceCard({ device }) {
  if (!device) return null;

  return (
    <div className="dm-device-card">
      <div className="dm-device-card-header">
        <div>
          <h3>{device.deviceName || "Unknown Device"}</h3>
          <p>{device.deviceType || "Unknown Type"}</p>
        </div>

        <span className={`dm-status ${String(device.status || "UNKNOWN").toLowerCase()}`}>
          {device.status || "Unknown"}
        </span>
      </div>

      <div className="dm-device-details">
        <p><strong>OS:</strong> {device.operatingSystem || "Unknown"}</p>
        <p><strong>Browser:</strong> {device.browser || "Unknown"}</p>
        <p><strong>Browser Version:</strong> {device.browserVersion || "Unknown"}</p>
        <p><strong>IP Address:</strong> {device.ipAddress || "Not available"}</p>
        <p><strong>Location:</strong> {device.approximateLocation || "Not available"}</p>
        <p><strong>Last Seen:</strong> {device.lastSeen ? new Date(device.lastSeen).toLocaleString() : "Unknown"}</p>
      </div>
    </div>
  );
}
