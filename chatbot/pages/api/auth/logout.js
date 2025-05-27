import { serialize } from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  res.setHeader(
    "Set-Cookie",
    serialize("authToken", "", {
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    })
  );

  res.status(200).json({ message: "Logout exitoso" });
}
