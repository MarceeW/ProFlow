import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateExpired',
  standalone: true
})
export class DateExpiredPipe implements PipeTransform {

  transform(value: Date): boolean {
    return new Date(value) < new Date();
  }

}
