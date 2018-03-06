export abstract class Message {

    protected _code: number;
    protected _message: string;
    protected _detail: string;

    constructor(code: number, message: string, detail: string) {
        this.code = code;
        this.message = message;
        this.detail = detail;
    }

    public get code() {
        return this._code;
    }

    public set code(value: number) {
        this._code = value;
    }

    public get message(): string {
        return this._message;
    }

    public set message(value: string) {
        this._message = value;
    }

    public get detail(): string {
        return this._detail;
    }

    public set detail(value: string) {
        this._detail = value;
    }
}
