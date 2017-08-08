import request from '{{request}}';

const commUrl = '{{commUrl}}';
const commUrlHasId = '{{commUrl}}/:id';

/**
 * 新增一条数据
 * @param params 待添加的实体类对象
 * @returns {Promise.<void>}
 */
export async function create (params) {
  return request({
    url: commUrl,
    method: 'post',
    data: params,
  });
}

/**
 * 删除一条数据
 * @param params 包含主键的对象
 * @returns {Promise.<void>}
 */
export async function remove (params) {
  return request({
    url: commUrlHasId,
    method: 'delete',
    data: params,
  });
}

/**
 * 修改一条数据
 * @param params 修改后的实体类对象
 * @returns {Promise.<void>}
 */
export async function update (params) {
  return request({
    url: commUrlHasId,
    method: 'patch',
    data: params,
  });
}

/**
 * 查询列表
 * @param params 为空时表示查询全部；也可以是包含名称的对象，根据名称进行模糊查询
 * @returns {Promise.<void>}
 */
export async function query (params) {
  return request({
    url: commUrl,
    method: 'get',
    data: params,
  });
}
