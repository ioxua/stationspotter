import React from 'react';
import {
  Appearance,
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import {FullScreenView, TrainLineMap} from './src/components';
import {updateTheme} from './src/styles';

updateTheme(Appearance.getColorScheme() === 'light' ? 'light' : 'dark');

function App(): JSX.Element {
  const {width} = useWindowDimensions();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={styles.safeAreaView.backgroundColor}
      />
      <Text>before</Text>
      <FullScreenView
        render={({height}) => (
          <TrainLineMap id="11" width={width} height={height} />
        )}
      />
      <Text>after</Text>
    </SafeAreaView>
  );
}

const styles = EStyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '$appBgColor',
  },
});

export default App;
