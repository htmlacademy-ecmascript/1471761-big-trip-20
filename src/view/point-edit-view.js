import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { humaniseDate, capitalize } from '../utils/point.js';
import { TYPES, BLANK_DESTINATION, BLANK_OFFER } from '../const.js';
import { CITIES } from '../mock/const.js';

function createEmptyPoint() {
  return {
    basePrice: 0,
    dateFrom: new Date(),
    dateTo: new Date(),
    destination: 0,
    offers: [],
    type: 'flight',
  };
}

function createPicturesListTemplate(pictures) {
  return pictures
    .map(({ src, description }) => `<img class="event__photo" src=${src} alt="${description}">`)
    .join('');
}

function createTripTypeTemplate(allOffers, point) {
  return allOffers.map(({ type, id }) =>
    `<div class="event__type-item">
      <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${point.type === type ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${capitalize(type)}</label>
    </div>`).join('');
}

function createOffersTemplate(offers, point) {
  return offers.map(({ title, price, id }) =>
    `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-${id}" type="checkbox" name="event-offer-${title}" ${point.offers.includes(id) ? 'checked' : ''} data-offer-id="${id}">
        <label class="event__offer-label" for="event-offer-${title}-${id}">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`).join('');
}

function createTemplate(state, tripDestinations, allOffers,) {
  const { isEdit, ...point } = state;
  const { basePrice, destination, dateFrom, dateTo, type } = point;
  const { name: descriptionName, description, pictures } = tripDestinations.find((item) => item.id === destination) ?? BLANK_DESTINATION;
  const offerByType = allOffers.find((offer) => offer.type === type) ?? BLANK_OFFER;
  const destinationsOptionValueTemplate = tripDestinations.map((item) => `<option value="${item.name}"></option>`).join('');
  const typeOffers = offerByType.offers;

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
            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>
                ${createTripTypeTemplate(allOffers, point)}
              </fieldset>
            </div>
          </div>
          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
            </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(descriptionName)}" list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${destinationsOptionValueTemplate}
              </datalist>
          </div>
          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'YY/MM/DD HH:mm')}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'YY/MM/DD HH:mm')}">
          </div>
          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="1" value="${basePrice}" required>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
          ${isEdit ? '<button class="event__rollup-btn" type="button">' : ''}
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${typeOffers.length > 0 ?
      `<section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>
            <div class="event__available-offers">
            ${createOffersTemplate(typeOffers, point)}
          </section>`
      : ''
    }
    </section>
    ${descriptionName.length > 0 ?
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${description}</p>
            <div class="event__photos-container">
            <div class="event__photos-tape">
            ${pictures.length > 0 ? createPicturesListTemplate(pictures) : ''}
            </div>
          </div>
          </div>
          </section>`
      : ''
    }
        </section>
      </form>
    </li>`
  );
}

/*function createPointEditViewTemplate({ state, pointDestinations, pointOffers }) {
  const { point } = state;

  return (`<li class="trip-events__item">
 <form class="event event--edit" action="#" method="post">
   <header class="event__header">
     <div class="event__type-wrapper">
       <label class="event__type  event__type-btn" for="event-type-toggle-1">
         <span class="visually-hidden">Choose event type</span>
         <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
       </label>
       <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
       <div class="event__type-list">
         <fieldset class="event__type-group">
           <legend class="visually-hidden">Event type</legend>
           <div class="event__type-item">
             <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
             <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
             <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
             <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
             <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
             <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
             <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
             <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
             <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
           </div>
           <div class="event__type-item">
             <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
             <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
           </div>
         </fieldset>
       </div>
     </div>
     <div class="event__field-group  event__field-group--destination">
       <label class="event__label  event__type-output" for="event-destination-1">
         Flight
       </label>
       <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="Chamonix" list="destination-list-1">
       <datalist id="destination-list-1">
         <option value="Amsterdam"></option>
         <option value="Geneva"></option>
         <option value="Chamonix"></option>
       </datalist>
     </div>
     <div class="event__field-group  event__field-group--time">
       <label class="visually-hidden" for="event-start-time-1">From</label>
       <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="18/03/19 12:25">
       &mdash;
       <label class="visually-hidden" for="event-end-time-1">To</label>
       <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="18/03/19 13:35">
     </div>
     <div class="event__field-group  event__field-group--price">
       <label class="event__label" for="event-price-1">
         <span class="visually-hidden">Price</span>
         &euro;
       </label>
       <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="160">
     </div>
     <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
     <button class="event__reset-btn" type="reset">Delete</button>
     <button class="event__rollup-btn" type="button">
       <span class="visually-hidden">Open event</span>
     </button>
   </header>
   <section class="event__details">
     <section class="event__section  event__section--offers">
       <h3 class="event__section-title  event__section-title--offers">Offers</h3>
       <div class="event__available-offers">
         <div class="event__offer-selector">
           <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
           <label class="event__offer-label" for="event-offer-luggage-1">
             <span class="event__offer-title">Add luggage</span>
             &plus;&euro;&nbsp;
             <span class="event__offer-price">50</span>
           </label>
         </div>
         <div class="event__offer-selector">
           <input class="event__offer-checkbox  visually-hidden" id="event-offer-comfort-1" type="checkbox" name="event-offer-comfort" checked>
           <label class="event__offer-label" for="event-offer-comfort-1">
             <span class="event__offer-title">Switch to comfort</span>
             &plus;&euro;&nbsp;
             <span class="event__offer-price">80</span>
           </label>
         </div>
         <div class="event__offer-selector">
           <input class="event__offer-checkbox  visually-hidden" id="event-offer-meal-1" type="checkbox" name="event-offer-meal">
           <label class="event__offer-label" for="event-offer-meal-1">
             <span class="event__offer-title">Add meal</span>
             &plus;&euro;&nbsp;
             <span class="event__offer-price">15</span>
           </label>
         </div>
         <div class="event__offer-selector">
           <input class="event__offer-checkbox  visually-hidden" id="event-offer-seats-1" type="checkbox" name="event-offer-seats">
           <label class="event__offer-label" for="event-offer-seats-1">
             <span class="event__offer-title">Choose seats</span>
             &plus;&euro;&nbsp;
             <span class="event__offer-price">5</span>
           </label>
         </div>
         <div class="event__offer-selector">
           <input class="event__offer-checkbox  visually-hidden" id="event-offer-train-1" type="checkbox" name="event-offer-train">
           <label class="event__offer-label" for="event-offer-train-1">
             <span class="event__offer-title">Travel by train</span>
             &plus;&euro;&nbsp;
             <span class="event__offer-price">40</span>
           </label>
         </div>
       </div>
     </section>
     <section class="event__section  event__section--destination">
       <h3 class="event__section-title  event__section-title--destination">Destination</h3>
       <p class="event__destination-description">Chamonix-Mont-Blanc (usually shortened to Chamonix) is a resort area near the junction of France, Switzerland and Italy. At the base of Mont Blanc, the highest summit in the Alps, it's renowned for its skiing.</p>
     </section>
   </section>
 </form>
</li>
`);
}
*/

