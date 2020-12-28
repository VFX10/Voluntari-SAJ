import Koa from 'koa';
import * as query from '../routes.query';
import { executeQuery } from "../../database/db";
import fs from "fs";
import path from 'path';
import moment from 'moment';
import { sendEmail } from '../../utils/email';
import IMailOption from '../../interfaces/IMailOption';
import { mailConfigs } from '../../config';



export async function createApplication(ctx: Koa.Context) {
    const file = ctx.request.files;
    if (ctx.request.body.cityId &&
        ctx.request.body.firstName &&
        ctx.request.body.lastName &&
        ctx.request.body.dateOfBirth &&
        ctx.request.body.email &&
        ctx.request.body.phoneNumber &&
        ctx.request.body.address &&
        ctx.request.body.cnp &&
        ctx.request.body.ciNumber &&
        ctx.request.body.ciSeriesId &&
        file &&
        file.cv &&
        file.letterOfApplication) {
        const data = await executeQuery(query.addVolunteerApplication(ctx.request.body));
        console.log(data[0].add_volunteer_application);
        const response = JSON.parse(data[0].add_volunteer_application);
        if (response.success) {
            await uploadFile(
                file.cv.path,
                file.cv.type,
                'app/uploads/cv/' + ctx.request.body.email
            );
            await uploadFile(
                file.letterOfApplication.path,
                file.letterOfApplication.type,
                'app/uploads/letterOfApplications/' + ctx.request.body.email
            );
        }
        ctx.status = response.success ? 201 : 208;
        ctx.body = response;

    } else {
        ctx.throw(422, JSON.stringify({ error: 'Unprocessable Entity' }));
    }

}

async function uploadFile(filePath: string, fileType: string, pathToUpload: string) {
    return new Promise((resolve, reject) => {
        let render = fs.createReadStream(filePath);
        // Create a write stream
        let upStream = fs.createWriteStream(pathToUpload + '.' + fileType.split('/')[1]);
        render.pipe(upStream);
        upStream.on('finish', () => {
            resolve(path)
        });
        upStream.on('error', (err) => {
            console.log(err);
            reject(err)
        });
    })
    // return new Promise((resolve, reject) => {
    //     const stream = fs.createReadStream(filePath);
    //     stream.on("error", (err: any) => reject(err));


    // });
};
