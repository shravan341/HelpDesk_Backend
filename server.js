import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dotenv.config();

const app = express();

// CORS configuration — only once
const allowedOrigins = [
  "https://help-desk-frontend-pi.vercel.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(
          new Error("CORS not allowed for this origin: " + origin),
          false
        );
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// To properly respond to preflight (OPTIONS) for all routes
app.options("*", cors());

// for parsing JSON bodies
app.use(express.json());

// Connect to DB
connectDB();

// Routes — note prefix “/api”
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/tickets", commentRoutes); // though you might want commentRoutes under auth or tickets

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Vercel Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Root
app.get("/", (req, res) => {
  res.json({
    message: "Help Desk Backend API on Vercel",
    health: "/api/health",
    auth: "/api/auth",
    tickets: "/api/tickets",
  });
});

export default app;
