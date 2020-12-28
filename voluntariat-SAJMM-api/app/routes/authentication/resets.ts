import Koa from "koa";
import { mailConfigs, domain } from "../../config";
import fs from 'fs';
import { executeQuery } from "../../database/db";
import * as query from '../../routes/routes.query';
import { generateCustomKeyToken } from "../../token";
import IMailOption from "../../interfaces/IMailOption";
import { sendEmail } from "../../utils/email";


export async function changePassword(ctx: Koa.Context) {
    if (ctx.request.body.username && ctx.request.body.newPassword) {


        const data = await executeQuery(query.getUserDetails(ctx.request.body.username));
        console.log(data);
        const res = data[0].row_to_json;
        const token = generateCustomKeyToken({ username: ctx.request.body.username, password: ctx.request.body.newPassword }, res.password)
        let page = fs.readFileSync('app/templates/reset_password.html', 'utf8');

        page = page.replace('[firstName]', res.firstName);
        page = page.replace('[lastName]', res.lastName);
        while (page.includes('[LINK]')) {
            page = page.replace('[LINK]', `http://${domain}/api/unsecure/authentication/confirmPasswordReset/?token=${token}&email=${ctx.request.body.username}`);
        }

        const emailContent: IMailOption = {
            from: `"Voluntariat SAJMM 🚑" <${mailConfigs.username}>`,
            to: ctx.request.body.username,
            subject: "[No Reply] Resetare parola",
            text: '',
            html: page,
        }
        await sendEmail(emailContent);


        ctx.status = 200;
        ctx.body = { success: 'Email successfully sent' };

    } else {
        ctx.throw(400, JSON.stringify({ error: 'Bad Request' }));
    }
}
export async function resetPasswordPage(ctx: Koa.Context) {
    console.log(ctx.request.query);
    let page = fs.readFileSync('app/templates/message_page.html', 'utf8');
    try {
        await executeQuery(query.changePassword(ctx.user.username, ctx.user.password));
        page = page.replace('[MESSAGE_TITLE]', 'Succes');
        page = page.replace('[MESSAGE]', 'Parola a fost schimbata cu succes! Puteti inchide aceasta fereastra!');
    } catch (error) {
        page = page.replace('[MESSAGE_TITLE]', 'Eroare');
        page = page.replace('[MESSAGE]', 'A fost intampinata o eroare la schimbarea parolei. Va rugam sa mai incercati o data!');
    }
    ctx.status = 200;
    ctx.body = page;
}