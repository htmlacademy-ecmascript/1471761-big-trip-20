import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { Price } from './const.js';
import { getDate } from '../utils/point.js';
import { nanoid } from 'nanoid';

function generatePoint(type, destinationId, offerIds) {
  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInteger(Price.MIN, Price.MAX),
    dateFrom: getDate({ next: false }),
    dateTo: getDate({ next: true }),
    destination: destinationId,
    isFavorite: !!getRandomInteger(0, 1),
    offers: offerIds,
    type
  };
}

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints)
  };
}

export { generatePoint, getRandomPoint };
