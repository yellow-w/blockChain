import { P2PServer } from '@core/serve/p2p';
import express from 'express';
const app = express();
const ws = new P2PServer();

//블록체인서버의 라우터
//채굴
//거래 받기
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
});

app.listen('3005', () => {
    console.log('server running on port 3005');
});
