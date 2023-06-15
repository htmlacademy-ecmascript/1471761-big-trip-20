//import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';

import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/board-view.js';

import { SortType, DEFAULT_SORT_TYPE, UpdateType, UserAction } from '../const.js';
//import { sort } from '../utils/sort.js';
import { sortByDay, sortByPrice, sortByDurationTime } from '../utils/point.js';

export default class BoardPresenter {

  #datepicker = null;
  #container = null;

  #sortComponent = null;
  #eventListComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;


  #currentSortType = SortType[DEFAULT_SORT_TYPE];


  #noPointComponent = new EmptyListView();

  #pointPresenters = new Map();

  constructor({ container, destinationsModel, offersModel, pointsModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;

    //this.#pointsModel = sort[SortType.DAY]([...this.#pointsModel.get()]);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortByDurationTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortByPrice);
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortByDay);
    }

    return this.#pointsModel.points;
  }

  init() {
    this.#renderBoard();
  }

  #renderPoint = (point) => {

    const pointPresenter = new PointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onChangeMode: this.#modeChangeHandler
    });

    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  };


  #renderPoints = () => {
    this.#pointsModel.forEach((point) => {
      this.#renderPoint(point);
    });
  };

  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  };

  #renderSort = (container) => {

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortComponent, container, RenderPosition.AFTERBEGIN);
  };

  #renderPointContainer = () => {
    //this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#container);
  };


  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deleteTask(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderBoard();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };


  #clearBoard({ resetSortType = false } = {}) {

    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    //remove(this.#noTaskComponent);


    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }

  }


  #renderBoard = () => {
    this.#renderSort();
    render(this.#eventListComponent, this.#container.element);
    this.points.forEach((point) => this.#renderPoint(point));
  };
}
