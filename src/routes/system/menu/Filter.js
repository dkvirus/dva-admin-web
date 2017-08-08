import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'antd';
import style from './index.less';

const Filter = ({ onCreate }) => {
  return (
    <Row type="flex" justify="space-between" className={style.mb16}>
      <Col span={6}>
      </Col>
      <Col span={12}>
        <Button type="primary" icon="save" onClick={() => onCreate()} className={style.right}>
          新增
        </Button>
      </Col>
    </Row>
  );
};

Filter.propTypes = {
  onCreate: PropTypes.func.isRequired,
};

export default Filter;
