import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddArtPage } from './add-art.page';


const routes: Routes = [
  {
    path: '',
    component: AddArtPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddArtPageRoutingModule { }
