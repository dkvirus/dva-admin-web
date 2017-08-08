let fs = require('fs');
let path = require('path');
let fs2 = require('./fs2');

// 生成
function geneTemp (menu) {
    geneServices(menu);
    geneModels(menu);
    geneRoutes(menu);
    geneMocks(menu);
    updateRouter(menu);
}

// 生成 services 目录下的文件
function geneServices (menu) {
    const src = path.join(process.cwd(), 'src/assets/template/archetype/service.js');

    // 获取模板文件的字符串
    fs.readFile(src, function (err, data) {
        if (err) {
            console.log(err);
        }

        let body = data.toString(); // 模板内容

        // 获取新增菜单相关参数，替换字符串
        const line = new RegExp('-', 'g');
        const count = String(menu.id).match(line).length;
        let request = '';
        if (count === 1) {
            request = '../../assets/utils/request';
        } else if (count === 2) {
            request = '../../../assets/utils/request';
        }
        const regex = /(\{\{\s*(\w*)\s*\}\})/g;
        const params = {
            commUrl: menu.router,
            request: request
        }
        while (regex.exec(body)) {
            body = body.replace(new RegExp(RegExp.$1, 'g'), params[RegExp.$2]);
        }

        // /system/menu  创建目录
        // 从 __dirname 下开始判断是否有 src/services/test 目录
        const dest = path.join(process.cwd(), 'src/services', path.dirname(menu.router));
        const filename = path.basename(menu.router) + '.js';
        if (!fs2.isdir(dest)) {
            // 指定路径下没有该目录,创建该目录
            fs2.mkdir(dest);
            fs.writeFile(path.join(dest, filename), body, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Service: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
            })
        } else {
            // 指定路径下有该目录
            // 判断该目录中是否有该文件
            if (fs2.include(filename, dest)) {
                console.log('Service: 文件 ' + filename + ' 创建失败，原因为文件已存在，无法新增同名文件， 路径为：' + path.join(dest, filename));
            } else {
                fs.writeFile(path.join(dest, filename), body, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Service: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
                })
            }
        }

    });
}

// 生成 models 目录下的文件
function geneModels (menu) {

    const src = path.join(process.cwd(), 'src/assets/template/archetype/model.js');

    // 获取模板文件的字符串
    fs.readFile(src, function (err, data) {
        if (err) {
            console.log(err);
        }

        let body = data.toString(); // 模板内容

        // 获取新增菜单相关参数，替换字符串
        // ../../services/system/menu
        const line = new RegExp('-', 'g');
        const count = String(menu.id).match(line).length;
        let services = '';
        if (count === 1) {
            services = '../../services'+menu.router;
        } else if (count === 2) {
            services = '../../../services'+menu.router;
        }
        const regex = /(\{\{\s*(\w*)\s*\}\})/g;
        const namespace = hyphenToHump(String(menu.id));       // system-menu => systemMenu

        const params = {
            namespace: namespace,
            services: services,
            pathname: menu.router
        }
        while (regex.exec(body)) {
            body = body.replace(new RegExp(RegExp.$1, 'g'), params[RegExp.$2]);
        }

        // /system/menu  创建目录
        const dest = path.join(process.cwd(), 'src/models', path.dirname(menu.router));
        const filename = path.basename(menu.router) + '.js';
        if (!fs2.isdir(dest)) {
            // 指定路径下没有该目录,创建该目录
            fs2.mkdir(dest);
            fs.writeFile(path.join(dest, filename), body, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Models: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
            })
        } else {
            // 指定路径下有该目录
            // 判断该目录中是否有该文件
            if (fs2.include(filename, dest)) {
                console.log('Models: 文件 ' + filename + ' 创建失败，原因为文件已存在，无法新增同名文件， 路径为：' + path.join(dest, filename));
            } else {
                fs.writeFile(path.join(dest, filename), body, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Models: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
                })
            }
        }

    });


}

