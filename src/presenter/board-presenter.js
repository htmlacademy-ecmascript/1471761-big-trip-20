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
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};


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
  #isLoading = false;

  #loadingComponent = new LoadingView();
  #isCreating = false;

  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #onNewPointClose = null;
  #pointPresenters = new Map();
  #newPointPresenter = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({ container, destinationsModel, offersModel, pointsModel, filterModel, onNewPointDestroy }) {
    this.#container = container;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#onNewPointClose = onNewPointDestroy;

    this.#newPointPresenter = new NewPointPresenter({
      eventListContainer: this.#eventListComponent.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onDataChange: this.#handleViewAction,
      onClose: this.#closeNewPoint,
    });


    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {

    const filterType = this.#filterModel.filter;

    const filteredPoints = filter[filterType](this.#pointsModel.points);

    return sort[this.#currentSortType ?? 'day'](filteredPoints);

  }

  init() {
    this.#newPointButton = new NewEventButtonView({ onClick: this.#newPointButtonClickHandler });
    this.#renderBoard();
  }

  createPoint() {
    this.#isCreating = true;
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#modeChangeHandler();
    this.#newPointPresenter.init();
  }

  #closeNewPoint = () => {
    this.#isCreating = false;
    this.#onNewPointClose();
    if (!this.points.length) {
      this.#renderNoTripPoints();
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  };


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
  }

  #renderNoTripPoints() {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#filterType
    });
    render(this.#emptyListComponent, this.#container);
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {

          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);


    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }

    if (this.#emptyListComponent) {
      remove(this.#emptyListComponent);
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
