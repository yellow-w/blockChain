import express from 'express';
import nunjucks from 'nunjucks';
import { Wallet } from './wallet';

const app = express();
app.use(express.json());
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
});

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/newWallet', (req, res) => {
    const newWallet = new Wallet();
    newWallet.createWallet(newWallet);
    res.json(newWallet);
});
app.post('/getWalletList', (req, res) => {
    const walletList = Wallet.getWalletList();
    res.json(walletList);
});

app.get('/wallet/:account', (req, res) => {
    const { account } = req.params;
    const privateKey = Wallet.getWalletPrivateKey(account);
    const wallet = new Wallet(privateKey);
    res.json(wallet);
});

app.listen(3001, () => {
    console.log('wallet server running on port 3001');
});
