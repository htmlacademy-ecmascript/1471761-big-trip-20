/*
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';


import TripInfoPresenter from './presenter/trip-info-presenter.js';

const siteHeaderElement = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({ boardContainer: contentContainer });

const tripInfoPresenter = new TripInfoPresenter({tripInfoContainer: siteHeaderElement});

render(new FilterView(), filtersContainer);
render(new SortView(), contentContainer);


boardPresenter.init();
tripInfoPresenter.init();
*/


//import TripEventsListPresenter from './presenter/trip-events-list-presenter.js';
//import FilterPresenter from './presenter/filter-presenter.js';
//import TripInfoPresenter from './presenter/trip-info-presenter.js';

import { render, RenderPosition } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';


/* const siteHeaderElement = document.querySelector('.trip-main');
const filterElement = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripInfoPresenter = new TripInfoPresenter({tripInfoContainer: siteHeaderElement});
const filterPresenter = new FilterPresenter({filterContainer: filterElement});
const tripEventsListPresenter = new TripEventsListPresenter({tripEventsListContainer: tripEventsElement});
*/

const mainElement = document.querySelector('.page-main');
const headerElement = document.querySelector('.page-header');
const tripInfoElement = headerElement.querySelector('.trip-main');
const filterElement = tripInfoElement.querySelector('.trip-controls__filters');
const eventListElement = mainElement.querySelector('.trip-events');

const boardPresenter = new BoardPresenter({
  container: eventListElement
});

render(new TripInfoView(), tripInfoElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterElement, RenderPosition.AFTERBEGIN);

//tripInfoPresenter.init();
//filterPresenter.init();
//tripEventsListPresenter.init();
boardPresenter.init();
