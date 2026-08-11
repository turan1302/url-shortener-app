import axios from "axios";

const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
};

class RestClient {
    static getRequest = (url = "", config = {}) => {
        return axios
            .get(url, {
                headers: {
                    ...defaultHeaders,
                    ...(config.headers || {}),
                },
                ...config,
            })
            .then((res) => res)
            .catch((err) => {
                if (err.response) return err.response;
                return {
                    status: 0,
                    data: {
                        message: err.message || "Sunucuya ulaşılamadı.",
                        code: err.code,
                    },
                };
            });
    };

    static postRequest = (url = "", data = {}, config = {}) => {
        const isFormData =
            typeof FormData !== "undefined" && data instanceof FormData;
        const headers = isFormData
            ? { Accept: "application/json", ...(config.headers || {}) }
            : { ...defaultHeaders, ...(config.headers || {}) };

        return axios
            .post(url, data, {
                ...config,
                headers,
            })
            .then((res) => res)
            .catch((err) => {
                if (err.response) return err.response;
                return {
                    status: 0,
                    data: {
                        message: err.message || "Sunucuya ulaşılamadı.",
                        code: err.code,
                    },
                };
            });
    };
}

export default RestClient;