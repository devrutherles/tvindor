"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { deleteData, geAllData } from "../../../lib/functions";
import { useAuth } from "../../../hooks/auth";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Senha() {
  const [senhas, setSenhas] = useState([]);
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState();
  const [senhaOpen, setSenhaopen] = useState({});
  const cancelButtonRef = useRef(null);
  const [count, setCount] = useState(0);
  const { user } = useAuth();

  const tabs = [
    { name: "Todos", href: "#", counts: senhas?.length, current: true },
  ];
  const removeItem = async (item) => {
    await deleteData({
      url: `/senha/${item.id}`,
      setErrors,
      calback: (response) => {
        setSenhas(senhas.filter((senha) => senha.id !== item.id));
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 5000);
        setSenhaopen({});
      },
    });
  };

  const allSenhas = async () => {
    await geAllData({
      url: `/senhas/id/${user?.id}`,
      setErrors,
      calback: (response) => {
        console.log(response);
        setSenhas(response);
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      allSenhas();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center  mt-5">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Senhas de atendimento
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Pressione 2x para remover uma senha atendida.
          </p>
        </div>
      </div>
      <div>
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">
            Select a tab
          </label>
          {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue={tabs.find((tab) => tab.current).name}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <a
                  key={tab.name}
                  href="#"
                  className={classNames(
                    tab.current
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:border-gray-200 hover:text-gray-700",
                    "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                  )}
                  aria-current={tab.current ? "page" : undefined}
                >
                  {tab.name}
                  {tab.counts ? (
                    <span
                      className={classNames(
                        tab.current
                          ? "bg-indigo-100 text-indigo-600"
                          : "bg-gray-100 text-gray-900",
                        "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                      )}
                    >
                      {tab.counts}
                    </span>
                  ) : null}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className=" flex flex-row flex-wrap gap-3 w-[100%] mt-8 ">
        {senhas?.length > 0 &&
          senhas?.map((item, index) => {
            const baseClass =
              "w-24 h-24 rounded-lg text-2xl text-white flex justify-center items-center font-semibold opacity-50";
            let colorClass = "bg-slate-700";

            if (item.type === "garcom") {
              colorClass = "!bg-green-600 !w-24 !h-24";
            } else if (item.type === "encerrar") {
              colorClass = "bg-red-600";
            }

            return (
              <button
                onDoubleClick={() => removeItem(item)}
                onClick={() => setSenhaopen(item)}
                className={`${baseClass} ${colorClass}`}
                key={index}
                style={{
                  opacity: senhaOpen == item ? 1 : 0.5,
                }}
              >
                {item.value}
              </button>
            );
          })}
      </div>

      <div
        style={{
          display: success ? "block" : "none",
          opacity: success ? 1 : 0,
          transition: "all 0.8s ease",
          position: "fixed",
          top: "1%",
          left: "23%",
          width: "75%",
          marginInline: "auto",
          zIndex: 999,
        }}
        className="font-regular relative mb-4 block w-full rounded-lg bg-green-500 p-4 text-base leading-5 text-white opacity-100"
      >
        Senha removida com sucesso.
      </div>
    </div>
  );
}
