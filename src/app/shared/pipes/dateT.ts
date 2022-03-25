import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'dateT'})
export class DateTPipe implements PipeTransform {
  transform(value: string): string {

    let monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let d = new Date(value.split('T')[0])
  var datestring = monthNames[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

    return datestring;
  }
}