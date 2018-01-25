const faker = require('faker')
const uuid = require('uuid/v4')
const fs = require('fs')
const costumesDb = 'db/costumes-database.json'
const tagsDb = 'db/tags-database.json'

// TAGS

// Create random data
function _randomTags(num) {
  // Generate tags only if none exist
  // Require a minumum of 3 tags
  if (!num || num < 3) num = 3

  const tags = []
  // Generate requested number of tags
  for (let i = 1; i <= num; i++) {
    let tag = {
      id: uuid(),
      name: faker.commerce.department(),
      color: faker.internet.color()
    }
    tags.push(tag)
  }
  return tags
}


// Generates random costumes
function randomCostumes(num) {
  if (!num || num < 1) {
    let status = 400
    let message = `We need to know how many costumes to sew!`
    return { errors: { status, message } }
  }
  if (num > 100) {
    let status = 400
    let message = `Oof, that's too many costumes. 100 or less please.`
    return { errors: { status, message }}
  }

  // Get exisiting tags or generate new ones
  const tags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
  if (tags.length < 3) {
    // If < 3 tags, generate 5 additional tags and add them to database
    let newTags = _randomTags(5)
    // Add new tags to existing tags
    Array.prototype.push.apply(tags, newTags)
    // Write tags back to file
    fs.writeFileSync(tagsDb, JSON.stringify(tags))
  }

  // Get existing costumes
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8')) || []
  const newCostumes = []

  // Create random costumes
  for (let i = 1; i <= num; i++) {
    // Assign 3 random tag ids (or less if duplicated)
    let costumeTags = []
    for (let i = 1; i <= 3; i++) {
      let randomTagId = tags[Math.floor(Math.random() * tags.length)].id
      if (!costumeTags.find(element => element === randomTagId)) {
        costumeTags.push(randomTagId)
      }
    }
    // Build costume using random values
    let costume = {
      id: uuid(),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()) + .99,
      description: `${faker.commerce.productAdjective()} costume made of ${faker.commerce.productMaterial()} fabric.`,
      tags: costumeTags
    }
    costumes.push(costume)
    newCostumes.push(costume)
  }
  // Write back to costumes database file
  fs.writeFileSync(costumesDb, JSON.stringify(costumes))
  return newCostumes
}

// COSTUMES

function getAllCostumes() {
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
  // Replace tag ids with full tag info 
  costumes.forEach(costume => {
    if (costume.tags) {
      for (let i = 0; i < costume.tags.length; i++) {
        costume.tags[i] = allTags.find(element => element.id === costume.tags[i])
      }
    }
  })
  return costumes
}

function getCostume(costumeId) {
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  let costume = costumes.find(element => element.id === costumeId)
  
  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    // Replace tag ids with full tag info 
    if (costume.tags) {
      const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
      for (let i = 0; i < costume.tags.length; i++) {
        costume.tags[i] = allTags.find(element => element.id === costume.tags[i])
      }
    }
    response = costume
  }
  return response
}

function createCostume(body) {
  const { name, price, description, tags } = body

  let response
  if (!name || !price) {
    let status = 400
    let message = `You can't have a costume without a name and a price.`
    response = { errors: { status, message } }
  } else {
    const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
    const costume = { id: uuid(), name, price, description, tags }
    costumes.push(costume)
    response = costume
    fs.writeFileSync(costumesDb, JSON.stringify(costumes))
  }
  return response
}

function updateCostume(costumeId, body) {
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  const costume = costumes.find(element => element.id === costumeId)

  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    const { name, price, description, tags } = body
    if (!name && !price && !description && !tags) {
      let status = 400
      let message = `Must provide some details to change costume - none were!`
      response = { errors: { status, message } }
    } else {
      if (name) costume.name = name
      if (price) costume.price = price
      if (description) costume.description = description
      if (tags) costume.tags = tags

      response = costume
      fs.writeFileSync(costumesDb, JSON.stringify(costumes))
    }
  }
  return response
}

function deleteCostume(costumeId) {
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))  
  const costume = costumes.find(element => element.id === costumeId)
  
  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    const index = costumes.indexOf(costume)
    response = costumes.splice(index, 1)[0]
    fs.writeFileSync(costumesDb, JSON.stringify(costumes))
  }
  return response
}

// TAGS

