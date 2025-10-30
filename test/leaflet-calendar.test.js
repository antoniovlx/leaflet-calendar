/**
 * @jest-environment jsdom
 */

const L = require('leaflet');
require('../js/leaflet-calendar.js');

describe('L.Control.Calendar', () => {
    let map;
    let container;

    // Setup before each test
    beforeEach(() => {
        // Create map container
        container = document.createElement('div');
        container.style.height = '400px';
        document.body.appendChild(container);
        map = L.map(container).setView([51.505, -0.09], 13);
    });

    // Cleanup after each test
    afterEach(() => {
        map.remove();
        document.body.removeChild(container);
    });

    describe('Initialization', () => {
        test('should initialize with default options', () => {
					  let calendar = L.control.calendar({}).addTo(map);
            expect(calendar.options.id).toBe(1);
            expect(calendar.options.position).toBe('bottomright');
            expect(calendar.options.time).toBe(false);
            expect(calendar.options.backButton).toBe(true);
            expect(calendar.options.nextButton).toBe(true);
        });

        test('should initialize with custom options', () => {
            const customCalendar = L.control.calendar({
                id: 2,
                position: 'topleft',
                time: true,
                backButton: false,
                nextButton: false
            }).addTo(map);

            expect(customCalendar.options.id).toBe(2);
            expect(customCalendar.options.position).toBe('topleft');
            expect(customCalendar.options.time).toBe(true);
            expect(customCalendar.options.backButton).toBe(false);
            expect(customCalendar.options.nextButton).toBe(false);
        });
    });

    describe('Date Operations', () => {
        test('getCurrentDate should return date in correct format', () => {
					  let calendar = L.control.calendar({}).addTo(map);
            const date = calendar.getCurrentDate();
            expect(date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
        });

        test('setDate should update the date correctly', () => {
					  let calendar = L.control.calendar({}).addTo(map);
            const testDate = '2025-10-29';
            calendar.setDate(testDate);
            expect(calendar.getCurrentDate()).toBe(testDate + 'T00:00:00');
        });

        test('timezone handling should be consistent', () => {
						let calendar = L.control.calendar({minDate: '2025-01-01',
							 minDate: '2025-01-01',
							 maxDate: '2025-12-31'
						}).addTo(map);

            const testDate = '2025-07-05';
            calendar.setDate(testDate);
            const currentDate = calendar.getCurrentDate() + 'Z';
            const dateObj = new Date(currentDate);
            expect(dateObj.getUTCDate()).toBe(5); // Should be 5th regardless of timezone
        });
    });

    describe('Date Range Validation', () => {
        test('should respect minimum date', () => {
            const minDate = '2025-10-01';
            const customCalendar = L.control.calendar({
                minDate: minDate
            }).addTo(map);

            // Try to set date before minimum
            const beforeMin = '2025-09-30';
            customCalendar.setDate(beforeMin);
            expect(customCalendar.getCurrentDate()).not.toBe(beforeMin);
            expect(new Date(customCalendar.getCurrentDate()) >= new Date(minDate)).toBe(true);
        });

        test('should respect maximum date', () => {
            const maxDate = '2025-10-31';
            const customCalendar = L.control.calendar({
                maxDate: maxDate
            }).addTo(map);

            // Try to set date after maximum
            const afterMax = '2025-11-01';
            customCalendar.setDate(afterMax);
            expect(customCalendar.getCurrentDate()).not.toBe(afterMax);
            expect(new Date(customCalendar.getCurrentDate()) <= new Date(maxDate)).toBe(true);
        });
    });

    describe('Navigation Methods', () => {
        test('next() should increment date by one day', () => {
            const initialDate = '2025-10-15';
						let calendar = L.control.calendar({}).addTo(map);
            calendar.setDate(initialDate);
            calendar.next();
            expect(calendar.getCurrentDate()).toBe('2025-10-16T00:00:00');
        });

        test('back() should decrement date by one day', () => {
            const initialDate = '2025-10-15';
						let calendar = L.control.calendar({}).addTo(map);
            calendar.setDate(initialDate);
            calendar.back();
            expect(calendar.getCurrentDate()).toBe('2025-10-14T00:00:00');
        });

        test('next() should not exceed maximum date', () => {
            const maxDate = '2025-10-15';
            const customCalendar = L.control.calendar({
                maxDate: maxDate
            }).addTo(map);

            customCalendar.setDate(maxDate);
            customCalendar.next();
            expect(customCalendar.getCurrentDate()).toBe(maxDate + 'T00:00:00');
        });

        test('back() should not go before minimum date', () => {
            const minDate = '2025-10-15';
            const customCalendar = L.control.calendar({
                minDate: minDate
            }).addTo(map);

            customCalendar.setDate(minDate);
            customCalendar.back();
            expect(customCalendar.getCurrentDate()).toBe(minDate + 'T00:00:00');
        });
    });

    describe('Time Support', () => {
        test('should handle time when enabled', () => {
            const customCalendar = L.control.calendar({
                time: true
            }).addTo(map);

            const testDateTime = '2025-10-15T14:30';
            customCalendar.setDate(testDateTime);
            expect(customCalendar.getCurrentDate()).toBe(testDateTime);
        });

        test('should preserve time component when navigating', () => {
            const customCalendar = L.control.calendar({
                time: true
            }).addTo(map);

            const testDateTime = '2025-10-15T14:30';
            customCalendar.setDate(testDateTime);
            customCalendar.next();
            expect(customCalendar.getCurrentDate()).toBe('2025-10-16T14:30');
        });
    });

    describe('Event Handling', () => {
        test('should trigger onSelectDate callback', (done) => {
            const testDate = '2025-10-15';
            const customCalendar = L.control.calendar({
                onSelectDate: (value) => {
                    expect(value).toBe(testDate + 'T00:00:00');
                    done();
                }
            }).addTo(map);

            customCalendar.setDate(testDate);
            customCalendar.triggerOnSelectedDate();
        });

        test('should trigger callback on initialization when enabled', () => {
            const callback = jest.fn();
            const customCalendar = L.control.calendar({
                triggerFunctionOnLoad: true,
                onSelectDate: callback
            }).addTo(map);

            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Visibility Methods', () => {
        test('show() and hide() should work correctly', () => {
						let calendar = L.control.calendar({}).addTo(map);
            calendar.hide();
            expect(calendar.isHide()).toBe(true);

            calendar.show();
            expect(calendar.isHide()).toBe(false);
        });
    });

    describe('Multiple Instances', () => {
        test('should support multiple instances with different IDs', () => {
            const calendar1 = L.control.calendar({
                id: 1
            }).addTo(map);

            const calendar2 = L.control.calendar({
                id: 2
            }).addTo(map);

            calendar1.setDate('2025-10-15');
            calendar2.setDate('2025-10-16');

            expect(calendar1.getCurrentDate()).toBe('2025-10-15T00:00:00');
            expect(calendar2.getCurrentDate()).toBe('2025-10-16T00:00:00');
        });
    });
});
