import {Component, Input, OnInit} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "sidebar",
  template: `
    <nav class="main-menu">
      <ul class="components margine-sinistro">
        <li *ngFor="let item of sidebarItems">
          <div *ngIf="!item.children; else submenuEntry">
            <a (click)="click($event, item)"><span [ngClass]="{active: isActive(item)}">{{ item.description }}</span></a>
          </div>
          <ng-template #submenuEntry>
            <div class="arrow-down">
              <a href="#submenu" data-toggle="collapse" aria-expanded="false"> {{ item.description }} </a>
            </div>
            <ul class="collapse margine-sinistro" id="submenu">
              <!--<li *ngFor="let childrens of items.children"></li>-->
              <sidebar [sidebarItems]="item.children"></sidebar>
            </ul>
          </ng-template>
        </li>
      </ul>
    </nav>
  `,
  styles: [`
    ﻿.margine-sinistro{padding-left:5%}.main-menu{background-color:#212121;border-right:2px solid #e5e5e5;height:100%}.main-menu li{position:relative;display:block;padding:18px 0;border-bottom:1px solid rgba(244,244,244,0.4);color:rgba(244,244,244,0.7)}.main-menu ul li:last-child{border-bottom:0}.main-menu a{position:relative;display:table;border-collapse:collapse;border-spacing:0;color:#999;font-family:arial;font-size:18px;cursor:pointer;text-decoration:none;-webkit-transform:translateZ(0) scale(1, 1);-webkit-transition:all .1s linear;transition:all .1s linear}.active{color:#ffffff}.main-menu .nav-icon{position:relative;display:table-cell;width:60px;height:36px;text-align:center;vertical-align:middle;font-size:18px}.main-menu .nav-text{position:relative;display:table-cell;vertical-align:middle;width:190px;font-family:sans-serif}.main-menu a:hover{color:#f4f4f4;text-decoration:none}.arrow-down a:after{color:#999;content:' ▼';font-size:15px;vertical-align:1px}.arrow-down:hover>a:after{color:#f4f4f4}
  `]
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
      const pos: number = paginaAttuale.indexOf("?");
            if (pos >= 0) {
              paginaAttuale = paginaAttuale.substring(1, pos);
            }
      // paginaAttuale = paginaAttuale.slice(1, -11);
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
