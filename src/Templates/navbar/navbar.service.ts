import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Router, ResolveEnd, Route} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class NavbarService implements OnDestroy {

    private _visitedRoutes: Route[] = [];
    private _visitedRoutes$: BehaviorSubject<Route[]> = new BehaviorSubject([]);
    private subscriptions: Subscription[] = [];

    constructor(private router: Router) {
        this.subscriptions.push(
            this.router.events
                .filter((event) => event instanceof ResolveEnd)
                .subscribe(
                    (next: ResolveEnd) => {
                        let reset = false;
                        let url = next.state.url;
                        console.log("url: ", url);
                        const pos: number = url.indexOf("?");
                        if (pos >= 0) {
                            url = url.substring(0, pos);
                        }
                        const path = url.substring(1);
                        const queryParams: any = next.state.root.queryParams;
                        if (queryParams) {
                            reset = queryParams.reset === "true";
                        }
                        if (reset) {
                            this._visitedRoutes = [];
                            this._visitedRoutes$.next(this._visitedRoutes);
                        }
                        const currentRoute: Route[] = this.router.config.filter((e) => e.path === path);
                        if (currentRoute && currentRoute.length > 0 && currentRoute[0].data && currentRoute[0].data.breadcrumb) {
                            // const currentBreadcrump: string = this.router.config.find(e => e.path === path).data.breadcrumb;
                            // const index = this._visitedRoutes.findIndex((e) => e.path === currentRoute[0].path);
                            const index: number = this._visitedRoutes.indexOf(currentRoute[0]);
                            if (index >= 0) {
                                this._visitedRoutes = this._visitedRoutes.slice(0, index + 1);
                                this._visitedRoutes$.next(this._visitedRoutes);

                                // if (!reset)
                                //     CustomReuseStrategy.componentsReuseList.push("*");
                            } else {
                                this._visitedRoutes.push(currentRoute[0]);
                                this._visitedRoutes$.next(this._visitedRoutes);
                                // CustomReuseStrategy.componentsReuseList.push("*");
                            }
                            // console.log("RouterConfig", this.router.config);
                        }
                    }
                )
        );
    }

    get visitedRoutes(): Route[] {
        return this._visitedRoutes;
    }

    get visitedRoutes$(): Observable<Route[]> {
        return this._visitedRoutes$.asObservable();
    }

    public ngOnDestroy() {
        console.log("onDestroy");
        if (this.subscriptions && this.subscriptions.length > 0) {
            for (const subcription of this.subscriptions) {
                subcription.unsubscribe();
            }
        }
    }
}
