import {Component, Inject, OnInit} from "@angular/core";
import {Route} from "@angular/router";
import {CustomReuseStrategy} from "../../routes/custom-reuse-strategy";
import {NavbarService} from "./navbar.service";
import {Observable} from "rxjs/Observable";
import {ContextModuleConfig} from "../../context-module-config";

@Component({
    moduleId: module.id,
    selector: "app-navbar",
    template: `
      <nav aria-label="breadcrumb" role="navigation" [ngClass]="{'emptyBreadcrumbs':visitedRoutes.length === 0}">
          <ol class="breadcrumb" [ngClass]="{'emptyBreadcrumbs':visitedRoutes.length === 0}">
                  <!--<li class="breadcrumb-item" *ngIf="!isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->
                  <!--<li class="breadcrumb-item" *ngIf="isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->
                  <li class="breadcrumb-item" [ngClass] = "{'active': isLast}"  *ngFor="let route of visitedRoutes; last as isLast" >
                      <a *ngIf="!isLast" routerLink="{{route.path}}" (click)="onClick()">{{route.data["breadcrumb"]}}</a>
                      <span *ngIf="isLast">{{route.data["breadcrumb"]}}</span>
                  </li>
                  <!--<li class="breadcrumb-item active" aria-current="page" *ngIf="isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->

          </ol>
      </nav>

      <!--<nav aria-label="breadcrumb" role="navigation">-->
        <!--<ol class="breadcrumb">-->
          <!--<li class="breadcrumb-item"><a href="#">Home</a></li>-->
          <!--<li class="breadcrumb-item active" aria-current="page">Library</li>-->
        <!--</ol>-->
      <!--</nav>-->

      <!--<nav aria-label="breadcrumb" role="navigation">-->
        <!--<ol class="breadcrumb">-->
          <!--<li class="breadcrumb-item"><a href="#">Home</a></li>-->
          <!--<li class="breadcrumb-item"><a href="#">Library</a></li>-->
          <!--<li class="breadcrumb-item active" aria-current="page">Data</li>-->
        <!--</ol>-->
      <!--</nav>-->
    `,
    styles: [`
      .emptyBreadcrumbs{height:100%}
    `]
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
