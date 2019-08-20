import { ExecaChildProcess } from 'execa'

interface Cache {
  process: ExecaChildProcess | undefined
  mpvPlayer: any
}

export const cache: Cache = { process: undefined, mpvPlayer: undefined }
