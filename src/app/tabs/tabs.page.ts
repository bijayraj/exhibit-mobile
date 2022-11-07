import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { User } from '../models/user';
import { Subscription } from 'rxjs';
import { Ndef, NFC } from '@awesome-cordova-plugins/nfc/ngx';
import { ArtworkService } from '../services/artwork.service';
@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy {

  user: User;
  subscription: Subscription
  isIos = false;
  readerMode$: any;


  constructor(private authService: AuthenticationService,
    private router: Router,
    private menuCtrl: MenuController,
    private navController: NavController,
    private platform: Platform, private nfc: NFC, private ndef: Ndef,
    private artworkService: ArtworkService) {

    this.isIos = this.platform.is('ios');

  }

  ngOnInit() {
    this.subscription = this.authService.userSubject.subscribe(user => this.user = user);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  async readNFCTag() {


    if (this.platform.is('ios')) {
      console.log('IN IOS');
      // Read NFC Tag - iOS
      // On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
      try {

        let tag = await this.nfc.scanTag();
        if (tag) {
          let id = tag.id;
          console.log('GOT THE ID')
          console.log(id);
          let idString = this.nfc.bytesToHexString(tag.id);
          console.log('The tag id is');
          console.log(idString);

          this.artworkService.getByTagId(idString).subscribe(async data => {
            if (data) {
              await this.nfc.cancelScan();
              this.router.navigateByUrl(`/tabs/artwork/${data.id}?totalstr=${data.title}&desc=Item_${data.id}`);
            }
          });
        }


      } catch (err) {
        console.log('Error reading tag', err);
      }



    } else if (this.platform.is('android')) {
      // Read NFC Tag - Android
      // Once the reader mode is enabled, any tags that are scanned are sent to the subscriber
      let flags = this.nfc.FLAG_READER_NFC_A | this.nfc.FLAG_READER_NFC_V;
      this.readerMode$ = this.nfc.readerMode(flags).subscribe(
        tag => {
          let mystring = JSON.stringify(tag);
          console.log(mystring);
          if (tag) {
            let id = tag.id;
            let payloadBytes = tag.ndefMessage[0].payload;
            const jsonBytesToString = String.fromCharCode(...payloadBytes);
            const myId = jsonBytesToString.substring(3);

            payloadBytes = tag.ndefMessage[1].payload;
            const jsonBytesToString2 = String.fromCharCode(...payloadBytes);
            const myDesc = jsonBytesToString2.substring(3);

            console.log(myId);
            console.log(myDesc);

            this.router.navigateByUrl(`/tabs/artwork/${myId}?totalstr=${jsonBytesToString}&desc=Item_${myId}`);
          }

        },

        err => console.log('Error reading tag', err)
      );
    } else {
      console.log('Not supported platform for NFC');
      this.router.navigate(['tabs', 'artwork', 2]);

    }
  }



}
