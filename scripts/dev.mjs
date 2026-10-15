import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const viteEntry = path.join(projectRoot, 'node_modules', 'vite', 'bin', 'vite.js')
let stopping = false
const children = []

function stop(exitCode = 0) {
  if (stopping) return
  stopping = true
  for (const child of children) {
    if (child.exitCode === null) child.kill()
  }
  process.exitCode = exitCode
}

function start(label, entry) {
  const child = spawn(process.execPath, [entry], {
    cwd: projectRoot,
    env: process.env,
    stdio: 'inherit',
  })
  children.push(child)
  child.on('error', (error) => {
    console.error(`${label} failed to start:`, error)
    stop(1)
  })
  child.on('exit', (code, signal) => {
    if (!stopping) {
      if (signal) console.error(`${label} stopped after ${signal}.`)
      stop(code ?? 1)
    }
  })
}

process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())

start('API', path.join(projectRoot, 'server', 'index.mjs'))
start('Vite', viteEntry)