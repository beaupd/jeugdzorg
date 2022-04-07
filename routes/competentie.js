const express = require('express')
const Competentie = require('../models/competentie.model')

module.exports = express
  .Router()

  // Add a new item
  .post('/', async (req, res, next) => {
    try {
      console.log('Got: ', req.body)
      res.json(await Competentie.post(new Competentie(req.body)))
    } catch (err) {
      console.error('Error while adding: ', err.message)
      next(err)
    }
  })

  // List ALL items
  .get('/', async (req, res, next) => {
    try {
      res.json(await Competentie.get(req.query.page))
    } catch (err) {
      console.error('Error while getting all: ', err.message)
      next(err)
    }
  })

  // Get a specific item
  .get('/:id', async (req, res, next) => {
    try {
      res.json(await Competentie.getById(req.params.id))
    } catch (err) {
      res.json({
        message: `Error while getting specific: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Put an item
  .put('/', async (req, res, next) => {
    try {
      res.json(await Competentie.put(new Competentie(req.body)))
    } catch (err) {
      res.json({
        message: `Error while putting: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Patch an item
  .patch('/', async (req, res, next) => {
    try {
      res.json(await Competentie.patch(req.body))
    } catch (err) {
      res.json({
        message: `Error while patching: ${err.message}`,
        request: req.body,
      })
    }
  })

  // Delete an item
  .delete(['/', '/:id'], async (req, res, next) => {
    try {
      res.json(await Competentie.delete(req.params.id || req.body.id))
    } catch (err) {
      res.json({
        message: `Error while deleting: ${err.message}`,
        request: `You tried to delete id: ${req.params.id || req.body.id}`,
      })
    }
  })
