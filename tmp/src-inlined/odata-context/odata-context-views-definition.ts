import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "../context-module-config";
export class OdataContextViewsDefinition extends OdataContextDefinition {

    constructor() {
        super();
    }

    public buildOdataContext(config: ContextModuleConfig): void {
      if (!this.odataContext) {
        super.buildCommonOdataContext(config, config.views());
      }
    }
}
