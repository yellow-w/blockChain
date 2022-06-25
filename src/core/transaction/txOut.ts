export class TxOut {
    account: string;
    amount: number;
    constructor(_account: string, _amount: number) {
        this.account = _account;
        this.amount = _amount;
    }
}
