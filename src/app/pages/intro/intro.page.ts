import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { INTRO_KEY } from 'src/app/guards/intro.guard';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    await Preferences.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }

}
