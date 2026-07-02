import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const IMG = "https://lh3.googleusercontent.com/aida-public/";

const spec = (rows: [string, string][]) =>
  JSON.stringify(rows.map(([label, value]) => ({ label, value })));

const products = [
  {
    slug: "aeroweave-pro-windbreaker",
    name: "AeroWeave Pro Windbreaker",
    description:
      "An ultra-light aerodynamic shell engineered for elite runners. The AeroWeave Pro cuts through headwinds with a laser-bonded seam construction and a laminated ripstop face that sheds drizzle without trapping heat.",
    specs: spec([
      ["Fabric", "78g/m² AeroWeave ripstop nylon"],
      ["Weight", "96 g (size M)"],
      ["Water resistance", "DWR C0, 800mm hydrostatic head"],
      ["Packability", "Packs into own chest pocket"],
      ["Reflectivity", "360° neon retro-reflective piping"],
    ]),
    priceCents: 14500,
    category: "Jackets",
    sport: "Running",
    gender: "Men",
    sizes: "S,M,L,XL,XXL",
    colors: "Void Black,Neon Green",
    imageUrl: `${IMG}AB6AXuAJ7NFXczTlslDO8UOsUR5EsXIrvgSDRLwvhUPhXx9fy3qTdrEiZC43ub-4Cd5hz7zaZnZiy3_eFlYXo-p1-OZTF5hVpp69wVbjZX6O0_MTM3a0th2wGMTXC07oMjyJcz_duPRVz_xQTUxgGNtlpjVXAsYUkRFuG_sYCNZ2ybUOUr_vhmooI6ICCpbn7QWc7kBeE14vAXl3aQ1wwry1m2BwdjWXvvGgw8e0VV72zz9fSxeCMcOPVi2YHaEUcy3GChEouRE48M7QtDyo`,
    badge: "New",
    stock: 42,
    rating: 4.5,
    reviewCount: 128,
  },
  {
    slug: "velocity-chrono-x2",
    name: "Velocity Chrono X2",
    description:
      "A carbon-cased GPS training computer with dual-band positioning, wrist ECG, and a 21-day battery. The Chrono X2 streams live power, pace, and recovery metrics to its always-on transflective display.",
    specs: spec([
      ["Case", "Forged carbon composite, 46mm"],
      ["GPS", "Dual-band GNSS (L1+L5)"],
      ["Battery", "21 days smartwatch / 48h GPS"],
      ["Sensors", "ECG, SpO2, barometric altimeter"],
      ["Water rating", "10 ATM"],
    ]),
    priceCents: 39900,
    category: "Accessories",
    sport: "Training",
    gender: "Unisex",
    sizes: "One Size",
    colors: "Matte Carbon",
    imageUrl: `${IMG}AB6AXuBjAtAl3k2uTD6jVKYzMBtuZQSkdO0qIRHHK2kSGNPH4qcOG3Hy6IYV9Q5fCYTRrnZkXJewGXUqAgVipgrc7RsHZ0FoI8D8YytDm-YSVOBb1b1FBFMM9cJVusYaXbg_e3GbDEWTq7KvOwe_sAGVY43-U2SQ8ivimuM23-2hkkbXIJUosVdBRrrnBmY9hroseFCvsUWnp6OG23IEuLuk0Ixbe5dgfAkZuyHaSyAxOE6B6zLjcOmHQ8nrgyQBRUSH2WYYEO1sotDND-_o`,
    badge: null,
    stock: 18,
    rating: 5.0,
    reviewCount: 84,
  },
  {
    slug: "kinetic-compression-tights",
    name: "Kinetic Compression Tights",
    description:
      "Graduated 20-30 mmHg compression mapped to the kinetic chain. Intersecting power bands stabilize the quads and calves while a bonded waistband locks everything in place at sprint cadence.",
    specs: spec([
      ["Compression", "Graduated 20–30 mmHg"],
      ["Fabric", "72% nylon / 28% elastane power knit"],
      ["Waistband", "Laser-bonded, drawcord-free"],
      ["Storage", "Two bonded thigh pockets"],
      ["Care", "Machine wash cold, hang dry"],
    ]),
    priceCents: 11000,
    category: "Tights",
    sport: "Training",
    gender: "Women",
    sizes: "XS,S,M,L,XL",
    colors: "Charcoal Kinetic",
    imageUrl: `${IMG}AB6AXuAmGgacu2mG64QnYC6aBV-Mrp_fzxCAUQ-8g-hiFKjZTg-Z7evlpRX8XUlyKRZwec5Qih8uagj37VDARMBFsQsE3mjGPjYb1hJCI_OIUsPaoORjzSSmbCJGP_5Q2807sVL84Sti6xeGfEy4bt11TYQ2MLZwR7o8itD1GIdz2RzD7yfkcLdopDLaiR-6Askj6fp-V_lBbuGUOawsFst0waE4UHvYYxfTgQ7ZDbngbHytZwGuPYud-Tb0soKVjNjOevoJKpO73IM6BK5O`,
    badge: "Best Seller",
    stock: 87,
    rating: 4.0,
    reviewCount: 312,
  },
  {
    slug: "apex-ultra-hydration-vest",
    name: "Apex Ultra Hydration Vest",
    description:
      "A 5L race vest built for ultra distances. Twin 500ml soft flasks ride high on the chest, while the tactical-cut back panel carries mandatory kit without bounce, even on technical descents.",
    specs: spec([
      ["Capacity", "5L + 2×500ml soft flasks"],
      ["Weight", "168 g (empty)"],
      ["Fit", "4-point sternum adjustment"],
      ["Fabric", "Perforated stretch airmesh"],
      ["Visibility", "Reflective 'AV' logos front/rear"],
    ]),
    priceCents: 13500,
    category: "Accessories",
    sport: "Running",
    gender: "Unisex",
    sizes: "S/M,L/XL",
    colors: "Stealth Black",
    imageUrl: `${IMG}AB6AXuAJXFM8wGcFbBpOD9TxD-cMCIRC_ec2G16UXSxMiJVha0Hf8gn4TTSnOtzLVdsPOEfR_fYe3DrWKpL7biro9V5UCfTUlY6VKcpJlgvRATUAbaN3T-mz1AzXYTOlOLHM-3LpxAJpdavRonri4Dty8jeZkjbIJ_8nlROBjelUDTBfLZBM4jTKbHYx2AxEzCqxXx8LgdpkGcWRAExRrREuMzPY2hu-lgZde47rCpwEAyIUtv6TZ0T5IhJaf3JnyfGpBH1fTRTKIXfYN454`,
    badge: null,
    stock: 31,
    rating: 4.8,
    reviewCount: 56,
  },
  {
    slug: "aeroshift-pro-jacket",
    name: "AeroShift Pro Jacket",
    description:
      "The flagship night-runner shell. AeroShift's electro-welded panels adapt ventilation on the fly, and the full spectrum of neon green accents keeps you visible when the city goes dark.",
    specs: spec([
      ["Fabric", "3-layer AeroShift membrane"],
      ["Breathability", "RET < 6"],
      ["Ventilation", "Laser-cut underarm exhaust"],
      ["Hood", "Helmet-compatible, wired brim"],
      ["Seams", "100% electro-welded"],
    ]),
    priceCents: 18900,
    compareAtCents: 22500,
    category: "Jackets",
    sport: "Running",
    gender: "Men",
    sizes: "S,M,L,XL",
    colors: "Void Black/Neon",
    imageUrl: `${IMG}AB6AXuAVFyenodRpDgzrj9ueradK5ekoFj6JWB9J6805kaXI8JzyhGde5Kd7MtJH0au2xOPd_OOwT9fDmaF2qVPE02zxLHo0105MyT7M6UthKG3yOksHRnyx-2Zuow_HniaiZP_u5zbsvw6uXuQxHjw9ZZwqhFgjJ5b0VFLiZyS__L73RifuHV7kfYHj8v1tB6nQJMTVeyHqDq7L09DNRwbbv-WdYdVj_DubYSHTu52G7kWaio-YF6JISmrBHM0GoEdIRsJNlbji6U4na6M_`,
    badge: "Sale",
    stock: 24,
    rating: 4.7,
    reviewCount: 93,
  },
  {
    slug: "velocity-comp-tights",
    name: "Velocity Comp Tights",
    description:
      "Race-day compression tights with an aggressive kinetic print. A silicone-gripped hem and flatlock seams disappear at threshold pace so nothing pulls focus from the splits.",
    specs: spec([
      ["Compression", "Targeted 15–20 mmHg"],
      ["Fabric", "68% recycled nylon / 32% Lycra"],
      ["Seams", "Flatlock, chafe-free"],
      ["Hem", "Silicone micro-grip"],
      ["Pockets", "Rear zip valuables pocket"],
    ]),
    priceCents: 9500,
    category: "Tights",
    sport: "Running",
    gender: "Men",
    sizes: "S,M,L,XL,XXL",
    colors: "Graphite",
    imageUrl: `${IMG}AB6AXuA5HROFFFLqrf-rhIo1ram1Bcoffn_DzWzDLL9cioPTM8Mt4S772FK0upx0bE5rBJ4urfJkVah1lHOj2Ylv7JEozL7UlOfRwPJR2eoYh9LC02gwZajF_fUHnqbm1bW3CfcTsMmotaDGof2YiubOh1XBwM7SZDD2K_s7cKpkITkQ6GnFqHL0cYXNo9hzr_cRvBUPnvfkKHB0GCcPRrQ7VCB7cBFWtZbRtwlaSrFMw3AOKnuQyTfbg88M13iYd57EydyoXtUVowA5EdEn`,
    badge: null,
    stock: 64,
    rating: 4.3,
    reviewCount: 147,
  },
  {
    slug: "apex-strider-shorts",
    name: "Apex Strider Shorts",
    description:
      "A 5-inch training short with a built-in liner and four-way stretch woven shell. Engineered split hems free up full stride extension for track intervals and box jumps alike.",
    specs: spec([
      ["Inseam", '5" with split hem'],
      ["Shell", "4-way stretch microweave"],
      ["Liner", "Perforated support brief"],
      ["Storage", "Zip back pocket + liner stash"],
      ["Drawcord", "Internal, flat-tension"],
    ]),
    priceCents: 7500,
    category: "Shorts",
    sport: "Training",
    gender: "Men",
    sizes: "S,M,L,XL",
    colors: "Void Black",
    imageUrl: `${IMG}AB6AXuDv9gGS7ldoWfTmOftCXzbbDVeY4Efjx6mnfy0A6zWHIJY7YoKdNwi94oGsorgWBe78Z4LRYyYkKMZHUJ_7k2fXlp-dSoSGVvyA9FYV3uSFkiZG40PR8fushtvLeupwiXaM6WUaAI43hJZq1P2qFabZ20VNMFtbP-unmcaAahfQHgDBW1OBDejBixKQM8KgdfXdRWvFAJcmlUVQVO3jpgtvEpqugoK3m0-HIo2Yr6NheMpMsz2XmI0pC3P4230p40cIsj8oI8QJbe3a`,
    badge: null,
    stock: 96,
    rating: 4.6,
    reviewCount: 201,
  },
  {
    slug: "stormshield-shell",
    name: "StormShield Shell",
    description:
      "Fully seam-taped 20K/20K waterproof protection for training in whatever the forecast throws down. The StormShield's articulated sleeves and storm hood stay planted in 60 km/h gusts.",
    specs: spec([
      ["Waterproofing", "20,000mm / 20,000 g/m²/24h"],
      ["Seams", "Fully taped"],
      ["Hood", "3-point storm adjustment"],
      ["Zips", "AquaGuard YKK throughout"],
      ["Weight", "312 g (size M)"],
    ]),
    priceCents: 21000,
    category: "Jackets",
    sport: "Outdoor",
    gender: "Unisex",
    sizes: "XS,S,M,L,XL,XXL",
    colors: "Void Black",
    imageUrl: `${IMG}AB6AXuAxpctzV607oggScQSDcHJZLmN23IXBXkgtHZqC3O8kz0xTQrQKB7pQWSWj09jxCdTKkR59dq3Vsn6kyi-DcEvyu2B8MzNHpt1UJJZ68IYwHu2lfPgcl4z0YDye93kzB7LfPyvHiX2xW5LU6A4ZwyL8sY4Zl9RyqeYJgrR5S4d-DsFhQ97vX9lnVAnNa8qZzHF9aGNGxRn0n9R5nV42MENWkKsWsNdUdVg7UOAVKMgNATR77fyxV9IB71-2afcHNFMrvbev5Ts3aJh0`,
    badge: null,
    stock: 27,
    rating: 4.9,
    reviewCount: 68,
  },
  {
    slug: "aerocarbon-pro-stride",
    name: "AeroCarbon Pro Stride",
    description:
      "A full-length carbon plate sandwiched in supercritical foam returns 89% of every footstrike. The AeroCarbon Pro Stride is our fastest race shoe ever — legal, but only just.",
    specs: spec([
      ["Plate", "Full-length forged carbon"],
      ["Midsole", "Supercritical PEBA, 39mm stack"],
      ["Drop", "8mm"],
      ["Weight", "196 g (US 9)"],
      ["Outsole", "High-abrasion kinetic tread"],
    ]),
    priceCents: 26000,
    category: "Footwear",
    sport: "Running",
    gender: "Unisex",
    sizes: "US 7,US 8,US 9,US 10,US 11,US 12",
    colors: "Black/Neon Sole",
    imageUrl: `${IMG}AB6AXuAwdOJ3GOMgUdm8n07ScigzcnIGlhaOXrfJQtNQn7GF2Ck7f-spe0wPv_KKjExsbdU0wMctJ_J6hhRf2AiRCV56srSxREvhna3tuaisS3pdBfXDEujvztVAMjAa1xa0fQWyVpjJ5nsAtzgfX4ZuGlPyH-0Xi7a-xoYPTSfY3dxW8XUQ5GdNU16szUKr7vmzsCoOAMxNAkbzfybsiSKs1pf_jnNO-lHtyzUCM368Ll02W_BX8kqD3V9XxPG2qoSIEzk9gbR0MbLNZmEa`,
    badge: "New",
    stock: 15,
    rating: 4.9,
    reviewCount: 342,
  },
  {
    slug: "velocity-shell-jacket",
    name: "Velocity Shell Jacket",
    description:
      "An aero-cut cycling shell with a dropped tail and race-radio back pocket. Wind-cheating fabric up front, high-stretch exhaust mesh behind — built for breakaways in shifting weather.",
    specs: spec([
      ["Cut", "Race fit, dropped tail"],
      ["Front panel", "Windproof laminate"],
      ["Back panel", "High-stretch exhaust mesh"],
      ["Pockets", "3 rear + zip valuables"],
      ["Packability", "Jersey-pocket packable"],
    ]),
    priceCents: 17500,
    category: "Jackets",
    sport: "Cycling",
    gender: "Women",
    sizes: "XS,S,M,L",
    colors: "Void Black/Neon",
    imageUrl: `${IMG}AB6AXuC2YSS4DtAiUe52jiTrJAJXlxJbJsfK0B5XErH9b5U8_TgD3sBIYypweNjrwgrJjA10PO4hTHrlKTyYe9pM9FMX32klmCAJmrE08PGQ236KodNLp-zGvH6WjAHZ5DL5_rr-5cabw3cPKb0XLQZktRD0A1YaAn47uCxFEnXuCVZqOmrBgY51-rcdgZRFw_Ik-o_YsOBbLffwgDmJYZ-n9jURd57jN-bqjBLcdGkJ8i1V4AXvblXRHq0y5LBYHFUbKLm560wEZlyaQl1J`,
    badge: null,
    stock: 22,
    rating: 4.4,
    reviewCount: 51,
  },
  {
    slug: "circuit-tech-tee",
    name: "Circuit Tech Tee",
    description:
      "A featherweight training tee in moisture-wicking micro-jacquard. Body-mapped ventilation zones dump heat exactly where you generate it, set off by a single neon circuit trace.",
    specs: spec([
      ["Fabric", "115g/m² micro-jacquard poly"],
      ["Wicking", "Permanent hydrophilic finish"],
      ["Ventilation", "Body-mapped mesh zones"],
      ["Odor control", "Ionic anti-microbial"],
      ["Fit", "Athletic, drop shoulder"],
    ]),
    priceCents: 5500,
    category: "Tops",
    sport: "Training",
    gender: "Unisex",
    sizes: "XS,S,M,L,XL,XXL",
    colors: "Stark White,Void Black",
    imageUrl: `${IMG}AB6AXuCs3AeEBDo7IYZmwynalkNje7UgHfe_k1bFboNDhC3DxKkGILDpJ_AByKhkoO_iVFjzKSRoDtNRylLoOASvUrlLXpxez0kFqOAVnqvHsGhcDWOf73ahl-R_le-hEuZBjt-tavwgYbZwLEKfv_8mPzJGGIiHnHZrGc3DtUDQhobzUxHmjDcULZOWXcbDMdzTNF18iDE1KVsR3gaZaQTIi1tR3mX1-Rsw9DSWqmpI-NKHn7TXEN8_u4AKYzNiYClInF9w_JcZI-fuZjM5`,
    badge: null,
    stock: 120,
    rating: 4.2,
    reviewCount: 178,
  },
  {
    slug: "elite-series-track-pants",
    name: "Elite Series Track Pants",
    description:
      "Warm-up pants worthy of the call room. Full-length side zips rip away over spikes, while the tapered kinetic knit keeps muscles warm without a gram of bulk.",
    specs: spec([
      ["Fabric", "Double-knit kinetic poly"],
      ["Zips", "Full-length side, 2-way"],
      ["Cuffs", "Tapered, zip-gusseted"],
      ["Pockets", "2 zip hand pockets"],
      ["Fit", "Slim taper"],
    ]),
    priceCents: 12000,
    category: "Pants",
    sport: "Training",
    gender: "Men",
    sizes: "S,M,L,XL",
    colors: "Void Black",
    imageUrl: `${IMG}AB6AXuApsPvx1N51NWO2g57ZhrO8hRu7_A5Ur6AhoKcWaVy2CU4IWiNqXff74AtFdKT3o0R8ChNdacThJmEfEeyBizVw0zNNIFtvq6Pc6FOtwWQA8CykE9OIB9zm-gfO0hIrNu87DRhDR_4Z8Utfu0f9GqOm65Tc_mr6D7a2eC2MnHFZfJcFq6D5nVQOzhgzLbCIBWMzqAYsaX0IxisAnTmKNQIDVlC8dYzPuHwLnp8hAXoh5m_c21L3wVLHk6HwihZHY9mgZHRn9YRE42jI`,
    badge: null,
    stock: 45,
    rating: 4.5,
    reviewCount: 89,
  },
  {
    slug: "vortex-cycling-jersey",
    name: "Vortex Cycling Jersey",
    description:
      "A second-skin aero jersey with textured 'vortex' sleeves that trip the boundary layer for measurable watt savings above 35 km/h. Full-length hidden zip, three-pocket classic rear.",
    specs: spec([
      ["Aero", "Vortex-textured sleeves"],
      ["Fabric", "Recycled aero knit"],
      ["Zip", "Full-length, hidden"],
      ["Pockets", "3 rear elastic"],
      ["UV", "UPF 40+"],
    ]),
    priceCents: 9800,
    category: "Tops",
    sport: "Cycling",
    gender: "Men",
    sizes: "S,M,L,XL",
    colors: "Void Black/Neon",
    imageUrl: `${IMG}AB6AXuCEPK0nSK1dNR6kyQywalzklvC5iGzlW1DdqY5RishfrUvtwSFLyWo9G6pw-vSOkkrC4_QgbeaYWFNoX9p-HE97c2Vv6K1FL-snkkICqK619XxfnjrM6P1K4QLfzpd2BSxCk32HKwH3q8wVVpV_oxUkqw7ATa8ltGvP6y4-SIRMnMCYTH8HrGoAXQ-fl3gtzEj7E4Qgdta2328voHFbALxari5vunkWOAl4ggQyqpXxFQrtunfN9FBmwjwO7vFIpo8_tdX2a54k9ex3`,
    badge: null,
    stock: 33,
    rating: 4.6,
    reviewCount: 74,
  },
  {
    slug: "stealth-recovery-hoodie",
    name: "Stealth Recovery Hoodie",
    description:
      "Post-session comfort with a technical edge. Brushed-back kinetic fleece traps warmth while ceramic-infused yarns reflect body heat back into recovering muscle groups.",
    specs: spec([
      ["Fabric", "Ceramic-infused kinetic fleece"],
      ["Weight", "420g/m² brushed back"],
      ["Hood", "Double-layer, crossover neck"],
      ["Pockets", "Kangaroo + hidden zip"],
      ["Cuffs", "Thumb-loop ribbed"],
    ]),
    priceCents: 13000,
    category: "Tops",
    sport: "Recovery",
    gender: "Unisex",
    sizes: "S,M,L,XL,XXL",
    colors: "Void Black",
    imageUrl: `${IMG}AB6AXuCGc0F8jvaS4fq3_QEaNkzmH0UKEwdYcABBsyOJS_kctNXCoPeCEyvn9XmdwzetUpVztbZzkL6398C8gnIKvVVp8eP5XLs4APg2dAbAkKr-EKSM45P2UjZlvFB_ezG6rfNObTuGoHdhL6RsU1dWcLZRjMVrwdai4ZV_bUr90_9q7p0rQBhIK1ZVK5mZL9_XgffMu-9iwnS8iU81SFuqjMl7vaXggjUm9mrlEnsNf8mFWWXVv0XDzfp0vj-dYBO90RVhccLt86O2avb5`,
    badge: "Best Seller",
    stock: 58,
    rating: 4.8,
    reviewCount: 236,
  },
];

async function main() {
  console.log("Seeding ApexVelocity catalog...");

  // Idempotent: upsert every product by slug.
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
    console.log(`  ✓ ${p.name}`);
  }

  // Demo account so the store can be tried without registering.
  const demoHash = await bcrypt.hash("apex1234", 10);
  await prisma.user.upsert({
    where: { email: "demo@apexvelocity.store" },
    update: {},
    create: {
      email: "demo@apexvelocity.store",
      name: "Demo Athlete",
      passwordHash: demoHash,
    },
  });
  console.log("  ✓ demo user: demo@apexvelocity.store / apex1234");

  console.log(`Done. ${products.length} products seeded.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