function getCostumeTags(costumeId) {
  // Find costume
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  let costume = costumes.find(element => element.id === costumeId)

  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    if (!costume.tags) {
      let status = 404
      let message = `This costume doesn't have any tags!`
      response = { errors: { status, message } }
    } else {
      // If costume has tags, fill in full tag info from tags database
      const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
      for (let i = 0; i < costume.tags.length; i++) {
        costume.tags[i] = allTags.find(element => element.id === costume.tags[i])
      }
      response = costume.tags
    }
  }
  return response
}

function getCostumeTag(costumeId, tagId) {
  // Find costume
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  let costume = costumes.find(element => element.id === costumeId)

  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    let tag
    if (costume.tags) tag = costume.tags.find(element => element === tagId)
    if (!tag) {
      // Either there are no tags, or the particular tag does not exist
      let status = 404
      let message = `There is no such tag on this costume!`
      response = { errors: { status, message } }
    } else {
      // Fill in full tag info from tags database
      const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
      tag = allTags.find(element => element.id === tag)
      response = tag
    }
  }
  return response
}

function createCostumeTag(costumeId, body) {
  // Find costume
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  let costume = costumes.find(element => element.id === costumeId)

  let response
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    // Get tag info from body
    const { id, name, color } = body
  
    let response
    // Load tag database
    const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
    // If id is provided, we'll add a tag with the existing id
    if (id) {
      existingId = allTags.find(element => element.id === id)
      if (existingId) { 
        // id is a valid id in the database 
        if (!costume.tags.find(element => element === id)) {
          //only push tag if costume doesn't have the tag already
          costume.tags.push(id)
        }
        response = existingId
      } else {
        // id is not valid
        let status = 404
        let message = `This is not an existing tag ID.`
        response = { error: { status, message } }
      }
    // If no id is provided, then create a new tag. Name is required; color is optional
    } else if (!name) {
      let status = 400
      let message = `You can't create a tag without a name.`
      response = { errors: { status, message } }
    } else {
      // Create new tag
      const tag = { id: uuid(), name, color }
      // No guarantee there is an existing tag field; if not, intitialize it
      if (!costume.tags) costume.tags = []
      // Add our new tag to costume tags field
      costume.tags.push(tag.id)
      // Add our new tag to tags database
      allTags.push(tag)
      // Write databses to files
      fs.writeFileSync(costumesDb, JSON.stringify(costumes))
      fs.writeFileSync(tagsDb, JSON.stringify(allTags))

      response = tag 
    }
    return response
  }
}

function updateCostumeTag(costumeId, tagId, body) {
  let response
  // Find costume
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  const costume = costumes.find(element => element.id === costumeId)
  if (!costume) {
    let status = 404
    let message = `Costume not found! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    // Check that an updated value has been provided
    const { name, color } = body
    if (!name && !color) {
      let status = 400
      let message = `Must provide tag details to change - none were!`
      response = { errors: { status, message } }
    } else {
      // Check if costume has this tag
      if (!costume.tags) {
        let status = 404
        let message = `This costume does not have any tags.`
        response = { errors: { status, message } }
      } else {
        if (!costume.tags.find(element => element === tagId)) {
          let status = 404
          let message = `This costume does not have this tag.`
          response = { errors: { status, message } }
        } else {
          // If it does exist, we need to update the tag database
          const allTags = JSON.parse(fs.readFileSync(tagsDb, 'utf-8'))
          const tag = allTags.find(element => element.id === tagId)
          if (name) tag.name = name
          if (color) tag.color = color
          // Write database file
          fs.writeFileSync(tagsDb, JSON.stringify(allTags))
          response = tag
        }
      }
    }
  }
  return response
}

function deleteCostumeTag(costumeId, tagId) {
  let response

  // Find costume
  const costumes = JSON.parse(fs.readFileSync(costumesDb, 'utf-8'))
  let costume = costumes.find(element => element.id === costumeId)
  if (!costume) {
    let status = 404
    let message = `No threads here! Couldn't find a costume with an ID matching ${costumeId}.`
    response = { errors: { status, message } }
  } else {
    // Find tag
    if (!costume.tags) {
      let status = 404
      let message = `This costume does not have any tags.`
      response = { errors: { status, message } }
    } else {
      const index = costume.tags.indexOf(tagId)
      if (index === -1) {
        let status = 404
        let message = `This costume does not have this tag.`
        response = { errors: { status, message } }
      } else {
        // Remove tag
        response = costume.tags.splice(index, 1)[0]
        // Write database file
        fs.writeFileSync(costumesDb, JSON.stringify(costumes))
      }
    }
  }
  return response
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