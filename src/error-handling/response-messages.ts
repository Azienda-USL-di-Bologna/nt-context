import {ErrorMessage} from "./error-message";
import {WarningMessage} from "./warning-message";
import {NoticeMessage} from "./notice-message";

export class ResponseMessages {
    private _httpCode: number;
    private _errorMessages: ErrorMessage[];
    private _warningMessages: WarningMessage[] ;
    private _noticeMessages: NoticeMessage[];

    constructor(httpCode: number, errorMessages: ErrorMessage[]) {
        this._httpCode = httpCode;
        this._errorMessages = errorMessages;
    }

    get httpCode(): number {
        return this._httpCode;
    }

    set httpCode(value: number) {
        this._httpCode = value;
    }

    get errorMessages(): ErrorMessage[] {
        return this._errorMessages;
    }

    set errorMessages(value: ErrorMessage[]) {
        this._errorMessages = value;
    }

    get warningMessages(): WarningMessage[] {
        return this._warningMessages;
    }

    set warningMessages(value: WarningMessage[]) {
        this._warningMessages = value;
    }

    get noticeMessages(): NoticeMessage[] {
        return this._noticeMessages;
    }

    set noticeMessages(value: NoticeMessage[]) {
        this._noticeMessages = value;
    }
}
