const model = require('../models/costumes-model')

// Costume controllers
function getCostumes(req, res, next) {
  const result = model.getCostumes()
  res.status(200)
}


function getCostume(req, res, next) {
  const costumeId = req.params.costumeId
  const result = model.getCostume(costumeId)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(200).json({ data: result })
}


function createCostume(req, res, next) {
  const body = req.body
  const result = model.createCostume(body)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(201).json({ data: result })
}


function updateCostume(req, res, next) {
  const costumeId = req.params.costumeId
  const body = req.body
  const result = model.updateCostume(costumeId, body)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(200).json({ data: result })
}


function deleteCostume(req, res, next) {
  const costumeId = req.params.costumeId
  const result = model.deleteCostume(costumeId)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(200).json({ data: result })
}


function randomCostumes(req, res, next) {
  let num = Number(req.params.number)
  const result = model.randomCostumes(num)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(201).json(result)
}

// Tag controllers
function getCostumeTags(req, res, next) {
  const costumeId = req.params.costumeId
  const result = model.getCostumeTags(costumeId)
  res.status(200).json({ data: result })
}


function getCostumeTag(req, res, next) {
  const costumeId = req.params.costumeId
  const tagId = req.params.tagId
  const result = model.getCostumeTag(costumeId, tagId)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(200).json({ data: result })
}


function createCostumeTag(req, res, next) {
  const costumeId = req.params.costumeId
  const body = req.body
  const result = model.createCostumeTag(costumeId, body)

  if (result.errors) {
    return next(result.errors)
  }
  res.status(201).json({ data: result })
}


function updateCostumeTag(req, res, next) {
  const costumeId = req.params.costumeId
  const tagId = req.params.tagId
  const body = req.body
  const result = model.updateCostumeTag(costumeId, tagId, body)

  if (result.errors) {
    return next(result.errors)
  } 
  res.status(200).json({ data: result })
}


function deleteCostumeTag(req, res, next) {
  const costumeId = req.params.costumeId
  const tagId = req.params.tagId
  const result = model.deleteCostumeTag(costumeId, tagId)

  if (result.errors) {
    return next(result.errors)
  } 
  res.status(200).json({ data: result })
}


module.exports = {
  getAllCostumes,
  getCostume,
  createCostume,
  randomCostumes,
  updateCostume,
  deleteCostume,
  getCostumeTags,
  getCostumeTag,
  createCostumeTag,
  updateCostumeTag,
  deleteCostumeTag
}
