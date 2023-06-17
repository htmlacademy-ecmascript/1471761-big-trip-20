import { getRandomArrayElement } from '../utils/common.js';
import { CITIES, DESCRIPTION } from './const.js';

const mockDestinations = [
  {
    id: '1',
    description: getRandomArrayElement(DESCRIPTION),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=35',
        description: getRandomArrayElement(DESCRIPTION)
      },
      {
        src: 'https://loremflickr.com/248/152?random=45',
        description: getRandomArrayElement(DESCRIPTION)
      }
    ]
  },
  {
    id: '2',
    description: getRandomArrayElement(DESCRIPTION),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=45',
        description: getRandomArrayElement(DESCRIPTION)
      },
      {
        src: 'https://loremflickr.com/248/152?random=12',
        description: getRandomArrayElement(DESCRIPTION)
      }
    ]
  },
  {
    id: '3',
    description: getRandomArrayElement(DESCRIPTION),
    name: getRandomArrayElement(CITIES),
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=11',
        description: getRandomArrayElement(DESCRIPTION)
      },
      {
        src: 'https://loremflickr.com/248/152?random=1',
        description: getRandomArrayElement(DESCRIPTION)
      }
    ]
  },
];


/*function generateDestination() {
  const city = getRandomValue(CITIES);

  return {
    id: crypto.randomUUID(),
    name: city,
    description: DESCRIPTION,
    pictures: [
      {
        'src': ` https://loremflickr.com/300/200?random=${crypto.randomUUID()}`,
        'description': `${city} description`
      }
    ]
  };
}
export { generateDestination };
*/
export {mockDestinations};
