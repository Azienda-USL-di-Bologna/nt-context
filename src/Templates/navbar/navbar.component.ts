import {Component, OnDestroy, OnInit} from "@angular/core";
import {ResolveEnd, Route, Router} from "@angular/router";
import {CustomReuseStrategy} from "../../Routes/custom-reuse-strategy";
import "rxjs/add/operator/filter";
import {Subscription} from "rxjs/Subscription";
import {NavbarService} from "./navbar.service";
import {Observable} from "rxjs/Observable";


@Component({
    selector: "app-navbar",
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
