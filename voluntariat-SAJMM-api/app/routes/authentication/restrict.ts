import { executeQuery } from "../../database/db";
import * as query from '../routes.query';


export async function suspendUser(ctx: any) {
    if (ctx.request.body.username) {
        const userData = await executeQuery(query.suspendUser(ctx.request.body));
        console.log(userData);
        const res = JSON.parse(userData[0].suspend_account);
        ctx.status = res.success ? 201 : 200;

        ctx.body = res;

    } else {

        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}
export async function activateUser(ctx: any) {
    if (ctx.request.body.username) {
        await executeQuery(query.activateUser(ctx.request.body));
        ctx.status = 200;
        ctx.body = {
            message: 'User activated',
        };
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}