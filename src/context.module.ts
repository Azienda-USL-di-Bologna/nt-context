import {ModuleWithProviders, NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import {ContextModuleConfig} from "./context-module-config";
import {OdataContextFactory} from "./odata-context-factory";
import {RouteReuseStrategy} from "@angular/router";
import {CustomReuseStrategy} from "./Routes/custom-reuse-strategy";
import {GlobalContextService} from "./global-context.service";



@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})

export class ContextModule {
  static forRoot(config: ContextModuleConfig): ModuleWithProviders {
    return {
      ngModule: ContextModule,
      providers: [
          OdataContextFactory,
          {provide: 'config', useValue: config},
          GlobalContextService,
          {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
          ]
    }
  }
}
