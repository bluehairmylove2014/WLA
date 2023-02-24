import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ShortNumber'
})
export class ShortNumberPipe implements PipeTransform {

  execTransformSuffixes(value: number): string {
    let suffixes = ['', 'K', 'M', 'B', 'T'];
    let suffixNum = 0;
    while (value >= 1000) {
      value /= 1000;
      suffixNum++;
    }
    return value.toFixed(1) + suffixes[suffixNum];
  }

  transform(arg_value: any): string {
    const value = (typeof arg_value === 'string') ? +arg_value : arg_value;
    let result = value;
    return (result < 1000) ? (result + '') : this.execTransformSuffixes(result);
  }

}
