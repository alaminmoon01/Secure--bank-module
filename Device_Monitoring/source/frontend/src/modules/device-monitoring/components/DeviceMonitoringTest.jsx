
import { useState } from "react";

import useDeviceInfo from "../hooks/useDeviceInfo";
import useGeolocation from "../hooks/useGeolocation";

import { getIPInformation } from "../services/ipService";

import DeviceCard from "./DeviceCard";
import DeviceMap from "./DeviceMap";
import LocationStatus from "./LocationStatus";

import "../styles/DeviceMonitoring.css";

export default function DeviceMonitoringTest() {
  const { deviceInfo, isLoading } = useDeviceInfo();

  const {
    location,
    permissionStatus,
    requestLocation,
    startLiveLocation,
    stopLiveLocation,
  } = useGeolocation();

  const [ipInfo, setIpInfo] = useState(null);
  const [ipError, setIpError] = useState("");

  async function loadIPInformation() {
    try {
      setIpError("");

      const token = localStorage.getItem("token");

      const result = await getIPInformation(token);

      setIpInfo(result);
    } catch (error) {
      setIpError(error.message);
    }
  }

  if (isLoading) {
    return <p>Loading device information...</p>;
  }

  return (
    <section className="dm-monitoring-page">
      <h2>Device Monitoring</h2>

      <DeviceCard device={deviceInfo} />

      <div className="dm-location-card">
        <h3>IP Information</h3>

        <button type="button" onClick={loadIPInformation}>
          Load IP Information
        </button>

        {ipError && <p role="alert">{ipError}</p>}

        {ipInfo && (
          <>
            <p>IP: {ipInfo.ipAddress || "Unavailable"}</p>
            <p>Country: {ipInfo.country || "Unavailable"}</p>
            <p>City: {ipInfo.city || "Unavailable"}</p>
            <p>ISP: {ipInfo.isp || "Unavailable"}</p>
          </>
        )}
      </div>

      <LocationStatus
        permissionStatus={permissionStatus}
        location={location}
        onRequest={requestLocation}
        onStartLive={startLiveLocation}
        onStopLive={stopLiveLocation}
        isLive={false}
      />

      {location?.latitude != null && (
        <DeviceMap
          latitude={location.latitude}
          longitude={location.longitude}
          accuracy={location.accuracy}
        />
      )}
    </section>
  );
}
