import { render } from '../render.js';
import EventListView from '../view/event-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import { POINT_COUNT } from '../const.js';

export default class BoardPresenter {

  eventListComponent = new EventListView();
  sortComponent = new SortView();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    render(new PointEditView(), this.eventListComponent.getElement());

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new WaypointView(), this.eventListComponent.getElement());
    }
  }
}
