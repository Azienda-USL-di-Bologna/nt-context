import {ContextModuleConfig} from "../context-module-config";
import ODataContext from "devextreme/data/odata/context";
import {keyConverters, EdmLiteral} from "devextreme/data/odata/utils";
import * as moment from "moment";
import * as config from "devextreme/core/config";
import {OdataForeignKey, ServerObject} from "../model/server-object";
import {CustomLoadingFilterParams, FieldFilter} from "./custom-loading-filter-params";
import {isArray} from "util";
import {ServerObjectsConfiguration} from "../model/server-objects-configuration";
import {CustomReuseStrategy} from "../routes/custom-reuse-strategy";

export abstract class OdataContextDefinition {

  protected odataContext: ODataContext;

  private buildFilter(filter: any, target: string, value: any): void {
    let stringFilter = JSON.stringify(filter);
    stringFilter = stringFilter.replace("${target}", target);
    if (typeof(value) === "string") {
      stringFilter = stringFilter.replace(/\${value}/g, value);
      stringFilter = stringFilter.replace(/\${value.tolower}/g, value.toLowerCase());
    } else {
      stringFilter = stringFilter.replace(/"\${value}"/g, value);
      stringFilter = stringFilter.replace(/"\${value.tolower}"/g, value);
    }
    // console.log("stringFilter", stringFilter);
    return JSON.parse(stringFilter);
  }

  private getFilter(currentField: string, customFilters: FieldFilter[]): FieldFilter {
    const fieldFilter: FieldFilter[] = customFilters.filter((f) => f.targetField === currentField);
    if (fieldFilter && fieldFilter.length > 1) {
      throw new Error("targetFiled duplicato, nel CustomLoadingFilterParams, i targetFiled devono essere tutti diversi");
    }
    if (fieldFilter && fieldFilter.length === 1) {
      return fieldFilter[0];
    } else {
      return null;
    }
  }

  private fixFilter(currentFilter: any[], customFilters: FieldFilter[]) {
    if (Array.isArray(currentFilter[0])) {
      for (let i = 0; i < currentFilter.length; i++) {
        currentFilter[i] = this.fixFilter(currentFilter[i], customFilters);
      }
    } else {
      if (Array.isArray(currentFilter)) {
        const currentField = currentFilter[0];
        const currentValue = currentFilter[2];

        const targetFilter = this.getFilter(currentField, customFilters);
        if (targetFilter) {
          let myFilter: any = targetFilter.filter;
          myFilter = this.buildFilter(myFilter, targetFilter.targetField, currentValue);
          return myFilter;
        }
      }
    }
    return currentFilter;
  }

  public abstract buildOdataContext(config: ContextModuleConfig): void;

  public getContext(): ODataContext {
    return this.odataContext;
  }

  public fixUpdate(keys: any, values: any, serverObjectName: string): void {
    // console.log(keys, values, serverObjectName);

    // const fields = this.dataSource.store()["_fieldTypes"];
    values = this.createFixedValues(values, serverObjectName);
  }

  public createFixedValues(values: any, serverObjectName: string): string {
    const fields: any = (this.odataContext as any)[serverObjectName]._fieldTypes;
    for (const value in values) {
      // console.log("value", value);
      if (!fields[value]) {
        delete (values)[value];
            }  else if (values[value] === "") {
                values[value] = null;
      }
    }

    for (const field in fields) {
      if (values[field] && fields[field] instanceof OdataForeignKey) {
        // console.log(fields[field].getTargetEntity(), values[field]);
        values[field] = this.odataContext.objectLink(
          fields[field].getTargetEntity(), values[field][fields[field].getKeyName()]);
      }
    }

    return values;
  }

  public customLoading(loadOption: any): void {
    const customLoadingFilterParams: CustomLoadingFilterParams = loadOption.userData["customLoadingFilterParams"];
    // console.log("custom", customLoadingFilterParams);
    // console.log("option", loadOption);
    if (loadOption.filter != null && customLoadingFilterParams != null) {
      const currentFilter = loadOption.filter;

      const customFilters = customLoadingFilterParams.filters;
      loadOption.filter = this.fixFilter(currentFilter, customFilters);
    }
  }

  protected buildCommonOdataContext(config: ContextModuleConfig, serverObjects: ServerObjectsConfiguration): void {
    if (!this.odataContext) {
      this.setCustomConfiguration(config.defaultTimeZoneOffset, config.defaultCurrency);
      const oDataContextOptions = {
        url: config.odataBaseUrl,
        entities: this.getOdataContextServerObjectsDefinition(serverObjects),
        withCredentials: config.withCredentials ? config.withCredentials : false,
        errorHandler: config.errorHandler,
        beforeSend: (request: any) => {
          // console.info(JSON.stringify(request));
          if (config.tokenProvider) {
            request.headers = {Authorization: "Bearer " + config.tokenProvider!()};
          }
        }
      };
      this.odataContext = new ODataContext(oDataContextOptions);
      // if (config.tokenProvider) {
      //     this.odataContext = new ODataContext({
      //         url: config.odataBaseUrl,
      //         entities: this.getOdataContextServerObjectsDefinition(serverObjects),
      //         beforeSend: function (request: any) {
      //             // console.info(JSON.stringify(request));
      //             request.headers = {"Authorization": "Bearer " + config.tokenProvider!()};
      //         }
      //     });
      // }
      // else {
      //     this.odataContext = new ODataContext({
      //         url: config.odataBaseUrl,
      //         withCredentials: true,
      //         entities: this.getOdataContextServerObjectsDefinition(serverObjects),
      //     });
      // }
    }
  }

  protected setCustomConfiguration(defaultTimeZoneOffset: number, defaultCurrencyParam: string): void {

    // customizzazione per filtri sulle date

    /**
     * @Override
     * Sovrascrivo la funzione standard della classe Date per il ritorno della timezone
     * @returns {number}
     */
    Date.prototype.getTimezoneOffset = () => {
      return defaultTimeZoneOffset;
    };

    keyConverters["DateTime"] = (value: any) => {
      if (value != null) {
        const formattedDate = moment(value).format("YYYY-MM-DDTHH:mm:ss");
        return new EdmLiteral("datetime'" + formattedDate + "'");
      }
      return new EdmLiteral("null");
    };

    const configObj = {
      defaultCurrency: defaultCurrencyParam,
      forceIsoDateParsing: true
    };

    Date.prototype.toJSON = function() {
      return moment(this).format();
    };
    config.default(configObj);
  }

  protected getOdataContextServerObjectsDefinition(serverObjects: ServerObjectsConfiguration): any {
    const entities: ServerObject[] = serverObjects.getServerObjectsList();
    return entities.reduce((obj: any, serverObject: any) => {
      obj[serverObject.getName()] = serverObject.getOdataContextEntity();
      return obj;
    }, {});
  }
}
