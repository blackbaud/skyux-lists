import {
  ElementRef,
  Injectable
} from '@angular/core';

@Injectable()
export class SkyRepeaterAdapterService {
  private host: ElementRef;

  public setRepeaterHost(hostRef: ElementRef): void {
    this.host = hostRef;
  }

  public moveItemUp(elementRef: ElementRef, top = false): void {
    const itemArray = Array.from(this.host.nativeElement.querySelectorAll('sky-repeater-item'));
    const index = itemArray.indexOf(elementRef.nativeElement);

    if (index === 0) {
      return;
    }

    let newIndex = index - 1;

    if (top) {
      newIndex = 0;
    }

    this.moveItem(elementRef, newIndex);
  }

  public moveItemDown(elementRef: ElementRef, bottom = false): void {
    const itemArray = Array.from(this.host.nativeElement.querySelectorAll('sky-repeater-item'));
    const index = itemArray.indexOf(elementRef.nativeElement);

    if (index === itemArray.length - 1) {
      return;
    }

    let newIndex = index + 1;

    if (bottom) {
      newIndex = itemArray.length - 1;
    }

    this.moveItem(elementRef, newIndex);
  }

  private moveItem(itemRef: ElementRef, newIndex: number): void {
    const repeaterDiv: HTMLElement = this.host.nativeElement.querySelector('.sky-repeater');

    repeaterDiv.removeChild(itemRef.nativeElement);
    const nextSibling = repeaterDiv.querySelectorAll('sky-repeater-item')[newIndex];

    repeaterDiv.insertBefore(itemRef.nativeElement, nextSibling);
  }
}
