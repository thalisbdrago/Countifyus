import React from "react";

const Footer = () => {
  return (
    <footer className="relative isolate bg-gray-200 px-6 py-12 sm:px-8">
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

      <div className="relative z-10 text-center text-white">
      </div>

      <div className="mt-12 text-center text-sm text-gray-400">
        <p>&copy; 2025 countifyUs. Todos os direitos reservados.</p>
        <div className="mt-4 flex justify-center gap-6">
          <a href="#" className="hover:text-gray-300">
            Termos de Serviço
          </a>
          <a href="#" className="hover:text-gray-300">
            Privacidade
          </a>
          <p>
            Duvidas/Suporte: seuconvite59@gmail.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
