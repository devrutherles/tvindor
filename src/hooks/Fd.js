import { createContext, useContext, useState } from "react";

export const ProgressContext = createContext();

const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [button, setButton] = useState("");
  const [cancel, setCancel] = useState("");
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const handleFeedback = (data) => {
    setTitle(data.title);
    setMessage(data.message);
    setButton(data.button);
    setCancel(data.cancel);
    setStatus(data.status);
    setOpen(data.open);
  };
  const handleProgress = (data) => {
    setProgress(data);
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        title,
        message,
        button,
        cancel,
        status,
        open,
        setOpen,
        handleFeedback,
        handleProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
export default ProgressProvider;
