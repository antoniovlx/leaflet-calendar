// @ts-nocheck
/**
 * Utility class for date operations
 * @class DateUtils
 * @private
 */
const DateUtils = {
	/**
	 * Formats a date object to string
	 * @param {Date} date - Date to format
	 * @param {boolean} includeTime - Whether to include time in the output
	 * @returns {string} Formatted date string
	 */
	formatDate: function (date, includeTime = false) {
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, "0");
		const d = String(date.getDate()).padStart(2, "0");
		let result = `${y}-${m}-${d}`;

		// Always include time for internal date handling to avoid timezone issues
		if (includeTime) {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        result += `T${hours}:${minutes}`
    } else {
			result += 'T00:00:00';
		}
		return result;
	},

	/**
	 * Validates if a date is within the given range
	 * @param {Date} date - Date to validate
	 * @param {string} minDate - Minimum date string
	 * @param {string} maxDate - Maximum date string
	 * @returns {boolean} True if date is within range
	 */
	isDateInRange: function (date, minDate, maxDate) {
		if (!date) return false;

		const timestamp = date.getTime();
		const minTimestamp = minDate ? new Date(minDate).getTime() : -Infinity;
		const maxTimestamp = maxDate ? new Date(maxDate).getTime() : Infinity;

		return timestamp >= minTimestamp && timestamp <= maxTimestamp;
	}
};

/**
 * @name Calendar
 * @class L.Control.Calendar
 * @extends L.Control
 * @see L.control.calendar
 *
 * A Leaflet control that adds a date picker to the map
 */
