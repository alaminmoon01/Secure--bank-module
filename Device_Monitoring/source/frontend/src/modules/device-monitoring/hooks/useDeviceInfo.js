
import { useEffect, useState } from "react";
import { getDeviceInfo } from "../utils/deviceInfo";
import { getDeviceFingerprint } from "../utils/fingerprint";

export default function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState(null);

  useEffect(() => {
    try {
      const info = getDeviceInfo();

      setDeviceInfo({
        ...info,
        fingerprint: getDeviceFingerprint(),
      });
    } catch (error) {
      console.error("Device information error:", error);
    }
  }, []);

  return {
    deviceInfo,
    isLoading: deviceInfo === null,
  };
}
