import { z } from "zod";

const SlipItemSchema = z.object({
  id: z.string().min(1, "ID is required"),
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  price: z.number().positive("Price must be positive"),
  key: z.string().min(1, "Key is required"),
  team: z.string().min(1, "Team is required"),
  amount: z.number().positive("Amount must be positive"),
  isLast: z.boolean(),
});

export default SlipItemSchema;
