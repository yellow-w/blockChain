import { SHA256 } from 'crypto-js';
import merkle from 'merkle';
import { BlockHeader } from './blockHeader';

export class Block extends BlockHeader implements IBlock {
    merkleRoot: string;
    hash: string;
    nonce: number;
    difficulty: number;
    data: ITransaction[];

    constructor(_previousBlock: IBlock, _data: ITransaction[]) {
        super(_previousBlock);
        this.merkleRoot = Block.getMerkleRoot(_data);
        this.nonce = 0;
        this.difficulty = this.getDifficulty();
        this.data = _data;
        this.hash = Block.createBlockHash(this);
    }
    static getMerkleRoot(_data: ITransaction[]): string {
        const merkleTree = merkle('sha256').sync(_data);
        const merkleRoot = merkleTree.root();
        return merkleRoot;
    }
    static createBlockHash({ version, height, timestamp, previousHash, merkleRoot, nonce, difficulty }: Block): string {
        const value = `${version}${height}${timestamp}${previousHash}${merkleRoot}${nonce}${difficulty}`;
        return SHA256(value).toString();
    }
    generateBlock(_previousBlock: Block, _data: ITransaction[]): Block {
        const newBlock = new Block(_previousBlock, _data);
        return newBlock;
    }
    findBlock() {}
    getDifficulty() {
        return 1;
    }

    isValidNewBlock(_previousBlock: IBlock, _newBlock: Block): Failable<Block, string> {
        if (_newBlock.height !== _previousBlock.height + 1) {
            return {
                isError: true,
                error: '블록의 높이가 맞지 않습니다.',
            };
        }

        if (_newBlock.previousHash !== _previousBlock.hash) {
            return {
                isError: true,
                error: '블록의 이전 해시와 값이 일치하지 않습니다.',
            };
        }
        if (_newBlock.hash !== Block.createBlockHash(_newBlock)) {
            console.log('블럭의 해시 :', _newBlock.hash);
            console.log('새로 생성한 해시 :', Block.createBlockHash(_newBlock));
            return {
                isError: true,
                error: '블록의 해시 값이 일치하지 않습니다.',
            };
        }
        return {
            isError: false,
            value: _newBlock,
        };
    }
}
