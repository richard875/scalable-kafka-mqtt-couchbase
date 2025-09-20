import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useMqtt from "@/hooks/useMqtt";
import SportsEnum from "@fdj/shared/enums/sportsEnum";
import fadeAnimation from "@/constants/fadeAnimation";
import type BetV1 from "@fdj/shared/types/kafka/betV1";
import betVersionValidation from "@/helper/betVersionValidation";

const DEFAULT_MESSAGE = "Waiting for updates...";

const Ticker = () => {
  const [message, setMessage] = useState<string>(DEFAULT_MESSAGE);
  const { isConnected, error } = useMqtt({
    topics: Object.values(SportsEnum),
    onMessage: (message: string) => {
      try {
        const payload = JSON.parse(message) as BetV1;
        const msg = betVersionValidation(payload);
        if (msg) setMessage(msg);
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
          <AnimatePresence mode="wait">
            <motion.span
              key={message}
              {...fadeAnimation}
              className={message === DEFAULT_MESSAGE ? "animate-pulse" : ""}
            >
              {message}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-1.5 select-none">
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <AnimatePresence mode="wait">
            <motion.span key="con-status" {...fadeAnimation} className="text-xs text-[#808080]">
              {isConnected ? "Markets Live" : error ? `Error: ${error}` : "Connecting..."}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Ticker;
