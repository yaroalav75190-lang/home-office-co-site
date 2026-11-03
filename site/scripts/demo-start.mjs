#!/usr/bin/env node
// Promo presentation: the production build on :3100 with log-only lead delivery
// (LEAD_DEMO_NO_DELIVERY=1, see src/app/api/lead/deliver.ts). Forms show the real «спасибо»
// screens and every lead is printed to this terminal. Never use for a public deploy.
//
//   pnpm build && pnpm demo
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'

// Next's own CLI entry, run with this Node: no shell, so nothing to escape (DEP0190).
const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next')

const child = spawn(process.execPath, [nextBin, 'start', '-p', process.env.PORT ?? '3100'], {
  stdio: 'inherit',
  env: { ...process.env, LEAD_DEMO_NO_DELIVERY: '1' },
})
child.on('exit', (code) => process.exit(code ?? 0))
