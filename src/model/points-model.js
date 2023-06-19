import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class PointsModel extends Observable {
  #points = [];
  #service = null;
  #destinationModel = null;
  #offersModel = null;

  constructor(service, destinationsModel, offersModel) {
    super();
    this.#service = service;
    //this.#points = this.#service.getPoints();
    this.#destinationModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  async init() {
    try {
      await Promise.all([
        this.#destinationModel.init(),
        this.#offersModel.init()
      ]);
      const points = await this.#service.getPoints();
      this.#points = points.map(adaptToClient);
      this._notify(UpdateType.INIT, { isError: false });
    } catch {
      this.#points = [];
      this._notify(UpdateType.INIT, { isError: true });
    }
  }

  get() {
    return this.#points;
  }

  getById(id) {
    return this.#points
      .find((point) => point.id === id);
  }

  update(updateType, update) {
    this.#points = this.#service.updatePoints(update);
    this._notify(updateType, update);
  }

  add(updateType, point) {
    this.#points = this.#service.addPoints(point);
    this._notify(updateType, point);
  }

  deletePoint(updateType, point) {
    this.#points = this.#service.deletePoints(point);
    this._notify(updateType, point);
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


