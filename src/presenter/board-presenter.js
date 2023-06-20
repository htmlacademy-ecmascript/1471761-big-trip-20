import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';
import { render, remove, replace, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { sort } from '../utils/sort.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { filter } from '../utils/filter.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import LoadingView from '../view/loading-view.js';

export default class BoardPresenter {
  #container = null;
  #newPointButtonContainer = null;

  #eventListComponent = new EventListView();

  #datepicker = null;
  #emptyListComponent = null;
  #newPointButton = null;
  #sortComponent = null;


  #destinationsModel = null;
  #offersModel = null;
  #pointsModel = null;
  #filterModel = null;
  #isLoading = true;

  #loadingComponent = new LoadingView();
  #isCreating = false;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      container: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#newPointDestroyHandler
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    const filterType = this.#filterModel.filter;

    const filteredPoints = filter[filterType](this.#pointsModel.points);
    if (!sort[this.#currentSortType]) {
      //  debugger;
    }
    return sort[this.#currentSortType ?? 'day'](filteredPoints);

  }

  init() {
    this.#newPointButton = new NewEventButtonView({ onClick: this.#newPointButtonClickHandler });
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
    this.points.forEach((point) => this.#renderPoint(point));
  };


  #clearPoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#newPointPresenter.destroy();
  };

  #renderPointsList() {
    render(this.#eventListComponent, this.#container);
  }


  #renderSort = () => {
    const prevSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({
      sortType: this.#currentSortType,
      onSortTypeChange: this.#sortTypeChangeHandler
    });

    if (prevSortComponent) {
      replace(this.#sortComponent, prevSortComponent);

    } else {
      render(this.#sortComponent, this.#container);
    }
  };

  #renderLoading() {
    render(this.#loadingComponent, this.#container, RenderPosition.AFTERBEGIN);
    //this.#boardComponent.element
  }

  #renderNoTripPoints() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#emptyListComponent, this.#container);
  }

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.update(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.add(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.delete(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id)?.init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({ resetSortType: true });
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  };

  #sortTypeChangeHandler = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearPoints();
    this.#renderSort();
    this.#renderPoints();
  };

  #clearBoard = ({ resetSortType = false } = {}) => {

    this.#clearPoints();
    //remove(this.#messageComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }

    if (this.#loadingComponent) {
      remove(this.#loadingComponent);
    }
  };

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.points.length === 0 && !this.#isCreating) {
      this.#renderNoTripPoints();
      return;
    }

    this.#renderSort();
    this.#renderPointsList();
    this.#renderPoints();
  };

  #modeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#newPointPresenter.destroy();
  };

  #newPointButtonClickHandler = () => {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.set(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#newPointButton.setDisable(true);
    this.#newPointPresenter.init();
  };

  #newPointDestroyHandler = (isCanceled) => {
    this.#isCreating = false;
    this.#newPointButton.setDisable(false);

    if (isCanceled && this.points.length === 0) {
      this.#renderNoTripPoints();
    }
    remove(this.#sortComponent);
    this.#sortComponent = null;
    this.#renderNoTripPoints();
  };

}
