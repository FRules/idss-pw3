// Source: https://github.com/Locheed/ng-duration-format-pipe/blob/master/src/app/duration-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat',
  pure: false
})
export class DurationFormatPipe implements PipeTransform {

  private static format(arg2, seconds, minutes, hours, days) {
    // tslint:disable-next-line:no-unused-expression
    (days < 10) ? days = '0' + days : days;
    // tslint:disable-next-line:no-unused-expression
    (hours < 10) ? hours = '0' + hours : hours;
    // tslint:disable-next-line:no-unused-expression
    (minutes < 10) ? minutes = '0' + minutes : minutes;
    // tslint:disable-next-line:no-unused-expression
    (seconds < 10) ? seconds = '0' + seconds : seconds;

    switch (arg2) {
      case 'hhmmss':
        return `${hours}h ${minutes}m ${seconds}s`;

      case 'ddhhmmss':
        return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;

      case 'ddhhmmssLong':
        return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

    }

  }

  transform(value: any, arg1: any, arg2: any): any {

    let days: any;
    let seconds: any;
    let minutes: any;
    let hours: any;

    if (arg1 === 'ms' && arg2 === 'hhmmss') {
      seconds = Math.floor((value / 1000) % 60);
      minutes = Math.floor(((value / (1000 * 60)) % 60));
      hours   = Math.floor((value / (1000 * 60 * 60)));
      return DurationFormatPipe.format(arg2, seconds, minutes, hours, days);

    } else if (arg1 === 's' && (arg2 === 'hhmmss' || arg2 === 'hhmm')) {
      seconds = Math.floor((value % 60));
      minutes = Math.floor(((value / 60) % 60));
      hours   = Math.floor(((value / 60) / 60));
      return DurationFormatPipe.format(arg2, seconds, minutes, hours, days);

    } else if (arg1 === 'ms' && (arg2 === 'ddhhmmss' || arg2 === 'ddhhmmssLong') ) {
      seconds = Math.floor(((value / 1000) % 60));
      minutes = Math.floor((value / (1000 * 60) % 60));
      hours   = Math.floor((value / (1000 * 60 * 60) % 24));
      days    = Math.floor((value / (1000 * 60 * 60 * 24)));
      return DurationFormatPipe.format(arg2, seconds, minutes, hours, days);

    } else if (arg1 === 's' && (arg2 === 'ddhhmmss' || arg2 === 'ddhhmmssLong') ) {
      seconds = Math.floor(value % 60);
      minutes = Math.floor(((value / 60) % 60));
      hours   = Math.floor(((value / 60) / 60) % 24);
      days    = Math.floor((((value / 60) / 60) / 24));
      return DurationFormatPipe.format(arg2, seconds, minutes, hours, days);

    } else {
      return value;
    }
  }

}
