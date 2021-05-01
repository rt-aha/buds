import Koa from 'koa';
import cors from '@koa/cors';
import koaBody from 'koa-body';
import router from './router/index';
require('dotenv').config();

const app = new Koa();
app.use(cors());
app.use(koaBody());
app.use(router.routes());

app.listen(process.env.ENV_DEV_PORT);
console.log(`listen on port ${process.env.ENV_DEV_PORT}`);
