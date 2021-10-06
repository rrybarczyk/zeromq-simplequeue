# zeromq-simplequeue
Tutorial from [ZeroMQ (ØMQ) Crash Course](https://www.youtube.com/watch?v=UrwtQfSbrOs&ab_channel=HusseinNasser) by Hussein Nasser.

## Install
```
$ npm i
```

## Run
In a new terminal, start the server by:
```
$ npm run start
>
> > zeromq-simplequeue@1.0.0 start
> > node server.js
>
> Server is ready listening on port 7000
> Press any key to start sending the jobs
```

In a new terminal start the worker by:
```
$ npm run worker
>
> > zeromq-simplequeue@1.0.0 worker
> > node worker.js

> Connected to the server.
```

Multiple workers can (and should) be started, each in their own terminal.

In the terminal that is running the server, press any key to start sending jobs to listening workers.

When running three workers with 11 jobs, the output looks like this:

Worker 1:
```
> received job sending job 0
> received job sending job 3
> received job sending job 6
> received job sending job 9
```

Worker 2:
```
> received job sending job 1
> received job sending job 4
> received job sending job 7
> received job sending job 10
```

Worker 3:
```
> received job sending job 2
> received job sending job 5
> received job sending job 8
> received job sending job 11
```

## Files
`server.js`: produces the queue
`worker.js`: receives the jobs

# ZeroMQ Tutorial Notes
## What is ZeroMQ?
- ZeroMQ is a messaging *library* (20 languages)
- Has five messaging patterns
- Brokerless (meh.). To build a real messaging app, you still need a broker. You use ZeroMQ to build a broker out anyways.
- You can build whatever you need, exactly what you need. Unlike RabbitMQ and Kafka that gives you all the bloat. With ZeroMQ, if you only want to build just the queue, you can do it. Nobody offers that except ZeroMQ.
- Not sure why it is called an MQ. It is not a messaging queue, it is not really queuing, it has push and pull and routers and so many other features.

## Messaging Patterns
- Synchronous Request/Response. You can build a request and can send a request and block the application waiting for a response. This model is dead in 2020. We no longer block anything. We are by default, pretty much every single language, is an asynchronous language. This is still here because ZeroMQ is an old library.
- Asynchronous Request/Response.
- Publish/Subscribe (Pub/Sub)
- Push/Pull. We will show an example turning this into a queue.
- Exclusive Pair. If you want two threads communicating with each other, you can use exclusive pair that allows you to exchange information when multithreading.

## Socket Types
- REP. This is the reply socket. This is the server. REQ -> REP
- REQ. Type of a socket that only sends requests. You create a socket and you connect. This is the client.
- PULL. Server.
- PUSH. Client.
- ROUTER. Server. Asynchronous. Interesting concept. You can spin up a router socket and listen to a port, say 7000. And then you start connecting clients (REQ). REQ clients connect to the ROUTER server and each request the ROUTER assigns an identity to these connections. You don't have fine grain control to the underlying connections. It maintains an array of connections and assigns and id to each one.
- DEALER. Client. Asynchronous.

## Building a Simple Queue with ZeroMQ with NodeJS
Server spins up and waits. PULL socket.
Worker spins up. PUSH socket.
The moment the Worker is spun up, it immediately connects to the Server.
Spin up multiple Workers.

```
    PUSH
+--------+      +----------+
|        | ---> | Worker 1 |	PULL
|        |      +----------+
|        |
|        |      +----------+
| Server | ---> | Worker 2 |	PULL
|        |      +----------+
|        |
|        |      +----------+
|        | ---> | Worker 3 |	PULL
|        |      +----------+
+--------+
```

The server will immediately send. This is exactly like the ROUTER, but slightly different.
When we connect, there is no array of connections in the server code.
But when you do SEND, looping to send 100 jobs to the three workers, the messages will send like this:

```
Msg1 -> Worker 1
Msg2 -> Worker 2
Msg3 -> Worker 3
Msg4 -> Worker 1
...
Msg99  -> Worker 1
Msg100 -> Worker 2
```
This is FIFO.
The queue is: every time a client starts consuming from the queue, that job is gone. It should not go to all clients.
PUB/SUB is the exact opposite. If the server PUSHes a job, all workers receive that job.

