import { Component, OnInit } from '@angular/core';

import { Request }    from '../request';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  supported_number_of_travellers = [1,2,3,4,5]

  constructor() { }

  ngOnInit() {
  }

}
