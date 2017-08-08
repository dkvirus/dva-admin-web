import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { getTitle } from '{{utils}}';
import Filter from './Filter';
import List from './List';
import Modal from './Modal';

const {{moduleName}} = ({ dispatch, {{namespace}}, loading }) => {
  /* 数据模型层状态值*/
  const { list, currentItem, modalType, modalVisible, selectedRowKeys } = {{namespace}};

  /* 模糊查询参数*/
  const filterProps = {
    onSearch (value) {
      dispatch({
        type: '{{namespace}}/query',
        payload: {
          nameContaining: value,
        },
      });
    },
    onCreate () {
      dispatch({
        type: '{{namespace}}/showModal',
        payload: {
          modalType: 'create',
        },
      });
    },
  };

  /* 批量删除组件参数*/
  const multiRemoveProps = {
    selectedRowKeys,
    handleMultiRemove () {
      dispatch({
        type: '{{namespace}}/multiRemove',
        payload: selectedRowKeys,
      });
    },
  };

  /* 列表组件参数*/
  const listProps = {
    dataSource: list,
    loading: loading.effects['user/query'],
    onCheckItem (record) {
      dispatch({
        type: '{{namespace}}/showModal',
        payload: {
          isDisabled: true,
          modalType: 'check',
          currentItem: record,
        },
      });
    },
    onEditItem (record) {
      dispatch({
        type: '{{namespace}}/showModal',
        payload: {
          modalType: 'update',
          currentItem: record,
        },
      });
    },
    onDeleteItem (record) {
      dispatch({
        type: '{{namespace}}/remove',
        payload: {
          id: record.id,
        },
      });
    },
    rowSelection: {
      selectedRowKeys,
      onChange: (keys) => {
        dispatch({
          type: '{{namespace}}/updateState',
          payload: {
            selectedRowKeys: keys,
          },
        });
      },
    },
  };

  /* 模态框编辑表单组件参数*/
  const modalProps = {
    visible: modalVisible,
    maskClosable: false,
    title: getTitle(modalType),
    item: modalType === 'create' ? {} : currentItem,
    isDisabled: modalType === 'check',
    confirmLoading: loading.effects['user/update'],
    onOk (data) {
      dispatch({
        type: `{{namespace}}/${modalType}`,
        payload: data,
      });
    },
    onCancel () {
      dispatch({
        type: '{{namespace}}/hideModal',
      });
    },
  };

  /* 渲染页面*/
  return (
    <div className="content-inner">
      <Filter {...filterProps} />
      {selectedRowKeys.length > 0 && <MultiRemove {...multiRemoveProps} />}
      <List {...listProps} />
      {modalVisible && <Modal {...modalProps} />}
    </div>
  );
};

{{moduleName}}.propTypes = {
  {{namespace}}: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
};

export default connect(({ {{namespace}}, loading }) => ({ {{namespace}}, loading }))({{moduleName}});
