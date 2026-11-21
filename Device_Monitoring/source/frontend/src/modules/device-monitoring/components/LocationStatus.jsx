
export default function LocationStatus({
  permissionStatus = "NOT_REQUESTED",
  location,
  onRequest,
  onStartLive,
  onStopLive,
  isLive = false,
}) {
  const statusText = {
    NOT_REQUESTED: "Location permission not requested",
    REQUESTING: "Requesting location permission...",
    GRANTED: "Location permission granted",
    DENIED: "Location permission denied",
    UNAVAILABLE: "Location unavailable",
    UNSUPPORTED: "GPS is not supported",
    TIMEOUT: "Location request timed out",
  };

  return (
    <div className="dm-location-card">
      <h3>GPS Location</h3>

      <p>
        Status: <strong>{statusText[permissionStatus] || permissionStatus}</strong>
      </p>

      {location?.latitude != null && (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <p>Accuracy: {location.accuracy} meters</p>
        </>
      )}

      <div className="dm-location-actions">
        <button
          type="button"
          onClick={onRequest}
          disabled={permissionStatus === "REQUESTING"}
        >
          Allow Location
        </button>

        {permissionStatus === "GRANTED" && (
          <>
            {!isLive ? (
              <button type="button" onClick={onStartLive}>
                Start Live Sharing
              </button>
            ) : (
              <button type="button" onClick={onStopLive}>
                Stop Live Sharing
              </button>
            )}
          </>
        )}
      </div>

      <small>
        Live location sharing works only while this page remains active.
        You can stop sharing at any time.
      </small>
    </div>
  );
}
