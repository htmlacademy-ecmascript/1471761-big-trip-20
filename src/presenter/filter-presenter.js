import FilterView from '../view/filter-view.js';
import { render, replace, remove } from '../framework/render.js';
import { filter } from '../utils/filter.js';
import { UpdateType } from '../const.js';


export default class FilterPresenter {
  #filterContainer = null;

  #pointsModel = null;
  #filterModel = null;

  #filterComponent = null;
  #currentFilter = null;

  constructor({ filterContainer, pointsModel, filterModel}) {
    this.#filterContainer = filterContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }


  get filters() {
    const points = this.#pointsModel.get();

    return Object.entries(filter)
      .map(([filterType, filterPoints]) => ({
        type: filterType,
        //hasPoints: filterPoints(points).length > 0
        count: filter[type](points).length
      }));
  }

  init() {
    this.#currentFilter = this.#filterModel.get();
    //const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilter: this.#currentFilter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.set(UpdateType.MAJOR, filterType);
  };
}
