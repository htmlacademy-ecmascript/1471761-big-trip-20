import AbstractView from '../framework/view/abstract-view.js';
import { capitalize } from '../utils.point.js';

function createFilterItemTemplate(filter) {

  return `
        <input
         id="filter-${filter.type}"
         class="trip-filters__filter-input  visually-hidden"
         type="radio"
         name="trip-filter"
          value="${filter.type}"
         ${(filter.hasPoints) ? '' : 'disabled'}
          />
        <label
        class="trip-filters__filter-label"
        for="filter-${filter.type}"
        >
        ${capitalize(filter.type)}
        </label>
      </div>
      `;
}

function createFilterTemplate(filterItems) {

  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter)
      .join(''));

  return (
    `<div class="trip-filters__filter">
      ${filterItemsTemplate}
    </div>`
  );
}
/*
     <form class="trip-filters" action="#" method="get">
  ${filters.map(createFilterItemTemplate).join('')}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>)

*/

//export { createFilterViewTemplate };

export default class FilterView extends AbstractView {
  #filters = null;

  constructor({filters}) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
