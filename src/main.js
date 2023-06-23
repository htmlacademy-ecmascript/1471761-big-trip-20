import { render, RenderPosition} from './framework/render.js';
import NewEventButtonView from './view/new-event-button-view.js';
import BoardPresenter from './presenter/board-presenter.js';


import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import PointsApiService from './point-api-service.js';

import DestinationModel from './model/destination-model.js';
import OffersModel from './model/offers-model.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';

const AUTHORIZATION = 'Basic hS7cfS74wdt1se2d';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';


const mainBodyElement = document.querySelector('.page-body');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const siteBodyElement = mainBodyElement.querySelector('.trip-events');
//const eventListElement = mainElement.qyerySelector('.trip-events');
//mainElement = bodyElement.querySelector('.page-main');


async function run() {

  const pointApiService = new PointsApiService(END_POINT, AUTHORIZATION);
  await pointApiService.init();
  const destinationsModel = new DestinationModel(pointApiService);
  const offersModel = new OffersModel(pointApiService);

  const pointsModel = new PointsModel({
    service: pointApiService,
    destinationsModel,
    offersModel
  });
  const filterModel = new FilterModel();

  const boardPresenter = new BoardPresenter({
    container: siteBodyElement,
    destinationsModel,
    offersModel,
    pointsModel,
    filterModel,
    onNewPointDestroy: handleNewPointFormClose
  });

  const filterPresenter = new FilterPresenter({
    filterContainer: filterElement,
    pointsModel,
    filterModel
  });

  destinationsModel.init();
  offersModel.init();
  pointsModel.init();
  filterPresenter.init();
  boardPresenter.init();

  const newPointButtonComponent = new NewEventButtonView({
    onClick: handleNewPointButtonClick
  });

  function handleNewPointFormClose() {
    newPointButtonComponent.element.disabled = false;
  }

  function handleNewPointButtonClick() {
    boardPresenter.createPoint();
    newPointButtonComponent.element.disabled = true;
  }

  render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
  render(newPointButtonComponent, tripInfoElement);
}

run();

