//난이도 조절할 단위 : 10
export const DIFFICULTY_ADJUSTMENT_UNIT = 10;
//블록 생성 시간 10(단위: 분)
export const BLOCK_GENERATE_INTERVAL = 10;
//생성 시간 단위(분당 60초)
export const UNIT: number = 60;

export const GENESIS: IBlock = {
    version: '1.0.0',
    height: 0,
    hash: 'caa9be5a10c8717c38bfafb9dc42fe5e657197876ed0994150aa1bfb0e4c96d5',
    timestamp: 1655218800000,
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    merkleRoot: 'DBB0E88D7B32898A47EB3C60D3F95331056C229565FCEB2E6ACA5FF00F5F7CB5',
    nonce: 0,
    difficulty: 0,
    data: [],
};
