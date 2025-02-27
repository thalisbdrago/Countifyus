export async function createEvent(countdownData) {
    try {
        const formData = new FormData();
        formData.append("bgColor", countdownData.bgColor);
        formData.append("textColor", countdownData.textColor);
        formData.append("eventTitle", countdownData.eventTitle);
        formData.append("message", countdownData.message);
        formData.append("newCustomUrl", countdownData.newCustomUrl);
        formData.append("timeLeft", JSON.stringify(countdownData.timeLeft));
        formData.append("idUrl", countdownData.idUrl);

        // Verifica se countdownData.image é um Blob URL e converte para File
        if (typeof countdownData.image === "string" && countdownData.image.startsWith("blob:")) {
            const response = await fetch(countdownData.image);
            const blob = await response.blob();
            const file = new File([blob], "evento.jpg", { type: blob.type });
            formData.append("image", file);
        } else if (countdownData.image instanceof File) {
            formData.append("image", countdownData.image);
        }

        // Debug: Verificando o que está sendo enviado
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        const response = await fetch("http://backend-servidor-production.up.railway.app/events/", {
            method: "POST",
            body: formData, // En
            // viando FormData para suportar arquivos
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Erro na resposta:", errorData);
            throw new Error("Erro ao criar evento");
        }

        const data = await response.json();
        console.log("Evento criado com sucesso:", data);
    } catch (error) {
        console.error("Erro ao criar evento:", error);
        const errorData = await response.json();
        console.error("Erro na resposta:", errorData);
        throw new Error("Erro ao criar evento");
    }
}
