import { SHA256 } from 'crypto-js';

export class Transaction {
    txIns: ITxIn[];
    txOuts: ITxOut[];
    hash: string;
    constructor(_txins: ITxIn[], _txouts: ITxOut[]) {
        this.txIns = _txins;
        this.txOuts = _txouts;
        this.hash = this.createTxHash(_txins, _txouts);
    }
    createTxHash(_txins: ITxIn[], _txouts: ITxOut[]) {
        const txInsContent = _txins.map((value) => Object.values(value).join('')).join('');
        console.log(txInsContent);
        const txOutsContent = _txouts.map((value) => Object.values(value).join('')).join('');
        const hash = SHA256(txInsContent + txOutsContent).toString();
        return hash;
    }
}
