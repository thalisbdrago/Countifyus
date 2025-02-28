import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="relative isolate flex items-center justify-center min-h-screen px-6 py-12 sm:px-8 bg-gray-900 text-white">
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
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primarypink">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Ops! Página não encontrada 😢</h2>
        <p className="mt-2 text-gray-400">
          Parece que você digitou um link inválido ou o evento não existe.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-md bg-indigo-600 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
