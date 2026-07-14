import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Firebase config
let firebaseConfig: any = {};
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  }
} catch (e) {
  console.error("Failed to load firebase-applet-config.json", e);
}

// Initialize Firebase Admin
try {
  if (firebaseConfig.projectId) {
    admin.initializeApp({
      projectId: firebaseConfig.projectId
    });
  } else {
    admin.initializeApp();
  }
  console.log("Firebase Admin successfully initialized.");
} catch (err) {
  console.error("Firebase Admin initialization error:", err);
}

const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(admin.apps[0] || admin.initializeApp(), firebaseConfig.firestoreDatabaseId)
  : getFirestore();

// Helper to seed initial resources if database is empty
async function seedDatabase() {
  try {
    const resourcesRef = db.collection("resources");
    const snapshot = await resourcesRef.limit(1).get();
    if (snapshot.empty) {
      console.log("Seeding initial resources into Firestore database...");
      const initialResources = [
        { name: "Main Lecture Hall", type: "LECTURE_HALL", location: "Block A, Level 2", capacity: 250, status: "ACTIVE" },
        { name: "Engineering Lab 4", type: "LAB", location: "Tower C, Ground Floor", capacity: 30, status: "ACTIVE" },
        { name: "Conference Room B", type: "MEETING_ROOM", location: "Admin Wing", capacity: 15, status: "OUT_OF_SERVICE" },
        { name: "Projector Set #42", type: "EQUIPMENT", location: "IT Helpdesk", capacity: 1, status: "ACTIVE" },
        { name: "Bio-Chem Lab 2", type: "LAB", location: "Science Block", capacity: 40, status: "ACTIVE" },
      ];
      for (const res of initialResources) {
        const docRef = resourcesRef.doc();
        await docRef.set({
          ...res,
          id: docRef.id,
          availability: "9:00 AM - 5:00 PM",
          metadata: {}
        });
      }
      console.log("Seeding initial resources completed successfully.");
    }

    // Seed mock initial bookings if empty
    const bookingsRef = db.collection("bookings");
    const bSnapshot = await bookingsRef.limit(1).get();
    if (bSnapshot.empty) {
      console.log("Seeding initial bookings...");
      const docRef = bookingsRef.doc();
      await docRef.set({
        id: docRef.id,
        resourceId: "1",
        userId: "admin_01",
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7200000).toISOString(),
        purpose: "Orientation and Team Briefing",
        attendees: 50,
        status: "APPROVED",
        createdAt: new Date().toISOString()
      });
    }

    // Seed mock initial tickets if empty
    const ticketsRef = db.collection("tickets");
    const tSnapshot = await ticketsRef.limit(1).get();
    if (tSnapshot.empty) {
      console.log("Seeding initial tickets...");
      const tickets = [
        {
          resourceId: "3",
          location: "Admin Wing",
          category: "A/C FAULT",
          description: "Air conditioner is leaking water in Conference Room B",
          priority: "HIGH",
          status: "OPEN",
          reporterId: "tech@campus.hub",
          images: [],
          createdAt: new Date().toISOString()
        }
      ];
      for (const ticket of tickets) {
        const docRef = ticketsRef.doc();
        await docRef.set({
          ...ticket,
          id: docRef.id
        });
      }
    }

    // Seed mock initial notifications if empty
    const notificationsRef = db.collection("notifications");
    const nSnapshot = await notificationsRef.limit(1).get();
    if (nSnapshot.empty) {
      console.log("Seeding initial notifications...");
      const docRef = notificationsRef.doc();
      await docRef.set({
        id: docRef.id,
        userId: "all",
        title: "Database Synchronized",
        message: "The Smart Campus Operations hub is now connected to Cloud Firestore database.",
        type: "SYSTEM",
        read: false,
        createdAt: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error("Failed to seed database:", error);
  }
}

// Trigger Seeding
seedDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // RESOURCES ENDPOINTS
  app.get("/api/resources", async (req, res) => {
    try {
      const snapshot = await db.collection("resources").get();
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/resources", async (req, res) => {
    try {
      const { name, type, location, capacity, status } = req.body;
      const docRef = db.collection("resources").doc();
      const newResource = {
        id: docRef.id,
        name,
        type,
        location,
        capacity: Number(capacity) || 0,
        status: status || "ACTIVE",
        availability: "9:00 AM - 5:00 PM",
        metadata: {}
      };
      await docRef.set(newResource);
      res.status(201).json(newResource);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // BOOKINGS ENDPOINTS
  app.get("/api/bookings", async (req, res) => {
    try {
      const snapshot = await db.collection("bookings").get();
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { resourceId, userId, startTime, endTime, purpose, attendees } = req.body;
      const docRef = db.collection("bookings").doc();
      const newBooking = {
        id: docRef.id,
        resourceId,
        userId: userId || "anonymous",
        startTime,
        endTime,
        purpose: purpose || "General Use",
        attendees: Number(attendees) || 1,
        status: "APPROVED",
        createdAt: new Date().toISOString()
      };
      await docRef.set(newBooking);
      res.status(201).json(newBooking);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // TICKETS ENDPOINTS
  app.get("/api/tickets", async (req, res) => {
    try {
      const snapshot = await db.collection("tickets").get();
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/tickets", async (req, res) => {
    try {
      const { resourceId, location, category, description, priority, reporterId } = req.body;
      const docRef = db.collection("tickets").doc();
      const newTicket = {
        id: docRef.id,
        resourceId: resourceId || "",
        location: location || "Campus",
        category,
        description,
        priority: priority || "MEDIUM",
        status: "OPEN",
        reporterId: reporterId || "anonymous",
        images: [],
        createdAt: new Date().toISOString()
      };
      await docRef.set(newTicket);
      res.status(201).json(newTicket);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // NOTIFICATIONS ENDPOINTS
  app.get("/api/notifications", async (req, res) => {
    try {
      const snapshot = await db.collection("notifications").orderBy("createdAt", "desc").get();
      const list: any[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const { userId, title, message, type } = req.body;
      const docRef = db.collection("notifications").doc();
      const newNotification = {
        id: docRef.id,
        userId: userId || "all",
        title,
        message,
        type: type || "INFO",
        read: false,
        createdAt: new Date().toISOString()
      };
      await docRef.set(newNotification);
      res.status(201).json(newNotification);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("notifications").doc(id).update({ read: true });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection("notifications").doc(id).delete();
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
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
