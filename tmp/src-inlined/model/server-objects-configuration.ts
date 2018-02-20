import {ServerObject} from "./server-object";
export class ServerObjectsConfiguration {

    private serverObjects: ServerObjectsDescriptor;

    public constructor(serverObjects: ServerObjectsDescriptor) {
        this.serverObjects = serverObjects;
    }

    public getServerObjectsList(): ServerObject[] {
        const res: ServerObject[] = [];
        const entitiesKeys: any[] = Object.getOwnPropertyNames(this.serverObjects);
        for (const entityKey of entitiesKeys) {
            res.push(this.serverObjects[entityKey]);
        }
        return res;
    }

    public getServerObject(serverObjectName: string): ServerObject {
        return this.serverObjects[serverObjectName];
    }
}

export type ServerObjectsDescriptor = {
    [key: string]: ServerObject ;
};

