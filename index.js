import express from "express";
import bodyParser from "body-parser";
import { Client } from "@gradio/client";

const app = express();
app.use(bodyParser.json());

const mjQuality =
  "masterpiece, best quality, ultra-detailed, hyper realistic, 8k, cinematic lighting, volumetric light, sharp focus, intricate details, photorealistic, trending on artstation, award winning photography, good anatomy, good composition, looks like DALL E 3, looks like Midjourney, looks like WOMBO DREAM, support all art styles";

app.post("/generate", async (req, res) => {
  const { prompt, negative } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(`[POST /generate] Request from IP: ${ip}`);
  try {
    const client = await Client.connect("stabilityai/stable-diffusion");
    const result = await client.predict("/infer", {
      prompt: `${prompt || "Hello!!"}, ${mjQuality}`,
      negative:
        negative ||
        "low quality, error image, low image, super low quality, blurry, pixelated",
      scale: 7,
    });
    res.json({
      author: "Herza",
      status: 200,
      data: result.data,
    });
  } catch (err) {
    res.json({
      author: "Herza",
      status: 500,
      data: { error: err.message },
    });
  }
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
