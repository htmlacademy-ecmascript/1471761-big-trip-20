import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';

import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/board-view.js';

import { SortType, DEFAULT_SORT_TYPE, UpdateType, UserAction, FilterType } from '../const.js';
import { sortByDay, sortByPrice, sortByDurationTime } from '../utils/sort.js';
import BoardView from '../view/board-view.js';
import { filter } from '../utils/filter.js';

export default class BoardPresenter {

  #boardContainer = null;
  #boardComponent = new BoardView();
  #pointListComponent = new EventListView();

  #datepicker = null;
  #container = null;

  #sortComponent = null;
  #noPointComponent = null;
  #eventListComponent = null;

  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;

  #pointPresenters = new Map();
  #currentSortType = SortType[DEFAULT_SORT_TYPE];
  #filterType = FilterType.EVERYTHING;

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByDurationTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SortType.DAY:
        return filteredPoints.sort(sortByDay);
    }


    return filteredPoints;

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


  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderNoPoints() {
    this.#noPointComponent = new EmptyListView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderSort = () => {

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    render(this.#sortComponent, this.#boardComponent.element, RenderPosition.AFTERBEGIN);
  };

  #renderPointContainer = () => {
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

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }

  #renderBoard = () => {
    this.#renderSort();

    render(this.#boardComponent, this.#container);
    this.points.forEach((point) => this.#renderPoint(point));
  };

}
