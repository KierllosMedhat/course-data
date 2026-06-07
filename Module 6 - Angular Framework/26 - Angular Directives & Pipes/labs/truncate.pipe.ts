import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true
})
export class TruncatePipe implements PipeTransform {
  // TODO: Implement the transform method
  // It should accept:
  // - value: string
  // - limit: number (default: 20)
  // - ellipsis: string (default: '...')
  //
  // Ensure it handles edge cases: null, undefined, empty strings,
  // or strings shorter than the limit.
  transform(value: string | null | undefined, limit: number = 20, ellipsis: string = '...'): string {
    if (!value) return '';
    // TODO: Write truncation logic
    return value;
  }
}
