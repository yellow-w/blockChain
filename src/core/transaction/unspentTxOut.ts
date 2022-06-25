export class UnspentTxOut {
    txOutId: string;
    txOutIndex: number;
    account: string;
    amount: number;
    constructor(_txOutId: string, _txOutIndex: number, _account: string, _amount: number) {
        this.txOutId = _txOutId;
        this.txOutIndex = _txOutIndex;
        this.account = _account;
        this.amount = _amount;
    }
}
