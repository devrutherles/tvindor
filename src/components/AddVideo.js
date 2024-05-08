"use client";
import { PhotoIcon, UserCircleIcon, PlayIcon } from "@heroicons/react/24/solid";
import { Switch } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { geAllData } from "../lib/functions";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function AddVideo(props) {
  const [errors, setErrors] = useState(
    {
      video: "",
      
    }
  );
  const [user, setUser] = useState([]);
  const { formInputs } = props;
  const { handleChanges } = props;
  const handleAssign = (value) => {
    const addClient = props.setClientes;
    const removeCliente = props.removeCliente;
    if (formInputs?.clientes.includes(value)) {
      removeCliente(value);
      return;
    }
    addClient(value);
  };

  const allUsers = async () => {
    await geAllData({
      url: "/user",
      setErrors,
      calback: (response) => {
        setUser(response.data);
      },
    });
  };

  useEffect(() => {
    allUsers();
  }, []);
  return (
    <div className={classNames(props.show ? "" : "hidden", "w-[50%] mx-auto")}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {props.title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {props.description}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-8">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                {props.label}
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={formInputs?.title}
                    onChange={(e) => handleChanges(e)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Título do vídeo"
                  />
                </div>
              </div>
            </div>
            <div className="sm:col-span-8">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Data de expiração
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 ">
                  <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm"></span>
                  <input
                    type="datetime-local"
                    name="expires_on"
                    id="expires_on"
                    onChange={(e) => handleChanges(e)}
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="
                    Deixe em branco para nunca expirar
                    "
                  />
                </div>
              </div>
            </div>
            <div
              className={classNames(
                props?.user?.role == 0 ? "hidden" : "block",
                "sm:col-span-8"
              )}
            >
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Escolha para quem o vídeo será visível (opcional)
              </label>

              <Listbox onChange={(value) => handleAssign(value)}>
                {({ open }) => (
                  <>
                    <div className="relative mt-2">
                      <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
                        <span className="flex items-center">
                          <span className="ml-3 block truncate">
                            Selecione os clientes
                          </span>
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {user.map((person) =>
                            person?.receber_videos_administrador == 1 ? (
                              <Listbox.Option
                                key={person?.id}
                                className={({ active }) =>
                                  classNames(
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900",
                                    "relative cursor-default select-none py-2 pl-3 pr-9"
                                  )
                                }
                                value={person?.id}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <div className="flex items-center">
                                      <PlayIcon className="h-8 w-8 p-1 bg-indigo-600 text-white color-white  flex-shrink-0 rounded-full" />
                                      <span
                                        className={classNames(
                                          selected
                                            ? "font-semibold"
                                            : "font-normal",
                                          "ml-3 block truncate"
                                        )}
                                      >
                                        {person?.name}
                                      </span>
                                    </div>

                                    {formInputs?.clientes?.includes(
                                      person?.id
                                    ) ? (
                                      <span
                                        className={classNames(
                                          active
                                            ? "text-white"
                                            : "text-indigo-600",
                                          "absolute inset-y-0 right-0 flex items-center pr-4"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ) : null
                          )}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
              <div
                className={classNames(
                  formInputs?.clientes?.length > 0 ? "block" : "hidden",
                  "px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
                )}
              >
                <dd className="text-sm text-gray-900 sm:col-span-3 sm:mt-0">
                  <ul
                    role="list"
                    className="divide-y divide-gray-100 rounded-md border border-gray-200"
                  >
                    {formInputs?.clientes?.map((person) => (
                      <li
                        key={person}
                        className="flex items-center justify-between py-2 pl-4 pr-5 text-sm leading-6"
                      >
                        <div className="flex w-0 flex-1 items-center">
                          <div className="ml-4 flex min-w-0 flex-1 gap-2">
                            <span className="truncate font-medium">
                              {user.find((u) => u.id === person)?.name}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            onClick={() => handleAssign(person)}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remover
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </div>
            <div className="col-span-8">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Vídeo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {props.videoPreview ? (
                    <video
                      className="rounded-xl mx-auto object-contain"
                      src={props.videoPreview}
                      autoPlay={true}
                    />
                  ) : (
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                  )}
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="video"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>
                        {props.video
                          ? "Escolher outro"
                          : "Escolha um video do seu computador"}
                      </span>
                      {errors?.video && (
                        <p className="text-[10px] leading-5 text-[red] mt-2">
                          {errors?.video}
                        </p>
                      )}

                      <input
                        onChange={(e) => {
                          const file = e.target.files[0];
                          const fileSize = file.size / 1024 / 1024;
                          const fileType = file.type;
                          if (fileSize > 1000) {
                            setErrors({
                              video: "O arquivo deve ser menor que 10MB",
                            });




                            
                            return;
                          } else if (fileType !== "video/mp4") {
                            setErrors({
                              video: "O arquivo deve ser um mp4",
                            });
                            return;
                          }
                          props.handlePreview(e);
                        }}
                        onFocus={() => setErrors({})}
                        onBlur={() => console.log(props.videoPreview)}
                        id="video"
                        ref={props.fileUploadRef}
                        name="video"
                        multiple
                        accept="video/*"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-[10px] leading-5 text-[red] mt-2">
                    Arquivos mp4 de até 10MB*
                  </p>
                </div>
              </div>
            </div>
            <div className="col-span-8">
              <Switch.Group as="div" className="flex gap-x-4 sm:col-span-2">
                <div className="flex h-6 items-center">
                  <Switch
                    name="status"
                    id="status"
                    checked={formInputs?.status}
                    onChange={props.setStatus}
                    className={classNames(
                      formInputs.status ? "bg-indigo-600" : "bg-gray-200",
                      "flex w-8 flex-none cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    )}
                  >
                    <span className="sr-only"> Playlist</span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        formInputs.status ? "translate-x-3.5" : "translate-x-0",
                        "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out"
                      )}
                    />
                  </Switch>
                </div>
                <Switch.Label className="text-sm leading-6 text-gray-600">
                  Se macado, o vídeo será enviado para a{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    playlist&nbsp;ativa
                  </a>
                  .
                </Switch.Label>
              </Switch.Group>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6 col-span-8 ">
        <button
          onClick={() => props.setAddvideo(false)}
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancelar
        </button>
        <button
          disabled={props.loading || !props.video}
          onClick={() => props.submitForm()}
          className={classNames(
            props.loading || !props.video
              ? "cursor-not-allowed bg-slate-400"
              : "cursor-pointer bg-indigo-600 hover:bg-indigo-500",
            "rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          )}
        >
          Salvar
        </button>
      </div>
    </div>
  );
}
