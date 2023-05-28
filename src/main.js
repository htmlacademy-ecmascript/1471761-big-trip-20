import { render, RenderPosition } from './render.js';

import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';

import MockService from './service/mock-service.js';
import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
//import { filter } from './utils/filter.js';
import { generateFilters } from './mock/filter.js';

const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const eventListElement = mainElement.querySelector('.trip-events');

const mockService = new MockService();
const destinationsModel = new DestinationModel(mockService);
const offersModel = new OffersModel(mockService);
const pointsModel = new PointsModel(mockService);

const filterPresenter = new FilterPresenter({
  container: filterElement,
  pointsModel
});

const boardPresenter = new BoardPresenter({
  container: eventListElement,
  destinationsModel,
  offersModel,
  pointsModel
});

const filters = generateFilters(pointsModel.points);

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
// render new FilterView?
render(new FilterView(filters), filterElement, RenderPosition.AFTERBEGIN);

filterPresenter.init();
boardPresenter.init();
