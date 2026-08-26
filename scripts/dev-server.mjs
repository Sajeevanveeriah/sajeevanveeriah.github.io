import { spawn } from 'node:child_process'
import path from 'node:path'

const args = process.argv.slice(2)
let host = 'localhost'
let port = '3000'

for (let index = 0; index < args.length; index += 1) {
  if (args[index] === '--host' && args[index + 1]) host = args[index + 1]
  if (args[index] === '--port' && args[index + 1]) port = args[index + 1]
}

const executable = path.join(process.cwd(), 'node_modules', '.bin', 'next')
const child = spawn(executable, ['dev', '-H', host, '-p', port], { stdio: 'inherit' })

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 0)
})
