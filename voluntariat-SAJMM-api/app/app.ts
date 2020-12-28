import Koa from 'koa';
import cors from '@koa/cors';
import { administratorRoutes, volunteerRoutes, unsecureRoutes } from './routes/Routes'
import { port } from './config';
import Body from 'koa-body';
import koaStatic from 'koa-static';
import path from 'path';

/**
 * Main class. This is class contains server configurations like
 * listening port
 * 
 * - listening port
 * 
 * - routes
 * 
 * - cors
 * 
 * - request body size
 * 
 */
export class App {
  constructor(private app?: Koa) {
    this.app = new Koa();
    this.app
      .use(Body({
        jsonLimit: '5mb',
        formLimit: '10mb',
        multipart: true, // Allow multiple files to be uploaded
        formidable: {
          maxFileSize: 200 * 1024 * 1024, //Upload file size
          keepExtensions: true, //  Extensions to save images
        }
      }))
      .use(koaStatic(
        path.join("/uploads") //Read static file directories
      ))
      .use(administratorRoutes.routes())
      .use(volunteerRoutes.routes())
      .use(unsecureRoutes.routes())
      .use(cors())
      .use(administratorRoutes.allowedMethods())
      .use(volunteerRoutes.allowedMethods())
      .use(unsecureRoutes.allowedMethods())
      .listen(port);
    console.log(`HTTP Server running on ${port} port!`);
  }
} 