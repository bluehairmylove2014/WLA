import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  constructor(
    private datePipe: DatePipe
  ) { }
  isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime())
  }
  convertDate(date: any, format: string) {
    if (typeof date === 'string' && this.isValidDate(date)) {
      const strDate = new Date(date);
      const rs = this.datePipe.transform(strDate, 'MMMM, yyyy');
      return rs === null ? '' : rs;
    }
    return 'at unknown';
  }
}
