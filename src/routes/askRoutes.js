import express from "express";
import generateSQL from "../openai/helper.js";
import db from "../config/db.js";

const router = express.Router();

router.post("/ask", async (req, res) => {
  const { question } = req.body;
  console.log("question", question);

  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ error: "Question is required and must be a string." });
  }

  try {
    const sqlQuery = await generateSQL(question);
    console.log("Generated SQL Query:", sqlQuery);

    // Check if question was previously asked
    // const [rows] = await db.query("SELECT * FROM queries WHERE question = ?", [
    //   question,
    // ]);

    // if (rows.length > 0) {
    //   return res.json({ result: JSON.parse(rows[0].answer) });
    // }

    // Execute the generated query
    const [queryResult] = await db.query(sqlQuery);

    // Save the result
    // await db.query("INSERT INTO queries (question, answer) VALUES (?, ?)", [
    //   question,
    //   JSON.stringify(queryResult),
    // ]);

    return res.json({ result: queryResult });
  } catch (error) {
    console.error("Error processing request:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while processing the query." });
  }
});

export default router;
