// @ts-nocheck
/**
 * @name Calendar
 * @class L.Control.Calendar
 * @extends L.Control
 * @see L.control.calendar
 */
L.Control.Calendar = L.Control.extend({
	options: {
		id: 1,
		position: "bottomright",
		minDate: '',
		maxDate: '',
		value: new Date().toJSON().slice(0, 10),
		onSelectDate: function (value) {
			console.log("The function is mandatory")
		},
		triggerFunctionOnLoad: false,
		time: false,
		backButton: true,
		nextButton: true,
		marginLeft: "10px",
		marginRight: "10px",
		marginTop: "10px",
		marginBottom: "10px",
	},

	initialize: function (options) {
		if (typeof options.onSelectDate != "function") {
			options.onSelectDate = function (value) {
				console.log("The function is mandatory");
			};
		}
		L.setOptions(this, options);
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
			min=${this.options.minDate} max="${this.options.maxDate}"></input>`;


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
	getCurrentDate: function () {
		return L.DomUtil.get('input-control-date-picker' + this.options.id).value;
	},
	getMaxDate: function () {
		return new Date(this.options.maxDate);
	},
	getMinDate: function () {
		return new Date(this.options.minDate);
	},
	setDate: function (date) {
		L.DomUtil.get('input-control-date-picker' + this.options.id).value = date;
	},
	_isWithinLimitMax: function (currentDate) {
		var maxDate = this.getMaxDate()
		return this.options.maxDate !== '' && currentDate < maxDate.setDate(maxDate.getDate() + 1)
	},
	_isWithinLimitMin: function (currentDate) {
		var minDate = this.getMinDate()
		return this.options.minDate !== '' && currentDate > minDate.setDate(minDate.getDate() - 1)
	},
	triggerOnSelectedDate() {
		if (this.getCurrentDate() === '') {
			if (this.options.minDate !== '') {
				this.setDate(this.options.minDate);
			} else {
				this.setDate(new Date().toJSON().slice(0, 10));
			}
		} else {
			const day = new Date(this.getCurrentDate()).getDate();

			if (this.options.minDate !== '' && this.options.maxDate !== '') {
				if (day < this.getMinDate().getDate() && day > this.getMaxDate().getDate()) {
					this.setDate(this.options.minDate);
				}
			} else if (this.options.minDate !== '') {
				if (day < this.getMinDate().getDate()) {
					this.setDate(this.options.minDate);
				}
			} else if (this.options.maxDate !== '') {
				if (day > this.getMaxDate().getDate()) {
					this.setDate(this.options.maxDate);
				}
			}
		}

		this.options.onSelectDate(this.getCurrentDate())
		return this;
	},
	back: function () {
		const fecha = new Date(this.getCurrentDate());
		fecha.setDate(fecha.getDate() - 1);

		const formatDate = (date) => {
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, "0");
			const d = String(date.getDate()).padStart(2, "0");
			let result = `${y}-${m}-${d}`;

			if (this.options.time) {
				const h = String(date.getHours()).padStart(2, "0");
				const min = String(date.getMinutes()).padStart(2, "0");
				result += `T${h}:${min}`;
			}
			return result;
		};

		if (this.options.minDate) {
			const limitMinDate = new Date(this.options.minDate);
			limitMinDate.setDate(limitMinDate.getDate() - 1);

			if (fecha.getTime() <= limitMinDate.getTime()) return;
		}

		const lastDateStr = formatDate(fecha);

		this.setDate(lastDateStr);
		this.triggerOnSelectedDate();
	},
	next: function () {
		const fecha = new Date(this.getCurrentDate());
		fecha.setDate(fecha.getDate() + 1);

		const formatDate = (date) => {
			const y = date.getFullYear();
			const m = String(date.getMonth() + 1).padStart(2, "0");
			const d = String(date.getDate()).padStart(2, "0");
			let result = `${y}-${m}-${d}`;

			if (this.options.time) {
				const h = String(date.getHours()).padStart(2, "0");
				const min = String(date.getMinutes()).padStart(2, "0");
				result += `T${h}:${min}`;
			}
			return result;
		};

		const nextDateStr = formatDate(fecha);

		if (this.options.maxDate) {
			const limitMaxDate = new Date(this.options.maxDate);
			limitMaxDate.setDate(limitMaxDate.getDate() + 1);

			if (fecha.getTime() >= limitMaxDate.getTime()) return;
		}

		this.setDate(nextDateStr);
		this.triggerOnSelectedDate();
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
