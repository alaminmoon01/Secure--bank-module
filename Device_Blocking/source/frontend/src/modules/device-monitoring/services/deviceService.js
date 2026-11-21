
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}, token) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Device API request failed");
  }

  return data;
}

export async function registerDevice(deviceInfo, token) {
  return request(
    "/device-monitoring/register",
    {
      method: "POST",
      body: JSON.stringify(deviceInfo),
    },
    token
  );
}

export async function updateDeviceLocation(location, token) {
  return request(
    "/device-monitoring/location",
    {
      method: "POST",
      body: JSON.stringify({ ...location, deviceFingerprint: localStorage.getItem("securebank_device_id") }),
    },
    token
  );
}

export async function getTrustedDevices(token) {
  return request(
    "/device-monitoring/devices",
    { method: "GET" },
    token
  );
}

export async function getDeviceHistory(deviceId, token) {
  return request(
    `/device-monitoring/devices/${encodeURIComponent(deviceId)}/history`,
    { method: "GET" },
    token
  );
}
