import {ServerObject} from "./model/server-object";

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
    errorHandler?: (e: any) => void;
}

export interface ServerObjectsDescriptor  {
    [key: string]: ServerObject;
}
