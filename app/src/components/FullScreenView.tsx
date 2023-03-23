import {useCallback, useState} from 'react';
import {LayoutChangeEvent, View, type ViewStyle} from 'react-native';

export type FullScreenViewProps = {
  render: (props: {height: number; width: number}) => React.ReactNode;
  style?: ViewStyle;
};

export function FullScreenView({render, style}: FullScreenViewProps) {
  const [size, setSize] = useState({w: 0, h: 0});
  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: {width: w, height: h},
      },
    }: LayoutChangeEvent) => {
      setSize({w, h});
    },
    [],
  );

  return (
    <View
      style={{flex: 1, height: '100%', width: '100%', ...style}}
      onLayout={onLayout}>
      {render({width: size.w, height: size.h})}
    </View>
  );
}
