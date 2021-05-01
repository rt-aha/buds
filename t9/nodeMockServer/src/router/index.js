import Router from 'koa-router';
const router = new Router();
import ctrls from '../controllers';

router.get('/', (ctx) => ctrls.root(ctx));

export default router;
