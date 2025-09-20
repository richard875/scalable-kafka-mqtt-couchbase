import BetV1 from "@fdj/shared/types/kafka/betV1";

const VALID_VERSION = "v1";

const betVersionValidation = (payload: BetV1): string | null => {
  if (payload.version !== VALID_VERSION) {
    const warningMsg = `Unsupported bet version: ${payload.version}, expected: ${VALID_VERSION} - ignoring message.`;
    console.warn(warningMsg);
    return null;
  }

  const message = payload.payload;
  return `Bet placed on ${message.team}: $${message.amount} on ${message.name} at odds of ${message.price} 🎯`;
};

export default betVersionValidation;
