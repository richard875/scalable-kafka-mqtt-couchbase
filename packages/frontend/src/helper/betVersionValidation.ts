import BetV2 from "@fdj/shared/types/kafka/betV2";

const VALID_VERSION = "v2";

const betVersionValidation = (payload: BetV2): string | null => {
  if (payload.version !== VALID_VERSION) {
    const warningMsg = `Unsupported bet version: ${payload.version}, expected: ${VALID_VERSION} - ignoring message.`;
    console.warn(warningMsg);
    return null;
  }

  const message = payload.payload;
  return `Bet placed on ${message.info.team}: $${message.stats.amount} on ${message.info.name} at odds of ${message.stats.price} 🎯`;
};

export default betVersionValidation;
