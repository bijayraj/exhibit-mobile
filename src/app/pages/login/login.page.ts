import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {
    // console.log('The APP URL IS');
    // console.log(environment.apiUrl);
  }

  get f() { return this.credentials.controls; }

  get username() {
    return this.credentials.get('username');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['admin@siu.edu', [Validators.required, Validators.email]],
      password: ['admin123', [Validators.required, Validators.minLength(6)]],
    });


  }


  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

  register() {
    this.router.navigateByUrl('/signup', { replaceUrl: true });
  }

  continueAsUser() {
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true })
  }



}
