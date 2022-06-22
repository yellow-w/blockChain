declare interface ITxIn {
  txOutId: string;
  txOutIndex: number;
  sigature: string;
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
