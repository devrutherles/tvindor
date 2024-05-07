"use client";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Switch, Transition } from "@headlessui/react";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { geAllData } from "../../../lib/functions";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import axios from "../../../lib/axios";
import { ProgressContext } from "../../../hooks/Fd";
export default function User() {
  const frameRef = useRef();
  const [errors, setErrors] = useState([]);
  const [users, setUsers] = useState([]);
  const [adduser, setaddUser] = useState(false);
  const [posicao, setPosicao] = useState(false);
  const [receberVideosAdm, setReceberVideosAdm] = useState(false);
  const [news, setNews] = useState(false);
  const [senhaChamaGarcom, setSenhaChamaGarcom] = useState(false);
  const [senhaBalcao, setSenhaBalcao] = useState(false);
  const [limparSenhaGarcom, setLimparSenhaGarcom] = useState(false);
  const [user, setUser] = useState("");
  const [cidade, setCidade] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const [currentEdit, setCurrentEdit] = useState([]);
  const { handleFeedback } = useContext(ProgressContext);
  const [currentDelete, setCurrentDelete] = useState();
  const [menu, setMenu] = useState(false);
  const [cardapio, setCardapio] = useState(null);
  const [fileCardapio, setFileCardapio] = useState(null);

  const handleAddUser = async () => {
    setLoading(true);
    const data = {
      name: user,
      email: email,
      cidade: cidade,
      password: password,
      senha_chama_garcom: senhaChamaGarcom == true ? 1 : 0,
      role: role == true ? 1 : 0,
      news: news == true ? 1 : 0,
      senha_balcao: senhaBalcao == true ? 1 : 0,
      limpar_senha_garcom: limparSenhaGarcom == true ? 1 : 0,
      receber_videos_administrador: receberVideosAdm == true ? 1 : 0,
      posicao_tela_horizontal: posicao == true ? 1 : 0,
    };
    try {
      await axios.post(`/api/user`, data).then((response) => {
        if (menu && fileCardapio) {
          handleAddCardapio(response?.data?.data?.id);
        }
        setaddUser(false);
        allUsers();
        handleFeedback({
          title: "Sucesso",
          message: "Usuário atualizado com sucesso",
          status: "success",
          button: "Fechar",
          cancel: "",
          open: true,
        });

        setLoading(false);
        setTimeout(() => {
          handleFeedback({
            title: "",
            message: "",
            status: "",
            button: "",
            cancel: "",
            open: false,
          });
        }, 5000);
        clearInputs();
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleEditUser = async () => {
    setLoading(true);
    const data = {
      name: user,
      email: email,
      cidade: cidade,
      password: password,
      senha_chama_garcom: senhaChamaGarcom == true ? 1 : 0,
      role: role == true ? 1 : 0,
      news: news == true ? 1 : 0,
      senha_balcao: senhaBalcao == true ? 1 : 0,
      limpar_senha_garcom: limparSenhaGarcom == true ? 1 : 0,
      receber_videos_administrador: receberVideosAdm == true ? 1 : 0,
      posicao_tela_horizontal: posicao == true ? 1 : 0,
    };
    try {
      await axios.put(`/api/user/${currentEdit.id}`, data).then((response) => {
        if (menu && fileCardapio) {
          handleAddCardapio(currentEdit.id);
        }
        setaddUser(false);
        clearInputs();
        allUsers();
        setLoading(false);
        handleFeedback({
          title: "Sucesso",
          message: "Usuário atualizado com sucesso",
          status: "success",
          button: "Fechar",
          cancel: "",
          open: true,
        });

        setTimeout(() => {
          handleFeedback({
            title: "",
            message: "",
            status: "",
            button: "",
            cancel: "",
            open: false,
          });
        }, 5000);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const handleDeleteUser = async (id) => {
    if (currentDelete != id) {
      setCurrentDelete(id);
      return;
    }
    try {
      await axios.delete(`/api/user/${id}`).then((response) => {
        allUsers();
        handleFeedback({
          title: "Sucesso",
          message: "Usuário deletado com sucesso",
          status: "success",
          button: "Fechar",
          cancel: "",
          open: true,
        });
        setCurrentDelete(null);
        setTimeout(() => {
          handleFeedback({
            title: "",
            message: "",
            status: "",
            button: "",
            cancel: "",
            open: false,
          });
        }, 5000);
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const allUsers = () => {
    geAllData({
      url: "/user",
      setErrors,
      calback: (response) => {
        setUsers(response.data);
      },
    });
  };

  useEffect(() => {
    let ignore = false;
    allUsers();
    return () => {
      ignore = true;
    };
  }, []);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const clearInputs = () => {
    setCidade("");
    setEmail("");
    setPassword("");
    setUser("");
    setRole(false);
    setNews(false);
    setReceberVideosAdm(false);
    setLimparSenhaGarcom(false);
    setSenhaBalcao(false);
    setSenhaChamaGarcom(false);
    setCurrentEdit([]);
  };
  const handleCardapio = async (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      setCardapio(reader.result);
      setFileCardapio(file);
    };
    reader.readAsDataURL(file);
  };

  const handleAddCardapio = async (id) => {
    const data = new FormData();
    data.append("file", fileCardapio);
    data.append("id", id);
    try {
      await axios
        .post(`/api/cardapio`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log(response.data);
          setCardapio(null);
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Usuários
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Gerenciamento de Usuários. Você pode
            <strong className="font-semibold text-gray-900">
              {" "}
              adicionar, editar e excluir
            </strong>{" "}
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => {
              setaddUser(!adduser);
              if (editUser) {
                setEditUser(false);
                clearInputs();
              }
            }}
            type="button"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {adduser ? "Cancelar" : "Adicionar Usuário"}
          </button>
        </div>
      </div>

      {adduser ? (
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
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    name="email"
                    value={email}
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
                    id="user"
                    onChange={(e) => setUser(e.target.value)}
                    name="user"
                    value={user}
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
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    className="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-none rounded-md"
                    placeholder="Cidade"
                  />
                </div>
                <div className="pt-6 sm:flex items-center">
                  <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                    Senha
                  </dt>

                  <input
                    type="text"
                    id="password"
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
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
                <Switch.Group as="div" className="flex pt-6">
                  <Switch.Label
                    as="dt"
                    className="w-64 flex-none pr-6 font-medium text-gray-900"
                    passive
                  >
                    Conta de Administrador
                  </Switch.Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={role}
                      onChange={setRole}
                      className={classNames(
                        role ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          role ? "translate-x-3.5" : "translate-x-0",
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
                      checked={senhaChamaGarcom}
                      onChange={setSenhaChamaGarcom}
                      className={classNames(
                        senhaChamaGarcom ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          senhaChamaGarcom
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
                      checked={senhaBalcao}
                      onChange={setSenhaBalcao}
                      className={classNames(
                        senhaBalcao ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          senhaBalcao ? "translate-x-3.5" : "translate-x-0",
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
                      checked={limparSenhaGarcom}
                      onChange={setLimparSenhaGarcom}
                      className={classNames(
                        limparSenhaGarcom ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          limparSenhaGarcom
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
                      checked={receberVideosAdm}
                      onChange={setReceberVideosAdm}
                      className={classNames(
                        receberVideosAdm ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          receberVideosAdm
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
                    Posição da tela {posicao ? "Horizontal" : "vertical"}
                  </Switch.Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={posicao}
                      onChange={setPosicao}
                      className={classNames(
                        posicao ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          posicao ? "translate-x-3.5" : "translate-x-0",
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
                      checked={news}
                      onChange={setNews}
                      className={classNames(
                        news ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          news ? "translate-x-3.5" : "translate-x-0",
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
                    Cadastrar cardápio
                  </Switch.Label>
                  <dd className="flex flex-auto items-center justify-end">
                    <Switch
                      checked={menu}
                      onChange={setMenu}
                      className={classNames(
                        menu ? "bg-indigo-600" : "bg-gray-200",
                        "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={classNames(
                          menu ? "translate-x-3.5" : "translate-x-0",
                          "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                        )}
                      />
                    </Switch>
                  </dd>
                </Switch.Group>

                <label
                  htmlFor="dropzone-file"
                  className={classNames(
                    menu ? "" : "hidden",
                    "mx-auto cursor-pointer flex w-full max-w-lg flex-col items-center rounded-xl border-2 border-dashed border-blue-400 bg-white p-6 text-center"
                  )}
                >
                  {cardapio ? (
                    <iframe
                      id="frame"
                      src={cardapio}
                      className="w-[90%] mx-auto h-96 rounded-2xl"
                    ></iframe>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  )}
                  <h2 className="mt-4 text-xl font-medium text-gray-700 tracking-wide">
                    Arraste e solte ou clique para adicionar um arquivo
                  </h2>
                  <p className="mt-2 text-gray-500 tracking-wide">
                    Envie &amp; seu arquivo PDF .{" "}
                  </p>
                  <input
                    onChange={(e) => handleCardapio(e)}
                    id="dropzone-file"
                    type="file"
                    accept=".pdf"
                    className="hidden"
                  />
                </label>
              </dl>
            </div>
          </div>
          <button
            disabled={loading}
            onClick={() => {
              editUser ? handleEditUser() : handleAddUser();
            }}
            type="button"
            style={{
              backgroundColor: loading ? "#ccc" : "#4F46E5",
            }}
            className="block mx-auto rounded-md bg-indigo-600 px-3 py-2 text-center mt-6 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {loading
              ? "Carregando"
              : editUser
              ? "Salvar usuário"
              : "Adicionar Usuário"}
          </button>
        </div>
      ) : (
        <div className="mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 ml-4 text-left text-sm font-semibold text-gray-900"
                >
                  Usuário
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                >
                  Função
                </th>

                <th
                  scope="col"
                  className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 &&
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm">
                      <div className="flex items-center">
                        {1 == 2 && (
                          <>
                            (
                            <div className="h-11 w-11 flex-shrink-0">
                              {user.user && (
                                <img
                                  src={BASE_URL + user.imagem}
                                  className="h-11 w-11  rounded-full "
                                />
                              )}
                              )
                            </div>
                          </>
                        )}
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {user.email}
                          </div>
                          <div className="mt-1 text-gray-500">{user.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap text-center px-3 py-5 text-sm text-gray-500">
                      <span className=" inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {user.role == 1 ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td className="relative text-center whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <div className="flex flex-row gap-2 justify-center">
                        <button
                          onClick={() => {
                            setEditUser(true);
                            setCurrentEdit(user);
                            setUser(user.name);
                            setEmail(user.email);
                            setCidade(user.cidade);
                            setPassword(user.password);
                            setRole(user.role == 1 ? true : false);
                            setNews(user.news == 1 ? true : false);
                            setaddUser(true);
                            setSenhaChamaGarcom(
                              user.senha_chama_garcom == 1 ? true : false
                            );
                            setSenhaBalcao(
                              user.senha_balcao == 1 ? true : false
                            );
                            setLimparSenhaGarcom(
                              user.limpar_senha_garcom == 1 ? true : false
                            );
                            setReceberVideosAdm(
                              user.receber_videos_administrador == 1
                                ? true
                                : false
                            );
                            setPosicao(
                              user.posicao_tela_horizontal == 1 ? true : false
                            );
                          }}
                          className={classNames(
                            currentEdit == user
                              ? "text-green-600 hover:text-green-200"
                              : "text-indigo-600 hover:text-indigo-900",
                            ""
                          )}
                        >
                          {currentEdit == user ? "Salvar" : "Editar"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          href="#"
                          className={classNames(
                            currentDelete == user?.id
                              ? "text-red-600 hover:text-red-900"
                              : "text-indigo-600 hover:text-indigo-900",
                            ""
                          )}
                        >
                          {currentDelete == user?.id ? (
                            "Tem certeza?"
                          ) : (
                            <TrashIcon className="h-6 w-6" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      <Transition
        show={success}
        as={Fragment}
        leave="transition ease-in duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        style={{
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 999,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div className="flex w-3/5 items-center justify-center bg-[transparent] ">
          <div className="rounded-lg bg-gray-50 w-[25%] px-16 py-14 mx-auto mt-[10%]">
            <div className="flex justify-center items-center">
              <div className="rounded-full bg-green-200 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-8 w-8 text-white"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
              Parabéns!!!
            </h3>
            <p className="w-[230px] text-center font-normal text-gray-600">
              Usuário cadastrado com sucesso
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-green-600 px-6 py-3 text-center text-base font-medium text-green-100 outline-8 hover:outline hover:duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </Transition>
    </div>
  );
}
