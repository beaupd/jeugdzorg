const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new vragenlijsten that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} vragenlijst an object containing the necessary fields to make a new vragenlijst
 */
const vragenlijst = function (vragenlijst) {
  // TODO: Check for sanity...
  this.vragenlijstId = vragenlijst.vragenlijstId
  this.naam = vragenlijst.naam
}

/**
 * Get all vragenlijsten from the database, will be paginated if the number of
 * vragenlijsten in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
vragenlijst.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM vragenlijst LIMIT ?,?`, [
    helper.getOffset(page, process.env.LIST_PER_PAGE),
    Number(process.env.LIST_PER_PAGE),
  ])

  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 *
 * @param {*} vragenlijstId
 * @returns
 */
vragenlijst.getById = async function (vragenlijstId) {
  const rows = await db.query(`SELECT * FROM vragenlijst WHERE vragenlijstId = ?`, [vragenlijstId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new vragenlijst to the database
 * @param {*} vragenlijst a new vragenlijst object created with the vragenlijst constructor
 * @returns an object containing the inserted vragenlijst with the newly inserted vragenlijstId
 */
vragenlijst.post = async function (vragenlijst) {
  const rows = await db.query(
    `INSERT INTO vragenlijst SET ${prepareQuery(vragenlijst)}`,
    prepareParams(vragenlijst)
  )
  vragenlijst.vragenlijstId = rows.insertId
  return {
    data: [vragenlijst],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 * Patch a vragenlijst in the database
 * @param {*} vragenlijst a vragenlijst object to be patched containing at least
 *                        the vragenlijstId and the fields to patch
 * @returns
 */
vragenlijst.patch = async function (vragenlijst) {
  const rows = await db.query(
    `UPDATE vragenlijst SET ${prepareQuery(vragenlijst)} WHERE vragenlijstId = ?`,
    prepareParams(vragenlijst)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Put a vragenlijst in the database
 * @param {*} vragenlijst a vragenlijst object to be put
 * @returns
 */
vragenlijst.put = async function (vragenlijst) {
  const rows = await db.query(
    `UPDATE vragenlijst SET ${prepareQuery(vragenlijst)} WHERE vragenlijstId = ?`,
    prepareParams(vragenlijst)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Delete a vragenlijst from the database
 * @param {*} vragenlijstId the vragenlijstId from the vragenlijst to be deleted
 * @returns
 */
vragenlijst.delete = async function (vragenlijstId) {
  const rows = await db.query(`DELETE FROM vragenlijst WHERE vragenlijstId = ?`, [vragenlijstId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = vragenlijst

/**
 * Prepares part of an SQL query based on a passed partial vragenlijst object
 * @param {*} vragenlijst partial vragenlijst object containing at least the vragenlijstId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(vragenlijst) {
  return Object.keys(vragenlijst)
    .filter((field) => field != 'vragenlijstId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial vragenlijst object for querying the database. Whatever
 * fields are passed, the vragenlijstId needs to be at the end.
 * @param {*} vragenlijst partial vragenlijst object containing at least the vragenlijstId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(vragenlijst) {
  const { vragenlijstId, ...preparedvragenlijst } = vragenlijst
  return [...Object.values(preparedvragenlijst), vragenlijstId]
}
