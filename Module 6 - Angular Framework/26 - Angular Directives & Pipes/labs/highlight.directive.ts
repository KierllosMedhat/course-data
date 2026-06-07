import { Directive, input, linkedSignal } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
  host: {
    // TODO: Bind the host's background-color style to currentColor()
    // '[style.backgroundColor]': 'currentColor()',
    // TODO: Bind mouseenter event to onMouseEnter() and mouseleave to onMouseLeave()
  }
})
export class HighlightDirective {
  // TODO: Add an input for color (alias 'appHighlight', default 'yellow')
  // color = input<string>('yellow', { alias: 'appHighlight' });

  // TODO: Add an input for defaultColor (default 'transparent')
  // defaultColor = input<string>('transparent');

  // TODO: Add a linkedSignal to manage currentColor, initialized with defaultColor()
  // currentColor = linkedSignal(() => this.defaultColor());

  onMouseEnter(): void {
    // TODO: Set currentColor to color() input
  }

  onMouseLeave(): void {
    // TODO: Reset currentColor to defaultColor()
  }
}
