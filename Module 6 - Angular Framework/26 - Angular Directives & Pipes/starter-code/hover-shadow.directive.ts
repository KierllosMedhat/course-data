import { Directive } from '@angular/core';

@Directive({
  selector: '[appHoverShadow]',
  standalone: true,
  host: {
    // TODO: Bind the host's style.boxShadow to a property or signal
    // TODO: Bind the host's style.transition to a smooth transition string (e.g. 'box-shadow 0.3s ease')
    // TODO: Handle mouseenter to apply '0 8px 25px rgba(0,0,0,0.15)'
    // TODO: Handle mouseleave to clear the shadow
  }
})
export class HoverShadowDirective {
  // Hint: Use host properties or listeners inside the host metadata object
}
