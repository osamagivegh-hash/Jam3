const { spawn } = require("child_process");
const path = require("path");

const mode = process.argv[2] === "start" ? "start" : "dev";

const rootDir = path.join(__dirname, "..");

const npm = process.platform === "win32" ? "npm.cmd" : "npm";

function log(msg) {
  console.log(`[orchestrator] ${msg}`);
}

function spawnProc(cmd, args, opts = {}) {
  const proc = spawn(cmd, args, {
    stdio: "inherit",
    shell: true,   // ضروري لحل مشاكل EINVAL في Windows
    ...opts,
  });

  proc.on("exit", (code) => {
    if (code !== 0) process.exit(code);
  });

  return proc;
}

function start() {
  log("Preparing Next.js files...");
  const prepare = spawnProc(npm, ["run", "prepare:next"], { cwd: rootDir });

  prepare.on("exit", (code) => {
    if (code !== 0) return;

    log("Starting backend server...");
    spawnProc("node", ["index.js"], {
      cwd: path.join(rootDir, "backend"),
      env: { ...process.env, PORT: "4100" },
    });

    log(`Starting frontend (${mode})...`);
    const script = mode === "start" ? "start:frontend" : "dev:frontend";
    spawnProc(npm, ["run", script], { cwd: rootDir });
  });
}

start();
