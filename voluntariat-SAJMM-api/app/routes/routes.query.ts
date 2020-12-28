/** This methodes containing **SQL Queries** that will be executed in the database.
 * So the return type `{ text: string, values: any[] }` represents the following:
 * 
 * @text The query that will be executed
 * @values Aditional parameters that will be presents in queries.
 * 
 * ### Example 
 * ```ts 
 * {
 *  text: `SELECT array_to_json(ARRAY (SELECT row_to_json(rec) FROM (SELECT id, INITCAP(name) as name from persons WHERE email = $1 ORDER BY name) rec), true);`,
 *  values: [emailAddress]
 * } 
 * ```
 */



/**
 * 
 * @param county - county name
 * @returns Return an json object containg all cities of a specified county
 */
export function getCitiesByCounty(county: string): any {
    return {
        text: `SELECT row_to_json(rec)
        FROM (SELECT ct.id,
                     ct.symbol,
                     INITCAP(ct.county)                                                   AS county,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(series_rec)
                                                 FROM (SELECT cis.id, cis.series
                                                       FROM ci_series AS cis
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY cis.series) series_rec))) AS series,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(city_rec)
                                                 FROM (SELECT cities.id, INITCAP(cities.city) AS city
                                                       FROM cities
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY city) city_rec)))         AS cities
        
              FROM counties ct
              WHERE LOWER(ct.county) = LOWER($1)
              ORDER BY ct.county) rec;`,
        values: [county]
    }
}

/**
 * 
 * 
 * @returns Return an json array containg all counties with their cities
 */
export function getCountiesWithCities(): any {
    return {
        text: `SELECT array_to_json(ARRAY(SELECT row_to_json(rec)
        FROM (SELECT ct.id,
                     ct.symbol,
                     INITCAP(ct.county)                                                   AS county,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(series_rec)
                                                 FROM (SELECT cis.id, cis.series
                                                       FROM ci_series AS cis
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY cis.series) series_rec))) AS series,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(city_rec)
                                                 FROM (SELECT cities.id, INITCAP(cities.city) AS city
                                                       FROM cities
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY city) city_rec)))         AS cities
              FROM counties ct
              ORDER BY ct.county) rec), true);`,
        values: []
    }
}

/**
 * 
 * 
 * @returns Return an json array containg all counties with their CI Series
 */
export function getCountiesSeries() {
    return {
        text: `SELECT array_to_json(ARRAY(SELECT row_to_json(rec)
        FROM (SELECT ct.id,
                     ct.symbol,
                     INITCAP(ct.county)                                                   AS county,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(series_rec)
                                                 FROM (SELECT cis.id, cis.series
                                                       FROM ci_series AS cis
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY cis.series) series_rec))) AS series
              FROM counties ct
              ORDER BY ct.county) rec), true);`,
        values: []
    }
}

/**
 * 
 * @param county - County name
 * @returns Return an json object containg all CI Series of a specific county
 */
export function getCountySeries(county: string) {
    return {
        text: `SELECT row_to_json(rec)
        FROM (SELECT ct.id,
                     ct.symbol,
                     INITCAP(ct.county)                                                   AS county,
                     (SELECT array_to_json(ARRAY(SELECT row_to_json(series_rec)
                                                 FROM (SELECT cis.id, cis.series
                                                       FROM ci_series AS cis
                                                       WHERE "countyId" = ct.id
                                                       ORDER BY cis.series) series_rec))) AS series
              FROM counties ct
              WHERE LOWER(ct.county) = LOWER($1)
              ORDER BY ct.county) rec;`,
        values: [county]
    }
}

/**
 * 
 * 
 * @returns Return an json array containg all available statuses
 */
export function getStatuses() {
    return {
        text: `SELECT array_to_json(ARRAY (SELECT row_to_json(rec)
        FROM (SELECT id, INITCAP(status) as status from statuses ORDER BY status) rec), true);`,
        values: []
    }
}

/**
 * 
 * 
 * @returns Return an json array containg all pending volunteer application
 */
export function getAllApplications() {
    return {
        text: `SELECT array_to_json(ARRAY(SELECT row_to_json(rec)
        from (SELECT INITCAP(vi."firstName") AS "firstName",
        INITCAP(vi."lastName") AS "lastName",
                     vi."dateOfBirth",
                     vi.cnp,
                     cs.series,
                     vi."ciNumber",
                     INITCAP(c2.county) AS county,
                     INITCAP(c.city) AS city,
                     vi.address,
                     vi.email,
                     vi."phoneNumber",
                     INITCAP(s.status) AS status,
                     vii."applicationDate"
              FROM volunteer_institution_info vii
                       INNER JOIN statuses s on s.id = vii."statusId"
                       inner join volunteer_info vi on vi.id = vii."volunteerId"
                       inner join cities c on c.id = vi."cityId"
                       inner join ci_series cs on cs.id = vi."ciSeriesId"
                       inner join counties c2 on c2.id = cs."countyId"
              WHERE "statusId" = 1
              ORDER BY "applicationDate" DESC) rec), true);`,
        values: []
    }
}

