import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const EditorModal = ({ ...modalProps, item = {}, isDisabled = false, onOk, form: { getFieldDecorator, validateFields, getFieldsValue } }) => {
  const handleOk = () => {
    validateFields((err) => {
      if (err) return;
      const data = { ...getFieldsValue() };
      onOk(data);
    });
  };

  const EditorOpts = {
    ...modalProps,
    onOk: handleOk,
  };

  return (
    <Modal {...EditorOpts}>
      <Form>

        <FormItem
            {...formLayout}
            label="菜单ID"
            hasFeedback
        >
            {
                getFieldDecorator('id', {
                    initialValue: item.id,
                    rules: [
                        {
                            message: '父级菜单-子级菜单，如：system-menu',
                            required: true,
                            min: 1,
                            max: 15,
                        },
                    ],
                })(<Input disabled={isDisabled} />)
            }
        </FormItem>

        <FormItem
          {...formLayout}
          label="菜单名称"
          hasFeedback
        >
          {
            getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  message: '请输入菜单名称',
                  required: true,
                  min: 1,
                  max: 4,
                },
              ],
            })(<Input disabled={isDisabled} />)
          }
        </FormItem>

        <FormItem
            {...formLayout}
            label="菜单图标"
            hasFeedback
        >
            {
              getFieldDecorator('icon', {
                initialValue: item.icon,
                rules: [
                  {
                      message: '菜单图标从 https://ant.design/components/icon/ 网站选',
                      required: true,
                      min: 1,
                      max: 15,
                  },
                ],
              })(<Input disabled={isDisabled} />)
            }
        </FormItem>

        <FormItem
            {...formLayout}
            label="上级菜单ID"
            hasFeedback
        >
            {
              getFieldDecorator('mpid', {
                initialValue: item.mpid,
                rules: [
                  {
                    message: '填写上级菜单ID，不写则为创建最上级菜单',
                    required: true,
                    min: 1,
                    max: 15,
                  },
                ],
              })(<Input disabled={isDisabled} />)
            }
        </FormItem>


      </Form>
    </Modal>
  );
};

EditorModal.propTypes = {
  modalProps: PropTypes.object,
  item: PropTypes.object,
  isDisabled: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default Form.create({})(EditorModal);
