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

    if (!eventData) return <div>Carregando...</div>;

    return (
        <div className="flex flex-col items-center justify-center bg-gray-900 min-h-screen text-white px-4">
            <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-5">
                <div
                    className="p-6 rounded-lg shadow-lg text-center"
                    style={{
                        backgroundColor: eventData.bgColor,
                        color: eventData.textColor,
                        width: "90%",
                        maxWidth: "600px"
                    }}
                >
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={eventData.eventTitle}
                            className="mb-4 rounded-lg w-full"
                            style={{ maxWidth: "100%", height: "auto" }}
                        />
                    )}

                    <h2 className="text-xl font-bold mb-2">{eventData.eventTitle}</h2>
                    <p className="mb-2 text-md">{eventData.message}</p>

                    <p className="text-lg font-bold">
                        {timeLeft.days} dias, {timeLeft.hours} horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventPage;