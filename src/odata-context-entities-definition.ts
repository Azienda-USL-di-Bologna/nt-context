import {OdataContextDefinition} from "./odata-context-definition";
import {ContextModuleConfig} from "./context-module-config";
export class OdataContextEntitiesDefinition extends OdataContextDefinition {

    constructor(){
        super()
    }

    public buildOdataContext(config: ContextModuleConfig) {
        if (!this.odataContext) {
            super.buildCommonOdataContext(config, config.entities);
            const entities: Array<string> = Object.getOwnPropertyNames(config.entities);
            for (const entity of entities) {
                this.odataContext[config.entities[entity].name].on("updating", (keys, values) => {
                    super.fixUpdate(keys, values, config.entities[entity].name);
                });
                this.odataContext[config.entities[entity].name].on("inserting", (values) => {
                    super.fixUpdate(null, values, config.entities[entity].name);
                });
            }
        }
    }
}
