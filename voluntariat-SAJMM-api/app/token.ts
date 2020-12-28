
import Koa from 'koa';
import jwt from 'jsonwebtoken';
import { encrypt, decrypt } from './crypting';
import { tokenKey } from './config';
import { executeQuery } from './database/db';
import * as query from './routes/routes.query';
import fs from 'fs';


/**
  * Generate encrypted user token
  *
  *
  *
  * @param data - Data to encapsulate in token
  *
  *
  */
export function generateToken(data: any): string {
    return encrypt(jwt.sign(data, tokenKey));
}
/**
  * Generate encrypted token using a custom key to sign
  *
  *
  *
  * @param data - Data to encapsulate in token
  * @param key - Key to sign the token
  *
  *
  */
export function generateCustomKeyToken(data: any, key: string): string {
    return encrypt(jwt.sign(data, key));
}
/**
  * Verify if token has been generated for a volunteer account
  * and put the encapsulated data into `ctx.user`
  * If token is not valid the method wil throw an error of `401` 
  * with the following possible messages: 
  * 
  * - Unauthorized
  * 
  * - User account is suspended
  *
  * @param data - Data to encapsulate in token
  *
  *
  */
export async function verifyVolunteerToken(ctx: Koa.Context, next: any): Promise<void> {
    try {
        const bearerHeader = ctx.request.headers['authorization'];
        if (bearerHeader) {
            ctx.user = await checkToken(decrypt(bearerHeader.split(' ')[1]));
            const userData = await executeQuery(query.isUserSuspended(ctx.user));
            if (userData[0].isSuspended) {
                ctx.throw(401, JSON.stringify({ error: 'User account is suspended' }));
            }
            if (ctx.user.type === 'administrator') {
                ctx.throw(401, JSON.stringify({ error: 'Unauthorized' }));
            }
            return await next();
        }
        ctx.throw(401, JSON.stringify({ error: 'Unauthorized' }));
    } catch (error) {
        ctx.throw(error.status || 401, JSON.stringify({ error: error.message }) || JSON.stringify({ error: error }));
    }
}

/**
  * Verify if token has been generated for an administrator account
  * and put the encapsulated data into `ctx.user`
  *
  * If token is not valid the method wil throw an error of `401` 
  * with the following possible messages: 
  *
  * - Unauthorized
  *
  * - User account is suspended
  *
  * @param data - Data to encapsulate in token
  *
  *
  */
export async function verifyAdministratorToken(ctx: Koa.Context, next: any): Promise<void> {
    try {
        const bearerHeader = ctx.request.headers['authorization'];
        if (bearerHeader) {
            ctx.user = await checkToken(decrypt(bearerHeader.split(' ')[1]));
            const userData = await executeQuery(query.isUserSuspended(ctx.user));
            if (userData[0].isSuspended) {
                ctx.throw(401, JSON.stringify({ error: 'User account is suspended' }));
            }
            if (ctx.user.type === 'volunteer') {
                ctx.throw(401, JSON.stringify({ error: 'Unauthorized' }));
            }
            return await next();
        }
        ctx.throw(401, JSON.stringify({ error: 'Unauthorized' }));
    } catch (error) {
        ctx.throw(error.status || 401, JSON.stringify({ error: error.message }) || JSON.stringify({ error: error }));

    }
}

/**
  * Middleware to check if password change token is valid
  *
  * If token is not valid the method wil throw an error of `401` 
  * with the following possible messages: 
  * 
  *  - Unauthorized
  *
  * @param ctx - Request body
  *
  *
  */
export async function verifyPasswordChangeToken(ctx: Koa.Context, next: any): Promise<void> {
    try {
        const bearerHeader = ctx.request.query.token;
        if (bearerHeader && ctx.request.query.email) {
            const userData = await executeQuery(query.getUserDetails(ctx.request.query.email));
            console.log(userData[0].row_to_json)
            ctx.user = await checkCustomKeyToken(decrypt(bearerHeader), userData[0].row_to_json.password);
            console.log(ctx.user);
            return await next();
        }
        ctx.throw(401, JSON.stringify({ error: 'Unauthorized' }));
    } catch (error) {
        let page = fs.readFileSync('app/templates/message_page.html', 'utf8');
        page = page.replace('[MESSAGE_TITLE]', 'Eroare');
        page = page.replace('[MESSAGE]', 'Cerere expirata! Va rugam sa retrimiteti cererea pentru schimbarea parolei!');
        ctx.body = page;
    }
}

/**
 * Verify a JWT Token that was signed with a custom key
 * 
 * @param token - JWT token to check
 * @param key - key that was used to sign the token
 * @returns token information or `Invalid token'
 */
function checkCustomKeyToken(token: any, key: string): Promise<any> {
    return new Promise((res, rej) => {
        jwt.verify(token, key, (err: any, authData: any) => {
            if (err) {
                console.error(err);
                rej('Invalid token');
            }
            res(authData);
        });
    });
}

/**
 * Verify a JWT Token
 * 
 * @param token - JWT token to check
 * @param key - key that was used to sign the token
 * @returns token information or `Invalid token'
 */
function checkToken(token: any): Promise<any> {
    return new Promise((res, rej) => {
        jwt.verify(token, tokenKey, (err: any, authData: any) => {
            if (err) {
                console.error(err);
                rej('Invalid token');
            }
            res(authData);
        });
    });
}
