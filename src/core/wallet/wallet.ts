import elliptic from 'elliptic';
import { IUnspentTxOut } from 'transaction';
const ec = new elliptic.ec('secp256k1');
export type signature = elliptic.ec.Signature;

interface IReceivedTx {
    sender: string;
    signature: elliptic.ec.Signature;
    received: string;
    amount: number;
}

export class Wallet {
    sender: string;
    account: string;
    balance: number;
    signature: signature;
    constructor(_publicKey: string, _signature: signature, balance: number) {
        this.sender = _publicKey;
        this.account = this.getAccount(this.sender);
        this.balance = this.getBalance();
        this.signature = _signature;
    }
    static sendTransaction(_receivedTx: IReceivedTx, _unspnetTxOuts: IUnspentTxOut[]) {
        //1. 서명 검증
        // Wallet.getVerify(_receivedTx);
        //2. 발신인 지갑정보 최신화
        //3. 최신화된 정보로 잔액 비교
        //4 tx 객체 생성
    }

    // static getVerify(_receivedTx: IReceivedTx) {
    //     const { sender, received, amount } = _receivedTx;
    // }

    getAccount(_publicKey: string = this.sender) {
        const account = _publicKey.slice(26).toString();
        return account;
    }
    getBalance() {
        return 1;
    }
}
