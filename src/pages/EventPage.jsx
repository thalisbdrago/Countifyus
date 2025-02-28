import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const EventPage = () => {
    const { idUrl } = useParams();
    const [eventData, setEventData] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [imageUrl, setImageUrl] = useState(null);

    async function fetchEventData() {
        try {
            const response = await fetch(`https://backend-servidor-production.up.railway.app/events/${idUrl}`);
            const data = await response.json();

            console.log("Data recebida da API:", data);

            if (response.ok) {
                setEventData(data);
                setTimeLeft(data.timeLeft); // Inicializa com o tempo recebido da API

                if (data.image && data.image instanceof Blob) {
                    setImageUrl(URL.createObjectURL(data.image));
                } else {
                    setImageUrl(data.image);
                }
            } else {
                console.error(data.error);
            }
        } catch (error) {
            console.error("Erro ao buscar os dados do evento:", error);
        }
    }

    useEffect(() => {
        fetchEventData();
    }, [idUrl]);

    useEffect(() => {
        if (eventData && eventData.timeLeft) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime.days === 0 && prevTime.hours === 0 && prevTime.minutes === 0 && prevTime.seconds === 0) {
                        clearInterval(timer);
                        return prevTime;
                    }

                    let { days, hours, minutes, seconds } = prevTime;

                    if (seconds > 0) {
                        seconds -= 1;
                    } else {
                        if (minutes > 0) {
                            minutes -= 1;
                            seconds = 59;
                        } else if (hours > 0) {
                            hours -= 1;
                            minutes = 59;
                            seconds = 59;
                        } else if (days > 0) {
                            days -= 1;
                            hours = 23;
                            minutes = 59;
                            seconds = 59;
                        }
                    }

                    return { days, hours, minutes, seconds };
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [eventData]);

    if (!eventData) return <div className="relative isolate flex items-center justify-center min-h-screen px-6 py-12 sm:px-8 bg-gray-900 text-white">
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
    >
      <div
        style={{
          clipPath:
            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
        }}
        className="absolute left-[calc(50%-20rem)] aspect-[1155/678] w-[40rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#6b21a8] opacity-30 sm:w-[80rem]"
      />
    </div>
    <h1 className="text-4xl font-bold">Evento não encontrado!</h1>
  </div>;

    return (
        <div className="relative isolate flex items-center justify-center min-h-screen px-6 py-12 sm:px-8 bg-gray-900">
                        <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
            >
                <div
                style={{
                    clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
                className="absolute left-[calc(50%+20rem)] aspect-[1155/678] w-[40rem] -translate-x-1/2 -rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] via-[#6d28d9] to-[#1e3a8a] opacity-40 sm:w-[80rem]"
                />
            </div>
            <div className="w-full md:w-1/3 flex items-center justify-center mt-6 md:mt-0">
                <div
                    className="p-6 rounded-lg shadow-lg text-center"
                    style={{ backgroundColor: eventData.bgColor, color: eventData.textColor, width: "90%", maxWidth: "450px" }}
                >
                    <div className="bg-white m-3 text-black w-[80%] mx-auto rounded-md">
                    </div>
                    <img
                        src={eventData.image ? eventData.image : "https://images.unsplash.com/photo-1624646803808-9c5a9de7aa3f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGNhc2FsJTIwam92ZW18ZW58MHx8MHx8fDA%3D"}
                        alt="Preview"
                        className="w-full rounded-lg mb-2"
                    />
                    <h2 className="text-xl font-bold mb-2">
                        {eventData.eventTitle || "Título do Evento"}
                    </h2>
                    <p className="mb-2 text-md mb-5">
                        {eventData.message || "Uma mensagem especial para tornar este momento inesquecível!"}
                    </p>
                    <div class="border w-40 mx-auto opacity-20 mt-1 flex-shrink-0"></div>
                    <p className="text-lg font-bold mt-3"></p>
                    <p>
                    ⏳ A contagem regressiva começou! Falta apenas: <br/>
                    {timeLeft?.days ?? 0} dias, {timeLeft?.hours ?? 0} horas, {timeLeft?.minutes ?? 0} minutos e {timeLeft?.seconds ?? 0} segundos 🎉
                    </p>
                </div>
            </div>
        </div>


    );
};

export default EventPage;