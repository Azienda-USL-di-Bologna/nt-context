import {ContextModuleConfig} from "../context-module-config";
import ODataContext from "devextreme/data/odata/context";
import {keyConverters, EdmLiteral} from "devextreme/data/odata/utils";
import * as moment from "moment";
import * as config from "devextreme/core/config";
import {OdataForeignKey, ServerObject} from "../model/server-object";
import {CustomLoadingFilterParams} from "./custom-loading-filter-params";
import {isArray} from "util";
import {ServerObjectsConfiguration} from "../model/server-objects-configuration";

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
        const customLoadingFilterParams: CustomLoadingFilterParams = loadOption.userData["customLoadingFilterParams"]
        // console.log("custom", customLoadingFilterParams);
        // console.log("option", loadOption);
        if (loadOption.filter != null && customLoadingFilterParams != null) {
            const currentFilter = loadOption.filter;
            const targetField: string = customLoadingFilterParams.getTargetField();
            for (const i in currentFilter) {
                let currentField: any;
                let currentValue: any;
                if (isArray(currentFilter[i][0])) {
                    currentField = currentFilter[i][0][0];
                    currentValue = currentFilter[i][0][2];
                } else {
                    currentField = currentFilter[i][0];
                    currentValue = currentFilter[i][2];
                }
                if (currentField === targetField) {
                    let myFilter: any = customLoadingFilterParams.getFilter();
                    myFilter = this.buildFilter(myFilter, targetField, currentValue);
                    currentFilter[i] = myFilter;
                    break;
                }
            }
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

