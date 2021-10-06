/* worker.js */
const zmq = require("zeromq");

const sock = new zmq.Pull();
run();

async function run() {
  await sock.connect("tcp://127.0.0.1:7000");
  console.log("Connected to the server.");

  // Every time we get a message from the server, we enter this loop.
  for await (const msg of sock) {
    console.log(`received job ${msg.toString()}`);
  }
}
