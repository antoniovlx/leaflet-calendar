// @ts-nocheck
/**
 * @name Calendar
 * @class L.Control.Calendar
 * @extends L.Control
 * @see L.control.calendar
 */
L.Control.Calendar = L.Control.extend({
	options: {
		position: "bottomright",
		minDate: '',
		maxDate: '',
		value: new Date().toJSON().slice(0, 10),
		onSelectDate: (value) => console.log("The function is mandatory"),
		marginLeft: "10px",
		marginRight: "10px",
		marginTop: "10px",
		marginBottom: "10px",
	},
	initialize: function (options) {
		if (typeof options.changeMap != "function") {
			options.onSelectDate = function ({ label, value, map }) {
				console.log("You are not using the value or label from the timeline to change the map.");
			};
		}

		if (parseFloat(options.thumbHeight) <= 2) {
			console.log("The nodes on the timeline will not appear properly if its radius is less than 2px.")
		}

		L.setOptions(this, options);
	},
	onAdd: function (map) {
		this.map = map;
		this.sheet = document.createElement('style');
		document.body.appendChild(this.sheet);

		this.container = L.DomUtil.create('div', 'date-control-container');
		this.container.innerHTML =
			`<input type="date" name="date" id="input-control-date-picker" value="${this.options.value}"
			min=${this.options.minDate} max="${this.options.maxDate}"></input>`;

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
		L.DomEvent.addListener(this.container, 'click', this.open.bind(this));

		/* When input date changes trigger user's onSelectDate function */
		L.DomEvent.addListener(this.container, 'change', this.triggerOnSelectedDate.bind(this));

		return this.container;
	},
	open() {
		document.getElementById('input-control-date-picker').showPicker();
		return this;
	},
	triggerOnSelectedDate() {
		this.options.onSelectDate(document.getElementById('input-control-date-picker').value);
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
	_setupStylesContainer: function(){
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
