import nodemailer from "nodemailer";
import { mailConfigs } from "./../config";

import IMailOption from "../interfaces/IMailOption";
/**
 * Sends an email to the adress specified in `mailContent`
 * 
 * @param mailContent 
 */
export async function sendEmail(mailContent: IMailOption): Promise<void> {
    let transporter = nodemailer.createTransport({
        host: mailConfigs.smtp,
        port: mailConfigs.smtpPort,
        secure: false,
        requireTLS: true,
        auth: {
            user: mailConfigs.username,
            pass: mailConfigs.password,
        },
    });
    const info = await transporter.sendMail({
        from: mailContent.from,
        to: mailContent.to,
        subject: mailContent.subject,
        text: mailContent.text,
        html: mailContent.html,
    });
    console.log("Message sent: %s", info.messageId);
}