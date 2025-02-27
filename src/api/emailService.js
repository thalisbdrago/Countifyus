export const sendEmail = async (email, customUrl) => {
    console.log("Email:", email);
    console.log("Custom URL:", customUrl);

    if (!email || !customUrl) {
        console.error("Email ou URL estão indefinidos!");
        return;
    }

    try {
        const response = await fetch("https://backend-servidor-production.up.railway.app/email/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, customUrl }),
        });

        const result = await response.json();
        console.log(result.message);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
};
