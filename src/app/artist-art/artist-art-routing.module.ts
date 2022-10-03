import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArtistArtPage } from './artist-art.page';

const routes: Routes = [
  {
    path: '',
    component: ArtistArtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArtistArtPageRoutingModule {}
