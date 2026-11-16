#!/usr/bin/env node
/**
 * build.js — menyandikan semua kode JS (file .js dan <script> inline di HTML)
 * jadi blob acak (XOR + base64) yang dibongkar saat halaman dibuka.
 * Setiap kali dijalankan, kunci dan nama variabel dibuat ulang secara acak,
 * jadi hasilnya selalu berbeda walau kode sumbernya sama.
 *
 * Tidak butuh paket npm apa pun — cukup `node build.js`.
 * Cloudflare Pages: Build command = node build.js, Output directory = dist
 */
"use strict";
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = __dirname;
const OUT = path.join(ROOT, "dist");
// Apa pun di sini TIDAK ikut dibangun ke dist (file proyek, bukan file situs)
const SKIP = new Set(["build.js", "package.json", "package-lock.json", "README.md", ".gitignore", "dist", "node_modules", ".git", ".github", ".wrangler"]);

const ALPHA = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
function randId(len) {
  let s = "_";
  for (let i = 0; i < len; i++) s += ALPHA[crypto.randomInt(ALPHA.length)];
  return s;
}

// Node (>=18) sudah punya atob/escape/decodeURIComponent global yang sama
// dengan browser, jadi self-test ini menjalankan persis algoritme yang akan
// jalan di browser, untuk memastikan hasil sandi benar-benar bisa dibongkar.
function browserLikeDecode(b64, hex) {
  const kb = [];
  for (let i = 0; i < hex.length; i += 2) kb.push(parseInt(hex.substr(i, 2), 16));
  const raw = atob(b64);
  let out = "";
  for (let i = 0; i < raw.length; i++) out += String.fromCharCode(raw.charCodeAt(i) ^ kb[i % kb.length]);
  return decodeURIComponent(escape(out));
}

// Membungkus satu blok kode JS menjadi loader acak (XOR + base64).
// Tidak menyentuh atau mengurai isi kode sama sekali (aman untuk template
// literal, komentar, karakter apa pun) — hanya dikodekan sebagai data.
function scramble(code, label) {
  const key = crypto.randomBytes(12);
  const data = Buffer.from(code, "utf8");
  const enc = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i++) enc[i] = data[i] ^ key[i % key.length];
  const b64 = enc.toString("base64");
  const hex = key.toString("hex");

  // uji balik sebelum dipakai, batalkan build kalau ada yang salah
  const back = browserLikeDecode(b64, hex);
  if (back !== code) throw new Error(`Gagal menyandikan ${label}: hasil uji balik tidak cocok`);

  const vKey = randId(6), vData = randId(6), vFn = randId(6);
  const vRaw = randId(5), vOut = randId(5), vI = randId(3), vKb = randId(4);
  return (
    `(function(){var ${vKey}="${hex}",${vData}="${b64}";` +
    `function ${vFn}(s,k){var ${vKb}=[];for(var ${vI}=0;${vI}<k.length;${vI}+=2)${vKb}.push(parseInt(k.substr(${vI},2),16));` +
    `var ${vRaw}=atob(s),${vOut}="";for(var ${vI}=0;${vI}<${vRaw}.length;${vI}++)${vOut}+=String.fromCharCode(${vRaw}.charCodeAt(${vI})^${vKb}[${vI}%${vKb}.length]);` +
    `return decodeURIComponent(escape(${vOut}))}` +
    `(0,eval)(${vFn}(${vData},${vKey}))})();`
  );
}

function processHtml(html, file) {
  let n = 0;
  const out = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
    if (/\bsrc=/i.test(attrs)) return m; // <script src="..."> dibiarkan, file-nya disandikan terpisah
    if (!body.trim()) return m; // tag kosong, lewati
    n++;
    return `<script${attrs}>${scramble(body, `${file} inline#${n}`)}</script>`;
  });
  return { out, n };
}

function walk(dir, rel = "") {
  for (const name of fs.readdirSync(dir)) {
    if (rel === "" && SKIP.has(name)) continue;
    const abs = path.join(dir, name);
    const r = rel ? rel + "/" + name : name;
    const st = fs.statSync(abs);
    if (st.isDirectory()) {
      fs.mkdirSync(path.join(OUT, r), { recursive: true });
      walk(abs, r);
      continue;
    }
    const destDir = path.dirname(path.join(OUT, r));
    fs.mkdirSync(destDir, { recursive: true });
    const dest = path.join(OUT, r);

    if (name.endsWith(".js")) {
      const code = fs.readFileSync(abs, "utf8");
      fs.writeFileSync(dest, scramble(code, r));
      console.log(`  JS disandikan   : ${r}`);
    } else if (name.endsWith(".html")) {
      const html = fs.readFileSync(abs, "utf8");
      const { out, n } = processHtml(html, r);
      fs.writeFileSync(dest, out);
      console.log(`  HTML diproses   : ${r} (${n} blok <script> disandikan)`);
    } else {
      fs.copyFileSync(abs, dest);
      console.log(`  disalin apa adanya: ${r}`);
    }
  }
}

console.log("Membangun ke ./dist …");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
walk(ROOT);
console.log("Selesai. Arahkan Cloudflare Pages ke folder dist/.");
