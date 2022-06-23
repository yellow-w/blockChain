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
    addToChain(_receivedBlock: Block): Failable<undefined, string> {
        const latestBlock = this.getLatestBlock();
        const isValid = Block.isValidNewBlock(latestBlock, _receivedBlock);
        if (isValid.isError) return { isError: true, error: isValid.error };
        this.blockChain.push(isValid.value);
        //통신 시, 최근 배열확인 후 가져온 체인의 마지막 블럭의 높이값과 내 체인의 높이값 비교 해서
        //상대방의 이전 높이값이 내 체인의 높이값과 같은 경우
        //유효성 검증 후
        //상대방 체인의 마지막 블럭을 추가
        return { isError: false, value: undefined };
    }

    isValidChain(_receivedChain: Block[]): Failable<undefined, string> {
        // const blockChain = this.getChain();
        for (let i = 1; i < _receivedChain.length; i++) {
            const previousBlock = _receivedChain[i - 1];
            const currentBlock = _receivedChain[i];
            const isValid = Block.isValidNewBlock(previousBlock, currentBlock);
            if (isValid.isError) return { isError: true, error: isValid.error };
        }
        return { isError: false, value: undefined };
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
    replaceChain(_receivedChain: Block[]): Failable<undefined, string> {
        const latestReceivedBlock = _receivedChain[length - 1];
        const latestBlock = this.getLatestBlock();
        if (_receivedChain.length === 1) return { isError: true, error: '받은 최신 블럭이 제네시스 블럭입니다.' };
        if (latestReceivedBlock.height <= latestBlock.height)
            return { isError: true, error: '자신의 블럭이 더 길거나 같습니다' };
        if (latestReceivedBlock.previousHash === latestBlock.hash)
            return { isError: true, error: '블럭이 하나 모자랍니다? ' };
        this.blockChain = _receivedChain;

        return {
            isError: false,
            value: undefined,
        };
    }
}
