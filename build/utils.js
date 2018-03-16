'use strict'
const path = require('path')
const glob = require('glob')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
//引入页面模版
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于做相应的merge处理
const merge = require('webpack-merge')
//取得/src/entry下的所有入口文件
var PAGE_PATH = path.resolve(__dirname, '../src/entry')
//取得/html下的所有html文件
var PAGE_HTML_PATH = path.resolve(__dirname, '../html')

//动态设置多页面入口
exports.entries = function() {
    var entryFiles = glob.sync(PAGE_PATH + '/*.js')//获取当前路径下所有.js的文件
    var map = {}
    entryFiles.forEach((filePath) => {
        var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        if(process.env.NODE_ENV === 'production'){//生产环境过滤不打包系统
            if (process.env.filterSystem.indexOf(filename) < 0) {
                map[filename] = filePath
            }
        }
    })
    return map
}

//动态获取html文件 与上面的多页面入口配置相同，读取html文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function() {
    let entryHtml = glob.sync(PAGE_HTML_PATH + '/*.html')
    let arr = []
    entryHtml.forEach((filePath) => {
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'))
        let conf = {
            // 文件名称
            filename: filename + '.html',
            // 模板来源
            template: filePath,
            // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
            chunks: ['manifest', 'vendor', filename],
            inject: true
        }
        if (process.env.NODE_ENV === 'production') {//生产环境
            if (process.env.filterSystem.indexOf(filename) >= 0) {//过滤不需要打包系统
                return ;
            }
            conf = merge(conf, {
                //压缩HTML文件
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                //按照模块的依赖关系依次加载，即：manifest，vendor，本页面入口，其他页面入口.
                chunksSortMode: 'dependency'
            })
        }
        console.log(conf)
        arr.push(new HtmlWebpackPlugin(conf))
    })
    return arr
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