// 生成 routes 目录下的文件
function geneRoutes (menu) {

    const src = path.join(process.cwd(), 'src/assets/template/archetype/router');
    const dest = path.join(process.cwd(), 'src/routes', menu.router);
    const namespace = hyphenToHump(String(menu.id));  // systemExample
    const moduleName = namespace.substring(String(menu.mpid).length);
    const line = new RegExp('-', 'g');
    const count = String(menu.id).match(line).length;
    let utils = '';
    if (count === 1) {
        utils = '../../../assets/utils';
    } else if (count === 2) {
        utils = '../../../../assets/utils';
    }
    const params = {
        namespace: namespace,
        utils: utils,
        moduleName: moduleName
    };

    fs2.mkdir(dest);

    // 读取 src 目录下所有文件，异步的方式写入指定目录
    fs.readdir(src, function(err, files){
        if (err) {
            return console.error(err);
        }

        files.forEach(function (file){

            fs.readFile(path.join(src, file), function (err, data) {

                if (err) {
                    return console.error(err);
                }

                let dataStr = data.toString();

                if (file === 'index.js') {

                    // 获取参数 params ，替换模板文件
                    let regex = /(\{\{\s*(\w*)\s*\}\})/g;

                    while (regex.exec(dataStr)) {
                        dataStr = dataStr.replace(new RegExp(RegExp.$1, 'g'), params[RegExp.$2]);
                    }
                }

                fs.writeFile(path.join(dest, file), dataStr,  function(err) {
                    if (err) {
                        console.log('写文件错误 =========================== ');
                        return console.error(err);
                    }

                    console.log('Router: 文件' + file + '创建成功, 路径为：' + path.join(dest, file));
                });

            });
        });

    });

}

