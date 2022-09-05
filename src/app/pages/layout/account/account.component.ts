import { Component, OnInit, Inject } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MenuService } from 'src/app/service/menu.service';
import { environment } from 'src/environments/environment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/model/rol';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  username: string;
  nameRole: string;

  rol: Rol;

  constructor(
    private menuService: MenuService,
    public dialogo: MatDialogRef<AccountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();

    const decodedToken = helper.decodeToken(sessionStorage.getItem(environment.TOKEN_NAME));

    this.username = decodedToken.user_name;
    this.nameRole = decodedToken.authorities[0];

    console.log('decodedToken: ', decodedToken, 'username: ', this.username, 'role: ', this.nameRole);

    /*username*/
    this.menuService.loadRoleByName(this.nameRole).subscribe(data => {
      this.rol = data;
      console.log(this.rol);
    });

  }

  cerrarDialogo(): void {
    this.dialogo.close();
  }

}
