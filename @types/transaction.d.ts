import { signature } from '@core/wallet/wallet';

declare interface ITxIn {
    txOutId: string;
    txOutIndex: number;
    sigature?: signature;
}

declare interface ITxOut {
    account: string;
    amount: number;
}

declare interface ITransaction {
    txIns: ITxIn[];
    txOuts: ITxOut[];
    hash: string;
}

declare interface IUnspentTxOut {
    txOutId: string;
    txOutIndex: number;
    account: string;
    amount: number;
}
