"use client";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrashIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Dialog, Switch, Transition } from "@headlessui/react";
import { useAuth } from "../../../hooks/auth";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { deleteData, geAllData, updateData } from "../../../lib/functions";
import AddVideo from "../../../components/AddVideo";
import FeedBack from "../../../components/FeedBack";
import { ProgressContext, useProgress } from "../../../hooks/Fd";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
const Videos = () => {
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addvideo, setAddvideo] = useState(false);
  const fileUploadRef = useRef(null);
  const [currentEdit, setCurrentEdit] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [file, setfile] = useState(null);
  const { handleFeedback, handleProgress } = useContext(ProgressContext);
  const { user } = useAuth({ middleware: "auth" });
  const [users, setUsers] = useState([]);
  const [currentDelete, setCurrentDelete] = useState(null);

  const [formInputs, setFormInputs] = useState({
    title: "",
    video: "",
    expires_on: "",
    status: true,
    clientes: [user?.id],
  });

  const todosVideos = async () => {
    await geAllData({
      url: "/videos",
      setErrors,
      calback: (response) => {
        const myVideos = response?.data?.filter((video) => {
          const cliente = JSON.parse(video?.clientes);
          if (cliente?.includes(user?.id) || user?.role == 1) {
            return video;
          }
        });
        setVideos(myVideos);
      },
    });
  };
  useEffect(() => {
    todosVideos();
    allUsers();
  }, []);

  const handleChanges = (e) => {
    setFormInputs({
      ...formInputs,
      [e.target.name]: e.target.value,
    });
  };

  const updateVideo = async ({ data }) => {
    await updateData({
      url: `/video/update`,
      setLoading,
      setErrors,
      data: {
        id: data.id,
        status: formInputs.status ? "ativo" : "inativo",
        title: data.title,
        expires_on: formInputs.expires_on
          ? new Date(formInputs.expires_on).toISOString().slice(0, 10)
          : data?.expires_on,
        clientes: JSON.stringify(formInputs.clientes),
      },
      calback: (response) => {
        todosVideos();
        handleFeedback({
          title: "Video enviado",
          message: "O video foi enviado com sucesso",
          status: "success",
          open: true,
          cancel: "Cancelar",
          button: "Fechar",
        });
        setTimeout(() => {
          handleFeedback({
            open: false,
            title: "",
            message: "",
            status: "",
            progress: 0,
            button: "",
            cancel: "",
          });
        }, 5000);

        setFormInputs({
          title: "",
          video: "",
          expires_on: "",
          status: true,
          clientes: [user?.id],
        });
        setAddvideo(false);
        setVideo(null);
        setVideoPreview(null);
      },
    });
  };

  const validateForm = () => {
    if (!formInputs.title) {
      setErrors(["O campo título é obrigatório"]);
      return false;
    }

    if (!formInputs.clientes.length) {
      setErrors(["O campo clientes é obrigatório"]);
      return false;
    }
    if (!file) {
      setErrors(["O campo video é obrigatório"]);
      return false;
    }
    setErrors([]);
    return true;
  };

  const submitForm = () => {
    const isValid = validateForm();
    if (!isValid) {
      console.log(formInputs);
      return;
    }
    console.log("Formulário válido");
    handleFeedback({
      title: "Enviando video",
      message: "Aguarde enquanto o video é enviado",
      status: "info",
      open: true,
      cancel: "Cancelar",
      button: "Fechar",
    });

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    setVideoPreview(URL.createObjectURL(file));
    setVideo(file.name);

    axios
      .post("https://api.rutherles.pt/api/video/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          console.log(progressEvent);
          handleProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
        withCredentials: true,
        withXSRFToken: true,
      })
      .then(async (response) => {
        await updateVideo(response.data);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  const handlePreview = (e) => {
    const uploadedFile = e.target.files[0];
    setfile(uploadedFile);
    setVideoPreview(URL.createObjectURL(uploadedFile));
    setVideo(uploadedFile.name);
  };

  const handleEdit = (video) => {
    if (currentEdit !== video) {
      setCurrentEdit(video);

      setFormInputs({
        title: video.title,
        expires_on: video?.expires_on
          ? new Date(video.expires_on).toISOString()
          : null,
        status: video.status === "ativo" ? true : false,
        clientes: video.clientes ? JSON.parse(video.clientes) : [],
        video: video.video,
      });
    } else {
      setLoading(true);
      updateVideo({ data: video });
      setCurrentEdit({});
    }
  };
  const setStatus = () => {
    setFormInputs({
      ...formInputs,
      status: !formInputs.status,
    });
  };
  const setClientes = (e) => {
    setFormInputs({
      ...formInputs,
      clientes: [...formInputs.clientes, e],
    });
  };
  const removeCliente = (e) => {
    const newClientes = formInputs.clientes.filter((cliente) => cliente !== e);
    setFormInputs({
      ...formInputs,
      clientes: newClientes,
    });
  };
  const deleteVideo = async (id) => {
    await deleteData({
      url: `/video/delete/${id}`,

      setErrors,
      calback: (response) => {
        todosVideos();
        handleFeedback({
          title: "Video deletado",
          message: "O video foi deletado com sucesso",
          status: "success",
          open: true,
          cancel: "Cancelar",
          button: "Fechar",
        });
        setTimeout(() => {
          handleFeedback({
            open: false,
            title: "",
            message: "",
            status: "",
            progress: 0,
            button: "",
            cancel: "",
          });
        }, 5000);
        setLoading(false);
      },
    });
  };
  const allUsers = async () => {
    await geAllData({
      url: "/users",
      setErrors,
      calback: (response) => {
        setUsers(response.data);
      },
    });
  };
  const handleClientes = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };
  const handleAssign = (value) => {
    if (formInputs?.clientes.includes(value)) {
      removeCliente(value);
      return;
    }
    setClientes(value);
  };

  const handleDelete = (id) => {
    if (currentDelete == id) {
      deleteVideo(id);
      setCurrentDelete(null);
    } else {
      setCurrentDelete(id);
    }
  };
  console.log(videoPreview);
  console.log(video)
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8">
        <div
          className={classNames(addvideo ? "hidden" : "flex  items-center", "")}
        >
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Videos
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Gerenciamento de videos. Você pode
              <strong className="font-semibold text-gray-900">
                {" "}
                adicionar, editar e excluir
              </strong>{" "}
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              disabled={loading}
              style={{
                backgroundColor: loading ? "#ccc" : "#2563EB",
              }}
              onClick={() => setAddvideo(!addvideo)}
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Enviar Video
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold pr-2">Erro!</strong>
            <span className="block sm:inline">{errors[0]}</span>
          </div>
        )}

        <AddVideo
          title={formInputs.title}
          description={formInputs.description}
          label="Título"
          show={addvideo}
          handleChanges={handleChanges}
          formInputs={formInputs}
          video={video}
          videoPreview={videoPreview}
          setVideoPreview={setVideoPreview}
          setVideo={setVideo}
          handlePreview={handlePreview}
          fileUploadRef={fileUploadRef}
          submitForm={submitForm}
          setFormInputs={setFormInputs}
          setStatus={setStatus}
          setClientes={setClientes}
          removeCliente={removeCliente}
          loading={loading}
          setAddvideo={setAddvideo}
          user={user}
        />

        <div
          className={classNames(
            addvideo ? "hidden" : "",
            "mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg"
          )}
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className=" p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                >
                  Video
                </th>

                <th
                  scope="col"
                  className=" p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className=" p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                >
                  Expira em
                </th>
                <th
                  scope="col"
                  className=" p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className={classNames(
                    user?.role == 1 ? "" : "hidden",
                    " p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                  )}
                >
                  Clientes
                </th>

                <th
                  scope="col"
                  className=" p-3 text-left  text-sm font-semibold text-gray-900 w-[25%]"
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {videos.length > 0 &&
                videos.map((video) => (
                  <tr key={video.id}>
                    <td className="whitespace-nowrap p-3 w-[25%] text-sm text-gray-500">
                      <div className="flex items-center ml-0 ">
                        <div className="h-16 w-16 flex-shrink-0">
                          {video.video && (
                            <video
                              width={"4rem"}
                              height={"4rem"}
                              muted
                              className="h-16 w-16 pointer-events-none	 rounded-full object-cover "
                            >
                              <source
                                src={BASE_URL + video.video}
                                type="video/mp4"
                              />
                              Desculpe, seu navegador não suporta a visualização
                              de vídeos.
                            </video>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {video.title}
                          </div>
                          <a
                            target="_blank"
                            href={BASE_URL + video.video}
                            className="mt-1 text-indigo-500 text-[10px] hover:text-indigo-700"
                          >
                            {"Link Protegido" + video.video}
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap p-3 w-[25%] text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {video.id}
                      </span>
                    </td>
                    <td className="whitespace-nowrap p-3 w-[25%] text-sm text-gray-500">
                      {currentEdit == video ? (
                        <input
                          type="datetime-local"
                          name="expires_on"
                          id="expires_on"
                          value={formInputs.expires_on}
                          onChange={(e) => handleChanges(e)}
                          className="block flex-1 border-0 bg-slate-100 rounded-md py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                          placeholder="
                    Deixe em branco para nunca expirar
                    "
                        />
                      ) : (
                        <button
                          className={classNames(
                            video == currentEdit
                              ? "cursor-pointer hover:text-green-300 text-green-700"
                              : " cursor-not-allowed text-gray-500",
                            "inline-flex w-[50%] items-center rounded-md outline-none border-none  px-2 py-1 text-xs font-medium  "
                          )}
                        >
                          {video.expires_on ? video.expires_on : "Nunca"}
                        </button>
                      )}
                    </td>
                    <td className="whitespace-nowrap p-3 w-[25%] text-sm text-gray-500">
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        {video.status}
                      </span>
                    </td>
                    <td
                      className={classNames(
                        user?.role == 1 ? "" : "hidden",
                        "whitespace-nowrap p-3 w-[25%] text-sm text-gray-500"
                      )}
                    >
                      <button
                        disabled={currentEdit != video}
                        onClick={() => handleClientes()}
                        className={classNames(
                          video == currentEdit
                            ? "cursor-pointer hover:text-green-300 text-green-700"
                            : " cursor-not-allowed text-gray-500",
                          "inline-flex w-[50%] items-center rounded-md outline-none border-none  px-2 py-1 text-xs font-medium  "
                        )}
                      >
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {video?.clientes &&
                          video?.clientes != null &&
                          currentEdit != video
                            ? JSON.parse(video.clientes).length +
                              " " +
                              "Cliente(s)"
                            : currentEdit == video &&
                              formInputs.clientes.length > 0
                            ? formInputs.clientes.length + " " + "Cliente(s)"
                            : "Nenhum Cliente"}
                        </span>
                      </button>
                    </td>
                    <td className="whitespace-nowrap p-3 w-[25%] text-sm text-gray-500">
                      <div className="flex flex-row gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(video)}
                          className={classNames(
                            currentEdit == video
                              ? "text-green-600 hover:text-green-200 "
                              : " text-indigo-600 hover:text-indigo-200",
                            ""
                          )}
                        >
                          {currentEdit == video ? "Salvar" : "Editar"}
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
                          className={classNames(
                            currentDelete == video.id
                              ? "text-red-600 hover:text-red-200 "
                              : " text-indigo-600 hover:text-indigo-200",
                            ""
                          )}
                        >
                          {currentDelete == video.id ? (
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
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Clientes Atrbuídos
                  </Dialog.Title>
                  <div className="mt-2">
                    <div
                      className={classNames(
                        "px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                      )}
                    >
                      <dd className="overflow-y-auto max-h-[33vh]  text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                        <ul
                          role="list"
                          className="divide-y divide-gray-100 rounded-md border border-gray-200"
                        >
                          {users?.map((person) => (
                            <li
                              key={person.id}
                              className="flex items-center justify-between py-2 pl-4 pr-5 text-sm leading-6"
                            >
                              <div className="flex w-0 flex-1 items-center">
                                <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                  <span className="truncate font-medium">
                                    {person.name}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <button
                                  onClick={() => handleAssign(person.id)}
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                  {formInputs.clientes.includes(person.id)
                                    ? "Remover"
                                    : "Atribuir"}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Confirmar
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
export default Videos;