// 生成 mock 目录下的文件
function geneMocks (menu) {

    const src = path.join(process.cwd(), 'src/assets/template/archetype/mock.js');

    // 获取模板文件的字符串
    fs.readFile(src, function (err, data) {
        if (err) {
            console.log(err);
        }

        let body = data.toString(); // 模板内容

        // 替换字符串
        const regex = /(\{\{\s*(\w*)\s*\}\})/g;
        const params = {
            router: menu.router
        }
        while (regex.exec(body)) {
            body = body.replace(new RegExp(RegExp.$1, 'g'), params[RegExp.$2]);
        }

        //   创建目录
        const dest = path.join(process.cwd(), 'src/mock', path.dirname(menu.router));
        const filename = path.basename(menu.router) + '.js';
        if (!fs2.isdir(dest)) {
            // 指定路径下没有该目录,创建该目录
            fs2.mkdir(dest);
            fs.writeFile(path.join(dest, filename), body, function (err) {
                if (err) {
                    console.error(err);
                }
                console.log('Mocks: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
            })
        } else {
            // 指定路径下有该目录
            // 判断该目录中是否有该文件
            if (fs2.include(filename, dest)) {
                console.log('Mocks: 文件 ' + filename + ' 创建失败，原因为文件已存在，无法新增同名文件， 路径为：' + path.join(dest, filename));
            } else {
                fs.writeFile(path.join(dest, filename), body, function (err) {
                    if (err) {
                        console.error(err);
                    }
                    console.log('Mocks: 文件 ' + filename + ' 创建成功，路径为: ' + path.join(dest, filename));
                })
            }
        }

    });

}

function updateRouter (menu) {
    fs.readFile(path.join(process.cwd(), 'src/assets/router.js'), function (err, data) {
        let dataStr = data.toString();

        let lines = dataStr.split('\n');

        let prevlines = [],
            nextlines = [],
            datalines = [];

        let prev = false,
            next = false;

        lines.forEach(function (line) {
            if (~line.indexOf('数据源开始')) {
                prev = true;
            }
            if (~line.indexOf('数据源结束')) {
                next = true;
            }

            if (prev === false) {
                prevlines.push(line);
            } else if (next === false) {
                datalines.push(line);
            } else {
                nextlines.push(line);
            }

        });

        // 新增
        datalines = addMenu(menu, datalines);

        lines = prevlines.concat(datalines).concat(nextlines);

        dataStr = lines.join('\n');

        fs.writeFile(path.join(process.cwd(), 'src/assets/router.js'), dataStr, function (err) {
            if (err) console.error(err);
        })

    });
}

function addMenu (menu, datalines) {
    // 解析数组，获取 path 属性对应的数组
    let pathArr = getPathArr(datalines);

    // 新增菜单的 menu.router 在数组中存在，说明已经添加过，返回
    if (pathArr.includes(menu.router.substr(1))) {
        return;
    }

    // 不存在，解析 menu 拼接新菜单数据追加到 datalines 中
    let path = menu.router.substr(1);
    let models = '../models' + menu.router;
    let routes = '../routes' + menu.router + '/index';

    let newMenu = [];
    newMenu.push('      {\r');
    newMenu.push(`          path: \'${path}\',\r`);
    newMenu.push('          getComponent (nextState, cb) {\r');
    newMenu.push('              require.ensure([], require => {\r');
    newMenu.push(`                  registerModel(app, require(\'${models}\'));\r`);
    newMenu.push(`                  cb(null, require(\'${routes}\'));\r`);
    newMenu.push(`              }, \'${menu.id}\');\r`);
    newMenu.push('          },\r');
    newMenu.push('      },\r');

    let errorArr = [
        '      {\r',
        '          path: \'*\',\r',
        '          getComponent (nextState, cb) {\r',
        '              require.ensure([], require => {\r',
        '                  registerModel(app, require(\'../models/system/app\'));\r',
        '                  cb(null, require(\'../routes/system/error/index\'));\r',
        '              }, \'error\');\r',
        '          },\r',
        '      },\r',
        '  ];\r'
    ]
    // 合并数组
    datalines = datalines.slice(0, datalines.length-10).concat(newMenu).concat(errorArr);

    // 返回数组
    return datalines;
}

// 获取 paht 数组
function getPathArr (datalines) {
    let pathArr = [];
    for (let i = 3; i < datalines.length; i=i+9) {
        pathArr.push(datalines[i].split('\'')[1]);
    }
    return pathArr;
}

// 连字符转驼峰 aa-bb-cc  ==>   aaBbCc
function hyphenToHump (str) {
    return str.replace(/-(\w)/g, (...args) => {
        return args[1].toUpperCase();
    });
}

// 删除
function delTemp (menu) {

    console.log('=================================')
    console.log(menu);

    // 删除 services 下文件
    try {
        fs2.destory(path.join(process.cwd(), 'src/services', menu.router + '.js'));

        fs2.destory(path.join(process.cwd(), 'src/models', menu.router + '.js'));

        fs2.destory(path.join(process.cwd(), 'src/routes', menu.router));

        fs2.destory(path.join(process.cwd(), 'src/mock', menu.router + '.js'));
    } catch (e) {
        console.log('error =====================================');
    }


}

function updateRouterWithDel (menu) {
    fs.readFile(path.join(process.cwd(), 'src/assets/router.js'), function (err, data) {
        let dataStr = data.toString();

        let lines = dataStr.split('\n');

        let prevlines = [],
            nextlines = [],
            datalines = [];

        let prev = false,
            next = false;

        lines.forEach(function (line) {
            if (~line.indexOf('数据源开始')) {
                prev = true;
            }
            if (~line.indexOf('数据源结束')) {
                next = true;
            }

            if (prev === false) {
                prevlines.push(line);
            } else if (next === false) {
                datalines.push(line);
            } else {
                nextlines.push(line);
            }

        });

        // 新增
        datalines = delMenu(menu, datalines);

        lines = prevlines.concat(datalines).concat(nextlines);

        dataStr = lines.join('\n');

        fs.writeFile(path.join(process.cwd(), 'src/assets/router.js'), dataStr, function (err) {
            if (err) console.error(err);
        })

    });

}

function delMenu (menu, datalines) {
    // 解析数组，获取 path 属性对应的数组
    let pathArr = getPathArr(datalines);

    if (!pathArr.includes(String(menu.router).substring(1))) {
        return;
    }

    let index = datalines.findIndex(function(value, index, arr) {
        return value.includes(menu.router.substr(1));
    })

    let start = index - 1;
    let end = index + 8;

    datalines = datalines.slice(0, start).concat(datalines.slice(end));
    return datalines;
}

module.exports = {
    geneTemp,
    delTemp,
    updateRouterWithDel
}