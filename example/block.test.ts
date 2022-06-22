import { Block } from '@core/blockChain/block';
import { Chain } from '@core/blockChain/chain';
describe('block test', () => {
    let ws = new Chain();
    let GENESIS = Block.getGenesis();
    it('block 생성', () => {
        const data = [
            {
                txIns: [{ txOutId: 'aaa', txOutIndex: 0, sigature: '' }],
                txOuts: [{ account: 'account', amount: 70 }],
                hash: 'cccc',
            },
        ];
        const adjustmentBlock = ws.getAdjustmentBlock();
        const block: Block = new Block(GENESIS, data, adjustmentBlock);
        const isValid = Block.isValidNewBlock(GENESIS, block);
        console.log(isValid);
        ws.addBlock(GENESIS, data, block);
        console.log(ws.getChain());
        console.log(ws.getLatestBlock());
        console.log(ws.getLength());
    });
});
