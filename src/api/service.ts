import axios from 'axios';

export async function postCriarPix(body: any) {
  try {
    const response = await axios.post('https://api-timer-production.up.railway.app/criar-pix', body, {
      headers: { 'Content-Type': 'application/json' },
    });
    
    return response; // Retorna a resposta para ser manipulada no componente
  } catch (error) {
    console.error("Erro ao criar PIX:", error);
    throw error; // Lança o erro para ser tratado no componente
  }
}
