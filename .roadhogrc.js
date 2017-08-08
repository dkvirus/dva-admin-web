const path = require('path')

const svgSpriteDirs = [
    path.resolve(__dirname, 'src/svg/'),
    require.resolve('antd').replace(/index\.js$/, ''),
]

export default {
    entry: 'src/assets/index.js',
    svgSpriteLoaderDirs: svgSpriteDirs,
    "theme": "./theme.config.js",
    "extraBabelPlugins": [
        "transform-runtime",
        ["import", {"libraryName": "antd", "style": true}]
    ],
    // 接口代理示例
    "proxy": {
        "/api/v1": {
            "target": "http://localhost:8080/api",
            "changeOrigin": true,
            "pathRewrite": {"^/api/v1": "/v1"}
        }
    },
    "env": {
        "development": {
            "extraBabelPlugins": [
                "dva-hmr"
            ]
        },
    }
}
