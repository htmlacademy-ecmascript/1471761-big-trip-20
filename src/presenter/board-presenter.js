import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';


import { render, remove, replace } from '../framework/render.js';
import EmptyListView from '../view/board-view.js';
import { updateItem } from '../utils/common.js';
import BoardView from '../view/board-view.js';
import { SortType } from '../const.js';
import { sort } from '../utils/sort.js';


export default class BoardPresenter {

  #boardContainer = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;

  #points = [];

  #boardComponent = new BoardView();
  #eventListComponent = new EventListView();

  #pointListComponent = new EventListView();

  #sortComponent = null;
  #noPointComponent = new EmptyListView();

  #boardPoints = [];
  #handleDataChange = null;

  #pointPresenters = new Map();

  #currentSortType = SortType.Day;

  constructor({ boardContainer, destinationsModel, offersModel, pointsModel }) {
    this.#boardContainer = boardContainer;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    this.#points = sort[SortType.DAY]([...this.#pointsModel.get()]);
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter({
      boardContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleDataChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };


  #sortPoints = (sortType) => {
    this.#currentSortType = sortType;
    this.#points = sort[this.#currentSortType](this.#points);
  };

  #renderPoints = () => {
    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardPoints = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #clearPointList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };


  #sortTypeChangeHandler = (sortType) => {
    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderSort(this.#boardContainer);
    this.#renderPoints();
  };

  #renderSort = (boardContainer) => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {
      render(this.#sortComponent, boardContainer);
    }
  };

  #renderPointContainer = () => {
    this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#boardComponent);
  };

  #renderBoard = () => {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#boardContainer);
      return;
    }

    this.#renderSort(this.#boardContainer);
    this.#renderPointContainer();
    this.#renderPoints();
  };

}
