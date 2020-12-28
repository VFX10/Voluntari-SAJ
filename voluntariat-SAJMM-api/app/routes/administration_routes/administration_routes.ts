import Koa from 'koa';
import * as query from '../routes.query';
import { executeQuery } from "../../database/db";
import fs from "fs";
import moment from 'moment';
import { sendEmail } from '../../utils/email';
import IMailOption from '../../interfaces/IMailOption';
import { mailConfigs } from '../../config';

export async function getAllAplications(ctx: Koa.Context) {
    try {
        console.log('queryParams', ctx.request.query);
        const data = await executeQuery(query.getAllApplications());
        console.log(data);
        ctx.status = 200;
        ctx.body = data[0].array_to_json;
    } catch (e) {
        console.log(e);
    }

}

function generateIdentificationCode(data: any): string {
    let idCode = 'SAJMM'
    if (data.id < 10) {
        idCode += '0000'
    } else if (data.id >= 10 && data.id < 100) {
        idCode += '000'
    } else if (data.id >= 100 && data.id < 1000) {
        idCode += '00'

    } else if (data.id >= 1000 && data.id < 10000) {
        idCode += '0'
    }
    idCode += data.id;
    return idCode;
}

export async function planMeeting(ctx: Koa.Context) {
    if (ctx.request.body.email && ctx.request.body.planningDate) {
        if (Date.parse(ctx.request.body.planningDate) < Date.now()) {
            ctx.throw(422, JSON.stringify({ error: 'Planning date must be a future date' }));
        }
        try {
            const data = await executeQuery(query.getUserDetails(ctx.request.body.email));
            console.log(data);
            const res = data[0].row_to_json;
            await executeQuery(query.planVolunteerMeeting(res.id, ctx.request.body.planningDate));
            // if(res.meetingDay)

            let page = fs.readFileSync(`app/templates/${res.meetingDay ? 'meeting_replanning' : 'meeting_planning'}.html`, 'utf8');
            page = page.replace('[firstName]', res.firstName);
            page = page.replace('[lastName]', res.lastName);
            page = page.replace('[DATE]', moment(ctx.request.body.planningDate).format('DD/MM/YYYY'));
            page = page.replace('[TIME]', moment(ctx.request.body.planningDate).format('HH:mm'));
            const emailContent: IMailOption = {
                from: `"Voluntariat SAJMM 🚑" <${mailConfigs.username}>`,
                to: ctx.request.body.email,
                subject: `[No Reply] ${res.meetingDay ? 'Replanificare' : 'Planificare'} intalnire`,
                text: '',
                html: page,
            }
            await sendEmail(emailContent);
            ctx.status = 200;

            ctx.body = { success: `Meeting ${res.meetingDay ? 'replanned' : 'planned'} successfully` };
        } catch (err) {
            console.log(err);
            ctx.throw(404, JSON.stringify({ error: 'Volunteer not found' }));
        }

    } else {
        ctx.throw(400, JSON.stringify({ error: 'Unprocessable Entity' }));
    }

}

export async function acceptApplication(ctx: Koa.Context) {
    if (ctx.request.body.email) {
        try {
            const userDetails = await executeQuery(query.getUserDetails(ctx.request.body.email));
            console.log(userDetails);
            const resDetails = userDetails[0].row_to_json;
            const identificationCode = generateIdentificationCode(resDetails);
            const data = await executeQuery(query.acceptVolunteer(resDetails.id, identificationCode));
            console.log(data);
            const res = JSON.parse(data[0].accept_volunteer_application);
            if (res.success) {
                let page = fs.readFileSync('app/templates/application_accepted.html', 'utf8');
                page = page.replace('[firstName]', resDetails.firstName);
                page = page.replace('[lastName]', resDetails.lastName);
                page = page.replace('[MESSAGE]', `Va informam ca in urma intalnirii cererea dumneavoastra de inscriere a fost acceptata. 
                Acum puteti sa va inregistrati in aplicatia mobila disponibila in Magazin Play folosind butonul de mai jos. 
                Va multumim ca ati ales sa fiti voluntar!`);
                page = page.replace('[LINK]', 'www.google.com');
                const emailContent: IMailOption = {
                    from: `"Voluntariat SAJMM 🚑" <${mailConfigs.username}>`,
                    to: ctx.request.body.email,
                    subject: "[No Reply] Raspuns cerere",
                    text: '',
                    html: page,
                }
                await sendEmail(emailContent);
            }
            ctx.status = res.success ? 200 : 422;
            ctx.body = res;
        } catch (err) {
            console.log(err);
            ctx.throw(404, JSON.stringify({ error: 'Volunteer not found' }));
        }
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Unprocessable Entity' }));
    }
}
export async function rejectApplication(ctx: Koa.Context) {
    if (ctx.request.body.email) {
        try {
            const userDetails = await executeQuery(query.getUserDetails(ctx.request.body.email));
            console.log(userDetails);
            const resDetails = userDetails[0].row_to_json;
            const data = await executeQuery(query.rejectVolunteer(resDetails.id));
            console.log(data);
            const res = JSON.parse(data[0].reject_volunteer_application);
            if (res.success) {
                let page = fs.readFileSync('app/templates/application_reject.html', 'utf8');
                page = page.replace('[firstName]', resDetails.firstName);
                page = page.replace('[lastName]', resDetails.lastName);
                page = page.replace('[MESSAGE]', `Ne pare rau sa va informam dar in urma intalnirii cererea dumneavoastra de inscriere a fost refuzata.`);
                const emailContent: IMailOption = {
                    from: `"Voluntariat SAJMM 🚑" <${mailConfigs.username}>`,
                    to: ctx.request.body.email,
                    subject: "[No Reply] Raspuns cerere",
                    text: '',
                    html: page,
                }
                await sendEmail(emailContent);
            }
            ctx.status = res.success ? 200 : 422;

            ctx.body = res;
        } catch (err) {
            console.log(err);
            ctx.throw(404, JSON.stringify({ error: 'Volunteer not found' }));
        }
    } else {
        ctx.throw(400, JSON.stringify({ error: 'Unprocessable Entity' }));
    }
}