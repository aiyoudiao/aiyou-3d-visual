import axios from "axios";
import { Loading } from "element-ui";

let loadingInstance;
let service = axios.create();

service.interceptors.request.use((config) => {
    loadingInstance = Loading.service({ fullscreen: true });
    return config;
});

service.interceptors.response.use((resp) => {
    loadingInstance.close();
    return resp;
}, (error) => {
    loadingInstance.close();
    return error;
});

export function Commits(page) {
    return service({
        url: "https://api.github.com/repos/aiyoudiao/aiyou-3d-visual/commits?page=" +
            page,
        method: "get",
    });
}

export function Members() {
    return service({
        url: "https://api.github.com/orgs/aiyoudiao/members",
        method: "get",
    });
}