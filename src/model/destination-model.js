export default class DestinationModel {
  #destinations = [];
  #service = null;

  constructor(service) {
    this.service = service;
  }

  async init() {
    this.#destinations = await this.#service.getDestinations();
    return this.#destinations;
  }

  get() {
    return this.destinations;
  }

  getById(id) {
    return this.#destinations
      .find((destination) => destination.id === id);
  }
}
