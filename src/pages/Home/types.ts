export interface CreateExperiment {
  // 实验名称
  experimentName: string;
  // 业务部门
  deptCode: string;
}

export enum ModuleType {
  // 无策略
  NO_STRATEGY,
  // 基本模块
  BASIC_SETTINGS,
  // 条件模块
  CONDITION,
  // 分组模块
  GROUPING,
  // 结果模块
  RESULT,
}

export interface ModuleTree {
  // 模块唯一标识
  moduleCode?: string;
  // 模块类型
  moduleType?: ModuleType;
  // 模块数据，详见各个模块
  moduleData?: Record<string, any>;
  // 父节点唯一标识
  parentModuleCode?: string;
  // 分支名称
  linkName?: string;
  children?: ModuleTree[];
}

interface ExperimentDetail {
  // 实验名称
  experimentName: string;
  // 实验ID
  experimentId: string;
  // 业务中心
  serviceCenter: string;
  // 创建账号
  createdAccount: string;
  // 模块树
  moduleTree: ModuleTree;
}

export interface A {
  // 模块名称
  moduleName: string;
  // 分组方式
  groupingMethod: string;
  // 用户随机数位数
  positionNumber: string;
  // 基础参数
  basicParam: string;
  // 自定义参数
  customParam: string;
  // 分组信息
  groupInfoList: {
    // 随机数集合
    groupNumList: string[];
    // 哈希值区间
    hashInterval: {
      minNum: number;
      maxNum: number;
    };
    // 是否配置策略
    needConfig: boolean;
  }[];
}

export interface B {
  // 模块名称
  moduleName: string;
  // 参数详情
  paramsDetail: {
    // 参数名称
    paramName: string;
    // 参数类型
    paramType: string;
    // 参数值
    paramValue: string;
  }[];
}
