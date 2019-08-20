import * as fs from 'fs'
import Debug from 'debug'
import { Config, Callbacks } from '../all.interface'
import { targetFile } from '../config'

const debug = Debug('[update file]')

export default function updateTmp(
  theConfig: Config,
  callbacks: Callbacks = {}
) {
  try {
    const { method, password, server, server_port } = theConfig
    debug({ method, password, server, server_port })
    const originRaw = JSON.parse(fs.readFileSync(targetFile).toString())
    const configs: Config[] = originRaw.configs
    let tmpConfig = configs.find(
      config => config.remarks && config.remarks.startsWith('tmp')
    )
    if (tmpConfig) {
      Object.assign(tmpConfig, {
        method,
        password,
        server,
        server_port,
        remarks: `tmp ${new Date().toISOString()}`,
      })
    } else {
      configs.push({
        server,
        server_port,
        password,
        method,
        plugin: '',
        plugin_opts: '',
        plugin_args: '',
        remarks: `tmp ${new Date().toISOString()}`,
        timeout: 5,
      })
    }
    fs.writeFileSync(targetFile, JSON.stringify(originRaw, null, 2))
    debug('√')
    callbacks.success
      ? callbacks.success()
      : console.warn('Update Config Success')
  } catch (error) {
    debug('×')
    callbacks.fail
      ? callbacks.fail(error)
      : console.warn('Update Config fail', error)
  }
}
