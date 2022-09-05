import { Component, OnInit } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { LoginService } from 'src/app/service/login.service';
import { MenuService } from 'src/app/service/menu.service';
import { MatDialog } from "@angular/material/dialog";
import { AccountComponent } from './account/account.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  menus: Menu[];

  constructor(
    private menuService: MenuService,
    private loginService: LoginService,
    public dialogo: MatDialog
  ) { }

  ngOnInit(): void {
    this.menuService.getMenuChange().subscribe(data => this.menus = data);
  }

  logout(){
    this.loginService.logout();
  }

  showDialogAccount(): void {
    this.dialogo
      .open(AccountComponent, {
        data: null
      }).afterClosed().subscribe(() => {});
  }

}
