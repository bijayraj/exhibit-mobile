import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { UserService } from 'src/app/services/user.service';
import { CustomValidators } from 'src/app/validators/custom.validator';
import { environment } from '../../../environments/environment';
import { Toast } from '@capacitor/toast';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signUpForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private userService: UserService
  ) { }

  get f() {
    return this.signUpForm.controls;
  }

  ngOnInit() {

    this.signUpForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      organization: ['', []]
    },
      {
        validators: [CustomValidators.mustMatch('password', 'confirmPassword')]
      }
    );
  }


  async signup() {

    this.submitted = true;
    const showToast = async (message: string) => {
      await Toast.show({
        text: message,
        position: 'center',
      });
    };
    const loading = await this.loadingController.create();


    // stop here if form is invalid
    if (this.signUpForm.invalid) {
      return;
    }
    await loading.present();

    this.userService.addUser(this.signUpForm.value)
      .pipe(first())
      .subscribe({
        next: async () => {
          await loading.dismiss();
          const successAlert = await this.alertController.create({
            header: 'Sign Up successful',
            message: 'User successfully created. Logging in with the user..',
            buttons: ['OK'],
          });
          await successAlert.present();

          await loading.present();
          this.authService.login({ username: this.signUpForm.value.username, password: this.signUpForm.value.password }).subscribe(
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


          // alert('User successfully registered. You can now login');
          // this.router.navigate(['./login']);
        },
        error: async error => {
          await loading.dismiss();
          console.log(error);

          const alert = await this.alertController.create({
            header: 'User registration failed',
            message: error.error.message,
            buttons: ['OK'],
          });
          await alert.present();
          // this.error = error;
          // this.loading = false;
        }
      });
  }

}
