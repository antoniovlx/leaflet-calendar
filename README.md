# leaflet-calendar

[![npm](https://img.shields.io/npm/v/leaflet-calendar.svg)](https://www.npmjs.com/package/leaflet-calendar)


A calendar date picker for Leaflet, with optional time selection and robust timezone handling.

See the [demo](http://antoniovlx.github.io/leaflet-calendar/examples/index.html).

![calendar picker opened](./examples/images/control-opened.png)

## Features
- Date picker with optional time selection via native `datetime-local` input
- Robust timezone handling for consistent date operations
- Next/Previous date navigation
- Configurable date range limits
- Customizable positioning and margins
- Multiple instances support

## Usage

````javascript
 L.control.calendar({
      id: 1,
      minDate: "2023-04-01",
      maxDate: "2023-04-29",
      onSelectDate: (value) => this.onSelectDate(value),
      position: "topleft",
    }).addTo(this.map);
  }

  onSelectDate(value): void {
    alert("Date: " + value)
  }
````

The `onSelectDate` function is your custom function which is triggered everytime the date is changed.

### Options

See table below for full description of customizable options for your calendar picker. All date-related options should be in ISO format (YYYY-MM-DD).

| Option | Description      | Default             |
| ----- | ----------- | ----------- |
| id      | id of calendar picker. It's mandatory when using various calendar pickers on the same map.  | ''
| position      | Position of calendar picker ('topleft','topright','bottomleft','bottomright') | "bottomright" |
| minDate   | Minimum selectable date value in the calendar | '' |
| maxDate | Maximun selectable date value in the calendar. | '' |
| value | Initial date selected (YYYY-MM-DD). Uses timezone-safe handling. | Current date |
| onSelectDate   | Function that will execute when a date is selected. Receives the selected date as an ISO string.  | `function(value) { console.warn("onSelectDate callback is not defined"); }` |
| time | support to time picker | false |
| triggerFunctionOnLoad | Trigger `onSelectDate` function on first load | false |
| nextButton | Add a next button | true |
| backButton | Add a back button | true |
| marginLeft   | Left margin in pixels of the container | "10px" |
| marginRight   | Right margin in pixels of the container | "10px" |
| marginTop | Top margin in pixels of the container | "10px" |
| marginBottom | Bottom margin in pixels of the container | "10px" |

## Methods

The calendar control provides several methods for programmatic control:

### Date Methods
- `getCurrentDate()`: Gets the current selected date
- `setDate(date)`: Sets the date programmatically
- `getMaxDate()`: Gets the maximum selectable date
- `getMinDate()`: Gets the minimum selectable date

### Navigation Methods
- `next()`: Moves to the next date
- `back()`: Moves to the previous date
- `open()`: Opens the date picker dialog

### Visibility Methods
- `show()`: Shows the calendar control
- `hide()`: Hides the calendar control
- `isHide()`: Returns whether the calendar is hidden

## Implementation Details

### Timezone Handling
The component now includes robust timezone handling to ensure consistent date operations across different timezones:
- All dates are internally handled with a time component to avoid timezone-related issues
- Date comparisons and operations are performed using UTC-safe methods
- Input/output dates maintain consistency regardless of the user's timezone

### Date Format
- Input dates should be in ISO format (YYYY-MM-DD)
- When time selection is enabled, dates use ISO datetime format (YYYY-MM-DDTHH:mm)
- All internal date operations preserve timezone consistency

### Event Handling
The component handles various events internally:
- Click events are prevented from propagating to the map
- Right-click events are prevented from propagating
- Scroll events are prevented when cursor is on the calendar
- Date change events trigger the `onSelectDate` callback

### Time Support
When time selection is enabled (`time: true`):
- Input type changes to `datetime-local`
- Default time is set to current time if not specified
- Date format includes time component (YYYY-MM-DDTHH:mm)
- Min/max dates are automatically adjusted to include time

## License
This software is released under the [MIT licence](http://www.opensource.org/licenses/mit-license.php). Icons used in the example are from [https://www.flaticon.com](https://www.flaticon.com).
