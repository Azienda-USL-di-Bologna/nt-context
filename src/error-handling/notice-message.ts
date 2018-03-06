import {Message} from "./message";

export class NoticeMessage extends Message {

    constructor(code: number, message: string, detail: string) {
        super(code, message, detail);
    }
}
