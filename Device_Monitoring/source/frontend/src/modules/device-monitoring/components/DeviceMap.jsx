
export default function DeviceMap({ latitude, longitude, accuracy }) {
  const validCoordinates =
    Number.isFinite(Number(latitude)) &&
    Number.isFinite(Number(longitude)) &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

  if (!validCoordinates) {
    return (
      <div className="dm-map-placeholder">
        GPS location is not available
      </div>
    );
  }

  const mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

  return (
    <div className="dm-map-container">
      <iframe
        title="Device GPS Location"
        src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="dm-map-frame"
      />

      <div className="dm-map-info">
        <p><strong>Latitude:</strong> {latitude}</p>
        <p><strong>Longitude:</strong> {longitude}</p>
        <p><strong>Accuracy:</strong> {accuracy ?? "Unknown"} meters</p>

        <a href={mapUrl} target="_blank" rel="noopener noreferrer">
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
