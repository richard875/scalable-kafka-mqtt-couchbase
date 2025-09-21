import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const useFingerprint = () => {
  const [hash, setHash] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const setFp = async () => {
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();

        setHash(visitorId);
      } catch (error) {
        console.error("Failed to generate fingerprint:", error);
        // Fallback to a temporary ID if fingerprint fails
        setHash(`temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
      } finally {
        setIsLoading(false);
      }
    };

    setFp();
  }, []);

  return { hash, isLoading };
};

export default useFingerprint;
