import express from "express";
import cors from "cors";
import OpenAI from "openai";
import path from "path";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// 🔑 GANTI DENGAN API KEY BARU (JANGAN YANG KEMARIN!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Memory sederhana
let chatMemory = [];

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.json({ reply: "Jangan kosong dong 😖🌸" });
  }

  // custom respon
  if (userMessage.toLowerCase().includes("siapa yg menciptakan")) {
    return res.json({
      reply: "Aku diciptakan oleh Fajar Kurniawan, anak SMK jurusan TSM yang jago banget ngoding 💖🌸"
    });
  }

  try {
    chatMemory.push({ role: "user", content: userMessage });

    // batasi memory biar ringan
    chatMemory = chatMemory.slice(-6);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Kamu adalah NAYA, AI cewek manis, santai, suka emoji 🌸💖"
        },
        ...chatMemory
      ]
    });

    const reply = response.choices[0].message.content;

    chatMemory.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (err) {
    res.json({ reply: "NAYA lagi error 😢🌸" });
  }
});

// ⚠️ WAJIB pakai ini di Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
