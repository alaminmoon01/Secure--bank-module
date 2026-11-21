
export function getDeviceInfo() {
  const ua = navigator.userAgent;

  let browser = "Unknown";
  let browserVersion = "Unknown";

  if (/Edg\//.test(ua)) {
    browser = "Microsoft Edge";
    browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Chrome\//.test(ua)) {
    browser = "Google Chrome";
    browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Firefox\//.test(ua)) {
    browser = "Mozilla Firefox";
    browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || "Unknown";
  } else if (/Safari\//.test(ua)) {
    browser = "Safari";
    browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || "Unknown";
  }

  let operatingSystem = "Unknown";

  if (/Windows NT/i.test(ua)) operatingSystem = "Windows";
  else if (/Android/i.test(ua)) operatingSystem = "Android";
  else if (/iPhone|iPad|iPod/i.test(ua)) operatingSystem = "iOS";
  else if (/Mac OS X/i.test(ua)) operatingSystem = "macOS";
  else if (/Linux/i.test(ua)) operatingSystem = "Linux";

  const deviceType = /iPad|Tablet/i.test(ua)
    ? "Tablet"
    : /Mobi|Android|iPhone/i.test(ua)
      ? "Mobile"
      : "Desktop";

  return {
    deviceName: `${operatingSystem} ${deviceType}`,
    deviceType,
    operatingSystem,
    browser,
    browserVersion,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language || "Unknown",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    userAgent: ua,
    collectedAt: new Date().toISOString(),
  };
}
