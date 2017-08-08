import qs from 'qs';
import fs from 'fs';
import path from 'path';
import menu from '../../assets/utils/menu.json';
import { geneTemp, delTemp, updateRouterWithDel } from '../../assets/template/index';

// mock 提供接口的 url 前缀
const apiPrefix = '/api/v2';

let menus = menu.menus;

// 模拟接口提供的用户信息
const adminUsers = [
  {
    id: 0,
    username: 'admin',
    password: 'admin',
  }, {
    id: 1,
    username: 'guest',
    password: 'guest',
  }, {
    id: 2,
    username: '吴彦祖',
    password: '123456',
  },
];

export default {

  // 模拟查询 cookie 中用户信息
  [`GET ${apiPrefix}/app/me`] (req, res) {
    const cookie = req.headers.cookie || '';
    const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
    const response = {};
    const data = {};
    // cookies.token 令牌不存在，说明没有登录
    if (!cookies.token) {
        res.status(200).send({ message: 'Not Login' });
        return;
    }
    // 令牌存在，判断 cookie 时间是否失效
    const token = JSON.parse(cookies.token);
    if (token) {
        response.success = token.deadline > new Date().getTime();
    }
    // cookie 未失效，从令牌中取出当前登录的用户
    if (response.success) {
        // 设置 code 属性
        response.code = '0000';
        const userItem = adminUsers.filter(_ => _.id === token.id);
        if (userItem.length > 0) {
            data.name = userItem[0].username;
            data.id = userItem[0].id;
        }
    }
    // 设置 data 属性
    response.data = data;
    res.json(response);
  },

  // 模拟用户密码验证接口
  [`POST ${apiPrefix}/login`] (req, res) {
    const { username, password } = req.body;
    const user = adminUsers.filter(item => item.username === username);

    if (user.length > 0 && user[0].password === password) {
      const now = new Date();
      now.setDate(now.getDate() + 1);
      // 设置新的 cookie
      res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
        maxAge: 900000,
        httpOnly: true,
      });
      // 设置 code 属性
      res.json({ code: '0000', success: true, message: 'Ok' });
    } else {
      res.status(400).end();
    }
  },

  // 模拟注销接口，清空 cookie 中的令牌
  [`GET ${apiPrefix}/logout`] (req, res) {
    res.clearCookie('token');
    res.json({ code: '0000', success: true, message: 'Ok' });
    res.status(200).end()
  },

  // 查询菜单列表
  [`GET ${apiPrefix}/system/menu`] (req, res) {
    res.status(200).json({ code: '0000', data: menus })
  },

  // 添加一个菜单
  [`POST ${apiPrefix}/system/menu`] (req, res) {
    const newMenu = req.body;

    // TODO 嵌套菜单
    //   system-aaa-bbb  分成 system  、 system-aaa  、 system-aaa-bbb
    // step1 根据传入的 ID 获取分组 ['system', 'system-aaa', 'system-aaa-bbb'] arr
    // step2 获取 menu.json 文件中 menu 数组
    // step3 校验 arr 中哪些在 menu 中没有 ['rbac', 'user']
    //




    menus.push(newMenu);
    const data = JSON.stringify({"menus": menus});

    // 修改 menu.json 文件
    fs.writeFileSync(path.join(process.cwd(), 'src/assets/utils/menu.json'), data);

    // 生成模板文件
    geneTemp(newMenu);

    res.status(200).json({ code: '0000'})
  },

  // 删除一个菜单
  [`DELETE ${apiPrefix}/system/menu/:id`] (req, res) {
    const { id } = req.params;
    const delMenu = menus.filter(item => String(item.id) === id);
    menus = menus.filter(item => String(item.id) !== id);
    const data = JSON.stringify({"menus": menus});


    // 修改 menu.json 文件
    fs.writeFileSync(path.join(process.cwd(), 'src/assets/utils/menu.json'), data);

    updateRouterWithDel(delMenu[0]);

    delTemp(delMenu[0]);

    res.status(200).json({ code: '0000' })

  },

  // 修改一个菜单
  [`PATCH ${apiPrefix}/system/menu/:id`] (req, res) {
      const payload = req.body;
      payload.id = req.params.id;

      for (let i = 0; i < menus.length; i++) {
        if (menus[i].id === payload.id) {
          menus[i] = payload;
        }
      }

      const data = JSON.stringify({"menus": menus});

      // 修改 menu.json 文件
      fs.writeFileSync(path.join(process.cwd(), 'src/assets/utils/menu.json'), data);

      res.status(200).json({ code: '0000' })

  },
};
