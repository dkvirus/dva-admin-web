import React from 'react';
import PropTypes from 'prop-types';
import { Router } from 'dva/router';
import App from '../routes/system/app/app';

// 控制已经注册过的实体模型不让再注册了
const registerModel = (app, model) => {
  if (!(app._models.filter(m => m.namespace === model.namespace).length === 1)) {
    app.model(model);
  }
};

const Routers = function ({ history, app }) {
  // 数据源开始
  let childRoutes = [
      {
          path: 'welcome',
          getComponent (nextState, cb) {
              require.ensure([], require => {
                  registerModel(app, require('../models/system/app'));
                  cb(null, require('../routes/system/welcome'));
              }, 'welcome');
          },
      },
      {
          path: 'login',
          getComponent (nextState, cb) {
              require.ensure([], require => {
                  registerModel(app, require('../models/system/app'));
                  cb(null, require('../routes/system/login/index'));
              }, 'login');
          },
      },
      {
          path: 'system/menu',
          getComponent (nextState, cb) {
              require.ensure([], require => {
                  registerModel(app, require('../models/system/menu'));
                  cb(null, require('../routes/system/menu/index'));
              }, 'system-menu');
          },
      },
      {
          path: 'system/example',
          getComponent (nextState, cb) {
              require.ensure([], require => {
                  registerModel(app, require('../models/system/example'));
                  cb(null, require('../routes/system/example/index'));
              }, 'system-example');
          },
      },
      {
          path: '*',
          getComponent (nextState, cb) {
              require.ensure([], require => {
                  registerModel(app, require('../models/system/app'));
                  cb(null, require('../routes/system/error/index'));
              }, 'error');
          },
      },
  ];
  // 数据源结束

  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          cb(null, { component: require('../routes/system/welcome') });
        }, 'welcome');
      },
      childRoutes: childRoutes
    },
  ];

  return <Router history={history} routes={routes} />;
};

Routers.propTypes = {
  history: PropTypes.object,
  app: PropTypes.object,
};

export default Routers;
