import { getStatusBarHeight } from "react-native-status-bar-height";

export const statusBarHeight = getStatusBarHeight();

export const Assets = {
  data: {
    stations: require("../../assets/json/stations.json"),
    lines: require("../../assets/json/lines.json"),
  },
  visualizations: {
    fullMap: require("../../assets/json/full-map.json"),
  },
};