/**
 * Create a new volunteer application.
 * 
 * @param model - volunteer personal information. Should Contain following keys:
 * 
 * - cityId
 * 
 * - firstName
 * 
 * - lastName
 * 
 * - dateOfBirth
 * 
 * - email
 * 
 * - phoneNumber
 * 
 * - address
 * 
 * - cnp
 * 
 * - ciNumber
 * 
 * - ciSeriesId
 * 
 * 
 * @returns Return an json object containg a message based on the provided information
 */
export function addVolunteerApplication(model: any) {
    return {
        text: `SELECT add_volunteer_application($1, $2, $3, $4, $5, $6,
            $7, $8, $9, $10);`,
        values: [model.cityId,
        model.firstName,
        model.lastName,
        model.dateOfBirth,
        model.email,
        model.phoneNumber,
        model.address,
        model.cnp,
        model.ciNumber,
        model.ciSeriesId]
    }
}
/**
 * Plan meeting.
 * Update information in database.
 * 
 * @param id - statusId
 * @param date - planning date and time 
 * 
 * @returns Return an json object containg a message based on the provided information
 */
export function planVolunteerMeeting(id: number, date: any) {
    return {
        text: `UPDATE volunteer_institution_info
        SET "meetingDay" = $2
        WHERE "volunteerId" = $1 AND "statusId" = 1;`,
        values: [id, date]
    }
}
/**
 * Accepts volunteer application. 
 * Update information in database.
 * 
 * @param id - volunteer id
 * @param identificationCode - volunteer identification code
 * 
 * @returns Return an json object containg a message based on the provided information
 */
export function acceptVolunteer(id: number, identificationCode: any) {
    return {
        text: `SELECT accept_volunteer_application($1, $2);`,
        values: [id, identificationCode]
    }
}
/**
 * Rejects volunteer application. 
 * Update information in database.
 * 
 * @param id - volunteer id
 * 
 * @returns Return an json object containg a message based on the provided information
 */
export function rejectVolunteer(id: number) {
    return {
        text: `SELECT reject_volunteer_application($1);`,
        values: [id]
    }
}
/**
 * Check user credentials and return user information
 * 
 * @param model - Should contain `username` and `password`
 * 
 * @returns Return userinformation
 */
export function loginUser(model: any) {
    return {
        text: `SELECT login_user($1, $2);`,
        values: [model.username,
        model.password,]
    }
}

/**
 * Deactivate a user account
 * 
 * @param model - Should contain `username`
 * 
 * @returns Return a message based on user accound status
 */
export function suspendUser(model: any) {
    return {
        text: `SELECT suspend_account($1);`,
        values: [model.username]
    }
}
/**
 * Activate a user account
 * 
 * @param model - Should contain `username`
 * 
 * @returns Nothing
 */
export function activateUser(model: any) {
    return {
        text: `DELETE FROM suspended_users WHERE "userId" = (SELECT id FROM users WHERE username = $1);`,
        values: [model.username]
    }
}
/**
 * Retrieve user account information
 * 
 * @param username - email address of the user
 * 
 * @returns Return an JSON object containing user information
 */
export function getUserDetails(username: string) {
    return {
        text: `SELECT row_to_json(rec)
        FROM (SELECT CASE WHEN vi.id IS NULL THEN u.id ELSE vi.id END,
                     INITCAP(CASE WHEN u."firstName" IS NULL THEN vi."firstName" ELSE u."firstName" END) AS "firstName",
                     INITCAP(CASE WHEN u."lastName" IS NULL THEN vi."lastName" ELSE u."lastName" END)    as "lastName",
                     vii."meetingDay",
                     u.password
              from volunteer_info vi
                       FULL JOIN users u on vi.id = u."volunteerId"
                       FULL JOIN volunteer_institution_info vii on vi.id = vii."volunteerId"
              WHERE username = $1) rec;`,
        values: [username]
    }
}

/**
 * Update user account password
 * 
 * @param username - email address of the user
 * @param password - new password
 * @returns Nothing
 */
export function changePassword(username: string, password: string) {
    return {
        text: `UPDATE users set password = encode(sha512(($2 || salt)::bytea), 'hex') WHERE username = $1`,
        values: [username, password]
    }
}

/**
 * Check if user account is suspended
 * 
 * @param username - email address of the user
 * @returns Bool
 */
export function isUserSuspended(model: any): any {
    return {
        text: `SELECT (SELECT count(*) FROM users u INNER JOIN suspended_users su on u.id = su."userId" WHERE username = $1) = 1 as "isSuspended";`,
        values: [model.username]
    }
}

/**
 * Register volunteer account
 * 
 * @param model - should contain `email` and `password`
 * @returns Return an JSON object containing a message based on the provided information
 */
export function registerVolunteerAccount(model: any) {
    return {
        text: `SELECT register_volunteer_account($1, $2);`,
        values: [model.username, model.password]
    }
}

/**
 * Register administrator account
 * 
 * @param model - should contain `email` and `password`
 * @returns Return an JSON object containing a message based on the provided information
 */
export function registerAdministratorAccount(model: any) {
    return {
        text: `SELECT register_administrator_account($1, $2, $3, $4);`,
        values: [model.username, model.password, model.firstName, model.lastName]
    }
}

