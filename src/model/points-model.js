import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #pointsApiService = null;
  //#service = null;
  //#destinationModel = null;
  //#offersModel = null;

  constructor({ service }) {
    super();
    this.#pointsApiService = service;
    //this.#service = service;
    //this.#points = this.#service.getPoints();
    //this.#destinationModel = destinationsModel;
    //this.#offersModel = offersModel;
  }

  get points() {
    return this.#points;
  }

  async init() {
    //debugger;
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      console.log(err);
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting trip point');
    }
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update trip point');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addpoint(update);
      const newTripPoint = this.#adaptToClient(response);
      this.#points = [newTripPoint, ...this.#points];
      this._notify(updateType, newTripPoint);
    } catch (err) {
      throw new Error('Can\'t add trip point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (err) {
      throw new Error('Can\'t delete trip point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['repeating_days'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };


    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  static isFilled(point) {
    return point.basePrice && point.dateFrom && point.dateTo && point.destination;

  }

}


