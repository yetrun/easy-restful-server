/* 读写资源的方法
 *
 */
const path = require('path')
const fs = require('fs')

let rootDir, dataDir, seedsDir

async function readResources(collection, dir = [dataDir, seedsDir]) {
  if (Array.isArray(dir)) {
    for (const dirItem of dir) {
      const data = await readResources(collection, dirItem)
      if (data.length > 0) {
        return data
      }
    }

    return []
  }

  const resourceFile = path.resolve(dir, `${collection}.json`)

  return new Promise((resolve, reject) => {
    fs.exists(resourceFile, exists => {
      if (exists) {
        fs.readFile(resourceFile, function (err, text) {
          if (err) {
            reject(err)
          } else {
            let resources = JSON.parse(text)
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

function setRootDir (dir) {
  rootDir = dir
  dataDir = path.resolve(rootDir, 'data')
  seedsDir = path.resolve(rootDir, 'seeds')
}

module.exports = {
  readResources,
  writeResources,
  setRootDir
}
