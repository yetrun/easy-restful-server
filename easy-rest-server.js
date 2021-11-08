#!/usr/bin/env node
/* 一个命令行工具，它将当前目录变成一个 Restful Server 的数据库
 *
 */
const server = require('./src/server')
const { setRootDir } = require('./src/rw-resources')

setRootDir(process.cwd())
const port = process.argv.length > 2 ? parseInt(process.argv[2]) : 3000

server.listen(port, () => {
  console.log(`Restful app listening at http://localhost:${port}`)
})
