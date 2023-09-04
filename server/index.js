import path from "path"
import { fileURLToPath } from 'url'
import {run} from "./modules/server.js"
import fs from "fs";
import {nvl} from "./Helpers/nvl.js";
import {hostname} from "os";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, 'utf-8'))

globalThis.rootPath = path.dirname(__dirname)
globalThis.appPath = __dirname
globalThis.configPath = __dirname
globalThis.config = readJson(path.resolve(configPath, "config.json"))
globalThis.packageJson = readJson(path.resolve(rootPath, "package.json"))
globalThis.hostName = nvl(config.server.name, hostname().split(".")[0])

run()