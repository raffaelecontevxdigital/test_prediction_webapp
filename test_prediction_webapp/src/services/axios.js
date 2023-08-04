import axios from "axios";

const locale = 'http://192.168.1.140:3001/'
//const locale = 'https://prediction-web.it/api/'

export const baseURL = locale;

export const APIRequest = (method, path, data) => {

    return new Promise((resolve, reject) => {
        if (typeof method === "string" && typeof path === "string") {
            axios({
                timeout: 60 * 60 * 1000,
                method: method,
                url: baseURL + path,
                data: data,
                headers: { auth: localStorage.token, accept: "application/json" },

            })
                .then((res) => {
                    resolve(res);
                })
                .catch((e) => {
                    console.log(e)
                    if (e.response !== undefined) {
                        if (e.response.data === "invalid password" || e.response.data === "username not found") {
                            alert(e.response.data);
                        } else if (e.response.status === 401) {
                            localStorage.setItem("token", "");
                            setTimeout(() => {
                                window.location.pathname = '/';
                            }, 4000);
                        }
                    }
                    reject(e);
                });
        }
    });
};
