"use client";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
//comentario para forzar build
export default function Home() {
  const [qr, setQr] = useState(null);

  const [groups, setGroups] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);

  const [contact, setContact] = useState("");
  const [mensaje, setMensaje] = useState("");

  const toggleSeleccion = (id) => {
    setSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  };
  const enviarExclusiones = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/excluir-grupos`,
        {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ grupos: seleccionados }),
        }
      );
      const data = await res.json();
      console.log("Grupos excluidos:", data);
      alert("Grupos excluidos correctamente");
    } catch (err) {
      console.error("Error enviando exclusiones:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/excluir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({ numero: contact + "@s.whatsapp.net" }),
    });

    const data = await res.json();
    setMensaje(data.message);
    setContact("");
  };

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/qr`, {
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        });

        const data = await response.json();
        if (data.status === "ok") {
          console.log("QR recibido:", data.qr);
          setQr(data.qr);
        } else {
          setQr(null);
        }
      } catch (error) {
        console.error("Error al obtener el QR:", error);
        setQr(null);
      }
    };

    fetchQR();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/grupos`,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }
        );
        const data = await response.json();
        if (data.error === "WhatsApp no está conectado aún") {
          setGroups([]);
        } else {
          setGroups(data);
        }
      } catch (error) {
        console.error("Error al obtener los grupos:", error);
        setGroups([]);
      }
    };
    fetchGroups();
  }, []);

  return (
    <div className="flex flex-col w-full items-center justify-center mt-10">
      {qr ? (
        <>
          <QRCodeSVG value={qr} width={400} height={400} />
          <p className="mt-4 text-xl">
            Escanea con WhatsApp para iniciar sesión
          </p>
        </>
      ) : (
        <p className="text-2xl">Esperando QR...</p>
      )}
      <p className="mt-4 text-xl">
        ¿No funciono el QR? Haz refresh a la página
      </p>
      <div className="flex flex-row items-center mt-10 gap-80">
        <div>
          <h1 className="text-2xl font-bold">Grupos</h1>
          <ul className="mt-6 text-left">
            {groups.map((group) => (
              <li key={group.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(group.id)}
                    onChange={() => toggleSeleccion(group.id)}
                  />
                  {group.subject} - {group.id}
                </label>
              </li>
            ))}
          </ul>
          <button
            onClick={enviarExclusiones}
            className="mt-4 p-2 bg-violet-800 text-white rounded"
          >
            Excluir seleccionados
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-bold">Contactos</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Número a excluir (ej. 5216861234567@s.whatsapp.net)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="border p-2"
            />
            <button
              type="submit"
              className="bg-violet-800 text-white p-2 rounded"
            >
              Excluir contacto
            </button>
            {mensaje && <p>{mensaje}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
