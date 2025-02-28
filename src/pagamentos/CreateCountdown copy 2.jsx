import React, { useState, useEffect,useRef, use } from "react";
import { Camera } from "lucide-react";
import { postCriarPix } from "../api/service";
import axios from "axios";
import { Button } from "@/components/ui/button"
import { Dialog, DialogDescription,DialogContent,DialogHeader,DialogTitle,DialogFooter} from "@/components/ui/dialog"
import { QRCodeCanvas } from "qrcode.react";
import { sendEmail } from "../api/emailService";
import { createEvent } from "../api/eventService";
import { nanoid } from 'nanoid';
import { TicketPix } from './TicketPix'
import  PageForm  from '../pages/FormPage'
import  BannerPage  from '../pages/BannerPage'





const EventInvite = () => {
  const [eventTitle, setEventTitle] = useState("Nossa Viagem");
  const [eventDate, setEventDate] = useState("2040-03-01T19:42");
  const [message, setMessage] = useState("Vamos para aquele lugar que voce tanto queria? Arrume as malas <3");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#808080");
  const [textColor, setTextColor] = useState("#000000");
  const [image, setImage] = useState(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(eventDate));
  const [isOpen, setIsOpen] = useState(false);
  const [isUrl, setIsUrl] = useState(false);
  const [url, setUrl] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [emailEnviar, setEmailEnviar] =  useState("")
  const [ticket_url, setTicket_url] = useState("");
  const [qrCode, setQrCode] = useState("");

  const [id, setId] = useState('');

  const [statusPagamento, setStatusPagamento] = useState('');
  
  const ACCESS_TOKEN = import.meta.env.VITE_MP_ACCESS_TOKEN;


  const MOCK_BODY = {
    email: emailEnviar,
    identificationType: "CPF",
    number: "19119119100"
  };

  

  const countdownData = {
    bgColor, // Se bgColor já foi definido antes
    textColor, // Se textColor já foi definido antes
    eventTitle,
    image,
    message, // Removendo as chaves extras
    description,
    timeLeft // Não precisa das chaves extras
};


// Chamar a função ao carregar a página ou ao clicar em um botão
const copyToClipboard = () => {
  navigator.clipboard.writeText(customUrl);
  alert("Link copiado!");
};

const shareLink = () => {
  if (navigator.share) {
      navigator.share({
          title: "Convite Especial",
          text: "Acesse seu convite personalizado!",
          url: customUrl
      });
  } else {
      alert("Compartilhamento não suportado neste navegador.");
  }
};



  const verificarStatusPagamento = async () => {
    if (!id) {
      console.error("ID não encontrado!");
      return;
    }

    try {
      const response = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`, // Token de autenticação
        },
      });

      console.log("Resposta da API:", response.data);
      const status = response.data.status; // Exemplo: "approved", "pending", "rejected"
      console.log(`Status do pagamento: ${status}`);

      setStatusPagamento(status);
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
    }
  };


  useEffect(() => {
    if (!id) return;
  
    const interval = setInterval(() => {
      verificarStatusPagamento();
    }, 5000); // Verifica a cada 5 segundos
  
    // Verifica se o pagamento foi aprovado
    if (statusPagamento === "approved") {
      clearInterval(interval);
      setIsOpen(true);
  
      const eventSlug = eventTitle.replace(/\s+/g, '-').toLowerCase();
      const idUrl = nanoid(10);
      const newCustomUrl = `${window.location.origin}/evento/${idUrl}/${eventSlug}`;
      setCustomUrl(newCustomUrl);
  
      console.log(customUrl);
      console.log(newCustomUrl);
      console.log(idUrl);
      setIsUrl(false)
      
  
      const countdownData = {
        bgColor,           // Cor de fundo
        textColor,         // Cor do texto
        eventTitle,        // Título do evento
        image,             // Imagem do evento
        message,           // Mensagem do evento     // Descrição do evento// Data de término do evento, convertida para o formato ISO
        newCustomUrl,
        timeLeft,
        idUrl,   // URL personalizada do evento
    };
  
      console.log("Pagamento pendente! Mostrando QR Code:", newCustomUrl);
  
      sendEmail(emailEnviar, newCustomUrl);

      createEvent(countdownData);
  
  }

  
  
    // Função de limpeza
    return () => clearInterval(interval);
  
  }, [id, statusPagamento]);  // Agora, dependemos de `statusPagamento` para verificar a mudança
  ; // Depende apenas de `id`


// Estado para monitorar o status do pagamento

  

  const HandlePost = () => {
    postCriarPix(MOCK_BODY).then(
      response => {
        console.log(response);
        console.log(response.data.id);
        const ticketUrl = response.data.point_of_interaction.transaction_data.ticket_url;
        const qrCodePag =  response.data.point_of_interaction.transaction_data.qr_code_base64;
        setQrCode(qrCodePag)
        const id = response.data.id;
        setTicket_url(ticketUrl); // Atualiza o estado com o ticket_url
        setId(id);
        setIsUrl(true)
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
      <>
      <PageForm/>
      <BannerPage/>
      <div className="flex flex-col md:flex-row min-h-screen bg-[#fef3f3] p-6 md:p-12 gap-12">
    
    {/* Formulário */}
    <div className="flex-1 space-y-8 bg-white p-10 rounded-3xl shadow-lg border border-gray-200">
        <h2 className="text-4xl font-bold text-[#5a3e36] text-center">🎉 O seu momento, do seu jeito!</h2>
        <p className="text-center text-gray-500 text-lg">Crie um convite especial do seu jeito!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
                <label className="block text-sm font-semibold text-gray-900">Email (QR Code/Link)</label>
                <input
                    required
                    type="text"
                    value={emailEnviar}
                    onChange={(e) => setEmailEnviar(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 px-4 py-3 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
            </div>

            <div className="flex flex-col">
                <label className="block text-lg">Título do Evento</label>
                <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => {
                        setEventTitle(e.target.value);
                        setCustomUrl(eventTitle.replace(/\s+/g, "-").toLowerCase());
                        setUrl(e.target.value);
                    }}
                    className="w-full rounded-lg bg-gray-50 px-4 py-3 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
                <label className="block text-lg">Data do Evento</label>
                <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-lg bg-gray-50 px-4 py-3 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
                />
            </div>

            <div className="flex flex-col">
                <label className="block text-lg">Imagem de Fundo</label>
                <div className="w-full flex items-center justify-center border border-gray-300 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-200 transition">
                    <input
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file.size > 2 * 1024 * 1024) {
                                alert("O arquivo é maior que 2MB. Por favor, escolha um arquivo menor.");
                                e.target.value = "";
                                return;
                            }
                            setImage(URL.createObjectURL(file));
                        }}
                        className="hidden"
                        id="file-upload"
                        accept="image/*"
                    />
                    <label htmlFor="file-upload" className="w-full h-40 flex flex-col items-center justify-center">
                        <Camera size={40} className="text-gray-600 mb-2" />
                        <span className="text-gray-600 text-sm">Clique para escolher uma imagem</span>
                    </label>
                </div>
            </div>
        </div>

        <div className="flex flex-col">
            <label className="block text-lg">Mensagem Personalizada</label>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg bg-gray-50 px-4 py-3 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            />
        </div>

        <Button
            onClick={() => {
                if (!emailEnviar.trim()) {
                    alert("O campo de e-mail é obrigatório!");
                    return;
                }
                if (!eventTitle.trim()) {
                    alert("O título do evento é obrigatório!");
                    return;
                }
                if (!eventDate) {
                    alert("A data do evento é obrigatória!");
                    return;
                }
                if (!image) {
                    alert("A foto do evento é obrigatória!");
                    return;
                }
                HandlePost();
            }}
            className="w-full p-4 bg-red-600 rounded-lg font-bold text-lg text-white hover:bg-red-700 transition"
        >
            Pagar e Gerar Convite
        </Button>
    </div>

    {/* Preview */}
    <div className="flex-1 flex flex-col items-center justify-center">
        <div className="p-6 rounded-2xl shadow-xl text-center border border-gray-300 backdrop-blur-lg bg-opacity-50"
             style={{ backgroundColor: bgColor, color: textColor, width: "90%", maxWidth: "500px" }}>
            <p className="text-xs mb-3 text-gray-600 break-all">🔗 <span className="font-semibold">meusconvites.com/{eventTitle.replace(/\s+/g, '-').toLowerCase()}</span></p>
            {image && <img src={image} alt="Preview" className="w-full rounded-lg mb-3 shadow-md" />}
            <h2 className="text-2xl font-bold mb-2">{eventTitle}</h2>
            <p className="mb-3 text-lg font-medium">{message}</p>
            <div className="bg-gray-800 text-white p-2 rounded-lg shadow-md inline-block">
                <p className="text-lg font-semibold">
                    ⏳ {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
                </p>
            </div>
        </div>
    </div>
</div>

    </>
  );
};



export default EventInvite;
