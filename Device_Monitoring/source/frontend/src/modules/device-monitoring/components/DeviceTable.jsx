
export default function DeviceTable({ devices = [], onSelect }) {
  return (
    <div className="dm-table-wrapper">
      <table className="dm-table">
        <thead>
          <tr>
            <th>Device</th>
            <th>Operating System</th>
            <th>Browser</th>
            <th>IP Address</th>
            <th>Status</th>
            <th>Last Seen</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {devices.length === 0 ? (
            <tr>
              <td colSpan="7" className="dm-empty">
                No devices found
              </td>
            </tr>
          ) : (
            devices.map((device) => (
              <tr key={device.id || device.fingerprintHash}>
                <td>{device.deviceName || "Unknown"}</td>
                <td>{device.operatingSystem || "Unknown"}</td>
                <td>{device.browser || "Unknown"}</td>
                <td>{device.ipAddress || "Unavailable"}</td>
                <td>
                  <span className={`dm-status ${String(device.status || "UNKNOWN").toLowerCase()}`}>
                    {device.status || "Unknown"}
                  </span>
                </td>
                <td>
                  {device.lastSeen
                    ? new Date(device.lastSeen).toLocaleString()
                    : "Unknown"}
                </td>
                <td>
                  <button
                    type="button"
                    className="dm-view-button"
                    onClick={() => onSelect?.(device)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
