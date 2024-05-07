import axios from "@/lib/axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const geAllData = async ({ ...props }) => {
  props.setErrors([]);
  axios
    .get(API_URL + props.url)
    .then((response) => {
      props.calback(response?.data);

      return response?.data;
    })
    .catch((error) => {
      if (error?.response?.status !== 422) throw error;

      setErrors(error?.response?.data?.errors);
    });
};

export const deleteData = async ({ ...props }) => {
  props.setErrors([]);
  axios
    .delete(API_URL + props.url)
    .then((response) => {
      props.calback(response?.data);

      return response?.data;
    })
    .catch((error) => {
      if (error?.response?.status !== 422) throw error;

      props.setErrors(error?.response?.data?.errors);
    });
};

export const updateData = async ({ ...props }) => {
  const { setErrors, calback, setLoading, url, data } = props;
  setLoading(true);
  axios
    .put(API_URL + url, data)
    .then((response) => {
      calback(response.data);
      setLoading(false);
      return response.data;
    })
    .catch((error) => {
      setLoading(false);

      if (error?.response?.status !== 422) throw error;

      setErrors(error?.response?.data?.errors);
    });
};

export const postData = async ({ ...props }) => {
  const { calback, url, data } = props;
  axios
    .post(API_URL + url, data)
    .then((response) => {
      calback(response?.data);
      return response?.data;
    })
    .catch((error) => {
      if (error?.response?.status !== 422) throw error;
    });
};
