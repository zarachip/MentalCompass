
import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { setupVite, log } from "./vite.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Setup middleware
app.use(express.json());

// Setup session
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" }
  })
);

// Import and use routes
import { registerRoutes } from "./routes.js";
const httpServer = await registerRoutes(app);

// Development mode
if (process.env.NODE_ENV !== "production") {
  log("Starting in development mode");
  await setupVite(app, httpServer);
} else {
  // Production mode
  log("Starting in production mode");
  const clientDist = path.resolve(__dirname, "../dist");
  app.use(express.static(clientDist));
  
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, "0.0.0.0", () => {
  log(`Server running on port ${PORT}`);
  log(`Server accessible at http://0.0.0.0:${PORT}`);
});

export default httpServer;
