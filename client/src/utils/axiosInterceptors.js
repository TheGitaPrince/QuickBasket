import axios from "axios"

const authAxios = axios.create({
    baseURL: import.meta.env.VITE_BASE_USERS_URL,
    withCredentials: true,
});

authAxios.interceptors.request.use(
    (config)=>{
      const accessToken = localStorage.getItem("accessToken")

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config
    },
    (error)=>{
        return Promise.reject(error);
    }
);

authAxios.interceptors.response.use(
    (response) => response, 
    async (error) => {
      const originalRequest = error.config;
  
      if (error.response?.status === 401) {
        const refreshToken = localStorage.getItem("refreshToken");
  
        if (refreshToken && !originalRequest._retry) {
          originalRequest._retry = true; 

          try {
            const { accessToken, refreshToken: newRefreshToken } = await refreshAccessToken(); 
            originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
            return authAxios(originalRequest); 
          } catch (refreshError) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            window.location.href = "/login"; 
            return Promise.reject(refreshError);
          }
        } else {
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
);
  
const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (!refreshToken) {
        throw new Error("Refresh token not found in localStorage.");
      }
  
      const response = await axios.post(`${import.meta.env.VITE_BASE_USERS_URL}/users/refresh-token`,
        null,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`
          },
          withCredentials: true
        });

      const { accessToken, refreshToken: newRefreshToken } = response?.data?.data;
  
      localStorage.setItem("accessToken", accessToken); 
      localStorage.setItem("refreshToken", newRefreshToken);
  
      return { accessToken, refreshToken: newRefreshToken };
  
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      throw new Error("Token refresh failed. Please log in again.");
    }
};

export default authAxios