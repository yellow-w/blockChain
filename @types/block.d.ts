declare interface IBlock extends IBlockHeader {
    merkleRoot: string;
    hash: string;
    nonce: number;
    difficulty: number;
    data: ITransaction[];
}
