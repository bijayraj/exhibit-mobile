import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private platform: Platform,
    private location: Location) {

    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      // if (this._location.isCurrentPathEqualTo('/home')) {

      //   // Show Exit Alert!
      //   console.log('Show Exit Alert!');
      //   this.showExitConfirm();
      //   processNextHandler();
      // } else {

      // Navigate to back page
      console.log('Navigate to back page');
      this.location.back();

      // }

    });
  }
}
