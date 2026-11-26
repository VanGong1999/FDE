#!/usr/bin/env node
import { cp, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const publicDir = path.resolve(__dirname, '../public')

async function copyDir(name) {
  const from = path.join(root, name)
  const to = path.join(publicDir, name)
  await rm(to, { recursive: true, force: true })
  await cp(from, to, { recursive: true })
  console.log(`Copied ${name} → public/${name}`)
}

async function main() {
  await mkdir(publicDir, { recursive: true })
  await copyDir('docs')
  await copyDir('pictures')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
