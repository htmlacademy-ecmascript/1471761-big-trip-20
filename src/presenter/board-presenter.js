import { render} from '../render.js';

//import NewEventButtonView from '../view/new-event-button-view.js';
import EventListView from '../view/event-list-view.js';
import WaypointView from '../view/waypoint-view.js';

//import TripPointView from '../view/trip-point-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';

import POINT_COUNT from '../const.js';

export default class BoardPresenter {
  //waypointListContainer = new EventListView();

  eventListComponent = new EventListView();
  sortComponent = new SortView();


  constructor({ container }) {
    this.container = container;
  }

  init() {
    //render(this.waypointListContainer, this.container);
    //render(new NewEventButtonView(), this.waypointListContainer.getElement);
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    render(new PointEditView(), this.eventListComponent.getElement());

    for (let i = 0; i < POINT_COUNT; i++) {
      render(new WaypointView(), this.eventListComponent.getElement());
    }
  }
}
