import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Método no permitido" });

  try {
    const {email, password} = req.body;

    if (!email || !password ) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    try {
      await connectToDatabase();
    } catch (error) {
      console.error("Error conectando a la base de datos:", error);
      return res.status(500).json({ message: "Error conectando a la base de datos" });
    }

    try {
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }
    } catch (error) {
      console.error("Error buscando el usuario:", error);
      return res.status(500).json({ message: "Error buscando el usuario" });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.error("Error hasheando la contraseña:", error);
      return res.status(500).json({ message: "Error procesando la contraseña" });
    }

    const newUser = new User({ email, password: hashedPassword });

    try {
      await newUser.save();
    } catch (error) {
      console.error("Error guardando el nuevo usuario:", error);
      return res.status(500).json({ message: "Error guardando el usuario" });
    }

    return res.status(201).json({ message: "Usuario creado correctamente" });

  } catch (error) {
    console.error("Error inesperado:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
