import * as query from '../../routes.query';
import Koa from 'koa';

import { executeQuery } from "../../../database/db";

export async function getCitiesByCounty(ctx: Koa.Context) {
    if (ctx.request.query.county) {
        const data = await executeQuery(query.getCitiesByCounty(ctx.request.query.county));
        ctx.status = 200;
        ctx.body = data[0].row_to_json;
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }

}
export async function getSeriesesByCounty(ctx: Koa.Context) {

    if (ctx.request.query.county) {
        const data = await executeQuery(query.getCountySeries(ctx.request.query.county));
        ctx.status = 200;
        ctx.body = data[0].row_to_json;
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }

}
export async function getSerieses(ctx: Koa.Context) {
    try {
        const data = await executeQuery(query.getCountiesSeries());
        ctx.status = 200;
        ctx.body = data[0].array_to_json;

    } catch (e) {
        console.log(e);
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}
export async function getCountiesWithCities(ctx: Koa.Context) {
    try {
        const data = await executeQuery(query.getCountiesWithCities());
        ctx.status = 200;
        ctx.body = data[0].array_to_json;
    } catch (e) {
        console.log(e);
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}