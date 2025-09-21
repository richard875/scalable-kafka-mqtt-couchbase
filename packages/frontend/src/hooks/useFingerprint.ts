import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const useFingerprint = () => {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    const setFp = async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();

      setHash(visitorId);
    };

    setFp();
  }, []);

  return hash;
};

export default useFingerprint;
