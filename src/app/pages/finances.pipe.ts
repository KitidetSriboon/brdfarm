import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'finances'
})
export class FinancesPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
