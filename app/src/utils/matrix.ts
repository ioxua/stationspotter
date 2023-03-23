import type {Matrix4, Transforms3d, Vec3} from 'react-native-redash';
import {multiply4, processTransform3d} from 'react-native-redash';

/**
 * @see https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/MatrixHelpers.ts
 */
export const vec3 = (x: number, y: number, z: number) => [x, y, z] as const;

/**
 * @see https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/MatrixHelpers.ts
 */
export const transformOrigin3d = (
  origin: Vec3,
  transform: Transforms3d,
): Transforms3d => {
  'worklet';
  return [
    {translateX: origin[0]},
    {translateY: origin[1]},
    {translateZ: origin[2]},
    ...transform,
    {translateX: -origin[0]},
    {translateY: -origin[1]},
    {translateZ: -origin[2]},
  ];
};

/**
 * @see https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/MatrixHelpers.ts
 */
export const concat = (m: Matrix4, origin: Vec3, transform: Transforms3d) => {
  'worklet';
  return multiply4(m, processTransform3d(transformOrigin3d(origin, transform)));
};
