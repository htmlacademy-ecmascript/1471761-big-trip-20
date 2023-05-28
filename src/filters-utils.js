import { FilterType } from './const.js';


const filter = {
  [FilterType.EVERYTHING]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.FUTURE]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.PRESENT]: (points) => points.filter((point) => !point.isArchive),
  [FilterType.PAST]: (points) => points.filter((point) => !point.isArchive),
};

export { filter };
