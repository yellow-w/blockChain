declare enum MessageType {
    latest_block = 0,
    all_block = 1,
    receivedChain = 2,
}

declare interface Message {
    type: MessageType;
    payload: any;
}
