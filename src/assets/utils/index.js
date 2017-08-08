import config from './config';
import menu from './menu';
import request from './request';
import classnames from 'classnames';
import { color } from './theme';
import { queryURL, queryArray, arrayToTree, filterMenus, getTitle, getTargetKeys, getObjByKeys } from './utils';

module.exports = {
  config,
  menu,
  request,
  color,
  classnames,
  queryURL,
  queryArray,
  arrayToTree,
  filterMenus,
  getTitle,
  getTargetKeys,
  getObjByKeys
};
