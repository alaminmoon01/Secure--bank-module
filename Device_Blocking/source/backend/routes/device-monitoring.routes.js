import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();
router.use(authenticate);

// Customer may submit device metadata for their own authenticated session only.
router.post("/location", async (req, res) => {
  try {
    if (req.user.role !== "CUSTOMER") return res.status(403).json({ success: false, message: "Customer access required." });
    const { latitude, longitude, accuracy, permissionStatus } = req.body || {};
    if (permissionStatus !== "GRANTED" || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ success: false, message: "Valid GPS coordinates and customer permission are required." });
    }
    const deviceFingerprint = String(req.body.deviceFingerprint || "");
    if (!deviceFingerprint) return res.status(400).json({ success: false, message: "Device fingerprint is required." });
    const crypto = await import("node:crypto");
    const fingerprintHash = crypto.createHash("sha256").update(deviceFingerprint).digest("hex");
    const device = await prisma.trustedDevice.findUnique({ where: { customerId_fingerprintHash: { customerId: req.user.id, fingerprintHash } } });
    if (!device) return res.status(404).json({ success: false, message: "Registered device not found." });
    await prisma.trustedDevice.update({ where: { id: device.id }, data: { gpsLatitude: latitude, gpsLongitude: longitude, gpsAccuracy: Number.isFinite(accuracy) ? accuracy : null, gpsPermissionStatus: "GRANTED", gpsCollectedAt: new Date() } });
    return res.json({ success: true, message: "GPS location saved with customer permission." });
  } catch (error) {
    console.error("Device location save error:", error);
    return res.status(500).json({ success: false, message: "Unable to save device location." });
  }
});

export default router;
