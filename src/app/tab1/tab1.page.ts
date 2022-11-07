import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { NFC, Ndef } from '@awesome-cordova-plugins/nfc/ngx';
import { Observable } from 'rxjs';
import { ArtworkService } from '../services/artwork.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  readerMode$: any;
  isIos: boolean;
  isWeb: boolean = false;
  constructor(private router: Router, private navController: NavController,
    private platform: Platform, private nfc: NFC, private ndef: Ndef,
    private artworkService: ArtworkService) {
    this.isIos = this.platform.is('ios');
  }



  async ngOnInit() {
    // await this.readNFCTag()
    this.isWeb = !(this.platform.is('ios') || this.platform.is('android'));
    this.readNFCTag();

  }

  navigateArtwork(id: number) {
    this.router.navigate(['tabs', 'artwork', id]);
    // this.navController.navigateForward('tabs/artwork/2');
  }


  async readNFCTag() {


    if (this.platform.is('ios')) {
      console.log('IN IOS');
      // Read NFC Tag - iOS
      // On iOS, a NFC reader session takes control from your app while scanning tags then returns a tag
      try {

        // let tag = await this.nfc.scanNdef();
        let tag = await this.nfc.scanTag();
        // console.log(JSON.stringify(tag));
        // let mystring = JSON.stringify(tag);
        // console.log(mystring);

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

          // let payloadBytes = tag.ndefMessage[0].payload;
          // const jsonBytesToString = String.fromCharCode(...payloadBytes);
          // const myId = jsonBytesToString.substring(3);

          // payloadBytes = tag.ndefMessage[1].payload;
          // const jsonBytesToString2 = String.fromCharCode(...payloadBytes);
          // const myDesc = jsonBytesToString2.substring(3);

          // console.log(myId);
          // console.log(myDesc);

          //--------------------

          // console.log(jsonBytesToString);
          // let purifiedStr = jsonBytesToString.substring(jsonBytesToString.indexOf("{"));
          // const mydata = JSON.parse(purifiedStr);
          // console.log("MY DATA IS\n");
          // console.log(purifiedStr);
          // console.log(mydata);
          // let myId = 1 //mydata.id;
          // let myDesc = "Desc 1" //mydata.desc;


          // await this.nfc.cancelScan();

          // this.router.navigateByUrl(`/tabs/artwork/${myId}?totalstr=${jsonBytesToString}&desc=Item_${myId}`);
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

            // console.log(jsonBytesToString);
            // let purifiedStr = jsonBytesToString.substring(jsonBytesToString.indexOf("{"));
            // const mydata = JSON.parse(purifiedStr);
            // console.log("MY DATA IS\n");
            // console.log(purifiedStr);
            // console.log(mydata);
            // let myId = 1 //mydata.id;
            // let myDesc = "Desc 1" //mydata.desc;

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
