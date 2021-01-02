const path = require('path')
function resolve(dir) {
    return path.join(__dirname, '.', dir)
}
module.exports = {
    outputDir: 'dist',
    lintOnSave: true,
    publicPath: './',
    // 是否为生产环境构建生成 source map
    productionSourceMap: false,
    chainWebpack: config => {
        config.module.rules.delete("svg"); //重点:删除默认配置中处理svg,
        //const svgRule = config.module.rule('svg')
        //svgRule.uses.clear()
        config.module
            .rule('svg-sprite-loader')
            .test(/\.svg$/)
            .include
            .add(resolve('src/icons')) //处理svg目录
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
    },
    configureWebpack: config => {
        config.externals = {
            jquery: 'jQuery',
            // jqprint:'jqprint'
        }
    },
    devServer: {
        // host: '127.0.0.1',
        port: 8080,
        disableHostCheck: true,
        // proxy: 'http://qa56ems.test.dfs800.com/', //@董鹏 测试环境
        // proxy: 'http://qa53ems.test.dfs800.com/', //@张桂梁 测试环境
        // proxy: 'http://qa54ems.test.dfs800.com/',//@贺俊宪 测试环境
        // proxy: 'http://ems.htj.com/',//@贺俊宪(贺俊宪) 测试环境
        // proxy: 'http://biu.test.dfs800.com/',//王星测试环境
        // proxy: 'http://qa32.test.dfs800.com/',//张凤趁测试环境
        // proxy: 'http://qa51ems.test.dfs800.com/',//韩晓刚测试环境
        // proxy: 'http://ems.qa28.test.dfs800.com/'
        // proxy: 'http://haowenzhi01.ems.test.dfs800.com/',//开发-测试环境域名
        proxy: 'http://ldq.ems.test.dfs800.com/',//开发-测试环境域名
        // proxy: 'http://qa47.ems.test.dfs800.com/',//@郭俊虎 测试环境
        // proxy: 'http://ems.dfs800.com/'//正式环境域名
        // proxy: 'http://anna.ems.test.dfs800.com/'//anna环境域名
    }
}