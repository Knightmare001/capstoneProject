import { InvariantError, NotFoundError } from "../../../exceptions/index.js";
import response from "../../../utils/response.js";
import UserRepositories from "../repositories/user-repositories.js";

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.validated;

  const isEmailExist = await UserRepositories.verifyNewEmail(email);

  if (isEmailExist) {
    return next(new InvariantError("Gagal menambahkan user. email sudah digunakan"));
  }

  const user = await UserRepositories.createUser({
    name,
    email,
    password,
  });

  if (!user) {
    return next(new InvariantError("User gagal ditambahkan"));
  }

  return response(res, 201, "User berhasil ditambahkan", user);
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.findById(id);

  if (!user) {
    return next(new NotFoundError("User tidak ditemukan"));
  }

  return response(res, 200, "User berhasil ditambahkan", user);
};

// untuk test postman
export const deleteUserById = async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await UserRepositories.deleteUser(id);

  if (!deletedUser) {
    return res.status(404).json({ message: "User tidak ditemukan!" });
  }

  return res.status(200).json({ message: "User berhasil dihapus", data: deletedUser });
};
