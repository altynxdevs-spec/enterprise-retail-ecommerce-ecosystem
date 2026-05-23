import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Globe2,
  Heart,
  Lock,
  PackageCheck,
  Search,
  Shirt,
  Sparkles,
  Store,
  Tag,
  Truck,
} from "lucide-react";

type Screen =
  | "welcome"
  | "assisted"
  | "bodyScannerStart"
  | "bodyScannerMeasure"
  | "fabric"
  | "fabricDetail"
  | "template"
  | "templatePreview"
  | "neckCustomization"
  | "shoulderArmhole"
  | "upperArmCustomization"
  | "forearmCustomization"
  | "sleeveEndCuff"
  | "fullSleeveStyle"
  | "bodySilhouette"
  | "kameezLength"
  | "damanChaakHem"
  | "laceEmbroideryBorder"
  | "bottomWearType"
  | "bodyFitCustomization"
  | "thighKneeCustomization"
  | "painchaLowerLeg"
  | "dupattaCustomization"
  | "finalCustomizationReview"
  | "paymentMethod"
  | "orderPlaced";

type CustomizationSelections = Record<string, string>;

type TemplateCategory = "Kurtis" | "Frocks" | "Maxi" | "Sets";

type DressTemplate = {
  name: string;
  category: TemplateCategory;
  variant: "longKurti" | "alineFrock" | "maxiDress" | "abaya" | "twoPiece" | "threePiece" | "peplum";
};

type FabricItem = {
  name: string;
  category: "Everyday" | "Lightweight" | "Luxury" | "Formal" | "Festive" | "Premium" | "Sheer";
  color: "Cream" | "Pink" | "Gold" | "Navy" | "Mint" | "Purple" | "Beige" | "White";
  occasion: "Daily Wear" | "Summer" | "Formal" | "Wedding" | "Party" | "Eid / Festive" | "Winter";
  pricePerYard: number;
  recommendedYards: number;
  stitchingFrom: number;
  texture: string;
  imageSrc?: string;
  description: string;
  bestFor: string[];
  care: string;
};

const fabrics: FabricItem[] = [
  {
    name: "Lawn",
    category: "Lightweight",
    color: "Cream",
    occasion: "Summer",
    pricePerYard: 1850,
    recommendedYards: 4,
    stitchingFrom: 4500,
    texture:
      "radial-gradient(circle at 22% 20%, #15A9D6 0 4px, transparent 5px), radial-gradient(circle at 62% 42%, #AEEBFF 0 3px, transparent 4px), radial-gradient(circle at 36% 74%, #15A9D6 0 3px, transparent 4px), linear-gradient(135deg, #eff1df 0%, #F6FCFF 48%, #d5dfc8 100%)",
    imageSrc: "/assets/fabric-lawn.png",
    description:
      "Soft breathable lawn fabric for everyday custom outfits, summer suits, and comfortable shop-assisted stitching orders.",
    bestFor: ["Summer suits", "Daily wear", "Light embroidery"],
    care: "Gentle wash, low heat iron, avoid harsh bleach.",
  },
  {
    name: "Chiffon",
    category: "Formal",
    color: "Pink",
    occasion: "Party",
    pricePerYard: 2600,
    recommendedYards: 4.5,
    stitchingFrom: 5200,
    texture:
      "radial-gradient(circle at 20% 18%, rgba(255,255,255,.65), transparent 28%), linear-gradient(135deg, #fff4f6 0%, #f4bbc8 42%, #fff7f8 67%, #df91a6 100%)",
    imageSrc: "/assets/fabric-chiffon.png",
    description:
      "Lightweight flowy chiffon with an elegant fall, suitable for semi-formal dresses, dupattas, and party wear.",
    bestFor: ["Party wear", "Dupatta", "Flowy kameez"],
    care: "Dry clean preferred, steam lightly, store folded.",
  },
  {
    name: "Silk",
    category: "Luxury",
    color: "Cream",
    occasion: "Wedding",
    pricePerYard: 5400,
    recommendedYards: 4,
    stitchingFrom: 6500,
    texture:
      "radial-gradient(circle at 32% 25%, rgba(255,255,255,.75), transparent 30%), linear-gradient(145deg, #fdf4df 0%, #cbb081 26%, #fff8e7 48%, #b9915f 70%, #f7e6c6 100%)",
    imageSrc: "/assets/fabric-silk.png",
    description:
      "Premium silk fabric with a rich shine and smooth fall for bridal, formal, and luxury custom outfits.",
    bestFor: ["Wedding wear", "Luxury suits", "Formal shirts"],
    care: "Dry clean only, low steam, keep away from direct sunlight.",
  },
  {
    name: "Cotton",
    category: "Everyday",
    color: "White",
    occasion: "Daily Wear",
    pricePerYard: 1650,
    recommendedYards: 4,
    stitchingFrom: 4200,
    texture:
      "radial-gradient(circle at 48% 45%, rgba(255,255,255,.95), transparent 22%), repeating-linear-gradient(45deg, #fff 0 8px, #f0eee7 8px 16px)",
    imageSrc: "/assets/fabric-cotton.png",
    description:
      "Comfortable cotton fabric for clean everyday looks, simple cuts, office wear, and casual stitched outfits.",
    bestFor: ["Casual suits", "Office wear", "Daily comfort"],
    care: "Machine wash cold, medium iron, wash similar colors together.",
  },
  {
    name: "Organza",
    category: "Sheer",
    color: "Mint",
    occasion: "Formal",
    pricePerYard: 4200,
    recommendedYards: 4.5,
    stitchingFrom: 6200,
    texture:
      "radial-gradient(circle at 65% 35%, rgba(255,255,255,.85), transparent 26%), linear-gradient(135deg, rgba(250,255,250,.8), rgba(177,225,205,.72), rgba(255,255,255,.9))",
    imageSrc: "/assets/fabric-organza.png",
    description:
      "Structured sheer organza for premium formal outfits, overlays, dupattas, and statement sleeves.",
    bestFor: ["Formal overlays", "Dupatta", "Statement sleeves"],
    care: "Dry clean recommended, avoid heavy wringing, steam from distance.",
  },
  {
    name: "Embroidered",
    category: "Premium",
    color: "Navy",
    occasion: "Eid / Festive",
    pricePerYard: 6800,
    recommendedYards: 4,
    stitchingFrom: 7000,
    texture:
      "radial-gradient(circle at 24% 26%, #15A9D6 0 3px, transparent 4px), radial-gradient(circle at 70% 60%, #FFB45C 0 2px, transparent 3px), radial-gradient(circle at 42% 78%, #FFE4B8 0 2px, transparent 3px), linear-gradient(135deg, #14213D 0%, #15A9D6 55%, #0A1B2F 100%)",
    imageSrc: "/assets/fabric-embroidered.png",
    description:
      "Detailed embroidered fabric for festive custom clothing with premium threadwork and a ready-to-style look.",
    bestFor: ["Eid outfits", "Formal suits", "Detailed fronts"],
    care: "Dry clean only, iron from reverse side, protect embroidery.",
  },
  {
    name: "Festive",
    category: "Festive",
    color: "Gold",
    occasion: "Eid / Festive",
    pricePerYard: 5900,
    recommendedYards: 4,
    stitchingFrom: 6800,
    texture:
      "radial-gradient(circle at 30% 30%, rgba(242,106,33,.82) 0 3px, transparent 4px), radial-gradient(circle at 70% 70%, rgba(242,106,33,.65) 0 3px, transparent 4px), linear-gradient(135deg, #fff0cc, #F26A21, #fff7e6)",
    imageSrc: "/assets/fabric-festive.png",
    description:
      "Gold-toned festive fabric created for occasion wear, family events, and elegant custom stitched outfits.",
    bestFor: ["Festive suits", "Family events", "Statement dupatta"],
    care: "Dry clean preferred, store in fabric bag, avoid perfumes directly.",
  },
  {
    name: "Linen",
    category: "Everyday",
    color: "Beige",
    occasion: "Daily Wear",
    pricePerYard: 2300,
    recommendedYards: 4,
    stitchingFrom: 4700,
    texture:
      "repeating-linear-gradient(90deg, rgba(6,27,58,.08) 0 1px, transparent 1px 7px), repeating-linear-gradient(0deg, rgba(6,27,58,.06) 0 1px, transparent 1px 7px), #DDEBF22cf",
    imageSrc: "/assets/fabric-linen.png",
    description:
      "Textured linen fabric for minimal, premium daily wear with a breathable feel and graceful structure.",
    bestFor: ["Minimal suits", "Daily wear", "Straight cuts"],
    care: "Cold wash, reshape while damp, medium iron with steam.",
  },
  {
    name: "Net",
    category: "Sheer",
    color: "Purple",
    occasion: "Wedding",
    pricePerYard: 3850,
    recommendedYards: 4.5,
    stitchingFrom: 6400,
    texture:
      "radial-gradient(circle at 35% 34%, rgba(242,106,33,.75) 0 2px, transparent 3px), radial-gradient(circle at 68% 66%, rgba(242,106,33,.55) 0 2px, transparent 3px), repeating-linear-gradient(45deg, rgba(6,27,58,.10) 0 1px, transparent 1px 11px), repeating-linear-gradient(-45deg, rgba(6,27,58,.10) 0 1px, transparent 1px 11px), #d6c5ee",
    imageSrc: "/assets/fabric-net.png",
    description:
      "Delicate net fabric for wedding overlays, dupattas, sleeves, and premium party outfits.",
    bestFor: ["Wedding dupatta", "Party sleeves", "Layered design"],
    care: "Dry clean only, handle gently, avoid sharp jewelry snagging.",
  },
  {
    name: "Velvet",
    category: "Premium",
    color: "Navy",
    occasion: "Winter",
    pricePerYard: 7200,
    recommendedYards: 4,
    stitchingFrom: 7500,
    texture:
      "radial-gradient(circle at 28% 18%, rgba(255,255,255,.16), transparent 24%), linear-gradient(135deg, #14213D 0%, #15A9D6 48%, #0A1B2F 100%)",
    imageSrc: "/assets/fabric-velvet.png",
    description:
      "Rich velvet for winter formals, premium shawl-inspired looks, and heavy occasion wear.",
    bestFor: ["Winter formals", "Premium suits", "Evening wear"],
    care: "Dry clean only, brush gently, hang on padded hanger.",
  },
];

const categoryOptions = ["All", "Everyday", "Lightweight", "Luxury", "Formal", "Festive", "Premium", "Sheer"] as const;
const colorOptions = ["All", "Cream", "Pink", "Gold", "Navy", "Mint", "Purple", "Beige", "White"] as const;
const occasionOptions = ["All", "Daily Wear", "Summer", "Formal", "Wedding", "Party", "Eid / Festive", "Winter"] as const;

const templateCategories = ["All", "Kurtis", "Frocks", "Maxi", "Sets"] as const;

const dressTemplates: DressTemplate[] = [
  { name: "Long Kurti", category: "Kurtis", variant: "longKurti" },
  { name: "A-Line Frock", category: "Frocks", variant: "alineFrock" },
  { name: "Maxi Dress", category: "Maxi", variant: "maxiDress" },
  { name: "Abaya", category: "Kurtis", variant: "abaya" },
  { name: "2-Piece Suit", category: "Sets", variant: "twoPiece" },
  { name: "3-Piece Suit", category: "Sets", variant: "threePiece" },
  { name: "Peplum Set", category: "Sets", variant: "peplum" },
];

const templateImageMap: Record<string, string> = {
  "Long Kurti": "/assets/template-long-kurti.png",
  "A-Line Frock": "/assets/template-a-line-frock.png",
  "Maxi Dress": "/assets/template-maxi-dress.png",
  Abaya: "/assets/template-abaya.png",
  "2-Piece Suit": "/assets/template-2-piece-suit.png",
  "3-Piece Suit": "/assets/template-3-piece-suit.png",
  "Peplum Set": "/assets/template-peplum-set.png",
};

const templatePreviewImage = "/assets/template-preview-a-line-embroidered-kurti.png";


const CUSTOMIZATION_STORAGE_KEY = "multife_customization_selections";

function getStoredCustomizationSelections(): CustomizationSelections {
  if (typeof window === "undefined") return {};

  try {
    const stored = window.localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveStoredCustomizationSelections(updates: CustomizationSelections) {
  if (typeof window === "undefined") return;

  const current = getStoredCustomizationSelections();
  window.localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify({ ...current, ...updates }));
}

function getSelectionValue(selections: CustomizationSelections, key: string, fallback: string) {
  return selections[key] ?? fallback;
}

const selectionImageAliases: Record<string, string[]> = {
  "Regular Shoulder": ["Standard Shoulder", "Standard"],
  "Regular": ["Standard", "Regular Fit", "Regular Forearm", "Straight Sleeve"],
  "Plain": ["Plain Hem", "Plain Edge", "Straight Sleeve"],
  "Plain Paincha": ["Straight Paincha", "Narrow Paincha"],
  "Regular Sleeve": ["Straight Sleeve"],
  "Regular Full Sleeve": ["Straight Sleeve"],
};

function getSelectionImage(value: string, ...maps: Array<Record<string, string> | undefined>) {
  const candidates = [value, ...(selectionImageAliases[value] ?? [])];

  for (const candidate of candidates) {
    for (const map of maps) {
      const imageSrc = map?.[candidate];
      if (imageSrc) return imageSrc;
    }
  }

  return undefined;
}

const fabricColorHexMap: Record<FabricItem["color"], string> = {
  Cream: "#EFF9FB",
  Pink: "#F4B7C8",
  Gold: "#D8B15D",
  Navy: "#14213D",
  Mint: "#B7E4D0",
  Purple: "#C7B2EA",
  Beige: "#D8C7A9",
  White: "#FFFFFF",
};

function getFabricTintOpacity(color: FabricItem["color"]) {
  if (color === "White") return 0.08;
  if (color === "Cream") return 0.14;
  if (color === "Navy") return 0.3;
  return 0.22;
}


const warmedImageCache = new Set<string>();

function warmImage(src?: string) {
  if (!src || typeof window === "undefined" || warmedImageCache.has(src)) return;

  warmedImageCache.add(src);
  const image = new Image();
  image.decoding = "async";
  image.src = src;
}

function warmImagesSmoothly(sources: Array<string | undefined>) {
  if (typeof window === "undefined") return;

  const uniqueSources = sources.filter((src): src is string => Boolean(src) && !warmedImageCache.has(src));
  if (!uniqueSources.length) return;

  let index = 0;

  const runBatch = () => {
    const batch = uniqueSources.slice(index, index + 4);
    index += batch.length;

    batch.forEach((src) => warmImage(src));

    if (index < uniqueSources.length) {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      };

      if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(runBatch, { timeout: 500 });
      } else {
        window.setTimeout(runBatch, 120);
      }
    }
  };

  window.setTimeout(runBatch, 40);
}

function useSmoothImageWarmup(screen: Screen, selectedFabric: FabricItem, selectedTemplate: DressTemplate) {
  useEffect(() => {
    const warmupSources: Array<string | undefined> = [
      selectedFabric.imageSrc,
      templateImageMap[selectedTemplate.name],
    ];

    if (screen === "welcome" || screen === "bodyScannerStart" || screen === "bodyScannerMeasure") {
      warmupSources.push(
        "/assets/login-screen.png",
        "/assets/qr-code.png",
        "/assets/screen-02.png",
        "/assets/screen-02-workflow.png"
      );
    }

    if (screen === "assisted" || screen === "bodyScannerStart" || screen === "bodyScannerMeasure" || screen === "fabric" || screen === "fabricDetail") {
      warmupSources.push(...fabrics.slice(0, 10).map((fabric) => fabric.imageSrc));
    }

    if (screen === "fabricDetail" || screen === "template" || screen === "templatePreview") {
      warmupSources.push(...dressTemplates.map((template) => templateImageMap[template.name]));
      warmupSources.push(templatePreviewImage);
    }

    // For customization screens, warm only the commonly reused selected previews first.
    if (
      screen !== "welcome" &&
      screen !== "assisted" &&
      screen !== "fabric" &&
      screen !== "fabricDetail" &&
      screen !== "template"
    ) {
      warmupSources.push(
        templatePreviewImage,
        selectedFabric.imageSrc,
        templateImageMap[selectedTemplate.name]
      );
    }

    warmImagesSmoothly(warmupSources);
  }, [screen, selectedFabric, selectedTemplate]);
}

function AppPolishStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap');

      .app-shell {
        --mf-ink: #08243D;
        --mf-ink-soft: #1B3654;
        --mf-muted: #65758A;
        --mf-blue: #0E7BC1;
        --mf-blue-deep: #06365A;
        --mf-cyan: #10B6D9;
        --mf-orange: #F26A21;
        --mf-green: #78BE43;
        --mf-magenta: #D83396;
        --mf-purple: #7A3FA2;
        --mf-cream: #FFF8EF;
        --mf-surface: #FFFFFF;
        --mf-soft: #F4FBFD;
        --mf-line: rgba(8, 36, 61, 0.11);
        --mf-shadow: 0 18px 44px rgba(8, 36, 61, 0.10);
        font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        color: var(--mf-ink);
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        background:
          radial-gradient(circle at 8% 0%, rgba(16, 182, 217, 0.18), transparent 32%),
          radial-gradient(circle at 92% 8%, rgba(242, 106, 33, 0.10), transparent 28%),
          radial-gradient(circle at 4% 88%, rgba(120, 190, 67, 0.10), transparent 30%),
          radial-gradient(circle at 100% 92%, rgba(216, 51, 150, 0.06), transparent 28%),
          linear-gradient(135deg, #F8FCFF 0%, #FFFFFF 42%, #FFF8EF 100%) !important;
      }

      .app-stage > * {
        animation: mf-device-enter 360ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      .app-ui {
        font-family: "Plus Jakarta Sans", "Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        letter-spacing: -0.01em;
        background:
          radial-gradient(circle at 0% -5%, rgba(16, 182, 217, 0.14), transparent 32%),
          radial-gradient(circle at 100% 0%, rgba(242, 106, 33, 0.075), transparent 30%),
          radial-gradient(circle at 100% 78%, rgba(120, 190, 67, 0.075), transparent 28%),
          linear-gradient(180deg, #FFFFFF 0%, #F6FBFD 52%, #FFF8EF 100%) !important;
      }

      .app-ui .brand-serif,
      .app-ui h1 {
        font-family: "DM Serif Display", Georgia, serif !important;
        font-weight: 400;
        letter-spacing: 0.005em;
        text-align: center;
        text-wrap: balance;
        color: var(--mf-ink) !important;
      }

      .app-ui h1::after {
        content: "";
        display: block;
        width: 42px;
        height: 3px;
        margin: 8px auto 0;
        border-radius: 999px;
        background: linear-gradient(90deg, var(--mf-cyan), var(--mf-orange));
      }

      .app-ui h2,
      .app-ui h3,
      .app-ui .summary-title,
      .app-ui .option-label {
        color: var(--mf-ink) !important;
        font-family: "Plus Jakarta Sans", "Inter", sans-serif !important;
        letter-spacing: -0.025em;
      }

      .app-ui h2,
      .app-ui h3 {
        line-height: 1.14;
        text-wrap: balance;
        font-weight: 800 !important;
      }

      .app-ui p,
      .app-ui span,
      .app-ui button,
      .app-ui input,
      .app-ui select {
        font-family: "Plus Jakarta Sans", "Inter", sans-serif !important;
      }

      .app-ui p {
        color: var(--mf-muted);
        text-wrap: pretty;
      }

      .app-ui [class*="text-[#667889]"],
      .app-ui [class*="text-[#526172]"],
      .app-ui [class*="text-[#748596]"] {
        color: #65758A !important;
      }

      .app-ui [class*="text-[#14213D]"] {
        color: var(--mf-ink) !important;
      }

      .app-ui [class*="bg-[#FCFEFF]"],
      .app-ui [class*="bg-[#F6FCFF]"] {
        background-color: rgba(255, 255, 255, 0.86) !important;
      }

      .app-ui [class*="border-[#DDEBF2]"],
      .app-ui [class*="border-[#E2EEF4]"],
      .app-ui [class*="border-[#E9F4F8]"] {
        border-color: var(--mf-line) !important;
      }

      .app-ui [class*="bg-[#14213D]"] {
        background: linear-gradient(135deg, var(--mf-blue-deep) 0%, var(--mf-blue) 58%, var(--mf-cyan) 100%) !important;
        color: #FFFFFF !important;
        border: 1px solid rgba(255, 255, 255, 0.28) !important;
        box-shadow: 0 14px 28px rgba(14, 123, 193, 0.22), inset 0 1px 0 rgba(255,255,255,0.25) !important;
      }

      .app-ui [class*="bg-[#14213D]"] *,
      .app-ui [class*="bg-[#14213D]"] span,
      .app-ui [class*="bg-[#14213D]"] svg {
        color: #FFFFFF !important;
      }

      .app-ui [class*="text-[#15A9D6]"] {
        color: var(--mf-blue) !important;
      }

      .app-ui [class*="bg-[#15A9D6]"] {
        background: linear-gradient(135deg, var(--mf-orange), #FF8A3D) !important;
        color: #FFFFFF !important;
      }

      .app-ui [class*="border-[#15A9D6]"] {
        border-color: rgba(16, 182, 217, 0.92) !important;
      }

      .app-ui [class*="ring-[#15A9D6]"] {
        --tw-ring-color: rgba(16, 182, 217, 0.20) !important;
      }

      .app-ui button,
      .app-ui select,
      .app-ui input {
        -webkit-tap-highlight-color: transparent;
      }

      .app-ui button {
        will-change: transform, box-shadow, border-color;
        transition:
          transform 210ms cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 210ms cubic-bezier(0.22, 1, 0.36, 1),
          border-color 210ms ease,
          background-color 210ms ease,
          color 210ms ease,
          opacity 210ms ease;
      }

      .app-ui button:hover {
        transform: translateY(-1px);
      }

      .app-ui button:active {
        transform: translateY(0) scale(0.985);
      }

      .app-ui button:focus-visible,
      .app-ui input:focus-visible,
      .app-ui select:focus-visible {
        outline: 2px solid rgba(27, 127, 195, 0.36);
        outline-offset: 2px;
      }

      .app-ui button[class*="border-[#15A9D6]"],
      .app-ui [class*="ring-2"] {
        box-shadow: 0 14px 30px rgba(16, 182, 217, 0.13), 0 0 0 1px rgba(16, 182, 217, 0.08) !important;
      }

      .app-ui [class*="shadow-[0_10px_24px"],
      .app-ui [class*="shadow-[0_10px_30px"],
      .app-ui [class*="shadow-[0_6px_16px"],
      .app-ui [class*="shadow-[0_12px_24px"] {
        box-shadow: 0 14px 34px rgba(16, 35, 63, 0.08) !important;
      }

      .app-ui img {
        filter: saturate(1.02) contrast(1.015);
        animation: mf-image-reveal 320ms ease both;
      }

      .app-ui button img,
      .app-ui .template-image-wrap img {
        width: 100% !important;
        height: 100% !important;
        object-fit: contain !important;
        object-position: center !important;
        padding: 4px;
        border-radius: 14px;
        background:
          radial-gradient(circle at 20% 6%, rgba(16, 182, 217, 0.075), transparent 28%),
          radial-gradient(circle at 92% 90%, rgba(242, 106, 33, 0.055), transparent 24%),
          linear-gradient(180deg, #FFFFFF 0%, #F6FBFD 100%);
      }

      .app-ui .template-image-wrap {
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(246, 251, 253, 0.96));
        border-bottom: 1px solid rgba(16, 35, 63, 0.06);
      }

      .app-ui button[class*="rounded-[18px]"],
      .app-ui button[class*="rounded-[16px]"],
      .app-ui button[class*="rounded-[14px]"] {
        background-color: rgba(255, 255, 255, 0.94);
      }

      .app-ui .option-label,
      .app-ui button > p.truncate {
        display: -webkit-box;
        min-height: 20px;
        overflow: hidden;
        text-align: center;
        white-space: normal;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        line-height: 1.18;
        font-weight: 800 !important;
        color: var(--mf-ink) !important;
      }

      .app-ui [class*="uppercase"] {
        letter-spacing: 0.12em;
      }

      .app-ui .summary-title {
        line-height: 1.15;
        letter-spacing: -0.015em;
        font-weight: 800 !important;
      }

      .app-ui .summary-value {
        line-height: 1.22;
        letter-spacing: -0.005em;
        color: var(--mf-muted) !important;
      }

      .app-ui .phone-frame,
      .app-ui [class*="rounded-[36px]"] {
        box-shadow: 0 24px 70px rgba(16, 35, 63, 0.14) !important;
      }

      .app-ui ::selection {
        background: rgba(19, 181, 216, 0.20);
        color: var(--mf-ink);
      }

      .app-ui header,
      .app-ui footer,
      .app-ui section > div {
        animation: mf-content-rise 340ms cubic-bezier(0.22, 1, 0.36, 1) both;
      }

      .app-ui section > div:nth-child(1) { animation-delay: 20ms; }
      .app-ui section > div:nth-child(2) { animation-delay: 55ms; }
      .app-ui section > div:nth-child(3) { animation-delay: 85ms; }
      .app-ui section > div:nth-child(4) { animation-delay: 110ms; }

      @keyframes mf-device-enter {
        from {
          opacity: 0;
          transform: translateY(14px) scale(0.985);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      @keyframes mf-content-rise {
        from {
          opacity: 0;
          transform: translateY(8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes mf-image-reveal {
        from {
          opacity: 0;
          transform: scale(1.012);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }


      .app-ui select {
        border-radius: 14px !important;
        background: rgba(255,255,255,0.92) !important;
        color: var(--mf-ink) !important;
        box-shadow: 0 10px 22px rgba(8,36,61,0.055) !important;
      }

      .app-ui label:has(select) {
        border-radius: 14px;
      }

      .app-ui .filter-chip-active,
      .app-ui button[data-active="true"] {
        background: linear-gradient(135deg, var(--mf-blue-deep), var(--mf-blue), var(--mf-cyan)) !important;
        color: #fff !important;
      }

      .app-ui button[class*="rounded-full"][class*="bg-white"],
      .app-ui button[class*="rounded-[13px]"],
      .app-ui button[class*="rounded-[18px]"] {
        border-color: rgba(8, 36, 61, 0.10);
      }

      .app-ui button[class*="rounded-[13px]"][class*="text-white"] {
        background: linear-gradient(135deg, var(--mf-blue-deep), var(--mf-blue) 62%, var(--mf-cyan)) !important;
        color: #fff !important;
        box-shadow: 0 10px 20px rgba(14, 123, 193, 0.20) !important;
      }

      .app-ui [class*="bg-[#FCFEFF]"] {
        background-color: rgba(255, 255, 255, 0.68) !important;
        backdrop-filter: blur(18px);
      }




      /* Arrow icon fix: clean mobile-app line arrows, not filled/blobby */
      .app-ui button svg.lucide-arrow-right,
      .app-ui button svg.lucide-arrow-left,
      .app-ui button svg.lucide-chevron-right {
        fill: none !important;
        stroke: currentColor !important;
        stroke-width: 2 !important;
        stroke-linecap: round !important;
        stroke-linejoin: round !important;
        flex-shrink: 0 !important;
      }

      .app-ui button[class*="bg-[#14213D]"] svg.lucide-arrow-right,
      .app-ui button[data-active="true"] svg.lucide-arrow-right {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: none !important;
      }

      .app-ui button[class*="bg-[#14213D]"] svg.lucide-arrow-right *,
      .app-ui button[data-active="true"] svg.lucide-arrow-right * {
        fill: none !important;
        stroke: #ffffff !important;
      }

      .app-ui button .lucide-arrow-right {
        width: 20px !important;
        height: 20px !important;
      }

      .app-ui button .lucide-arrow-left {
        width: 15px !important;
        height: 15px !important;
      }

      /* Welcome QR card fix: QR stays inside its own box, not stretched by global button image rules */
      .app-ui .qr-start-card {
        background: rgba(255, 255, 255, 0.96) !important;
      }

      .app-ui .qr-start-card .qr-image-shell {
        width: 142px !important;
        height: 142px !important;
        min-width: 142px !important;
        max-width: 142px !important;
        background: #ffffff !important;
      }

      .app-ui .qr-start-card .welcome-qr-image {
        width: 100% !important;
        height: 100% !important;
        max-width: 122px !important;
        max-height: 122px !important;
        object-fit: contain !important;
        padding: 0 !important;
        border-radius: 10px !important;
        background: transparent !important;
        filter: none !important;
      }

      @media (max-width: 390px) {
        .app-ui .qr-start-card .qr-image-shell {
          width: 132px !important;
          height: 132px !important;
          min-width: 132px !important;
          max-width: 132px !important;
        }

        .app-ui .qr-start-card .welcome-qr-image {
          max-width: 114px !important;
          max-height: 114px !important;
        }
      }

      /* Filled button typography fix: keep all dark-button text/icons white */
      .app-ui button[class*="bg-[#14213D]"],
      .app-ui button[data-active="true"] {
        color: #ffffff !important;
      }

      .app-ui button[class*="bg-[#14213D]"] *,
      .app-ui button[data-active="true"] * {
        color: #ffffff !important;
        fill: #ffffff !important;
        stroke: #ffffff !important;
      }

      .app-ui button[class*="bg-[#14213D]"]:hover,
      .app-ui button[data-active="true"]:hover {
        color: #ffffff !important;
      }


      /* FINAL filled button text fix: all solid/active buttons must have white readable text */
      .app-ui button[class*="bg-[#15A9D6]"],
      .app-ui button[class*="bg-[#14213D]"],
      .app-ui button[class*="bg-gradient"],
      .app-ui button[class*="text-white"],
      .app-ui button[data-active="true"] {
        color: #ffffff !important;
        text-shadow: none !important;
      }

      .app-ui button[class*="bg-[#15A9D6]"] :where(span, p, div, strong, small),
      .app-ui button[class*="bg-[#14213D]"] :where(span, p, div, strong, small),
      .app-ui button[class*="bg-gradient"] :where(span, p, div, strong, small),
      .app-ui button[class*="text-white"] :where(span, p, div, strong, small),
      .app-ui button[data-active="true"] :where(span, p, div, strong, small) {
        color: #ffffff !important;
      }

      .app-ui button[class*="bg-[#15A9D6]"] svg,
      .app-ui button[class*="bg-[#14213D]"] svg,
      .app-ui button[class*="bg-gradient"] svg,
      .app-ui button[class*="text-white"] svg,
      .app-ui button[data-active="true"] svg {
        color: #ffffff !important;
        stroke: #ffffff !important;
        fill: none !important;
      }

      .app-ui button[class*="bg-[#15A9D6]"] svg *,
      .app-ui button[class*="bg-[#14213D]"] svg *,
      .app-ui button[class*="bg-gradient"] svg *,
      .app-ui button[class*="text-white"] svg *,
      .app-ui button[data-active="true"] svg * {
        stroke: #ffffff !important;
        fill: none !important;
      }

      /* Keep disabled solid buttons readable but visually disabled */
      .app-ui button:disabled,
      .app-ui button[disabled] {
        opacity: 0.72;
      }


      /* Selected pill/chip text fix only */
      .app-ui button[aria-pressed="true"],
      .app-ui button[data-selected="true"],
      .app-ui button[data-active="true"] {
        color: #ffffff !important;
      }

      .app-ui button[aria-pressed="true"] *,
      .app-ui button[data-selected="true"] *,
      .app-ui button[data-active="true"] * {
        color: #ffffff !important;
      }

      .app-ui button[aria-pressed="true"] svg,
      .app-ui button[data-selected="true"] svg,
      .app-ui button[data-active="true"] svg {
        stroke: #ffffff !important;
        fill: none !important;
      }


      /* Fabric detail selected pill fix only */
      .app-ui .fabric-detail-pill,
      .app-ui .fabric-detail-pill * {
        color: #ffffff !important;
      }

      .app-ui .fabric-detail-pill svg {
        stroke: #ffffff !important;
        fill: none !important;
      }


      /* Selected fabric category pill: keep label readable */
      .app-ui .fabric-selected-category-pill,
      .app-ui .fabric-selected-category-pill * {
        color: #ffffff !important;
      }


      /* Final review edit pill: blue with white text */
      .app-ui .review-edit-pill,
      .app-ui .review-edit-pill * {
        color: #ffffff !important;
      }




      /* Unified compact action buttons */
      .app-ui button.compact-cta-button {
        position: relative !important;
        width: 78% !important;
        min-height: 40px !important;
        height: 40px !important;
        margin-left: auto !important;
        margin-right: auto !important;
        padding: 0 42px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
        border-radius: 14px !important;
        font-size: 13px !important;
        line-height: 1.1 !important;
        font-weight: 650 !important;
        letter-spacing: -0.02em !important;
        white-space: nowrap !important;
        box-shadow: 0 8px 18px rgba(7, 25, 54, 0.16) !important;
      }

      .app-ui button.compact-cta-button svg.lucide-arrow-right {
        position: absolute !important;
        right: 18px !important;
        top: 50% !important;
        width: 18px !important;
        height: 18px !important;
        transform: translateY(-50%) !important;
      }

      .app-ui button.compact-cta-button svg.lucide-arrow-right,
      .app-ui button.compact-cta-button svg.lucide-arrow-right * {
        fill: none !important;
        stroke: currentColor !important;
      }

      .app-ui button.compact-cta-button:active {
        transform: scale(0.985) !important;
      }

      .app-ui button.compact-cta-button:disabled {
        opacity: 0.68;
        box-shadow: none !important;
      }

      @media (max-width: 390px) {
        .app-ui button.compact-cta-button {
          width: 82% !important;
          font-size: 12.5px !important;
          padding-left: 36px !important;
          padding-right: 36px !important;
        }

        .app-ui button.compact-cta-button svg.lucide-arrow-right {
          right: 15px !important;
          width: 17px !important;
          height: 17px !important;
        }
      }


      /* Smooth image loading without app freeze */
      .app-ui img {
        transition: opacity 140ms ease, transform 180ms ease !important;
        backface-visibility: hidden;
      }

      .app-ui button img,
      .app-ui .template-image-wrap img {
        will-change: opacity, transform;
      }



      /* Camera-style scanner preview: static, no moving scan animation */
      .app-ui .scanner-line {
        animation: none !important;
        transform: none !important;
        opacity: 0.28;
      }

      .app-ui .scanner-range {
        accent-color: #0E7BC1;
        height: 4px;
      }

      .app-ui .scanner-range::-webkit-slider-thumb {
        cursor: pointer;
      }


      /* Fabric/color summary circle: no broken image and no global card padding */
      .app-ui .fabric-circle-thumb img {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        border-radius: 9999px !important;
        object-fit: cover !important;
        object-position: center !important;
        background: transparent !important;
      }


      /* Payment page only: vector cards, no image placeholders */
      .app-ui .payment-method-card {
        min-height: 92px;
      }

      .app-ui .payment-method-card svg,
      .app-ui .payment-method-card svg * {
        fill: none !important;
      }

      .app-ui .payment-method-visual {
        isolation: isolate;
      }

      @media (max-width: 390px) {
        .app-ui .payment-method-card {
          min-height: 88px;
          gap: 10px !important;
          padding: 12px !important;
        }

        .app-ui .payment-method-visual {
          width: 52px !important;
          height: 52px !important;
        }
      }


      /* Payment icons: remove orange corner decoration */
      .app-ui .payment-method-visual {
        background-clip: padding-box !important;
      }

      .app-ui .payment-method-visual::before,
      .app-ui .payment-method-visual::after {
        content: none !important;
        display: none !important;
      }


      /* Order placed card only: vector summary, no image placeholder */
      .app-ui .order-summary-card svg,
      .app-ui .order-summary-card svg * {
        fill: none !important;
      }

      @media (max-width: 390px) {
        .app-ui .order-summary-card .grid {
          gap: 8px !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .app-stage > *,
        .app-ui header,
        .app-ui footer,
        .app-ui section > div,
        .app-ui img {
          animation: none !important;
        }

        .app-ui button {
          transition: none !important;
        }
      }
    `}</style>
  );
}


function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [selectedFabricName, setSelectedFabricName] = useState<string | null>(null);
  const [selectedTemplateName, setSelectedTemplateName] = useState<string | null>(null);

  const selectedFabric = useMemo(
    () => fabrics.find((fabric) => fabric.name === selectedFabricName) ?? fabrics[0],
    [selectedFabricName]
  );

  const selectedTemplate = useMemo(
    () => dressTemplates.find((template) => template.name === selectedTemplateName) ?? dressTemplates[0],
    [selectedTemplateName]
  );

  useSmoothImageWarmup(screen, selectedFabric, selectedTemplate);

  const [returnToFinalReview, setReturnToFinalReview] = useState(false);

  const goBackOrReturnToReview = (fallbackScreen: Screen) => {
    if (returnToFinalReview) {
      setReturnToFinalReview(false);
      setScreen("finalCustomizationReview");
      return;
    }

    setScreen(fallbackScreen);
  };

  const goSaveOrReturnToReview = (fallbackScreen: Screen) => {
    if (returnToFinalReview) {
      setReturnToFinalReview(false);
      setScreen("finalCustomizationReview");
      return;
    }

    setScreen(fallbackScreen);
  };

  const openReviewEditScreen = (targetScreen: Screen) => {
    setReturnToFinalReview(true);
    setScreen(targetScreen);
  };

  const resetReviewReturnAndGo = (targetScreen: Screen) => {
    setReturnToFinalReview(false);
    setScreen(targetScreen);
  };

  return (
    <main className="app-shell min-h-screen bg-[radial-gradient(circle_at_top_left,#E7F8FF_0%,#FCFEFF_44%,#F6F2FF_100%)] px-6 py-8 text-[#14213D]">
      <AppPolishStyles />
      <section className="app-stage mx-auto flex min-h-[calc(100vh-64px)] max-w-7xl items-center justify-center">
        {screen === "welcome" && <WelcomeScreen onNext={() => resetReviewReturnAndGo("assisted")} />}

        {screen === "assisted" && (
          <AssistedScreen
            onBack={() => resetReviewReturnAndGo("welcome")}
            onContinue={() => resetReviewReturnAndGo("bodyScannerStart")}
          />
        )}

        {screen === "bodyScannerStart" && (
          <BodyScannerStartScreen
            onBack={() => resetReviewReturnAndGo("assisted")}
            onOpenScanner={() => resetReviewReturnAndGo("bodyScannerMeasure")}
          />
        )}

        {screen === "bodyScannerMeasure" && (
          <BodyScannerMeasureScreen
            onBack={() => resetReviewReturnAndGo("bodyScannerStart")}
            onContinue={() => resetReviewReturnAndGo("fabric")}
          />
        )}

        {screen === "fabric" && (
          <FabricLibraryScreen
            selectedFabricName={selectedFabricName}
            onBack={() => goBackOrReturnToReview("bodyScannerMeasure")}
            onProceed={(fabricName) => {
              setSelectedFabricName(fabricName);
              goSaveOrReturnToReview("fabricDetail");
            }}
            onSelectFabric={setSelectedFabricName}
          />
        )}

        {screen === "fabricDetail" && (
          <FabricDetailScreen
            fabric={selectedFabric}
            onBack={() => goBackOrReturnToReview("fabric")}
            onContinue={() => goSaveOrReturnToReview("template")}
          />
        )}

        {screen === "template" && (
          <TemplateLibraryScreen
            selectedTemplateName={selectedTemplateName}
            onBack={() => goBackOrReturnToReview("fabricDetail")}
            onSelectTemplate={setSelectedTemplateName}
            onContinue={(templateName) => {
              setSelectedTemplateName(templateName);
              goSaveOrReturnToReview("templatePreview");
            }}
          />
        )}

        {screen === "templatePreview" && (
          <TemplatePreviewScreen
            template={selectedTemplate}
            fabric={selectedFabric}
            onBack={() => goBackOrReturnToReview("template")}
            onCustomize={() => resetReviewReturnAndGo("neckCustomization")}
          />
        )}

        {screen === "neckCustomization" && (
          <NeckCustomizationScreen
            onBack={() => goBackOrReturnToReview("templatePreview")}
            onSave={() => goSaveOrReturnToReview("shoulderArmhole")}
          />
        )}

        {screen === "shoulderArmhole" && (
          <ShoulderArmholeScreen
            onBack={() => goBackOrReturnToReview("neckCustomization")}
            onSave={() => goSaveOrReturnToReview("upperArmCustomization")}
          />
        )}

        {screen === "upperArmCustomization" && (
          <UpperArmCustomizationScreen
            onBack={() => goBackOrReturnToReview("shoulderArmhole")}
            onSave={() => goSaveOrReturnToReview("forearmCustomization")}
          />
        )}

        {screen === "forearmCustomization" && (
          <ForearmCustomizationScreen
            onBack={() => goBackOrReturnToReview("upperArmCustomization")}
            onSave={() => goSaveOrReturnToReview("sleeveEndCuff")}
          />
        )}

        {screen === "sleeveEndCuff" && (
          <SleeveEndCuffScreen
            onBack={() => goBackOrReturnToReview("forearmCustomization")}
            onSave={() => goSaveOrReturnToReview("fullSleeveStyle")}
          />
        )}

        {screen === "fullSleeveStyle" && (
          <FullSleeveStyleScreen
            onBack={() => goBackOrReturnToReview("sleeveEndCuff")}
            onSave={() => goSaveOrReturnToReview("bodySilhouette")}
          />
        )}

        {screen === "bodySilhouette" && (
          <BodySilhouetteScreen
            onBack={() => goBackOrReturnToReview("fullSleeveStyle")}
            onSave={() => goSaveOrReturnToReview("kameezLength")}
          />
        )}

        {screen === "kameezLength" && (
          <KameezLengthScreen
            onBack={() => goBackOrReturnToReview("bodySilhouette")}
            onSave={() => goSaveOrReturnToReview("damanChaakHem")}
          />
        )}

        {screen === "damanChaakHem" && (
          <DamanChaakHemScreen
            onBack={() => goBackOrReturnToReview("kameezLength")}
            onSave={() => goSaveOrReturnToReview("laceEmbroideryBorder")}
          />
        )}

        {screen === "laceEmbroideryBorder" && (
          <LaceEmbroideryBorderScreen
            onBack={() => goBackOrReturnToReview("damanChaakHem")}
            onSave={() => goSaveOrReturnToReview("bottomWearType")}
          />
        )}

        {screen === "bottomWearType" && (
          <BottomWearTypeScreen
            onBack={() => goBackOrReturnToReview("laceEmbroideryBorder")}
            onSave={() => goSaveOrReturnToReview("bodyFitCustomization")}
          />
        )}

        {screen === "bodyFitCustomization" && (
          <BodyFitCustomizationScreen
            onBack={() => goBackOrReturnToReview("bottomWearType")}
            onSave={() => goSaveOrReturnToReview("thighKneeCustomization")}
          />
        )}

        {screen === "thighKneeCustomization" && (
          <ThighKneeCustomizationScreen
            onBack={() => goBackOrReturnToReview("bodyFitCustomization")}
            onSave={() => goSaveOrReturnToReview("painchaLowerLeg")}
          />
        )}

        {screen === "painchaLowerLeg" && (
          <PainchaLowerLegScreen
            onBack={() => goBackOrReturnToReview("thighKneeCustomization")}
            onSave={() => goSaveOrReturnToReview("dupattaCustomization")}
          />
        )}

        {screen === "dupattaCustomization" && (
          <DupattaCustomizationScreen
            onBack={() => goBackOrReturnToReview("painchaLowerLeg")}
            onSave={() => goSaveOrReturnToReview("finalCustomizationReview")}
          />
        )}

        {screen === "finalCustomizationReview" && (
          <FinalCustomizationReviewScreen
            selectedFabric={selectedFabric}
            selectedTemplate={selectedTemplate}
            onBack={() => resetReviewReturnAndGo("dupattaCustomization")}
            onEditScreen={openReviewEditScreen}
            onContinue={() => resetReviewReturnAndGo("paymentMethod")}
          />
        )}

        {screen === "paymentMethod" && (
          <PaymentMethodScreen
            onBack={() => resetReviewReturnAndGo("finalCustomizationReview")}
            onConfirm={() => resetReviewReturnAndGo("orderPlaced")}
          />
        )}

        {screen === "orderPlaced" && (
          <OrderPlacedScreen
            onTrack={() => resetReviewReturnAndGo("orderPlaced")}
            onHome={() => resetReviewReturnAndGo("fabric")}
          />
        )}
      </section>
    </main>
  );
}

function PhoneFrame({
  children,
  contentClassName = "px-8 pb-7 pt-20",
}: {
  children: ReactNode;
  contentClassName?: string;
}) {
  return (
    <div className="relative h-[860px] w-[430px] rounded-[44px] bg-black p-[9px] shadow-[0_24px_70px_rgba(0,0,0,0.25)]">
      <div className="absolute left-1/2 top-[22px] z-20 h-[30px] w-[126px] -translate-x-1/2 rounded-full bg-black" />

      <div className="h-full overflow-hidden rounded-[36px] bg-[#FCFEFF]">
        <div
          className={`app-ui h-full overflow-y-auto [&::-webkit-scrollbar]:hidden ${contentClassName}`}
          style={{ scrollbarWidth: "none" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function BrandHeader() {
  return (
    <div className="mt-5 text-center">
      <div
        className="brand-serif text-[58px] leading-none tracking-wide text-[#14213D]"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        MultiFe
      </div>

      <p className="mt-3 text-[13px] font-semibold uppercase tracking-[0.35em] text-[#315A78]">
        WOMEN&apos;S CUSTOM CLOTHING
      </p>
    </div>
  );
}

function CompactBrandHeader() {
  return (
    <div className="text-center">
      <div
        className="brand-serif text-[30px] leading-none tracking-wide text-[#14213D]"
        style={{ fontFamily: '"DM Serif Display", serif' }}
      >
        MultiFe
      </div>

      <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.22em] text-[#526172]">
        WOMEN&apos;S CUSTOM CLOTHING
      </p>
    </div>
  );
}

function WelcomeScreen({ onNext }: { onNext: () => void }) {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-end">
        <Globe2 className="h-7 w-7 text-[#14213D]" strokeWidth={1.6} />
      </div>

      <BrandHeader />

      <div className="relative mt-3 flex h-[340px] justify-center overflow-hidden">
        <img
          src="/assets/login-screen.png"
          alt="Cream embroidered eastern outfit"
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div className="-mt-1 text-center">
        <h2
          className="text-[21px] font-semibold tracking-wide text-[#14213D]"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Custom. Your Style. Your Fit.
        </h2>

        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-9 bg-[#15A9D6] text-white" />
          <p className="text-[16px] text-[#667889]">Exclusively for Women</p>
          <span className="h-px w-9 bg-[#15A9D6] text-white" />
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="qr-start-card relative mt-7 w-full overflow-hidden rounded-[22px] border border-[#DDEBF2] bg-white px-4 py-4 text-left shadow-[0_12px_30px_rgba(6,27,58,0.08)] transition hover:scale-[1.01]"
      >
        <div className="pointer-events-none absolute left-4 top-4 h-7 w-7 border-l-2 border-t-2 border-[#15A9D6]" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-7 w-7 border-b-2 border-r-2 border-[#15A9D6]" />

        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="min-w-0 max-w-[118px] shrink-0 pl-1">
            <h3
              className="text-[19px] font-extrabold leading-[1.08] tracking-[-0.03em] text-[#14213D]"
              style={{ fontFamily: '"Plus Jakarta Sans", "Inter", sans-serif' }}
            >
              Scan QR Code
            </h3>

            <p className="mt-2 text-[13px] font-medium leading-[1.45] text-[#65758A]">
              to continue your custom order
            </p>
          </div>

          <div className="qr-image-shell flex h-[142px] w-[142px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#E2EEF4] bg-white p-2 shadow-[0_8px_18px_rgba(6,27,58,0.06)]">
            <img
              src="/assets/qr-code.png"
              alt="QR Code"
              className="welcome-qr-image block h-full w-full object-contain"
              draggable={false}
            />
          </div>
        </div>
      </button>
    </PhoneFrame>
  );
}

function AssistedScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#f1eee8]"
          aria-label="Go back to welcome screen"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={1.7} />
        </button>

        <Globe2 className="h-7 w-7 text-[#14213D]" strokeWidth={1.6} />
      </div>

      <BrandHeader />

      <div className="mt-7 text-center">
        <h2
          className="text-[25px] font-semibold leading-[1.2] tracking-wide text-[#14213D]"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Welcome to Shop-Assisted
          <br />
          Ordering
        </h2>

        <div className="mt-5 flex items-center justify-center gap-5">
          <span className="h-px w-[78px] bg-[#15A9D6] text-white" />
          <span className="text-[16px] text-[#15A9D6]">✦</span>
          <span className="h-px w-[78px] bg-[#15A9D6] text-white" />
        </div>
      </div>

      <div className="relative mt-4 flex h-[260px] justify-center overflow-hidden">
        <img
          src="/assets/screen-02.png"
          alt="Shop assisted ordering outfit visual"
          className="h-full w-full object-contain object-center"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[20px] border border-[#DDEBF2] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <img
          src="/assets/screen-02-workflow.png"
          alt="Shopkeeper Assistance workflow"
          className="block w-full object-contain"
        />
      </div>

      <button
        type="button"
        onClick={onContinue}
        className="compact-cta-button mt-5 flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
      >
        Continue
        <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
      </button>
    </PhoneFrame>
  );
}


function BodyScannerStartScreen({
  onBack,
  onOpenScanner,
}: {
  onBack: () => void;
  onOpenScanner: () => void;
}) {
  return (
    <PhoneFrame>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#f1eee8]"
          aria-label="Go back to shop assisted intro"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={1.7} />
        </button>

        <Globe2 className="h-7 w-7 text-[#14213D]" strokeWidth={1.6} />
      </div>

      <BrandHeader />

      <div className="mt-6 text-center">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#15A9D6]">
          Smart Body Scanner
        </p>
        <h2
          className="mt-1 text-[25px] font-semibold leading-[1.15] tracking-wide text-[#14213D]"
          style={{ fontFamily: '"DM Serif Display", serif' }}
        >
          Stand straight and scan
          <br />
          customer measurements
        </h2>
        <p className="mx-auto mt-3 max-w-[305px] text-[12.5px] font-medium leading-5 text-[#667889]">
          Place the customer inside the frame. The next screen will calculate measurements and allow instant manual adjustment.
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-[28px] border border-[#DDEBF2] bg-white p-3 shadow-[0_14px_32px_rgba(6,27,58,0.08)]">
        <div className="relative h-[340px] overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#F6FCFF,#FFF8EF)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_6%,rgba(21,169,214,0.17),transparent_34%)]" />

          <div className="absolute inset-x-8 top-7 bottom-7 rounded-[34px] border border-dashed border-[#15A9D6]/55" />
          <div className="absolute left-7 top-7 h-9 w-9 border-l-2 border-t-2 border-[#15A9D6]" />
          <div className="absolute right-7 top-7 h-9 w-9 border-r-2 border-t-2 border-[#15A9D6]" />
          <div className="absolute bottom-7 left-7 h-9 w-9 border-b-2 border-l-2 border-[#F26A21]" />
          <div className="absolute bottom-7 right-7 h-9 w-9 border-b-2 border-r-2 border-[#F26A21]" />

          <img
            src="/assets/login-screen.png"
            alt="Standing model scanner guide"
            className="relative z-10 mx-auto h-full w-[72%] object-contain object-center"
            loading="eager"
            decoding="async"
            draggable={false}
          />

          <div className="scanner-line absolute left-6 right-6 top-1/2 z-20 h-px bg-[#15A9D6]/80 shadow-[0_0_18px_rgba(21,169,214,0.65)]" />

          <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-[0_8px_18px_rgba(6,27,58,0.08)] backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[#78BE43]" />
            <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#14213D]">Scanner Ready</span>
          </div>

          <div className="absolute bottom-4 left-1/2 z-30 grid w-[86%] -translate-x-1/2 grid-cols-3 gap-2">
            {["Height", "Shoulder", "Sleeve"].map((item) => (
              <div key={item} className="rounded-[13px] bg-white/90 px-2 py-2 text-center shadow-[0_8px_18px_rgba(6,27,58,0.06)] backdrop-blur">
                <p className="text-[7px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">{item}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#14213D]">Detect</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-3 rounded-[18px] bg-[#F6FCFF] px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#15A9D6]" strokeWidth={2} />
            <p className="text-[12px] font-bold text-[#14213D]">Scan guidance</p>
          </div>
          <p className="mt-1 text-[11px] font-medium leading-4 text-[#667889]">
            Customer should stand straight, arms relaxed, full body visible, and feet inside the frame.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenScanner}
        className="compact-cta-button mt-5 flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
      >
        Start Scan
        <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
      </button>
    </PhoneFrame>
  );
}

type ScannerMeasurement = {
  key: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
};

const defaultScannerMeasurements: ScannerMeasurement[] = [
  { key: "height", label: "Height", value: 65, unit: "in", min: 54, max: 76, step: 0.5 },
  { key: "shoulder", label: "Shoulder", value: 14.5, unit: "in", min: 11, max: 20, step: 0.25 },
  { key: "bust", label: "Bust", value: 36, unit: "in", min: 28, max: 52, step: 0.5 },
  { key: "waist", label: "Waist", value: 30, unit: "in", min: 24, max: 48, step: 0.5 },
  { key: "sleeve", label: "Sleeve", value: 21, unit: "in", min: 14, max: 26, step: 0.5 },
  { key: "kameezLength", label: "Kameez Length", value: 42, unit: "in", min: 30, max: 58, step: 0.5 },
  { key: "lowerLength", label: "Lower Length", value: 39, unit: "in", min: 32, max: 46, step: 0.5 },
];


function formatHeightDisplay(value: number) {
  const feet = Math.floor(value / 12);
  const inchesValue = Number((value - feet * 12).toFixed(1));
  const inches = Number.isInteger(inchesValue) ? String(inchesValue) : inchesValue.toFixed(1).replace(/\.0$/, "");
  return `${feet}'${inches}"`;
}

function formatMeasurementValue(value: number, unit: string) {
  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(1).replace(/\.0$/, "");
  return `${formatted} ${unit}`;
}

function MeasurementAdjustRow({
  measurement,
  onChange,
}: {
  measurement: ScannerMeasurement;
  onChange: (key: string, value: number) => void;
}) {
  const decrease = () => {
    onChange(measurement.key, Math.max(measurement.min, Number((measurement.value - measurement.step).toFixed(2))));
  };

  const increase = () => {
    onChange(measurement.key, Math.min(measurement.max, Number((measurement.value + measurement.step).toFixed(2))));
  };

  const handleManualInput = (rawValue: string) => {
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) return;
    onChange(measurement.key, Math.min(measurement.max, Math.max(measurement.min, numericValue)));
  };

  return (
    <div className="rounded-[17px] border border-[#DDEBF2] bg-white px-3 py-3 shadow-[0_8px_18px_rgba(6,27,58,0.045)]">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">{measurement.label}</p>
          <p className="mt-0.5 text-[12px] font-bold text-[#14213D]">{formatMeasurementValue(measurement.value, measurement.unit)}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={decrease}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDEBF2] bg-[#F6FCFF] text-[15px] font-bold text-[#14213D] shadow-none"
            aria-label={`Decrease ${measurement.label}`}
          >
            −
          </button>

          <input
            type="number"
            value={measurement.value}
            min={measurement.min}
            max={measurement.max}
            step={measurement.step}
            onChange={(event) => handleManualInput(event.target.value)}
            className="h-8 w-[58px] rounded-[10px] border border-[#DDEBF2] bg-white text-center text-[12px] font-extrabold text-[#14213D] outline-none focus:border-[#15A9D6]"
            aria-label={`${measurement.label} measurement`}
          />

          <button
            type="button"
            onClick={increase}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-[#DDEBF2] bg-[#F6FCFF] text-[15px] font-bold text-[#14213D] shadow-none"
            aria-label={`Increase ${measurement.label}`}
          >
            +
          </button>
        </div>
      </div>

      <input
        type="range"
        min={measurement.min}
        max={measurement.max}
        step={measurement.step}
        value={measurement.value}
        onChange={(event) => handleManualInput(event.target.value)}
        className="scanner-range mt-3 w-full"
        aria-label={`Adjust ${measurement.label}`}
      />
    </div>
  );
}

function BodyScannerMeasureScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [measurements, setMeasurements] = useState<ScannerMeasurement[]>(defaultScannerMeasurements);
  const [isSaved, setIsSaved] = useState(false);

  const updateMeasurement = (key: string, value: number) => {
    setIsSaved(false);
    setMeasurements((current) =>
      current.map((measurement) =>
        measurement.key === key ? { ...measurement, value: Number(value.toFixed(2)) } : measurement
      )
    );
  };

  const heightMeasurement = measurements.find((measurement) => measurement.key === "height") ?? defaultScannerMeasurements[0];
  const shoulderMeasurement = measurements.find((measurement) => measurement.key === "shoulder") ?? defaultScannerMeasurements[1];
  const sleeveMeasurement = measurements.find((measurement) => measurement.key === "sleeve") ?? defaultScannerMeasurements[4];
  const waistMeasurement = measurements.find((measurement) => measurement.key === "waist") ?? defaultScannerMeasurements[3];

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-14">
      <header className="shrink-0 bg-[#FCFEFF] pb-4">
        <div className="grid grid-cols-[42px_1fr_42px] items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)] transition hover:bg-[#F6FCFF]"
            aria-label="Go back to scanner screen"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <CompactBrandHeader />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-5 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="pt-2 text-center">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#15A9D6]">
            Scan Complete
          </p>
          <h1
            className="mt-1 text-[30px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Review &amp; Adjust Fit
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#667889]">
            Scanner estimates are ready. Adjust any wrong value before selecting fabric.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[26px] border border-[#DDEBF2] bg-white shadow-[0_14px_32px_rgba(6,27,58,0.08)]">
          <div className="relative overflow-hidden bg-[linear-gradient(180deg,#F6FCFF,#FFF8EF)]">
            <div className="relative h-[300px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(242,106,33,0.10),transparent_36%),radial-gradient(circle_at_50%_8%,rgba(21,169,214,0.12),transparent_30%)]" />

              <div className="absolute left-8 right-8 top-7 bottom-6 rounded-[30px] border border-dashed border-[#15A9D6]/45" />
              <div className="absolute left-8 top-7 h-7 w-7 border-l-2 border-t-2 border-[#15A9D6]" />
              <div className="absolute right-8 top-7 h-7 w-7 border-r-2 border-t-2 border-[#15A9D6]" />
              <div className="absolute bottom-6 left-8 h-7 w-7 border-b-2 border-l-2 border-[#F26A21]" />
              <div className="absolute bottom-6 right-8 h-7 w-7 border-b-2 border-r-2 border-[#F26A21]" />

              <img
                src="/assets/login-screen.png"
                alt="Standing model scanned measurements"
                className="relative z-10 mx-auto h-full w-[70%] object-contain object-center"
                loading="eager"
                decoding="async"
                draggable={false}
              />

              <div className="absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-white/92 px-3 py-1.5 shadow-[0_8px_18px_rgba(6,27,58,0.08)] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#78BE43]" />
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#14213D]">Photo Captured</span>
              </div>

              <div className="absolute right-4 top-4 z-30 rounded-full bg-white/94 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#0E7BC1] shadow-[0_8px_18px_rgba(6,27,58,0.08)] backdrop-blur">
                Height {formatHeightDisplay(heightMeasurement.value)}
              </div>

              <div className="scanner-line absolute left-14 right-14 top-1/2 z-20 h-px bg-[#15A9D6]/35" />

              <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#14213D] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_10px_20px_rgba(6,27,58,0.18)]">
                Photo Captured
              </div>
            </div>

            <div className="border-t border-[#E9F4F8] bg-white px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#15A9D6]">
                    Scan Summary
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#667889]">
                    Main measurements captured clearly.
                  </p>
                </div>
                <span className="rounded-full bg-[#EAF8FE] px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#0E7BC1]">
                  Editable
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[15px] border border-[#DDEBF2] bg-[#F6FCFF] px-3 py-3">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Height</p>
                  <p className="mt-1 text-[15px] font-extrabold text-[#14213D]">{formatHeightDisplay(heightMeasurement.value)}</p>
                </div>
                <div className="rounded-[15px] border border-[#DDEBF2] bg-[#F6FCFF] px-3 py-3">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Shoulder</p>
                  <p className="mt-1 text-[15px] font-extrabold text-[#14213D]">{formatMeasurementValue(shoulderMeasurement.value, shoulderMeasurement.unit)}</p>
                </div>
                <div className="rounded-[15px] border border-[#DDEBF2] bg-[#F6FCFF] px-3 py-3">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Sleeve</p>
                  <p className="mt-1 text-[15px] font-extrabold text-[#14213D]">{formatMeasurementValue(sleeveMeasurement.value, sleeveMeasurement.unit)}</p>
                </div>
                <div className="rounded-[15px] border border-[#DDEBF2] bg-[#F6FCFF] px-3 py-3">
                  <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Waist</p>
                  <p className="mt-1 text-[15px] font-extrabold text-[#14213D]">{formatMeasurementValue(waistMeasurement.value, waistMeasurement.unit)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#15A9D6]">Editable Measurements</p>
                <p className="mt-1 text-[11px] font-medium text-[#667889]">Tap + / − or type exact values.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMeasurements(defaultScannerMeasurements);
                  setIsSaved(false);
                }}
                className="rounded-full border border-[#DDEBF2] bg-[#F6FCFF] px-3 py-2 text-[10px] font-bold text-[#14213D] shadow-none"
              >
                Reset
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              {measurements.map((measurement) => (
                <MeasurementAdjustRow
                  key={measurement.key}
                  measurement={measurement}
                  onChange={updateMeasurement}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[18px] border border-[#DDEBF2] bg-white px-4 py-4 shadow-[0_8px_18px_rgba(6,27,58,0.05)]">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#78BE43]" strokeWidth={2.2} />
            <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#15A9D6]">
              Shopkeeper Control
            </p>
          </div>
          <p className="mt-2 text-[12px] font-medium leading-5 text-[#667889]">
            If scanner reads any value incorrectly, shopkeeper can correct it here before the order flow continues.
          </p>
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 border-t border-[#E9F4F8] bg-[#FCFEFF]/95 px-1 pb-5 pt-4 backdrop-blur">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setIsSaved(true)}
            className="flex h-[40px] items-center justify-center rounded-[14px] border border-[#15A9D6]/35 bg-white text-[12px] font-semibold text-[#0E7BC1] shadow-[0_8px_18px_rgba(6,27,58,0.06)]"
          >
            {isSaved ? "Adjusted" : "Save Adjustments"}
          </button>

          <button
            type="button"
            onClick={onContinue}
            className="compact-cta-button flex h-[40px] w-full items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
          >
            Continue
            <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
          </button>
        </div>
      </footer>
    </PhoneFrame>
  );
}


function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative min-w-0 flex-1">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`h-11 w-full appearance-none rounded-[14px] border bg-white px-3 pr-8 text-[11.5px] font-bold outline-none shadow-[0_8px_18px_rgba(6,27,58,0.05)] transition ${
          value === "All"
            ? "border-[#DDEBF2] text-[#14213D]"
            : "border-[#15A9D6] text-[#14213D] ring-2 ring-[#15A9D6]/10"
        }`}
      >
        <option value="All">{label}</option>
        {options
          .filter((option) => option !== "All")
          .map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0E7BC1]"
        strokeWidth={1.8}
      />
    </label>
  );
}

function FabricLibraryScreen({
  selectedFabricName,
  onBack,
  onProceed,
  onSelectFabric,
}: {
  selectedFabricName: string | null;
  onBack: () => void;
  onProceed: (fabricName: string) => void;
  onSelectFabric: (fabricName: string | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [color, setColor] = useState<string>("All");
  const [occasion, setOccasion] = useState<string>("All");

  const filteredFabrics = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return fabrics.filter((fabric) => {
      const matchesSearch =
        !normalizedSearch ||
        fabric.name.toLowerCase().includes(normalizedSearch) ||
        fabric.category.toLowerCase().includes(normalizedSearch) ||
        fabric.color.toLowerCase().includes(normalizedSearch) ||
        fabric.occasion.toLowerCase().includes(normalizedSearch);

      const matchesCategory = category === "All" || fabric.category === category;
      const matchesColor = color === "All" || fabric.color === color;
      const matchesOccasion = occasion === "All" || fabric.occasion === occasion;

      return matchesSearch && matchesCategory && matchesColor && matchesOccasion;
    });
  }, [category, color, occasion, searchQuery]);

  const handleProceed = () => {
    if (!selectedFabricName) return;
    onProceed(selectedFabricName);
  };

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-14">
      <header className="shrink-0 bg-[#FCFEFF] pb-4">
        <div className="grid grid-cols-[42px_1fr_42px] items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)] transition hover:bg-[#F6FCFF]"
            aria-label="Go back to assisted ordering"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <CompactBrandHeader />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-5 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="pt-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#15A9D6]">
            Fabric Library
          </p>
          <h1
            className="mt-1 text-[31px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Choose the Fabric
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#667889]">
            Premium fabrics for women&apos;s custom clothing.
          </p>
        </div>

        <label className="mt-5 flex h-12 items-center gap-3 rounded-[18px] border border-[#DDEBF2] bg-white px-4 shadow-[0_10px_24px_rgba(6,27,58,0.06)]">
          <Search className="h-5 w-5 shrink-0 text-[#94A3AD]" strokeWidth={1.8} />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search fabrics..."
            className="h-full w-full bg-transparent text-[14px] text-[#14213D] outline-none placeholder:text-[#94A3AD]"
          />
        </label>

        <div className="mt-4 flex gap-2">
          <FilterSelect
            label="Category"
            value={category}
            options={categoryOptions}
            onChange={(value) => {
              setCategory(value);
              onSelectFabric(null);
            }}
          />
          <FilterSelect
            label="Color"
            value={color}
            options={colorOptions}
            onChange={(value) => {
              setColor(value);
              onSelectFabric(null);
            }}
          />
          <FilterSelect
            label="Occasion"
            value={occasion}
            options={occasionOptions}
            onChange={(value) => {
              setOccasion(value);
              onSelectFabric(null);
            }}
          />
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          {filteredFabrics.map((fabric) => {
            const isSelected = selectedFabricName === fabric.name;

            return (
              <button
                key={fabric.name}
                type="button"
                onClick={() => onSelectFabric(fabric.name)}
                className={`group overflow-hidden rounded-[18px] border bg-white text-left shadow-[0_10px_24px_rgba(6,27,58,0.07)] transition hover:-translate-y-0.5 ${
                  isSelected ? "border-[#15A9D6] ring-2 ring-[#15A9D6]/20" : "border-[#E2EEF4]"
                }`}
              >
                <div className="relative h-[112px] overflow-hidden rounded-b-[14px] bg-[#F6FCFF]" style={fabric.imageSrc ? undefined : { background: fabric.texture }}>
                  {fabric.imageSrc ? (
                    <SafeAssetImage
                      src={fabric.imageSrc}
                      alt={`${fabric.name} fabric texture`}
                      fallbackLabel={fabric.name}
                      fallbackClassName="h-full rounded-none"
                      className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.46),transparent_46%)]" />
                      <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-black/10 to-transparent" />
                    </>
                  )}
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#15A9D6] text-white shadow-md">
                      <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 px-3 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-[#14213D]">{fabric.name}</p>
                    <p className="mt-0.5 truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[#94A3AD]">
                      PKR {fabric.pricePerYard.toLocaleString()}/yd
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#15A9D6]" strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>

        {filteredFabrics.length === 0 && (
          <div className="mt-8 rounded-[22px] border border-[#DDEBF2] bg-white px-5 py-8 text-center shadow-[0_10px_24px_rgba(6,27,58,0.05)]">
            <p className="text-[15px] font-semibold text-[#14213D]">No fabric found</p>
            <p className="mt-1 text-[12px] leading-5 text-[#667889]">
              Try changing Category, Color, or Occasion to match available custom clothing fabrics.
            </p>
          </div>
        )}
      </section>

      <footer className="sticky bottom-0 shrink-0 border-t border-[#E9F4F8] bg-[#FCFEFF]/95 px-1 pb-5 pt-4 backdrop-blur">
        <button
          type="button"
          disabled={!selectedFabricName}
          onClick={handleProceed}
          className={`compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] text-[13px] font-semibold shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition ${
            selectedFabricName
              ? "bg-[#14213D] text-white hover:scale-[1.01]"
              : "cursor-not-allowed bg-[#DDEBF2] text-[#94A3AD] shadow-none"
          }`}
        >
          Proceed
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#667889]">
          <Lock className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          Secure &amp; Private
        </div>
      </footer>
    </PhoneFrame>
  );
}

function PriceRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className={`text-[13px] ${strong ? "font-bold text-[#14213D]" : "font-medium text-[#667889]"}`}>
        {label}
      </span>
      <span className={`text-right text-[14px] ${strong ? "font-bold text-[#15A9D6]" : "font-semibold text-[#14213D]"}`}>
        {value}
      </span>
    </div>
  );
}

function FabricDetailScreen({
  fabric,
  onBack,
  onContinue,
}: {
  fabric: FabricItem;
  onBack: () => void;
  onContinue: () => void;
}) {
  const fabricTotal = Math.round(fabric.pricePerYard * fabric.recommendedYards);
  const estimatedTotal = fabricTotal + fabric.stitchingFrom;

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-14">
      <header className="shrink-0 bg-[#FCFEFF] pb-4">
        <div className="grid grid-cols-[42px_1fr_42px] items-center">
          <button
            type="button"
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)] transition hover:bg-[#F6FCFF]"
            aria-label="Go back to fabric library"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <CompactBrandHeader />

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDEBF2] bg-white text-[#14213D] shadow-[0_6px_16px_rgba(6,27,58,0.07)]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.7} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-5 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="pt-2">
          <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#15A9D6]">
            Fabric Detail
          </p>
          <h1
            className="mt-1 text-[31px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {fabric.name} Fabric
          </h1>
          <p className="mt-1 text-[13px] leading-5 text-[#667889]">
            Review fabric pricing before moving to templates and style selection.
          </p>
        </div>

        <div className="mt-5 overflow-hidden rounded-[28px] border border-[#DDEBF2] bg-white shadow-[0_14px_32px_rgba(6,27,58,0.08)]">
          <div className="relative h-[225px] overflow-hidden bg-[#F6FCFF]" style={fabric.imageSrc ? undefined : { background: fabric.texture }}>
            {fabric.imageSrc ? (
              <SafeAssetImage
                src={fabric.imageSrc}
                alt={`${fabric.name} fabric texture`}
                fallbackLabel={fabric.name}
                fallbackClassName="h-full rounded-none"
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_12%,rgba(255,255,255,.55),transparent_38%)]" />
            )}
            <div className="absolute bottom-4 left-4 right-4 rounded-[20px] bg-white/88 p-4 shadow-[0_10px_24px_rgba(6,27,58,0.12)] backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#15A9D6]">
                    Selected Fabric
                  </p>
                  <h2 className="mt-1 text-[22px] font-bold text-[#14213D]">{fabric.name}</h2>
                </div>
                <div className="fabric-selected-category-pill rounded-full bg-[#14213D] px-3 py-2 text-[11px] font-bold text-white">
                  {fabric.category}
                </div>
              </div>
            </div>
          </div>

          <div className="px-5 py-5">
            <p className="text-[14px] leading-6 text-[#526172]">{fabric.description}</p>

            <div className="mt-5 rounded-[22px] bg-[#F6FCFF] px-4 py-2">
              <PriceRow label="Fabric price" value={`PKR ${fabric.pricePerYard.toLocaleString()} / yard`} />
              <div className="h-px bg-[#E6EEF3]" />
              <PriceRow label="Recommended quantity" value={`${fabric.recommendedYards} yards`} />
              <div className="h-px bg-[#E6EEF3]" />
              <PriceRow label="Estimated fabric total" value={`PKR ${fabricTotal.toLocaleString()}`} />
              <div className="h-px bg-[#E6EEF3]" />
              <PriceRow label="Custom stitching from" value={`PKR ${fabric.stitchingFrom.toLocaleString()}`} />
              <div className="h-px bg-[#E6EEF3]" />
              <PriceRow label="Estimated order from" value={`PKR ${estimatedTotal.toLocaleString()}`} strong />
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-[24px] border border-[#DDEBF2] bg-white p-5 shadow-[0_10px_24px_rgba(6,27,58,0.05)]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#15A9D6]" strokeWidth={2} />
            <h3 className="text-[16px] font-bold text-[#14213D]">Best for</h3>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {fabric.bestFor.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#15A9D6]/35 bg-[#EAF8FE] px-3 py-2 text-[11px] font-semibold text-[#14213D]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[24px] border border-[#DDEBF2] bg-white p-5 shadow-[0_10px_24px_rgba(6,27,58,0.05)]">
          <h3 className="text-[16px] font-bold text-[#14213D]">Care instructions</h3>
          <p className="mt-2 text-[13px] leading-6 text-[#667889]">{fabric.care}</p>
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 border-t border-[#E9F4F8] bg-[#FCFEFF]/95 px-1 pb-5 pt-4 backdrop-blur">
        <button
          type="button"
          onClick={onContinue}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Continue to Templates
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-[#667889]">
          <Lock className="h-3.5 w-3.5 text-white" strokeWidth={2} />
          Secure &amp; Private
        </div>
      </footer>
    </PhoneFrame>
  );
}


function ImageFallbackBoard({
  label = "Image Placeholder",
  className = "h-full",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden rounded-[13px] border border-dashed border-[#15A9D6]/45 bg-[#F6FCFF]/80 px-2 text-center ${className}`}
    >
      <div>
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#14213D]">Image</p>
        <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.14em] text-[#15A9D6]">Placeholder</p>
        <p className="mt-1 text-[7px] font-semibold uppercase tracking-[0.12em] text-[#748596]">{label}</p>
      </div>
    </div>
  );
}

function getImageCandidates(src?: string, label?: string) {
  if (!src) return [];

  const cleanSrc = src.startsWith("/") ? src : `/${src}`;
  const parts = cleanSrc.split("/").filter(Boolean);
  const fileName = parts.at(-1);
  const parentFolder = parts.at(-2);
  const candidates: string[] = [];

  const addPath = (path?: string) => {
    if (!path) return;
    candidates.push(path);

    // Windows Explorer often hides extensions. If a file is renamed as
    // fabric-cotton.png while extensions are hidden, the real file can become
    // fabric-cotton.png.png. These fallbacks make the frontend load it anyway.
    if (path.toLowerCase().endsWith(".png")) candidates.push(`${path}.png`);
    if (path.toLowerCase().endsWith(".jpg")) candidates.push(`${path}.jpg`);
    if (path.toLowerCase().endsWith(".jpeg")) candidates.push(`${path}.jpeg`);
    if (path.toLowerCase().endsWith(".webp")) candidates.push(`${path}.webp`);
  };

  const addAssetFile = (name?: string) => {
    if (!name) return;
    addPath(`/assets/${name}`);
  };

  const slugify = (value?: string) =>
    (value ?? "")
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const addSlugVariants = (slug?: string) => {
    if (!slug) return;

    const cleanSlug = slug.replace(/\.(png|jpg|jpeg|webp)$/i, "");
    if (!cleanSlug) return;

    const slugSet = new Set<string>([
      cleanSlug,
      cleanSlug.replace(/-hem$/i, ""),
      cleanSlug.replace(/-daman$/i, ""),
      cleanSlug.replace(/chaak/gi, "chak"),
      cleanSlug.replace(/chak/gi, "chaak"),
    ]);

    const prefixes = ["", "hem-", "daman-", "daman-hem-", "daman-chaak-hem-", "hem-style-"];
    const extensions = [".png", ".webp", ".jpg", ".jpeg"];

    slugSet.forEach((item) => {
      if (!item) return;
      prefixes.forEach((prefix) => {
        // Avoid double prefixes but still add every common project naming style.
        const fileBase = item.startsWith(prefix) ? item : `${prefix}${item}`;
        extensions.forEach((extension) => addAssetFile(`${fileBase}${extension}`));
      });
    });
  };

  const addKnownAssetAliases = (optionLabel?: string) => {
    const key = slugify(optionLabel);
    const aliasMap: Record<string, string[]> = {
      "straight-daman": ["daman-straight-daman.png", "hem-straight-daman.png", "straight-daman.png"],
      "rounded-hem": ["daman-rounded-hem.png", "hem-rounded-hem.png", "rounded-hem.png"],
      "high-low-hem": ["daman-high-low-hem.png", "hem-high-low-hem.png", "high-low-hem.png"],
      "side-chaak": ["daman-side-chaak.png", "hem-side-chaak.png", "side-chaak.png", "hem-side-chak.png", "side-chak.png"],
      "double-chaak": ["daman-double-chaak.png", "hem-double-chaak.png", "double-chaak.png", "hem-double-chak.png", "double-chak.png"],
      "front-slit": ["daman-front-slit.png", "hem-front-slit.png", "front-slit.png"],
      "scalloped-hem": ["hem-scalloped-hem.png", "scalloped-hem.png"],
      "asymmetric-hem": ["hem-asymmetric-hem.png", "asymmetric-hem.png"],
      "slim": ["hem-width-slim.png", "slim.png"],
      "standard": ["hem-width-standard.png", "standard.png"],
      "wide": ["hem-width-wide.png", "wide.png"],
    };

    aliasMap[key]?.forEach(addAssetFile);
  };

  // Correct for your current setup:
  // D:\MultiFe\multife-local\public\assets\fabric-cotton.png
  // Browser path: /assets/fabric-cotton.png
  if (fileName) addAssetFile(fileName);
  if (fileName) addSlugVariants(fileName);
  if (label) {
    addKnownAssetAliases(label);
    addSlugVariants(slugify(label));
  }

  // Extra fallbacks for the Daman / Chaak / Hem screen.
  // Some generated image batches were saved as hem-*.png while older code used daman-*.png.
  if (fileName) {
    const extensionMatch = fileName.match(/\.(png|jpg|jpeg|webp)$/i);
    const extension = extensionMatch?.[0] ?? ".png";
    const baseName = fileName.replace(/\.(png|jpg|jpeg|webp)$/i, "");

    if (baseName.startsWith("daman-")) {
      addAssetFile(`hem-${baseName.replace(/^daman-/, "")}${extension}`);
      addAssetFile(`hem-style-${baseName.replace(/^daman-/, "")}${extension}`);
    }

    if (baseName.startsWith("hem-")) {
      addAssetFile(`daman-${baseName.replace(/^hem-/, "")}${extension}`);
      addAssetFile(`daman-hem-${baseName.replace(/^hem-/, "")}${extension}`);
    }

    addAssetFile(`${baseName}.webp`);
    addAssetFile(`${baseName}.jpg`);
    addAssetFile(`${baseName}.jpeg`);
  }

  // Keep original path as fallback, in case assets are later organized in folders.
  addPath(cleanSrc);

  // Folder fallbacks:
  // /assets/fabric/fabric-cotton.png
  // /assets/templates/template-long-kurti.png
  if (parentFolder && fileName) addPath(`/assets/${parentFolder}/${fileName}`);

  // Old nested project fallback:
  // /assets/multife/fabric/fabric-cotton.png
  if (cleanSrc.startsWith("/assets/")) addPath(cleanSrc.replace("/assets/", "/assets/multife/"));

  return Array.from(new Set(candidates));
}

function SafeAssetImage({
  src,
  alt,
  className,
  fallbackLabel,
  fallbackClassName = "h-full",
}: {
  src?: string;
  alt: string;
  className: string;
  fallbackLabel: string;
  fallbackClassName?: string;
}) {
  const candidates = useMemo(() => getImageCandidates(src, fallbackLabel || alt), [src, fallbackLabel, alt]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [src]);

  if (!candidates.length || candidateIndex >= candidates.length) {
    return <ImageFallbackBoard label={fallbackLabel} className={fallbackClassName} />;
  }

  return (
    <img
      src={candidates[candidateIndex]}
      alt=""
      aria-label={alt}
      className={className}
      loading="eager"
      decoding="async"
      draggable={false}
      onError={() => setCandidateIndex((current) => current + 1)}
    />
  );
}

function TemplateImageCard({ template }: { template: DressTemplate }) {
  const imageSrc = templateImageMap[template.name];

  return (
    <div className="template-image-wrap flex h-full w-full items-center justify-center overflow-hidden p-2">
      <SafeAssetImage
        src={imageSrc}
        alt={`${template.name} template`}
        fallbackLabel={template.name}
        fallbackClassName="h-full"
        className="h-full w-full rounded-[13px] object-contain object-center"
      />
    </div>
  );
}

function TemplateLibraryScreen({
  selectedTemplateName,
  onBack,
  onSelectTemplate,
  onContinue,
}: {
  selectedTemplateName: string | null;
  onBack: () => void;
  onSelectTemplate: (templateName: string | null) => void;
  onContinue: (templateName: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState<(typeof templateCategories)[number]>("All");

  const filteredTemplates = useMemo(() => {
    if (activeCategory === "All") return dressTemplates;
    return dressTemplates.filter((template) => template.category === activeCategory);
  }, [activeCategory]);

  const handleContinue = () => {
    if (!selectedTemplateName) return;
    onContinue(selectedTemplateName);
  };

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-14">
      <header className="shrink-0 bg-[#FCFEFF] pb-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Go back to fabric detail"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Change language"
          >
            <Globe2 className="h-6 w-6" strokeWidth={1.55} />
          </button>
        </div>

        <BrandHeader />

        <div className="mt-5 text-center">
          <h1
            className="text-[22px] font-semibold leading-none text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Dress Template Library
          </h1>
          <p className="mt-2 text-[13px] leading-none text-[#31475C]">
            Choose a template to start customizing
          </p>
        </div>

        <div className="mt-5 flex rounded-[16px] border border-[#E2EEF4] bg-white p-1 shadow-[0_8px_18px_rgba(6,27,58,0.05)]">
          {templateCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  onSelectTemplate(null);
                }}
                className={`h-9 flex-1 rounded-[13px] text-[12px] font-semibold transition ${
                  isActive
                    ? "bg-[#14213D] text-white shadow-[0_8px_18px_rgba(6,27,58,0.18)]"
                    : "text-[#14213D] hover:bg-[#F6FCFF]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-5 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="grid grid-cols-3 gap-3 pt-2">
          {filteredTemplates.map((template) => {
            const isSelected = selectedTemplateName === template.name;

            return (
              <button
                key={template.name}
                type="button"
                onClick={() => onSelectTemplate(template.name)}
                className={`overflow-hidden rounded-[16px] border bg-white text-center shadow-[0_8px_18px_rgba(6,27,58,0.06)] transition hover:-translate-y-0.5 ${
                  isSelected ? "border-[#15A9D6] ring-2 ring-[#15A9D6]/20" : "border-[#E2EEF4]"
                }`}
              >
                <div className="h-[118px] border-b border-[#E9F4F8]">
                  <TemplateImageCard template={template} />
                </div>
                <div className="flex h-10 items-center justify-center px-2">
                  <p className="truncate text-[13px] font-semibold text-[#14213D]">{template.name}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-6 pt-3 backdrop-blur">
        <button
          type="button"
          disabled={!selectedTemplateName}
          onClick={handleContinue}
          className={`compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] text-[13px] font-semibold shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition ${
            selectedTemplateName
              ? "bg-[#14213D] text-white hover:scale-[1.01]"
              : "cursor-not-allowed bg-[#14213D] text-white/80"
          }`}
        >
          Select a Template
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>
      </footer>
    </PhoneFrame>
  );
}

function TemplateFeatureCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-h-[55px] flex-col items-center justify-center rounded-[11px] border border-[#DDEBF2] bg-white px-1.5 py-2 text-center shadow-[0_7px_16px_rgba(6,27,58,0.06)]">
      <div className="text-[#14213D]">{icon}</div>
      <p className="mt-1 text-[7px] font-semibold leading-none text-[#667889]">{label}</p>
      <p className="mt-0.5 line-clamp-2 text-[7px] font-bold leading-[1.15] text-[#14213D]">{value}</p>
    </div>
  );
}

function TemplateHeroPreview({
  imageSrc,
  label,
}: {
  imageSrc: string;
  label: string;
}) {
  return (
    <div className="relative mx-auto mt-1 flex h-[410px] w-full items-center justify-center overflow-hidden">
      <div className="absolute left-1/2 top-[45px] h-[274px] w-[274px] -translate-x-1/2 rounded-full bg-[#F6FCFF]" />
      <div className="absolute bottom-[34px] right-[22px] h-[86px] w-[86px] rounded-full bg-[#14213D]" />

      <div className="absolute bottom-[58px] left-[12px] h-[104px] w-[68px] opacity-70">
        <span className="absolute bottom-0 left-[32px] h-[98px] w-px bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-7 left-[32px] h-px w-9 rotate-[-35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-12 left-[32px] h-px w-8 rotate-[35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-16 left-[32px] h-px w-7 rotate-[-35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-20 left-[32px] h-px w-7 rotate-[35deg] bg-[#15A9D6]/35 text-white" />
      </div>

      <div className="absolute bottom-[74px] right-[16px] h-[112px] w-[80px] opacity-70">
        <span className="absolute bottom-0 right-[38px] h-[106px] w-px bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-8 right-[38px] h-px w-10 rotate-[35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-[52px] right-[38px] h-px w-9 rotate-[-35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-[72px] right-[38px] h-px w-8 rotate-[35deg] bg-[#15A9D6]/35 text-white" />
        <span className="absolute bottom-[92px] right-[38px] h-px w-7 rotate-[-35deg] bg-[#15A9D6]/35 text-white" />
      </div>

      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <SafeAssetImage
          src={imageSrc}
          alt={`${label} template preview`}
          fallbackLabel={label}
          fallbackClassName="h-full"
          className="h-full w-full object-contain object-center drop-shadow-[0_18px_28px_rgba(6,27,58,0.12)]"
        />
      </div>
    </div>
  );
}

function TemplatePreviewScreen({
  template,
  fabric,
  onBack,
  onCustomize,
}: {
  template: DressTemplate;
  fabric: FabricItem;
  onBack: () => void;
  onCustomize: () => void;
}) {
  const displayName = template.name === "A-Line Frock" ? "A-Line Embroidered Kurti" : template.name;
  const selectedTemplateImage = templateImageMap[template.name] ?? templatePreviewImage;

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-12">
      <header className="shrink-0 bg-[#FCFEFF] pb-1">
        <div className="grid grid-cols-[38px_1fr_38px] items-start">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Go back to template library"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.8} />
          </button>

          <div className="text-center">
            <div
              className="text-[39px] leading-none tracking-wide text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              MultiFe
            </div>
            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.24em] text-[#526172]">
              WOMEN&apos;S CUSTOM CLOTHING
            </p>
          </div>

          <button
            type="button"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.55} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-3 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <TemplateHeroPreview imageSrc={selectedTemplateImage} label={displayName} />

        <div className="-mt-2 text-center">
          <h1 className="text-[15px] font-semibold leading-5 text-[#14213D]">{displayName}</h1>
          <div className="mt-2 flex items-center justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#14213D]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#E6EEF3]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#E6EEF3]" />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <TemplateFeatureCard
            icon={<Shirt className="h-3.5 w-3.5" strokeWidth={1.8} />}
            label="Fabric"
            value={`${fabric.name}\nPremium`}
          />
          <TemplateFeatureCard
            icon={<Tag className="h-3.5 w-3.5" strokeWidth={1.8} />}
            label="Category"
            value="Casual Wear"
          />
          <TemplateFeatureCard
            icon={<Sparkles className="h-3.5 w-3.5" strokeWidth={1.8} />}
            label="Style Family"
            value={template.name.includes("A-Line") ? "A-Line" : template.category}
          />
          <TemplateFeatureCard
            icon={<span className="block h-3.5 w-3.5 rounded-full border border-[#15A9D6] bg-[#F6FCFF] shadow-[inset_-4px_0_0_#14213D]" />}
            label="Base Color"
            value="Cream & Navy"
          />
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={onCustomize}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[13px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Customize This Template
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          className="compact-cta-button mt-2 flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[13px] border border-[#14213D] bg-white text-[12px] font-semibold text-[#14213D] transition hover:bg-[#F6FCFF]"
        >
          <Heart className="h-4 w-4" strokeWidth={1.8} />
          Save to Favorites
        </button>
      </footer>
    </PhoneFrame>
  );
}


const neckTypeOptions = [
  "Round Neck",
  "V-Neck",
  "Boat Neck",
  "Square Neck",
  "Mandarin Collar",
  "Jewel Neck",
  "Keyhole",
  "Scoop Neck",
] as const;

const neckDepthOptions = ["Shallow", "Standard", "Deep"] as const;

const finishOptions = ["Plain Front", "Embroidered Front", "Closed Back", "Keyhole Back"] as const;

type NeckType = (typeof neckTypeOptions)[number];
type NeckDepth = (typeof neckDepthOptions)[number];
type FinishType = (typeof finishOptions)[number];

const neckImageMap: Record<string, string> = {
  "Shallow": "/assets/neck-depth-shallow.png",
  "Standard": "/assets/neck-depth-standard.png",
  "Deep": "/assets/neck-depth-deep.png",
  "Round Neck": "/assets/neck-round-neck.png",
  "V-Neck": "/assets/neck-v-neck.png",
  "Boat Neck": "/assets/neck-boat-neck.png",
  "Square Neck": "/assets/neck-square-neck.png",
  "Mandarin Collar": "/assets/neck-mandarin-collar.png",
  "Jewel Neck": "/assets/neck-jewel-neck.png",
  "Keyhole": "/assets/neck-keyhole.png",
  "Scoop Neck": "/assets/neck-scoop-neck.png",
  "Plain Front": "/assets/finish-plain-front.png",
  "Embroidered Front": "/assets/finish-embroidered-front.png",
  "Closed Back": "/assets/finish-closed-back.png",
  "Keyhole Back": "/assets/finish-keyhole-back.png",
};

function NeckImagePlaceholder({
  label,
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  const safeLabel = label ?? "Neck option";
  const imageSrc = label ? neckImageMap[label] : undefined;
  const imageHeightClass = compact ? "h-[40px]" : "h-[54px]";

  if (imageSrc) {
    return (
      <div
        className={`flex w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#DDEBF2] bg-[#FCFEFF] ${imageHeightClass}`}
      >
        <SafeAssetImage
          src={imageSrc}
          alt={`${safeLabel} neckline`}
          fallbackLabel={safeLabel}
          fallbackClassName={imageHeightClass}
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center justify-center overflow-hidden rounded-[9px] border border-dashed border-[#15A9D6]/45 bg-[#F6FCFF]/80 px-1 text-center ${imageHeightClass}`}
    >
      <div className="leading-none">
        <p className="text-[7px] font-bold uppercase tracking-[0.18em] text-[#14213D]">Image</p>
        <p className="mt-1 text-[6px] font-bold uppercase tracking-[0.14em] text-[#15A9D6]">Placeholder</p>
      </div>
    </div>
  );
}

function NeckOptionCard({
  label,
  selected,
  onClick,
}: {
  key?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-w-0 overflow-hidden rounded-[12px] border bg-white px-[6px] pb-[8px] pt-[6px] text-center shadow-[0_7px_16px_rgba(6,27,58,0.055)] transition hover:-translate-y-0.5 ${
        selected ? "border-[#15A9D6] ring-1 ring-[#15A9D6]/25" : "border-[#DDEBF2]"
      }`}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#15A9D6] text-white shadow-sm">
          <Check className="h-[9px] w-[9px]" strokeWidth={2.7} />
        </span>
      )}
      <NeckImagePlaceholder label={label} />
      <p className="mt-2 truncate text-[8px] font-semibold leading-none text-[#14213D]">{label}</p>
    </button>
  );
}

function NeckDepthCard({
  label,
  selected,
  onClick,
}: {
  key?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  const imageSrc = neckImageMap[label];
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-w-0 overflow-hidden rounded-[12px] border bg-white px-[8px] pb-[8px] pt-[8px] text-center shadow-[0_6px_14px_rgba(6,27,58,0.05)] transition hover:-translate-y-0.5 ${
        selected ? "border-[#15A9D6] ring-1 ring-[#15A9D6]/25" : "border-[#DDEBF2]"
      }`}
    >
      {selected && (
        <span className="absolute right-1.5 top-1.5 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#15A9D6] text-white shadow-sm">
          <Check className="h-[9px] w-[9px]" strokeWidth={2.7} />
        </span>
      )}
      <div className="flex h-[42px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#DDEBF2] bg-[#FCFEFF]">
        <SafeAssetImage
          src={imageSrc}
          alt={`${label} neck depth`}
          fallbackLabel={label}
          fallbackClassName="h-[42px]"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <p className="mt-2 truncate text-[8.5px] font-semibold leading-none text-[#14213D]">{label}</p>
    </button>
  );
}
function NeckSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <h2 className="shrink-0 text-[12px] font-bold text-[#14213D]">{children}</h2>
      <span className="h-px flex-1 bg-[#15A9D6]/60 text-white" />
    </div>
  );
}

function NeckCustomizationScreen({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const [selectedNeck, setSelectedNeck] = useState<NeckType>("Round Neck");
  const [selectedDepth, setSelectedDepth] = useState<NeckDepth>("Standard");
  const [selectedFinish, setSelectedFinish] = useState<FinishType>("Closed Back");

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-5 pb-0 pt-10">
      <header className="shrink-0 bg-[#FCFEFF] pb-3">
        <div className="grid grid-cols-[34px_1fr_34px] items-start">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 flex h-8 w-8 flex-col items-center justify-center gap-[3px] rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Go back"
          >
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
          </button>

          <div className="text-center">
            <div
              className="text-[40px] leading-none tracking-wide text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              MultiFe
            </div>
            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.24em] text-[#526172]">
              WOMEN&apos;S CUSTOM CLOTHING
            </p>
          </div>

          <button
            type="button"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.55} />
          </button>
        </div>

        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#15A9D6] text-white" />
            <h1
              className="text-[18px] font-semibold leading-none text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Neck Customization
            </h1>
            <span className="h-px w-8 bg-[#15A9D6] text-white" />
          </div>
          <p className="mt-2 text-[11px] leading-none text-[#31475C]">
            Choose the neckline style for your outfit.
          </p>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pr-1 pt-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="space-y-5 pb-4">
          <div className="grid grid-cols-4 gap-x-2.5 gap-y-3">
            {neckTypeOptions.map((option) => (
              <NeckOptionCard
                key={option}
                label={option}
                selected={selectedNeck === option}
                onClick={() => setSelectedNeck(option)}
              />
            ))}
          </div>

          <div>
            <NeckSectionTitle>Neck Depth</NeckSectionTitle>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {neckDepthOptions.map((option) => (
                <NeckDepthCard
                  key={option}
                  label={option}
                  selected={selectedDepth === option}
                  onClick={() => setSelectedDepth(option)}
                />
              ))}
            </div>
          </div>

          <div>
            <NeckSectionTitle>Front / Back Finish</NeckSectionTitle>
            <div className="mt-3 grid grid-cols-4 gap-x-2.5 gap-y-3">
              {finishOptions.map((option) => (
                <NeckOptionCard
                  key={option}
                  label={option}
                  selected={selectedFinish === option}
                  onClick={() => setSelectedFinish(option)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            saveStoredCustomizationSelections({
              neckType: selectedNeck,
              neckDepth: selectedDepth,
              neckFinish: selectedFinish,
            });
            onSave();
          }}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Save Neck Selection
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 flex h-7 w-full items-center justify-center gap-1 text-[11px] font-semibold text-[#14213D] transition hover:text-[#15A9D6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}


const shoulderStyleOptions = [
  "Standard Shoulder",
  "Relaxed Shoulder",
  "Structured Shoulder",
  "Dropped Shoulder",
] as const;

const shoulderWidthOptions = ["Narrow", "Standard", "Broad"] as const;

const armholeShapeOptions = ["Standard", "Comfort Fit", "Tailored", "Deep Armhole"] as const;

type ShoulderStyle = (typeof shoulderStyleOptions)[number];
type ShoulderWidth = (typeof shoulderWidthOptions)[number];
type ArmholeShape = (typeof armholeShapeOptions)[number];

const shoulderHeroImage = "/assets/shoulder-armhole-preview.png";

const shoulderStyleImageMap: Record<ShoulderStyle, string> = {
  "Standard Shoulder": "/assets/shoulder-style-standard-shoulder.png",
  "Relaxed Shoulder": "/assets/shoulder-style-relaxed-shoulder.png",
  "Structured Shoulder": "/assets/shoulder-style-structured-shoulder.png",
  "Dropped Shoulder": "/assets/shoulder-style-dropped-shoulder.png",
};

const shoulderWidthImageMap: Record<ShoulderWidth, string> = {
  "Narrow": "/assets/shoulder-width-narrow.png",
  "Standard": "/assets/shoulder-width-standard.png",
  "Broad": "/assets/shoulder-width-broad.png",
};

const armholeShapeImageMap: Record<ArmholeShape, string> = {
  "Standard": "/assets/armhole-shape-standard.png",
  "Comfort Fit": "/assets/armhole-shape-comfort-fit.png",
  "Tailored": "/assets/armhole-shape-tailored.png",
  "Deep Armhole": "/assets/armhole-shape-deep-armhole.png",
};

function ShoulderHeroBoard() {
  return (
    <div className="relative flex h-[165px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#DDEBF2] bg-[#F6FCFF] shadow-[0_10px_22px_rgba(6,27,58,0.06)]">
      <SafeAssetImage
        src={shoulderHeroImage}
        alt="Shoulder and armhole preview"
        fallbackLabel="Shoulder Armhole"
        fallbackClassName="h-full"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function ShoulderOptionBoard({ label, imageSrc }: { label: string; imageSrc?: string }) {

  if (imageSrc) {
    return (
      <div className="flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#E2EEF4] bg-[#FCFEFF]">
        <SafeAssetImage
          src={imageSrc}
          alt={`${label} option`}
          fallbackLabel={label}
          fallbackClassName="h-[54px]"
          className="h-full w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[54px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#E2EEF4] bg-[#FCFEFF]">
      <span className="absolute top-[10px] h-px w-8 rounded-full bg-[#14213D]/35" />
      <span className="absolute left-[28%] top-[15px] h-[30px] w-px rotate-[9deg] rounded-full bg-[#14213D]/30" />
      <span className="absolute right-[28%] top-[15px] h-[30px] w-px rotate-[-9deg] rounded-full bg-[#14213D]/30" />
      <span className="absolute bottom-[9px] h-px w-10 rounded-full bg-[#15A9D6]/45 text-white" />
      <span className="absolute bottom-[18px] h-[17px] w-px rounded-full bg-[#14213D]/20" />
    </div>
  );
}

function ShoulderOptionCard({
  label,
  selected,
  onClick,
  imageSrc,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  imageSrc?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative min-w-0 overflow-hidden rounded-[13px] border bg-white p-[6px] text-center shadow-[0_6px_14px_rgba(6,27,58,0.05)] transition hover:-translate-y-0.5",
        selected ? "border-[#15A9D6] ring-1 ring-[#15A9D6]/25" : "border-[#DDEBF2]",
      ].join(" ")}
    >
      {selected && (
        <span className="absolute right-1 top-1 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#15A9D6] text-[9px] font-bold text-white">
          ✓
        </span>
      )}
      <ShoulderOptionBoard label={label} imageSrc={imageSrc} />
      <p className="option-label mt-1.5 text-[9px] font-semibold text-[#14213D]">{label}</p>
    </button>
  );
}

function ShoulderSectionTitle({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-1.5">
      <span className="text-[10px] font-bold text-[#667889]">{number}.</span>
      <h2 className="shrink-0 text-[11.5px] font-extrabold tracking-[-0.01em] text-[#14213D]">{children}</h2>
      <span className="h-px flex-1 bg-[#15A9D6]/60 text-white" />
    </div>
  );
}

function ShoulderNote() {
  return (
    <div className="mt-3 flex items-start gap-2 rounded-[12px] border border-[#15A9D6]/30 bg-[#EEF9FF] px-3 py-2">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[#15A9D6] text-[9px] font-bold text-[#15A9D6]">
        i
      </span>
      <p className="text-[9px] font-semibold leading-4 text-[#667889]">
        These settings help customize the fit and comfort around your shoulders and armholes.
      </p>
    </div>
  );
}

function ShoulderArmholeScreen({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState<ShoulderStyle>("Standard Shoulder");
  const [selectedWidth, setSelectedWidth] = useState<ShoulderWidth>("Standard");
  const [selectedArmhole, setSelectedArmhole] = useState<ArmholeShape>("Comfort Fit");

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-5 pb-0 pt-12">
      <header className="shrink-0 bg-[#FCFEFF] pb-2">
        <div className="grid grid-cols-[34px_1fr_34px] items-start">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 flex h-8 w-8 flex-col items-center justify-center gap-[3px] rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Go back"
          >
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
          </button>

          <div className="text-center">
            <div
              className="text-[40px] leading-none tracking-wide text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              MultiFe
            </div>
            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.24em] text-[#526172]">
              WOMEN&apos;S CUSTOM CLOTHING
            </p>
          </div>

          <button
            type="button"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.55} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="mt-1 grid grid-cols-[1fr_132px] items-center gap-3">
          <div>
            <h1
              className="text-[19px] font-semibold leading-tight text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Shoulder &amp;
              <br />
              Armhole
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px w-8 bg-[#15A9D6] text-white" />
              <span className="text-[13px] text-[#15A9D6]">✦</span>
              <span className="h-px w-8 bg-[#15A9D6] text-white" />
            </div>
            <p className="mt-2 text-[10px] font-semibold leading-4 text-[#526172]">
              Adjust shoulder shape and armhole comfort.
            </p>
          </div>
          <ShoulderHeroBoard />
        </div>

        <ShoulderSectionTitle number="1">Shoulder Style</ShoulderSectionTitle>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {shoulderStyleOptions.map((option) => (
            <ShoulderOptionCard
              key={option}
              label={option}
              imageSrc={shoulderStyleImageMap[option]}
              selected={selectedStyle === option}
              onClick={() => setSelectedStyle(option)}
            />
          ))}
        </div>

        <ShoulderSectionTitle number="2">Shoulder Width</ShoulderSectionTitle>
        <div className="mt-2 grid grid-cols-3 gap-2 px-2">
          {shoulderWidthOptions.map((option) => (
            <ShoulderOptionCard
              key={option}
              label={option}
              imageSrc={shoulderWidthImageMap[option]}
              selected={selectedWidth === option}
              onClick={() => setSelectedWidth(option)}
            />
          ))}
        </div>

        <ShoulderSectionTitle number="3">Armhole Shape</ShoulderSectionTitle>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {armholeShapeOptions.map((option) => (
            <ShoulderOptionCard
              key={option}
              label={option}
              imageSrc={armholeShapeImageMap[option]}
              selected={selectedArmhole === option}
              onClick={() => setSelectedArmhole(option)}
            />
          ))}
        </div>

        <ShoulderNote />
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            saveStoredCustomizationSelections({
              shoulderStyle: selectedStyle,
              shoulderWidth: selectedWidth,
              armholeShape: selectedArmhole,
            });
            onSave();
          }}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Save Shoulder Settings
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 flex h-7 w-full items-center justify-center gap-1 text-[11px] font-semibold text-[#14213D] transition hover:text-[#15A9D6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}


const upperArmFitOptions = [
  "Slim Fit",
  "Regular Fit",
  "Comfort Fit",
  "Relaxed Fit",
  "Gathered Upper Arm",
  "Pleated Upper Arm",
] as const;

const sleeveVolumeOptions = ["Minimal", "Moderate", "Full"] as const;

const decorativeStyleOptions = ["Plain", "Piping", "Embroidered", "Panel Detail"] as const;

type UpperArmFit = (typeof upperArmFitOptions)[number];
type SleeveVolume = (typeof sleeveVolumeOptions)[number];
type DecorativeStyle = (typeof decorativeStyleOptions)[number];

const upperArmFitImageMap: Record<UpperArmFit, string> = {
  "Slim Fit": "/assets/upper-arm-fit-slim-fit.png",
  "Regular Fit": "/assets/upper-arm-fit-regular-fit.png",
  "Comfort Fit": "/assets/upper-arm-fit-comfort-fit.png",
  "Relaxed Fit": "/assets/upper-arm-fit-relaxed-fit.png",
  "Gathered Upper Arm": "/assets/upper-arm-fit-gathered-upper-arm.png",
  "Pleated Upper Arm": "/assets/upper-arm-fit-pleated-upper-arm.png",
};

const sleeveVolumeImageMap: Record<SleeveVolume, string> = {
  Minimal: "/assets/sleeve-volume-minimal.png",
  Moderate: "/assets/sleeve-volume-moderate.png",
  Full: "/assets/sleeve-volume-full.png",
};

const decorativeStyleImageMap: Record<DecorativeStyle, string> = {
  Plain: "/assets/decorative-style-plain.png",
  Piping: "/assets/decorative-style-piping.png",
  Embroidered: "/assets/decorative-style-embroidered.png",
  "Panel Detail": "/assets/decorative-style-panel-detail.png",
};

function UpperArmHeroBoard() {
  return (
    <div className="relative flex h-[158px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#DDEBF2] bg-[#F6FCFF] shadow-[0_10px_22px_rgba(6,27,58,0.06)]">
      <SafeAssetImage
        src="/assets/upper-arm-preview.png"
        alt="Upper arm customization preview"
        fallbackLabel="Upper Arm Preview"
        fallbackClassName="h-[158px]"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function UpperArmOptionBoard({
  label,
  imageSrc,
}: {
  label: string;
  imageSrc?: string;
}) {
  return (
    <div className="relative flex h-[52px] w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#E2EEF4] bg-[#FCFEFF]">
      <SafeAssetImage
        src={imageSrc}
        alt={`${label} option image`}
        fallbackLabel={label}
        fallbackClassName="h-[52px]"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

function UpperArmOptionCard({
  label,
  imageSrc,
  selected,
  onClick,
}: {
  label: string;
  imageSrc?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative min-w-0 overflow-hidden rounded-[13px] border bg-white p-[6px] text-center shadow-[0_6px_14px_rgba(6,27,58,0.05)] transition hover:-translate-y-0.5",
        selected ? "border-[#15A9D6] ring-1 ring-[#15A9D6]/25" : "border-[#DDEBF2]",
      ].join(" ")}
    >
      {selected && (
        <span className="absolute right-1 top-1 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#15A9D6] text-[9px] font-bold text-white">
          ✓
        </span>
      )}
      <UpperArmOptionBoard label={label} imageSrc={imageSrc} />
      <p className="option-label mt-1.5 text-[9px] font-semibold text-[#14213D]">{label}</p>
    </button>
  );
}

function UpperArmSectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <h2 className="shrink-0 text-[11.5px] font-extrabold tracking-[-0.01em] text-[#14213D]">{children}</h2>
      <span className="h-px flex-1 bg-[#15A9D6]/60 text-white" />
    </div>
  );
}

function UpperArmCustomizationScreen({
  onBack,
  onSave,
}: {
  onBack: () => void;
  onSave: () => void;
}) {
  const [selectedFit, setSelectedFit] = useState<UpperArmFit>("Regular Fit");
  const [selectedVolume, setSelectedVolume] = useState<SleeveVolume>("Moderate");
  const [selectedDecorative, setSelectedDecorative] = useState<DecorativeStyle>("Plain");

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-5 pb-0 pt-12">
      <header className="shrink-0 bg-[#FCFEFF] pb-2">
        <div className="grid grid-cols-[34px_1fr_34px] items-start">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 flex h-8 w-8 flex-col items-center justify-center gap-[3px] rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Go back"
          >
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
            <span className="h-px w-4 rounded-full bg-[#14213D]" />
          </button>

          <div className="text-center">
            <div
              className="text-[40px] leading-none tracking-wide text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              MultiFe
            </div>
            <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.24em] text-[#526172]">
              WOMEN&apos;S CUSTOM CLOTHING
            </p>
          </div>

          <button
            type="button"
            className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
            aria-label="Change language"
          >
            <Globe2 className="h-5 w-5" strokeWidth={1.55} />
          </button>
        </div>
      </header>

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="mt-1 grid grid-cols-[1fr_132px] items-center gap-3">
          <div>
            <h1
              className="text-[19px] font-semibold leading-tight text-[#14213D]"
              style={{ fontFamily: '"DM Serif Display", serif' }}
            >
              Upper Arm
              <br />
              Customization
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px w-8 bg-[#15A9D6] text-white" />
              <span className="text-[13px] text-[#15A9D6]">✦</span>
              <span className="h-px w-8 bg-[#15A9D6] text-white" />
            </div>
            <p className="mt-2 text-[10px] font-semibold leading-4 text-[#526172]">
              Choose the upper sleeve fit and shape.
            </p>
          </div>
          <UpperArmHeroBoard />
        </div>

        <UpperArmSectionTitle>Upper Arm Fit</UpperArmSectionTitle>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {upperArmFitOptions.map((option) => (
            <UpperArmOptionCard
              key={option}
              label={option}
              imageSrc={upperArmFitImageMap[option]}
              selected={selectedFit === option}
              onClick={() => setSelectedFit(option)}
            />
          ))}
        </div>

        <UpperArmSectionTitle>Sleeve Volume</UpperArmSectionTitle>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {sleeveVolumeOptions.map((option) => (
            <UpperArmOptionCard
              key={option}
              label={option}
              imageSrc={sleeveVolumeImageMap[option]}
              selected={selectedVolume === option}
              onClick={() => setSelectedVolume(option)}
            />
          ))}
        </div>

        <UpperArmSectionTitle>Decorative Style</UpperArmSectionTitle>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {decorativeStyleOptions.map((option) => (
            <UpperArmOptionCard
              key={option}
              label={option}
              imageSrc={decorativeStyleImageMap[option]}
              selected={selectedDecorative === option}
              onClick={() => setSelectedDecorative(option)}
            />
          ))}
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            saveStoredCustomizationSelections({
              upperArmFit: selectedFit,
              sleeveVolume: selectedVolume,
              decorativeStyle: selectedDecorative,
            });
            onSave();
          }}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Save Upper Arm Settings
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 flex h-7 w-full items-center justify-center gap-1 text-[11px] font-semibold text-[#14213D] transition hover:text-[#15A9D6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}


type CustomizationGroupConfig = {
  id: string;
  title: string;
  options: readonly string[];
  columns?: 2 | 3 | 4 | 5 | 6;
  initial?: string;
  compact?: boolean;
  imageMap?: Record<string, string>;
  imageFit?: "cover" | "contain";
  imagePositionClass?: string;
  imageHeightClass?: string;
  responsive?: boolean;
  cardMinWidth?: number;
};

function gridColumnsClass(columns: 2 | 3 | 4 | 5 | 6 = 3) {
  if (columns === 2) return "grid-cols-2";
  if (columns === 4) return "grid-cols-4";
  if (columns === 5) return "grid-cols-5";
  if (columns === 6) return "grid-cols-6";
  return "grid-cols-3";
}

function CustomizationAppBar({ onBack }: { onBack: () => void }) {
  return (
    <header className="shrink-0 bg-[#FCFEFF] pb-2">
      <div className="grid grid-cols-[34px_1fr_34px] items-start">
        <button
          type="button"
          onClick={onBack}
          className="mt-1 flex h-8 w-8 flex-col items-center justify-center gap-[3px] rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
          aria-label="Go back"
        >
          <span className="h-px w-4 rounded-full bg-[#14213D]" />
          <span className="h-px w-4 rounded-full bg-[#14213D]" />
          <span className="h-px w-4 rounded-full bg-[#14213D]" />
        </button>

        <div className="text-center">
          <div
            className="text-[40px] leading-none tracking-wide text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            MultiFe
          </div>
          <p className="mt-1 text-[7px] font-bold uppercase tracking-[0.24em] text-[#526172]">
            WOMEN&apos;S CUSTOM CLOTHING
          </p>
        </div>

        <button
          type="button"
          className="mt-1 flex h-8 w-8 items-center justify-center rounded-full text-[#14213D] transition hover:bg-[#F6FCFF]"
          aria-label="Change language"
        >
          <Globe2 className="h-5 w-5" strokeWidth={1.55} />
        </button>
      </div>
    </header>
  );
}

function DecorativeTitleLine() {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="h-px w-10 bg-[#15A9D6] text-white" />
      <span className="text-[12px] text-[#15A9D6]">✧</span>
      <span className="h-px w-10 bg-[#15A9D6] text-white" />
    </div>
  );
}

function LargeImagePlaceholder({
  label = "Image Placeholder",
  imageSrc,
}: {
  label?: string;
  imageSrc?: string;
}) {
  return (
    <div className="relative flex h-[158px] w-[132px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border border-[#DDEBF2] bg-[#F6FCFF] shadow-[0_10px_22px_rgba(6,27,58,0.06)]">
      {imageSrc ? (
        <SafeAssetImage
          src={imageSrc}
          alt={label}
          fallbackLabel={label}
          fallbackClassName="h-[158px]"
          className="h-full w-full object-cover object-center"
        />
      ) : (
        <>
          <div className="absolute inset-3 rounded-[14px] border border-dashed border-[#15A9D6]/45 bg-white/70" />
          <span className="absolute left-5 top-6 h-px w-20 rounded-full bg-[#14213D]/25" />
          <span className="absolute left-[43px] top-10 h-20 w-px rotate-[8deg] rounded-full bg-[#14213D]/22" />
          <span className="absolute right-[43px] top-10 h-20 w-px rotate-[-8deg] rounded-full bg-[#14213D]/22" />
          <span className="absolute bottom-10 h-px w-16 rounded-full bg-[#15A9D6]/45 text-white" />
          <p className="relative mt-20 px-4 text-center text-[7px] font-bold uppercase tracking-[0.13em] text-[#748596]">
            {label}
          </p>
        </>
      )}
    </div>
  );
}

function SmallImagePlaceholder({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={[
        "relative flex w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#E2EEF4] bg-[#FCFEFF]",
        compact ? "h-[46px]" : "h-[82px]",
      ].join(" ")}
    >
      <span className="absolute top-[10px] h-px w-9 rounded-full bg-[#14213D]/28" />
      <span className="absolute left-[28%] top-[15px] h-[29px] w-px rotate-[8deg] rounded-full bg-[#14213D]/24" />
      <span className="absolute right-[28%] top-[15px] h-[29px] w-px rotate-[-8deg] rounded-full bg-[#14213D]/24" />
      <span className="absolute bottom-[9px] h-px w-10 rounded-full bg-[#15A9D6]/42 text-white" />
      <span className="absolute bottom-[18px] h-[16px] w-px rounded-full bg-[#14213D]/15" />
      <span className="relative mt-7 text-[5px] font-bold uppercase tracking-[0.12em] text-[#94A3AD]">Image</span>
    </div>
  );
}

function GenericOptionCard({
  label,
  selected,
  onClick,
  compact = false,
  imageSrc,
  imageFit = "cover",
  imagePositionClass = "object-center",
  imageHeightClass,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  compact?: boolean;
  imageSrc?: string;
  imageFit?: "cover" | "contain";
  imagePositionClass?: string;
  imageHeightClass?: string;
}) {
  const optionImageHeight = imageHeightClass ?? (compact ? "h-[46px]" : "h-[82px]");
  const optionImageClass = imageFit === "contain"
    ? `h-full w-full object-contain ${imagePositionClass}`
    : `h-full w-full object-cover ${imagePositionClass}`;
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative min-w-0 overflow-hidden rounded-[13px] border bg-white p-[6px] text-center shadow-[0_6px_14px_rgba(6,27,58,0.05)] transition hover:-translate-y-0.5",
        selected ? "border-[#15A9D6] ring-1 ring-[#15A9D6]/25" : "border-[#DDEBF2]",
      ].join(" ")}
    >
      {selected && (
        <span className="absolute right-1 top-1 z-10 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#15A9D6] text-[9px] font-bold text-white">
          ✓
        </span>
      )}
      {imageSrc ? (
        <div
          className={[
            "relative flex w-full items-center justify-center overflow-hidden rounded-[9px] border border-[#E2EEF4] bg-[#FCFEFF]",
            optionImageHeight,
          ].join(" ")}
        >
          <SafeAssetImage
            src={imageSrc}
            alt={`${label} option image`}
            fallbackLabel={label}
            fallbackClassName={optionImageHeight}
            className={optionImageClass}
          />
        </div>
      ) : (
        <SmallImagePlaceholder compact={compact} />
      )}
      <p className="option-label mt-1.5 text-[9px] font-semibold text-[#14213D]">{label}</p>
    </button>
  );
}

function GenericSectionTitle({ children, index }: { children: ReactNode; index?: number }) {
  return (
    <div className="mt-3 flex items-center gap-2">
      <h2 className="shrink-0 text-[11.5px] font-extrabold tracking-[-0.01em] text-[#14213D]">
        {index ? `${index}. ` : ""}
        {children}
      </h2>
      <span className="h-px flex-1 bg-[#15A9D6]/60 text-white" />
    </div>
  );
}

function CustomizationGroup({
  group,
  selected,
  onSelect,
  index,
}: {
  group: CustomizationGroupConfig;
  selected: string;
  onSelect: (value: string) => void;
  index?: number;
}) {
  return (
    <div>
      <GenericSectionTitle index={index}>{group.title}</GenericSectionTitle>
      <div
        className={`mt-2 grid gap-2 ${group.responsive ? "" : gridColumnsClass(group.columns)}`}
        style={
          group.responsive
            ? { gridTemplateColumns: `repeat(auto-fit, minmax(${group.cardMinWidth ?? 82}px, 1fr))` }
            : undefined
        }
      >
        {group.options.map((option) => (
          <GenericOptionCard
            key={option}
            label={option}
            selected={selected === option}
            compact={group.compact}
            imageSrc={group.imageMap?.[option]}
            imageFit={group.imageFit}
            imagePositionClass={group.imagePositionClass}
            imageHeightClass={group.imageHeightClass}
            onClick={() => onSelect(option)}
          />
        ))}
      </div>
    </div>
  );
}

function CustomizationFlowScreen({
  title,
  subtitle,
  groups,
  onBack,
  onSave,
  buttonText,
  hero = false,
  heroImageSrc,
  heroLabel = "Image Placeholder",
  infoText,
}: {
  title: string;
  subtitle: string;
  groups: readonly CustomizationGroupConfig[];
  onBack: () => void;
  onSave: () => void;
  buttonText: string;
  hero?: boolean;
  heroImageSrc?: string;
  heroLabel?: string;
  infoText?: string;
}) {
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const storedSelections = getStoredCustomizationSelections();
    const entries = groups.map((group) => [group.id, storedSelections[group.id] ?? group.initial ?? group.options[0]]);
    return Object.fromEntries(entries);
  });

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-12">
      <CustomizationAppBar onBack={onBack} />

      <section
        className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="mt-3 text-center">
          <h1
            className="text-[24px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            {title}
          </h1>

          <div className="mt-2 flex items-center justify-center gap-3 text-[#15A9D6]">
            <span className="h-px w-10 bg-[#15A9D6]/70 text-white" />
            <span className="text-[13px] leading-none">✦</span>
            <span className="h-px w-10 bg-[#15A9D6]/70 text-white" />
          </div>

          <p className="mt-2 text-[12px] font-medium leading-4 text-[#526172]">{subtitle}</p>
        </div>

        <div className="mt-4 space-y-4">
          {groups.map((group, index) => (
            <CustomizationGroup
              key={group.id}
              group={group}
              selected={selected[group.id]}
              index={groups.length > 1 ? index + 1 : undefined}
              onSelect={(value) => setSelected((current) => ({ ...current, [group.id]: value }))}
            />
          ))}
        </div>

        {infoText && (
          <div className="mt-3 rounded-[13px] border border-[#15A9D6]/35 bg-[#EAF8FE] px-3 py-3 text-[9px] font-semibold leading-4 text-[#526172]">
            {infoText}
          </div>
        )}
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={() => {
            saveStoredCustomizationSelections(selected);
            onSave();
          }}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[14px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          {buttonText}
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 flex h-7 w-full items-center justify-center gap-1 text-[12px] font-semibold text-[#14213D] transition hover:text-[#15A9D6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}


const forearmShapeImageMap: Record<string, string> = {
  "Narrow Forearm": "/assets/forearm-shape-narrow-forearm.png",
  "Straight Forearm": "/assets/forearm-shape-straight-forearm.png",
  "Regular Forearm": "/assets/forearm-shape-regular-forearm.png",
  "Tapered Forearm": "/assets/forearm-shape-tapered-forearm.png",
  "Loose Forearm": "/assets/forearm-shape-loose-forearm.png",
  "Gathered Forearm": "/assets/forearm-shape-gathered-forearm.png",
};

const forearmDetailImageMap: Record<string, string> = {
  Plain: "/assets/forearm-detail-plain.png",
  "Button Tab": "/assets/forearm-detail-button-tab.png",
  "Slit Opening": "/assets/forearm-detail-slit-opening.png",
  "Embroidered Panel": "/assets/forearm-detail-embroidered-panel.png",
};

function ForearmCustomizationScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Forearm Customization"
      subtitle="Refine the lower sleeve shape and fit."
      buttonText="Save Forearm Settings"
      hero
      heroImageSrc="/assets/forearm-preview.png"
      heroLabel="Forearm Preview"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "forearmShape",
          title: "Forearm Shape",
          columns: 3,
          initial: "Regular Forearm",
          options: ["Narrow Forearm", "Straight Forearm", "Regular Forearm", "Tapered Forearm", "Loose Forearm", "Gathered Forearm"],
          imageMap: forearmShapeImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[92px]",
        },
        {
          id: "forearmDetail",
          title: "Forearm Detail",
          columns: 4,
          initial: "Plain",
          options: ["Plain", "Button Tab", "Slit Opening", "Embroidered Panel"],
          imageMap: forearmDetailImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[82px]",
        },
      ]}
    />
  );
}

const cuffStyleImageMap: Record<string, string> = {
  "Plain Hem": "/assets/cuff-style-plain-hem.png",
  "Narrow Cuff": "/assets/cuff-style-narrow-cuff.png",
  "Button Cuff": "/assets/cuff-style-button-cuff.png",
  "Embroidered Cuff": "/assets/cuff-style-embroidered-cuff.png",
  "Lace Trim Cuff": "/assets/cuff-style-lace-trim-cuff.png",
  "Scallop Edge": "/assets/cuff-style-scallop-edge.png",
  "Frill Cuff": "/assets/cuff-style-frill-cuff.png",
  "Loop Button Cuff": "/assets/cuff-style-loop-button-cuff.png",
};

const edgeFinishImageMap: Record<string, string> = {
  "Clean Fold": "/assets/edge-finish-clean-fold.png",
  "Piping": "/assets/edge-finish-piping.png",
  "Contrast Border": "/assets/edge-finish-contrast-border.png",
  "Beaded Finish": "/assets/edge-finish-beaded-finish.png",
};

function SleeveEndCuffScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Sleeve End / Cuff"
      subtitle="Choose how the sleeve finishes."
      buttonText="Save Cuff Selection"
      hero
      heroImageSrc="/assets/cuff-preview.png"
      heroLabel="Cuff Preview"
      onBack={onBack}
      onSave={onSave}
      infoText="The cuff finish enhances both style and comfort. You can preview your selection in the next step."
      groups={[
        {
          id: "cuffStyle",
          title: "Cuff Style",
          columns: 4,
          initial: "Plain Hem",
          options: ["Plain Hem", "Narrow Cuff", "Button Cuff", "Embroidered Cuff", "Lace Trim Cuff", "Scallop Edge", "Frill Cuff", "Loop Button Cuff"],
          imageMap: cuffStyleImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[78px]",
        },
        {
          id: "edgeFinish",
          title: "Edge Finish",
          columns: 4,
          initial: "Clean Fold",
          options: ["Clean Fold", "Piping", "Contrast Border", "Beaded Finish"],
          imageMap: edgeFinishImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[76px]",
        },
      ]}
    />
  );
}

const fullSleeveStyleImageMap: Record<string, string> = {
  "Straight Sleeve": "/assets/full-sleeve-style-straight-sleeve.png",
  "Bell Sleeve": "/assets/full-sleeve-style-bell-sleeve.png",
  "Bishop Sleeve": "/assets/full-sleeve-style-bishop-sleeve.png",
  "Puff Sleeve": "/assets/full-sleeve-style-puff-sleeve.png",
  "Panel Sleeve": "/assets/full-sleeve-style-panel-sleeve.png",
  "Flared Sleeve": "/assets/full-sleeve-style-flared-sleeve.png",
  "Slit Sleeve": "/assets/full-sleeve-style-slit-sleeve.png",
  "Umbrella Sleeve": "/assets/full-sleeve-style-umbrella-sleeve.png",
};

const sleeveFinishImageMap: Record<string, string> = {
  Simple: "/assets/sleeve-finish-simple.png",
  Embroidered: "/assets/sleeve-finish-embroidered.png",
  "Contrast Border": "/assets/sleeve-finish-contrast-border.png",
  "Lace Detail": "/assets/sleeve-finish-lace-detail.png",
};

function FullSleeveStyleScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Full Sleeve Style"
      subtitle="Select the overall sleeve design."
      buttonText="Save Sleeve Style"
      hero
      heroImageSrc="/assets/full-sleeve-preview.png"
      heroLabel="Full Sleeve Preview"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "fullSleeveStyle",
          title: "Full Sleeve Style",
          columns: 3,
          initial: "Straight Sleeve",
          options: ["Straight Sleeve", "Bell Sleeve", "Bishop Sleeve", "Puff Sleeve", "Panel Sleeve", "Flared Sleeve", "Slit Sleeve", "Umbrella Sleeve"],
          imageMap: fullSleeveStyleImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[82px]",
        },
        {
          id: "sleeveFinish",
          title: "Sleeve Finish",
          columns: 4,
          initial: "Simple",
          options: ["Simple", "Embroidered", "Contrast Border", "Lace Detail"],
          imageMap: sleeveFinishImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[76px]",
        },
      ]}
    />
  );
}


