import {ServerObject} from "./server-object";
export abstract class View extends ServerObject {
    public abstract getName(): string;
}
