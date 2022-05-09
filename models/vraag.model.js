const db = require("./db");
const helper = require("./helper");

/**
 * Constructor for new vraags that checks if the passed object adheres the format
 * we need and throws errors if it doesn't
 * @param {*} vraag an object containing the necessary fields to make a new vraag
 */
const vraag = function (vraag) {
    // TODO: Check for sanity...
    this.vraag_id = vraag.vraag_id;
    this.subvragen = vraag.subvragen;
    this.vragenlijst_id = vraag.vragenlijst_id;
    this.competentie_id = vraag.competentie_id;
};

/**
 * Add a new vraag to the database
 * @param {*} vraag a new vraag object created with the vraag constructor
 * @returns an object containing the inserted vraag with the newly inserted vraagId
 */
vraag.create = async function (vraag) {
    const rows = await db.query(
        `INSERT INTO vragen SET subvragen = ?, vragenlijst_id = ?, competentie_id = ?`,
        prepareForInsert(vraag)
    );
    vraag.vraagId = rows.insertId;
    return {
        data: [vraag],
        meta: {
            insertId: rows.insertId,
        },
    };
};

/**
 * Update a vraag in the database, should return a usefull message if anything
 * goes wrong.. but we still have to fix this..
 * @param {*} vraag the vraag object to be updated, created with the vraag constructor
 * @returns an object with the updated vraag and some metadata
 */
vraag.update = async function (vraag) {
    const rows = await db.query(
        "UPDATE vraag SET name = ?, description = ?, avatar = ?, url = ? WHERE vraagId = ?",
        prepareForUpdate(vraag)
    );
    return {
        data: [vraag],
        meta: {
            affectedRows: rows.affectedRows,
            changedRows: rows.changedRows,
        },
    };
};

vraag.remove = async function (vraagId) {};
vraag.removeAll = async function () {};

/**
 * Find a corresponding vraag in the database using the passed vraagId
 * @param {*} vraagId a vraagId to lookup in the database
 * @returns an object with the found vraag
 */
vraag.findById = async function (vraagId) {
    const rows = await db.query(`SELECT * FROM vraag WHERE vraagId = ?`, [
        vraagId,
    ]);
    return {
        data: helper.emptyOrRows(rows),
        meta: { vraagId },
    };
};

/**
 * Get all vraags from the database, will be paginated if the number of
 * vraags in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of vraags you want to get
 * @returns
 */
vraag.getAll = async function (page = 1) {
    const rows = await db.query(`SELECT * FROM \`vragen\``, [
        helper.getOffset(page, process.env.LIST_PER_PAGE),
        Number(process.env.LIST_PER_PAGE),
    ]);
    console.log(rows);
    return {
        data: helper.emptyOrRows(rows),
        meta: { page },
    };
};

module.exports = vraag;

/**
 * Prepares a passed vraag object for insertion in the db, it's mostly an order
 * thing as the insert query expects an array with a certain order.
 * @param {*} vraag a new vraag object created with the vraag constructor
 * @returns [] an array to be used in the insert query
 */
function prepareForInsert(vraag) {
    return [vraag.subvragen, vraag.vragenlijst_id, vraag.competentie_id];
}

/**
 * Prepares a passed vraag object for updating in the db, it's mostly an order
 * thing as the update query expects an array with a certain order.
 * @param {*} vraag the vraag object to be updated, created with the vraag constructor
 * @returns an array to be used in the update query
 */
function prepareForUpdate(vraag) {
    // TODO: Check for sanity...
    return [...prepareForInsert(vraag), vraag.vraag_id];
}
