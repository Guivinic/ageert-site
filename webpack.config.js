const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    mode: isProduction ? 'production' : 'development',
    
    entry: {
        main: './src/index.tsx'
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '',
        clean: true
    },
    
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            '@': path.resolve(__dirname, 'src'),
            '@components': path.resolve(__dirname, 'components'),
            '@styles': path.resolve(__dirname, 'styles')
        }
    },
    
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { 
                                    targets: { browsers: ['> 1%', 'last 2 versions'] }
                                }],
                                '@babel/preset-react',
                                '@babel/preset-typescript'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-transform-runtime'
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.(js|jsx)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', { 
                                    targets: { browsers: ['> 1%', 'last 2 versions'] }
                                }],
                                '@babel/preset-react'
                            ]
                        }
                    }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('@tailwindcss/postcss'),
                                    require('autoprefixer')
                                ]
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]'
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            }
        ]
    },
    
    plugins: [
        ...(isProduction ? [
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ] : [])
    ],
    
    optimization: {
        minimize: isProduction,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    compress: {
                        drop_console: isProduction
                    }
                }
            }),
            ...(isProduction ? [new CssMinimizerPlugin()] : [])
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        hot: true,
        port: 3000,
        open: true
    },
    
    externals: {
        // Evitar incluir WordPress globals no bundle
        'jquery': 'jQuery'
    }
};