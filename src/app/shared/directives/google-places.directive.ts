import {Component, Directive,ElementRef, Output, EventEmitter, AfterViewInit, OnDestroy} from '@angular/core';
declare var google: any;
@Directive({
  selector: 'places-auto-complete'
})
export class PlacesAutoComplete implements AfterViewInit, OnDestroy {
  @Output() placeChange: EventEmitter<any> = new EventEmitter<any>();
 
  private autoComplete: any;
 
  constructor(private el: ElementRef){
    if(typeof google == 'undefined') console.warn('Unable to detect loaded Google JavaScript API.');
  }
 
  ngAfterViewInit(): void {
    let input: HTMLInputElement = this.el.nativeElement.children[0];
    this.initAutoComplete(input);
  }
 
  ngOnDestroy(): void {
    google && google.maps && google.maps.event && google.maps.event.clearListeners(this.autoComplete, 'place_changed');
  }
 
  private initAutoComplete(input: HTMLInputElement): void {
    this.autoComplete = new google.maps.places.Autocomplete(input);
    google && google.maps && google.maps.event && google.maps.event.addListener(this.autoComplete, 'place_changed', () => {
      this.placeChange.emit(this.autoComplete.getPlace());
    });
  }
}