import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig, ServerObjectsDescriptor} from "../context-module-config";
export class OdataContextFunctionsImportDefinition extends OdataContextDefinition {

    constructor() {
        super();
    }

    public buildOdataContext(config: ContextModuleConfig): void {
      if (!this.odataContext) {
        super.buildCommonOdataContext(config, config.functionsImport as ServerObjectsDescriptor);
      }
    }
}
