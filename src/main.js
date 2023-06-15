import { render, RenderPosition } from './framework/render.js';

import BoardPresenter from './presenter/board-presenter.js';

import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';

import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';


const filters = [
  {
    type: 'everything',
    count: 0,
  },
];

const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');

const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: mainElement,
  destinationsModel,
  offersModel,
  pointsModel
});


render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);

render(new FilterView({
  filters,
  currentFilterType: 'all',
  onFilterTypeChange: () => { }
}), mainElement);

boardPresenter.init();
