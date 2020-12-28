import Koa from 'koa';
import * as query from '../routes.query';
import { generateToken } from '../../token'
import { executeQuery } from '../../database/db';

/**
  * Check users credential and generate encypted token
  *
  *
  *
  * @param ctx - Request body
  *
  *
  */
export async function login(ctx: Koa.Context): Promise<void> {
    if (ctx.request.body.username && ctx.request.body.password) {
        const userData = await executeQuery(query.loginUser(ctx.request.body));
        console.log(userData);
        const res = JSON.parse(userData[0].login_user)
        if (res.error) {
            ctx.throw(401, JSON.stringify(res));
        } else if (res.forbidden) {
            ctx.throw(403, JSON.stringify(res));
        } else {
            ctx.status = 200;
            ctx.body = {
                type: res.type,
                firstLogin: res.firstLogin,
                token: generateToken({ username: ctx.request.body.username, type: res.type })
            };
        }
    } else {

        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}
export async function registerVolunteer(ctx: Koa.Context) {
    if (ctx.request.body.username && ctx.request.body.password) {
        const userData = await executeQuery(query.registerVolunteerAccount(ctx.request.body));
        console.log(userData);
        const resUserData = JSON.parse(userData[0].register_volunteer_account);
        if (resUserData.success) {
            ctx.status = 201;
            ctx.body = {
                message: resUserData.success,
            };
        } else if (resUserData.forbidden) {
            ctx.throw(403, JSON.stringify({ error: resUserData.forbidden }));
        } else {
            ctx.status = 208;
            ctx.body = resUserData
        }
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}
export async function registerAdministrator(ctx: Koa.Context) {
    if (ctx.request.body.username && ctx.request.body.password &&
        ctx.request.body.firstName && ctx.request.body.lastName) {
        const userData = await executeQuery(query.registerAdministratorAccount(ctx.request.body));
        console.log(userData);
        const resUserData = JSON.parse(userData[0].register_administrator_account);
        if (resUserData.success) {
            ctx.status = 201;
            ctx.body = {
                message: resUserData.success
            };
        } else {
            ctx.status = 208;
            ctx.body = resUserData
        }
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}