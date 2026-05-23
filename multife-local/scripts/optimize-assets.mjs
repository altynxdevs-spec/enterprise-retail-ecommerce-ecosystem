import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const folders = [
  path.join(root, "public", "assets"),
  path.join(root, "src", "assets"),
];

const backupRoot = path.join(root, "image-backup-originals");
const allowed = new Set([".png", ".jpg", ".jpeg", ".webp"]);

const MAX_WIDTH = 900;
const MAX_HEIGHT = 900;

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir) {
  if (!(await exists(dir))) return [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (full.includes("image-backup-originals")) continue;

    if (entry.isDirectory()) {
      files.push(...await walk(full));
    } else if (allowed.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }

  return files;
}

async function backup(file) {
  const relative = path.relative(root, file);
  const backupPath = path.join(backupRoot, relative);

  if (await exists(backupPath)) return;

  await fs.mkdir(path.dirname(backupPath), { recursive: true });
  await fs.copyFile(file, backupPath);
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  const before = (await fs.stat(file)).size;

  await backup(file);

  const temp = `${file}.tmp`;

  const pipeline = sharp(file)
    .rotate()
    .resize({
      width: MAX_WIDTH,
      height: MAX_HEIGHT,
      fit: "inside",
      withoutEnlargement: true,
    });

  if (ext === ".png") {
    await pipeline.png({ compressionLevel: 9, quality: 72, palette: true }).toFile(temp);
  } else if (ext === ".webp") {
    await pipeline.webp({ quality: 72, effort: 5 }).toFile(temp);
  } else {
    await pipeline.jpeg({ quality: 72, mozjpeg: true }).toFile(temp);
  }

  const after = (await fs.stat(temp)).size;

  if (after < before) {
    await fs.rename(temp, file);
    const saved = (((before - after) / before) * 100).toFixed(1);
    console.log(`Optimized: ${path.relative(root, file)} — ${saved}% smaller`);
  } else {
    await fs.unlink(temp);
    console.log(`Skipped: ${path.relative(root, file)} — already optimized`);
  }
}

const allFiles = [];

for (const folder of folders) {
  allFiles.push(...await walk(folder));
}

console.log(`Found ${allFiles.length} images.`);

for (const file of allFiles) {
  try {
    await optimize(file);
  } catch (err) {
    console.log(`Failed: ${path.relative(root, file)} — ${err.message}`);
  }
}

console.log("Done. Originals backed up in image-backup-originals folder.");
