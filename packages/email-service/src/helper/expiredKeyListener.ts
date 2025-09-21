import processBets from "./processBets.js";
import { TTL_SUFFIX } from "./formatKeys.js";

const expiredKeyListener = async (expiredKey: string): Promise<void> => {
  if (!expiredKey.endsWith(TTL_SUFFIX)) return;

  const userId = expiredKey.split(":")[1];
  console.log(`⌛ TTL expired for user ${userId}, flushing bets`);
  await processBets(userId);
};

export default expiredKeyListener;
