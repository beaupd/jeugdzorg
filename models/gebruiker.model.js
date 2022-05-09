const db = require("./db");
const helper = require("./helper");

/**
 * Constructor for new gebruikers that checks if the passed object adheres the format
 * we need and throws errors if it doesn't
 * @param {*} gebruiker an object containing the necessary fields to make a new gebruiker
 */
const gebruiker = function (gebruiker) {
    // TODO: Check for sanity...
    this.gebruiker_id = gebruiker.gebruiker_id;
    this.naam = gebruiker.naam;
    this.email = gebruiker.email;
};

/**
 * Add a new gebruiker to the database
 * @param {*} gebruiker a new gebruiker object created with the gebruiker constructor
 * @returns an object containing the inserted gebruiker with the newly inserted gebruikerId
 */
gebruiker.create = async function (gebruiker) {
    const rows = await db.query(
        `INSERT INTO gebruikers SET naam = ?, email = ?`,
        prepareForInsert(gebruiker)
    );
    gebruiker.gebruikerId = rows.insertId;
    return {
        data: [gebruiker],
        meta: {
            insertId: rows.insertId,
        },
    };
};

/**
 * Update a gebruiker in the database, should return a usefull message if anything
 * goes wrong.. but we still have to fix this..
 * @param {*} gebruiker the gebruiker object to be updated, created with the gebruiker constructor
 * @returns an object with the updated gebruiker and some metadata
 */
gebruiker.update = async function (gebruiker) {
    const rows = await db.query(
        "UPDATE gebruikers SET naam = ?, email = ? WHERE gebruiker_id = ?",
        prepareForUpdate(gebruiker)
    );
    return {
        data: [gebruiker],
        meta: {
            affectedRows: rows.affectedRows,
            changedRows: rows.changedRows,
        },
    };
};

gebruiker.remove = async function (gebruikerId) {
    const rows = await db.query(
        `DELETE FROM gebruikers WHERE gebruiker_id = ?`,
        [gebruikerId]
    );
    return {
        data: [gebruiker],
        meta: {
            affectedRows: rows.affectedRows,
            changedRows: rows.changedRows,
        },
    };
};
gebruiker.removeAll = async function () {};

/**
 * Find a corresponding gebruiker in the database using the passed gebruikerId
 * @param {*} gebruikerId a gebruikerId to lookup in the database
 * @returns an object with the found gebruiker
 */
gebruiker.findById = async function (gebruikerId) {
    const rows = await db.query(
        `SELECT * FROM gebruikers WHERE gebruiker_id = ?`,
        [gebruikerId]
    );
    return {
        data: helper.emptyOrRows(rows),
        meta: { gebruikerId },
    };
};

/**
 * Get all gebruikers from the database, will be paginated if the number of
 * gebruikers in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of gebruikers you want to get
 * @returns
 */
gebruiker.getAll = async function (page = 1) {
    const rows = await db.query(`SELECT * FROM \`gebruikers\``, [
        helper.getOffset(page, process.env.LIST_PER_PAGE),
        Number(process.env.LIST_PER_PAGE),
    ]);
    console.log(rows);
    return {
        data: helper.emptyOrRows(rows),
        meta: { page },
    };
};

module.exports = gebruiker;

/**
 * Prepares a passed gebruiker object for insertion in the db, it's mostly an order
 * thing as the insert query expects an array with a certain order.
 * @param {*} gebruiker a new gebruiker object created with the gebruiker constructor
 * @returns [] an array to be used in the insert query
 */
function prepareForInsert(gebruiker) {
    return [gebruiker.naam, gebruiker.email];
}

/**
 * Prepares a passed gebruiker object for updating in the db, it's mostly an order
 * thing as the update query expects an array with a certain order.
 * @param {*} gebruiker the gebruiker object to be updated, created with the gebruiker constructor
 * @returns an array to be used in the update query
 */
function prepareForUpdate(gebruiker) {
    // TODO: Check for sanity...
    return [...prepareForInsert(gebruiker), gebruiker.gebruiker_id];
}
