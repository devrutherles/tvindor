"use client";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
const Menu = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [image, setImage] = useState(null);
  const getImage = async (data) => {
    await axios
      .get(
        `${BASE_URL}/api/cardapio`,

        {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
          withCredentials: true,
          withXSRFToken: true,
          id: data,
        }
      )
      .then((res) => {
        const file = res?.data?.data?.filter((item) => item.id == id)[0];
        setImage(file?.cardapio);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  useEffect(() => {
    if (id) {
      getImage(id);
    }
  }, [id]);
  return (
    <div className="mx-auto max-w-[450px] h-[100vh]">
      <button
        className="bg-blue-500 hover:bg-blue-700 mt-4 ml-4 text-white font-bold py-2 px-4 rounded"
        onClick={() => router.back()}
      >
        Voltar
      </button>

      <iframe
        src={BASE_URL + image}
        alt="Logo"
        className="h-96 w-full object-cover mt-8 p-2"
      />
    </div>
  );
};

export default Menu;
