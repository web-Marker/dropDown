/*
* @Author: mark
* @Date:   2017-03-02 10:16:35
* @Last Modified by:   mark
* @Last Modified time: 2017-07-18 09:57:07
*/
//new webpack.optimize.CommonsChunkPlugin('./bundle/commons.js') //页面多起来可以用];
var webpack = require('webpack'),
	path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    cleanWebpackPlugin = require('clean-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    fs = require('fs'),
    fsArr = fs.readdirSync('./src'),
    cssMin,config;

module.exports = function(env) {

    config = {
        entry:{
            vendor:path.resolve(__dirname,'src/js/public.js'),
        },
        resolve:{
            extensions:['.js','.jsx','.less','.css','.min.js','.html'],
            alias: {
                Sy: path.resolve(__dirname, './src/style/'),
                Img: path.resolve(__dirname, './src/images/')
            }
        },
        devServer:{
            historyApiFallback:true, 
            stats:'errors-only',
            overlay:{ 
                errors:true,
                warnings:true,
            }
        },
        devtool: 'cheap-module-eval-source-map',
        module:{
            rules:[
                {
                    test:/\.(js|jsx)$/,
                    exclude: /(node_modules|bower_components)/,
                    use:[
                        {
                            loader:'babel-loader',
                            options:{
                                presets: ['react', 'es2015']
                            }
                        }
                    ]
                },
                {
                    test:  /\.(png|jpe?g|gif)$/,
                    use: [
                        {
                            loader:'url-loader',
                            options:{
                                limit:'192',
                                name:'images/[name].[ext]'
                            }
                        }
                    ]
                },
                {
                    test:/\.html$/,
                    use:[
                        {
                            loader:'html-loader',
                            options:{
                                minimize: true
                            }
                        }
                    ]
                },
                {
                    test:path.resolve(__dirname, 'src/js/phonerm'),
                    use:[
                        {
                            loader:'expose-loader',
                            options:'Rem'
                        }
                    ]
                }
            ]
        },
        plugins: [
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    }
                }),
                
                new OptimizeCssAssetsPlugin(),
                new webpack.ProvidePlugin({
                    $:"jquery",
                    jQuery:"jquery",
                    "window.jQuery":"jquery"
                })
        ]

    }
        
    var styles = {};

    if (env.clean) {
        config.plugins.push(new cleanWebpackPlugin(['./dist/']))
    }

    if (env.production) { //生产模式
        styles = {
            test: /\.(less|css)$/, 
            use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [ 'css-loader', 'less-loader' ]
                }) 
        }
        config.output = {
            filename: 'js/[name].[chunkhash].js',
            chunkFilename: "js/[name].[chunkhash].min.js"
        }
        config.plugins.push(new ExtractTextPlugin({filename:'style/[name].[chunkhash].min.css',allChunks: true}));
        config.module.rules.push(styles)
    }else{
        styles = {
            test: /\.(less|css)$/, 
             use: [{
                loader: "style-loader" 
            }, {
                loader: "css-loader" 
            }, {
                loader: "less-loader" 
            }]
        }
        config.output = {
            filename: 'js/[name].js',
            chunkFilename: "js/[name].min.js"
        }
        config.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('development')
            }
        }))
        config.module.rules.push(styles)
    }

    config.output.path = path.resolve(__dirname,'dist');

    fsArr.forEach(function(ele){
        if (/\.html$/.test(ele)) {
            config.plugins.push(new HtmlWebpackPlugin({
                template:'./src/'+ele,
                filename:ele,
                chunks: ['vendor']
            }))
        }
    });

    return config;

}



    



	
