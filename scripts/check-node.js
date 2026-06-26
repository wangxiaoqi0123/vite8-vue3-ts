const target = 'v24.18.0';
const current = process.version;
if (current !== target) {
  console.error(`❌ 需要 Node.js ${target}，当前是 ${current}`);
  process.exit(1);
}
console.log(`✅ Node.js 版本检查通过: ${current}`);