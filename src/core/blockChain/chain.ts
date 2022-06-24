import { Block } from './block';
import { DIFFICULTY_ADJUSTMENT_UNIT } from './config';

export class Chain {
    blockChain: Block[];
    unspentTxOut: IUnspentTxOut[];
    constructor() {
        this.blockChain = [Block.getGenesis()];
        this.unspentTxOut = [];
    }
    //체인 가져오기. 길이 구하기. 최근 블럭 가져오기
    getChain() {
        return this.blockChain;
    }
    getLength() {
        return this.blockChain.length;
    }
    getLatestBlock() {
        return this.blockChain[this.blockChain.length - 1];
    }
    addBlock(_previousBlock: Block, _data: ITransaction[], _newBlock: Block) {
        //블럭 생성, 유효성 검증, 배열에 추가

        const previousBlock = this.getLatestBlock();
        const adjustmentBlock = this.getAdjustmentBlock();
        const newBlock = Block.generateBlock(previousBlock, _data, adjustmentBlock);
        const isValid = Block.isValidNewBlock(previousBlock, newBlock);
        if (isValid.isError) return;
        this.blockChain.push(isValid.value);
    }
    static addToChain() {
        //통신 시, 최근 배열확인 후 가져온 체인의 마지막 블럭의 높이값과 내 체인의 높이값 비교 해서
        //상대방의 이전 높이값이 내 체인의 높이값과 같은 경우
        //유효성 검증 후
        //상대방 체인의 마지막 블럭을 추가
    }
    getAdjustmentBlock(): IBlock {
        //블럭의 길이가 10보다 작은 경우, 제네시스 블럭, 아닌 경우 자신
        const currentLength = this.getLength();
        const adjustmentBlock =
            currentLength < DIFFICULTY_ADJUSTMENT_UNIT
                ? Block.getGenesis()
                : this.blockChain[currentLength - DIFFICULTY_ADJUSTMENT_UNIT];
        return adjustmentBlock;
    }
}
