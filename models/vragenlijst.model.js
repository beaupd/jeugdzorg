const db = require("./db");
const helper = require("./helper");

/**
 * Constructor for new vragenlijsts that checks if the passed object adheres the format
 * we need and throws errors if it doesn't
 * @param {*} vragenlijst an object containing the necessary fields to make a new vragenlijst
 */
const vragenlijst = function (vragenlijst) {
    // TODO: Check for sanity...
    this.vragenlijst_id = vragenlijst.vragenlijst_id;
    this.naam = vragenlijst.naam;
};

/**
 * Add a new vragenlijst to the database
 * @param {*} vragenlijst a new vragenlijst object created with the vragenlijst constructor
 * @returns an object containing the inserted vragenlijst with the newly inserted vragenlijstId
 */
vragenlijst.create = async function (vragenlijst) {
    const rows = await db.query(
        `INSERT INTO vragenlijsten SET naam = ?`,
        prepareForInsert(vragenlijst)
    );
    vragenlijst.vragenlijstId = rows.insertId;
    return {
        data: [vragenlijst],
        meta: {
            insertId: rows.insertId,
        },
    };
};

/**
 * Get all vragenlijsts from the database, will be paginated if the number of
 * vragenlijsts in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of vragenlijsts you want to get
 * @returns
 */
vragenlijst.getAll = async function (page = 1) {
    const rows = await db.query(`SELECT * FROM \`vragenlijsten\``, [
        helper.getOffset(page, process.env.LIST_PER_PAGE),
        Number(process.env.LIST_PER_PAGE),
    ]);
    console.log(rows);
    return {
        data: helper.emptyOrRows(rows),
        meta: { page },
    };
};

module.exports = vragenlijst;

/**
 * Prepares a passed vragenlijst object for insertion in the db, it's mostly an order
 * thing as the insert query expects an array with a certain order.
 * @param {*} vragenlijst a new vragenlijst object created with the vragenlijst constructor
 * @returns [] an array to be used in the insert query
 */
function prepareForInsert(vragenlijst) {
    return [vragenlijst.naam];
}

/**
 * Prepares a passed vragenlijst object for updating in the db, it's mostly an order
 * thing as the update query expects an array with a certain order.
 * @param {*} vragenlijst the vragenlijst object to be updated, created with the vragenlijst constructor
 * @returns an array to be used in the update query
 */
function prepareForUpdate(vragenlijst) {
    // TODO: Check for sanity...
    return [...prepareForInsert(vragenlijst), vragenlijst.vragenlijst_id];
}
