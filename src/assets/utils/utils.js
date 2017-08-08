import lodash from 'lodash';

// 连字符转驼峰
String.prototype.hyphenToHump = function () {
    return this.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase();
    });
};

// 驼峰转连字符
String.prototype.humpToHyphen = function () {
    return this.replace(/([A-Z])/g, '-$1').toLowerCase();
};

// 日期格式化
Date.prototype.format = function (format) {
    const o = {
        'M+': this.getMonth() + 1,
        'd+': this.getDate(),
        'h+': this.getHours(),
        'H+': this.getHours(),
        'm+': this.getMinutes(),
        's+': this.getSeconds(),
        'q+': Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds(),
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, `${this.getFullYear()}`.substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp(`(${k})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : (`00${o[k]}`).substr(`${o[k]}`.length));
        }
    }
    return format;
};


/**
 * @param   {String}
 * @return  {String}
 */
const queryURL = (name) => {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
};

/**
 * 数组内查询
 * @param   {array}      array
 * @param   {String}    id
 * @param   {String}    keyAlias
 * @return  {Array}
 */
const queryArray = (array, key, keyAlias = 'key') => {
    if (!(array instanceof Array)) {
        return null;
    }
    const item = array.filter(_ => _[keyAlias] === key);
    if (item.length) {
        return item[0];
    }
    return null;
};

/**
 * 数组格式转树状结构
 * @param   {array}     array
 * @param   {String}    id
 * @param   {String}    pid
 * @param   {String}    children
 * @return  {Array}
 */
const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
    let data = lodash.cloneDeep(array);
    let result = [];
    let hash = {};
    data.forEach((item, index) => {
        hash[data[index][id]] = data[index];
    });

    data.forEach((item) => {
        let hashVP = hash[item[pid]];
        if (hashVP) {
            !hashVP[children] && (hashVP[children] = []);
            hashVP[children].push(item);
        } else {
            result.push(item);
        }
    });
    return result;
};

/**
 * 过滤当前用户拥有的菜单
 * @param menuArray
 * @param authorities
 */
const filterMenus = (menuArray, authorities = []) => {
    // 获取菜单数组的复制份，接下来所有操作都对它处理，并最终返回它
    let menuArr = lodash.cloneDeep(menuArray);
    // 判断当前登录用户拥有权限与菜单的 authorities 权限数组是否有交集，没有交集就在菜单数组中删除该菜单
    const noMenus = [];
    for (let i = 0; i < menuArr.length; i++) {
        if (menuArr[i].authorities.filter((leaf) => authorities.includes(leaf.trim())).length === 0) {
            noMenus.push(menuArr[i].id);
        }
    }
    menuArr = menuArr.filter(item => !noMenus.includes(item.id));
    return menuArr;
};

const getTitle = (modalType) => {
  let title = '';
  switch (modalType) {
    case 'create':
      title = '新增';
      break;
    case 'update':
      title = '编辑';
      break;
    case 'check':
      title = '查看';
      break;
    default:
  }
  return title;
};

/**
 * 获取穿梭框所需的目标 ID 数组，角色模块中有用到
 * @param arr [{id: 1, name: 11}, {id: 2, name: 22}]
 * @returns {Array} [1, 2]
 */
const getTargetKeys = (arr = []) => {
  let hadKey = [];
  // 获取所有数组中 ID 的集合
  for (let i = 0; i < arr.length; i++) {
    hadKey.push(arr[i].id);
  }

  return hadKey;
}

const getObjByKeys = (keys, source) => {
  let arr = [];
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < source.length; j++) {
      if (keys[i] === source[j].id) {
        arr.push(source[j]);
      }
    }
  }
  return arr;
}

module.exports = {
    queryURL,
    queryArray,
    arrayToTree,
    filterMenus,
    getTitle,
    getTargetKeys,
    getObjByKeys
}