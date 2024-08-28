/* eslint-disable no-undef */
import server from "./app.js";
const { NODE_ENV, PORT } = process.env;
if(NODE_ENV=="development"){
  const host = 'localhost';
  server.listen({ host: host, port: PORT }, err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening on ${PORT}`);
  });
}else{
  server.listen();
}



