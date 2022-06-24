import { WebSocket } from 'ws';
import { Chain } from '@core/blockChain/chain';

export class P2PServer extends Chain {
    sockets: WebSocket[];
    constructor() {
        super();
        this.sockets = [];
    }

    listen(socket: WebSocket) {
        const server = new WebSocket.Server({ port: 7545 });
        server.on('connection', () => {
            console.log('connected');
            this.connectSocket(socket);
        });
    }

    connectToPeer(newPeer: string) {
        const socket = new WebSocket(newPeer);
        socket.on('open', () => {
            this.connectSocket(socket);
        });
    }

    connectSocket(_socket: WebSocket) {
        //1. sockets 배열에 socket 추가
        this.sockets.push(_socket);
        //2. messageHandler 호출
        this.messageHandler(_socket);
        const data: Message = {
            type: MessageType.all_block,
            payload: {},
        };
        //3. 에러 핸들러 호출
        this.errorHandler(_socket);
        //4. data 객체 만들어서 send 호출
        this.send(_socket)(data);
    }
    messageHandler(_socket: WebSocket) {
        const callBack = (data: string) => {
            const result: Message = P2PServer.dataParse<Message>(data);
            const send = this.send(_socket);

            switch (result.type) {
                case MessageType.latest_block: {
                    const message: Message = {
                        type: MessageType.all_block,
                        payload: [this.getLatestBlock()],
                    };
                    send(message);
                    break;
                }
                case MessageType.all_block: {
                    const message: Message = {
                        type: MessageType.receivedChain,
                        payload: this.getChain(),
                    };
                    const [receivedBlock] = result.payload;
                    const isValid = this.addToChain(receivedBlock);
                    if (!isValid.isError) break;

                    send(message);
                    break;
                    //addToChain 생성
                }
                case MessageType.receivedChain: {
                    const receivedChain: IBlock[] = result.payload;
                    this.handleChainResponse(receivedChain);
                    break;
                }
            }
        };
        _socket.on('message', callBack);
    }
    errorHandler(_socket: WebSocket) {
        const close = () => {
            this.sockets.splice(this.sockets.indexOf(_socket), 1);
        };
        _socket.on('close', close);
        _socket.on('error', close);
    }

    send(_socket: WebSocket) {
        return (_data: Message) => {
            _socket.send(JSON.stringify(_data));
        };
    }

    broadCast(_data: Message): void {
        this.sockets.forEach((socket) => this.send(socket)(_data));
    }

    handleChainResponse(_receivedChain: IBlock[]): Failable<undefined, string> {
        //체인응답
        const isValid = this.isValidChain(_receivedChain);
        if (isValid.isError)
            return {
                isError: true,
                error: isValid.error,
            };

        const isReplaced = this.replaceChain(_receivedChain);
        if (isReplaced.isError) {
            return { isError: true, error: isReplaced.error };
        }

        const msg: Message = {
            type: MessageType.receivedChain,
            payload: _receivedChain,
        };
        this.broadCast(msg);

        return {
            isError: false,
            value: undefined,
        };
    }

    static dataParse<T>(_data: string): T {
        return JSON.parse(Buffer.from(_data).toString());
    }
}
