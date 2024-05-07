"use client";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import {
  CursorArrowRaysIcon,
  EnvelopeOpenIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Bars3Icon,
  CalendarIcon,
  DocumentDuplicateIcon,
  HomeIcon,
  XMarkIcon,
  WrenchIcon,
  VideoCameraIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/hooks/auth";
import { useRouter } from "next/navigation";
import Loading from "@/app/(app)/Loading";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Home() {
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [stations, setStations] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth({ middleware: "auth" });
  const [senhas, setSenhas] = useState([]);
  const [videos, setVideos] = useState([]);
  const router = useRouter();

  const getStations = async () => {
    await axios
      .get(`${BASE_URL}/api/station`)
      .then((res) => {
        setStations(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getUsuarios = async () => {
    await axios
      .get(`${BASE_URL}/api/user`)
      .then((res) => {
        setUsers(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getSenhas = async () => {
    await axios
      .get(`${BASE_URL}/api/senhas`)
      .then((res) => {
        setSenhas(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const getVideos = async () => {
    await axios
      .get(`${BASE_URL}/api/videos`)
      .then((res) => {
        setVideos(res?.data?.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  const stats = [
    {
      id: 1,
      name: "Total de Videos",
      stat: videos?.length,
      icon: VideoCameraIcon,
      change: "2",
      changeType: "increase",
    },

    {
      id: 2,
      name: "Total de Chamadas",
      stat: senhas?.length,
      icon: CursorArrowRaysIcon,
      change: "4",
      changeType: "decrease",
    },
    {
      id: 3,
      name: "Clientes Ativos",
      stat: stations?.length,
      icon: UsersIcon,
      change: "3",
      changeType: "increase",
    },
  ];

  useEffect(() => {
    if (user?.role != 1) {
      router.push("/videos");
      return;
    }
    getStations();
    getUsuarios();
    getSenhas();
    getVideos();
  }, []);
  if (!stations || !users || !senhas || !videos) {
    return <Loading />;
  }
  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        Estatísticas Gerais
      </h3>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-indigo-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.stat}
              </p>
              <p
                className={classNames(
                  item.changeType === "increase"
                    ? "text-green-600"
                    : "text-red-600",
                  "ml-2 flex items-baseline text-sm font-semibold"
                )}
              >
                {item.changeType === "increase" ? (
                  <ArrowUpIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowDownIcon
                    className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                    aria-hidden="true"
                  />
                )}

                <span className="sr-only">
                  {" "}
                  {item.changeType === "increase"
                    ? "Increased"
                    : "Decreased"}{" "}
                  by{" "}
                </span>
                {item.change}
              </p>
              <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-4 sm:px-6">
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Ver Todos<span className="sr-only"> {item.name} stats</span>
                  </a>
                </div>
              </div>
            </dd>
          </div>
        ))}
      </dl>
      <div className="px-4 mt-8 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Usuários recentes
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Informações sobre os últimos usuários que acessaram o sistema.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Usuário
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Último Acesso
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Último Vídeo
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {stations?.map((person, personIdx) => (
                    <tr
                      key={person.id}
                      className={personIdx % 2 === 0 ? undefined : "bg-gray-50"}
                    >
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                        {users.filter((user) => user.id === person.id)[0]?.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <time dateTime={person.updated_at}>
                          {new Date(person.updated_at).toLocaleDateString()} ás{" "}
                          {new Date(person.updated_at).toLocaleTimeString()}
                        </time>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <a
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 px-2 py-1 rounded-md"
                          href={BASE_URL + person?.video}
                          target="_blank"
                        >
                          Assistir
                        </a>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {person?.status == 1 ? (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Online
                          </span>
                        ) : (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Offline
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
