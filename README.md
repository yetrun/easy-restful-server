# Easy Restful Server

一个简单的 restful server，响应所有的 restful 的增、删、查、改操作。

## 运行项目

安装依赖

```bash
$ yarn
```

启动服务（port 默认为 3000）
```bash
$ yarn start <port>
```

## 数据文件夹

运行中数据存储在根目录下的 `data` 目录，初始化时的种子文件存储在根目录下的 `seeds` 目录。

## 使用命令行工具

下载下来，执行：

```bash
$ yarn link
```

即可执行命令行工具 `easy-rest-server`. 命令行工具 `easy-rest-server` 将当前目录变成 Restful Server 数据存储目录。

```bash
# 监听 3000 端口
$ easy-rest-server

# 监听 4000 端口
$ easy-rest-server 4000
```
