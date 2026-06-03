// src/services/authentications/controller/authentication-controller.js
import { generateToken } from "../../../lib/utils.js"; // Sesuaikan path utils kamu
import UserRepository from "../../users/repositories/user-repositories.js"; // Sesuaikan nama file repo kamu
import response from "../../../utils/response.js"; // Helper response terpisah milikmu

export const signup = async (req, res) => {
  const { name, email, password } = req.validated;

  try {
    // 1. Cek apakah email sudah terdaftar lewat Repository
    const isEmailExists = await UserRepository.verifyNewEmail(email);
    if (isEmailExists) {
      return response(res, 400, "Email already exists", null);
    }

    // 2. Simpan user baru (Proses hashing password otomatis berjalan di dalam repository.create)
    const newUser = await UserRepository.createUser({ email, name, password });

    if (!newUser) {
      return response(res, 400, "Invalid user data", null);
    }

    // 3. Generate Cookie JWT token
    generateToken(newUser.id, res);

    // 4. Kirim response sukses menggunakan helper terpisah
    return response(res, 201, "User registered successfully", {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.validated;

  try {
    // 1. Verifikasi kredensial email & password langsung di tingkat Repository
    const userId = await UserRepository.verifyUserCredential(email, password);

    if (!userId) {
      return response(res, 400, "Email or password incorrect", null);
    }

    // 2. Jika sukses, ambil data profil user berdasarkan ID untuk kebutuhan frontend
    const user = await UserRepository.findById(userId);

    // 3. Generate Token cookie
    generateToken(user.id, res);

    // 4. Kirim response sukses menggunakan helper terpisah
    return response(res, 200, "Login success", {
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error in login controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};

export const logout = (req, res) => {
  try {
    // Menghapus cookie jwt di browser
    res.cookie("token", "", { maxAge: 0 });
    return response(res, 200, "Logout success", null);
  } catch (error) {
    console.error("Error in logout controller:", error.message);
    return response(res, 500, "Internal server error", null);
  }
};
