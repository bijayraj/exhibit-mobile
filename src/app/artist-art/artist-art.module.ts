import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ArtistArtPageRoutingModule } from './artist-art-routing.module';

import { ArtistArtPage } from './artist-art.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ArtistArtPageRoutingModule
  ],
  declarations: [ArtistArtPage],
  exports: [ArtistArtPage]
})
export class ArtistArtPageModule { }
