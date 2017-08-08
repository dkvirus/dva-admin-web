import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Icon, Modal, message } from 'antd';

const confirm = Modal.confirm;

const List = ({ dataSource, onCheckItem, onEditItem, onDeleteItem, rowSelection }) => {

  // 处理点击事件
  const handleClick = (type, record) => {
      switch (type) {
          case 'check': {
              onCheckItem(record);
              break;
          }
          case 'edit': {
              onEditItem(record);
              break;
          }
          case 'delete': {
              if (record.id === 'system' || record.id === 'system-menu') {
                  message.warning('开发阶段不允许删除！');
              } else {
                  confirm({
                      title: '请确认执行删除操作吗？',
                      onOk () {
                          onDeleteItem(record);
                      },
                  });
              }
              break;
          }
          default:
      }
  };

  // 表格列名称
  const columns = [
    {
        title: '菜单主键',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
        render: (text, record) => <a onClick={() => handleClick('check', record)}>{text}</a>,
    },
    {
        title: '菜单名称',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
    }, {
        title: '菜单图标',
        dataIndex: 'icon',
        key: 'icon',
        width: '15%',
    }, {
        title: '路由地址',
        dataIndex: 'router',
        key: 'router',
        width: '15%',
    }, {
        title: '操作',
        key: 'operation',
        render: (text, record) => {
            return (
                <Button.Group>
                  <Button onClick={() => handleClick('delete', record)}>
                    <Icon type="delete" />删除
                  </Button>
                  <Button onClick={() => handleClick('edit', record)}>
                    <Icon type="edit" />编辑
                  </Button>
                </Button.Group>
            );
        },
    },
  ];

  return (
    <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={record => record.id}
        bordered
        rowSelection={rowSelection}
        indentSize={35}
    />
  );

};

List.propTypes = {
  dataSource: PropTypes.array,
  onCheckItem: PropTypes.func.isRequired,
  onEditItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  rowSelection: PropTypes.object.isRequired,
};

export default List;
