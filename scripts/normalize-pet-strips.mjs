import { rename } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const states = ["walk", "idle", "wave", "think", "answer"];
const frameCount = 6;
const cellWidth = 384;
const cellHeight = 736;
const baseline = 620;
const alphaThreshold = 12;

async function findBounds(input, width, height) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      if (data[(y * info.width + x) * 4 + 3] <= alphaThreshold) {
        continue;
      }
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }

  if (maxX < 0 || maxY < 0) {
    throw new Error("A pet frame is empty.");
  }

  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

for (const state of states) {
  const source = path.resolve(`public/images/pet/mini-mel-${state}.png`);
  const temporary = path.resolve(
    `public/images/pet/mini-mel-${state}.normalized.png`,
  );
  const metadata = await sharp(source).metadata();
  const nominalWidth = Math.floor(metadata.width / frameCount);
  const cells = [];

  for (let index = 0; index < frameCount; index += 1) {
    const left = nominalWidth * index;
    const width =
      index === frameCount - 1 ? metadata.width - left : nominalWidth;
    const frame = await sharp(source)
      .extract({ left, top: 0, width, height: metadata.height })
      .png()
      .toBuffer();
    const bounds = await findBounds(frame, width, metadata.height);
    const pose = await sharp(frame)
      .extract(bounds)
      .png()
      .toBuffer();
    const poseLeft = Math.round((cellWidth - bounds.width) / 2);
    const poseTop = baseline - bounds.height + 1;

    cells.push(
      await sharp({
        create: {
          width: cellWidth,
          height: cellHeight,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .composite([{ input: pose, left: poseLeft, top: poseTop }])
        .png()
        .toBuffer(),
    );
  }

  await sharp({
    create: {
      width: cellWidth * frameCount,
      height: cellHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(
      cells.map((input, index) => ({
        input,
        left: index * cellWidth,
        top: 0,
      })),
    )
    .png()
    .toFile(temporary);

  await rename(temporary, source);
  console.log(`Normalized ${state}: ${cellWidth * frameCount}x${cellHeight}`);
}
