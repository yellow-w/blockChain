import { Block } from '@core/blockChain/block';
import { GENESIS } from '@core/blockChain/config';
describe('block test', () => {
    it('block 생성', () => {
        const data = [
            {
                txIns: [{ txOutId: 'aaa', txOutIndex: 0, sigature: '' }],
                txOuts: [{ account: 'account', amount: 70 }],
                hash: 'cccc',
            },
        ];
        const block: Block = new Block(GENESIS, data);
        const isValid = block.isValidNewBlock(GENESIS, block);
        console.log(isValid);
    });
});
