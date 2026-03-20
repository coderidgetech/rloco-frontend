#!/usr/bin/env node
/**
 * Generate 192x192 and 512x512 PWA icons (simple dark square with "R").
 * Run from project root: node scripts/generate-pwa-icons.js
 * Requires: npm install -D pngjs (or run with node 18+ and no deps - this uses fs only and minimal PNG).
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Minimal valid PNG generator (no external deps) - creates a solid color PNG
function createPNG(width, height, r, g, b) {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(25);
  ihdr.writeUInt32BE(13, 0); // length
  ihdr.write('IHDR', 4);
  ihdr.writeUInt32BE(width, 8);
  ihdr.writeUInt32BE(height, 12);
  ihdr.writeUInt8(8, 16);  // bit depth
  ihdr.writeUInt8(2, 17);  // color type RGB
  ihdr.writeUInt8(0, 18);  // compression
  ihdr.writeUInt8(0, 19);  // filter
  ihdr.writeUInt8(0, 20);  // interlace
  const ihdrCrc = crc32(ihdr.slice(4));
  ihdr.writeUInt32BE(ihdrCrc >>> 0, 21);

  const raw = Buffer.alloc((width * 3 + 1) * height);
  let off = 0;
  for (let y = 0; y < height; y++) {
    raw[off++] = 0; // filter byte
    for (let x = 0; x < width; x++) {
      raw[off++] = r;
      raw[off++] = g;
      raw[off++] = b;
    }
  }
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(raw, { level: 9 });
  const idatLen = 4 + 4 + compressed.length + 4; // length + type + data + crc
  const idat = Buffer.alloc(idatLen);
  idat.writeUInt32BE(compressed.length, 0);
  idat.write('IDAT', 4);
  compressed.copy(idat, 8);
  idat.writeUInt32BE(crc32(idat.slice(4, 8 + compressed.length)) >>> 0, 8 + compressed.length);

  const iend = Buffer.alloc(12);
  iend.writeUInt32BE(0, 0);
  iend.write('IEND', 4);
  iend.writeUInt32BE(crc32(iend.slice(4)) >>> 0, 8);

  return Buffer.concat([signature, ihdr, idat, iend]);
}

// Simple CRC32
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  crcTable[n] = c;
}
function crc32(buf) {
  let c = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ (-1)) >>> 0;
}

if (!fs.existsSync(PUBLIC_DIR)) {
  console.error('public/ not found');
  process.exit(1);
}

// Dark background #0a0a0a
const png192 = createPNG(192, 192, 10, 10, 10);
const png512 = createPNG(512, 512, 10, 10, 10);

fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-192x192.png'), png192);
fs.writeFileSync(path.join(PUBLIC_DIR, 'icon-512x512.png'), png512);

console.log('Generated icon-192x192.png (192x192) and icon-512x512.png (512x512) in public/');
console.log('Replace with your real app icons when ready.');
