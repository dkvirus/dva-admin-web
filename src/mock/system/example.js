const Mock = require('mockjs');

// mock 提供接口的 url 前缀
const apiPrefix = '/api/v2';

let database = [
    {
        id: 1,
        firstName: '张',
        lastName: '飞'
    },
    {
        id: 2,
        firstName: '关',
        lastName: '羽'
    }
]

module.exports = {

    // 增
    [`POST ${apiPrefix}/system/example`] (req, res) {
        const newData = req.body;

        newData.id = Mock.mock('@id');

        database.unshift(newData);
        res.status(200).json({ code: '0000'});
    },

    // 删
    [`DELETE ${apiPrefix}/system/example/:id`] (req, res) {
        const { id } = req.params;

        database = database.filter(item => String(item.id) !== id)
        res.status(200).json({ code: '0000', message: '操作成功'});

    },

    // 改
    [`PATCH ${apiPrefix}/system/example/:id`] (req, res) {
        const { id } = req.params
        const editItem = req.body
        let isExist = false

        database = database.map((item) => {
            if (String(item.id) === id) {
                isExist = true
                return Object.assign({}, item, editItem)
            }
            return item
        })

        if (isExist) {
            res.status(200).json({ code: '0000', message: '操作成功'});
        } else {
            res.status(404).json({ code: '9999', message: 'Not Found' })
        }
    },

    // 查
    [`GET ${apiPrefix}/system/example`] (req, res) {
        res.status(200).json({ code: '0000', data: {content: database} })
    },

}