

const Card = ({ bgColor, textColor, eventTitle, image, message, timeLeft }) => {
    return (
        <div className="w-full md:w-1/2 flex items-center justify-center mt-6 md:mt-5">
            <div
                className="p-6 rounded-lg shadow-lg text-center"
                style={{ backgroundColor: bgColor, color: textColor, width: "90%", maxWidth: "600px" }}
            >
                <p className="text-sm mb-2 hidden break-all">
                    meusconvites.com/{eventTitle?.replace(/\s+/g, '-').toLowerCase()}
                </p>
                {image && <img src={image} alt="Preview" className="w-full rounded-lg mb-4" />}
                <h2 className="text-xl font-bold mb-2">{eventTitle}</h2>
                <p className="mb-2 text-md">{message}</p>
                {timeLeft && (
                    <p className="text-lg font-bold">
                        {timeLeft.days} dias, {timeLeft.hours} horas, {timeLeft.minutes} minutos, {timeLeft.seconds} segundos
                    </p>
                )}
            </div>
        </div>
    );
};

export default Card;
//<Card {...countdownData} /> 
