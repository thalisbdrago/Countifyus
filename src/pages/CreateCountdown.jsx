"use client";

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
import { TicketPix } from '../pagamentos/TicketPix'
import  PageForm  from '../pages/FormPage'
import  BannerPage  from '../pages/BannerPage'
import  Footer  from '../pages/Footer'





const EventInvite = () => {
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");
  const [bgColor, setBgColor] = useState("#202020");
  const [textColor, setTextColor] = useState("#F3F4F6");
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
      <div className="relative isolate flex items-center justify-center min-h-screen px-6 py-12 sm:px-8 bg-gray-50 mx-a">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="absolute left-[calc(50%-20rem)] aspect-[1155/678] w-[40rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:w-[80rem]"
        />
      </div>
      <div className="w-full h-[90%] flex flex-col lg:flex-row gap-20">
        <div className="w-[90%] lg:w-2/3 m-4 md:m-10 flex gap-4 flex-col justify-center">
          <div className="flex flex-col gap-2 mb-5 lg:mb-10">
            <h1 className="text-primarypink font-bold text-6xl lg:text-7xl">Faça seu amor se sentir único com essa surpresa </h1>
            <h1 className="mt-2 text-2xl ">🔍 Deixe a curiosidade no ar… Envie um QR Code e surpreenda alguém com um convite único! 🎁</h1>
          </div>
          <div className="flex flex-col lg:flex-row items-end gap-1 lg:gap-4">
          <label className="flex flex-col w-full lg:w-[40%]">
              <span className="text-xs lg:text-sm">Email para receber qrCode</span>
              <input
                    required
                    type="text"
                    value={emailEnviar}
                    onChange={(e) => setEmailEnviar(e.target.value)}
                    className="rounded-md h-10 border border-primarypink p-3 shadow-2xl"
                />
            </label>
            <label className="flex flex-col w-full lg:w-[40%]">
              <span className="text-xs lg:text-sm">Titulo do Evento</span>
                <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => {
                        setEventTitle(e.target.value);
                        setCustomUrl(eventTitle.replace(/\s+/g, "-").toLowerCase());
                        setUrl(e.target.value);
                    }}
                    className="rounded-md h-10 border border-primarypink p-3 shadow-2xl"
                />
            </label>
            <label className="flex flex-col w-full lg:w-[20%]">
              <span className="text-xs lg:text-sm">Data da Surpresa</span>
              <div className="flex gap-1">
                <input
                    type="datetime-local"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="rounded-md h-10 border border-primarypink p-3 shadow-2xl w-full"
                />
              </div>
            </label>
          </div>
          <label className="flex flex-col">
            <span className="text-xs lg:text-sm">Mensagem:</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="rounded-md h-60 border border-primarypink p-3 shadow-2xl"
              />
          </label>

            <div className="flex flex-col">
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
                        <span className="text-gray-600 text-sm">Clique para escolher uma foto</span>
                    </label>
                </div>
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
              className="font-bold py-2 px-4 rounded-md border-2 border-primarypink flex gap-2 justify-center"
          >
              Pagar e Gerar Convite
          </Button>
        </div>

        <div className="w-full md:w-1/3 flex items-center justify-center mt-6 md:mt-0">
          <div
            className="p-6 rounded-lg shadow-lg text-center"
            style={{ backgroundColor: bgColor, color: textColor, width: "90%", maxWidth: "450px" }}
          >
            <div className="bg-white m-3 text-black w-[80%] mx-auto rounded-md">
              <span className="">timerSZ.com/{eventTitle.replace(/\s+/g, '-').toLowerCase()}</span>
            </div>
              <img
                src={image ? image : "https://images.unsplash.com/photo-1624646803808-9c5a9de7aa3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGNhc2FsJTIwam92ZW18ZW58MHx8MHx8fDA%3D"}
                alt="Preview"
                className="w-full rounded-lg mb-2"
              />
              <h2 className="text-xl font-bold mb-2">
                {eventTitle || "Título do Evento"}
              </h2>
              <p className="mb-2 text-md">
                {message || "Uma mensagem especial para tornar este momento inesquecível!"}
              </p>
                    <div class="border w-40 mx-auto opacity-20 mt-1 flex-shrink-0"></div>
                    <p className="text-lg font-bold mt-3"></p>
              <p>
                ⏳ A contagem regressiva começou! Falta apenas: <br />
                
                {eventDate && eventDate !== "" && (
                  <p>
                    {(timeLeft && timeLeft.days !== undefined && timeLeft.days !== null) 
                      ? `${timeLeft.days} dias, ${timeLeft.hours} horas, ${timeLeft.minutes} minutos, ${timeLeft.seconds} segundos` 
                      : "1 dia, 1 hora, 1 minuto, 1 segundo"} 🎉
                  </p>
                )}
              </p>
          </div>
      </div>
      </div>
    </div>

    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="flex flex-col items-center text-center w-full max-w-[95%] sm:max-w-md mx-auto p-4 sm:p-6">
              <DialogTitle>
                  🎟️ Seu QR Code está aqui!
              </DialogTitle>
              <DialogHeader className="flex flex-col items-center text-center mt-2 sm:mt-3">
                  {customUrl && (
                      <DialogTitle>
                          <p className="text-sm sm:text-md font-bold mb-2">Escaneie para acessar:</p>
                      </DialogTitle>
                    )}
                  <QRCodeCanvas 
                      className="m-3 sm:m-4"
                      value={customUrl}
                      size={window.innerWidth < 640 ? 120 : 180} 
                    />
              </DialogHeader>

              <DialogFooter className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                  <Button
                      className="flex-1 px-4 py-2 rounded-lg font-bold text-white"
                      onClick={copyToClipboard} 
                      style={{ backgroundColor: bgColor, color: textColor }}
                  >
                      Copiar Link
                  </Button>
                  <Button
                      className="flex-1 px-4 py-2 rounded-lg font-bold text-white"
                      onClick={shareLink} 
                      style={{ backgroundColor: bgColor, color: textColor }}
                  >
                      Compartilhar
                  </Button>
              </DialogFooter>
        </DialogContent>
    </Dialog>

      <Dialog open={isUrl} onOpenChange={setIsUrl} className='flex flex-col items-center text-center w-full max-w-[95%] sm:max-w-md mx-auto p-4 sm:p-6"'>
          <DialogContent>
            <iframe
                src={ticket_url}
                width="100%"
                height="500px" // Ajuste a altura conforme necessário
                title="Página de Pagamento"
              />
          </DialogContent>
      </Dialog>
      <Footer/>

    </>
  );
};



export default EventInvite;
