import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { getTitle } from '../../../assets/utils/utils';
import Filter from './Filter';
import List from './List';
import Modal from './Modal';

const Menu = ({ dispatch, systemMenu, loading }) => {
    /* 数据模型层状态值*/
    const { list, currentItem, modalType, modalVisible, selectedRowKeys } = systemMenu;

  /* 模糊查询参数*/
    const filterProps = {
        onCreate () {
            dispatch({
                type: 'systemMenu/showModal',
                payload: {
                    modalType: 'create',
                },
            });
        },
    };

    /* 列表组件参数*/
    const listProps = {
        dataSource: list,
        onCheckItem (record) {
            dispatch({
                type: 'systemMenu/showModal',
                payload: {
                    isDisabled: true,
                    modalType: 'check',
                    currentItem: record,
                },
            });
        },
        onEditItem (record) {
            dispatch({
                type: 'systemMenu/showModal',
                payload: {
                    modalType: 'update',
                    currentItem: record,
                },
            });
        },
        onDeleteItem (record) {
            dispatch({
                type: 'systemMenu/remove',
                payload: {
                    id: record.id,
                },
            });
        },
        rowSelection: {
            selectedRowKeys,
            onChange: (keys) => {
                dispatch({
                    type: 'systemMenu/updateState',
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
        onOk (data) {
            dispatch({
                type: `systemMenu/${modalType}`,
                payload: data,
            });
        },
        onCancel () {
            dispatch({
                type: 'systemMenu/hideModal',
            });
        },
    };

  /* 渲染页面*/
    return (
        <div className="content-inner">
          <Filter {...filterProps}/>
          <List {...listProps} />
          {modalVisible && <Modal {...modalProps} />}
        </div>
    );
};

Menu.propTypes = {
  systemMenu: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.object.isRequired,
};

export default connect(({ systemMenu, loading }) => ({ systemMenu, loading }))(Menu);
