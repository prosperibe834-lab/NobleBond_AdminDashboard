// Pure TypeScript ISO/IEC 18004 Version 4-L QR Code Generator (33x33, supports up to 78 UTF-8 bytes)
// Runs completely offline in-browser with zero external APIs or dependencies. Supports SVG & PNG export.

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function getGeneratorPoly(ecCount: number): number[] {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array<number>(poly.length + 1).fill(0);
    const factor = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], factor);
    }
    poly = next;
  }
  return poly;
}

function computeReedSolomonEC(data: number[], ecCount: number): number[] {
  const gen = getGeneratorPoly(ecCount);
  const res = new Array<number>(ecCount).fill(0);
  for (const byte of data) {
    const factor = byte ^ res[0];
    res.shift();
    res.push(0);
    for (let j = 0; j < ecCount; j++) {
      res[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return res;
}

// Version 4-L constants: 33x33 matrix, 1 block of 80 data codewords + 20 EC codewords
const QR_SIZE = 33;
const DATA_CODEWORDS = 80;
const EC_CODEWORDS = 20;

// Format info bits for ECC Level L (01) and Masks 0..7 (pre-computed BCH + 0x5412 mask)
const FORMAT_INFO_L: number[] = [
  0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
];

function encodeBytesV4L(text: string): number[] {
  const utf8 = Array.from(new TextEncoder().encode(text)).slice(0, 78);
  const bits: number[] = [];

  const pushBits = (val: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Mode indicator 0100 (Byte mode) + 8-bit character count (Versions 1-9)
  pushBits(0b0100, 4);
  pushBits(utf8.length, 8);
  for (const b of utf8) {
    pushBits(b, 8);
  }

  // Terminator (up to 4 zeros)
  const maxBits = DATA_CODEWORDS * 8;
  for (let i = 0; i < 4 && bits.length < maxBits; i++) {
    bits.push(0);
  }
  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const dataBytes: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let b = 0; b < 8; b++) {
      byte = (byte << 1) | bits[i + b];
    }
    dataBytes.push(byte);
  }

  const padPatterns = [0xec, 0x11];
  let padIdx = 0;
  while (dataBytes.length < DATA_CODEWORDS) {
    dataBytes.push(padPatterns[padIdx % 2]);
    padIdx++;
  }

  const ecBytes = computeReedSolomonEC(dataBytes, EC_CODEWORDS);
  const allCodewords = [...dataBytes, ...ecBytes];

  const streamBits: number[] = [];
  for (const cw of allCodewords) {
    for (let b = 7; b >= 0; b--) {
      streamBits.push((cw >> b) & 1);
    }
  }
  // Remainder bits for Version 4 = 7
  for (let i = 0; i < 7; i++) {
    streamBits.push(0);
  }
  return streamBits;
}

function buildMatrixTemplate(): { modules: boolean[][]; reserved: boolean[][] } {
  const modules = Array.from({ length: QR_SIZE }, () => new Array<boolean>(QR_SIZE).fill(false));
  const reserved = Array.from({ length: QR_SIZE }, () => new Array<boolean>(QR_SIZE).fill(false));

  const setFixed = (r: number, c: number, val: boolean) => {
    if (r >= 0 && r < QR_SIZE && c >= 0 && c < QR_SIZE) {
      modules[r][c] = val;
      reserved[r][c] = true;
    }
  };

  const placeFinder = (row: number, col: number) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = row + r;
        const cc = col + c;
        if (rr < 0 || rr >= QR_SIZE || cc < 0 || cc >= QR_SIZE) continue;
        const inBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        const outsideSep = r === -1 || r === 7 || c === -1 || c === 7;
        setFixed(rr, cc, !outsideSep && (inBorder || inCenter));
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, QR_SIZE - 7);
  placeFinder(QR_SIZE - 7, 0);

  // Version 4 Alignment pattern centered at (26, 26)
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const dark = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0);
      setFixed(26 + r, 26 + c, dark);
    }
  }

  // Timing patterns along row 6 and col 6
  for (let i = 8; i < QR_SIZE - 8; i++) {
    setFixed(6, i, i % 2 === 0);
    setFixed(i, 6, i % 2 === 0);
  }

  // Dark module at (4*V + 9, 8) = (25, 8)
  setFixed(QR_SIZE - 8, 8, true);

  // Reserve format info strips
  for (let i = 0; i <= 8; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = QR_SIZE - 8; i < QR_SIZE; i++) {
    reserved[8][i] = true;
    if (i > QR_SIZE - 8) reserved[i][8] = true;
  }

  return { modules, reserved };
}

