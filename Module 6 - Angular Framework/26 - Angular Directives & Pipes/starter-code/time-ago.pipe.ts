import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // TODO: Implement time ago formatting logic
    // - Less than 60s: "just now" or "X seconds ago"
    // - Less than 60m: "X minutes ago"
    // - Less than 24h: "X hours ago"
    // - Else: "X days ago" or similar
    
    return 'some time ago';
  }
}
