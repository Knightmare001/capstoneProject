import express from "express";
import env from "dotenv";
env.config();
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import ErrorHandler from "./middleware/error.js";
import routes from "./routes/index.js";

const app = express();

const HOST = process.env.HOST;
const PORT = process.env.PORT;

// ekstrak json data from body
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(
  cors({
    origin: "http://localhost:5173",

    // Izinkan pengiriman cookie/headers kredensial
    credentials: true,

    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(ErrorHandler);
app.listen(PORT, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  connectDB();
});
