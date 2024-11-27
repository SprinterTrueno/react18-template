import { message, Modal } from "antd";
import { ModuleTree, ModuleType } from "./types";

export const MOCK_DATA = {
  experimentName: "测试策略",
  moduleTree: {
    moduleCode: "1",
    moduleType: ModuleType.BASIC_SETTINGS,
    moduleData: {
      value: "这是基本设置",
    },
    children: [
      {
        parentModuleCode: "1",
        moduleCode: "2",
        moduleType: ModuleType.GROUPING,
        moduleName: "分组模块1",
        moduleData: {
          value: "这是分组模块1",
        },
        children: [
          {
            parentModuleCode: "2",
            linkName: "分组1",
            moduleCode: "3",
            moduleType: ModuleType.CONDITION,
            moduleName: "条件模块1",
            moduleData: {
              value: "这是条件模块1",
            },
            children: [
              {
                parentModuleCode: "3",
                moduleCode: "5",
                moduleType: ModuleType.RESULT,
                moduleName: "结果模块",
                moduleData: {
                  value: "这是结果模块",
                },
              },
            ],
          },
          {
            parentModuleCode: "2",
            linkName: "分组2",
            moduleCode: "4",
            moduleType: ModuleType.CONDITION,
            moduleName: "条件模块2",
            moduleData: {
              value: "这是条件模块2",
            },
            children: [
              {
                parentModuleCode: "4",
              },
            ],
          },
        ],
      },
    ],
  },
};

// 分组模块选择的分组信息
export const RANDOM_LIST = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const handleSaveDraft = () => {
  if (!MOCK_DATA.experimentName) {
    message.info("请输入实验名称");
  } else {
    // 调用接口
  }
};

const handleReleaseExperiment = () => {
  if (!MOCK_DATA.experimentName) {
    message.error("请配置实验名称");
    return;
  }
  if (!MOCK_DATA.moduleTree.moduleCode) {
    message.error("请配置基本设置模块");
    return;
  }
  const checkModuleType = (value: ModuleTree) => {
    if (!value.children || value.children.length === 0) {
      if (value.moduleType !== ModuleType.RESULT) {
        return false;
      }
    } else {
      return value.children.every((item) => {
        return checkModuleType(item);
      });
    }
    return true;
  };

  if (!checkModuleType(MOCK_DATA.moduleTree)) {
    message.error("实验配置不完整，无法发布");
    return;
  }

  Modal.confirm({
    content: "实验发布后，将支持外部调用，请慎重操作！是否确认发布该实验？",
    onOk: () => {
      // 调用接口
    },
  });
};
