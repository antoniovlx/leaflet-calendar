/// <reference types="leaflet" />

import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {

    interface CalendarOptions {
      id: number;
      position?: ControlPosition;
      minDate?: string;
      maxDate?: string;
      value?: string;
      onSelectDate: Function;
      labelWidth?: string;
      labelFontSize?: string;
      backgroundOpacity?: number;
      backgroundColor?: string;
      topBgPadding?: string;
      bottomBgPadding?: string;
      rightBgPadding?: string;
      leftBgPadding?: string;
    }

    export class Calendar extends L.Control {
      options: CalendarOptions;

      constructor(options?: CalendarOptions);

      addTo(map: L.Map): this;
      removeFrom(map: L.Map): this;

      open(): this;
      triggerOnSelectedDate(): this;
      show(): this;
      hide(): this;
      isHide(): boolean;
    }
  }

  namespace control {
    export function calendar(options?: Control.CalendarOptions): Control.Calendar;
  }
}
