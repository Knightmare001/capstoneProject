// services/users/repositories/user-repository.js
import { query } from "../../../lib/db.js";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

class UserRepository {
  // 1. Membuat user baru (Pola Destructuring Object)
  async createUser({ email, name, password }) {
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const sql = `
      INSERT INTO users (id, name, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, created_at;
    `;
    const values = [id, name, email, hashedPassword, createdAt, updatedAt];

    // Langsung panggil fungsi query global dari lib/db
    const res = await query(sql, values);
    return res.rows[0];
  }

  // 2. Mengecek apakah email sudah terdaftar (Mengembalikan boolean true/false)
  async verifyNewEmail(email) {
    const sql = "SELECT email FROM users WHERE email = $1";
    const res = await query(sql, [email]);
    return res.rows.length > 0;
  }

  // 3. Memverifikasi kredensial saat login (Mengembalikan user id atau null)
  async verifyUserCredential(email, password) {
    const sql = "SELECT id, password FROM users WHERE email = $1";
    const res = await query(sql, [email]);

    if (res.rows.length === 0) {
      return null;
    }

    const { id, password: hashedPassword } = res.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return null;
    }

    return id;
  }

  // 4. Mengambil data profil user berdasarkan ID
  async findById(id) {
    const sql = "SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1";
    const res = await query(sql, [id]);
    return res.rows[0];
  }
}

// Export sebagai instance (Singleton) agar siap di-import langsung di controller
export default new UserRepository();
