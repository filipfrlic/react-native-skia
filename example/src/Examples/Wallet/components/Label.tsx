import type { SkiaValue } from "@shopify/react-native-skia";
import {
  useFont,
  interpolate,
  Text,
  useDerivedValue,
} from "@shopify/react-native-skia";
import React from "react";

import type { Graphs } from "../Model";
import { PADDING } from "../Model";

import type { GraphState } from "./Selection";

const sfMono = require("../../Severance/SF-Mono-Medium.otf");
const format = (value: number) =>
  "$ " +
  Math.round(value)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

interface LabelProps {
  y: SkiaValue<number>;
  state: SkiaValue<GraphState>;
  graphs: Graphs;
  width: number;
  height: number;
}

export const Label = ({ state, y, graphs, width, height }: LabelProps) => {
  const titleFont = useFont(sfMono, 64);
  const subtitleFont = useFont(sfMono, 24);
  const translateY = height + PADDING;
  const AJUSTED_SIZE = height - PADDING * 2;
  const text = useDerivedValue(() => {
    const graph = graphs[state.current.current];
    return format(
      interpolate(
        y.current,
        [0, AJUSTED_SIZE],
        [graph.data.maxPrice, graph.data.minPrice]
      )
    );
  }, [y, state]);
  const subtitle = "+ $314,15";
  const titleX = useDerivedValue(() => {
    if (!titleFont) {
      return 0;
    }
    const graph = graphs[state.current.current];
    const title = format(graph.data.maxPrice);
    const titleWidth = titleFont
      .getGlyphWidths(titleFont.getGlyphIDs(title))
      .reduce((a, b) => a + b, 0);
    return width / 2 - titleWidth / 2;
  }, [state, titleFont]);
  if (!titleFont || !subtitleFont) {
    return null;
  }
  const subtitleWidth = subtitleFont
    .getGlyphWidths(subtitleFont.getGlyphIDs(subtitle))
    .reduce((a, b) => a + b, 0);
  return (
    <>
      <Text
        x={titleX}
        y={translateY - 120}
        text={text}
        font={titleFont}
        color="white"
      />
      <Text
        x={width / 2 - subtitleWidth / 2}
        y={translateY - 60}
        text={subtitle}
        font={subtitleFont}
        color="#8E8E93"
      />
    </>
  );
};
