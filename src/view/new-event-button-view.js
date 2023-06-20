import AbstractView from '../framework/view/abstract-view.js';

function createNewEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>';
}

export default class NewEventButtonView extends AbstractView {
  #onNewPointButtonClick = null;

  constructor({onClick}) {
    super();
    this.#onNewPointButtonClick = onClick;
    this.element.addEventListener('click', this.#onNewPointButtonClick);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  showNewEventForm = (evt) => {
    evt.preventDefault();
    this.#onNewPointButtonClick();
  };

}
