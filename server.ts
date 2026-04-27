import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Mock API for resources
  app.get("/api/resources", (req, res) => {
    res.json([
      { id: "1", name: "Main Lecture Hall", type: "LECTURE_HALL", location: "Block A, Level 2", capacity: 250, status: "ACTIVE" },
      { id: "2", name: "Engineering Lab 4", type: "LAB", location: "Tower C, Ground Floor", capacity: 30, status: "ACTIVE" },
      { id: "3", name: "Conference Room B", type: "MEETING_ROOM", location: "Admin Wing", capacity: 15, status: "OUT_OF_SERVICE" },
      { id: "4", name: "Projector Set #42", type: "EQUIPMENT", location: "IT Helpdesk", capacity: 1, status: "ACTIVE" },
      { id: "5", name: "Bio-Chem Lab 2", type: "LAB", location: "Science Block", capacity: 40, status: "ACTIVE" },
    ]);
  });

  app.get("/api/bookings", (req, res) => {
    res.json([
      { id: "B1", resourceId: "1", purpose: "Orientation", status: "APPROVED", startTime: new Date().toISOString() }
    ]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
