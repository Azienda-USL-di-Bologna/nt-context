import {ServerObjectsConfiguration} from "./model/server-objects-configuration";

export interface ContextModuleConfig {
    odataBaseUrl?: string; // è inutile passarlo qui perché dato che lo calcoliamo dinamicamente, non è pronto in fase di passaggio di questi parametri, si deve passare usando la funzione setOdataBaseUrl in OdataContextFactory
    entities: () => ServerObjectsConfiguration;
    views?: () => ServerObjectsConfiguration;
    functionsImport?: () => ServerObjectsConfiguration;
    tokenProvider?: () => string;
    defaultTimeZoneOffset: number;
    defaultCurrency: string;
    // default a false
    withCredentials?: boolean;
    errorHandler?: (e: any) => void;
}

