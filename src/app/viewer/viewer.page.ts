import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-viewer',
  templateUrl: 'viewer.page.html',
  styleUrls: ['viewer.page.scss'],
})
export class ViewerPage implements OnInit {
  imageList: any[] = [];
  mode = 'single';
  startFrom = 0;

  constructor(private location: Location,
    private route: ActivatedRoute) {

  }
  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const url = params.url;
      const title = params.title;
      this.imageList = [{ url, title }];
    });

  }
  handleExit(ev) {
    console.log(`&&& ev: ${JSON.stringify(ev)}`);
    const keys = Object.keys(ev);
    if (keys.includes('result') && ev.result) {
      if (keys.includes('imageIndex')) {
        console.log(`last image index: ${ev.imageIndex}`);
      }
    }
    if (keys.includes('message')) {
      console.log(`returned message: ${ev.message}`);
    }
    this.location.back();
  }

}
