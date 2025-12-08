# Leaflet Calendar Examples

This folder contains ready-to-open example pages demonstrating various features of the leaflet-calendar plugin.

## Available Examples

### 1. basic.html
**Minimal usage example**  
Demonstrates creating a Leaflet map, adding OpenStreetMap tiles, and adding the calendar control with an `onSelectDate` callback.

### 2. time.html
**Time picker usage**  
Demonstrates enabling time selection (`time: true`) with a datetime-local input and setting `minDate` to the current local ISO datetime.

### 3. multiple.html
**Multiple independent instances**  
Shows how to use multiple calendar controls on the same map with unique IDs. Each instance logs its current date independently.

### 4. programmatic.html
**Programmatic control**  
Demonstrates controlling the calendar programmatically using methods like `next()`, `back()`, `open()`, `setDate()`, and `getCurrentDate()`.

## How to Use

### Opening Locally

You can open any example file directly in your browser from the repository:

````bash
# Clone the repository
git clone https://github.com/antoniovlx/leaflet-calendar.git
cd leaflet-calendar/examples

# Open any example in your browser
# On macOS:
open basic.html

# On Linux:
xdg-open basic.html

# On Windows:
start basic.html
````

Or simply drag and drop any HTML file into your browser window.

### Via GitHub Pages

If the repository has GitHub Pages enabled, you can access the examples online at:
`https://antoniovlx.github.io/leaflet-calendar/examples/`

For example:
- `https://antoniovlx.github.io/leaflet-calendar/examples/basic.html`
- `https://antoniovlx.github.io/leaflet-calendar/examples/time.html`

## Notes

- All examples use CDN-hosted Leaflet (unpkg.com) for easy standalone usage
- Plugin CSS and JS are referenced relatively (`../css/leaflet-calendar.css` and `../js/leaflet-calendar.js`)
- Examples work both when opened locally from the repository and when served via GitHub Pages
- Open your browser's developer console to see additional logging output in some examples
