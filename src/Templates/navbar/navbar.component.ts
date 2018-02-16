import {Component, Inject, OnInit} from "@angular/core";
import {Route} from "@angular/router";
import {CustomReuseStrategy} from "../../routes/custom-reuse-strategy";
import {NavbarService} from "./navbar.service";
import {Observable} from "rxjs/Observable";
import {ContextModuleConfig} from "../../context-module-config";

@Component({
    moduleId: module.id,
    selector: "app-navbar",
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

    public visitedRoutes: Route[];
    private visitedRoutesFromService$: Observable<Route[]>;

  constructor(private navbarService: NavbarService, @Inject('config') private config: ContextModuleConfig) {
      console.log(config);
    }

    public ngOnInit() {
        this.visitedRoutesFromService$ = this.navbarService.visitedRoutes$;

        // mi sottoscrivo all'observable che contiene le rotte visitate in modo che ogni volta che cambia vengo notificato
        this.visitedRoutesFromService$.subscribe((visitedRoutes) => {
            this.visitedRoutes = visitedRoutes;
        });
    }

    public onClick() {
        CustomReuseStrategy.componentsReuseList.push("*");
    }
}
