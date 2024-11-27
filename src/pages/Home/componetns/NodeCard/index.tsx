import { FC, useContext, useState } from "react";
import { ModelConfig } from "@antv/g6";
import { Group, Rect, Text } from "@antv/g6-react-node";
import { ModuleType } from "@/pages/Home/types";
import { Context } from "@/pages/Home/store";
import { MOCK_DATA } from "@/pages/Home/constants";

const color = {
  fill: "#40a9ff",
  stroke: "#096dd9",
  white: "#ffffff",
  grey: "#333333",
};

interface Test extends ModelConfig {
  moduleData: { value: string };
  testFc: {
    setOpen: (open: boolean) => void;
    dispatch: ({ type, payload }: { type: string; payload: any }) => void;
  };
}

interface NodeCardProps {
  cfg: Test;
}

const NodeCard: FC<NodeCardProps> = (props) => {
  const { cfg } = props;
  const {
    id,
    moduleCode,
    linkName,
    moduleType,
    moduleName,
    moduleData,
    testFc,
  } = cfg;

  const { setOpen, dispatch } = testFc;

  console.log(cfg);
  console.log(moduleCode, moduleData);

  return (
    <Group>
      {/* 初始 */}
      {!moduleCode && moduleType === ModuleType.BASIC_SETTINGS && (
        <Rect>
          <Rect
            onClick={() => {
              dispatch({
                type: "moduleTree",
                payload: {
                  moduleCode: "1",
                  moduleType: ModuleType.BASIC_SETTINGS,
                  moduleName: "基本设置",
                  moduleData: {
                    value: "这是基本设置",
                  },
                },
              });
            }}
            style={{
              width: 150,
              height: 20,
              radius: [6, 6, 0, 0],
              fill: color.fill,
              stroke: color.stroke,
            }}
          >
            <Text
              style={{
                margin: [4, 5],
                fontWeight: "bold",
                fill: color.white,
              }}
            >
              {moduleName}
            </Text>
          </Rect>
          <Rect
            style={{
              width: 150,
              height: 55,
              stroke: color.stroke,
              fill: color.white,
              radius: [0, 0, 6, 6],
            }}
          >
            <Text style={{ marginTop: 5, fill: color.grey, margin: [8, 4] }}>
              设置实验描述等基本信息
            </Text>
          </Rect>
        </Rect>
      )}
      {/* 基础设置模块 */}
      {moduleType === ModuleType.BASIC_SETTINGS && moduleData && (
        <Rect
          onClick={() => {
            setOpen(true);
            dispatch({ type: "currentNode", payload: 123123 });
          }}
        >
          <Rect
            onClick={() => {
              setOpen(true);
              // dispatch({ type: "currentNode", payload: 123123 });
              dispatch({ type: "moduleTree", payload: MOCK_DATA });
            }}
            style={{
              width: 150,
              height: 20,
              radius: [6, 6, 0, 0],
              fill: color.fill,
              stroke: color.stroke,
            }}
          >
            <Text
              style={{
                margin: [4, 5],
                fontWeight: "bold",
                fill: color.white,
              }}
            >
              {moduleName}
            </Text>
          </Rect>
          <Rect
            onClick={() => {
              setOpen(true);
            }}
            style={{
              width: 150,
              height: 55,
              stroke: color.stroke,
              fill: color.white,
              radius: [0, 0, 6, 6],
            }}
          >
            <Text style={{ marginTop: 5, fill: color.grey, margin: [8, 4] }}>
              {moduleData.value}
            </Text>
          </Rect>
        </Rect>
      )}
    </Group>
  );
};

export default NodeCard;