const bodySilhouetteImageMap: Record<string, string> = {
  "Straight Cut": "/assets/body-silhouette-straight-cut.png",
  "A-Line": "/assets/body-silhouette-a-line.png",
  "Semi-Fitted": "/assets/body-silhouette-semi-fitted.png",
  "Loose Fit": "/assets/body-silhouette-loose-fit.png",
  Angrakha: "/assets/body-silhouette-angrakha.png",
  Anarkali: "/assets/body-silhouette-anarkali.png",
  Kalidar: "/assets/body-silhouette-kalidar.png",
  Peplum: "/assets/body-silhouette-peplum.png",
  Kaftan: "/assets/body-silhouette-kaftan.png",
  "Frock Style": "/assets/body-silhouette-frock-style.png",
};

const fitPreferenceImageMap: Record<string, string> = {
  Structured: "/assets/fit-structured.png",
  Relaxed: "/assets/fit-relaxed.png",
  Flowing: "/assets/fit-flowing.png",
};

const flareLevelImageMap: Record<string, string> = {
  Minimal: "/assets/flare-minimal.png",
  Moderate: "/assets/flare-moderate.png",
  Full: "/assets/flare-full.png",
};

function BodySilhouetteScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Body / Silhouette"
      subtitle="Choose the overall dress shape and fall."
      buttonText="Save Silhouette"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "bodyShape",
          title: "Body Shape",
          columns: 4,
          initial: "Straight Cut",
          options: ["Straight Cut", "A-Line", "Semi-Fitted", "Loose Fit", "Angrakha", "Anarkali", "Kalidar", "Peplum", "Kaftan", "Frock Style"],
          imageMap: bodySilhouetteImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[68px] sm:h-[76px]",
          responsive: true,
          cardMinWidth: 74,
        },
        {
          id: "fitPreference",
          title: "Fit Preference",
          columns: 3,
          initial: "Structured",
          compact: true,
          options: ["Structured", "Relaxed", "Flowing"],
          imageMap: fitPreferenceImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[62px]",
          responsive: true,
          cardMinWidth: 92,
        },
        {
          id: "flareLevel",
          title: "Flare Level",
          columns: 3,
          initial: "Moderate",
          compact: true,
          options: ["Minimal", "Moderate", "Full"],
          imageMap: flareLevelImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[62px]",
          responsive: true,
          cardMinWidth: 92,
        },
      ]}
    />
  );
}

