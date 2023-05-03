import React from "react";
import { Group } from "@visx/group";
import { Text } from "@visx/text";

const SliceInfo = ({
  activeSlice, radius,
}) => {
  if (!activeSlice) return null;

  const fontSize = radius / 10;

  const sliceDataStr = (value, percentage) => `${value.toFixed(2)} - ${percentage.toFixed(2)}%`;

  return (
    <Group>
      <Text
        x={0}
        y={-fontSize}
        textAnchor="middle"
        fontWeight="bold"
        fontSize={fontSize * 1.5}
        className="chartText"
      >
        {activeSlice.key}
      </Text>
      <Text
        x={0}
        y={fontSize}
        textAnchor="middle"
        fontSize={fontSize}
        className="chartText"
      >
        {sliceDataStr(activeSlice.value, activeSlice.percentage)}
      </Text>
    </Group>
  );
};

export default SliceInfo;
