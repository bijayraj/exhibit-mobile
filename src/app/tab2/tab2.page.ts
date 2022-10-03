import { Component, OnInit } from '@angular/core';
import { Exhibit } from '../models/exhibit';
import { ExhibitService } from '../services/exhibit.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  exhibits: Exhibit[] = [];

  constructor(private exhibitService: ExhibitService) { }

  ngOnInit() {

    this.exhibitService.getAll().subscribe(data => {
      this.exhibits = data;
      console.log(data);
    });

  }
}
