import repsolLogo from "@/assets/logos/repsol.jpg";
import cepsaLogo from "@/assets/logos/cepsa.jpg";
import bpLogo from "@/assets/logos/bp.jpg";
import shellLogo from "@/assets/logos/shell.jpg";
import galpLogo from "@/assets/logos/galp.jpg";
import ballenoilLogo from "@/assets/logos/ballenoil.svg";
import plenoilLogo from "@/assets/logos/plenoil.svg";
import petroprixLogo from "@/assets/logos/petroprix.svg";
import carrefourLogo from "@/assets/logos/carrefour.svg";
import alcampoLogo from "@/assets/logos/alcampo.png";
import bonareaLogo from "@/assets/logos/bonarea.svg";
import q8Logo from "@/assets/logos/q8.svg";
import petronorLogo from "@/assets/logos/petronor.svg";
import defaultLogo from "@/assets/logos/default.jpg";

interface BrandLogoMap {
  [key: string]: string;
}

const brandLogos: BrandLogoMap = {
  // Marcas tradicionales
  repsol: repsolLogo,
  cepsa: cepsaLogo,
  bp: bpLogo,
  shell: shellLogo,
  galp: galpLogo,
  petronor: petronorLogo,
  campsa: repsolLogo,

  // Marcas low-cost
  ballenoil: ballenoilLogo,
  plenoil: plenoilLogo,
  petroprix: petroprixLogo,

  // Supermercados
  carrefour: carrefourLogo,
  alcampo: alcampoLogo,
  bonarea: bonareaLogo,

  // Otras marcas
  q8: q8Logo,
  'kuwait petroleum': q8Logo,

  // Variaciones con "E.S." o "ES"
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
  'e.s. petronor': petronorLogo,
  'es petronor': petronorLogo,
  'e.s. ballenoil': ballenoilLogo,
  'es ballenoil': ballenoilLogo,
  'e.s. plenoil': plenoilLogo,
  'es plenoil': plenoilLogo,
  'e.s. petroprix': petroprixLogo,
  'es petroprix': petroprixLogo,
  'e.s. carrefour': carrefourLogo,
  'es carrefour': carrefourLogo,
  'e.s. alcampo': alcampoLogo,
  'es alcampo': alcampoLogo,
  'e.s. bonarea': bonareaLogo,
  'es bonarea': bonareaLogo,
  'e.s. q8': q8Logo,
  'es q8': q8Logo,

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
