import {Component, OnDestroy, OnInit} from "@angular/core";
import {ResolveEnd, Route, Router} from "@angular/router";
import {CustomReuseStrategy} from "../../routes/custom-reuse-strategy";
import "rxjs/add/operator/filter";
import {Subscription} from "rxjs/Subscription";
import {NavbarService} from "./navbar.service";
import {Observable} from "rxjs/Observable";


@Component({
    moduleId: module.id,
    selector: "app-navbar",
    // template: `<nav aria-label="breadcrumb" role="navigation" [ngClass]="{'emptyBreadcrumbs':visitedRoutes.length === 0}">
    //                 <ol class="breadcrumb" [ngClass]="{'emptyBreadcrumbs':visitedRoutes.length === 0}">
    //                 <!--<li class="breadcrumb-item" *ngIf="!isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->
    //                 <!--<li class="breadcrumb-item" *ngIf="isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->
    //                     <li class="breadcrumb-item" [ngClass] = "{'active': isLast}"  *ngFor="let route of visitedRoutes; last as isLast" >
    //                         <a *ngIf="!isLast" routerLink="{{route.path}}" (click)="onClick()">{{route.data["breadcrumb"]}}</a>
    //                         <span *ngIf="isLast">{{route.data["breadcrumb"]}}</span>
    //                     </li>
    //                 <!--<li class="breadcrumb-item active" aria-current="page" *ngIf="isLast"><a routerLink="{{route.path}}">{{route.data["breadcrumb"]}}</a></li>-->
    //
    //                 </ol>
    //             </nav>`,
    templateUrl: "./navbar.component.html",
    styleUrls: ["./navbar.component.scss"]
})
export class NavbarComponent implements OnInit {

    private visitedRoutesFromService$: Observable<Route[]>;
    public visitedRoutes: Route[];

    constructor(private navbarService: NavbarService){
    }

    ngOnInit() {
        this.visitedRoutesFromService$ = this.navbarService.visitedRoutes$;
        this.visitedRoutesFromService$.subscribe(visitedRoutes => {
            this.visitedRoutes = visitedRoutes;
        });
    }

    onClick(){
        CustomReuseStrategy.componentsReuseList.push("*");
    }
}
