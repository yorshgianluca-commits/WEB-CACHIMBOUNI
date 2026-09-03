import { useState } from "react";

/**
 * Marquesina infinita de logos de academias / canales aliados.
 * Las imágenes se cargan desde su origen; si alguna falla, se muestra el
 * nombre en texto para que la fila nunca quede con huecos.
 */

export type Partner = {
  name: string;
  src: string;
};

export const PARTNERS: Partner[] = [
  {
    name: "Academia Aduni",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIijcc2Mh_Rdoq3nNqP-gUwfzqLOg3U6wSFjf53GeaPw&s=10",
  },
  {
    name: "Academia César Vallejo",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpIFFNwSo6jNSVFpLZA6M-K0zPSWhfknaRwjhS9IMBGQ&s=10",
  },
  {
    name: "Academia Pamer",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDedGvPBupqwtEhlHDpi-P_ewCPgyLKwSK-s1Sy-mftQ&s=10",
  },
  {
    name: "Exclusiva UNI",
    src: "https://i.ytimg.com/vi/yrPfzbYs-40/hqdefault.jpg",
  },
  {
    name: "Academia aliada",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhE5R5InTJl2eM_iEq1pT39ql9bvrgSTQ0G_fGRwPabmmBV42djniC09_1&s=10",
  },
  {
    name: "Academia aliada",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiqqQ3U0q6tgXxZexZISkXtuzktQbP5S4EItJE_FN7FcCxj7vLty-MxqsG&s=10",
  },
  {
    name: "Academia aliada",
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSz2jqLB_DYibNFectiTIF1iQVikhB6swJswtbSei7EQ1utgXB-MYZ3qU62&s=10",
  },
  {
    name: "Grupo Ciencias",
    src: "/images/academias/grupo-ciencias.png",
  },
  {
    name: "CEMTA",
    src: "/images/academias/cemta.png",
  },
];

function PartnerLogo({ partner }: { partner: Partner }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="partner-item is-text" title={partner.name}>
        {partner.name}
      </span>
    );
  }

  return (
    <span className="partner-item">
      <img
        src={partner.src}
        alt={partner.name}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
      />
    </span>
  );
}

export default function PartnerMarquee() {
  // Se duplica la lista para que el bucle sea continuo.
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <div className="partner-marquee" aria-label="Academias y canales aliados">
      <div className="partner-track">
        {loop.map((partner, index) => (
          <PartnerLogo key={`${partner.name}-${index}`} partner={partner} />
        ))}
      </div>
    </div>
  );
}
