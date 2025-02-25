import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { postCriarPix } from "../api/service";


const EventInvite = () => {
  const [eventTitle, setEventTitle] = useState("Nosso casamento");
  const [eventDate, setEventDate] = useState("2025-03-01T19:42");
  const [message, setMessage] = useState("Estamos ansiosos para celebrar com você!");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#808080");
  const [textColor, setTextColor] = useState("#000000");
  const [image, setImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventDate));
  

  const MOCK_BODY = {
    transaction_amount: 1,
    description: "Nova Compra",
    paymentMethodId: "pix",
    email: "usuar22i2o@email.com",
    identificationType: "CPF",
    number: "19119119100"
  };

// Estado para monitorar o status do pagamento

  const [ticket_url, setTicket_url] = useState("");

  const HandlePost = () => {
    postCriarPix(MOCK_BODY).then(
      response => {
        console.log(response);
        const ticketUrl = response.data.point_of_interaction.transaction_data.ticket_url;
        setTicket_url(ticketUrl); // Atualiza o estado com o ticket_url
        console.log(ticketUrl);
      }
    );
  };
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  

  function getTimeLeft(date) {
    const eventTime = new Date(date).getTime();
    const now = new Date().getTime();
    const diff = eventTime - now;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(eventDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  return (
    <div className="flex p-10 bg-gray-900 min-h-screen text-white">
      {/* Formulário */}
      <div className="w-1/2 p-8 bg-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold mb-6">Personalize Seu Convite</h2>
        <label className="block text-lg mb-2">Título do Evento:</label>
        <input
          type="text"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-lg border border-gray-600"
        />

        <label className="block text-lg mb-2">Data do Evento:</label>
        <input
          type="datetime-local"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-lg border border-gray-600"
        />

        <label className="block text-lg mb-2">Mensagem Personalizada:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-lg border border-gray-600"
        />

        <label className="block text-lg mb-2">Cor do Convite:</label>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-full p-3 bg-gray-700 mb-4 rounded-lg border border-gray-600"
        />

        <label className="block text-lg mb-2">Cor do Texto:</label>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-full p-3 bg-gray-700 mb-4 rounded-lg border border-gray-600"
        />

        <label className="block text-lg mb-2">Imagem de Fundo:</label>
        <div className="w-full p-3 mb-4 bg-gray-700 rounded-lg border border-gray-600 flex items-center">
          <input
            type="file"
            onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
            className="hidden "
            id="file-upload"
          />
            <label
                htmlFor="file-upload"
                className="w-full h-40 flex flex-col items-center justify-center bg-gray-700 rounded-lg text-lg cursor-pointer hover:bg-gray-600 transition"
            >
                <Camera size={40} className="text-white opacity-70 mb-2" />
                <span className="text-gray-300 text-sm">Clique para escolher uma imagem</span>
            </label>
        </div>

        <button className="w-full p-4 bg-red-600 rounded-lg font-bold text-lg"  onClick={HandlePost}   >Pagar e Gerar Convite</button>
      </div>

      <div>
    </div>


      {/* Preview */}
      <div className="w-1/2 flex items-center justify-center">
        <div
          className="p-6 rounded-lg shadow-lg text-center"
          style={{ backgroundColor: bgColor, color: textColor, width: "90%", maxWidth: "600px" }}
        >
          <p className="text-sm mb-2 break-all">meusconvites.com/{eventTitle.replace(/\s+/g, '-').toLowerCase()}</p>
          {image && <img src={image} alt="Preview" className="w-full rounded-lg mb-2" />}
          <h2 className="text-xl font-bold mb-2">{eventTitle}</h2>
          <p className="mb-2 text-md">{message}</p>
          {description && <p className="mb-2 text-sm text-gray-300">{description}</p>}
          <p className="text-lg font-bold">
            {timeLeft.days} dias, {timeLeft.hours} horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
          </p>
        </div>
      </div>
    </div>
  );
};

export default EventInvite;