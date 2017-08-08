import React from 'react';
import PropTypes from 'prop-types';
import { Table, Button, Icon, Modal } from 'antd';

const List = ({ dataSource, onCheckItem, onEditItem, onDeleteItem, rowSelection }) => {
  const confirm = Modal.confirm;

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
        confirm({
          title: '请确认执行删除操作吗？',
          onOk () {
            onDeleteItem(record);
          },
        });
        break;
      }
      default:
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: '20%',
      render: (text, record) => <a onClick={() => handleClick('check', record)}>{text}</a>,
    }, {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: '20%',
    }, {
      title: '操作',
      key: 'action',
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
      rowSelection={rowSelection}
      dataSource={dataSource}
      columns={columns}
      bordered
      rowKey={record => record.id}
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
