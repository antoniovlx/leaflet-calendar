/// <reference types="leaflet" />

import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {

    interface CalendarOptions {
      position?: ControlPosition;
      minDate?: string;
      maxDate?: string;
      value?: string;
      onSelectDate: Function;
      triggerFunctionOnLoad?: boolean;
      nextButton?: boolean;
      backButton?: boolean;
      marginLeft?: string;
      marginRight?: string;
      marginTo?: string;
      marginBotton?: string;
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
