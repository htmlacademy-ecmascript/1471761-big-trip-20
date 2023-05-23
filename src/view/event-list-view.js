import AbstractView from '../framework/view/abstract-view.js';

function createEventListTemplate() {
  return '<ul class="trip-events-list"></ul>';
}

export default class EventListView extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}
