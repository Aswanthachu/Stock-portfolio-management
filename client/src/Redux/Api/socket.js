import io  from "socket.io-client";

const token = localStorage.getItem('token')
? JSON.parse(localStorage.getItem('token'))
:'';

const socket = io(import.meta.env.VITE_SOCKET_URL,{auth:{token}})
export default socket;