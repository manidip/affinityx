import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-result',
  templateUrl: './no-result.component.html',
  styleUrls: ['./no-result.component.css']
})
export class NoResultComponent implements OnInit {

  @Input() message = 'No Results Found';

  constructor() { }

  ngOnInit(): void {}

}
