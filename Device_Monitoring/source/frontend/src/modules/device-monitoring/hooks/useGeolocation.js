
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getCurrentGPSLocation,
  watchGPSLocation,
  stopGPSLocation,
} from "../services/locationService";

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState("NOT_REQUESTED");
  const watchId = useRef(null);

  const requestLocation = useCallback(async () => {
    setPermissionStatus("REQUESTING");

    const result = await getCurrentGPSLocation();

    setLocation(result);
    setPermissionStatus(result.permissionStatus);

    return result;
  }, []);

  const startLiveLocation = useCallback(() => {
    if (watchId.current !== null) return;

    watchId.current = watchGPSLocation(
      (result) => {
        setLocation(result);
        setPermissionStatus("GRANTED");
      },
      (error) => {
        setPermissionStatus(error);
      }
    );
  }, []);

  const stopLiveLocation = useCallback(() => {
    if (watchId.current !== null) {
      stopGPSLocation(watchId.current);
      watchId.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopLiveLocation();
  }, [stopLiveLocation]);

  return {
    location,
    permissionStatus,
    requestLocation,
    startLiveLocation,
    stopLiveLocation,
  };
}
