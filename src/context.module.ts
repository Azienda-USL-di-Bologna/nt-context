import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContextModuleConfig} from "./context-module-config";
import {OdataContextFactory} from "./odata-context-factory";
import {RouteReuseStrategy, RouterModule} from "@angular/router";
import {CustomReuseStrategy} from "./routes/custom-reuse-strategy";
import {GlobalContextService} from "./global-context.service";
import {NavbarService} from "./templates/navbar/navbar.service";
import {NavbarComponent} from "./templates/navbar/navbar.component";
import {SidebarComponent} from "./templates/sidebar/sidebar.component";
import {ButtonsBarComponent} from "./templates/buttons-bar/buttons-bar.component";

import {
  DxButtonModule
} from "devextreme-angular";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    ButtonsBarComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    ButtonsBarComponent
  ]
})
export class ContextModule {
  public static forRoot(config: ContextModuleConfig): ModuleWithProviders {
    return {
      ngModule: ContextModule,
      providers: [
          OdataContextFactory,
          {provide: "config", useValue: config},
          GlobalContextService,
          {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
          NavbarService
      ]
    }
  }
}
