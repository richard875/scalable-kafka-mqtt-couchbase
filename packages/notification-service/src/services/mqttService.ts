import mqtt from "mqtt";
import { MQTT_URL } from "../constants.js";

// Create MQTT client connection to FlashMQ
const clientId = `notification_service_${Math.random().toString(16).slice(2)}`;
const mqttClient = mqtt.connect(MQTT_URL, { clientId, clean: true, reconnectPeriod: 1000 });

mqttClient.on("connect", () => console.log("Connected to FlashMQ MQTT broker"));
mqttClient.on("error", error => console.error("MQTT connection error:", error));

const handleMessage = (topic: string, message: unknown): void => {
  // Publish message to MQTT topic for frontend consumption
  mqttClient.publish(topic, JSON.stringify(message), error => {
    if (error) console.error(`Failed to publish to MQTT topic ${topic}:`, error);
    else console.log(`Published message to MQTT topic: ${topic}`);
  });
};

export { mqttClient, handleMessage };
