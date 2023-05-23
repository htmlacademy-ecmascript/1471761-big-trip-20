import { render, replace } from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import WaypointView from '../view/waypoint-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';

//import { POINT_COUNT } from '../const.js';


export default class BoardPresenter {

  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];

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

  #renderPoint = (point) => {
    const pointComponent = new WaypointView({
      point,
      pointDestinations: this.#destinationsModel.getByID(point.destination),
      pointOffers: this.#offersModel.getByType(point.type),
      onEditClick: pointEditClickHandler,
    });

    const pointEditComponent = new PointEditView({
      point,
      pointDestinations: this.#destinationsModel.get(),
      pointOffers: this.#offersModel.get(),
      onResetClick: resetButtonClickHandler,
      //onSubmitClick: pointSubmitHandler,
    });

    const replacePointToForm = () => {
      replace(pointEditComponent, pointComponent);
    };

    const replaceFormToPoint = () => {
      replace(pointComponent, pointEditComponent);
    };

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceFormToPoint();
        document.moveEventListner('keydown', escKeyDownHandler);
      }
    };

    function pointEditClickHandler() {
      replacePointToForm();
      document.addEventListener('keydown', escKeyDownHandler);
    }

    function resetButtonClickHandler() {
      replaceFormToPoint();
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    //function resetButtonClickHandler() {
    //  replaceFormToPoint();
    // document.removeEventListener('keydown', escKeyDownHandler);
    //}

    render(pointComponent, this.#eventListComponent.element);
  };
}
