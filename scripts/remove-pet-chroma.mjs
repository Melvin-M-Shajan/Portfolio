import sharp from "sharp";

const [input, output] = process.argv.slice(2);

if (!input || !output) {
  throw new Error("Usage: node scripts/remove-pet-chroma.mjs <input> <output>");
}

const key = [248, 4, 240];
const { data, info } = await sharp(input)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const result = Buffer.alloc(info.width * info.height * 4);

const smoothstep = (value) => {
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
};

for (let source = 0, target = 0; source < data.length; source += 3, target += 4) {
  const y = Math.floor(source / 3 / info.width);
  const red = data[source];
  const green = data[source + 1];
  const blue = data[source + 2];
  const magentaScore =
    Math.min(red, blue) - green - Math.abs(red - blue) * 0.35;
  const alpha =
    y < 96 || y > info.height - 72
      ? 0
      : 1 - smoothstep((magentaScore - 22) / 112);

  if (alpha <= 0.001) {
    result[target] = 0;
    result[target + 1] = 0;
    result[target + 2] = 0;
    result[target + 3] = 0;
    continue;
  }

  const removeKey = (channel, keyChannel) =>
    Math.max(0, Math.min(255, Math.round((channel - keyChannel * (1 - alpha)) / alpha)));

  result[target] = removeKey(red, key[0]);
  result[target + 1] = removeKey(green, key[1]);
  result[target + 2] = removeKey(blue, key[2]);
  result[target + 3] = Math.round(alpha * 255);
}

await sharp(result, {
  raw: {
    width: info.width,
    height: info.height,
    channels: 4,
  },
})
  .png({ compressionLevel: 9, palette: false })
  .toFile(output);
