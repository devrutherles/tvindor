"use client";
import { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
  TrashIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import { geAllData, updateData } from "../../../../lib/functions";
import { ProgressContext } from "../../../../hooks/Fd";
import { useAuth } from "../../../../hooks/auth";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Playlist() {
  const { user } = useAuth({ middleware: "auth" });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState([]);
  const { handleFeedback } = useContext(ProgressContext);
  const [currentEdit, setCurrentEdit] = useState({
    id: "",
    status: "",
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
  }, [user]);

  const handleActive = async (id, status) => {
    setCurrentEdit({ id: id.id, status: status });
    console.log(id);
    await updateData({
      url: `/video/update`,
      data: {
        id: id.id,
        status: status,
        title: id.title,
        expires_on: id.expires_on,
        video: id.video,
        clientes: id.clientes,
      },
      setErrors,
      setLoading,
      setSuccess,
      calback: (response) => {
        todosVideos();
        handleFeedback({
          title: "Sucesso",
          message: "Vídeo atualizado com sucesso",
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
      },
    });
  };

  return (
    <>
      <div className="bg-white">
        <div>
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:overflow-hidden">
            <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Minha Playlist de Vídeos
              </h1>

              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
                >
                  <span className="sr-only">View grid</span>
                  <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="sr-only">Filters</span>
                  <FunnelIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>

            <section
              aria-labelledby="products-heading"
              className="pb-6 pt-6  overflow-hidden	"
            >
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 overflow-hidden ">
                {/* Todos os vídeos */}
                <div className=" lg:col-span-2 max-h-[70vh] p-4   rounded-2xl overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Videos inativos
                  </h2>
                  <div className=" h-[1px] w-full my-2 bg-slate-300" />

                  <table
                    role="table"
                    className="w-full min-w-[500px] overflow-x-scroll"
                  >
                    <thead>
                      <tr role="row">
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Vídeo
                          </div>
                        </th>
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Expira em
                          </div>
                        </th>
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Ações
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody role="rowgroup" className="px-4">
                      {videos?.length > 0 &&
                        videos.map(
                          (video) =>
                            video.status === "inativo" && (
                              <tr key={video.id} role="row">
                                <td className="py-3 text-sm" role="cell">
                                  <div className="flex items-center gap-2">
                                    {video.video && (
                                      <video
                                        muted
                                        className="h-10 w-10 pointer-events-none	 rounded-xl object-cover "
                                      >
                                        <source
                                          src={BASE_URL + video.video}
                                          type="video/mp4"
                                        />
                                        Desculpe, seu navegador não suporta a
                                        visualização de vídeos.
                                      </video>
                                    )}
                                    <p className="text-sm font-medium text-gray-700 ">
                                      {video.title}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-3 text-sm" role="cell">
                                  <p className="text-md font-medium text-gray-700 ">
                                    {video.expires_on
                                      ? video.expires_on
                                      : "Nunca"}
                                  </p>
                                </td>
                                <td className="py-3 text-sm" role="cell">
                                  <div className="mx-2 flex font-bold">
                                    <div className="h-2 w-16 rounded-full ">
                                      <button
                                        onClick={() =>
                                          handleActive(video, "ativo")
                                        }
                                        className={classNames(
                                          loading
                                            ? "cursor-not-allowed text-gray-900"
                                            : "cursor-pointer text-indigo-600",
                                          "font-semibold  flex items-center"
                                        )}
                                      >
                                        {loading ? "Aguarde..." : "Ativar"}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                        )}
                    </tbody>
                  </table>
                </div>

                {/* Na playlist */}
                <div className=" lg:col-span-2 max-h-[70vh] p-4   rounded-2xl overflow-y-auto">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Videos ativos
                  </h2>
                  <div className=" h-[1px] w-full my-2 bg-slate-300" />

                  <table
                    role="table"
                    className="w-full min-w-[500px] overflow-x-scroll"
                  >
                    <thead>
                      <tr role="row">
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Vídeo
                          </div>
                        </th>
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Expira em
                          </div>
                        </th>
                        <th
                          colSpan={1}
                          role="columnheader"
                          title="Toggle SortBy"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="flex items-center justify-between pb-2 pt-4 text-start uppercase tracking-wide text-gray-600 sm:text-xs lg:text-xs">
                            Ações
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody role="rowgroup" className="px-4">
                      {videos?.length > 0 &&
                        videos.map(
                          (video) =>
                            video.status === "ativo" && (
                              <tr key={video.id} role="row">
                                <td className="py-3 text-sm" role="cell">
                                  <div className="flex items-center gap-2">
                                    {video.video && (
                                      <video
                                        muted
                                        className="h-10 w-10 pointer-events-none	 rounded-xl object-cover "
                                      >
                                        <source
                                          src={BASE_URL + video.video}
                                          type="video/mp4"
                                        />
                                        Desculpe, seu navegador não suporta a
                                        visualização de vídeos.
                                      </video>
                                    )}
                                    <p className="text-sm font-medium text-gray-700 ">
                                      {video.title}
                                    </p>
                                  </div>
                                </td>
                                <td className="py-3 text-sm" role="cell">
                                  <p className="text-md font-medium text-gray-700 ">
                                    {video.expires_on
                                      ? video.expires_on
                                      : "Nunca"}
                                  </p>
                                </td>
                                <td className="py-3 text-sm" role="cell">
                                  <div className="mx-2 flex font-bold">
                                    <div className="h-2 w-16 rounded-full ">
                                      <button
                                        onClick={() =>
                                          handleActive(video, "inativo")
                                        }
                                        className={classNames(
                                          loading
                                            ? "cursor-not-allowed text-gray-900"
                                            : "cursor-pointer text-indigo-600",
                                          "font-semibold  flex items-center"
                                        )}
                                      >
                                        {loading ? "Aguarde..." : "Desativar"}
                                      </button>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}
