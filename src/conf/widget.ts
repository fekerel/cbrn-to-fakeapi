/* eslint-disable no-param-reassign, array-callback-return, import/no-cycle, max-len, no-restricted-syntax, consistent-return */
import widgetService from '@/api/WidgetService';
import TestConstants from '@/common/lib/TestConstants';
import { Socket } from 'socket.io-client';

const bodyParser = require('body-parser');
const express = require('express');

const app = express();
app.use(express.json());

const http = require('http').Server(app);

const bpJson = bodyParser.json({ limit: '10mb' });
const bpUrlencoded = bodyParser.urlencoded({ limit: '10mb', extended: true });

const PORT = TestConstants.widgetPort;

// set up socket.io and bind it to our
// http server.
const io = require('socket.io')(http);

// whenever a user connects on the port via
// a websocket, log that a user has connected
io.on('connection', (socket: Socket) => {
    console.info('an user connected to socket server');

    socket.on('input-change', (msg) => {
        io.sockets.emit('update-input', msg);
    });
    socket.on('subscribe', (msg:String) => {
        io.sockets.emit('subscribe-event', msg);
    });
    socket.on('unsubscribe', (msg:String) => {
        io.sockets.emit('unsubscribe-event', msg);
    });
    socket.on('submit', (msg) => {
        io.sockets.emit('submit-event', msg);
    });
    socket.on('listener', (msg) => {
        io.sockets.emit('listener-event', msg);
    });
});

app.get('/ping', async (req, res) => {
    res.send('Socket Server is working');
});

app.get('/connect', async (req, res) => {
    await widgetService.connect();
    res.send('Connected');
});

app.post('/subscribe', bpJson, bpUrlencoded, async (req, res) => {
    await widgetService.subscribe(req.body.channel);
    res.send('subscription request sent successfully');
});

app.get('/checkIfTrackDrawn', bpJson, bpUrlencoded, async (req, res) => {
    const response = await widgetService.checkIfTrackDrawn(req.query.name);
    res.send(response);
});

const server = http.listen(PORT, () => {
    console.info(`listening on *:${PORT}`);
});

app.get('/shutdownServer', async (req, res) => {
    res.send('Shutting down server');
    server.close();
});
