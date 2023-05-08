import { render } from './render.js';
import FilterView from './view/filter-view.js';
import SortView from './view/sort-view.js';
import BoardPresenter from './presenter/board-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const contentContainer = document.querySelector('.trip-events');
const boardPresenter = new BoardPresenter({ boardContainer: contentContainer });

render(new FilterView(), filtersContainer);
render(new SortView(), contentContainer);

boardPresenter.init();
