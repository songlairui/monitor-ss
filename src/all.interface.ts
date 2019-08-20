export interface Config {
  method: string
  password: string
  server: string
  server_port: number
  plugin?: string
  plugin_opts?: string
  plugin_args?: string
  remarks?: string
  timeout?: number
}

export interface Callbacks {
  success?(): void
  fail?(): void
}
