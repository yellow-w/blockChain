import { signature } from '@core/wallet/wallet';

export class TxIn {
    txOutId: string;
    txOutIndex: number;
    signature?: signature; //sender의 서명
    constructor(_txOutId: string, _txOutIndex: number, _signature: signature | undefined = undefined) {
        this.txOutId = _txOutId; //거래번호의 해시
        this.txOutIndex = _txOutIndex; //아웃 객체 생성 후 배열의 인덱스
        this.signature = _signature;
    }
}
