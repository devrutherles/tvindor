import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { ProgressContext } from "../hooks/Fd";

export default function FeedBack() {
  const cancelButtonRef = useRef(null);
  const { open, setOpen, title, message, button, cancel, status, progress } =
    useContext(ProgressContext);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div
          className={classNames(
            !status ? "hidden" : "",

            "fixed inset-0 z-10 w-screen overflow-y-auto"
          )}
        >
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div
                      className={classNames(
                        status == "success"
                          ? "bg-green-100"
                          : status == "info"
                          ? "bg-blue-100"
                          : "bg-red-100",
                        "mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full  sm:mx-0 sm:h-10 sm:w-10"
                      )}
                    >
                      {status == "success" ? (
                        <CheckCircleIcon
                          className="h-6 w-6 text-green-600"
                          aria-hidden="true"
                        />
                      ) : status == "info" ? (
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-blue-600"
                          aria-hidden="true"
                        />
                      ) : (
                        <ExclamationTriangleIcon
                          className="h-6 w-6 text-red-600"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">{message}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {progress > 0 && (
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-2 bg-green-600"
                        style={{
                          width: `${progress}%`,

                          transition: "width 0.5s ease ",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={classNames(
                      status == "success"
                        ? "bg-green-600 hover:bg-green-200"
                        : status == "info"
                        ? "bg-blue-600 hover:bg-blue-200"
                        : "bg-red-600 hover:bg-red-200",
                      button ? "inline-flex" : "hidden",
                      "inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {button}
                  </button>
                  <button
                    type="button"
                    className={classNames(
                      cancel ? "inline-flex" : "hidden",
                      "mt-3  w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    )}
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    {cancel}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
