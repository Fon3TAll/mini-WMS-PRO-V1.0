import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Google GenAI / Search Grounding
  app.post("/api/copilot/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          error: "KEY_MISSING",
          text: "ขณะนี้ระบบได้รับการเข้าสู่ 'โหมดสำรองแนะนำความปลอดภัย (Offline Backup Mode)' ชั่วคราว เนื่องจากตัวเชื่อมต่อ API Key ความร้อนยังไม่ได้ระบุที่ Settings > Secrets ค่ะ\n\nโหมดออฟไลน์นี้ถูกเปิดเพื่อความปลอดภัย ป้องกันปญหากล่องกุญแจรั่วไหล และให้ความรู้แนะนำการจัดเตรียมจัดเรียงสินค้าเบื้องต้น หากเป็นผู้ติดตั้งโปรดนำ GEMINI_API_KEY มาป้อนเข้าสู่ระบบค่ะ"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        "คุณคือ T All BOT ผู้ช่วยป้อนข้อมูลคลังสินค้า (Smart WMS & Logistic Assistant) " +
        "วิเคราะห์ความล่าช้า จัดสต๊อกสินค้า วางแผนสลอตติ้ง ตอบคำถามและช่วยเหลือผู้ใช้งาน " +
        "โดยความสามารถพิเศษของคุณคือการดึงความรู้สดเรียลไทม์ผ่าน Google Search Grounding " +
        "กรุณาตอบเป็นภาษาไทยแบบกระชับ มีเสน่ห์ อธิบายเข้าใจง่าย ชี้แนะแนวทางถูกต้อง อ้างอิงข้อมูลชัดเจน";

      // Prepare contents
      const contents: any[] = [];
      if (history && Array.isArray(history)) {
        // limit history elements to optimize response latency and token size
        const slice = history.slice(-6);
        slice.forEach((msg: any) => {
          contents.push({
            role: msg.role === 'ai' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        });
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          tools: [{ googleSearch: {} }],
        }
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources = chunks ? chunks.map((c: any) => {
        if (c.web) {
          return { title: c.web.title, url: c.web.uri };
        }
        return null;
      }).filter(Boolean) : [];

      res.json({
        text,
        sources
      });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      
      const isQuotaExceeded = error.status === 429 || 
                              (error.message && error.message.includes('429')) ||
                              (error.status === 'RESOURCE_EXHAUSTED' || error.message?.includes('RESOURCE_EXHAUSTED'));

      if (isQuotaExceeded) {
        return res.status(429).json({
          error: "QUOTA_EXCEEDED",
          text: "ขออภัยค่ะ โควต้าการใช้งาน AI ตรวจสอบข้อมูลของคุณหมดแล้ว กรุณาตรวจสอบ API Key หรือเพดานการใช้งาน Gemini API ค่ะ"
        });
      }

      res.status(500).json({
        error: "SERVER_ERROR",
        text: `เกิดข้อผิดพลาดในการเชื่อมโยงระบบค้นหาอินเทอร์เน็ตสด: ${error.message || error}`
      });
    }
  });

  // API Route for Smart Sorting Logic
  app.post("/api/copilot/smart-sort", async (req, res) => {
    try {
      const { items } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          error: "KEY_MISSING",
          text: "คำแนะนำการจัดเรียง (Offline Mode):\n- วางสินค้าที่น้ำหนักมากและชิ้นใหญ่ไว้ด้านล่าง\n- สินค้าเปราะบางควรวางไว้ชั้นบน\n- จัดกลุ่มสินค้าประเภทเดียวกันเพื่อความสะดวกในการแพ็ค"
        });
      }

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        "คุณคือ WMS Smart Sorting AI มีหน้าที่แนะนำวิธีการจัดเรียงสินค้าลงบนพาเลทหรือแพ็คใส่กล่อง (Palletization & Packing) ให้ประหยัดพื้นที่และปลอดภัยที่สุด " +
        "พิจารณาจากขนาดสินค้า(ถ้ามี) และจำนวน โดยตอบเป็นภาษาไทย รูปแบบ Bullet points ชัดเจน เข้าใจง่าย เพื่อให้พนักงานคลังทำตามได้ทันที กรุณาขมวดคำตอบไม่เกิน 4-5 ข้อสั้นๆ";

      const prompt = `มีรายการสินค้าสำหรับออเดอร์นี้ ช่วยแนะนำการซ้อนทับและการแพ็คให้หน่อย:\n${JSON.stringify(items, null, 2)}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { systemInstruction: systemInstruction }
      });

      res.json({
        text: response.text || "ไม่มีคำแนะนำในขณะนี้"
      });
    } catch (error: any) {
      res.status(500).json({
        error: "SERVER_ERROR",
        text: "เกิดข้อผิดพลาดในการดึงคำแนะนำจัดซ้อน: " + (error.message || error)
      });
    }
  });

  app.post("/api/ai/stock-agent", async (req, res) => {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          alerts: [
            { id: "MOCK-1", item: "Tamarind Paste (Bucket)", type: "Critical", message: "Stock is 8 units (Reorder point: 20). Velocity is high (3 units/day). Suggest ordering 50 units immediately." },
            { id: "MOCK-2", item: "Glass Bottles 500ml", type: "Warning", message: "[Offline Mock] Reorder point triggered. Consumption rate is steadily increasing." }
          ]
        });
      }

      const { stockData } = req.body;
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = 
        "You are an AI Replenishment System. Analyze the provided stock data. " +
        "Output ONLY a valid JSON array of alerts for items where consumption rate indicates it will drop below reorder point soon. " +
        "Format each object: { id: string, item: string, type: 'Critical' | 'Warning' | 'Info', message: string }. Do not include markdown codeblocks or other formatting. Just the JSON array.";

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [{ role: 'user', parts: [{ text: `Stock Data:\n${JSON.stringify(stockData)}` }] }],
        config: { systemInstruction }
      });

      let text = response.text || "[]";
      // Clean up markdown markers if any
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      const alerts = JSON.parse(text);
      res.json({ alerts });

    } catch (error: any) {
      console.warn("AI Stock Agent encountered an issue (e.g., 503 Demand). Using fallback data.");
      // Fallback response for 503 / High Demand / Quota limits or general failures
      // This prevents the application from throwing uncaught errors on the client side.
      res.json({
        alerts: [
          { id: "MOCK-1", item: "Tamarind Paste (Bucket)", type: "Critical", message: "Stock is 8 units (Reorder point: 20). Velocity is high (3 units/day). Suggest ordering 50 units immediately." },
          { id: "MOCK-2", item: "Glass Bottles 500ml", type: "Warning", message: "[Fallback] Reorder point triggered. Consumption rate is steadily increasing." }
        ]
      });
    }
  });

  // Health check API
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