L.Control.Calendar = L.Control.extend({
	options: {
		/** @type {number} Unique identifier for the calendar */
		id: 1,
		/** @type {string} Position of the control on the map */
		position: "bottomright",
		/** @type {string} Minimum selectable date */
		minDate: '2025-10-01',
		/** @type {string} Maximum selectable date */
		maxDate: '2025-10-31',
		/** @type {string} Current selected date */
		value: new Date().toJSON().slice(0, 10),
		/** @type {Function} Callback function when date is selected */
		onSelectDate: function (value) {
			console.warn("onSelectDate callback is not defined")
		},
		/** @type {boolean} Whether to trigger the callback on initialization */
		triggerFunctionOnLoad: false,
		/** @type {boolean} Whether to include time selection */
		time: false,
		/** @type {boolean} Whether to show back button */
		backButton: true,
		/** @type {boolean} Whether to show next button */
		nextButton: true,
		/** @type {string} Left margin of the control */
		marginLeft: "10px",
		/** @type {string} Right margin of the control */
		marginRight: "10px",
		/** @type {string} Top margin of the control */
		marginTop: "10px",
		/** @type {string} Bottom margin of the control */
		marginBottom: "10px",
	},

	/**
	 * Initializes the calendar control
	 * @param {Object} options - Configuration options
	 */
	initialize: function (options) {
		if (typeof options.onSelectDate !== "function") {
			options.onSelectDate = this.options.onSelectDate;
		}
		L.setOptions(this, options);

		// Pre-calculate date limits if provided
		this._minDateObj = this.options.minDate ? new Date(this.options.minDate) : null;
		this._maxDateObj = this.options.maxDate ? new Date(this.options.maxDate) : null;
	},
	onAdd: function (map) {
		this.map = map;
		this.sheet = document.createElement('style');

		document.body.appendChild(this.sheet);

		this.container = L.DomUtil.create('div', 'date-control-container');

		if (this.options.backButton) {
			this.addBackButton();
		}

		this.inputDate = L.DomUtil.create('div', 'date-control', this.container);

		let inputType = 'date';
		if (this.options.time) {
			inputType = 'datetime-local';
		}


		/* If time is enabled, add time*/
		if (this.options.time) {
			let defaultTime = '00:00';

			if (!this.options.value || !this.options.value.includes('T')) {
				const now = new Date();
				const hours = String(now.getHours()).padStart(2, '0');
				const minutes = String(now.getMinutes()).padStart(2, '0');
				defaultTime = `${hours}:${minutes}`;

				this.options.minDate = this.options.minDate + 'T00:00';
				this.options.maxDate = this.options.maxDate + 'T00:00';
			}

			this.options.value = this.options.value + 'T' + defaultTime;
		}

		this.inputDate.innerHTML =
			`<input type="${inputType}" name="date" id="input-control-date-picker${this.options.id}" value="${this.options.value}"
			min="${this.options.minDate}" max="${this.options.maxDate}"></input>`;


		if (this.options.nextButton) {
			this.addNextButton();
		}

		this._setupStylesContainer();

		/* Prevent click events propagation to map */
		L.DomEvent.disableClickPropagation(this.container);

		/* Prevent right click event propagation to map */
		L.DomEvent.on(this.container, 'date-control-container', function (ev) {
			L.DomEvent.stopPropagation(ev);
		});

		/* Prevent scroll events propagation to map when cursor on the div */
		L.DomEvent.disableScrollPropagation(this.container);

		/* When container is clicked picker is opened */
		L.DomEvent.addListener(this.inputDate, 'click', this.open.bind(this));

		/* When input date changes trigger user's onSelectDate function */
		L.DomEvent.addListener(this.inputDate, 'change', this.triggerOnSelectedDate.bind(this));

		if (this.options.triggerFunctionOnLoad) {
			this.options.onSelectDate(this.inputDate.children[0].value);
		}

		return this.container;
	},
	addNextButton: function () {
		this.nextButton = L.DomUtil.create('span', 'next-icon', this.container);

		/* When next is clicked date is changed */
		L.DomEvent.addListener(this.nextButton, 'click', this.next.bind(this));
	},
	addBackButton: function () {
		this.backButton = L.DomUtil.create('span', 'back-icon', this.container);

		/* When back is clicked date is changedd */
		L.DomEvent.addListener(this.backButton, 'click', this.back.bind(this));
	},
	open: function () {
		L.DomUtil.get('input-control-date-picker' + this.options.id).showPicker();
		return this;
	},
	/**
	 * Gets the current date from the input
	 * @returns {string} The current date with time component to avoid timezone issues
	 */
	getCurrentDate: function () {
		const dateValue = L.DomUtil.get('input-control-date-picker' + this.options.id).value;
		// If the date already includes time component (T), return as is
		if (dateValue.includes('T')) {
			return dateValue;
		}
		// Add time component to avoid timezone issues
		return dateValue + 'T00:00:00';
	},
	getMaxDate: function () {
		return new Date(this.options.maxDate);
	},
	getMinDate: function () {
		return new Date(this.options.minDate);
	},
	setDate: function (date) {
		const dateObj = new Date(date);

		if (DateUtils.isDateInRange(dateObj, this.options.minDate, this.options.maxDate)) {

			if(this.options.time){
				L.DomUtil.get('input-control-date-picker' + this.options.id).value = date;
				return;
			}else{
				const onlyDate = date.split('T')[0];
				L.DomUtil.get('input-control-date-picker' + this.options.id).value = onlyDate;
				return;
			}
		}
	},
	_isWithinLimitMax: function (currentDate) {
		var maxDate = this.getMaxDate()
		return this.options.maxDate !== '' && currentDate < maxDate.setDate(maxDate.getDate() + 1)
	},
	_isWithinLimitMin: function (currentDate) {
		var minDate = this.getMinDate()
		return this.options.minDate !== '' && currentDate > minDate.setDate(minDate.getDate() - 1)
	},
	/**
	 * Triggers the onSelectDate callback with validated date
	 * @returns {L.Control.Calendar} this
	 */
	triggerOnSelectedDate() {
		let currentDate = this.getCurrentDate();

		if (!currentDate) {
			currentDate = this.options.minDate || DateUtils.formatDate(new Date());
			this.setDate(currentDate);
		} else {
			const dateObj = new Date(currentDate);
			if (!DateUtils.isDateInRange(dateObj, this.options.minDate, this.options.maxDate)) {
				currentDate = this.options.minDate || DateUtils.formatDate(new Date());
				this.setDate(currentDate);
			}
		}

		this.options.onSelectDate(currentDate);
		return this;
	},
	/**
	 * Move to the previous date
	 * @returns {L.Control.Calendar} this
	 */
	back: function () {
		const currentDate = new Date(this.getCurrentDate());
		currentDate.setDate(currentDate.getDate() - 1);

		if (!DateUtils.isDateInRange(currentDate, this.options.minDate, this.options.maxDate)) {
			return this;
		}

		const formattedDate = DateUtils.formatDate(currentDate, this.options.time);
		this.setDate(formattedDate);
		this.triggerOnSelectedDate();
		return this;
	},

	/**
	 * Move to the next date
	 * @returns {L.Control.Calendar} this
	 */
	next: function () {
		const currentDate = new Date(this.getCurrentDate());
		currentDate.setDate(currentDate.getDate() + 1);

		if (!DateUtils.isDateInRange(currentDate, this.options.minDate, this.options.maxDate)) {
			return this;
		}

		const formattedDate = DateUtils.formatDate(currentDate, this.options.time);
		this.setDate(formattedDate);
		this.triggerOnSelectedDate();
		return this;
	},

	show: function () {
		L.DomUtil.setOpacity(this.container, 1);
		return this;
	},
	hide: function () {
		L.DomUtil.setOpacity(this.container, 0);
		return this;
	},
	isHide: function () {
		var opacity = L.DomUtil.getStyle(this.container, 'opacity');
		return parseInt(opacity) === 1 ? false : true;
	},
	onRemove: function () {
		L.DomUtil.remove(this.container);
	},
	_setupStylesContainer: function () {
		this.container.style.marginLeft = this.options.marginLeft;
		this.container.style.marginRight = this.options.marginRight;
		this.container.style.marginTop = this.options.marginTop;
		this.container.style.marginBottom = this.options.marginBottom;
	}
});

/**
 * Create a new calendar.
 *
 * @example
 *  var calendar = L.control.calendar({
 *     id: 1,
 *     minDate: "2023-04-01",
 *     maxDate: "2023-04-29",
 *     onSelectDate: (value: string) => this.onSelectDate(value),
 *   }).addTo(this.map);
 *
 * @param {Object} [options] - Optional options object
 * @returns {Calendar} A new calendar instance
 */
L.control.calendar = function (options) {
	return new L.Control.Calendar(options)
};
