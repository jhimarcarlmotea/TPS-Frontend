import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "reverb",
  key: "ILAGAY_MO_DITO_ANG_REVERB_APP_KEY", // Hanapin sa .env ng Laravel
  wsHost: "127.0.0.1",
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  encrypted: true,
  disableStats: true,
  enabledTransports: ["ws", "wss"],
  authEndpoint: "http://localhost:8000/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      Accept: "application/json",
    },
  },
});

export default echo;