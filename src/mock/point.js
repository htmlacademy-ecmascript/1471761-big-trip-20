/*import { mockDestinations } from './destination.js';

const mockRoutePoints = [
  {
    id: '1',
    basePrice: 1100,
    dateFrom: new Date('2025-07-10T22:55:56.845Z'),
    dateTo: new Date('2025-07-11T11:22:13.375Z'),
    destination: mockDestinations[0].id,
    isFavorite: false,
    offers: ['1'],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: 1200,
    dateFrom: new Date('2019-03-10T22:55:56.845Z'),
    dateTo: new Date('2019-04-11T11:22:13.375Z'),
    destination: mockDestinations[1].id,
    isFavorite: true,
    offers: ['1', '2'],
    type: 'flight'
  },
  {
    id: '3',
    basePrice: 500,
    dateFrom: new Date('2019-05-11T22:54:56.845Z'),
    dateTo: new Date('2019-05-12T11:22:13.375Z'),
    destination: mockDestinations[2].id,
    isFavorite: false,
    offers: ['2'],
    type: 'check-in'
  },

];

export { mockRoutePoints };
*/

import { getRandomArrayElement, getRandomInteger } from '../utils/common.js';
import { Price } from './const.js';
import { getDate } from '../mock/utils.js';
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

const mockPoints = [
  {
    id: '1',
    basePrice: 11,
    dateFrom: '2024-09-08T02:05:16.735Z',
    dateTo: '2024-09-13T14:23:08.155Z',
    destination: '1',
    isFavorite: false,
    offers: ['11', '1111'],
    type: 'bus',
  },
  {
    id: '2',
    basePrice: 22,
    dateFrom: '2023-05-14T12:22:10.001Z',
    dateTo: '2023-05-15T14:40:10.235Z',
    destination: '2',
    isFavorite: true,
    offers: ['333', '3333'],
    type: 'train',
  },
  {
    id: '3',
    basePrice: 33,
    dateFrom: '2020-12-01T01:00:00.000Z',
    dateTo: '2020-12-02T11:10:20.080Z',
    destination: '3',
    isFavorite: false,
    offers: ['444'],
    type: 'flight',
  },
  {
    id: '4',
    basePrice: 44,
    dateFrom: '2022-10-08T02:05:16.735Z',
    dateTo: '2022-10-13T14:23:08.155Z',
    destination: '4',
    isFavorite: false,
    offers: ['5', '5555', '55555'],
    type: 'drive',
  },
  {
    id: '5',
    basePrice: 55,
    dateFrom: '2022-09-08T02:05:16.735Z',
    dateTo: '2022-09-13T14:23:08.155Z',
    destination: '5',
    isFavorite: false,
    offers: ['66'],
    type: 'sightseeing',
  },
  {
    id: '6',
    basePrice: 66,
    dateFrom: '2022-07-08T02:05:16.735Z',
    dateTo: '2022-07-13T14:23:08.155Z',
    destination: '6',
    isFavorite: true,
    offers: [],
    type: 'restaurant',
  },
  {
    id: '7',
    basePrice: 77,
    dateFrom: '2022-02-08T02:05:16.735Z',
    dateTo: '2022-02-13T14:23:08.155Z',
    destination: '7',
    isFavorite: false,
    offers: ['200'],
    type: 'check-in',
  },
  {
    id: '8',
    basePrice: 88,
    dateFrom: '2021-02-08T02:05:16.735Z',
    dateTo: '2021-02-13T14:23:08.155Z',
    destination: '8',
    isFavorite: true,
    offers: ['500'],
    type: 'taxi',
  },
  {
    id: '9',
    basePrice: 99,
    dateFrom: '2023-02-08T02:05:16.735Z',
    dateTo: '2023-02-13T14:23:08.155Z',
    destination: '9',
    isFavorite: false,
    offers: ['007'],
    type: 'ship',
  },
];

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints)
  };
}

export { generatePoint, getRandomPoint };

