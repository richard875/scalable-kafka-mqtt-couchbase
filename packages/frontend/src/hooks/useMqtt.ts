import { useEffect, useState } from "react";
import mqtt from "mqtt";

const BROKER_URL = "ws://localhost:8081";

type UseMqttProps = {
  topics?: string[];
  onMessage?: (message: string) => void;
};

const useMqtt = ({ topics = [], onMessage }: UseMqttProps = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (topics.length === 0) return;

    const client = mqtt.connect(BROKER_URL, {
      clientId: `frontend_${Math.random().toString(16).slice(2)}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      setIsConnected(true);
      setError(null);

      client.subscribe(topics, err => {
        if (err) {
          console.error("Failed to subscribe to topics:", err);
          setError("Failed to subscribe to topics");
        } else console.log("Subscribed to topics:", topics);
      });
    });

    client.on("error", err => {
      console.error("MQTT connection error:", err);
      setError(err.message);
      setIsConnected(false);
    });

    client.on("disconnect", () => {
      console.log("Disconnected from MQTT broker");
      setIsConnected(false);
    });

    client.on("message", (_, message) => onMessage?.(message.toString()));

    return () => void client.end();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run once

  return { isConnected, error };
};

export default useMqtt;
