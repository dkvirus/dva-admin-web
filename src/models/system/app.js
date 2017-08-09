import { routerRedux } from 'dva/router';
import { parse } from 'qs';
import { query, logout, login } from '../../services/system/app';
import { config, queryURL } from '../../assets/utils/index';
const { prefix } = config;

export default {
  namespace: 'app',

  state: {
    user: {},       // 存放当前登录用户的对象容器
    menuPopoverVisible: false,
    siderFold: localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    loginLoading: false,
  },

  subscriptions: {
    // 1.从 cookie 中查询是否有用户登录过；2.注册窗口变化时菜单导航条效果
    setup ({ dispatch }) {
      dispatch({ type: 'query' });
      let tid;
      window.onresize = () => {
        clearTimeout(tid);
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' });
        }, 300);
      };
    },
  },

  effects: {

    // 从 cookie 中查询是否有用户登录并进行响应跳转
    * query ({ payload }, { call, put }) {
      const result = yield call(query, parse(payload));

        /**
         * 返回 JSON 固定格式：
         * {
         *    code: '0000',   // 响应状态，0000 表示成功，9999 表示失败
         *    data: {
         *       // 后台返回的数据
         *    },
         * }
         */

      // cookie 中有用户登录过，直接跳转到对应路由
      if (result.code === '0000' && result.data) {
        yield put({
          type: 'querySuccess',
          payload: result.data,
        });

        if (location.pathname === '/login') {
          yield put(routerRedux.push('/welcome'))
        }
      } else {
        // cookie 中没有用户登录过或者 cookie 过期，重定向到 /login 路由，跳转登录页面
        if (location.pathname !== '/login') {
          let from = location.pathname;
          window.location = `${location.origin}/login?from=${from}`;
        }
      }
    },

    // 用户登录，验证登录名和密码是否正确
    *login ({payload}, { put, call }) {
        // showLoginLoading 和 hideLoginLoading 是处理验证用户密码过程中的过渡效果
        yield put({ type: 'showLoginLoading' });
        const data = yield call(login, payload);
        yield put({ type: 'hideLoginLoading' });

        if (data.success) {
            const from = queryURL('from');
            yield put({ type: 'query' });
            if (from) {
                yield put(routerRedux.push(from));
            } else {
                yield put(routerRedux.push('/welcome'));
            }
        } else {
            throw data;
        }
    },

    // 用户注销，清空 cookie 信息
    * logout ({ payload }, { call, put }) {
      const data = yield call(logout, parse(payload));
      if (data.success) {
        yield put({ type: 'query' });
      } else {
        throw (data);
      }
    },

    // 窗口变化时，控制菜单导航条显示 or 隐藏
    * changeNavbar ({ payload }, { put, select }) {
      const { app } = yield (select(_ => _));
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar });
      }
    },

  },
  reducers: {
    querySuccess (state, { payload: user }) {
      return {
        ...state,
        user,
      };
    },

    switchSider (state) {
      localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },

    switchTheme (state) {
      localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      };
    },

    switchMenuPopver (state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      };
    },

    // 控制菜单导航条隐藏/显示
    handleNavbar (state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      };
    },

    handleNavOpenKeys (state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      };
    },

    // 用户登录接口中验证用户密码显示过渡效果
    showLoginLoading (state) {
      return {
          ...state,
          loginLoading: true,
      };
    },

    // 用户登录接口中验证用户密码隐藏过渡效果
    hideLoginLoading (state) {
      return {
          ...state,
          loginLoading: false,
      };
    },
  },
};
