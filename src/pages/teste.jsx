import React from "react";

const PersonalizeSite = () => {
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="w-full h-[90%] flex flex-col lg:flex-row gap-20">
        <div className="w-[90%] lg:w-2/3 mx-auto flex gap-4 flex-col justify-center">
          <div className="flex flex-col gap-2 mb-5 lg:mb-10">
            <h1 className="text-primarypink font-bold text-6xl lg:text-7xl">Surpreenda seu amor</h1>
            <h3 className="text-xl">Crie um site exclusivo com um contador do seu tempo juntos. Preencha o formulário abaixo e receba seu site personalizado + QR Code para compartilhar essa linda história com seu amor! 🙂</h3>
          </div>
          <div className="flex flex-col lg:flex-row items-end gap-1 lg:gap-4">
            <label className="flex flex-col w-full lg:w-[60%]">
              <span className="text-xs lg:text-sm">Data do Evento</span>
              <input placeholder="João e Maria (Não use emoji)" className="rounded-md h-10 border border-primarypink p-3 shadow-2xl" type="text" />
            </label>
            <label className="flex flex-col w-full lg:w-[40%]">
              <span className="text-xs lg:text-sm">Data da Surpresa</span>
              <div className="flex gap-1">
                <input className="rounded-md h-10 border border-primarypink p-3 shadow-2xl w-full" type="date" />
                <input className="rounded-md h-10 border border-primarypink p-3 shadow-2xl w-full" type="time" />
              </div>
            </label>
          </div>
          <label className="flex flex-col">
            <span className="text-xs lg:text-sm">Mensagem:</span>
            <textarea placeholder="Escreva sua mensagem aqui! Capricha heeein ❤️" className="rounded-md h-60 border border-primarypink p-3 shadow-2xl"></textarea>
          </label>
          <button className="font-bold py-2 px-4 rounded-md border-2 border-primarypink flex gap-2 justify-center">
            <span>Enviar</span>
          </button>
          <input accept="image/*" className="hidden" multiple type="file" />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-3 items-center justify-center">
          <span>Como vai ficar 👇</span>
          <div className="relative w-[90vw] lg:w-[360px] h-[160vw] lg:h-[75vh] bg-[#202020] rounded-lg shadow-2xl">
            <div className="absolute top-4 left-4 flex gap-2">
              <div className="size-3 bg-red-500 rounded-full"></div>
              <div className="size-3 bg-yellow-500 rounded-full"></div>
              <div className="size-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="flex flex-col text-center gap-4 h-full overflow-y-auto">
              <div className="bg-white mt-10 text-black w-[80%] mx-auto rounded-md">
                <span>nossoday.com/</span>
              </div>
              <div className="w-[80%] h-[60%] mx-auto overflow-hidden rounded-md flex-shrink-0">
                <button className="w-full h-full flex items-center justify-center border border-primarypink rounded-md">
                  <span>Imagem</span>
                </button>
              </div>
            </div>
          </div>
          <button disabled className="bg-primarypink text-white font-bold h-[75px] w-[90%] rounded-md text-2xl disabled:bg-gray-700 flex items-center justify-center gap-2">
            <span>Criar nosso site</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalizeSite;
