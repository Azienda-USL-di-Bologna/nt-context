import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "app-buttons-bar",
  templateUrl: "./buttons-bar.component.html",
  styleUrls: ["./buttons-bar.component.scss"]
})
export class ButtonsBarComponent implements OnInit {

  @Input("backButton") public backButton: ButtonAppearance;
  @Input("saveButton") public saveButton: ButtonAppearance;
  @Input("reloadButton") public reloadButton: ButtonAppearance;
  @Input("restoreButton") public restoreButton: ButtonAppearance;
  @Input("genericButtons") public genericButtons: ButtonAppearance[];

  // comando con la label
  @Output("command") public command = new EventEmitter<any>();

  // lancio di eventi di output
  @Output("onBackButton") public onBackButton = new EventEmitter();
  @Output("onSaveButton") public onSaveButton = new EventEmitter();
  @Output("onReloadButton") public onReloadButton = new EventEmitter();
  @Output("onRestoreButton") public onRestoreButton = new EventEmitter();
  @Output("onGenericButtonClick") public onGenericButtonClick = new EventEmitter<string>();

  constructor(private router: Router) { }

  // tslint:disable-next-line:no-empty
  public ngOnInit() {}

  public save() {
    this.command.emit("save");
    this.onSaveButton.emit();
  }

  public reload() {
    this.command.emit("reload");
    this.onReloadButton.emit();
  }

  public back() {
    this.command.emit("back");
    this.onBackButton.emit();
  }

  public restore() {
    this.command.emit("restore");
    this.onRestoreButton.emit();
  }

  public genericButtonClick(buttonName: string) {
    this.command.emit(buttonName);
    this.onGenericButtonClick.emit(buttonName);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class ButtonAppearance {
  private _label: string = "";
  private _icon: string = "";
  private _viewIcon: boolean = false;
  private _disabled: boolean = false;

  constructor(label: string, icon: string, viewIcon: boolean, disabled: boolean) {
    this._label = label;
    this._icon = icon;
    this._viewIcon = viewIcon;
    this._disabled = disabled;
  }

  get label(): string{
    return this._label;
  }
  set label(label: string){
    this._label = label;
  }

  get icon(): string{
    return this._icon;
  }
  set icon(icon: string){
    this._icon = icon;
  }

  get viewIcon(): boolean{
    return this._viewIcon;
  }
  set viewIcon(viewIcon: boolean){
    this._viewIcon = viewIcon;
  }

  get disabled(): boolean{
    return this._disabled;
  }
  set disabled(disabled: boolean){
    this._disabled = disabled;
  }
}

export interface Blocco {
  label: string;
  viewIcon: boolean;
}