const { workerData, parentPort } = require('worker_threads');
//workerData will be the second argument of the Worker constructor in multiThreadServer.js
console.log('workerData', workerData);
let counter = 0;
while (counter < 5000000000) {
  counter++;
}

parentPort.postMessage({
  //send message with the result back to the parent process
  counter
});
