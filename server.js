/* server.js */
const zmq = require('zeromq');

const sock = new zmq.Push();
run();

async function run () {
  // Listen on port 7000 and wait for a key entry
  await sock.bind("tcp://127.0.0.1:7000");
  console.log("Server is ready listening on port 7000");
  // Waiting
  console.log("Press any key to start sending the jobs");

  // Accept keyboard input (`data`) to call the `send` function that starts the server and begins
  // sending jobs.
  process.stdin.once("data", send);
}

// Async function sends the jobs to the workers
async function send() {
  console.log("About to send the jobs!");

  for (let i = 0; i < 100; i++) {
    // Send the ith job
    sock.send(`sending job ${i}`);

    // Simulate a pause to slow things down by using a Promise, resolving itself immediately after 500 ms.
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}
