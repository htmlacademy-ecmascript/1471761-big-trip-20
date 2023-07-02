import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EditingType, EMPTY_POINT, TYPES } from '../const.js';
import { formatDateTime } from '../utils/point.js';
import { DEFAULT_DATETIME_FORMAT } from '../const.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';


function createEventTypesListTemplate(currentType) {
  const typesList = Object.values(TYPES).map((eventType) =>
    `<div class="event__type-item">
      <input id="event-type-${eventType}-1"
       class="event__type-input  visually-hidden"
       type="radio" name="event-type"
       value="${eventType}"
       ${eventType === currentType ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-1">${eventType}</label>
    </div>`,
  ).join('');

  return `<div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${typesList}
            </fieldset>
          </div>`;
}

function createTypeOffersListTemplate(typeOffers) {
  if (typeOffers.length === 0) {
    return '';
  }


  const offersList = typeOffers.map(({ id, title, price, checked }) =>
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden"
      id="event-offer-${id}"
      type="checkbox" name="event-offer-${id}"
      ${checked ? 'checked' : ''}>
      <label class="event__offer-label" for="event-offer-${id}">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('');
  return `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
              ${offersList}
            </div>
          </section>`;
}

function createEventDescriptionTemplate(destination) {
  const { description, pictures } = destination;
  if (!description && (!pictures || pictures.length === 0)) {
    return '';
  }
  const picturesContainer = pictures.length > 0 ? `<div class="event__photos-container">
                                          <div class="event__photos-tape">
                                            ${pictures.map(({
    src,
    description: picDescription,
  }) => `<img class="event__photo" src="${src}" alt="${picDescription}">`).join('')}
                                          </div>
                                        </div>` : '';
  const descriptionContainer = description ? `<p class="event__destination-description">${description}</p>` : '';
  return `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            ${descriptionContainer}
            ${picturesContainer}
          </section>`;
}

// de verificat, e offers ? trebueie offers??
function createEventDetailsTemplate(offers, destination) {

  if (!destination) {
    return '';
  }
  return `<section class="event__details">
          ${createTypeOffersListTemplate(offers)}
          ${createEventDescriptionTemplate(destination)}
          </section>`;
}

function createEditorTemplate(data) {

  const isEmptyPoint = !data.state.point;
  const eventPoint = isEmptyPoint ? EMPTY_POINT : data.state.point;
  const { basePrice, dateFrom, dateTo, destination, offers, type, isDisabled, isSaving } = eventPoint;

  const destinationItem = destination ? data.pointDestinations.find((dest) => dest.id === destination) : null;
  const offerItems = data.pointOffers
    .find((i) => i.type === type)
    .offers;
  //.filter((off) => offers.includes(off.id));

  const name = destinationItem ? destinationItem.name : '';
  const eventStartDate = formatDateTime(dateFrom, DEFAULT_DATETIME_FORMAT);
  const eventEndDate = formatDateTime(dateTo, DEFAULT_DATETIME_FORMAT);


  const cityList = data.pointDestinations.map((dest) => dest.name);

  const cities = () => cityList.map((city) => `<option value="${city}"></option>`)
    .join(' ');

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            ${createEventTypesListTemplate(type)}
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
            <datalist id="destination-list-1">
               ${cities()}
            </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${eventStartDate}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${eventEndDate}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${he.encode(`${basePrice}`)}">
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''} >
          ${isSaving ? 'Saving...' : 'Save'}
        </button>
        <button class="event__reset-btn" type="reset">
            ${isDisabled ? 'disabled' : ''}${isEmptyPoint ? 'Cancel' : 'Delete'}
        </button>
        <button class="event__rollup-btn" type="button"  ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>
        </header >
    ${createEventDetailsTemplate(offerItems, destinationItem)}
      </form >
    </li > `
  );
}

export default class PointEditView extends AbstractStatefulView {

  #pointDestinations = null;
  #pointOffers = null;
  #onResetClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;

  //de verificat daca trebuie
  #handleRollupClick = null;

  #datepickerFrom = null;
  #datepickerTo = null;
  #type;

  constructor({
    point = EMPTY_POINT,
    pointDestinations,
    pointOffers,
    onSubmitClick,
    onResetClick,
    onDeleteClick,
    onRollupClick,
    type = EditingType.EDITING,
  }) {
    super();

    this._setState(PointEditView.parsePointToState({ point, pointDestinations, pointOffers }));

    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    //de verificat
    this.#handleRollupClick = onRollupClick;

    this.#onResetClick = onResetClick;
    this.#handleFormSubmit = onSubmitClick;
    this.#handleDeleteClick = onDeleteClick;
    this.#type = type;

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers,
      type: this.#type,
    });
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    // this.#handleRollupClick();
  };

  removeElement = () => {
    super.removeElement();
    // this.#datepickers.forEach((datepicker) => datepicker.destroy());

    //verificat, don't repeat yourself
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  };

  //reset point sau event
  //reset = (point) => this.updateElement({ point });
  reset = (point) => {
    this.updateElement(PointEditView.parsePointToState(point));
  };

  _restoreHandlers = () => {
    this.element
      .querySelector('form')
      .addEventListener('submit', this.#submitClickHandler);
    //.addEventListener('submit', this.#handleFormSubmit);
    //this.#handleFormSubmit = onSubmitClick;
    //.addEventListener('submit', this.#handleFormSubmit);

    //aici de vazut atent

    //this.element
    // .querySelectorAll('.event__type-input')
    // .forEach((element) => {
    //   element.addEventListener('change', this.#typeInputClick);
    // });

    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#rollupClickHandler);

    this.element.querySelector('.event__type-list')
      .addEventListener('change', this.#typeInputClick);


    this.element
      .querySelector('.event__reset-btn')
      .addEventListener('click', this.#pointDeleteClickHandler);

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    if (this.#type === EditingType.EDITING) {
      this.element
        .querySelector('.event__rollup-btn')
        .addEventListener('click', this.#resetButtonClickHandler);

      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#pointDeleteClickHandler);
    }

    if (this.#type === EditingType.CREATING) {
      this.element
        .querySelector('.event__reset-btn')
        .addEventListener('click', this.#resetButtonClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputChange);

    this.#setDatepickers();
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  //cu sau fara .point
  #submitClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parsePointToState(this._state.point));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();
    const offerType = evt.target.value;
    this.updateElement({
      point: {
        ...this._state.point,
        type: offerType,
        offers: this._state.pointOffers.find((offer) => offer.type === offerType).offers, // ToDo заполнить офферы
      },
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((pointDestinations) => pointDestinations.name === evt.target.value);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    // this._state.point.destination = selectedDestinationId;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId,
      },
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();
    const checkedBoxes = Array.from(this.element.querySelectorAll('.event__offer-checkbox'));

    /*this._setState({
      offers: checkedBoxes.map((element) => element.dataset.offerId),  */
    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId),
      },
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();
    this._setState({
      point: {
        ...this._state.point,
        basePrice: +evt.target.value,
      },
    });
  };


  /*#dateFromChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateFrom: userDate,
      },
    });
    this.#datepickerTo.set('minDate', this._state.point.dateFrom);
  };*/

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateFrom: userDate, // ToDo заполнить офферы
      },
    });
  };

  /*#dateToChangeHandler = ([userDate]) => {
    this._setState({
      point: {
        ...this._state.point,
        dateTo: userDate,
      },
    });
    this.#datepickerFrom.set('maxDate', this._state.point.dateTo);
  };  */

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      point: {
        ...this._state.point,
        dateTo: userDate, // ToDo заполнить офферы
      },
    });
  };


  #setDatepickers = () => {
    const datePickers = this.element.querySelectorAll('.event__input--time');

    const [dateFromElement, dateToElement] = datePickers;

    this.#datepickerFrom = flatpickr(
      dateFromElement,
      {
        defaultDate: this._state?.point?.dateFrom || new Date(),
        onChange: this.#dateFromChangeHandler,
        enableTime: true,
        /*locale: {
          firstDayOfWeek: 1,
        },*/
        'time_24hr': true,
      },
    );

    this.#datepickerTo = flatpickr(
      dateToElement,
      {
        defaultDate: this._state?.point?.dateTo || new Date(),
        onChange: this.#dateToChangeHandler,
        enableTime: true,
        minDate: this._state?.point?.dateTo ?? new Date(),
        /* locale: {
           firstDayOfWeek: 1,
         }, */
        'time_24hr': true,
      },
    );
  };

  #pointDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(this._state);

  };

  static parsePointToState = (point) => {
    const state = {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };

    return state;
  };
}
