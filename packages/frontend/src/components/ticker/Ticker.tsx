import { useState } from "react";
import useMqtt from "@/hooks/useMqtt";
import SportsEnum from "@fdj/shared/enums/sportsEnum";
import type SlipItem from "@fdj/shared/types/slipItem";

const Ticker = () => {
  const [message, setMessage] = useState<string>("");
  const { isConnected, error } = useMqtt({
    topics: Object.values(SportsEnum),
    onMessage: (message: string) => {
      try {
        const payload = JSON.parse(message) as SlipItem;
        const msg = `Bet placed on ${payload.team}: $${payload.amount} on ${payload.name} at odds of ${payload.price} 🎯`;
        setMessage(msg);
      } catch (err) {
        console.log("MQTT message parse error:", message, "Error:", err);
      }
    },
  });

  if (isConnected) console.log("🟢 MQTT connected - listening for sports updates");
  if (error) console.error("🔴 MQTT connection error:", error);

  return (
    <div className="w-full h-9.5 bg-gray-100 border-b border-gray-300 flex font-smoothing">
      <div className="w-full max-w-[1600px] px-4.5 m-auto flex items-center justify-between font-medium">
        <div className="text-sm text-[#333333]">
          <span>Latest Updates:</span>
          <span>&nbsp;</span>
          <span className="">{message}</span>
        </div>
        <div className="flex items-center gap-1.5 select-none">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span className="text-xs text-[#808080]">
            {isConnected ? "Connected" : error ? `Error: ${error}` : "Not Connected"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
