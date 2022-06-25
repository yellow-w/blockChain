import { SHA256 } from 'crypto-js';
import { TxIn } from './txIn';
import { TxOut } from './txOut';

export class Transaction {
    txIns: TxIn[];
    txOuts: TxOut[];
    hash: string;
    constructor(_txins: TxIn[], _txouts: TxOut[]) {
        this.txIns = _txins;
        this.txOuts = _txouts;
        this.hash = this.createTxHash(_txins, _txouts);
    }
    createTxHash(_txins: TxIn[], _txouts: TxOut[]) {
        const txInsContent = _txins.map((value) => Object.values(value).join('')).join('');
        console.log(txInsContent);
        const txOutsContent = _txouts.map((value) => Object.values(value).join('')).join('');
        const hash = SHA256(txInsContent + txOutsContent).toString();
        return hash;
    }
}
