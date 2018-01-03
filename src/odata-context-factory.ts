import {Inject, Injectable} from "@angular/core";
import {ContextModuleConfig} from "./context-module-config";
import {OdataContextEntitiesDefinition} from "./odata-context-entities-definition";
import {OdataContextViewsDefinition} from "./odata-context-views-definition";
import {OdataContextFunctionsImportDefinition} from "./odata-context-functions-import-definition";

@Injectable()
export class OdataContextFactory {
    constructor(@Inject('config') private config: ContextModuleConfig) {
    }

  /**
   * serve per settare OdataBaseUrl nel caso non sia una costante, ma venga calcolato dinamicamente (come ad esempio in GiPi, dove viene calcolato prendendo l'url dell'applicazione dalla barra degli indirizzi)
    * @param baseUrl
   */
  public setOdataBaseUrl(baseUrl: string): void {
        this.config.odataBaseUrl = baseUrl;
    }

    public buildOdataContextEntitiesDefinition(): OdataContextEntitiesDefinition {
        const odataContextEntitiesDefinition: OdataContextEntitiesDefinition = new OdataContextEntitiesDefinition();
        odataContextEntitiesDefinition.buildOdataContext(this.config);
        return odataContextEntitiesDefinition;
    }

    public buildOdataContextViewsDefinition(): OdataContextViewsDefinition {
        const odataContextViewsDefinition: OdataContextViewsDefinition = new OdataContextViewsDefinition();
        odataContextViewsDefinition.buildOdataContext(this.config);
        return odataContextViewsDefinition;
    }

    public buildOdataFunctionsImportDefinition(): OdataContextFunctionsImportDefinition {
        const odataContextFunctionsImportDefinition: OdataContextFunctionsImportDefinition = new OdataContextFunctionsImportDefinition();
        odataContextFunctionsImportDefinition.buildOdataContext(this.config);
        return odataContextFunctionsImportDefinition;
    }
}
