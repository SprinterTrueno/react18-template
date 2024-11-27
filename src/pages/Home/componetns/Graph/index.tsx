import { FC, useContext, useEffect, useRef, useState } from "react";
import { Modal } from "antd";
import G6 from "@antv/g6";
import {
  appenAutoShapeListener,
  createNodeFromReact,
} from "@antv/g6-react-node";
import * as module from "node:module";
import { ModuleType } from "../../types";
import { Context } from "../../store";
import NodeCard from "../NodeCard";

G6.registerNode("tree-node", createNodeFromReact(NodeCard), "rect");

const Graph: FC = () => {
  const { state, dispatch } = useContext(Context);

  const { moduleTree } = state;

  const container = useRef<HTMLDivElement | null>(null);
  const ref = useRef<any>();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ref.current) {
      // console.log(ref.current);
      ref.current.destroy();
    }

    const graph = new G6.TreeGraph({
      container: container.current,
      // width: window.innerWidth,
      // height: window.innerHeight,
      width: container.current.scrollWidth,
      height: container.current.scrollHeight || 750,
      linkCenter: true,
      // autoPaint: false,
      // renderer: "svg",
      // 默认边。
      defaultEdge: {
        // 垂直方向的三阶贝塞尔曲线，不考虑用户从外部传入的控制点。
        // type: "cubic-vertical",
        style: {
          stroke: "#AEBEFC",
          lineWidth: 4,
        },
      },
      // 默认节点。
      defaultNode: {
        // 指定节点类型，内置节点类型名称或自定义节点的名称。
        type: "tree-node",
        testFc: {
          setOpen: (value: boolean) => {
            setOpen(value);
          },
          dispatch: ({ type, payload }: { type: string; payload: any }) => {
            console.log(type, payload);
            dispatch({ type, payload });
          },
        },
      },
      // 布局。
      layout: {
        // 紧凑树。
        type: "compactBox",
        // 树布局的方向，根节点在上，往下布局。
        direction: "TB",
        // direction: "LR",
        // 节点 id 的回调函数。
        getId: (d) => {
          return d.id;
        },
        // 每个节点的宽度。
        getHeight: () => {
          // return 0;
          // return 280;
          return 180;
        },
        // 每个节点的高度。
        getWidth: () => {
          // return 0;
          // return 364;
          return 182;
        },
        // 每个节点的水平间隙。
        getVGap: () => {
          // return 100;
          // return 20;
          return 10;
        },
        // 每个节点的垂直间隙。
        getHGap: () => {
          // return 100;
          // return 50;
          return 25;
        },
      },
      // 交互模式。
      modes: {
        // default 模式中包含点击选中节点行为和拖拽画布行为。
        // 内置的 Behavior：拖拽画布，缩放画布。
        // Behavior 是 G6 提供的定义图上交互事件的机制。它与交互模式 Mode 搭配使用。
        default: ["drag-canvas", "zoom-canvas"],
      },
      plugins: [tooltip],
    });

    ref.current = graph;

    // 设置各个节点样式及其他配置，以及在各个状态下节点的 KeyShape 的样式。
    // 该方法必须在 render 之前调用，否则不起作用。
    /* graph.node((node) => {
      let position = "right";
      let rotate = 0;

      if (!node.children) {
        position = "bottom";
        rotate = Math.PI / 2;
      }

      return {
        label: node.id,
        labelCfg: {
          position,
          offset: 5,
          style: {
            rotate,
            textAlign: "start",
          },
        },
      };
    }); */

    /* graph.node(function (node) {
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
    }); */

    appenAutoShapeListener(graph);

    console.log(moduleTree);

    if (!moduleTree || !moduleTree.moduleCode) {
      console.log(123);
      graph.data({
        moduleType: ModuleType.BASIC_SETTINGS,
        moduleName: "基本设置",
      });
    } else {
      console.log(456);
      graph.data(moduleTree);
    }

    // 根据提供的数据渲染视图。
    graph.render();
    // 让画布内容适应视口。
    graph.fitView();

    // 点击节点
    graph.on("node:click", (e: any) => {
      const { nodeCode } = e.item.getModel();
      // saveCurrentNodeData(nodeCode, treeDataRef.current, reachRef, dispatch);
    });

    // 鼠标移入节点
    graph.on("node:mouseenter", (e) => {
      const { item } = e;
      console.log(item);
      graph.updateItem(item, {
        stateStyles: {
          hover: {
            hoverRect: {
              stroke: "#617BE9",
            },
            delBtn: {
              opacity: 1,
            },
            delText: {
              opacity: 1,
            },
            delBtnCirle: {
              opacity: 1,
            },
          },
        },
      });
      graph.setItemState(item, "hover", true);
    });

    // 鼠标移出节点
    graph.on("node:mouseleave", (e) => {
      const { item } = e;
      graph.updateItem(item, {
        stateStyles: {
          hover: {
            // stroke: "#E6E6E6",
          },
        },
      });
      graph.setItemState(item, "hover", true);
    });
  }, [moduleTree]);

  // Tooltip 插件主要用于在节点和边上展示一些辅助信息。
  const tooltip = new G6.Tooltip({
    // tooltip 容器的 class 类名
    className: "module-tooltip",
    // tooltip 内容，支持 DOM 元素或字符串
    getContent: (evt) => {
      const data = evt.item.getModel();
      if (data.moduleData) {
        return `<div>${(data.moduleData as any).value}</div>`;
      }
      return "";
    },
    // 是否允许 tooltip 出现.
    // shouldBegin: () => {},
    // tooltip 的 x 方向偏移值，需要考虑父级容器的 padding
    offsetX: 10,
    // tooltip 的 y 方向偏移值，需要考虑父级容器的 padding
    offsetY: 20,
    // tooltip 作用在哪些类型的元素上，若只想在节点上显示，可将其设置为 ['node']
    itemTypes: ["node"],
  });

  return (
    <>
      <div ref={container} />
      <Modal
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      >
        123
      </Modal>
    </>
  );
};

export default Graph;