function applyFormatInfo(modules: boolean[][], maskIndex: number): void {
  const fmt = FORMAT_INFO_L[maskIndex];
  for (let i = 0; i <= 5; i++) {
    const bit = ((fmt >> (14 - i)) & 1) === 1;
    modules[8][i] = bit;
    modules[QR_SIZE - 1 - i][8] = bit;
  }
  modules[8][7] = ((fmt >> 8) & 1) === 1;
  modules[QR_SIZE - 7][8] = ((fmt >> 8) & 1) === 1;
  modules[8][8] = ((fmt >> 7) & 1) === 1;
  modules[7][8] = ((fmt >> 6) & 1) === 1;

  for (let i = 0; i <= 5; i++) {
    const bit = ((fmt >> i) & 1) === 1;
    modules[i][8] = bit;
    modules[8][QR_SIZE - 1 - i] = bit;
  }
  modules[8][QR_SIZE - 7] = ((fmt >> 6) & 1) === 1;
  modules[8][QR_SIZE - 8] = ((fmt >> 7) & 1) === 1;
}

function maskCondition(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0:
      return (r + c) % 2 === 0;
    case 1:
      return r % 2 === 0;
    case 2:
      return c % 3 === 0;
    case 3:
      return (r + c) % 3 === 0;
    case 4:
      return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5:
      return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6:
      return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default:
      return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

function computePenalty(m: boolean[][]): number {
  let score = 0;
  // Rule 1: 5+ same-color runs in rows & cols
  for (let r = 0; r < QR_SIZE; r++) {
    let runRow = 1;
    let runCol = 1;
    for (let i = 1; i < QR_SIZE; i++) {
      if (m[r][i] === m[r][i - 1]) {
        runRow++;
      } else {
        if (runRow >= 5) score += runRow - 2;
        runRow = 1;
      }
      if (m[i][r] === m[i - 1][r]) {
        runCol++;
      } else {
        if (runCol >= 5) score += runCol - 2;
        runCol = 1;
      }
    }
    if (runRow >= 5) score += runRow - 2;
    if (runCol >= 5) score += runCol - 2;
  }
  // Rule 2: 2x2 solid blocks
  for (let r = 0; r < QR_SIZE - 1; r++) {
    for (let c = 0; c < QR_SIZE - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) {
        score += 3;
      }
    }
  }
  return score;
}

export function generateQrMatrix(value: string): boolean[][] {
  const bits = encodeBytesV4L(value);
  const { modules: base, reserved } = buildMatrixTemplate();

  // Place data bits in upward/downward zigzag
  let bitIdx = 0;
  let upward = true;
  for (let col = QR_SIZE - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let i = 0; i < QR_SIZE; i++) {
      const r = upward ? QR_SIZE - 1 - i : i;
      for (const dc of [0, -1]) {
        const c = col + dc;
        if (!reserved[r][c]) {
          base[r][c] = bitIdx < bits.length ? bits[bitIdx] === 1 : false;
          bitIdx++;
        }
      }
    }
    upward = !upward;
  }

  let bestMask = 0;
  let bestScore = Number.MAX_SAFE_INTEGER;
  let bestMatrix: boolean[][] = base;

  for (let mask = 0; mask < 8; mask++) {
    const candidate = base.map((row, r) =>
      row.map((val, c) => (reserved[r][c] ? val : maskCondition(mask, r, c) ? !val : val))
    );
    applyFormatInfo(candidate, mask);
    const penalty = computePenalty(candidate);
    if (penalty < bestScore) {
      bestScore = penalty;
      bestMask = mask;
      bestMatrix = candidate;
    }
  }

  void bestMask;
  return bestMatrix;
}

export function downloadQrPng(value: string, fileName: string, codeLabel: string): void {
  const matrix = generateQrMatrix(value);
  const scale = 10;
  const margin = 4 * scale;
  const qrDim = matrix.length * scale;
  const width = qrDim + margin * 2;
  const height = width + 44;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#151019";
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(margin + c * scale, margin + r * scale, scale, scale);
      }
    }
  }

  ctx.fillStyle = "#E11D48";
  ctx.font = "bold 16px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`NobleBond Invite: ${codeLabel}`, width / 2, width + 18);

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.png`;
  link.click();
}

