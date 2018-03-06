import {Message} from "./message";

export class ErrorMessage extends Message {

    constructor(code: number, message: string, detail: string) {
        super(code, message, detail);
    }
}
