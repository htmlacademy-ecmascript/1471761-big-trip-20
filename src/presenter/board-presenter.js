import { render } from '../render.js';

import NewEventButtonView from '../view/new-event-button-view.js';
import EventListView from '../view/event-list-view.js';
import WaypointView from '../view/waypoint-view.js';

import POINT_COUNT from '../const.js';

export default class BoardPresenter {
  waypointListContainer = new EventListView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.waypointListContainer, this.container);
    render(new NewEventButtonView(), this.waypointListContainer.getElement);

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new WaypointView(), this.waypointListContainer.getElement());
    }
  }
}
