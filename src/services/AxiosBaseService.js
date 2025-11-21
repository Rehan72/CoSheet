import axios from "axios";
import LocalStorageService from "./LocalStorageService";

const axiosClient = axios.create();
//const baseURL = import.meta.env.VITE_REACT_BASED_API_URL;
const baseURL = import.meta.env.VITE_REACT_BASED_API_URL;


axiosClient.defaults.baseURL = baseURL;

axiosClient.defaults.headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Request Interceptor: Add Token to Headers
axiosClient.interceptors.request.use(

   (config) => {
     const token = LocalStorageService.get("accessToken"); // Get token from local storage
     if (token) {
       config.headers["Authorization"] = `Bearer ${token}`;
     }
     return config;
   },
   (error) => Promise.reject(error)
 );
 
 // Response Interceptor: Handle 401 Unauthorized & Refresh Token
 axiosClient.interceptors.response.use(
   (response) => response,
   async (error) => {
     const originalRequest = error.config;
 
     // Handle 401 (Unauthorized) → Try Token Refresh
     if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('refreshToken')) {
       console.warn("401 Unauthorized - Attempting token refresh...");
       originalRequest._retry = true;
 
       try {
         const refreshToken = LocalStorageService.get("refreshToken");
         if (!refreshToken) {
           console.error("No refresh token found - Logging out...");
           LocalStorageService.clear();
           window.location.href = "/";
           return Promise.reject(error);
         }
 
         console.log("Refreshing token...");
         const refreshResponse = await axios.post(`${baseURL}users/refresh-token`, {
           refreshToken,
         });
 
         console.log("New Token Received:", refreshResponse.data);
 
         const newAccessToken = refreshResponse.data.data.token;
         const newRefreshToken = refreshResponse.data.data.refreshToken;
 
         // Store the new tokens
         LocalStorageService.set("token", newAccessToken);
         LocalStorageService.set("refreshToken", newRefreshToken);
 
         // Retry the original request with the new token
         originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
         return axiosClient(originalRequest);
       } catch (refreshError) {
         console.error("Token refresh failed, logging out:", refreshError);
         LocalStorageService.clear();
         window.location.href = "/";
         return Promise.reject(refreshError);
       }
     } else if (error.response?.status === 403) {
       // Handle 403 (Forbidden) → Logout and Redirect
       console.warn("403 Forbidden - Logging out...");
       LocalStorageService.clear();
       window.location.href = "/";
       return Promise.reject(error);
     }
 
     return Promise.reject(error);
   }
 );
 




export function getRequest(url) {
  return axiosClient.get(`/${url}`).then((response) => response.data);
}

export function deleteRequest(url) {
  return axiosClient.delete(`/${url}`).then((response) => response);
}

export function putRequest(url, payload) {
  return axiosClient.put(`/${url}`, payload).then((response) => response);
}

export function postRequest(url, payload) {
  return axiosClient.post(`/${url}`, payload).then((response) => response.data);
}

// export function postRequestWithFile(url, payload) {

//   return axiosClient.post(`/${url}`, payload,{headers: { "Content-Type": "multipart/form-data" }}).then((response) => response.data);
// }

export function postRequestWithFile(url, payload, config = {}) {
   return axiosClient
     .post(`/${url}`, payload, {
       headers: { "Content-Type": "multipart/form-data" },
       ...config, // Merge additional config (e.g., onUploadProgress)
     })
     .then((response) => response.data);
 }