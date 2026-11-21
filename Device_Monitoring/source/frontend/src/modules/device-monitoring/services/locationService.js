
export function getCurrentGPSLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({
        permissionStatus: "UNSUPPORTED",
        latitude: null,
        longitude: null,
        accuracy: null,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          permissionStatus: "GRANTED",
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          collectedAt: new Date().toISOString(),
        });
      },
      (error) => {
        const status =
          error.code === error.PERMISSION_DENIED
            ? "DENIED"
            : error.code === error.TIMEOUT
              ? "TIMEOUT"
              : "UNAVAILABLE";

        resolve({
          permissionStatus: status,
          latitude: null,
          longitude: null,
          accuracy: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
}

export function watchGPSLocation(onSuccess, onError) {
  if (!navigator.geolocation) {
    onError("UNSUPPORTED");
    return null;
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        permissionStatus: "GRANTED",
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        collectedAt: new Date().toISOString(),
      });
    },
    (error) => {
      const status =
        error.code === error.PERMISSION_DENIED
          ? "DENIED"
          : error.code === error.TIMEOUT
            ? "TIMEOUT"
            : "UNAVAILABLE";

      onError(status);
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    }
  );
}

export function stopGPSLocation(watchId) {
  if (watchId !== null && watchId !== undefined) {
    navigator.geolocation?.clearWatch(watchId);
  }
}
