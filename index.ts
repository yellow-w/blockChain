import { P2PServer } from '@core/serve/p2p';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const ws = new P2PServer();

app.use(express.json());

app.use((req, res, next) => {
    const baseAuth: string = (req.headers.authorization || '').split(' ')[1];
    if (baseAuth === '') return res.status(401).send();
    const [userid, password] = Buffer.from(baseAuth, 'base64').toString().split(':');
    if (userid !== process.env.USERID || password !== process.env.USERPW) return res.status(401).send();
    next();
});

app.post('/addToPeer', (req, res) => {
    const { peer } = req.body;
    ws.connectToPeer(peer);
});

app.post('/addPeers', (req, res) => {});

app.post('/mineBlock', (req, res) => {
    res.send();
});

app.post('/sendTransaction', (req, res) => {
    console.log(req.body);
    res.json({});
});

app.listen('3005', () => {
    console.log('server running on port 3005');
});
