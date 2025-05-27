"use client";
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter()

  async function onSubmit(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const email = data.email;
    if (!email.includes('@')) {
      alert("Por favor, ingresa un correo electrónico válido");
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push('/inicio-sesion')    
    } else {
      alert("Error al registrar el usuario");
    }
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white/20 backdrop-blur-xl p-12 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center gap-6">
        <h1 className="text-white text-4xl font-bold">Regístrate</h1>
        <form className="flex flex-col gap-4 w-full" onSubmit={onSubmit}>
          <input
            type="text"
            name="email"
            placeholder="Correo electrónico"
            className="p-3 border border-gray-300 rounded-lg bg-white/80 placeholder-gray-600 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="p-3 border border-gray-300 rounded-lg bg-white/80 placeholder-gray-600 text-black focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="p-3 bg-blue-300 text-blue-900 font-medium rounded-lg hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 transition duration-200">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
