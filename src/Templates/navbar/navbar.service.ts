import {Injectable, OnDestroy, OnInit} from "@angular/core";
import {Router, ResolveEnd, Route} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/filter";

@Injectable()
export class NavbarService implements OnDestroy {

  private _visitedRoutes: Route[] = [];
  private _visitedRoutes$: BehaviorSubject<Route[]> = new BehaviorSubject([]);
  private subscriptions: Subscription[] = [];

  constructor(private router: Router) {
    this.subscriptions.push(
      this.router.events
      // mi sottoscrivo all'evento del router ResolveEnd che scatta subito prima di navigare verso la pagina
      // dall'evento leggo la rotta verso la quale sto andando e la aggiungo nelle rotte visitate,
      // oppure se è un nuovo contesto, svuoto le rotte e inserisco la nuova.
        .filter((event) => event instanceof ResolveEnd)
        .subscribe(
          (next: ResolveEnd) => {
            let reset = false;

            // separo l'url dai parametri
            let url = next.state.url;
            console.log("url: ", url);
            const pos: number = url.indexOf("?");
            if (pos >= 0) {
              url = url.substring(0, pos);
            }
            const path = url.substring(1);

            // leggo i parametri e da questi controllo se è presente il parametro reset che mi indica che sto navigando in un nuovo contesto
            const queryParams: any = next.state.root.queryParams;
            if (queryParams) {
              reset = queryParams.reset === "true";
            }
            // se sto navigando in un nuovo contesto svuoto le rotte
            if (reset) {
              this._visitedRoutes = [];
              // this._visitedRoutes$.next(this._visitedRoutes);
            }

            // ora devo inserire il breadcrumbs della nuova rotta nella lista delle rotte. Il breadcrumbs è inddicato nei dati della confugurazione delle rotte.
            // per cui recupero la configurazione della della rotta verso la quale sto navigando.
            const currentRoute: Route[] = this.router.config.filter((e) => e.path === path);
            if (currentRoute && currentRoute.length > 0 && currentRoute[0].data && currentRoute[0].data.breadcrumb) {

              // cerco la rotta nella lista delle rotte, se la trovo tolgo le rotte da quella trovata in poi
              // (se entro probabilmente vuol dire che ho cliccato su una voce della navbar
              const index: number = this._visitedRoutes.indexOf(currentRoute[0]);
              if (index >= 0) {
                this._visitedRoutes = this._visitedRoutes.slice(0, index + 1);
                // this._visitedRoutes$.next(this._visitedRoutes);

                // altrimenti vuol dire che sto andando in una nuova pagina non ancora visitata, per cui aggiungo il rispettovo breadcrumbs alla lista
              } else {
                this._visitedRoutes.push(currentRoute[0]);
                // this._visitedRoutes$.next(this._visitedRoutes);
                // CustomReuseStrategy.componentsReuseList.push("*");
              }
              // console.log("RouterConfig", this.router.config);
            }

            // la lista delle rotte è cambiata, lo notifico a chi si è sottoscritto
            this._visitedRoutes$.next(this._visitedRoutes);
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

    // alla distruzione del service tolgo la sottoscrizione a tutto quello a cui sono sottoscritto
    if (this.subscriptions && this.subscriptions.length > 0) {
      for (const subcription of this.subscriptions) {
        subcription.unsubscribe();
      }
    }
  }
}
