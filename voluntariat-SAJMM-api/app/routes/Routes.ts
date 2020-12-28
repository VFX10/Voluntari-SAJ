import { verifyPasswordChangeToken, verifyVolunteerToken, verifyAdministratorToken } from '../token';
import KoaRouter from 'koa-router';
import { acceptApplication, createApplication, getAllAplications, planMeeting, rejectApplication } from './volunteers_routes/volunteer_applications';
import { getCitiesByCounty, getCountiesWithCities, getSerieses, getSeriesesByCounty } from './data/geographics';
import { login, registerAdministrator, registerVolunteer } from './authentication/authentication';
import { activateUser, suspendUser } from './authentication/restrict';
import { changePassword, resetPasswordPage } from './authentication/resets';
import { getAllStatuses } from './data/statuses';

/**
 * Represents routes that are available only for volunteers
 * These route are require an volunteer token;
 * 
 */
const volunteerRoutes = new KoaRouter({ prefix: '/api/volunteer' });

/**
 * Represents routes that are available only for administrators.
 * These route are require an administrator token;
 */
const administratorRoutes = new KoaRouter({ prefix: '/api/administration' });
/**
 * Represents routes that not require a token for validating requests
 */
const unsecureRoutes = new KoaRouter({ prefix: '/api/unsecure' });

export { volunteerRoutes, administratorRoutes, unsecureRoutes };

administratorRoutes
    .use(verifyAdministratorToken)
    .get('/data/statuses', getAllStatuses)

    .post('/authentication/deactivateUser', suspendUser)
    .post('/authentication/activateUser', activateUser)

    .get('/applications', getAllAplications)

    .post('/applications/planMeeting', planMeeting)
    .post('/applications/accept', acceptApplication)
    .post('/applications/reject', rejectApplication)

volunteerRoutes
    .post('/applications/add', createApplication)
    .use(verifyVolunteerToken)

unsecureRoutes
    .get('/data/geographics/all', getCountiesWithCities)
    .get('/data/geographics/citiesByCounty', getCitiesByCounty)
    .get('/data/geographics/series', getSerieses)
    .get('/data/geographics/seriesByCounty', getSeriesesByCounty)



    .post('/authentication/login', login)
    .post('/authentication/register/administrator', registerAdministrator)
    .post('/authentication/register/volunteer', registerVolunteer)
    .post('/authentication/changePassword', changePassword)
    .get('/authentication/confirmPasswordReset', verifyPasswordChangeToken, resetPasswordPage)





