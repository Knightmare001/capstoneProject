import express from "express";
import env from "dotenv";
env.config();
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorHandler from "./middleware/error.js";
import routes from "./routes/index.js";

const app = express();

// Render secara otomatis menyediakan process.env.PORT. Jika di lokal, dia pakai 5001.
const PORT = process.env.PORT || 5001;

// Ekstrak json data from body
app.use(
  cors({
    origin: "https://resignajadulu.vercel.app", // Nanti kalau frontend sudah deploy, tinggal ganti atau tambah URL-nya di sini
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.use(ErrorHandler);

// Jalankan koneksi database sebelum listen agar jika ada error koneksi bisa ditangani dengan baik
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server successfully running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server due to DB connection error:", err);
    // Tetap jalankan listen agar Render tidak mengalami 'Port scan timeout' meskipun DB bermasalah sementara
    app.listen(PORT, () => {
      console.log(`Server emergency running on port ${PORT} (DB Disconnected)`);
    });
  });
