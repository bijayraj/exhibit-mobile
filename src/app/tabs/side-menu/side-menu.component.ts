import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {

  user: User;

  constructor(private authService: AuthenticationService,
    private router: Router,
    private menuCtrl: MenuController) { }

  ngOnInit() {
    this.user = this.authService.userValue
  }

  async logout() {
    await this.authService.logout();
    console.log('logout');
    this.menuCtrl.close();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  async login() {
    console.log('loggin in');
    this.menuCtrl.close();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }



}
