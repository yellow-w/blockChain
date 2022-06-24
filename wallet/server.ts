import express from 'express';
import nunjucks from 'nunjucks';
import { Wallet } from './wallet';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const userid = process.env.USERID;
const userpw = process.env.USERPW;
const baseURL = process.env.BASEURL;
const baseAuth = Buffer.from(userid + ':' + userpw).toString('base64');

const app = express();
app.use(express.json());
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
});

const request = axios.create({
    baseURL,
    headers: {
        Authorization: 'Basic ' + baseAuth,
        'Content-type': 'application/json',
    },
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/newWallet', (req, res) => {
    const newWallet: Wallet = new Wallet();
    newWallet.createWallet(newWallet);
    res.json(newWallet);
});
app.post('/getWalletList', (req, res) => {
    const walletList: string[] = Wallet.getWalletList();
    res.json(walletList);
});

app.get('/wallet/:account', (req, res) => {
    const { account } = req.params;
    const privateKey: string = Wallet.getWalletPrivateKey(account);
    const wallet: Wallet = new Wallet(privateKey);
    res.json(wallet);
});

app.post('/sendTransaction', async (req, res) => {
    const data = req.body;
    const signature: any = Wallet.createSign(data);
    const txObject = {
        ...data,
        sender: {
            publicKey: data.sender.publicKey,
            signature,
        },
    };
    console.log(txObject);
    const response = await request.post('/sendTransaction', txObject);
    console.log(response.data);
});

app.listen(3001, () => {
    console.log('wallet server running on port 3001');
});
