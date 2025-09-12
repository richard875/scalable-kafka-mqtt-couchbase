import dotenv from "dotenv";
dotenv.config();

export const MQTT_URL =
  process.env.MQTT_BROKER_URL || process.env.MQTT_URL || "mqtt://localhost:1883";
