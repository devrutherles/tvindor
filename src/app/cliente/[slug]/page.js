"use client";
import React, { useEffect, useState, Suspense } from "react";
import axios from "../../../lib/axios";
import { postData } from "../../../lib/functions";
import Loading from "../../(app)/Loading";
const Page = ({ params }) => {
  const [user, setUser] = useState(null);
  const [success, setSuccess] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const { slug } = params;
let parame = decodeURIComponent(slug).split('&');

let id = parame.find(param => param.startsWith('id')).split('=')[1];
let mesa = parame.find(param => param.startsWith('mesa')).split('=')[1];

console.log(id, mesa); // 1, 1
  const searchUser = async () => {
    await axios
      .get(`/api/user/${id}`)
      .then((res) => {
        setUser(res?.data?.data);
        console.log(res?.data?.data);
      })
      .catch((err) => {
        console.error("error usr", err);
      });
  };
  useEffect(() => {
    if (id) {
      searchUser();
    }
  }, [id]);

  const handleSenha = async (tipo) => {
    await postData({
      url: "/senha",

      data: {
        value: mesa,
        type: tipo,
        status: "pendente",
        data: new Date().toISOString(),
        user_id: id,
      },
      calback: (data) => {
        setSuccess(data.data.type);
      },
    });
  };

  const getImage = async (data) => {
    await axios
      .get(
        `${BASE_URL}/api/cardapio`,

        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
          withXSRFToken: true,
          id: data,
        }
      )
      .then((res) => {
        const file = res?.data?.data?.filter((item) => item.id == id)[0];
        handleMenu(file?.cardapio);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleMenu = async (data) => {
    const Link = document.createElement("a");
    Link.href = BASE_URL + data;
    Link.target = "_blank";
    Link.download = "cardapio";
    Link.click();

    // window.open(BASE_URL + image, "_blank");
  };
  if (!user || !user?.name) {
    return <Loading />;
  }
  return (
  
    <div className="mx-auto max-w-[450px] h-[100vh]">
      <div className="h-full bg-gray-50  flex flex-col">
        <div className="rounded-b-xl bg-indigo-600 p-5 pb-44 text-white">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-center text-3xl font-semibold">{user?.name}</h1>
            <div className="rounded-lg bg-indigo-50/30 p-3 hover:bg-white hover:text-indigo-500">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="-mt-40 p-5">
          <div className="rounded-xl bg-white p-4 font-medium text-slate-500 shadow-sm">
            <div className="mb-3 text-sm">Auto Atendimento</div>
            <div className="mb-3"></div>

            <button
              onClick={() => getImage()}
              className="flex w-full items-center justify-center rounded-lg bg-indigo-600 py-3 px-5 font-medium tracking-wide text-white text-opacity-90 shadow-slate-100 hover:shadow-lg"
            >
              <span className="mr-2">Ver cardápio</span>
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </button>
          </div>
        </div>
        <section className="p-5">
          <div className="mb-5 flex items-center justify-between">
            <h4 className="font-medium text-slate-500">O que deseja fazer?</h4>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => handleSenha("garcom")}
              className="flex space-x-4 rounded-xl w-full bg-white p-3 shadow-sm text-left hover:bg-indigo-100 hover:text-white relative"
            >
              <img
                className="aspect-square w-16 rounded-lg bg-center object-cover"
                src="/garcom.png"
                alt=""
              />
              <div>
                <h4 className="font-semibold text-gray-600">Chamar garçom</h4>
                {success == "garcom" && (
                  <span className="  bg-green-600 text-[#fff] p-[4px] text-[12px] rounded-[8px] [transition:opacity_0.3s,_visibility_0.3s,_top_0.3s,_background_0.3s] ">
                    Garçom chamado
                  </span>
                )}
                <p className="text-sm text-slate-400">
                  Um garçom será enviado para atendê-lo
                </p>
              </div>
            </button>
            <button
              onClick={() => handleSenha("encerrar")}
              className="flex space-x-4 rounded-xl w-full bg-white p-3 shadow-sm text-left hover:bg-indigo-100 hover:text-white relative"
            >
              <img
                className="aspect-square w-16 rounded-lg bg-center object-cover"
                src="/pagamento.png"
                alt=""
              />
              <div>
                <h4 className="font-semibold text-gray-600">Pedir a conta</h4>
                {success == "encerrar" && (
                  <span className="  bg-green-600 text-[#fff] p-[4px] text-[12px] rounded-[8px] [transition:opacity_0.3s,_visibility_0.3s,_top_0.3s,_background_0.3s] ">
                    Conta solicitada
                  </span>
                )}
                <p className="text-sm text-slate-400">
                  A conta será enviada para sua mesa
                </p>
              </div>
            </button>
            <button
              onClick={() => getImage()}
              className="flex space-x-4 rounded-xl w-full bg-white p-3 shadow-sm text-left hover:bg-indigo-100 hover:text-white relative"
            >
              <img
                className="aspect-square w-16 rounded-lg bg-center object-cover"
                src="/cardapio.png"
                alt=""
              />
              <div>
                <h4 className="font-semibold text-gray-600">Cardápio</h4>
                <p className="text-sm text-slate-400">Veja o nosso cardápio</p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
