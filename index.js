const express = require('express');
const app = express();
const { fork } = require('child_process');
const { Worker } = require('worker_threads');

app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/childProcess', (req, res) => {
  const promise = new Promise((resolve, reject) => {
    const child = fork(__dirname + '/childProcess');
    // register event listener
    child.on('message', (data) => {
      console.log('Returning /total results');
      resolve(data); // data response from child process
      // return;
    });
    child.on('close', () => {
      reject('something went wrong');
      console.log('close');
      // todo: on close
    });

    child.send('count');
  });
  return promise
    .then((data) => {
      console.log(JSON.parse(data).totalCount);
      return res.json({ message: 'Thành công' });
    })
    .catch((error) => {
      console.log('error', error);
      return res.json({ message: 'Thất bại' });
    });
});

app.get('/worker', async (req, res) => {
  const worker = await runWorker({ message: 'workerData' });
  console.log(worker);
  res.json({ message: 'worker' });
  // res.json(worker);
});

function runWorker(workerData) {
  return new Promise((resolve, reject) => {
    //first argument is filename of the worker
    const worker = new Worker('./worker.js', {
      workerData
    });
    worker.on('message', resolve); //This promise is gonna resolve when messages comes back from the worker thread
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

app.listen(3000, () => {
  console.log('server running at 3000');
});
