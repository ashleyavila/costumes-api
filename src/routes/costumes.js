const express = require('express')
const router = express.Router()
const ctrl = require('../controllers/costumes-controllers')

// Routes for Costumes
router.get('/', ctrl.getAllCostumes)
router.get('/:costumeId', ctrl.getCostume)
router.post('/', ctrl.createCostume)
router.post('/random/:number', ctrl.randomCostumes)
router.put('/:costumeId', ctrl.updateCostume)
router.delete('/:costumeId', ctrl.deleteCostume)

// Routes for Tags
router.get('/:costumeId/tags', ctrl.getCostumeTags)
router.get('/:costumeId/tags/:tagId', ctrl.getCostumeTag)
router.post('/:costumeId/tags', ctrl.createCostumeTag)
router.put('/:costumeId/tags/:tagId', ctrl.updateCostumeTag)
router.delete('/:costumeId/tags/:tagId', ctrl.deleteCostumeTag)

module.exports = router