import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/askRoutes.js";
import db from "./config/db.js";
import cron from "node-cron";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/api", routes);

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

const PORT = process.env.PORT || 3000;

cron.schedule("*/1 * * * *", async () => {
  const url = "https://chatbot-bgq3.onrender.com/ping";
  console.log(`[CRON] Self-ping at ${new Date().toLocaleTimeString()}`);

  try {
    const response = await fetch(url);
    if (response.ok) {
      console.log("✅ Self-ping successful.");
    } else {
      console.error("⚠️ Self-ping failed with status:", response.status);
    }
  } catch (error) {
    console.error("❌ Self-ping error:", error.message);
  }
});


app.listen(PORT, async () => {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connected to the database successfully.");
    console.log(`🚀 Server is running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
});
