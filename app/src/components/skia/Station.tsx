import { Circle } from "@shopify/react-native-skia";
import { StationData } from "../../types";
import { CommonSkiaProps } from "./types";

export type SkiaStationProps = CommonSkiaProps & {
  data: StationData;
};

export function SkiaStation({ data, x, y }: SkiaStationProps) {
  return <Circle cx={x} cy={y} r={10} color="lightblue" />;
}
