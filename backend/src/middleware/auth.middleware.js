// src/services/authentications/middleware/auth-middleware.js
import jwt from "jsonwebtoken";
import UserRepository from "../services/users/repositories/user-repositories.js"; // Sesuaikan nama file repo kamu
import response from "../utils/response.js"; // Helper response terpisah milikmu

export const protectRoute = async (req, res, next) => {
  try {
    // 1. Ambil token dari HTTP-Only Cookie
    const token = req.cookies.token;

    if (!token) {
      return response(res, 401, "Unauthorized - please login first", null);
    }

    // 2. Verifikasi keaslian token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return response(res, 401, "Token invalid", null);
    }

    // 3. Cari data user ke PostgreSQL menggunakan Repository terpusat
    const user = await UserRepository.findById(decoded.userId);

    if (!user) {
      return response(res, 401, "User not found", null);
    }

    // 4. Tempel data user yang bersih ke objek request (req.user)
    req.user = user;

    // 5. Lanjut ke controller berikutnya (misal: controller input data AI atau history)
    next();
  } catch (error) {
    console.log("Error in auth middleware:", error.message);

    // Jika token kedaluwarsa atau salah sign, jwt.verify akan melempar error ke block catch ini
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return response(res, 401, "Token invalid or expired", null);
    }

    return response(res, 500, "Internal server error", null);
  }
};
