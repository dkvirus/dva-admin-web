import qs from 'qs';
import fs from 'fs';
import path from 'path';
import menu from '../../assets/utils/menu.json';
import {geneTemp, delTemp, updateRouterWithDel} from '../../assets/template/index';

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

// 解析 ID，online-param-inboundChannel => [ 'online', 'online-param', 'online-param-inboundChannel' ]
function parseMenu (menu) {
    const idArr = menu.id.split('-');

    const menuArr = [];
    let count = 1;
    for (let i = 1; i <= idArr.length; i++) {	// idArr 有几个值，循环几次

        if (count === i) {
            let o = {};

            if (count === idArr.length) {   // 叶子节点
                o = {
                    "id": idArr.slice(0, count).join('-'),
                    "name": menu.name,
                    "icon": "bars",
                    "router": menu.router,
                    "authorities": []
                }

                // menu.router 有值，说明可以点
                if (idArr.length !== 1) {
                    o.bpid = o.mpid = idArr.slice(0, count-1).join('-');
                }

            } else if (count === 1) {		// 最上级节点
                o = {
                    "id": idArr[0],
                    "name": menu.name + '的祖先节点' + count,
                    "icon": "bars",
                    "authorities": []
                }
            } else {	// 中间节点
                o = {
                    "id": idArr.slice(0, count).join('-'),
                    "name": menu.name + '的祖先节点' + count,
                    "bpid": idArr.slice(0, count-1).join('-'),
                    "mpid": idArr.slice(0, count-1).join('-'),
                    "icon": "bars",
                    "authorities": []
                }
            }

            menuArr.push(o);
            count++;
        } else {
            continue;
        }

    }

    return menuArr;
}

export default {

    // 模拟查询 cookie 中用户信息
    [`GET ${apiPrefix}/app/me`] (req, res) {
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), {delimiter: ';'});
        const response = {};
        const data = {};
        // cookies.token 令牌不存在，说明没有登录
        if (!cookies.token) {
            res.status(200).send({message: 'Not Login'});
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
        const {username, password} = req.body;
        const user = adminUsers.filter(item => item.username === username);

        if (user.length > 0 && user[0].password === password) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            // 设置新的 cookie
            res.cookie('token', JSON.stringify({id: user[0].id, deadline: now.getTime()}), {
                maxAge: 900000,
                httpOnly: true,
            });
            // 设置 code 属性
            res.json({code: '0000', success: true, message: 'Ok'});
        } else {
            res.status(400).end();
        }
    },

    // 模拟注销接口，清空 cookie 中的令牌
    [`GET ${apiPrefix}/logout`] (req, res) {
        res.clearCookie('token');
        res.json({code: '0000', success: true, message: 'Ok'});
        res.status(200).end()
    },

    // 查询菜单列表
    [`GET ${apiPrefix}/system/menu`] (req, res) {
        res.status(200).json({code: '0000', data: menus})
    },

    // 添加一个菜单
    [`POST ${apiPrefix}/system/menu`] (req, res) {
        const newMenu = req.body;

        // 解析 ID
        const menuArr = parseMenu(newMenu);

        // 判断 menus 中是否包含 menuArr 中每一项
        menuArr.map(menu => {
            let result = menus.findIndex(function (item) {
                return item.id === menu.id;
            });

            if (!~result) {
                menus.push(menu);
            }
        });

        // menus.push(newMenu);
        const data = JSON.stringify({"menus": menus});

        // 修改 menu.json 文件
        fs.writeFileSync(path.join(process.cwd(), 'src/assets/utils/menu.json'), data);

        // 生成模板文件
        geneTemp(newMenu);

        res.status(200).json({code: '0000'})
    },

    // 删除一个菜单
    [`DELETE ${apiPrefix}/system/menu/:id`] (req, res) {
        const {id} = req.params;
        const delMenu = menus.filter(item => String(item.id) === id);
        menus = menus.filter(item => String(item.id) !== id);
        const data = JSON.stringify({"menus": menus});

        // 修改 menu.json 文件
        fs.writeFileSync(path.join(process.cwd(), 'src/assets/utils/menu.json'), data);

        if (delMenu.router) {
            updateRouterWithDel(delMenu[0]);

            delTemp(delMenu[0]);
        }

        res.status(200).json({code: '0000'})

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

        res.status(200).json({code: '0000'})

    },
};
