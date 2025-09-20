type BatEnvelope<T> = {
  version: `v${number}`; // e.g., 'v1', 'v2'
  payload: T;
};

export default BatEnvelope;
