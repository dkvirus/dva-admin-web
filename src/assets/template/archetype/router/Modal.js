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
          label="姓"
          hasFeedback
        >
          {
            getFieldDecorator('firstName', {
              initialValue: item.firstName,
              rules: [
                {
                  message: '输入姓',
                  required: true,
                  min: 1,
                  max: 10,
                },
              ],
            })(<Input disabled={isDisabled} />)
          }
        </FormItem>

        <FormItem
            {...formLayout}
            label="名"
            hasFeedback
        >
            {
                getFieldDecorator('lastName', {
                    initialValue: item.lastName,
                    rules: [
                        {
                            message: '输入名',
                            required: true,
                            min: 1,
                            max: 10,
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
  modalProps: PropTypes.object.isRequired,
  item: PropTypes.object,
  isDisabled: PropTypes.bool.isRequired,
  onOk: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default Form.create({})(EditorModal);
