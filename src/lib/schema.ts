import { z } from "zod";

export const formSchema = z.object({
  searchQuery: z.string().min(1).max(10),
});
