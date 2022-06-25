declare interface _receivedTx {
    sender: string;
    signature: elliptic.ec.Signature;
    received: string;
    amount: number;
}
