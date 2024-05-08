"use client";
import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export const useAuth = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter();
  const params = useParams(); 

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/auth", () =>
    axios
      .get("/api/auth")
      .then((res) => res.data)
      .catch((error) => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      })
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  const register = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const addvideo = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/api/upload", {
        body: props,
      })
      .then(() => mutate())
      .catch((error) => {
        setErrors(error);
        throw error;
      });
  };

  const addUser = async ({ setErrors, ...props }) => {
    await csrf();

    setErrors([]);

    axios
      .post("/users", props)
      .then(() => mutate())
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const getUsers = async ({ setErrors, setUsers }) => {
    await csrf();

    setErrors([]);

    axios
      .get("/users", props)
      .then((res) => setUsers(res))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const login = async ({ setErrors, setStatus, ...props }) => {
    props.setLoading(true);
    await csrf();

    setErrors([]);
    setStatus(null); 

    axios
      .post("/login", props)
      .then(() => {
        mutate();
      })
      .catch((error) => { 
        props.setLoading(false);
        console.error(error);
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      })
      .finally(() => {
        props.setLoading(false);
      });
  };

  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then((response) => setStatus(response.data.status))
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);

    axios
      .post("/reset-password", { token: params.token, ...props })
      .then((response) =>
        router.push("/login?reset=" + btoa(response.data.status))
      )
      .catch((error) => {
        if (error.response.status !== 422) throw error;

        setErrors(error.response.data.errors);
      });
  };

  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then((response) => setStatus(response.data.status));
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "auth" && user ) redirectIfAuthenticated
    if (middleware === "guest" && redirectIfAuthenticated && user) 
      router.push(redirectIfAuthenticated);
    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    addUser,
    getUsers,
    addvideo,
  };
};
