// G6Graph.tsx
import { FC, useEffect, useRef } from "react";
import G6, { ModelConfig, NodeConfig } from "@antv/g6";
import { Group, Rect, Text, createNodeFromReact } from "@antv/g6-react-node";
import { data, TreeData } from "./data";

interface G6GraphProps {
  // 定义你需要的 props，例如图的配置等
  width: number;
  height: number;
}

const ReactNode = (props: { cfg: ModelConfig }) => {
  const { cfg } = props;
  const { description, label, color, creatorName } = cfg;

  return (
    <Group>
      <Rect>
        <Rect
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
            {label}
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
            描述: {description}
          </Text>
          <Text style={{ marginTop: 10, fill: color.grey, margin: [6, 4] }}>
            创建者: {creatorName}
          </Text>
        </Rect>
      </Rect>
    </Group>
  );
};

G6.registerNode("tree-node", createNodeFromReact(ReactNode));

const G6Graph: FC<G6GraphProps> = ({ width, height }) => {
  const container = useRef<HTMLDivElement>(null);
  let graph: any = null; // G6 的 Graph 实例

  useEffect(() => {
    if (!container.current) return;
    // 初始化 G6 图
    graph = new G6.TreeGraph({
      container: container.current,
      width: window.innerWidth,
      height: window.innerHeight,
      // 其他 G6 配置...
      // 线
      defaultEdge: {
        type: "cubic-vertical",
        style: {
          stroke: "#AEBEFC",
          lineWidth: 4,
        },
      },
      // 节点
      defaultNode: {
        type: "tree-node",
        // anchorPoints: [
        //   [0, 0.5],
        //   [1, 0.5],
        // ],
      },
      modes: {
        default: [
          {
            type: "collapse-expand",
          },
          "drag-canvas",
          "zoom-canvas",
        ],
      },
      // 布局
      layout: {
        type: "compactBox",
        direction: "TB",
        getId: (d: any): string => {
          return d.id;
        },
        getHeight: (): number => {
          return 280;
        },
        getWidth: (d: any): number => {
          return 364;
        },
        getVGap: (): number => {
          return 20;
        },
        getHGap: (): number => {
          return 50;
        },
      },
    });
    // 自定义节点渲染
    graph.node(function (node) {
      // console.log(node, "hello");
      return {
        size: 26,
        color: {
          fill: "#40a9ff",
          stroke: "#096dd9",
          white: "#ffffff",
          grey: "#333333",
        },
        label: node.id,
        // labelCfg: {
        //   position: "top",
        // },
      };
    });

    // G6.Util.traverseTree(RouterData, function(item) {
    //   item.id = item.name;
    // });

    // 加载数据并渲染图
    graph.data(TreeData);
    graph.render();
    // 自适应展示
    graph.fitView();

    // 清理函数，在组件卸载时调用
    return () => {
      if (graph) {
        graph.destroy();
        graph = null;
      }
    };
  }, [width, height, data]); // 依赖项列表，根据需要添加或删除

  return <div ref={container} style={{ width, height }} />;
};

export default G6Graph;
