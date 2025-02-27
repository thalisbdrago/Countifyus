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
      <div className="flex flex-col md:flex-row p-6 md:p-10 bg-gray-900 min-h-screen text-white">
        {/* Formulário */}
          <div className="w-full md:w-1/2 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-3xl font-bold mb-6">Personalize Seu Convite</h2>
            <label className="block text-lg mb-2">Email(Enviar qrCode/Link)</label>
              <input
                required
                type="text"
                value={emailEnviar}
                onChange={(e) => setEmailEnviar(e.target.value)}
                className="w-full p-3 mb-4 bg-gray-700 rounded-lg text-lg border border-gray-600"
              />

            <label className="block text-lg mb-2">Título do Evento:</label>
              <input
              type="text"
              value={eventTitle}
              onChange={(e) => {
                setEventTitle(e.target.value);
                setCustomUrl(eventTitle.replace(/\s+/g, '-').toLowerCase())
                setUrl(e.target.value);
                console.log(customUrl)
              }}
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
                onChange={(e) => {
                    const file = e.target.files[0];
                    console.log("Arquivo selecionado:", file);
                  
                    // Verifique o tamanho do arquivo (1MB = 1 * 1024 * 1024 bytes)
                    if (file.size > 1.5 * 1024 * 1024) {
                      alert("O arquivo é maior que 1MB. Por favor, escolha um arquivo menor.");
                      // Aqui você pode limpar o campo de input se desejar
                      e.target.value = ''; // Isso limpa o campo para que o usuário precise selecionar novamente
                      return; // Interrompe a execução se o arquivo for muito grande
                    }
                  
                    // Se o arquivo for válido, armazene a imagem
                    setImage(URL.createObjectURL(file));
                }}
                className="hidden "
                id="file-upload"
                accept="image/*"
              />
                <label
                    htmlFor="file-upload"
                    className="w-full h-40 flex flex-col items-center justify-center bg-gray-700 rounded-lg text-lg cursor-pointer hover:bg-gray-600 transition"
                >
                    <Camera size={40} className="text-white opacity-70 mb-2" />
                    <span className="text-gray-300 text-sm">Clique para escolher uma imagem</span>
                </label>
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
                  HandlePost(); // Só chama a função se tudo estiver preenchido

                }}
                className="w-full p-4 bg-red-600 rounded-lg font-bold text-lg text-white hover:bg-red-700 transition"
              >
                Pagar e Gerar Convite
              </Button>
          </div>
      

      <>

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

      </>

      <div>
    </div>
      {/* Preview */}
      <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-0">
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
