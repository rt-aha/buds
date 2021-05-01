const Koa = require('koa');
const app = new Koa();
import koaBody from 'koa-body';
import router from './router/index';

app.use(koaBody());
app.use(router.routes());

import requireContext from 'require-context';
import ctrls from './controllers';
console.log('ctrls===', ctrls);

app.listen(7076);