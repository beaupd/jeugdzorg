const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new competenties that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} competentie an object containing the necessary fields to make a new competentie
 */
const competentie = function (competentie) {
  // TODO: Check for sanity...
  this.competentieId = competentie.competentieId
  this.naam = competentie.naam
}

/**
 * Get all competenties from the database, will be paginated if the number of
 * competenties in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
competentie.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM competenties LIMIT ?,?`, [
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
 * @param {*} competentieId
 * @returns
 */
competentie.getById = async function (competentieId) {
  const rows = await db.query(`SELECT * FROM competenties WHERE competentieId = ?`, [competentieId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new competentie to the database
 * @param {*} competentie a new competentie object created with the competentie constructor
 * @returns an object containing the inserted competentie with the newly inserted competentieId
 */
competentie.post = async function (competentie) {
  const rows = await db.query(
    `INSERT INTO competenties SET ${prepareQuery(competentie)}`,
    prepareParams(competentie)
  )
  competentie.competentieId = rows.insertId
  return {
    data: [competentie],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 * Patch a competentie in the database
 * @param {*} competentie a competentie object to be patched containing at least
 *                        the competentieId and the fields to patch
 * @returns
 */
competentie.patch = async function (competentie) {
  const rows = await db.query(
    `UPDATE competenties SET ${prepareQuery(competentie)} WHERE competentieId = ?`,
    prepareParams(competentie)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Put a competentie in the database
 * @param {*} competentie a competentie object to be put
 * @returns
 */
competentie.put = async function (competentie) {
  const rows = await db.query(
    `UPDATE competenties SET ${prepareQuery(competentie)} WHERE competentieId = ?`,
    prepareParams(competentie)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Delete a competentie from the database
 * @param {*} competentieId the competentieId from the competentie to be deleted
 * @returns
 */
competentie.delete = async function (competentieId) {
  const rows = await db.query(`DELETE FROM competenties WHERE competentieId = ?`, [competentieId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = competentie

/**
 * Prepares part of an SQL query based on a passed partial competentie object
 * @param {*} competentie partial competentie object containing at least the competentieId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(competentie) {
  return Object.keys(competentie)
    .filter((field) => field != 'competentieId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial competentie object for querying the database. Whatever
 * fields are passed, the competentieId needs to be at the end.
 * @param {*} competentie partial competentie object containing at least the competentieId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(competentie) {
  const { competentieId, ...preparedcompetentie } = competentie
  return [...Object.values(preparedcompetentie), competentieId]
}
