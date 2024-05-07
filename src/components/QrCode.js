import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/hooks/auth";
export default function SidePod({ isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth({ middleware: "auth" });

  const [nome, setNome] = useState("");
  const [mesa, setMesa] = useState("1");
  const [image, setImage] = useState(
    `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=front.rutherles.pt`
  );
  const [ready, setReady] = useState(false);
  const getLink = async () => {
    setLoading(true);
    const data = encodeUrl(
      `https://front.rutherles.pt/cliente/?nome=${nome}&mesa=${mesa}&id=${user?.id}`
    );

    await getImageAsBase64(
      `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${data}`
    )
      .then((res) => {
        setImage(res);
        setReady(true);

        setLoading(false);
      })
      .catch((err) => {
        setReady(false);
        console.log(err);
        setLoading(false);
      });
  };
  const encodeUrl = (url) => {
    return encodeURIComponent(url);
  };
  async function getImageAsBase64(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  function downloadImage() {
    const link = document.createElement("a");
    link.href = `${image}`;
    link.download = `mesa_${mesa}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMesa(1);
    setNome("");
    setReady(false);
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setIsOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 sm:-ml-10 sm:pr-4">
                      <button
                        type="button"
                        className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex h-full flex-col overflow-y-scroll bg-slate-50 py-6 shadow-xl mt-16">
                    <div className="flex flex-col items-center justify-center ">
                      <span className="font-semibold text-2xl text-gray-900 mb-8">
                        Gerar QR Code
                      </span>
                      <div className="transform -translate-y-0 opacity-100">
                        <div className="mx-auto flex justify-center pb-5 lg:px-12 mb-8">
                          <img
                            src={image}
                            alt="qr code"
                            className={"w-[235px] h-[235px]"}
                          />
                          {ready && (
                            <span className="absolute bottom-0 mx-auto bg-white text-black p-1 rounded-lg">
                              {mesa}.png gerado com sucesso
                            </span>
                          )}
                        </div>
                        <span className="font-semibold  uppercase">
                          Nome do estabelecimento
                        </span>

                        <input
                          className="mt-2 mb-8 flex w-full items-center outline-none justify-between rounded-lg  py-3 pl-6 text-left text-sm text-gray-900  focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 rounded-b-lg"
                          value={nome}
                          onChange={(e) => setNome(e.target.value)}
                          type="text"
                          placeholder="Nome do estabelecimento"
                        />
                        <div
                          style={{ display: "none" }}
                          className="transform -translate-y-1/2 opacity-0"
                          hidden
                        />

                        <span className="font-semibold mt-5 uppercase">
                          Mesa
                        </span>

                        <input
                          className="mt-2 mb-8 flex w-full items-center outline-none justify-between rounded-lg  py-3 pl-6 text-left text-sm text-gray-900  focus:outline-none focus-visible:ring focus-visible:ring-primary focus-visible:ring-opacity-75 rounded-b-lg"
                          value={mesa}
                          onChange={(e) => setMesa(e.target.value)}
                          type="text"
                          placeholder="Número da mesa"
                        />

                        <div hidden style={{ display: "none" }} />
                      </div>
                    </div>{" "}
                    <div className="mt-5 flex w-full flex-col items-center justify-between gap-5 gap-x-5 rounded-lg px-6 py-5 text-left text-sm text-white lg:flex-row">
                      <button
                        onClick={getLink}
                        className="flex w-6/12 items-center justify-center rounded-full bg-indigo-600 px-2 py-5 text-white transition-all duration-300 ease-in-out"
                      >
                        <span className="mr-2 w-6 text-[24px]">+</span>
                        Gerar
                      </button>
                      <button
                        onClick={() => {
                          downloadImage();
                        }}
                        style={{ display: ready ? "flex" : "none" }}
                        className="flex w-6/12 items-center justify-center rounded-full bg-green-600 px-2 py-5 text-white transition-all duration-300 ease-in-out"
                      >
                        <span className="mr-2 w-6">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="ionicon"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={32}
                              d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40"
                            />
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={32}
                              d="M176 272l80 80 80-80M256 48v288"
                            />
                          </svg>
                        </span>
                        Salvar
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
