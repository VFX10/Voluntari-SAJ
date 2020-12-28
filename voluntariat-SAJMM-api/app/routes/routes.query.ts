export function getCitiesByCounty(county: string) {
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
export function getCountiesWithCities() {
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
export function getStatuses() {
    return {
        text: `SELECT array_to_json(ARRAY (SELECT row_to_json(rec)
        FROM (SELECT id, INITCAP(status) as status from statuses ORDER BY status) rec), true);`,
        values: []
    }
}
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
        model.ciSeriesId,]
    }
}
export function planVolunteerMeeting(id: number, date: any) {
    return {
        text: `UPDATE volunteer_institution_info
        SET "meetingDay" = $2
        WHERE "volunteerId" = $1 AND "statusId" = 1;`,
        values: [id, date]
    }
}
export function acceptVolunteer(id: number, identificationCode: any) {
    return {
        text: `SELECT accept_volunteer_application($1, $2);`,
        values: [id, identificationCode]
    }
}
export function rejectVolunteer(id: number) {
    return {
        text: `SELECT reject_volunteer_application($1);`,
        values: [id]
    }
}

export function loginUser(model: any) {
    return {
        text: `SELECT login_user($1, $2);`,
        values: [model.username,
        model.password,]
    }
}
export function suspendUser(model: any) {
    return {
        text: `SELECT suspend_account($1);`,
        values: [model.username]
    }
}
export function activateUser(model: any) {
    return {
        text: `DELETE FROM suspended_users WHERE "userId" = (SELECT id FROM users WHERE username = $1);`,
        values: [model.username]
    }
}
export function getUserDetails(username: any) {
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
export function changePassword(username: any, password: any) {
    return {
        text: `UPDATE users set password = encode(sha512(($2 || salt)::bytea), 'hex') WHERE username = $1`,
        values: [username, password]
    }
}
export function isUserSuspended(model: any) {
    return {
        text: `SELECT (SELECT count(*) FROM users u INNER JOIN suspended_users su on u.id = su."userId" WHERE username = $1) = 1 as "isSuspended";`,
        values: [model.username]
    }
}
export function registerVolunteerAccount(model: any) {
    return {
        text: `SELECT register_volunteer_account($1, $2);`,
        values: [model.username, model.password]
    }
}
export function registerAdministratorAccount(model: any) {
    return {
        text: `SELECT register_administrator_account($1, $2, $3, $4);`,
        values: [model.username, model.password, model.firstName, model.lastName]
    }
}

