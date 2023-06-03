import { render, RenderPosition} from '../framework/render.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
//import { isEscapeKey } from '../utils/common.js';
import PointPresenter from './point-presenter.js';
import { EmtyListView } from '../view/emty-list-view.js';
import { updateItem } from '../utils/common.js';
import {BoardView} from '../view/board-view.js';

export default class BoardPresenter {

  #boardContainer = null;
  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #points = [];
  #editMoreOptionsComponent = null;

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();

  #pointListComponent = new EventListView();

  #sortComponent = new SortView();
  #noPointComponent = new EmtyListView();
  #boardPoints = [];
  #pointPresenters = new Map();

  constructor({ boardContainer, destinationsModel, offersModel, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
  }

  init() {

    this.#boardPoints = [...this.#pointsModel.points];

    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#boardPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderSort() {
    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {

    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints(from, to) {
    this.#boardPoints
      .slice(from, to)
      .forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #renderEventList() {
    render(this.#pointListComponent, this.#boardComponent.element);
  }

  #renderBoard() {
    render(this.#boardComponent, this.#boardContainer);

    this.#renderSort();
    this.#renderEventList();

  }
}
