import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = [];
  #offersModel = null;
  #destinationsModel = null;
  #service = null;


  constructor({service, offersModel, destinationsModel}) {
    super();
    this.#service = service;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
  }

  get points() {
    return this.#points;
  }
}
