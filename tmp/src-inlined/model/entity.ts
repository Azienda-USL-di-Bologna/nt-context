import {ServerObject} from "./server-object";
export abstract class Entity extends ServerObject {
    public abstract getName(): string;
}
