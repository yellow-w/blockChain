import { SHA256 } from 'crypto-js';
import merkle from 'merkle';
import { BlockHeader } from './blockHeader';
import hexToBinary from 'hex-to-binary';
import { UNIT, BLOCK_GENERATE_INTERVAL, DIFFICULTY_ADJUSTMENT_UNIT, GENESIS } from './config';
import { ITransaction } from 'transaction';

export class Block extends BlockHeader implements IBlock {
    merkleRoot: string;
    hash: string;
    nonce: number;
    difficulty: number;
    data: ITransaction[];

    constructor(_previousBlock: IBlock, _data: ITransaction[], _adjustmentBlock: Block) {
        super(_previousBlock);
        this.merkleRoot = Block.getMerkleRoot(_data);
        this.nonce = 0;
        this.difficulty = Block.getDifficulty(_adjustmentBlock, this, _previousBlock);
        this.hash = Block.createBlockHash(this);
        this.data = _data;
    }
    static getGenesis(): IBlock {
        return GENESIS;
    }

    static getMerkleRoot(_data: ITransaction[]): string {
        const merkleTree = merkle('sha256').sync(_data);
        const merkleRoot = merkleTree.root();
        return merkleRoot;
    }
    static createBlockHash({ version, height, timestamp, merkleRoot, previousHash, nonce, difficulty }: Block): string {
        const value = `${version}${height}${timestamp}${merkleRoot}${previousHash}${height}${difficulty}${nonce}`;
        return SHA256(value).toString();
    }

    static generateBlock(_previousBlock: Block, _data: ITransaction[], _adjustmentBlock: Block): Block {
        const generateBlock = new Block(_previousBlock, _data, _adjustmentBlock);
        const newBlock = Block.findBlock(generateBlock);
        return newBlock;
    }

    static findBlock(_generateBlock: Block): Block {
        //nonce 값을 1씩 추가 시켜가면서 조건에 맞는 블럭 채굴하기
        let nonce: number = 0;
        let hash: string;
        while (true) {
            nonce++;
            _generateBlock.nonce = nonce;
            hash = this.createBlockHash(_generateBlock);
            const binary: string = hexToBinary(hash);
            const result = binary.startsWith('0'.repeat(_generateBlock.difficulty));
            if (result) {
                _generateBlock.hash = hash;
                return _generateBlock;
            }
        }
    }
    static getDifficulty(_adjustmentBlock: Block, _newBlock: Block, _previousBlock: Block) {
        if (_adjustmentBlock.height === 0) return 0;

        if (_newBlock.height < 9) return 0;
        if (_newBlock.height < 19) return 1;
        if (_newBlock.height % DIFFICULTY_ADJUSTMENT_UNIT !== 0) return _previousBlock.difficulty;

        const timeTaken = _newBlock.timestamp - _adjustmentBlock.timestamp;
        const timeExpected = UNIT * BLOCK_GENERATE_INTERVAL * DIFFICULTY_ADJUSTMENT_UNIT;

        if (timeTaken < timeExpected / 2) return _adjustmentBlock.difficulty + 1;
        if (timeTaken > timeExpected * 2) return _adjustmentBlock.difficulty - 1;
        //난이도....어떻게 구하지?
        return _adjustmentBlock.difficulty;
    }

    static isValidNewBlock(_previousBlock: IBlock, _newBlock: Block): Failable<Block, string> {
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
