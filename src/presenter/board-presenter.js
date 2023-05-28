import { render, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import { isEscapeKey } from '../utils/common.js';
//import { POINT_COUNT } from '../const.js';


export default class BoardPresenter {

  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];
  #editMoreOptionsComponent = null;

  #eventListComponent = new EventListView();
  #sortComponent = new SortView();

  constructor({ boardContainer, pointsModel, destinationsModel, offersModel }) {
    this.#boardContainer = boardContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#points = [...this.#pointsModel.get()];
  }

  init() {

    render(this.#sortComponent, this.#boardContainer);
    render(this.#eventListComponent, this.#boardContainer);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (isEscapeKey) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListner('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new WaypointView({
      point,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new PointEditView({
      point,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#eventListComponent.element);
  }
}

