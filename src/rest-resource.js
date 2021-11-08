const { orderBy, filter, matches, pick, omit } = require('lodash')
const { readResources, writeResources } = require('./rw-resources')

async function index(req, res, collection) {
  let resources = await readResources(collection)

  // 将 URL 中的参数转化为可传递给 readResources 的参数
  const query = parseQuery(req.query)
  resources = queryResources(resources, query)

  res.send(resources)
}

async function find(req, res, collection, id) {
  const resources = await readResources(collection)
  const resource = resources.find(r => r.id === id)

  if (resource) {
    res.send(resource)
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

function parseQuery(query) {
  // 取出排序参数
  let { orderBy, order } = pick(query, ['orderBy', 'order'])
  orderBy = orderBy || 'id'
  order = order || 'asc'

  return {
    filters: omit(query, ['orderBy', 'order']),
    orders: [orderBy, order]
  }
}

function queryResources(resources, { filters = {}, orders: [orderKey, order] } = {}) {
  // 根据 filters 筛选资源
  resources = filter(resources, matches(filters))

  // 根据 order 排序资源
  resources = orderBy(resources, orderKey, order)

  return resources
}

module.exports = restResource
