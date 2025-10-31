import repsolLogo from "@/assets/logos/repsol.jpg";
import cepsaLogo from "@/assets/logos/cepsa.jpg";
import bpLogo from "@/assets/logos/bp.jpg";
import shellLogo from "@/assets/logos/shell.jpg";
import galpLogo from "@/assets/logos/galp.jpg";
import defaultLogo from "@/assets/logos/default.jpg";

interface BrandLogoMap {
  [key: string]: string;
}

const brandLogos: BrandLogoMap = {
  repsol: repsolLogo,
  cepsa: cepsaLogo,
  bp: bpLogo,
  shell: shellLogo,
  galp: galpLogo,
  petronor: repsolLogo,
  campsa: repsolLogo,
  'e.s. repsol': repsolLogo,
  'es repsol': repsolLogo,
  'e.s. cepsa': cepsaLogo,
  'es cepsa': cepsaLogo,
  'e.s. bp': bpLogo,
  'es bp': bpLogo,
  'e.s. shell': shellLogo,
  'es shell': shellLogo,
  'e.s. galp': galpLogo,
  'es galp': galpLogo,
  default: defaultLogo,
};

export const getBrandLogo = (brandName?: string): string => {
  if (!brandName) return defaultLogo;

  const normalize = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/\b(e\.?s\.?|estacion(?:es)? de servicio|estacion|servicio)\b/g, ' ')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const clean = normalize(brandName);

  for (const [key, logo] of Object.entries(brandLogos)) {
    if (key !== 'default' && clean.includes(key)) {
      return logo;
    }
  }

  return defaultLogo;
};
