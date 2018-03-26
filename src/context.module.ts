import {ModuleWithProviders, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ContextModuleConfig} from "./context-module-config";
import {OdataContextFactory} from "./odata-context/odata-context-factory";
import {RouteReuseStrategy, RouterModule} from "@angular/router";
import {CustomReuseStrategy} from "./routes/custom-reuse-strategy";
import {GlobalContextService} from "./service/global-context.service";
import {NavbarService} from "./templates/navbar/navbar.service";
import {NavbarComponent} from "./templates/navbar/navbar.component";
import {SidebarComponent} from "./templates/sidebar/sidebar.component";
import {ButtonsBarComponent} from "./templates/buttons-bar/buttons-bar.component";
import {OdataUtilities} from "./odata-context/odata-utilities";
import {DxButtonModule} from "devextreme-angular";
import {MomentModule} from "angular2-moment";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DxButtonModule,
    MomentModule
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
  public static forRoot(ntContextConfig: ContextModuleConfig): ModuleWithProviders {
    return {
      ngModule: ContextModule,
      providers: [
          OdataContextFactory,
          {provide: "ntContextConfig", useValue: ntContextConfig},
          GlobalContextService,
          OdataUtilities,
          {provide: RouteReuseStrategy, useClass: CustomReuseStrategy},
          NavbarService
      ]
    };
  }
}
