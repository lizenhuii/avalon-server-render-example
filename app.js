import Koa from 'koa'
const views = require('koa-views');
const avalon = require('./dist/avalon2.2');
const fs = require('fs');
const path = require('path');
import convert from 'koa-convert'
const minify = require('html-minifier').minify;

import koaStaticPlus from 'koa-static-plus'

const app = new Koa()

app.use(koaStaticPlus(path.join(__dirname, '/dist'), {
        pathPrefix: ''
}))


//当前页面VM
var vm = require('./src/vm')
//当前页面模板
var page = fs.readFileSync('./src/aaa.html', 'utf-8');


//渲染器
var serveRender = require('./dist/serverRender2.2')

var obj = serveRender(vm, page)

for(var i in obj.templates){
   obj.templates[i] = minify(obj.templates[i],{
       collapseInlineTagWhitespace: true,
       collapseWhitespace:true
   })
   
}

var files = JSON.stringify(obj.templates)


var header = '<!document html><html><head>'+
            '<script src="./avalon2.2.js"><\/script>'+
           
            '<script src="./vm.js"><\/script>'+
            '<script> avalon.serverTemplates= ' + files + '<\/script>' +
            '</head><body>'
var footer = '</body></html>'

app.use(async function(ctx){
     await (ctx.body = (header+ obj.html+ footer))
})



app.listen(3000, () => console.log('server started 3000'))

export default app

