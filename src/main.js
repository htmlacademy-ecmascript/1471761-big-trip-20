import { render, RenderPosition } from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';

import BoardPresenter from './presenter/board-presenter.js';

import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';

import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';


const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const siteHeaderElement = document.querySelector('.trip-controls');

const destinationsModel = new DestinationModel();
const offersModel = new OffersModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const boardPresenter = new BoardPresenter({
  container: mainElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: mainElement,
  filterModel,
  pointsModel
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new NewEventButtonView(), siteHeaderElement);

filterPresenter.init();
boardPresenter.init();
