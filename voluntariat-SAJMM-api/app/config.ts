import crypto from 'crypto';
export const domain = '192.168.0.246:8000';
export const db = {
    host: '192.168.0.110',
    database: 'voluntari_saj',
    user: 'postgres',
    port: 5432,
    password: 'Devconnect2016',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
}
export const mailConfigs = {
    username: 'voluntari.sajmm@gmail.com',
    password: 'Devconnect2016#Secure',
    smtp: 'smtp.gmail.com',
    smtpPort: 587,
    secure: true
}



export const port = process.env.PORT || 8000;

export const tokenKey = `(kj+-_W7x:zAtu(o3gN4MT2es[=E#|+I:_&y8-tQt2@6Q07ZdBIJmJr4p4WQ8BRHsKKSThVOcgbBYvTwVKkA6D9S14CZUKNFVZtjoWVAD53oopHhW};}}GD565?qD/YZ5lB9=w0?LM-ru[pUfUukH~-c461BF9FE4V=Op<(<ZB,{XPF5B6BEqBrXVcuqqRl6kJvIubouX3FqtHswSpQK58CB9selH!oV5WA<5y;cNEo-Yl.[R~|8]0(4FkveE8VcoEii5AxW9HqWUfs1lBqmtuyXCC3B36BD3E5168841QDFE+^DA}&vR)%Du@R~:5exW{)X[GaNh=Cttk|XQ,@U' ^ 5} +Jcc1ZQ)=24F2E4873CCCE54793FF685ADD9C5F`;
export const cryptoKey = crypto.createHash('sha256').update(String('401b09eab3c013d4ca5492b0090fb922bb802bec8fd5318192b092b0090fb090fb92b0090fb337592b0090fb992b0090fb1abd3e44453b954592b0090fb55b7a0812e1081c39b740293f765eae731f5a65ed137591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed15f201d8b3727429090fb338591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1')).digest('base64').substr(0, 32);