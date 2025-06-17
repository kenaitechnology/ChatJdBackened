import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import routes from "./routes/askRoutes.js";
import db from "./config/db.js";

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use("/api", routes);

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.query("SELECT 1");
    console.log("✅ Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to the database:", error.message);
    process.exit(1);
  }
}

startServer();

setInterval(() => {
  console.log(`[Keep-Alive] Server is running at ${new Date().toLocaleTimeString()}`);
}, 5 * 60 * 1000);
