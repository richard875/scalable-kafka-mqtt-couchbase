export const handleMessage = async (topic: string, message: unknown): Promise<void> => {
  console.log(`Received message on topic ${topic}:`, message);
};
