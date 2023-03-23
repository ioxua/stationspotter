import {Assets} from '../utils';

export function useStation(id: string) {
  return Assets.data.stations[id];
}
