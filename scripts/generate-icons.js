import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Ensure public directory exists
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const header = Buffer.alloc(4);
  header.writeUInt32BE(len, 0);
  
  const crcData = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcData);
  const footer = Buffer.alloc(4);
  footer.writeUInt32BE(crcVal, 0);

  return Buffer.concat([header, crcData, footer]);
}

function generatePNG(width, height, isMaskable = false) {
  const bytesPerPixel = 4; // RGBA
  const scanlineLength = 1 + width * bytesPerPixel;
  const rawData = Buffer.alloc(height * scanlineLength);

  const cx = width / 2;
  const cy = height / 2;
  const maxRadius = width / 2;
  // For maskable, safe zone is inner 80% (radius ~ 40% of width)
  const safeRadius = isMaskable ? maxRadius * 0.72 : maxRadius * 0.85;

  let offset = 0;
  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background color: #1976D2 (RGB: 25, 118, 210)
      let r = 25;
      let g = 118;
      let b = 210;
      let a = 255;

      if (!isMaskable) {
        // Rounded squircle badge for standard icon
        const cornerRadius = width * 0.22;
        const qx = Math.max(Math.abs(x - cx) - (cx - cornerRadius), 0);
        const qy = Math.max(Math.abs(y - cy) - (cy - cornerRadius), 0);
        const cornerDist = Math.sqrt(qx * qx + qy * qy);
        if (cornerDist > cornerRadius) {
          a = 0; // Transparent outside rounded squircle
        }
      }

      if (a > 0) {
        // Gentle gradient: top lighter #2196F3, bottom deeper #1565C0
        const gradT = y / height;
        r = Math.round(33 * (1 - gradT) + 21 * gradT);
        g = Math.round(150 * (1 - gradT) + 101 * gradT);
        b = Math.round(243 * (1 - gradT) + 192 * gradT);

        // Draw a central golden glowing star / graduation badge inside safeRadius
        // 5-pointed star formula
        const starRadiusOuter = safeRadius * 0.75;
        const starRadiusInner = starRadiusOuter * 0.42;
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        const normAngle = (angle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const segment = (Math.PI * 2) / 10;
        const segIndex = Math.floor(normAngle / segment);
        const segFrac = (normAngle - segIndex * segment) / segment;

        let rAtAngle;
        if (segIndex % 2 === 0) {
          rAtAngle = starRadiusOuter * (1 - segFrac) + starRadiusInner * segFrac;
        } else {
          rAtAngle = starRadiusInner * (1 - segFrac) + starRadiusOuter * segFrac;
        }

        // Check if inside star
        if (dist <= rAtAngle) {
          // Vibrant gold/yellow star: #FFD54F to #FFB300
          const starGrad = (dy + starRadiusOuter) / (starRadiusOuter * 2);
          r = Math.round(255 * (1 - starGrad) + 255 * starGrad);
          g = Math.round(224 * (1 - starGrad) + 179 * starGrad);
          b = Math.round(79 * (1 - starGrad) + 0 * starGrad);

          // Subtle star edge highlight
          if (dist > rAtAngle - (width * 0.03)) {
            r = 255; g = 255; b = 255;
          }
        } else if (dist <= rAtAngle + (width * 0.05)) {
          // Soft golden aura around star
          const auraRatio = 1 - (dist - rAtAngle) / (width * 0.05);
          r = Math.round(r * (1 - auraRatio) + 255 * auraRatio);
          g = Math.round(g * (1 - auraRatio) + 215 * auraRatio);
          b = Math.round(b * (1 - auraRatio) + 64 * auraRatio);
        }

        // Draw cute smiley eye dots inside star
        const eyeOffset = starRadiusOuter * 0.22;
        const eyeY = cy - starRadiusOuter * 0.05;
        const leftEyeDist = Math.hypot(x - (cx - eyeOffset), y - eyeY);
        const rightEyeDist = Math.hypot(x - (cx + eyeOffset), y - eyeY);
        const eyeRadius = width * 0.032;

        if (leftEyeDist <= eyeRadius || rightEyeDist <= eyeRadius) {
          r = 30; g = 41; b = 59; // Slate dark eyes
        }

        // Draw cute happy smile arc
        const smileY = cy + starRadiusOuter * 0.12;
        const smileDist = Math.hypot(x - cx, y - smileY);
        const smileRadius = starRadiusOuter * 0.22;
        if (y > smileY && Math.abs(smileDist - smileRadius) <= (width * 0.016) && Math.abs(dx) < smileRadius * 0.85) {
          r = 30; g = 41; b = 59; // Dark smile
        }
      }

      rawData[offset++] = r;
      rawData[offset++] = g;
      rawData[offset++] = b;
      rawData[offset++] = a;
    }
  }

  // Compress IDAT
  const compressedData = zlib.deflateSync(rawData, { level: 9 });

  // PNG Header
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressedData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// Generate all required PNG sizes
const icon192 = generatePNG(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-192x192.png'), icon192);

const icon512 = generatePNG(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);
fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), icon512);

const iconMaskable = generatePNG(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);
fs.writeFileSync(path.join(publicDir, 'maskable-icon-512x512.png'), iconMaskable);

const appleIcon = generatePNG(180, 180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleIcon);

console.log('Successfully generated all PWA PNG icons!');
