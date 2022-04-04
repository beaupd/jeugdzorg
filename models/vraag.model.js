const db = require('./db')
const helper = require('./helper')

/**
 * Constructor for new vragen that checks if the passed object adheres the
 * format we need and throws errors if it doesn't
 * @param {*} vraag an object containing the necessary fields to make a new vraag
 */
const vraag = function (vraag) {
  // TODO: Check for sanity...
  this.vraagId = vraag.vraagId
  this.vragenlijstId = vraag.vragenlijstId
  this.competentieId = vraag.competentieId
  this.vraag = vraag.vraag
}

/**
 * Get all vragen from the database, will be paginated if the number of
 * vragen in the database exceeds process.env.LIST_PER_PAGE
 * @param {*} page the page of authors you want to get
 * @returns
 */
vraag.get = async function (page = 1) {
  const rows = await db.query(`SELECT * FROM vraag LIMIT ?,?`, [
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
 * @param {*} vraagId
 * @returns
 */
vraag.getById = async function (vraagId) {
  const rows = await db.query(`SELECT * FROM vraag WHERE vraagId = ?`, [vraagId])
  return {
    data: helper.emptyOrRows(rows),
    meta: { page },
  }
}

/**
 * Add a new vraag to the database
 * @param {*} vraag a new vraag object created with the vraag constructor
 * @returns an object containing the inserted vraag with the newly inserted vraagId
 */
vraag.post = async function (vraag) {
  const rows = await db.query(`INSERT INTO vraag SET ${prepareQuery(vraag)}`, prepareParams(vraag))
  vraag.vraagId = rows.insertId
  return {
    data: [vraag],
    meta: {
      insertId: rows.insertId,
    },
  }
}

/**
 * Patch a vraag in the database
 * @param {*} vraag a vraag object to be patched containing at least
 *                        the vraagId and the fields to patch
 * @returns
 */
vraag.patch = async function (vraag) {
  const rows = await db.query(
    `UPDATE vraag SET ${prepareQuery(vraag)} WHERE vraagId = ?`,
    prepareParams(vraag)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Put a vraag in the database
 * @param {*} vraag a vraag object to be put
 * @returns
 */
vraag.put = async function (vraag) {
  const rows = await db.query(
    `UPDATE vraag SET ${prepareQuery(vraag)} WHERE vraagId = ?`,
    prepareParams(vraag)
  )
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

/**
 * Delete a vraag from the database
 * @param {*} vraagId the vraagId from the vraag to be deleted
 * @returns
 */
vraag.delete = async function (vraagId) {
  const rows = await db.query(`DELETE FROM vraag WHERE vraagId = ?`, [vraagId])
  return {
    data: helper.emptyOrRows(rows),
    meta: {},
  }
}

module.exports = vraag

/**
 * Prepares part of an SQL query based on a passed partial vraag object
 * @param {*} vraag partial vraag object containing at least the vraagId
 * @returns a string to be used in the patch query, eg 'field = ?, field2 = ? ...'
 */
function prepareQuery(vraag) {
  return Object.keys(vraag)
    .filter((field) => field != 'vraagId')
    .map((field) => `${field} = ?`)
    .reduce((prev, curr) => `${prev}, ${curr}`)
}

/**
 * Prepares a passed partial vraag object for querying the database. Whatever
 * fields are passed, the vraagId needs to be at the end.
 * @param {*} vraag partial vraag object containing at least the vraagId
 * @returns [] an array to be used in the patch query
 */
function prepareParams(vraag) {
  const { vraagId, ...preparedvraag } = vraag
  return [...Object.values(preparedvraag), vraagId]
}
