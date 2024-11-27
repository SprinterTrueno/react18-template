import { FC, useMemo, useReducer, useState } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Table,
  Tooltip,
} from "antd";
import { CloseOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { MOCK_DATA, RANDOM_LIST } from "@/pages/Home/constants";
import { Context, reducer } from "./store";
import Graph from "./componetns/Graph";

const { Item, useForm } = Form;

const Home: FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    // ...MOCK_DATA,
    currentNode: {},
  });

  const contextValue = useMemo(() => {
    console.log(123);
    return { state, dispatch };
  }, [state, dispatch]);

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [groupInfo, setGroupInfo] = useState(RANDOM_LIST);

  const [form] = useForm();

  const changeOption = (index?: number) => {
    const name = ["groupInfoList", index, "groupNumList"];
    const groupInfoList = form.getFieldValue("groupInfoList");

    if (index) {
      form.setFieldValue(name, form.getFieldValue(name).sort());
    }

    const arr = [];

    groupInfoList.forEach((item) => {
      item?.groupNumList?.forEach((item) => {
        arr.push(item);
      });
    });

    const set2 = new Set(arr);
    const res = RANDOM_LIST.filter((item) => !set2.has(item));
    setGroupInfo(res);
  };

  const otherColumns = [
    {
      title: "版本号",
      dataIndex: "version",
    },
    {
      title: "版本号",
      dataIndex: "versionStatus",
    },
    {
      title: "版本用户量/次数",
      dataIndex: "versionNumberOfUsers",
    },
    {
      title: "版本创建人",
      dataIndex: "versionCreator",
    },
    {
      title: "版本创建人",
      dataIndex: "versionCreationTime",
    },
    {
      title: "操作栏",
      render: () => {
        return (
          <div>
            <span>详情</span>
            <span>导出</span>
          </div>
        );
      },
    },
  ];

  const recordColumns = [
    {
      title: "操作时间",
      dataIndex: "operatingTime",
    },
    {
      title: "操作人",
      dataIndex: "operator",
    },
    {
      title: "操作类型",
      dataIndex: "operationType",
    },
    {
      title: "版本号",
      dataIndex: "version",
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
  ];

  return (
    <Context.Provider value={contextValue}>
      <div>策略名称：{state.policyName}</div>
      <Graph />
      <Button
        onClick={() => {
          // setOpen(true);
          // setOpen2(true);
        }}
      >
        打开弹窗
      </Button>
      <div>
        <Modal
          open={open}
          title="分组模块"
          maskClosable={false}
          destroyOnClose
          onOk={async () => {
            const values = await form.validateFields();
            console.log(values);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        >
          <Form form={form} preserve={false}>
            <Item
              label="模块名称"
              name="moduleName"
              rules={[{ required: true, message: "请输入模块名称" }]}
            >
              <Input placeholder="请输入" />
            </Item>
            <Item
              label="分组方式"
              name="groupingMethod"
              rules={[{ required: true, message: "请选择分组方式" }]}
            >
              <Radio.Group
                onChange={(e) => {
                  /* Modal.confirm({
                    title: "确认切换分组方式？",
                    content: "变更分组方式将导致此模块下方配置策略全部清空。",
                    onOk: () => {
                      form.setFieldValue("groupingMethod", e.target.value);
                    },
                  }); */
                  setGroupInfo(RANDOM_LIST);
                  form.resetFields(["groupInfoList"]);
                }}
              >
                <Radio value="random">
                  按随机数分组{" "}
                  <Tooltip
                    title={
                      <>
                        <p>
                          1. 此分组方式适用于APP注册用户；基于移动端百位随机数；
                        </p>
                        <p>
                          2.
                          如需使用此类分组方式，需调用方上游传入该用户移动端百位随机数；
                        </p>
                        <p>3. 不同分组随机数值不可重复；</p>
                      </>
                    }
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Radio>
                <Radio value="hash">
                  按哈希值分组{" "}
                  <Tooltip
                    title={
                      <>
                        <p>
                          1.
                          基于userID/设备号等作为基础参数，以及自定义参数进行哈希值计算；
                        </p>
                        <p>
                          2.
                          如需使用此类分组方式，需调用方上游传入该用户对应基础参数。
                        </p>
                        <p>
                          3.
                          每个分组支持0-1区间内，最多小数点后三位配置，如【0.1-0.546)，左闭右开；
                        </p>
                        <p>4. 不同分组之间的区间值不可交叉，为互斥关系；</p>
                        <p>
                          5.
                          自定义参数最长支持60个英文字符，仅支持英文字母数字下划线，英文不区分大小写，不支持特殊字符与空格。
                        </p>
                      </>
                    }
                  >
                    <QuestionCircleOutlined />
                  </Tooltip>
                </Radio>
              </Radio.Group>
            </Item>
            <Item
              shouldUpdate={(prev, cur) => {
                return prev.groupingMethod !== cur.groupingMethod;
              }}
              noStyle
            >
              {() => {
                if (form.getFieldValue("groupingMethod") === "random") {
                  return (
                    <>
                      <Item
                        label="用户随机数位数"
                        name="positionNumer"
                        rules={[
                          { required: true, message: "请输入用户随机数位数" },
                        ]}
                      >
                        <InputNumber
                          placeholder="请输入1-100的整数"
                          controls={false}
                          min={1}
                          max={100}
                          precision={0}
                          addonAfter="位"
                        />
                      </Item>
                      <Form.List name="groupInfoList">
                        {(fields, operation, meta) => {
                          const { add, remove } = operation;
                          return (
                            <>
                              <Button
                                className="add-btn"
                                onClick={(): boolean => {
                                  if (groupInfo.length === 0) {
                                    message.error("0-9随机数已用完");
                                    return;
                                  }
                                  add();
                                }}
                              >
                                新增分组
                              </Button>
                              {fields.map((field, index) => {
                                return (
                                  <Item
                                    key={field.key}
                                    label={`分组${index + 1}`}
                                  >
                                    <Row>
                                      <Col span={11}>
                                        <Item
                                          {...field}
                                          key={field.key}
                                          noStyle
                                          name={[field.name, "groupNumList"]}
                                        >
                                          <Select
                                            mode="multiple"
                                            allowClear
                                            options={groupInfo.map((item) => {
                                              return {
                                                value: item,
                                                label: item,
                                              };
                                            })}
                                            onChange={(): void => {
                                              changeOption(index);
                                            }}
                                          />
                                        </Item>
                                      </Col>
                                      <Col span={2} />
                                      <Col span={11}>
                                        <Item
                                          {...field}
                                          key={field.key}
                                          noStyle
                                          name={[field.name, "needConfig"]}
                                          valuePropName="checked"
                                          initialValue
                                        >
                                          <Checkbox
                                          /* onChange={(): Promise<void> =>
                                                form.validateFields()
                                              } */
                                          >
                                            是否配置策略
                                          </Checkbox>
                                        </Item>
                                        <Popconfirm
                                          title="删除分组后，该分组下所配置策略将一并删除"
                                          onConfirm={(): void => {
                                            remove(field.name);
                                            changeOption();
                                          }}
                                          okText="确认"
                                          cancelText="取消"
                                        >
                                          <CloseOutlined />
                                        </Popconfirm>
                                      </Col>
                                    </Row>
                                  </Item>
                                );
                              })}
                            </>
                          );
                        }}
                      </Form.List>
                    </>
                  );
                }
                if (form.getFieldValue("groupingMethod") === "hash") {
                  return (
                    <>
                      <Item
                        label="基础参数"
                        name="basic"
                        rules={[{ required: true, message: "请选择基础参数" }]}
                      >
                        <Select
                          options={[
                            { value: "1", label: "userID" },
                            { value: "2", label: "设备ID" },
                          ]}
                        />
                      </Item>
                      <Item
                        label="自定义参数"
                        name="customParam"
                        rules={[
                          { required: true, message: "请配置自定义参数！" },
                          {
                            pattern: /^[a-zA-Z0-9_]*$/,
                            message: "自定义参数格式错误！",
                          },
                        ]}
                      >
                        <Input
                          placeholder="请输入英文字母数字下划线，英文不区分大小写"
                          maxLength={60}
                          onChange={(event): void => {
                            form.setFieldsValue({
                              customParam: event.target.value.replaceAll(
                                " ",
                                "",
                              ),
                            });
                          }}
                        />
                      </Item>
                      <Form.List name="groupInfoList">
                        {(fields, { add, remove }, { errors }) => (
                          <>
                            <Button
                              className="add-btn"
                              onClick={(): void => {
                                add();
                              }}
                            >
                              新增分组
                            </Button>
                            {fields.map((field, index) => (
                              <Item
                                className="extra-field"
                                required={false}
                                key={field.key}
                                label={`分组${index + 1}`}
                              >
                                <Row justify="center" align="middle">
                                  <Col span={6}>
                                    <Item
                                      {...field}
                                      key={field.key}
                                      name={[field.name, "groupNum", "minNum"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "请输入起始值!",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber
                                        className="hash-input-number"
                                        stringMode
                                        min={0}
                                        max={1}
                                        controls={false}
                                        precision={3}
                                      />
                                    </Item>
                                  </Col>
                                  <Col span={1} style={{ textAlign: "center" }}>
                                    &nbsp;—&nbsp;
                                  </Col>
                                  <Col span={6}>
                                    <Item
                                      {...field}
                                      key={field.key}
                                      name={[field.name, "groupNum", "maxNum"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "请输入结束值!",
                                        },
                                      ]}
                                      noStyle
                                    >
                                      <InputNumber
                                        className="hash-input-number"
                                        stringMode
                                        min={0}
                                        max={1}
                                        controls={false}
                                        precision={3}
                                      />
                                    </Item>
                                  </Col>
                                  <Col span={1} />
                                  <Col span={10}>
                                    <Item
                                      {...field}
                                      key={field.key}
                                      noStyle
                                      name={[field.name, "needConfig"]}
                                      initialValue
                                      valuePropName="checked"
                                    >
                                      <Checkbox>是否配置策略</Checkbox>
                                    </Item>
                                    <Popconfirm
                                      title="删除分组后，该分组下所配置策略将一并删除"
                                      onConfirm={(): void => {
                                        remove(field.name);
                                      }}
                                      okText="确认"
                                      cancelText="取消"
                                    >
                                      <CloseOutlined className="hover-close" />
                                    </Popconfirm>
                                  </Col>
                                </Row>
                                <Form.ErrorList errors={errors} />
                              </Item>
                            ))}
                          </>
                        )}
                      </Form.List>
                    </>
                  );
                }
                return null;
              }}
            </Item>
          </Form>
        </Modal>
        <Modal
          open={open2}
          title="结果模块"
          maskClosable={false}
          destroyOnClose
          onOk={async () => {
            const values = await form.validateFields();
            console.log(values);
          }}
          onCancel={() => {
            setOpen2(false);
          }}
        >
          <Form form={form} preserve={false}>
            <Item
              label="模块名称"
              name="moduleName"
              rules={[{ required: true, message: "请输入模块名称" }]}
            >
              <Input placeholder="请输入" />
            </Item>
            <Form.List name="paramsDetail">
              {(fields, operation, meta) => {
                const { add, remove } = operation;
                return (
                  <>
                    <Button
                      onClick={() => {
                        add();
                      }}
                    >
                      添加
                    </Button>
                    {fields.map((field) => {
                      return (
                        <Item>
                          {/* <Item
                          {...field}
                          key={field.key}
                          noStyle
                          name={[field.name, "paramName"]}
                        >
                          <Select
                            options={[
                              { label: "测试参数名称", value: "测试参数名称" },
                            ]}
                          />
                        </Item>
                        <Item
                          {...field}
                          key={field.key}
                          noStyle
                          name={[field.name, "paramType"]}
                        >
                          <Select
                            options={[
                              { label: "String", value: "String" },
                              { label: "Boolean", value: "Boolean" },
                              { label: "Number", value: "Number" },
                              { label: "Json", value: "Json" },
                            ]}
                          />
                        </Item> */}
                          <Item
                            {...field}
                            key={field.key}
                            noStyle
                            name={[field.name, "paramValue"]}
                            rules={[
                              { required: true, message: "请输入参数值" },
                              {
                                validator: (rule, value) => {
                                  console.log(rule, value);
                                  try {
                                    const result = JSON.parse(value);
                                    // 检查解析结果是否是一个非空对象
                                    if (
                                      typeof result === "object" &&
                                      result !== null &&
                                      !Array.isArray(result)
                                    ) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error("Should accept agreement"),
                                    );
                                  } catch {
                                    return Promise.reject(
                                      new Error("Should accept agreement"),
                                    );
                                  }
                                },
                              },
                            ]}
                          >
                            <Input />
                          </Item>
                          <Form.ErrorList errors={meta.errors} />
                        </Item>
                      );
                    })}
                  </>
                );
              }}
            </Form.List>
          </Form>
        </Modal>
      </div>
      <Table />
    </Context.Provider>
  );
};

export default Home;
