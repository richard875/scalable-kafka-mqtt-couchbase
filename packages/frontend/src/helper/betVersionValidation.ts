import BetV1 from "@fdj/shared/types/kafka/betV1";

const VALID_VERSION = "v1";

const betVersionValidation = (payload: BetV1): string | null => {
  if (payload.version !== VALID_VERSION) return null;

  const message = payload.payload;
  return `Bet placed on ${message.team}: $${message.amount} on ${message.name} at odds of ${message.price} 🎯`;
};

export default betVersionValidation;
