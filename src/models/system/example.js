import * as request from '../../services/system/example';
import { message } from 'antd';

export default {
  namespace: 'systemExample',
  state: {
    list: [],               /* 列表数组*/
    currentItem: {},        /* 存放一条数据的对象*/
    selectedRowKeys: [],    /* 用于列表中显示复选框*/
    modalType: 'create',    /* 模态框类型，默认 create*/
    modalVisible: false,    /* 模态框是否显示*/
  },
  subscriptions: {
    /**
     * 监听浏览器地址，当跳转到 /xxx/xx 时查询列表数据
     * @param dispatch 触发器，用于触发 effects 中的 query 方法
     * @param history 浏览器历史记录，主要用到它的 location 属性以获取地址栏地址
     */
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/system/example') {
          dispatch({
            type: 'query',
            payload: location.query,
          });
        }
      });
    },
  },
  effects: {
    /**
     * 新增一条数据
     * @param payload 实体类对象
     * @param call 调用 services 层接口；第二个参数不允许为 undefined，没有参数可以设置为空对象 {}
     * @param put 触发 reducers 中的方法
     */
    * create ({ payload }, { call, put }) {
      const result = yield call(request.create, payload);
      if (result.code === '0000') {
        yield put({ type: 'hideModal' });
        yield put({ type: 'query' });
        message.success('操作成功！');
      } else {
        throw result.message;
      }
    },
    /**
     * 删除一条数据
     * @param payload 包含主键的对象
     * @param call 调用 services 层接口；第二个参数不允许为 undefined，没有参数可以设置为空对象 {}
     * @param put 触发 reducers 中的方法
     */
    * remove ({ payload }, { call, put }) {
      const result = yield call(request.remove, payload);
      if (result.code === '0000') {
        yield put({ type: 'query' });
        message.success('操作成功！');
      } else {
        throw result.message;
      }
    },
    /**
     * 修改一条数据
     * @param payload 实体类对象
     * @param call 调用 services 层接口；第二个参数不允许为 undefined，没有参数可以设置为空对象 {}
     * @param put 触发 reducers 中的方法
     * @param select 用于获取全局状态 systemExample 从而获取到当前操作的那条数据 currentItem
     */
    * update ({ payload }, { call, put, select }) {
      const item = yield select(({ systemExample }) => systemExample.currentItem);
      const result = yield call(request.update, { ...item, ...payload });
      if (result.code === '0000') {
        yield put({ type: 'hideModal' });
        yield put({ type: 'query' });
        message.success('操作成功！');
      } else {
        throw result.message;
      }
    },
    /**
     * 查询列表数据
     * @param payload 参数对象，为空时表示查询全部
     * @param call 调用 services 层接口；第二个参数不允许为 undefined，没有参数可以设置为空对象 {}
     * @param put 触发 reducers 中的方法
     */
    * query ({ payload }, { call, put }) {
      const result = yield call(request.query, payload || {});
      if (result.code === '0000') {
        yield put({ type: 'updateState', payload: { list: result.data.content } });
      } else {
        throw result.message;
      }
    },

  },
  reducers: {
    /**
     * 更新状态值，返回新的状态
     * @param state 老的状态值
     * @param payload 需要改变的状态值对象
     * @returns undefined
     */
    updateState (state, { payload }) {
      return { ...state, ...payload };
    },
    /**
     * 隐藏模态框，只需要将 modalVisible 改为 false 即可
     * @param state 老的状态值
     * @returns {{modalVisible: boolean}}
     */
    hideModal (state) {
      return { ...state, modalVisible: false };
    },
    /**
     * 显示模态框，具体处理业务时还需要其它参数
     * @param state 老的状态值
     * @param payload 其它需要更新的状态值
     * @returns {{modalVisible: boolean}}
     */
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true };
    },
  },
};