export default class PointEditView extends AbstractStatefulView {
  #point = null;

  #pointDestinations = null;
  #pointOffers = null;

  #onResetClick = null;
  #onSubmitClick = null;
  #onRollupClick = null;

  //#handlerFormSubmit = null;

  constructor({ point = createEmptyPoint(), pointDestinations, pointOffers, onSubmitClick, onResetClick, onResetClick}) {
    super();

    this.#point = point;
    this.#pointDestinations = pointDestinations;
    this.#pointOffers = pointOffers;

    this.#onResetClick = onResetClick;
    this.#onSubmitClick = onSubmitClick;
    this.#onRollupClick = this.#onRollupClick;

    this._setState(PointEditView.parsePointtoState({ point, pointDestinations }));

    this._restoreHandlers();
  }

  get template() {
    return createPointEditViewTemplate({
      state: this._state,
      pointDestinations: this.#pointDestinations,
      pointOffers: this.#pointOffers
    });
  }

  reset = (point) => this.updateElement({ point });

  _restoreHandlers = () => {
    this.element
      .querySelector('.event__rollup-btn')
      .addEventListener('click', this.#resetButtonClickHandler);

    this.element
      .querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);

    this.element
      .querySelectorAll('.event__type-input')
      .forEach((element) => {
        element.addEventListener('change', this.#typeInputClick);
      });

    this.element
      .querySelector('.event__input--destination')
      .addEventListener('change', this.#destinationInputChange);

    const offerBlock = this.element
      .querySelector('.event__available-offers');

    if (offerBlock) {
      offerBlock.addEventListener('change', this.#offerClickHandler);
    }

    this.element
      .querySelector('event__input--price')
      .addEventListener('change', this.#priceInputChange);
  };

  #resetButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onSubmitClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeInputClick = (evt) => {
    evt.preventDefault();

    this.updateElement({
      point: {
        ...this._state.point,
        type: evt.target.value,
        offers: []
      }
    });
  };

  #destinationInputChange = (evt) => {
    evt.preventDefault();

    const selectedDestination = this.#pointDestinations
      .find((pointDestinations) => pointDestinations.name === evt.target);

    const selectedDestinationId = (selectedDestination)
      ? selectedDestination.id
      : null;

    this.updateElement({
      point: {
        ...this._state.point,
        destination: selectedDestinationId
      }
    });
  };

  #offerClickHandler = (evt) => {
    evt.preventDefault();

    const checkedBoxes = Array.from(this.element.querySelectorAll('.e.........'));

    this._setState({
      point: {
        ...this._state.point,
        offers: checkedBoxes.map((element) => element.dataset.offerId)
      }
    });
  };

  #priceInputChange = (evt) => {
    evt.preventDefault();

    this._setState({
      point: {
        ...this._state.point,
        basePrice: evt.target.valueAsNumber
      }
    });
  };


  static parsePointToState = ({ point }) => ({ point });

  static parseStateToPoint = (state) => state.point;

}
