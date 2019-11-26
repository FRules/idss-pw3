import { Component, OnInit } from '@angular/core';

import { Request }    from '../request';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {

  supported_number_of_travellers = [1,2,3,4,5]

  model = new Request("Amsterdam", "Rotterdam", 1, 5, 5, 5, 6.5);

  constructor() { }

  submitted = false;
  onSubmit() {
    this.submitted = true;
    console.log("Submitted")
  }

  ngOnInit() {
  }

}
