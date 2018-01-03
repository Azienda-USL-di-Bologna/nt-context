import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  @Input("sidebarItems") public sidebarItems: SidebarItem[];

  constructor(public router: Router) {
  }

  public ngOnInit() {
  }

  public click(event: MouseEvent, item: SidebarItem) {
    // console.log("evento: ", event);
    this.router.navigate([item.routerLink], {queryParams: {reset: true}});
  }

  public isActive(item: SidebarItem){
      let paginaAttuale = this.router.url;
      paginaAttuale = paginaAttuale.slice(1, -11);
      // console.log("pagina: ", paginaAttuale);
      return item.routerLink === paginaAttuale;
  }
}

export class SidebarItem {
  public description: string;
  public routerLink: string;
  public children?: SidebarItem[];

  constructor(description: string, routerLink: string, children?: SidebarItem []) {
    this.description = description;
    this.routerLink = routerLink;
    this.children = children;
  }
}
