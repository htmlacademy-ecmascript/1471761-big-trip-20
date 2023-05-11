import {render, RenderPosition} from '../render.js';
import TripInfoView from '../view/trip-info-view.js';

export default class TripInfoPresenter {
  tripInfoComponent = new TripInfoView();

  constructor({tripInfoContainer: tripInfoContainer}) {
    this.tripInfoContainer = tripInfoContainer;
  }

  init() {
    render(this.tripInfoComponent, this.tripInfoContainer, RenderPosition.AFTERBEGIN);
  }
}
