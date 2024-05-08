"use client";
import { Switch } from "@headlessui/react";

import { useContext, useState } from "react";
import { useAuth } from "@/hooks/auth";
import { updateData } from "../../../lib/functions";
import { ProgressContext, useProgress } from "@/hooks/Fd";

export default function Config() {
  const [errors, setErrors] = useState([]);
  const { user } = useAuth({ middleware: "auth" });
  const { handleFeedback, handleProgress } = useContext(ProgressContext);
  const [userInput, setUserInput] = useState({
    name: user.name || "",
    email: user.email || "",
    cidade: user.cidade || "",
    password: "",
    role: user.role || false,
    senha_chama_garcom: user.senha_chama_garcom || false,
    news: user.news || false,
    senha_balcao: user.senha_balcao || false,
    limpar_senha_garcom: user.limpar_senha_garcom || false,
    receber_videos_administrador: user.receber_videos_administrador || false,
    posicao_tela_horizontal: user.posicao_tela_horizontal || false,
  });

  console.log(userInput);

  const [loading, setLoading] = useState(false);

  const onChangeUser = (e, name = false) => {
    console.log(e, name);

    if (name) {
      setUserInput({ ...userInput, [name]: e });
      return;
    }
    e.preventDefault();
    setUserInput({ ...userInput, [e.target.name]: e.target.value });
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleAddUser = () => {
    updateData({
      setErrors,
      setLoading,
      url: `/user/${user.id}`,
      data: userInput,
      setErrors,
      calback: (response) => {
        handleFeedback({
          title: "Configurações",
          message: "Configurações salvas com sucesso",     
          status: "success",
          open: true,
          cancel: "Cancelar",
          button: "Fechar",
        });
      },
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Configurações
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Aqui você pode{" "}
            <strong className="font-semibold text-gray-900">
              {" "}
              Configurar as informações do usuário{" "}
            </strong>{" "}
          </p>
        </div>
        {errors}
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => handleAddUser()}
            type="button"
            style={{
              backgroundColor: loading ? "#ccc" : "#4F46E5",
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading ? "Carregando" : "Salvar"}
          </button>
        </div>
      </div>

      <div className="col-span-full  ">
        <div className="mx-auto max-w-2xl  space-y-16 mt-8 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Email
                </dt>

                <input
                  type="text"
                  disabled={user.role == 1 ? false : true}
                  id="email"
                  onChange={(e) => onChangeUser(e)}
                  name="email"
                  value={userInput.email}
                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                  placeholder="Email"
                />
              </div>
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Usuário
                </dt>

                <input
                  type="text"
                  id="name"
                  onChange={(e) => onChangeUser(e)}
                  name="name"
                  value={userInput.name}
                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                  placeholder="Usuário"
                />
              </div>
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Cidade
                </dt>

                <input
                  type="text"
                  id="cidade"
                  name="cidade"
                  value={userInput.cidade}
                  onChange={(e) => onChangeUser(e)}
                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                  placeholder="Cidade"
                />
              </div>
              <div className="pt-6 sm:flex items-center">
                <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                  Senha{" "}
                  <p className="text-xs text-gray-500">
                    Deixe em branco para não alterar
                  </p>
                </dt>

                <input
                  type="text"
                  id="password"
                  name="password"
                  onChange={(e) => onChangeUser(e)}
                  className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                  placeholder="Senha"
                />
              </div>
            </dl>
          </div>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Configuração da estação
            </h2>
            <dl className=" space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
              <Switch.Group
                as="div"
                className={classNames(
                  user?.role == 1 ? "" : "hidden",

                  "flex pt-6"
                )}
              >
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Conta de Administrador
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    id="role"
                    name="role"
                    checked={userInput.role}
                    onChange={(e) => onChangeUser(e, "role")}
                    className={classNames(
                      userInput.role ? "bg-indigo-600" : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.role ? "translate-x-3.5" : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Senha Chama Garçom
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={setUserInput.senha_chama_garcom}
                    onChange={(e) => onChangeUser(e, "senha_chama_garcom")}
                    id="senha_chama_garcom"
                    name="senha_chama_garcom"
                    className={classNames(
                      userInput.senha_chama_garcom
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.senha_chama_garcom
                          ? "translate-x-3.5"
                          : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Senha Balcão
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={setUserInput.senha_balcao}
                    onChange={(e) => onChangeUser(e, "senha_balcao")}
                    id="senha_balcao"
                    name="senha_balcao"
                    className={classNames(
                      userInput.senha_balcao ? "bg-indigo-600" : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.senha_balcao
                          ? "translate-x-3.5"
                          : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Limpar Senha Garçom
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={userInput.limpar_senha_garcom}
                    onChange={(e) => onChangeUser(e, "limpar_senha_garcom")}
                    id="limpar_senha_garcom"
                    name="limpar_senha_garcom"
                    className={classNames(
                      userInput.limpar_senha_garcom
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.limpar_senha_garcom
                          ? "translate-x-3.5"
                          : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Receber Vídeos do Administrador
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={userInput.receber_videos_administrador}
                    onChange={(e) =>
                      onChangeUser(e, "receber_videos_administrador")
                    }
                    id="receber_videos_administrador"
                    name="receber_videos_administrador"
                    className={classNames(
                      userInput.receber_videos_administrador
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.receber_videos_administrador
                          ? "translate-x-3.5"
                          : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Posição da tela{" "}
                  {userInput.posicao_tela_horizontal
                    ? "Horizontal"
                    : "vertical"}
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={userInput.posicao_tela_horizontal}
                    onChange={(e) => onChangeUser(e, "posicao_tela_horizontal")}
                    id="posicao_tela_horizontal"
                    name="posicao_tela_horizontal"
                    className={classNames(
                      userInput.posicao_tela_horizontal
                        ? "bg-indigo-600"
                        : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.posicao_tela_horizontal
                          ? "translate-x-3.5"
                          : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
              <Switch.Group as="div" className="flex pt-6">
                <Switch.Label
                  as="dt"
                  className="w-64 flex-none pr-6 font-medium text-gray-900"
                  passive
                >
                  Receber Entretenimento
                </Switch.Label>
                <dd className="flex flex-auto items-center justify-end">
                  <Switch
                    checked={userInput.news}
                    onChange={(e) => onChangeUser(e, "news")}
                    id="news"
                    name="news"
                    className={classNames(
                      userInput.news ? "bg-indigo-600" : "bg-gray-200",
                      "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={classNames(
                        userInput.news ? "translate-x-3.5" : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </dd>
              </Switch.Group>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
