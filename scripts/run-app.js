const { spawn } = require('child_process');
const path = require('path');

const mode = process.argv[2] === 'start' ? 'start' : 'dev';
const frontendScript = mode === 'start' ? 'start:frontend' : 'dev:frontend';
const rootDir = path.join(__dirname, '..');
const children = [];
let shuttingDown = false;

function log(message) {
  // eslint-disable-next-line no-console
  console.log(`[orchestrator] ${message}`);
}

function stopAll(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach((child) => {
    if (!child.killed) {
      child.kill('SIGTERM');
    }
  });
  setTimeout(() => process.exit(exitCode), 100);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    // Using a shell on Windows breaks argument quoting when the project path
    // contains spaces or non-Latin characters (e.g. Arabic directories). By
    // disabling the shell we pass the arguments directly to the process,
    // ensuring Node receives the full script path instead of a truncated token.
    shell: false,
    ...options,
  });

  child.on('close', (code) => {
    if (!shuttingDown && code !== 0) {
      log(`${command} exited with code ${code}`);
      stopAll(code || 1);
    }
  });

  children.push(child);
  return child;
}

function startServices() {
  log('Starting backend server...');
  spawnProcess('node', [path.join(rootDir, 'backend', 'index.js')]);

  log(`Starting frontend (${mode})...`);
  spawnProcess(npmCommand, ['run', frontendScript], { cwd: rootDir });
}

log('Preparing Next.js files...');
const prepare = spawnProcess(npmCommand, ['run', 'prepare:next'], { cwd: rootDir });
prepare.on('close', (code) => {
  if (code === 0 && !shuttingDown) {
    startServices();
  } else {
    stopAll(code || 1);
  }
});

process.on('SIGINT', () => stopAll());
process.on('SIGTERM', () => stopAll());
