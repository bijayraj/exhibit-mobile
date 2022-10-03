import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MenuController } from '@ionic/angular';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  user: User;
  subscription: Subscription

  constructor(private authService: AuthenticationService,
    private router: Router,
    private menuCtrl: MenuController) {

  }

  ngOnInit() {
    this.subscription = this.authService.userSubject.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }




}
