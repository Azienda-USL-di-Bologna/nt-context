import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig, ServerObjectsDescriptor} from "./context-module-config";
export class OdataContextViewsDefinition extends OdataContextDefinition {

    constructor(){
        super()
    }

    public buildOdataContext(config: ContextModuleConfig): void {
      if (!this.odataContext) {
        super.buildCommonOdataContext(config, <ServerObjectsDescriptor> config.views);
        // const entities: Array<string> = Object.getOwnPropertyNames(config.entities);
        // for (const entity of entities) {
        //   this.odataContext[config.entities[entity].name].on("updating", (keys, values) => {
        //     super.fixUpdate(keys, values, config.entities[entity].name);
        //   });
        //   this.odataContext[config.entities[entity].name].on("inserting", (values) => {
        //     super.fixUpdate(null, values, config.entities[entity].name);
        //   });
        // }
      }
    }
}
