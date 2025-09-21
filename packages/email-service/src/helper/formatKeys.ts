export const TTL_SUFFIX = ":ttl";

export const listKey = (userId: string) => `bets:${userId}`;
export const ttlKey = (userId: string) => `bets:${userId}${TTL_SUFFIX}`;
