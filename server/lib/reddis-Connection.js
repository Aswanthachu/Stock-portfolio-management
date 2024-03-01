import { createClient } from "redis";

// creating connection with redis.

// const client = createClient({
//   password: "viycDxoPeArukB9U1yBUYdHa0utCcEKD",
//   socket: {
//     host: "redis-14058.c305.ap-south-1-1.ec2.cloud.redislabs.com",
//     port: 14058,
//   },
// });
const client = createClient({
  password: 'GKTLbnZTT2LDK6IdWR6QxNg2scx4xiDW',
  socket: {
      host: 'redis-19682.c212.ap-south-1-1.ec2.cloud.redislabs.com',
      port: 19682
  }
});
client.on("connect", () => {
  console.log("redis connection established");
});
// client.on("connect", () => {
//   console.log("redis connection established");
// });
try {
   client.connect();
} catch (error) {
  console.log(error);
}

client.on("error", (err) => {
  // console.log('Redis Client Error', err)
});

export default client;
