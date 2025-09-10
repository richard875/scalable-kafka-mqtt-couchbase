import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { placeBet } from "./controllers/bettingController.js";

const app = new Hono();
app.use(cors());

app.get("/", c => c.text("Server is Healthy"));

app.post("/bet", placeBet);

serve({ fetch: app.fetch, port: 3000 }, info => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
