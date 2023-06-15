//import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';

import { render, remove, replace, RenderPosition } from '../framework/render.js';
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
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);
      remove(prevSortComponent);
    } else {

      render(this.#sortComponent, container, RenderPosition.AFTERBEGIN);
    }
  };

  #renderPointContainer = () => {
    //this.#eventListComponent = new EventListView();
    render(this.#eventListComponent, this.#container);
  };

  #renderBoard = () => {

    if (this.#pointsModel.length === 0) {
      render(this.#eventListComponent, this.#container);
      return;
    }

    this.#renderSort(this.#container);
    this.#renderPointContainer();
    this.#renderPoints();
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
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPoints();
    this.#renderSort(this.#container);
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}


/*#renderMessage() {
  this.#messageComponent = new MessageView({filterType: this.#filterModel.get()});
  render(this.#messageComponent, this.#container);
}

#renderPointsList() {
  render(this.#pointsListComponent, this.#container);
}

#renderBoard = () => {

    if (this.#points.length === 0 && !this.#isCreating) {
      this.#renderMessage();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  };


  #clearBoard = ({resetSortType = false} = {}) => {
    this.#clearPoints();
    remove(this.#messageComponent);

  if (resetSortType) {
    this.#currentSortType = SortType.DAY;
  }
  };


#viewActionHandler =(actionType, updateType, update) => {
  switch (actionType) {
    case
  }
}


*/
