const octopus = '/api/v1';
const mock = '/api/v2';

module.exports = {
  name: 'Dva Admin',    /* 名称，包含菜单导航条和浏览器菜单栏*/
  footerText: 'Dva Admin © dkvirus',   /* 网站底部log*/
  logo: '/dva.png',   /* logo 头像，包含菜单导航条和浏览器菜单栏*/
  iconFontCSS: '/iconfont.css',
  iconFontJS: '/iconfont.js',
  openPages: ['/login'],
  apiPrefix: mock,    /* 使用 mock 进行开发还是从 octopus 后台拿接口*/
  isPermisson: false, // 是否使用权限机制，true 为使用只能看到拥有权限的菜单，false 不使用看见全部菜单
  api: {
    userLogin: '/login',
    userLogout: '/logout',
    userInfo: '/app/me'
  },
};
