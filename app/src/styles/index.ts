import EStyleSheet from 'react-native-extended-stylesheet';
import {dark, light} from './theme';

export type Theme = 'light' | 'dark';

export const updateTheme = (mode: Theme) => {
  EStyleSheet.build(mode === 'light' ? light : dark);
};
