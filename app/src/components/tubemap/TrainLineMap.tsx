import {
  LayoutChangeEvent,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import {useStation} from '../../hooks';
import {
  Canvas,
  Circle,
  vec,
  RoundedRect,
  rect,
  useValue,
  useComputedValue,
  Fill,
  Group,
  Transforms2d,
  SkiaMutableValue,
  SkMatrix,
  SkRect,
  Skia,
  useSharedValueEffect,
} from '@shopify/react-native-skia';
import {
  GestureDetector,
  Gesture,
  PinchGesture,
  PanGesture,
  ComposedGesture,
} from 'react-native-gesture-handler';
import Animated, {
  AnimatedStyleProp,
  SharedValue,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from 'react-native-reanimated';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Matrix4, multiply4, toMatrix3, identity4} from 'react-native-redash';
import {concat, vec3} from '../../utils/matrix';

export type LineMapProps = {
  id: string;
  width: number;
  height: number;
};

// from https://docs.swmansion.com/react-native-gesture-handler/docs/api/gestures/pinch-gesture
const usePinchGesture = (): [PinchGesture, SharedValue<number>] => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const gesture = Gesture.Pinch()
    .onUpdate(e => {
      console.log('scale', e.scale);
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  return [gesture, scale];
};

const usePanGesture = (
  width: number,
  height: number,
): [PanGesture, SharedValue<number>, SharedValue<number>] => {
  const translateX = useSharedValue(width / 2);
  const translateY = useSharedValue(height / 2);

  const gesture = Gesture.Pan()
    .onChange(e => {
      // console.log('panning to', e.changeX, e.changeY);
      translateX.value += e.changeX;
      translateY.value += e.changeY;
    })
    .onEnd(e => {
      translateX.value = withDecay({
        velocity: e.velocityX,
        clamp: [0, width],
      });
    });

  return [gesture, translateX, translateY];
};

/**
 * @see https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/bonuses/sticker-app/src/GestureHandler.tsx
 */
const useMapInteractions = ({
  matrix: skMatrix,
  dimensions,
  debug,
}: {
  matrix: SkiaMutableValue<SkMatrix>;
  dimensions: SkRect;
  debug?: boolean;
}): [ComposedGesture, AnimatedStyleProp<ViewStyle> | undefined] => {
  const {x, y, width, height} = dimensions;
  const origin = useSharedValue(vec3(0, 0, 0));
  const matrix = useSharedValue(identity4);
  const offset = useSharedValue(identity4);

  // matrix.

  // const toSkMatrix = (v: Matrix4): SkMatrix => {

  // }

  // useSharedValueEffect(() => {
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   skMatrix.current = Skia.Matrix(toMatrix3(matrix.value) as any);
  // }, matrix);

  // useAnimatedReaction(
  //   () => matrix.value * 2,
  //   (c, p) => {r
  //     if (c !== p) {
  //       console.log('updating skmatrix', c, p);
  //       // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //       skMatrix.current = Skia.Matrix(toMatrix3(matrix.value) as any);
  //     }
  //   },
  //   [matrix],
  // );

  // useDerivedValue(() => {
  //   console.log('updating skmatrix');
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   skMatrix.current = Skia.Matrix(toMatrix3(matrix.value) as any);
  // }, []);

  const pan = Gesture.Pan().onChange(e => {
    const matrix = Skia.Matrix();
    matrix.translate(e.changeX, e.changeY);
    skMatrix.current.concat(matrix);

    // matrix.value = multiply4(
    //   Matrix4.translate(e.changeX, e.changeY, 0),
    //   matrix.value,
    // );
  });

  const pinch = Gesture.Pinch()
    .onBegin(e => {
      origin.value = [e.focalX, e.focalY, 0];
      offset.value = matrix.value;
    })
    .onChange(e => {
      const matrix = Skia.Matrix();
      matrix.scale(e.scale);
      skMatrix.current.concat(matrix);

      // matrix.value = concat(offset.value, origin.value, [{scale: e.scale}]);
    });

  const style = useAnimatedStyle(() => ({
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    backgroundColor: debug ? 'rgba(100, 200, 300, 0.4)' : 'transparent',
    transform: [
      {translateX: -width / 2},
      {translateY: -height / 2},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {matrix: matrix.value as any},
      {translateX: width / 2},
      {translateY: height / 2},
    ],
  }));

  return [Gesture.Race(pinch, /*rotate,*/ pan), debug ? style : undefined];
};

export function TrainLineMap({id, width, height}: LineMapProps) {
  const data = useStation(id);
  const matrix = useValue(Skia.Matrix());

  const [gesture] = useMapInteractions({
    matrix,
    dimensions: {x: 0, y: 0, width, height},
  });

  // const [pinchGesture, scale] = usePinchGesture();
  // const [panGesture, translateX, translateY] = usePanGesture(width, height);

  // const gesture = Gesture.Simultaneous(panGesture, pinchGesture);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       {
  //         translateX: translateX.value,
  //       },
  //     ],
  //   };
  // });

  // const circleScale = useComputedValue(() => {
  //   return 20 * scale.value;
  // }, [scale]);

  // console.log(animatedStyle);

  return (
    <GestureDetector gesture={gesture}>
      <Canvas style={{width, height, ...styles.canvas}}>
        <Fill color="red" />
        <Group matrix={matrix}>
          <Circle cx={10} cy={10} r={20} color="#3E3E" />
          <Circle cx={10} cy={10} r={15} color="#AEAE" />
        </Group>
        {/* <Circle cx={translateX} cy={translateY} r={circleScale} color="#3E3E" />
        <Circle
          cx={translateX}
          cy={translateY}
          r={15 * scale.value}
          color="#AEAE"
        /> */}
        {/* <Group color="lightblue" transform={transform}>
          <Circle cx={10} cy={10} r={10} />
        </Group> */}
      </Canvas>
    </GestureDetector>
  );
}

const styles = EStyleSheet.create({
  canvas: {
    flex: 1,
    backgroundColor: '$appBgColor',
  },
});
