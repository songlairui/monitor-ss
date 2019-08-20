import * as fs from 'fs'
import { targetFile } from './config'
import { Config } from './all.interface'
import * as execa from 'execa'

export class SsConfigItem {
  current: Config | undefined
  configs: Config[]
  process: any
  constructor() {
    this.configs = []
    this.load()
  }
  load() {
    try {
      const originRaw = JSON.parse(fs.readFileSync(targetFile).toString())
      const configs: Config[] = originRaw.configs || []
      this.configs = configs
      this.current = configs.find(
        config => config.remarks && config.remarks.startsWith('tmp')
      )
    } catch (error) {
      console.warn('load err', error.message)
    }
  }
  applyCurrent() {
    if (this.current) {
      const { method, password, server, server_port } = this.current
      const args = [
        '-cipher',
        method.toUpperCase(),
        '-password',
        password,
        '-socks',
        '127.0.0.1:65001',
        '-c',
        `${server}:${server_port}`,
        '-u',
      ]
      try {
        console.warn('go-shadowsocks2', args.join(' '))
        const subProcess = execa('go-shadowsocks2', args)
        if (subProcess.stdout) {
          subProcess.stdout.pipe(process.stdout)
        }
        if (subProcess.stderr) {
          subProcess.stderr.pipe(process.stderr)
        }
        subProcess.catch(err => {
          console.warn('err', err.message)
        })
        this.process = subProcess
      } catch (error) {
        console.info('请安装 go-shadowsocks2', error.message)
      }
    } else {
      //
    }
  }
  all() {}
}

function test() {
  const testItem = new SsConfigItem()
  testItem.applyCurrent()
}

test()
