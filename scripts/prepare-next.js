#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'frontend', '.next');
const tracePath = path.join(distDir, 'trace');

function ensureNextWritable() {
  try {
    fs.mkdirSync(distDir, { recursive: true });
  } catch (error) {
    console.warn(`[prepare-next] Could not create .next directory: ${error.message}`);
    return;
  }

  try {
    const stat = fs.lstatSync(tracePath);
    if (stat.isDirectory()) {
      fs.rmSync(tracePath, { recursive: true, force: true });
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn(`[prepare-next] Unable to access trace entry: ${error.message}`);
    }
  }

  try {
    fs.writeFileSync(tracePath, '', { flag: 'a' });
    fs.chmodSync(tracePath, 0o600);
  } catch (error) {
    console.warn(`[prepare-next] Unable to precreate trace file: ${error.message}`);
  }
}

ensureNextWritable();
