import {Entity} from "./entity";
import {View} from "./view";
import {FunctionImport} from "./function-import";
import {ServerObject} from "./server-object";

export interface ContextModuleConfig {
    odataBaseUrl?: string; // è inutile passarlo qui perché dato che lo calcoliamo dinamicamente, non è pronto in fase di passaggio di questi parametri, si deve passare usando la funzione setOdataBaseUrl in OdataContextFactory
    entities: ServerObjectsDescriptor;
    views?: ServerObjectsDescriptor;
    functionsImport?: ServerObjectsDescriptor;
    tokenProvider?: () => string;
    defaultTimeZoneOffset: number;
    defaultCurrency: string;
    // default a false
    withCredentials?: boolean;
};

export interface ServerObjectDescriptor {
    name: string,
    class: typeof ServerObject
};

export interface EntityDescriptor extends ServerObjectDescriptor {
    class: typeof Entity
};

export interface ViewDescriptor extends ServerObjectDescriptor {
    class: typeof View
};

export interface FunctionImportDescriptor extends ServerObjectDescriptor {
    class: typeof FunctionImport
};

export type ServerObjectsDescriptor  = {
    [key: string]: ServerObjectDescriptor
};

