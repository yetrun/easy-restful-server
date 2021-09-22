const fs = require('fs')
const path = require('path')

const dataDir = path.resolve(__dirname, 'data')

async function readResources(collection, query = {}) {
  const resourceFile = path.resolve(dataDir, `${collection}.json`)

  return new Promise((resolve, reject) => {
    fs.exists(resourceFile, exists => {
      if (exists) {
        fs.readFile(resourceFile, function (err, text) {
          if (err) {
            reject(err)
          } else {
            let resources = JSON.parse(text)
            for (const [key, value] of Object.entries(query)) {
              resources = resources.filter(resource => resource[key] == value)
            }
            resolve(resources)
          }
        })
      } else {
        resolve([])
      }
    })
  })
}

async function writeResources(collection, resources) {
  const resourceFile = path.resolve(dataDir, `${collection}.json`)

  return new Promise((resolve, reject) => {
    fs.exists(dataDir, exists => {
      if (!exists) {
        fs.mkdir(dataDir, {recursive: true}, err => {
          if (err) {
            reject(err)
          } else {
            writeResources(resources).then(() => resolve()).catch(reject)
          }
        })
      } else {
        fs.writeFile(resourceFile, JSON.stringify(resources, null, 2), err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      }
    })
  })
}


async function index(req, res, collection) {
  let resources = await readResources(collection, req.query)
  res.send(resources)
}

async function find (req, res, collection, id) {
  const resources = await readResources(collection, { id })
  if (resources.length >= 1) {
    res.send(resources[0])
  } else {
    res.status(404).end('Not found!')
  }
}

async function create (req, res, collection) {
  const resources = await readResources(collection)
  const resourceId = resources.length > 0 ? resources[resources.length - 1].id + 1 : 1
  const resource = { id: resourceId, ...req.body, id: resourceId }

  resources.push(resource)
  await writeResources(collection, resources)
  res.status(201).send(resource)
}

async function update (req, res, collection, id) {
  const resources = await readResources(collection)
  const resource = resources.find(resource => resource.id == id)
  Object.assign(resource, req.body)
  writeResources(collection, resources)
  res.send(resource)
}

async function destroy (req, res, collection, id) {
    const resources = await readResources(collection)
    const index = resources.findIndex(resource => resource.id == id)
    resources.splice(index, 1)
    writeResources(collection, resources)
    res.status(204).end()
}

function restResource(req, res, next) {
  // 去掉头尾的 '/'
  const path = req.path.replace(/(^\/|\/$)/g, '')
  const parts = path.split('/')
  if (parts.length > 2) {
    next()
  }

  const [collection, id] = parts
  switch(req.method) {
  case  'GET':
    return id ? find(req, res, collection, id)  : index(req, res, collection)
  case  'POST':
    return id ? next() : create(req, res, collection)
  case  'PUT':
    return id ? update(req, res, collection, id) : next()
  case  'DELETE':
    return id ? destroy(req, res, collection, id) : next()
  default:
    return next()
  }
}

module.exports = restResource