const kameezLengthImageMap: Record<string, string> = {
  Short: "/assets/kameez-length-short.png",
  "Hip Length": "/assets/kameez-length-hip-length.png",
  "Knee Length": "/assets/kameez-length-knee-length.png",
  "Mid-Calf": "/assets/kameez-length-mid-calf.png",
  "Ankle Length": "/assets/kameez-length-ankle-length.png",
  "Floor Length": "/assets/kameez-length-floor-length.png",
};

const frontBackLengthImageMap: Record<string, string> = {
  "Same Length": "/assets/front-back-length-same-length.png",
  "Slight High-Low": "/assets/front-back-length-slight-high-low.png",
  "Extended Back": "/assets/front-back-length-extended-back.png",
};

function KameezLengthScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Kameez Length"
      subtitle="Select your preferred dress length."
      buttonText="Save Length Selection"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "dressLength",
          title: "Dress Length",
          columns: 3,
          initial: "Hip Length",
          options: ["Short", "Hip Length", "Knee Length", "Mid-Calf", "Ankle Length", "Floor Length"],
          imageMap: kameezLengthImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[98px]",
          responsive: true,
          cardMinWidth: 92,
        },
        {
          id: "frontBackLength",
          title: "Front / Back Length",
          columns: 3,
          initial: "Same Length",
          compact: true,
          options: ["Same Length", "Slight High-Low", "Extended Back"],
          imageMap: frontBackLengthImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[98px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}


const damanHemStyleImageMap: Record<string, string> = {
  // Aligned with daman_hem_assets_pack.zip. Keep these files directly in public/assets/.
  "Straight Daman": "/assets/daman-straight-daman.png",
  "Rounded Hem": "/assets/daman-rounded-hem.png",
  "High-Low Hem": "/assets/daman-high-low-hem.png",
  "Side Chaak": "/assets/daman-side-chaak.png",
  "Double Chaak": "/assets/daman-double-chaak.png",
  "Front Slit": "/assets/daman-front-slit.png",
  "Scalloped Hem": "/assets/hem-scalloped-hem.png",
  "Asymmetric Hem": "/assets/hem-asymmetric-hem.png",
};

const hemWidthImageMap: Record<string, string> = {
  Slim: "/assets/hem-width-slim.png",
  Standard: "/assets/hem-width-standard.png",
  Wide: "/assets/hem-width-wide.png",
};

const finishingDetailImageMap: Record<string, string> = {
  "Neck Border": "/assets/finishing-neck-border.png",
  "Sleeve Border": "/assets/finishing-sleeve-border.png",
  "Daman Border": "/assets/finishing-daman-border.png",
  "Front Patti": "/assets/finishing-front-patti.png",
  "Side Lace": "/assets/finishing-side-lace.png",
  "Minimal Embroidery": "/assets/finishing-minimal-embroidery.png",
  "Festive Embroidery": "/assets/finishing-festive-embroidery.png",
  "Full Border Set": "/assets/finishing-full-border-set.png",
};

const lacePlacementImageMap: Record<string, string> = {
  Neckline: "/assets/lace-placement-neckline.png",
  Sleeves: "/assets/lace-placement-sleeves.png",
  Hem: "/assets/lace-placement-hem.png",
};

const laceStyleLevelImageMap: Record<string, string> = {
  Minimal: "/assets/lace-style-minimal.png",
  Elegant: "/assets/lace-style-elegant.png",
  Festive: "/assets/lace-style-festive.png",
};

function DamanChaakHemScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Daman / Chaak / Hem"
      subtitle="Customize the lower hem and slit details."
      buttonText="Save Hem Details"
      hero
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "hemStyle",
          title: "Hem Style",
          columns: 3,
          initial: "Straight Daman",
          options: ["Straight Daman", "Rounded Hem", "High-Low Hem", "Side Chaak", "Double Chaak", "Front Slit", "Scalloped Hem", "Asymmetric Hem"],
          imageMap: damanHemStyleImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[92px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "hemWidth",
          title: "Hem Width",
          columns: 3,
          initial: "Standard",
          compact: true,
          options: ["Slim", "Standard", "Wide"],
          imageMap: hemWidthImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[68px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}

function LaceEmbroideryBorderScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Lace / Embroidery / Border"
      subtitle="Select finishing details for your outfit."
      buttonText="Save Finishing Details"
      hero
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "finishingDetail",
          title: "Finishing Detail",
          columns: 4,
          initial: "Neck Border",
          options: ["Neck Border", "Sleeve Border", "Daman Border", "Front Patti", "Side Lace", "Minimal Embroidery", "Festive Embroidery", "Full Border Set"],
          imageMap: finishingDetailImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[82px]",
          responsive: true,
          cardMinWidth: 86,
        },
        {
          id: "placement",
          title: "Placement",
          columns: 3,
          initial: "Neckline",
          compact: true,
          options: ["Neckline", "Sleeves", "Hem"],
          imageMap: lacePlacementImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[66px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "styleLevel",
          title: "Style Level",
          columns: 3,
          initial: "Minimal",
          compact: true,
          options: ["Minimal", "Elegant", "Festive"],
          imageMap: laceStyleLevelImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[82px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}

const bottomWearTypeImageMap: Record<string, string> = {
  Shalwar: "/assets/bottom-wear-shalwar.png",
  "Straight Pant": "/assets/bottom-wear-straight-pant.png",
  "Cigarette Pant": "/assets/bottom-wear-cigarette-pant.png",
  Trouser: "/assets/bottom-wear-trouser.png",
  Palazzo: "/assets/bottom-wear-palazzo.png",
  "Tulip Pant": "/assets/bottom-wear-tulip-pant.png",
  Gharara: "/assets/bottom-wear-gharara.png",
  Sharara: "/assets/bottom-wear-sharara.png",
  "Lehenga Skirt": "/assets/bottom-wear-lehenga-skirt.png",
};

const bottomWearStyleFamilyImageMap: Record<string, string> = {
  Casual: "/assets/style-family-casual.png",
  Festive: "/assets/style-family-festive.png",
  Formal: "/assets/style-family-formal.png",
};

function BottomWearTypeScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Bottom Wear Type"
      subtitle="Choose the lower garment style for your outfit."
      buttonText="Save Bottom Wear Selection"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "bottomWearType",
          title: "Bottom Wear Type",
          columns: 3,
          initial: "Shalwar",
          options: ["Shalwar", "Straight Pant", "Cigarette Pant", "Trouser", "Palazzo", "Tulip Pant", "Gharara", "Sharara", "Lehenga Skirt"],
          imageMap: bottomWearTypeImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[94px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "styleFamily",
          title: "Style Family",
          columns: 3,
          initial: "Festive",
          compact: true,
          options: ["Casual", "Festive", "Formal"],
          imageMap: bottomWearStyleFamilyImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[92px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}

const torsoFitImageMap: Record<string, string> = {
  "Slim Fit": "/assets/torso-fit-slim-fit.png",
  "Regular Fit": "/assets/torso-fit-regular-fit.png",
  "Comfort Fit": "/assets/torso-fit-comfort-fit.png",
  "Relaxed Fit": "/assets/torso-fit-relaxed-fit.png",
  "Loose Fit": "/assets/torso-fit-loose-fit.png",
  "Structured Fit": "/assets/torso-fit-structured-fit.png",
};

const waistShapeImageMap: Record<string, string> = {
  "Straight Waist": "/assets/waist-shape-straight-waist.png",
  "Natural Waist": "/assets/waist-shape-natural-waist.png",
  "Empire Waist": "/assets/waist-shape-empire-waist.png",
};

const easePreferenceImageMap: Record<string, string> = {
  "Close Ease": "/assets/ease-preference-close-ease.png",
  "Standard Ease": "/assets/ease-preference-standard-ease.png",
  "Extra Ease": "/assets/ease-preference-extra-ease.png",
};

function BodyFitCustomizationScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Body Fit Customization"
      subtitle="Adjust the outfit fit before lower-wear details."
      buttonText="Save Body Fit Settings"
      hero
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "torsoFit",
          title: "Torso Fit",
          columns: 3,
          initial: "Regular Fit",
          options: ["Slim Fit", "Regular Fit", "Comfort Fit", "Relaxed Fit", "Loose Fit", "Structured Fit"],
          imageMap: torsoFitImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[96px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "waistShape",
          title: "Waist Shape",
          columns: 3,
          initial: "Natural Waist",
          compact: true,
          options: ["Straight Waist", "Natural Waist", "Empire Waist"],
          imageMap: waistShapeImageMap,
          imageFit: "cover",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[72px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "easePreference",
          title: "Ease Preference",
          columns: 3,
          initial: "Standard Ease",
          compact: true,
          options: ["Close Ease", "Standard Ease", "Extra Ease"],
          imageMap: easePreferenceImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[90px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}


const thighFitImageMap: Record<string, string> = {
  "Slim Thigh": "/assets/thigh-fit-slim-thigh.png",
  "Regular Thigh": "/assets/thigh-fit-regular-thigh.png",
  "Relaxed Thigh": "/assets/thigh-fit-relaxed-thigh.png",
  "Pleated Thigh": "/assets/thigh-fit-pleated-thigh.png",
};

const kneeShapingImageMap: Record<string, string> = {
  "Straight Knee": "/assets/knee-shaping-straight-knee.png",
  "Tapered Knee": "/assets/knee-shaping-tapered-knee.png",
  "Flared Knee": "/assets/knee-shaping-flared-knee.png",
  "Structured Knee": "/assets/knee-shaping-structured-knee.png",
};

const functionalDetailsImageMap: Record<string, string> = {
  "Side Pleat": "/assets/functional-detail-side-pleat.png",
  "Panel Seam": "/assets/functional-detail-panel-seam.png",
  "Extra Ease": "/assets/functional-detail-extra-ease.png",
};

function ThighKneeCustomizationScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Thigh / Knee Customization"
      subtitle="Adjust the thigh and knee shape of your lower garment."
      buttonText="Save Thigh & Knee Settings"
      hero
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "thighFit",
          title: "Thigh Fit",
          columns: 4,
          initial: "Regular Thigh",
          options: ["Slim Thigh", "Regular Thigh", "Relaxed Thigh", "Pleated Thigh"],
          imageMap: thighFitImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[88px]",
          responsive: true,
          cardMinWidth: 82,
        },
        {
          id: "kneeShaping",
          title: "Knee Shaping",
          columns: 4,
          initial: "Straight Knee",
          options: ["Straight Knee", "Tapered Knee", "Flared Knee", "Structured Knee"],
          imageMap: kneeShapingImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[88px]",
          responsive: true,
          cardMinWidth: 82,
        },
        {
          id: "functionalDetails",
          title: "Functional Details",
          columns: 3,
          initial: "Side Pleat",
          options: ["Side Pleat", "Panel Seam", "Extra Ease"],
          imageMap: functionalDetailsImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[92px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}

const painchaStyleImageMap: Record<string, string> = {
  "Narrow Paincha": "/assets/paincha-style-narrow-paincha.png",
  "Straight Paincha": "/assets/paincha-style-straight-paincha.png",
  "Wide Paincha": "/assets/paincha-style-wide-paincha.png",
  "Tapered Paincha": "/assets/paincha-style-tapered-paincha.png",
  "Cuffed Paincha": "/assets/paincha-style-cuffed-paincha.png",
  "Flared Paincha": "/assets/paincha-style-flared-paincha.png",
};

const lowerEdgeFinishImageMap: Record<string, string> = {
  "Plain Edge": "/assets/lower-edge-finish-plain-edge.png",
  "Lace Edge": "/assets/lower-edge-finish-lace-edge.png",
  "Embroidered Edge": "/assets/lower-edge-finish-embroidered-edge.png",
  "Button Detail": "/assets/lower-edge-finish-button-edge.png",
  "Slit Opening": "/assets/lower-edge-finish-slit-opening.png",
  "Scalloped Edge": "/assets/lower-edge-finish-scallop-edge.png",
};

const ankleOpeningWidthImageMap: Record<string, string> = {
  "Narrow": "/assets/ankle-opening-width-narrow.png",
  "Standard": "/assets/ankle-opening-width-standard.png",
  "Wide": "/assets/ankle-opening-width-wide.png",
};

function PainchaLowerLegScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Paincha / Lower Leg Customization"
      subtitle="Refine the lower leg opening and finish of your bottom wear."
      buttonText="Save Paincha Settings"
      hero
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "painchaStyle",
          title: "Paincha Style",
          columns: 3,
          initial: "Wide Paincha",
          options: ["Narrow Paincha", "Straight Paincha", "Wide Paincha", "Tapered Paincha", "Cuffed Paincha", "Flared Paincha"],
          imageMap: painchaStyleImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[96px]",
          responsive: true,
          cardMinWidth: 104,
        },
        {
          id: "lowerEdgeFinish",
          title: "Lower Edge Finish",
          columns: 6,
          initial: "Embroidered Edge",
          options: ["Plain Edge", "Lace Edge", "Embroidered Edge", "Button Detail", "Slit Opening", "Scalloped Edge"],
          imageMap: lowerEdgeFinishImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[86px]",
          responsive: true,
          cardMinWidth: 72,
        } as CustomizationGroupConfig,
        {
          id: "ankleOpening",
          title: "Ankle Opening Width",
          columns: 3,
          initial: "Standard",
          compact: true,
          options: ["Narrow", "Standard", "Wide"],
          imageMap: ankleOpeningWidthImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[90px]",
          responsive: true,
          cardMinWidth: 96,
        },
      ]}
    />
  );
}


const dupattaStyleImageMap: Record<string, string> = {
  "Standard Dupatta": "/assets/dupatta-style-standard-dupatta.png",
  "Chiffon Dupatta": "/assets/dupatta-style-chiffon-dupatta.png",
  "Organza Dupatta": "/assets/dupatta-style-organza-dupatta.png",
  "Net Dupatta": "/assets/dupatta-style-net-dupatta.png",
  "Banarsi Dupatta": "/assets/dupatta-style-banarsi-dupatta.png",
  "Embroidered Dupatta": "/assets/dupatta-style-embroidered-dupatta.png",
};

const dupattaLengthImageMap: Record<string, string> = {
  "Short": "/assets/dupatta-length-short.png",
  "Standard": "/assets/dupatta-length-standard.png",
  "Long": "/assets/dupatta-length-long.png",
};

const dupattaBorderImageMap: Record<string, string> = {
  "Plain Border": "/assets/dupatta-border-plain-border.png",
  "Lace Border": "/assets/dupatta-border-lace-border.png",
  "Embroidered Border": "/assets/dupatta-border-embroidered-border.png",
  "Tassels": "/assets/dupatta-border-tassels.png",
  "Gota Detail": "/assets/dupatta-border-gota-detail.png",
};

function DupattaCustomizationScreen({ onBack, onSave }: { onBack: () => void; onSave: () => void }) {
  return (
    <CustomizationFlowScreen
      title="Dupatta Customization"
      subtitle="Select the dupatta style and finish for your outfit."
      buttonText="Save Dupatta Selection"
      onBack={onBack}
      onSave={onSave}
      groups={[
        {
          id: "dupattaStyle",
          title: "Dupatta Style",
          columns: 3,
          initial: "Standard Dupatta",
          options: ["Standard Dupatta", "Chiffon Dupatta", "Organza Dupatta", "Net Dupatta", "Banarsi Dupatta", "Embroidered Dupatta"],
          imageMap: dupattaStyleImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[96px]",
          responsive: true,
          cardMinWidth: 104,
        },
        {
          id: "dupattaLength",
          title: "Dupatta Length",
          columns: 3,
          initial: "Standard",
          compact: true,
          options: ["Short", "Standard", "Long"],
          imageMap: dupattaLengthImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[90px]",
          responsive: true,
          cardMinWidth: 96,
        },
        {
          id: "dupattaBorder",
          title: "Dupatta Border / Finishing",
          columns: 5,
          initial: "Tassels",
          options: ["Plain Border", "Lace Border", "Embroidered Border", "Tassels", "Gota Detail"],
          imageMap: dupattaBorderImageMap,
          imageFit: "contain",
          imagePositionClass: "object-center",
          imageHeightClass: "h-[88px]",
          responsive: true,
          cardMinWidth: 74,
        } as CustomizationGroupConfig,
      ]}
    />
  );
}

function ReviewDetailCard({
  label,
  value,
  imageSrc,
  fabric,
  onEdit,
}: {
  label: string;
  value: string;
  imageSrc?: string;
  fabric: FabricItem;
  onEdit?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="group flex min-h-[86px] w-full items-center gap-3 rounded-[16px] border border-[#D9EAF2] bg-white px-3 py-3 text-left shadow-[0_8px_18px_rgba(6,27,58,0.055)] transition hover:-translate-y-0.5 hover:border-[#15A9D6]/70 hover:shadow-[0_12px_24px_rgba(6,27,58,0.09)]"
    >
      <div className="relative h-[70px] w-[122px] shrink-0 overflow-hidden rounded-[13px] border border-[#E3EEF4] bg-[#F8FCFF]">
        <div className="absolute inset-0 opacity-18" style={{ background: fabric.texture }} />
        {imageSrc ? (
          <SafeAssetImage
            src={imageSrc}
            alt={`${label} selected preview`}
            fallbackLabel={label}
            fallbackClassName="h-[70px]"
            className="relative z-10 h-full w-full object-contain object-center p-1.5"
          />
        ) : (
          <SmallImagePlaceholder compact />
        )}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ backgroundColor: fabricColorHexMap[fabric.color], mixBlendMode: "multiply", opacity: getFabricTintOpacity(fabric.color) }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="summary-title text-[12px] font-extrabold leading-[1.15] text-[#14213D]">{label}</p>
        <p className="summary-value mt-1 text-[11px] font-semibold leading-[1.25] text-[#526172]">{value}</p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-[#DDEBF2]" style={{ backgroundColor: fabricColorHexMap[fabric.color] }} />
          <span className="rounded-full bg-[#F3F8FB] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-[#7B8C9D]">
            {fabric.color}
          </span>
        </div>
      </div>

      <span className="review-edit-pill shrink-0 rounded-full border border-[#0B84B5] bg-[#0B84B5] px-2.5 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-white shadow-[0_6px_14px_rgba(11,132,181,0.22)] transition group-hover:border-[#0A6F98] group-hover:bg-[#0A6F98]">
        Edit
      </span>
    </button>
  );
}


function FabricCircleThumb({ fabric }: { fabric: FabricItem }) {
  const candidates = useMemo(() => getImageCandidates(fabric.imageSrc, fabric.name), [fabric.imageSrc, fabric.name]);
  const [candidateIndex, setCandidateIndex] = useState(0);

  useEffect(() => {
    setCandidateIndex(0);
  }, [fabric.imageSrc, fabric.name]);

  const currentSrc = candidates[candidateIndex];

  return (
    <span
      className="fabric-circle-thumb relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-[#DDEBF2] bg-white shadow-[0_4px_10px_rgba(6,27,58,0.08)]"
      style={{ background: fabric.texture }}
    >
      <span className="absolute inset-0 opacity-75" style={{ background: fabric.texture }} />
      {currentSrc ? (
        <img
          src={currentSrc}
          alt={`${fabric.name} fabric`}
          className="relative z-10 h-full w-full rounded-full object-cover object-center p-0"
          loading="eager"
          decoding="async"
          draggable={false}
          onError={() => setCandidateIndex((current) => current + 1)}
        />
      ) : null}
    </span>
  );
}

function FinalOutfitPreviewPanel({
  imageSrc,
  selectedFabric,
  selectedTemplate,
  selectedDupatta,
  onEditFabric,
  onEditDesign,
}: {
  imageSrc: string;
  selectedFabric: FabricItem;
  selectedTemplate: DressTemplate;
  selectedDupatta: string;
  onEditFabric: () => void;
  onEditDesign: () => void;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-[18px] border border-[#DDEBF2] bg-[#F6FCFF] shadow-[0_8px_18px_rgba(6,27,58,0.05)]">
      <div className="relative h-[270px] overflow-hidden bg-[#F6FCFF]">
        <div className="absolute inset-0 opacity-35" style={{ background: selectedFabric.texture }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(255,255,255,0.88),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(249,245,239,0.92))]" />
        <SafeAssetImage
          src={imageSrc}
          alt="Final outfit preview"
          fallbackLabel="Final Outfit"
          fallbackClassName="h-[270px]"
          className="relative z-10 h-full w-full object-contain object-center px-2 py-2"
        />
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{ backgroundColor: fabricColorHexMap[selectedFabric.color], mixBlendMode: "multiply", opacity: getFabricTintOpacity(selectedFabric.color) }}
        />
        <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(6,27,58,0.08))]" />
        <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#14213D]/85 to-transparent px-4 pb-3 pt-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white">Final Outfit Preview</p>
          <p className="mt-1 truncate text-[9px] font-semibold text-white/85">
            {selectedFabric.name} · {selectedFabric.color} · {selectedTemplate.name} · {selectedDupatta}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-white px-3 py-3">
        <button
          type="button"
          onClick={onEditFabric}
          className="flex items-center gap-2 rounded-[10px] border border-[#DDEBF2] px-2 py-2 text-left transition hover:border-[#15A9D6]"
        >
          <FabricCircleThumb fabric={selectedFabric} />
          <span className="min-w-0">
            <span className="block truncate text-[8px] font-bold uppercase tracking-[0.08em] text-[#94A3AD]">Fabric / Color</span>
            <span className="block truncate text-[9px] font-bold text-[#14213D]">{selectedFabric.name} · {selectedFabric.color}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={onEditDesign}
          className="flex items-center gap-2 rounded-[10px] border border-[#DDEBF2] px-2 py-2 text-left transition hover:border-[#15A9D6]"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-white">
            <Shirt className="h-3.5 w-3.5" strokeWidth={1.8} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[8px] font-bold uppercase tracking-[0.08em] text-[#94A3AD]">Template</span>
            <span className="block truncate text-[9px] font-bold text-[#14213D]">{selectedTemplate.name}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function FinalCustomizationReviewScreen({
  selectedFabric,
  selectedTemplate,
  onBack,
  onEditScreen,
  onContinue,
}: {
  selectedFabric: FabricItem;
  selectedTemplate: DressTemplate;
  onBack: () => void;
  onEditScreen: (screen: Screen) => void;
  onContinue: () => void;
}) {
  const selections = getStoredCustomizationSelections();

  const selectedNeck = getSelectionValue(selections, "neckType", "V-Neck");
  const selectedHem = getSelectionValue(selections, "hemStyle", "Side Chaak");
  const selectedShoulder = getSelectionValue(selections, "shoulderStyle", "Standard Shoulder");
  const selectedShoulderWidth = getSelectionValue(selections, "shoulderWidth", "Standard");
  const selectedArmhole = getSelectionValue(selections, "armholeShape", "Comfort Fit");
  const selectedFinishing = getSelectionValue(selections, "finishingDetail", "Festive Embroidery");
  const selectedUpperArm = getSelectionValue(selections, "upperArmFit", "Regular Fit");
  const selectedBottomWear = getSelectionValue(selections, "bottomWearType", "Straight Pant");
  const selectedForearm = getSelectionValue(selections, "forearmShape", "Regular Forearm");
  const selectedBottomFit = getSelectionValue(selections, "torsoFit", "Regular Fit");
  const selectedCuff = getSelectionValue(selections, "cuffStyle", "Plain Hem");
  const selectedThigh = getSelectionValue(selections, "thighFit", "Regular Thigh");
  const selectedFullSleeve = getSelectionValue(selections, "fullSleeveStyle", "Straight Sleeve");
  const selectedPaincha = getSelectionValue(selections, "painchaStyle", "Wide Paincha");
  const selectedBody = getSelectionValue(selections, "bodyShape", "Straight Cut");
  const selectedDupatta = getSelectionValue(selections, "dupattaStyle", "Embroidered Dupatta");
  const selectedKameezLength = getSelectionValue(selections, "dressLength", "Knee Length");

  const finalPreviewImage =
    getSelectionImage(selectedDupatta, dupattaStyleImageMap) ??
    getSelectionImage(selectedBody, bodySilhouetteImageMap) ??
    templateImageMap[selectedTemplate.name] ??
    selectedFabric.imageSrc ??
    templatePreviewImage;

  const reviewItems: Array<{ label: string; value: string; imageSrc?: string; editScreen: Screen }> = [
    {
      label: "Neck",
      value: selectedNeck,
      imageSrc: getSelectionImage(selectedNeck, neckImageMap),
      editScreen: "neckCustomization",
    },
    {
      label: "Hem / Chaak",
      value: selectedHem,
      imageSrc: getSelectionImage(selectedHem, damanHemStyleImageMap),
      editScreen: "damanChaakHem",
    },
    {
      label: "Shoulder & Armhole",
      value: selectedShoulder,
      imageSrc:
        getSelectionImage(selectedShoulder, shoulderStyleImageMap, shoulderWidthImageMap, armholeShapeImageMap) ??
        getSelectionImage(selectedShoulderWidth, shoulderWidthImageMap) ??
        getSelectionImage(selectedArmhole, armholeShapeImageMap),
      editScreen: "shoulderArmhole",
    },
    {
      label: "Lace / Embroidery / Border",
      value: selectedFinishing,
      imageSrc: getSelectionImage(selectedFinishing, finishingDetailImageMap, lacePlacementImageMap, laceStyleLevelImageMap),
      editScreen: "laceEmbroideryBorder",
    },
    {
      label: "Upper Arm",
      value: selectedUpperArm,
      imageSrc: getSelectionImage(selectedUpperArm, upperArmFitImageMap, sleeveVolumeImageMap, decorativeStyleImageMap),
      editScreen: "upperArmCustomization",
    },
    {
      label: "Bottom Wear Type",
      value: selectedBottomWear,
      imageSrc: getSelectionImage(selectedBottomWear, bottomWearTypeImageMap),
      editScreen: "bottomWearType",
    },
    {
      label: "Forearm",
      value: selectedForearm,
      imageSrc: getSelectionImage(selectedForearm, forearmShapeImageMap, forearmDetailImageMap),
      editScreen: "forearmCustomization",
    },
    {
      label: "Bottom Fit",
      value: selectedBottomFit,
      imageSrc: getSelectionImage(selectedBottomFit, torsoFitImageMap, waistShapeImageMap, easePreferenceImageMap),
      editScreen: "bodyFitCustomization",
    },
    {
      label: "Cuff",
      value: selectedCuff,
      imageSrc: getSelectionImage(selectedCuff, cuffStyleImageMap, edgeFinishImageMap),
      editScreen: "sleeveEndCuff",
    },
    {
      label: "Thigh / Knee",
      value: selectedThigh,
      imageSrc: getSelectionImage(selectedThigh, thighFitImageMap, kneeShapingImageMap),
      editScreen: "thighKneeCustomization",
    },
    {
      label: "Full Sleeve",
      value: selectedFullSleeve,
      imageSrc: getSelectionImage(selectedFullSleeve, fullSleeveStyleImageMap, sleeveFinishImageMap),
      editScreen: "fullSleeveStyle",
    },
    {
      label: "Paincha / Lower Leg",
      value: selectedPaincha,
      imageSrc: getSelectionImage(selectedPaincha, painchaStyleImageMap, lowerEdgeFinishImageMap, ankleOpeningWidthImageMap),
      editScreen: "painchaLowerLeg",
    },
    {
      label: "Body / Silhouette",
      value: selectedBody,
      imageSrc: getSelectionImage(selectedBody, bodySilhouetteImageMap, fitPreferenceImageMap, flareLevelImageMap),
      editScreen: "bodySilhouette",
    },
    {
      label: "Dupatta",
      value: selectedDupatta,
      imageSrc: getSelectionImage(selectedDupatta, dupattaStyleImageMap, dupattaLengthImageMap, dupattaBorderImageMap),
      editScreen: "dupattaCustomization",
    },
    {
      label: "Kameez Length",
      value: selectedKameezLength,
      imageSrc: getSelectionImage(selectedKameezLength, kameezLengthImageMap, frontBackLengthImageMap),
      editScreen: "kameezLength",
    },
  ];

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-5 pb-0 pt-12">
      <CustomizationAppBar onBack={onBack} />
      <section
        className="min-h-0 flex-1 overflow-y-auto pb-3 pr-1 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="mt-3 text-center">
          <h1
            className="text-[20px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Final Customization Review
          </h1>
          <p className="mt-1 text-[11px] font-semibold text-[#526172]">
            Preview the selected color, fabric, and outfit details before saving.
          </p>
        </div>

        <FinalOutfitPreviewPanel
          imageSrc={finalPreviewImage}
          selectedFabric={selectedFabric}
          selectedTemplate={selectedTemplate}
          selectedDupatta={selectedDupatta}
          onEditFabric={() => onEditScreen("fabric")}
          onEditDesign={() => onEditScreen("template")}
        />

        <div className="mt-4">
          <div className="mb-2.5 flex items-center justify-between px-0.5">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#15A9D6]">Selected Details</p>
              <p className="mt-0.5 text-[11px] font-semibold text-[#667889]">Tap any item to edit before placing the order.</p>
            </div>
            <span className="rounded-full bg-[#EEF8FC] px-2.5 py-1 text-[9px] font-extrabold text-[#0B6F95]">
              {reviewItems.length} items
            </span>
          </div>

          <div className="space-y-2.5">
            {reviewItems.map((item) => (
              <ReviewDetailCard
                key={item.label}
                label={item.label}
                value={item.value}
                imageSrc={item.imageSrc}
                fabric={selectedFabric}
                onEdit={() => onEditScreen(item.editScreen)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-[16px] border border-[#DDEBF2] bg-white px-4 py-3.5 shadow-[0_8px_18px_rgba(6,27,58,0.05)]">
          <p className="text-[11px] font-extrabold text-[#14213D]">Preview & Editing</p>
          <p className="mt-1.5 text-[10px] font-semibold leading-4 text-[#667889]">
            The final preview uses the selected fabric color/texture with the chosen outfit image. Tap any card to jump back and edit that section.
          </p>
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={onContinue}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Save Review & Continue
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          onClick={onBack}
          className="mt-2 flex h-7 w-full items-center justify-center gap-1 text-[11px] font-semibold text-[#14213D] transition hover:text-[#15A9D6]"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}


function PaymentMethodVisual({ id, active }: { id: string; active: boolean }) {
  const iconClass = active ? "h-6 w-6 text-white" : "h-6 w-6 text-[#0E7BC1]";

  return (
    <div
      className={[
        "payment-method-visual relative flex h-[58px] w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[18px] border shadow-[0_10px_22px_rgba(6,27,58,0.07)]",
        active
          ? "border-[#15A9D6] bg-[linear-gradient(135deg,#06365A,#0E7BC1,#10B6D9)]"
          : "border-[#DDEBF2] bg-[linear-gradient(180deg,#FFFFFF,#F6FCFF)]",
      ].join(" ")}
    >

      {id === "COD" && <Banknote className={iconClass} strokeWidth={1.9} />}
      {id === "Online" && <CreditCard className={iconClass} strokeWidth={1.9} />}
      {id === "Shopkeeper" && <Store className={iconClass} strokeWidth={1.9} />}
    </div>
  );
}

function PaymentMethodScreen({ onBack, onConfirm }: { onBack: () => void; onConfirm: () => void }) {
  const [method, setMethod] = useState("COD");
  const methods = [
    {
      id: "COD",
      title: "Cash on Delivery",
      subtitle: "COD",
      description: "Pay cash when the outfit is delivered.",
      note: "Most common",
    },
    {
      id: "Online",
      title: "Online Payment",
      subtitle: "Card / Wallet",
      description: "Pay by card, bank transfer, or mobile wallet.",
      note: "Secure",
    },
    {
      id: "Shopkeeper",
      title: "Paid to Shopkeeper",
      subtitle: "In-store",
      description: "Customer already paid the shopkeeper.",
      note: "Verified",
    },
  ];

  const selectedMethod = methods.find((item) => item.id === method) ?? methods[0];

  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-12">
      <CustomizationAppBar onBack={onBack} />
      <section className="min-h-0 flex-1 overflow-y-auto pb-3 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <div className="mt-6 text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#15A9D6]">
            Checkout
          </p>
          <h1
            className="mt-1 text-[24px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Payment Method
          </h1>
          <div className="mx-auto mt-2 h-px w-12 bg-[#15A9D6] text-white" />
          <p className="mx-auto mt-3 max-w-[295px] text-[12px] font-semibold leading-5 text-[#667889]">
            Choose the customer&apos;s payment method to place this order.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          {methods.map((paymentMethod) => {
            const active = method === paymentMethod.id;

            return (
              <button
                key={paymentMethod.id}
                type="button"
                onClick={() => setMethod(paymentMethod.id)}
                className={[
                  "payment-method-card group flex w-full items-center gap-3 rounded-[20px] border bg-white px-3.5 py-3.5 text-left shadow-[0_10px_22px_rgba(6,27,58,0.055)] transition",
                  active
                    ? "border-[#15A9D6] bg-[#FCFEFF] ring-1 ring-[#15A9D6]/20"
                    : "border-[#DDEBF2] hover:border-[#15A9D6]/55",
                ].join(" ")}
              >
                <PaymentMethodVisual id={paymentMethod.id} active={active} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[14px] font-extrabold leading-tight text-[#14213D]">
                      {paymentMethod.title}
                    </p>
                    <span
                      className={[
                        "shrink-0 rounded-full px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[0.12em]",
                        active ? "bg-[#EAF8FE] text-[#0E7BC1]" : "bg-[#F3F8FB] text-[#94A3AD]",
                      ].join(" ")}
                    >
                      {paymentMethod.note}
                    </span>
                  </div>

                  <p className="mt-1 text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">
                    {paymentMethod.subtitle}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold leading-4 text-[#667889]">
                    {paymentMethod.description}
                  </p>
                </div>

                <span
                  className={[
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition",
                    active ? "border-[#15A9D6] bg-[#15A9D6]" : "border-[#94A3AD] bg-white",
                  ].join(" ")}
                >
                  {active && <Check className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#15A9D6]/55 bg-white shadow-[0_10px_22px_rgba(6,27,58,0.055)]">
          <div className="flex items-center justify-between gap-4 px-4 py-4">
            <div className="min-w-0">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#15A9D6]">
                Amount Payable
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-4 text-[#667889]">
                Payment via {selectedMethod.title}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[18px] font-extrabold text-[#14213D]">PKR 6,450</p>
              <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#94A3AD]">
                Tax included
              </p>
            </div>
          </div>

          <div className="border-t border-[#E9F4F8] bg-[#F6FCFF] px-4 py-3">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#0E7BC1]" strokeWidth={2} />
              <p className="text-[11px] font-bold text-[#14213D]">Secure &amp; Private</p>
            </div>
            <p className="mt-1 text-[10.5px] font-medium leading-4 text-[#667889]">
              Payment details are kept safe and only the selected payment status is attached to this order.
            </p>
          </div>
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-5 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={onConfirm}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Confirm Order
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>
        <button type="button" onClick={onBack} className="mt-3 flex h-7 w-full items-center justify-center gap-1 text-[12px] font-semibold text-[#14213D]">
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          Back
        </button>
      </footer>
    </PhoneFrame>
  );
}
function OrderPlacedScreen({ onTrack, onHome }: { onTrack: () => void; onHome: () => void }) {
  return (
    <PhoneFrame contentClassName="flex h-full flex-col px-6 pb-0 pt-12">
      <CustomizationAppBar onBack={onHome} />
      <section className="min-h-0 flex-1 overflow-y-auto pb-3 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
        <div className="mt-6 flex flex-col items-center text-center">
          <div className="flex h-[118px] w-[118px] items-center justify-center rounded-full bg-[#E8F5EB] shadow-[0_12px_30px_rgba(21,128,61,0.18)]">
            <div className="flex h-[86px] w-[86px] items-center justify-center rounded-full bg-[#5FAE3F] text-[48px] font-bold text-white">✓</div>
          </div>

          <h1
            className="mt-8 text-[31px] font-semibold leading-tight text-[#14213D]"
            style={{ fontFamily: '"DM Serif Display", serif' }}
          >
            Order Placed
          </h1>
          <div className="mt-3 flex items-center justify-center gap-4 text-[#15A9D6]">
            <span className="h-px w-14 bg-[#15A9D6] text-white" />
            <span>✧</span>
            <span className="h-px w-14 bg-[#15A9D6] text-white" />
          </div>
          <p className="mt-4 max-w-[260px] text-[14px] font-semibold leading-6 text-[#526172]">
            Thank you! Your order has been placed successfully. We&apos;ll start working on your custom outfit right away.
          </p>
        </div>

        <div className="order-summary-card mt-6 overflow-hidden rounded-[22px] border border-[#DDEBF2] bg-white shadow-[0_12px_28px_rgba(6,27,58,0.07)]">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#06365A,#0E7BC1,#10B6D9)] text-white shadow-[0_10px_22px_rgba(14,123,193,0.22)]">
              <PackageCheck className="h-7 w-7" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#94A3AD]">Order ID</p>
              <p className="mt-1 break-all text-[18px] font-extrabold tracking-[0.06em] text-[#14213D]">MF-2505-000123</p>
            </div>
          </div>

          <div className="border-t border-dashed border-[#DDEBF2] px-4 py-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-[16px] bg-[#F6FCFF] px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#0E7BC1] shadow-[0_6px_14px_rgba(6,27,58,0.05)]">
                    <CalendarDays className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Estimated</p>
                    <p className="mt-0.5 text-[11px] font-bold text-[#14213D]">18 – 22 May</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] bg-[#F6FCFF] px-3 py-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[11px] bg-white text-[#0E7BC1] shadow-[0_6px_14px_rgba(6,27,58,0.05)]">
                    <Truck className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#94A3AD]">Delivery</p>
                    <p className="mt-0.5 text-[11px] font-bold text-[#14213D]">To Address</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-[#E9F4F8] bg-[#F6FCFF] px-4 py-3">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[#78BE43]" strokeWidth={2.4} />
              <p className="text-[11px] font-bold text-[#14213D]">Shopkeeper has received the order details.</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[14px] border border-[#E8F5EB] bg-[#F4FAF6] px-4 py-3 text-[11px] font-semibold leading-5 text-[#526172]">
          A confirmation email & WhatsApp message has been sent to you.
        </div>
      </section>

      <footer className="sticky bottom-0 shrink-0 bg-[#FCFEFF]/95 pb-6 pt-3 backdrop-blur">
        <button
          type="button"
          onClick={onTrack}
          className="compact-cta-button flex h-[40px] w-[78%] mx-auto items-center justify-center gap-2 rounded-[14px] bg-[#14213D] text-[13px] font-semibold text-white shadow-[0_8px_18px_rgba(7,25,54,0.16)] transition hover:scale-[1.01]"
        >
          Track Order
          <ArrowRight className="h-5 w-5" strokeWidth={1.9} />
        </button>
        <button
          type="button"
          onClick={onHome}
          className="mt-3 flex h-[45px] w-full items-center justify-center gap-3 rounded-[13px] border border-[#DDEBF2] bg-white text-[13px] font-bold text-[#14213D] transition hover:bg-[#F6FCFF]"
        >
          Back to Home
          <span className="text-[16px]">⌂</span>
        </button>
      </footer>
    </PhoneFrame>
  );
}


export default App;
