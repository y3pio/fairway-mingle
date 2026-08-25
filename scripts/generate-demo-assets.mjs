import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const profileDirectory = path.join(root, "public/demo/profiles");
const courseDirectory = path.join(root, "public/demo/courses");
await mkdir(profileDirectory, { recursive: true });
await mkdir(courseDirectory, { recursive: true });

const profiles = [
  ["alex-demo", "A", "#173f2a", "#d7aa74"],
  ["jordan-demo", "J", "#345b55", "#cb8f6b"],
  ["erin-demo", "E", "#854f3f", "#e4b88c"],
  ["maya-demo", "M", "#7a3e54", "#d99a74"],
  ["morgan-demo", "M", "#354d7a", "#9d6d50"],
  ["casey-demo", "C", "#644b72", "#e0aa82"],
  ["riley-demo", "R", "#397060", "#8d5b3e"],
  ["cameron-demo", "C", "#485d30", "#c88a61"],
  ["avery-demo", "A", "#8a6237", "#edc19d"],
  ["jamie-demo", "J", "#526a82", "#b87855"],
  ["drew-demo", "D", "#6d493a", "#d6a278"],
  ["sofia-demo", "S", "#7d3e45", "#c9825f"],
  ["taylor-demo", "T", "#3c6272", "#dda27d"],
];

for (const [id, initial, background, skin] of profiles) {
  for (let index = 1; index <= 3; index += 1) {
    const shift = index * 11;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 960" role="img" aria-label="Stylized fictional demo portrait">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="${background}"/><stop offset="1" stop-color="#d7caa9"/>
    </linearGradient>
    <linearGradient id="shirt" x1="0" y1="0" x2="0" y2="1">
      <stop stop-color="#f6f1e5"/><stop offset="1" stop-color="#bfcdbd"/>
    </linearGradient>
  </defs>
  <rect width="720" height="960" fill="url(#sky)"/>
  <circle cx="${120 + shift}" cy="${180 - shift}" r="90" fill="#efd88a" opacity=".58"/>
  <path d="M0 700 Q180 580 360 700 T720 680 V960 H0Z" fill="#3c754e" opacity=".82"/>
  <path d="M70 780 Q230 650 360 760 Q510 640 690 790 V960 H70Z" fill="#24563a"/>
  <ellipse cx="360" cy="920" rx="220" ry="230" fill="url(#shirt)"/>
  <rect x="303" y="545" width="114" height="140" rx="48" fill="${skin}"/>
  <ellipse cx="360" cy="420" rx="168" ry="205" fill="${skin}"/>
  <path d="M195 408 Q205 180 365 184 Q528 190 530 420 Q466 300 355 315 Q250 326 195 408Z" fill="#29241f"/>
  <circle cx="302" cy="432" r="12" fill="#27231f"/><circle cx="418" cy="432" r="12" fill="#27231f"/>
  <path d="M315 510 Q360 542 405 510" fill="none" stroke="#7e493e" stroke-width="10" stroke-linecap="round"/>
  <circle cx="626" cy="118" r="45" fill="#f7f5ef" opacity=".9"/>
  <text x="626" y="134" text-anchor="middle" font-family="system-ui" font-size="48" font-weight="700" fill="${background}">${initial}</text>
</svg>`;
    await writeFile(path.join(profileDirectory, `${id}-${index}.svg`), svg);
  }
}

const courses = [
  ["pine-ridge", "#24563a", "#b9d5a4"],
  ["river-bend", "#226b68", "#c9ba82"],
  ["oak-hollow", "#4f6b35", "#d7c795"],
  ["lakeside-links", "#2d6682", "#a9c98f"],
  ["the-turn-simulator", "#31455f", "#d0a958"],
  ["meadowview-range", "#47743d", "#b8d59c"],
];

for (const [id, dark, light] of courses) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 720" role="img" aria-label="Stylized fictional golf venue">
  <defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#f0c986"/><stop offset=".65" stop-color="#d8e7d1"/></linearGradient></defs>
  <rect width="1200" height="720" fill="url(#sky)"/>
  <circle cx="980" cy="130" r="76" fill="#fff4c6"/>
  <path d="M0 390 Q220 260 430 400 T840 360 T1200 380 V720 H0Z" fill="${light}"/>
  <path d="M0 500 Q300 350 560 510 T1200 470 V720 H0Z" fill="${dark}"/>
  <path d="M530 720 Q570 540 730 455 Q780 420 835 385" fill="none" stroke="#e8d9ad" stroke-width="86" opacity=".9"/>
  <path d="M830 390 V235" stroke="#f7f5ef" stroke-width="9"/><path d="M836 240 L945 272 L836 300Z" fill="#d3a64b"/>
  <ellipse cx="830" cy="392" rx="58" ry="18" fill="#173f2a" opacity=".45"/>
</svg>`;
  await writeFile(path.join(courseDirectory, `${id}.svg`), svg);
}

console.log(`Generated ${profiles.length * 3} portraits and ${courses.length} course images.`);
