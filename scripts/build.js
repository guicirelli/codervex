/* eslint-disable no-console */
const { spawnSync } = require('child_process')

function run(cmd) {
  const res = spawnSync(cmd, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
  return typeof res.status === 'number' ? res.status : 1
}

// 1) Prisma generate (best-effort)
// On Windows, this can fail with EPERM due to file locking. We must not block Next build.
const prismaExit = run('prisma generate')
if (prismaExit !== 0) {
  console.warn('[build] prisma generate failed (ignored). Continuing...')
}

// 2) Next build (must succeed)
const nextExit = run('next build')
process.exit(nextExit)


