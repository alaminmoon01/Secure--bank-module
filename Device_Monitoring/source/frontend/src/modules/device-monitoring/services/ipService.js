
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function getIPInformation(token) {
  const response = await fetch(
    `${API_URL}/device-monitoring/ip-info`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Unable to get IP information");
  }

  return data.data;
}
