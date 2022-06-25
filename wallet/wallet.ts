import { randomBytes } from 'crypto';
import { SHA256 } from 'crypto-js';
import elliptic from 'elliptic';

import fs from 'fs';
import path from 'path';

const dir = path.join(__dirname, '../data');
const ec = new elliptic.ec('secp256k1');

export class Wallet {
    privateKey: string;
    publicKey: string;
    account: string;
    balance: number;
    constructor(_privateKey: string = '') {
        this.privateKey = _privateKey || this.getPrivateKey();
        this.publicKey = this.getPublicKey();
        this.account = this.getAccount();
        this.balance = 0;
    }

    createWallet(myWallet: Wallet): void {
        const fileName = path.join(dir, myWallet.account);
        const fileContent = myWallet.privateKey;
        fs.writeFileSync(fileName, fileContent);
    }
    static getWalletList(): string[] {
        return fs.readdirSync(dir);
    }

    static getWalletPrivateKey(_account: string) {
        const filePath = path.join(dir, _account);
        const fileContent = fs.readFileSync(filePath);
        return fileContent.toString();
    }

    static createSign = (_obj: any): elliptic.ec.Signature => {
        const {
            sender: { publicKey, account },
            received,
            amount,
        } = _obj;

        const hash: string = SHA256([publicKey, received, amount].join('')).toString();
        const privateKey = this.getWalletPrivateKey(account);
        const keyPair = ec.keyFromPrivate(privateKey);
        const sign = keyPair.sign(hash, 'hex');
        return sign;
    };

    getPrivateKey(): string {
        return randomBytes(32).toString('hex');
    }
    getPublicKey(): string {
        const keyPair = ec.keyFromPrivate(this.privateKey);
        return keyPair.getPublic().encode('hex', true);
    }
    getAccount(): string {
        return Buffer.from(this.publicKey).slice(26).toString();
    }
}
