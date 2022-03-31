import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-in-page-header',
  templateUrl: './in-page-header.component.html',
  styleUrls: ['./in-page-header.component.css']
})
export class InPageHeaderComponent implements OnInit {

  @Input() group: string = '';
  @Input() title: string = '';
  @Input() links: any[] = [];
  
  constructor() {}

  ngOnInit(): void {}

}
