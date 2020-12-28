import * as Koa from 'koa';
import * as query from '../routes.query';
import { executeQuery } from "../../database/db";

export async function getAllStatuses(ctx: Koa.Context) {

    const data = await executeQuery(query.getStatuses());
    ctx.status = 200;
    ctx.body = data[0].array_to_json;
}