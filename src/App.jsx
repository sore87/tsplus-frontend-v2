import { useState, useRef, useEffect, Fragment } from "react";
import "./App.css";

const API_URL = typeof import.meta !== 'undefined' && import.meta.env
  ? (import.meta.env.VITE_API_URL || "http://localhost:8000")
  : "https://tsplus-backend.onrender.com";

const T = {
  fr: {
    logo: "Générateur de rapports commerciaux",
    heroTitle: "Transformez votre export CSV issu du portail",
    heroEm: "en rapport commercial",
    heroSub: "Importez votre CSV et générez un fichier Excel et un rapport PDF pour préparer vos propositions commerciales (Update & Support + Upsell) auprès de vos partenaires",
    dropLabel: "Glissez vos fichiers CSV ici",
    dropHint: "ou cliquez pour sélectionner — plusieurs fichiers acceptés",
    btnGenerate: "Générer le rapport Excel →",
    btnGenerateBatch: (n) => `Générer ${n} rapports (ZIP) →`,
    sheetsTitle: "📑 Onglets à générer",
    agentTitle: "👤 Identité de l'ingénieur d'affaires",
    senderLabel: "Nom de l'ingénieur d'affaires",
    senderPlaceholder: "ex : Jean Dupont",
    senderEmailLabel: "Email de l'ingénieur d'affaires",
    senderEmailPlaceholder: "ex : jean@societe.fr",
    pdfTitle: "📄 Rapport PDF client",
    pdfExperimental: "Fonctionnalité expérimentale — en cours d'évolution",
    pdfHint: "Un document HTML s'ouvrira dans un nouvel onglet · Utilisez Ctrl+P pour l'imprimer en PDF",
    pdfOptionLabel: "Date de co-terming à mettre en avant",
    pdfOptionA: "Option A — Court terme (recommandée)",
    pdfOptionB: "Option B — Moyen terme (recommandée)",
    pdfOptionC: "Option C — Long terme (recommandée)",
    pdfOptionNone: "Aucune (pas de recommandation)",
    pdfBtnPreview: "Aperçu PDF →",
    aiTitle: "🤖 Résumé commercial IA",
    aiHint: "Génère un paragraphe de synthèse pour préparer votre appel client",
    aiBtn: "Générer le résumé →",
    aiGenerating: "Rédaction en cours…",
    aiCopy: "Copier",
    aiCopied: "Copié !",
    aiRegen: "Regénérer",
    aiNoFile: "Uploadez un CSV pour générer un résumé.",
    aiError: "Erreur lors de la génération.",
    discountTitle: "🏷️ Remise & alertes",
    discountLabel: "Remise partenaire (%)",
    expiryLabel: "Seuil d'alerte expiration (jours)",
    currencyTitle: "💱 Devise du rapport",
    currencyLabel: "Devise",
    currencyRate: "Taux appliqué",
    currencyLoading: "Récupération du taux…",
    currencyError: "Taux indisponible — saisir manuellement",
    currencyManual: "Taux manuel (optionnel)",
    currencyEstimate: "Estimation FastSpring (+3,5% sur taux marché)",
    cotermTitle: "📅 Dates de co-terming",
    cotermHint: "Laissez vide pour calcul automatique",
    cotermModeAuto: "⚡ Automatique",
    cotermModeCustom: "✏️ Personnaliser",
    cotermAutoHint: "Dates calculées depuis les expirations du CSV",
    cotermCustomHint: "Saisissez 1 à 3 dates · min. 1 an à partir d'aujourd'hui",
    cotermTagManual: "Manuelle",
    cotermTagAuto: (ref) => `Auto → ${ref}+13m`,
    cotermDate: (n) => `Date ${n}`,
    cotermBatchWarn: "Ces dates de co-terming seront appliquées à tous les fichiers du lot.",
    summaryBatch: (n) => `${n} rapports générés — ZIP téléchargé`,
    summarySingle: "Rapport généré et téléchargé",
    batchHint: (n) => `📦 ${n} fichiers — un ZIP sera généré`,
    errNoFile: "Veuillez d'abord sélectionner au moins un fichier CSV.",
    errCotermDate: "Les dates de co-terming doivent être au moins dans 1 an.",
    errNotCsv: "Veuillez déposer des fichiers .csv",
    errTooLarge: (name, n) => `⚠️ ${name} contient ${n} lignes. La limite est de 12 000 lignes pour éviter une surcharge du serveur.`,
    partnerNotFound: "Nom non détecté",
    footer: "Générateur de rapports commerciaux TSplus",
    faqTitle: "Questions fréquentes",
    preview: "Aperçu du parc",
    previewGlobal: "Vue globale",
    previewLoading: "Analyse en cours…",
    previewError: "Impossible d'analyser ce fichier.",
    statTotal: "licences totales",
    statActive: "U&S actif",
    statExpiring: (days) => `expiration < ${days}j`,
    statExpired: "U&S expiré",
    statIdFull: "● Totale",
    statIdPartial: (nm, nc) => `◐ Partielle (${nm} sans machine, ${nc} sans client)`,
    statIdNone: "○ Non identifiée",
    chartProducts: "Répartition par produit",
    chartStatus: "Statut U&S",
    chartMonthly: "Expirations — 12 prochains mois",
    cotermSection: "Dates de co-terming candidates",
    cotermSubtitle: (pct) => `remise partenaire −${pct}% appliquée`,
    optShort: "Court terme",
    optMedium: "Moyen terme",
    optLong: "Long terme",
    totalCost: "Coût total",
    annualCost: "Coût / an",
    savingsVsA: (v) => `↓ −${v} €/an vs Option A`,
    usActive: "Actif",
    usExpiring: "Expire bientôt",
    usExpired: "Expiré",
    usUnknown: "Inconnu",
    faqItems: [
      { emoji: "❓", q: "Quel format de fichier CSV est accepté ?", a: "Le fichier doit être un export direct depuis le portail de License Portal TSplus." },
      { emoji: "💰", q: "Sur quelle base les prix sont-ils calculés ?", a: "Les calculs sont effectués sur les prix publics TSplus en euros. Consulter : https://assets-wp.tsplus.net/TSplus-Pricing-EUR.pdf — Les valeurs avant remise sont obtenues en divisant les prix publics par 1,21." },
      { emoji: "🏷️", q: "Comment fonctionne la remise partenaire ?", a: "La remise saisie dans l'interface est appliquée directement sur ces prix publics en euros pour calculer votre prix revendeur." },
      { emoji: "📅", q: "Qu'est-ce que le co-terming ?", a: "C'est le fait d'aligner toutes les dates de renouvellement d'un client sur une même date. Cela simplifie la gestion et facilite la vente de renouvellements groupés." },
      { emoji: "🧮", q: "Comment le script choisit-il les dates automatiquement ?", a: <>
        Sans saisie de votre part, le script analyse les dates d'expiration de toutes les licences du CSV et propose 3 options alignées sur les taux de renouvellement TSplus :<br /><br />
        <strong>Option A — Court terme · taux 21 %</strong><br />
        Aujourd'hui + 13 mois. Décalée d'1 mois au-delà de la dernière expiration dans la fenêtre 0–12 mois pour couvrir les licences qui expirent bientôt.<br /><br />
        <strong>Option B — Moyen terme · taux 18 %</strong><br />
        Aujourd'hui + 25 mois minimum. Garantit 2 ans de durée pour bénéficier du taux préférentiel.<br /><br />
        <strong>Option C — Long terme · taux 15 %</strong><br />
        Aujourd'hui + 37 mois minimum. Le taux le plus avantageux, sans renouvellement intermédiaire.<br /><br />
        Chaque date inclut une marge d'1 mois pour laisser le temps au client de décider avant que les licences expirent.
      </> },
      { emoji: "🗓️", q: "Comment personnaliser les dates de co-terming ?", a: <>
        Vous pouvez saisir 1, 2 ou 3 dates dans la section "📅 Dates de co-terming" pour remplacer les dates calculées automatiquement. Les dates sont triées chronologiquement et assignées dans l'ordre A → B → C.<br /><br />
        <strong>1 date saisie</strong><br />Option A = votre date · Options B et C calculées automatiquement après Option A (écart minimum de 13 mois entre chaque).<br /><br />
        <strong>2 dates saisies</strong><br />Options A et B = vos dates · Option C calculée automatiquement après Option B.<br /><br />
        <strong>3 dates saisies</strong><br />Options A, B et C = vos trois dates uniquement · aucun calcul automatique.<br /><br />
        <strong>Aucune date saisie</strong><br />Les 3 options sont calculées entièrement automatiquement.<br /><br />
        ⚠️ Toutes les dates doivent être situées à au moins 1 an à partir d'aujourd'hui.
      </> },
      { emoji: "💱", q: "Comment fonctionne la conversion en devise locale ?", a: <>
        Lorsque vous choisissez une devise autre que l'euro ou le dollar, les prix sont convertis en deux étapes :<br /><br />
        <strong>1. Taux de marché en temps réel</strong><br />
        Le taux USD → devise cible est récupéré automatiquement depuis <a href="https://www.frankfurter.app" target="_blank" rel="noreferrer">Frankfurter.app</a> (source BCE), mis à jour chaque jour.<br /><br />
        <strong>2. Majoration FastSpring de +3,5 %</strong><br />
        FastSpring applique une majoration de 3,5 % sur le taux du marché pour les devises majeures (GBP, AUD, CAD, CHF, JPY…) afin de couvrir les fluctuations. Ce rapport applique la même logique pour rester cohérent avec les prix réels facturés.<br /><br />
        <strong>⚠️ Précautions importantes</strong><br />
        Ces prix sont des <strong>estimations indicatives</strong>. TSplus peut avoir des prix fixes négociés dans certaines devises qui peuvent différer. Les taux de change varient quotidiennement. Ne pas utiliser ces montants comme prix contractuels sans vérification auprès de TSplus.
      </> },
      { emoji: "🔒", q: "Mes données sont-elles confidentielles ?", a: "Oui. Les fichiers CSV sont supprimés immédiatement après traitement. Les fichiers Excel et ZIP sont supprimés dès que votre téléchargement est terminé. Aucun stockage, aucune base de données." },
      { emoji: "✉️", q: "À quoi sert l'onglet E-mail ?", a: "Il génère un modèle d'email personnalisé prêt à envoyer au client, avec un résumé de son parc de licences." },

    ],
    sheetLabels: {
      inventory: "📋 Inventaire",
      coterm: "📅 Co-terming",
      upsell: "📈 Upsell",
      server_inv: "🖥️ Serveurs",
      synth_prop: "🔍 Synthèse",
      csv_raw: "📄 CSV d'origine",
    },
    tooltips: {
      inventory: "Inventaire complet des licences avec statut du support et alertes d'expiration",
      coterm: "Analyse des dates d'échéance pour aligner les renouvellements (co-terming)",
      upsell: "Opportunités de montée en gamme et calcul des prix de renouvellement",
      server_inv: "Inventaire des serveurs identifiés dans le parc de licences",
      synth_prop: "Synthèse globale et proposition commerciale récapitulative",
      csv_raw: "Données brutes du CSV d'origine pour référence",
    },
    months: ["Jan.","Fév.","Mar.","Avr.","Mai","Juin","Juil.","Août","Sep.","Oct.","Nov.","Déc."],
  },
  en: {
    logo: "Commercial Report Generator",
    heroTitle: "Transform your CSV export from the portal",
    heroEm: "into a commercial report",
    heroSub: "Import your CSV and generate an Excel file and a PDF report to prepare your commercial proposals (Update & Support + Upsell) for your partners",
    dropLabel: "Drop your CSV files here",
    dropHint: "or click to select — multiple files accepted",
    btnGenerate: "Generate Excel report →",
    btnGenerateBatch: (n) => `Generate ${n} reports (ZIP) →`,
    sheetsTitle: "📑 Sheets to generate",
    agentTitle: "👤 Business engineer identity",
    senderLabel: "Business engineer name",
    senderPlaceholder: "e.g. John Smith",
    senderEmailLabel: "Business engineer email",
    senderEmailPlaceholder: "e.g. john@company.com",
    pdfTitle: "📄 Client PDF report",
    pdfExperimental: "Experimental feature — work in progress",
    pdfHint: "An HTML document will open in a new tab · Use Ctrl+P to print as PDF",
    pdfOptionLabel: "Co-terming date to highlight",
    pdfOptionA: "Option A — Short term (recommended)",
    pdfOptionB: "Option B — Medium term (recommended)",
    pdfOptionC: "Option C — Long term (recommended)",
    pdfOptionNone: "None (no recommendation)",
    pdfBtnPreview: "PDF preview →",
    aiTitle: "🤖 AI commercial summary",
    aiHint: "Generates a synthesis paragraph to prepare your client call",
    aiBtn: "Generate summary →",
    aiGenerating: "Writing…",
    aiCopy: "Copy",
    aiCopied: "Copied!",
    aiRegen: "Regenerate",
    aiNoFile: "Upload a CSV to generate a summary.",
    aiError: "Error during generation.",
    discountTitle: "🏷️ Discount & alerts",
    discountLabel: "Partner discount (%)",
    expiryLabel: "Expiry alert threshold (days)",
    currencyTitle: "💱 Report currency",
    currencyLabel: "Currency",
    currencyRate: "Applied rate",
    currencyLoading: "Fetching rate…",
    currencyError: "Rate unavailable — enter manually",
    currencyManual: "Manual rate (optional)",
    currencyEstimate: "FastSpring estimate (+3.5% on market rate)",
    cotermTitle: "📅 Co-terming dates",
    cotermHint: "Leave blank for automatic calculation",
    cotermModeAuto: "⚡ Automatic",
    cotermModeCustom: "✏️ Customise",
    cotermAutoHint: "Dates calculated from CSV expiries",
    cotermCustomHint: "Enter 1 to 3 dates · min. 1 year from today",
    cotermTagManual: "Manual",
    cotermTagAuto: (ref) => `Auto → ${ref}+13m`,
    cotermDate: (n) => `Date ${n}`,
    cotermBatchWarn: "These co-terming dates will be applied to all files in the batch.",
    summaryBatch: (n) => `${n} reports generated — ZIP downloaded`,
    summarySingle: "Report generated and downloaded",
    batchHint: (n) => `📦 ${n} files — a ZIP will be generated`,
    errNoFile: "Please select at least one CSV file first.",
    errCotermDate: "Co-terming dates must be at least 1 year from today.",
    errNotCsv: "Please drop .csv files only.",
    errTooLarge: (name, n) => `⚠️ ${name} contains ${n} lines. The limit is 12,000 lines to avoid server overload.`,
    partnerNotFound: "Name not detected",
    footer: "TSplus Commercial Report Generator",
    faqTitle: "Frequently asked questions",
    preview: "Portfolio overview",
    previewGlobal: "Global view",
    previewLoading: "Analysing…",
    previewError: "Unable to analyse this file.",
    statTotal: "total licences",
    statActive: "U&S active",
    statExpiring: (days) => `expiry < ${days}d`,
    statExpired: "U&S expired",
    statIdFull: "● Complete",
    statIdPartial: (nm, nc) => `◐ Partial (${nm} no machine, ${nc} no client)`,
    statIdNone: "○ Unidentified",
    chartProducts: "Product breakdown",
    chartStatus: "U&S status",
    chartMonthly: "Expiries — next 12 months",
    cotermSection: "Co-terming candidate dates",
    cotermSubtitle: (pct) => `${pct}% partner discount applied`,
    optShort: "Short term",
    optMedium: "Medium term",
    optLong: "Long term",
    totalCost: "Total cost",
    annualCost: "Cost / year",
    savingsVsA: (v) => `↓ −${v} $/year vs Option A`,
    usActive: "Active",
    usExpiring: "Expiring soon",
    usExpired: "Expired",
    usUnknown: "Unknown",
    faqItems: [
      { emoji: "❓", q: "What CSV format is accepted?", a: "The file must be a direct export from the TSplus License Portal." },
      { emoji: "💰", q: "What prices are used for calculations?", a: "Calculations are based on TSplus official public prices in USD. View: https://tsplus.net/assets/TSplus-Pricing-2026.pdf — License values before discount are calculated by dividing public prices by 1.21." },
      { emoji: "🏷️", q: "How does the partner discount work?", a: "The discount entered in the interface is applied directly to public USD prices to calculate your reseller price." },
      { emoji: "📅", q: "What is co-terming?", a: "Co-terming means aligning all renewal dates for a client to the same date. This simplifies management and makes grouped renewals easier to sell." },
      { emoji: "🧮", q: "How does the script choose dates automatically?", a: <>
        Without any input from you, the script analyses the expiry dates of all licences in the CSV and proposes 3 options aligned with TSplus renewal rates:<br /><br />
        <strong>Option A — Short term · 21% rate</strong><br />
        Today + 13 months. Shifted 1 month beyond the last expiry in the 0–12 month window to cover soon-expiring licences.<br /><br />
        <strong>Option B — Medium term · 18% rate</strong><br />
        Today + 25 months minimum. Guarantees 2 years duration to qualify for the preferential rate.<br /><br />
        <strong>Option C — Long term · 15% rate</strong><br />
        Today + 37 months minimum. The most advantageous rate, with no intermediate renewal.<br /><br />
        Each date includes a 1-month buffer to give the client time to decide before licences expire.
      </> },
      { emoji: "🗓️", q: "How to customise co-terming dates?", a: <>
        You can enter 1, 2 or 3 dates in the "📅 Co-terming dates" section to replace the automatically calculated dates. Dates are sorted chronologically and assigned in order A → B → C.<br /><br />
        <strong>1 date entered</strong><br />Option A = your date · Options B and C calculated automatically after Option A (minimum 13-month gap between each).<br /><br />
        <strong>2 dates entered</strong><br />Options A and B = your dates · Option C calculated automatically after Option B.<br /><br />
        <strong>3 dates entered</strong><br />Options A, B and C = your three dates only · no automatic calculation.<br /><br />
        <strong>No date entered</strong><br />All 3 options are calculated fully automatically.<br /><br />
        ⚠️ All dates must be at least 1 year from today.
      </> },
      { emoji: "💱", q: "How does local currency conversion work?", a: <>
        When you choose a currency other than euros or dollars, prices are converted in two steps:<br /><br />
        <strong>1. Real-time market rate</strong><br />
        The USD → target currency rate is fetched automatically from <a href="https://www.frankfurter.app" target="_blank" rel="noreferrer">Frankfurter.app</a> (ECB source), updated daily.<br /><br />
        <strong>2. FastSpring +3.5% markup</strong><br />
        FastSpring applies a 3.5% markup over the market rate for major currencies (GBP, AUD, CAD, CHF, JPY…) to cover fluctuations. This report applies the same logic to stay consistent with actual invoiced prices.<br /><br />
        <strong>⚠️ Important caveats</strong><br />
        These prices are <strong>indicative estimates only</strong>. TSplus may have fixed negotiated prices in certain currencies that could differ. Exchange rates change daily. Do not use these amounts as contractual prices without verifying with TSplus.
      </> },
      { emoji: "🔒", q: "Is my data kept confidential?", a: "Yes. CSV files are deleted immediately after processing. Excel and ZIP files are deleted as soon as your download completes. No storage, no database." },
      { emoji: "✉️", q: "What is the E-mail sheet for?", a: "It generates a personalised email template ready to send to the client, summarising their license portfolio." },

    ],
    sheetLabels: {
      inventory: "📋 Inventory",
      coterm: "📅 Co-terming",
      upsell: "📈 Upsell",
      server_inv: "🖥️ Servers",
      synth_prop: "🔍 Summary",
      csv_raw: "📄 Original CSV",
    },
    tooltips: {
      inventory: "Complete license inventory with support status and expiry alerts",
      coterm: "Deadline analysis to align renewals (co-terming)",
      upsell: "Upsell opportunities and renewal price calculation",
      server_inv: "Inventory of servers identified in the license portfolio",
      synth_prop: "Global summary and commercial proposal recap",
      csv_raw: "Raw data from the original CSV for reference",
    },
    months: ["Jan.","Feb.","Mar.","Apr.","May","Jun.","Jul.","Aug.","Sep.","Oct.","Nov.","Dec."],
  },
};

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  return `${(bytes / 1024).toFixed(1)} Ko`;
}

function fmt(n) {
  return Math.round(n).toLocaleString("fr-FR");
}

function DonutSVG({ data, colors, size = 110 }) {
  const total = data.reduce((a, b) => a + b, 0);
  if (total === 0) return <div style={{width:size,height:size}}/>;
  const cx = size/2, cy = size/2, r = size*0.38, inner = size*0.24;

  // Cas 1 produit : arc à 360° impossible en SVG → cercles concentriques
  const nonZero = data.filter(v => v > 0);
  if (nonZero.length === 1) {
    const colorIdx = data.findIndex(v => v > 0);
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill={colors[colorIdx % colors.length]}/>
        <circle cx={cx} cy={cy} r={inner} fill="var(--bg)"/>
      </svg>
    );
  }

  let angle = -Math.PI/2;
  const slices = data.map((v, i) => {
    if (v === 0) return null;
    const sweep = (v/total)*2*Math.PI;
    const x1 = cx+r*Math.cos(angle), y1 = cy+r*Math.sin(angle);
    angle += sweep;
    const x2 = cx+r*Math.cos(angle), y2 = cy+r*Math.sin(angle);
    const xi1 = cx+inner*Math.cos(angle-sweep), yi1 = cy+inner*Math.sin(angle-sweep);
    const xi2 = cx+inner*Math.cos(angle), yi2 = cy+inner*Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;
    return <path key={i} d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} L ${xi2} ${yi2} A ${inner} ${inner} 0 ${large} 0 ${xi1} ${yi1} Z`} fill={colors[i]} />;
  });
  return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>{slices}</svg>;
}

const PROD_COLORS = ["#378add","#1D9E75","#e8620a","#D4537E","#BA7517","#888780"];
const US_COLORS   = ["#3fb950","#e8620a","#f85149","#888780"];

function PartnerPreview({ data, t, discount, expiryDays }) {
  const [emailOpen, setEmailOpen] = useState(false);
  const currency = t === T.en ? "$" : "€";
  const sym      = t === T.en ? "$" : "€";
  const fmtAmt   = (v) => v > 0
    ? (t === T.en
        ? `${sym}${Math.round(v).toLocaleString("en-US")}`
        : `${Math.round(v).toLocaleString("fr-FR")} ${sym}`)
    : "—";
  const products = Object.entries(data.products || {});
  const now = new Date();
  const monthData = data.monthly_expiries || {};

  return (
    <div className="preview-partner">

      {/* Nom + badge serveur */}
      {(data.company_name || data._source === "local") && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1rem",gap:"8px"}}>
          {data.company_name && (
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            {data.email_domain && (
              <img
                src={`https://img.logo.dev/${data.email_domain}?token=pk_IgUXh62XTkaBFXwBTgMV1A&size=40`}
                alt=""
                style={{height:"22px",width:"22px",borderRadius:"4px",objectFit:"contain",border:"1px solid var(--border)"}}
                onError={e=>{ e.target.style.display="none"; }}
              />
            )}
            <div style={{fontWeight:700,fontSize:"1.05rem",color:"var(--text)"}}>{data.company_name}</div>
          </div>
        )}
          {data._source === "local" && (
            <span style={{fontSize:"10px",padding:"2px 7px",borderRadius:"20px",background:"rgba(248,81,73,.1)",color:"var(--err)",border:"1px solid rgba(248,81,73,.25)",whiteSpace:"nowrap",flexShrink:0}}>
              ⚠ {t === T.en ? "Estimate — server unavailable" : "Estimation — serveur indisponible"}
            </span>
          )}
        </div>
      )}

      {/* ── Bloc 1 : PARC (sans carte) ── */}
      <div style={{marginBottom:"1rem"}}>
        <div className="preview-stats-new">
          <div className="pstat-total">
            <div className="pstat-val">{data.total}</div>
            <div className="pstat-lbl">{t.statTotal}</div>
          </div>
          <div className="pstat-sub-row">
            <div className="pstat pstat-ok"><div className="pstat-val">{data.active}</div><div className="pstat-lbl">{t.statActive}</div></div>
            <div className="pstat pstat-warn"><div className="pstat-val">{data.expiring_soon}</div><div className="pstat-lbl">{t.statExpiring(expiryDays)}</div></div>
            <div className="pstat pstat-err"><div className="pstat-val">{data.expired_us}</div><div className="pstat-lbl">{t.statExpired}</div></div>
          </div>
        </div>
        {data.id_counts && (
          <>
            <div className="pstat-id-divider"><span>Identification</span></div>
            <div className="pstat-id-row">
              <div className="pstat-id"><div className="pstat-id-val">{data.id_counts.full}</div><div className="pstat-id-lbl">{t.statIdFull}</div></div>
              <div className="pstat-id">
                <div className="pstat-id-val">{(data.id_counts.partial_no_machine||0)+(data.id_counts.partial_no_client||0)}</div>
                <div className="pstat-id-lbl">{t.statIdPartial(data.id_counts.partial_no_machine||0,data.id_counts.partial_no_client||0)}</div>
              </div>
              <div className="pstat-id"><div className="pstat-id-val">{data.id_counts.none}</div><div className="pstat-id-lbl">{t.statIdNone}</div></div>
            </div>
          </>
        )}
      </div>

      {/* ── Bloc 2 : COMPOSITION (centré, ~moitié largeur) ── */}
      {products.length > 0 && (
        <div className="preview-block" style={{maxWidth:"55%",margin:"0 auto .75rem"}}>
          <div className="preview-block-title">{t.chartProducts}</div>
          <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
            <DonutSVG data={products.map(([,v])=>v)} colors={PROD_COLORS} />
            <div className="pchart-legend" style={{flex:1}}>
              {products.map(([k,v],i) => (
                <div key={k} className="pchart-legend-item">
                  <div className="pchart-dot" style={{background:PROD_COLORS[i%PROD_COLORS.length]}}/>
                  <span style={{flex:1,minWidth:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{k.replace("TSplus ","")}</span>
                  <span className="pchart-pct">{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Bloc 3 : CO-TERMING ── */}
      {data.coterm_options?.length > 0 && (
        <div className="preview-block">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".75rem"}}>
            <div className="preview-block-title" style={{margin:0}}>{t.cotermSection}</div>
            <span style={{fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"20px",background:"rgba(232,98,10,.12)",color:"var(--accent)",border:"1px solid rgba(232,98,10,.25)"}}>{t.cotermSubtitle(discount)}</span>
          </div>
          <div className="coterm-rich-grid">
            {(() => {
              const showSavings = data.coterm_options.every(o => o.savings_vs_a > 0);
              return data.coterm_options.map((opt, i) => {
              const hasCosts = opt.total_cost > 0;
              const label    = t === T.en ? opt.label_en : opt.label_fr;
              const HDRS     = ["#1A3A5C","#1E4E7A","#1a6ea3"];
              return (
                <div key={opt.option} className="coterm-rich-card">
                  <div className="coterm-rich-header" style={{background:HDRS[i]}}>
                    <span className="coterm-rich-opt">Option {opt.option}</span>
                    <span className="coterm-rich-lbl-hdr">{label}</span>
                  </div>
                  <div className="coterm-rich-body">
                    <div className="coterm-rich-date">{opt.date_display}</div>
                    <div className="coterm-rich-meta">{opt.rate}% / an · ≃ {opt.duration_months ?? opt.duration_years*12} mois</div>
                    {hasCosts && <>
                      <hr className="coterm-rich-hr"/>
                      <div className="coterm-rich-row">
                        <span className="coterm-rich-lbl">{t.totalCost}</span>
                        <span className="coterm-rich-annual">{fmtAmt(opt.total_cost)}</span>
                      </div>
                      <div className="coterm-rich-row">
                        <span className="coterm-rich-lbl">{t.annualCost}</span>
                        <span className="coterm-rich-val">{fmtAmt(opt.annual_cost)}</span>
                      </div>
                      {showSavings && opt.savings_vs_a > 0 && <div className="coterm-rich-savings">↓ {fmtAmt(opt.savings_vs_a)} vs A</div>}
                    </>}
                  </div>
                </div>
              );
            })})()}
          </div>
        </div>
      )}

      {data.email_content && (
        <div className="email-toggle-wrap">
          <button className="email-toggle-btn" onClick={() => setEmailOpen(o => !o)}>
            <span>✉️ {t === T.en ? "Client email" : "Email client"}</span>
            <span className="email-toggle-arrow">{emailOpen ? "▲" : "▼"}</span>
          </button>
          {emailOpen && (
            <div className="email-preview-body">
              <div className="email-preview-subject">{data.email_content.subject}</div>
              <div className="email-preview-text">
                {data.email_content.segments?.length > 0
                  ? data.email_content.segments.map((seg, i) =>
                      seg.text === "\n"
                        ? <br key={i}/>
                        : <span key={i} style={seg.type === "custom" ? {color:"var(--accent)",fontWeight:500} : {}}>{seg.text}</span>
                    )
                  : <pre style={{fontFamily:"inherit",fontSize:"inherit",whiteSpace:"pre-wrap",margin:0}}>{data.email_content.body}</pre>
                }
              </div>
              <button className="email-copy-btn" onClick={() => {
                navigator.clipboard.writeText(
                  `${data.email_content.subject}\n\n${data.email_content.body}`
                );
              }}>
                📋 {t === T.en ? "Copy" : "Copier"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GlobalPreview({ analyses, t, discount, expiryDays }) {
  const total    = analyses.reduce((s,a) => s+(a.data?.total||0), 0);
  const active   = analyses.reduce((s,a) => s+(a.data?.active||0), 0);
  const expiring = analyses.reduce((s,a) => s+(a.data?.expiring_soon||0), 0);
  const expired  = analyses.reduce((s,a) => s+(a.data?.expired_us||0), 0);
  const idFull    = analyses.reduce((s,a) => s+(a.data?.id_counts?.full||0), 0);
  const idPartialNM = analyses.reduce((s,a) => s+(a.data?.id_counts?.partial_no_machine||0), 0);
  const idPartialNC = analyses.reduce((s,a) => s+(a.data?.id_counts?.partial_no_client||0), 0);
  const idNone    = analyses.reduce((s,a) => s+(a.data?.id_counts?.none||0), 0);
  const hasId = idFull + idPartialNM + idPartialNC + idNone > 0;
  return (
    <div className="preview-partner">
      <div className="preview-stats-new">
        <div className="pstat-total">
          <div className="pstat-val">{total}</div>
          <div className="pstat-lbl">{t.statTotal}</div>
        </div>
        <div className="pstat-sub-row">
          <div className="pstat pstat-ok"><div className="pstat-val">{active}</div><div className="pstat-lbl">{t.statActive}</div></div>
          <div className="pstat pstat-warn"><div className="pstat-val">{expiring}</div><div className="pstat-lbl">{t.statExpiring(expiryDays)}</div></div>
          <div className="pstat pstat-err"><div className="pstat-val">{expired}</div><div className="pstat-lbl">{t.statExpired}</div></div>
        </div>
      </div>
      {hasId && (
        <>
          <div className="pstat-id-divider">
            <span>{t === T.en ? "Identification" : "Identification"}</span>
          </div>
          <div className="pstat-id-row">
            <div className="pstat-id"><div className="pstat-id-val">{idFull}</div><div className="pstat-id-lbl">{t.statIdFull}</div></div>
            <div className="pstat-id">
              <div className="pstat-id-val">{idPartialNM + idPartialNC}</div>
              <div className="pstat-id-lbl">{t.statIdPartial(idPartialNM, idPartialNC)}</div>
            </div>
            <div className="pstat-id"><div className="pstat-id-val">{idNone}</div><div className="pstat-id-lbl">{t.statIdNone}</div></div>
          </div>
        </>
      )}
      <div className="global-partner-list">
        {analyses.map((a,i) => {
          if (!a.data) return null;
          const actPct = a.data.total > 0 ? Math.round(a.data.active/a.data.total*100) : 0;
          const color = actPct>=80?"#3fb950":actPct>=60?"#e8620a":"#f85149";
          return (
            <div key={i} className="global-partner-row">
              <div className="global-partner-dot" style={{background:PROD_COLORS[i%PROD_COLORS.length]}}/>
              <div className="global-partner-name">{a.data.company_name || a.fileName}</div>
              <div className="global-partner-count">{a.data.total} lic.</div>
              <div className="global-bar-wrap"><div className="global-bar-fill" style={{width:`${actPct}%`,background:color}}/></div>
              <div className="global-partner-pct" style={{color}}>{a.data.active}/{a.data.total} <span style={{fontSize:"10px",opacity:.8}}>U&S actif &gt; {expiryDays}j</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FAQ({ t }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="faq">
      <h2 className="faq-title">{t.faqTitle}</h2>
      <div className="faq-list">
        {t.faqItems.map((item,i) => (
          <div key={i} className={`faq-item ${open===i?"open":""}`}>
            <button className="faq-question" onClick={()=>setOpen(open===i?null:i)}>
              <span className="faq-emoji">{item.emoji}</span>
              <span>{item.q}</span>
              <span className="faq-chevron">{open===i?"▲":"▼"}</span>
            </button>
            {open===i && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [files, setFiles]           = useState([]);
  const [dragging, setDragging]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [genStep, setGenStep]       = useState(null);
  const [genStepIdx, setGenStepIdx] = useState(0);
  const GEN_STEPS_COUNT = 5;
  const [error, setError]           = useState("");
  const [summary, setSummary]       = useState(null);
  const [darkMode, setDarkMode]     = useState(() => {
    return localStorage.getItem("theme_v2") === "dark"; // nouvelle clé → repart en clair
  });
  const [v2Tab, setV2Tab] = useState("dashboard");

  // ── Mode base globale ──────────────────────────────────────────────
  const MASTER_PWD = (typeof import.meta !== "undefined" && import.meta.env?.VITE_MASTER_PASSWORD) || "tsplus2025";
  const [masterAuth, setMasterAuth]           = useState(() => sessionStorage.getItem("master_auth") === "1");
  const [masterPwdInput, setMasterPwdInput]   = useState("");
  const [masterPwdError, setMasterPwdError]   = useState(false);
  const [showMasterLogin, setShowMasterLogin] = useState(false);
  const [masterRows, setMasterRows]           = useState([]);
  const [masterSearch, setMasterSearch]       = useState("");
  const [masterClients, setMasterClients]     = useState([]);
  const [masterLoaded, setMasterLoaded]       = useState(null);
  const masterCsvRef = useRef();
  const [tooltip, setTooltip]       = useState(null);
  const [partnerNames, setPartnerNames] = useState({});
  const [lang, setLang]             = useState(() => localStorage.getItem("lang") || "fr");
  const [analyses, setAnalyses]     = useState({});
  const [analyzing, setAnalyzing]   = useState(false);
  const [activeTab, setActiveTab]   = useState("global");
  const [serverStatus, setServerStatus] = useState("checking");
  const [dlFeedback, setDlFeedback]     = useState(null); // {msg, count}
  const fileRef = useRef();
  const t = T[lang];

  const [sender, setSender]           = useState(() => localStorage.getItem("sender") || "");
  const [senderEmail, setSenderEmail] = useState(() => localStorage.getItem("senderEmail") || "");
  const AI_SUMMARY_ENABLED = false;
  const [aiSummary, setAiSummary]   = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiError, setAiError]       = useState("");
  const [aiCopied, setAiCopied]     = useState(false);
  const [pdfCoterm, setPdfCoterm]        = useState("B");
  const [pdfOptions, setPdfOptions]      = useState(["A","B","C"]);
  const [pdfShowInventory, setPdfShowInventory] = useState(true);
  const [pdfShowPrices, setPdfShowPrices]       = useState(true);
  const [pdfShowDisabled, setPdfShowDisabled]   = useState(false);
  const [pdfCustomMessage, setPdfCustomMessage] = useState("");
  const [pdfLogoManual, setPdfLogoManual]       = useState("");  // base64 logo uploadé manuellement
  const [detectedDiscount, setDetectedDiscount] = useState(null);
  const [pdfClient, setPdfClient]   = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [discount, setDiscount]       = useState(() => parseInt(localStorage.getItem("discount") || "20"));
  const [expiryDays, setExpiryDays]   = useState(() => parseInt(localStorage.getItem("expiryDays") || "90"));
  const [cotermDates, setCotermDates] = useState(["","",""]);
  const [cotermMode, setCotermMode]   = useState(() => localStorage.getItem("cotermMode") || "auto");
  const [sheets, setSheets] = useState({
    inventory:true, coterm:true, upsell:true,
    server_inv:true, synth_prop:true, csv_raw:true,
  });

  const CURRENCIES = [
    { code: "USD", symbol: "$",  label: "🇺🇸 USD $"  },
    { code: "EUR", symbol: "€",  label: "🇪🇺 EUR €"  },
    { code: "GBP", symbol: "£",  label: "🇬🇧 GBP £"  },
    { code: "AUD", symbol: "A$", label: "🇦🇺 AUD A$" },
    { code: "CAD", symbol: "C$", label: "🇨🇦 CAD C$" },
    { code: "CHF", symbol: "Fr", label: "🇨🇭 CHF Fr" },
    { code: "JPY", symbol: "¥",  label: "🇯🇵 JPY ¥"  },
    { code: "BRL", symbol: "R$", label: "🇧🇷 BRL R$" },
    { code: "MXN", symbol: "$",  label: "🇲🇽 MXN $"  },
    { code: "SGD", symbol: "S$", label: "🇸🇬 SGD S$" },
    { code: "PLN", symbol: "zł", label: "🇵🇱 PLN zł" },
    { code: "RUB", symbol: "₽",  label: "🇷🇺 RUB ₽"  },
    { code: "TRY", symbol: "₺",  label: "🇹🇷 TRY ₺"  },
    { code: "KRW", symbol: "₩",  label: "🇰🇷 KRW ₩"  },
    { code: "CNY", symbol: "¥",  label: "🇨🇳 CNY ¥"  },
    { code: "INR", symbol: "₹",  label: "🇮🇳 INR ₹"  },
    { code: "SEK", symbol: "kr", label: "🇸🇪 SEK kr" },
  ];

  const [currency, setCurrency]     = useState("EUR");
  const [fxRate, setFxRate]         = useState(null);
  const [fxLoading, setFxLoading]   = useState(false);
  const [fxError, setFxError]       = useState(false);
  const [fxManual, setFxManual]     = useState("");

  const fetchRate = async (targetCurrency) => {
    if (targetCurrency === "USD") { setFxRate(1); setFxError(false); return; }
    if (targetCurrency === "EUR") { setFxRate(null); setFxError(false); return; }
    setFxLoading(true); setFxError(false);
    // Taux de secours (approximatifs, mis à jour manuellement si besoin)
    const fallbackRates = { GBP:0.80, CHF:0.92, CAD:1.38, AUD:1.55, JPY:150, SEK:10.5, NOK:10.8, DKK:7.1, PLN:4.0, CZK:23, HUF:370, RON:4.7, BRL:5.1, MXN:17, SGD:1.35, AED:3.67 };
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${targetCurrency}`, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await res.json();
      const marketRate = data.rates[targetCurrency];
      setFxRate(marketRate * 1.035);
      setFxError(false);
    } catch {
      // Utiliser le taux de secours
      if (fallbackRates[targetCurrency]) {
        setFxRate(fallbackRates[targetCurrency] * 1.035);
        setFxError(false);
      } else {
        setFxError(true);
        setFxRate(null);
      }
    } finally { setFxLoading(false); }
  };

  useEffect(() => { fetchRate(currency); }, [currency]);

  const minCotermDate = (() => {
    const d = new Date(); d.setFullYear(d.getFullYear()+1);
    return d.toISOString().split("T")[0];
  })();

  const checkServer = async () => {
    const start = Date.now();
    try {
      const res = await fetch(`${API_URL}/`, { signal: AbortSignal.timeout(35000) });
      const elapsed = Date.now() - start;
      if (res.ok) {
        setServerStatus(elapsed > 4000 ? "warming" : "ok");
        if (elapsed > 4000) setTimeout(() => setServerStatus("ok"), 3000);
      } else {
        setServerStatus("error");
      }
    } catch {
      setServerStatus("error");
    }
  };

  // Retry toutes les 20s si le serveur est indisponible au démarrage
  useEffect(() => {
    let retryTimer = null;
    const retryIfNeeded = () => {
      if (serverStatus === "error" || serverStatus === "checking") {
        checkServer();
        retryTimer = setTimeout(retryIfNeeded, 20000);
      }
    };
    retryTimer = setTimeout(retryIfNeeded, 20000);
    return () => clearTimeout(retryTimer);
  }, [serverStatus]);

  useEffect(()=>{ document.body.classList.toggle("light",!darkMode); localStorage.setItem("theme_v2", darkMode ? "dark" : "light"); },[darkMode]);
  useEffect(()=>{ localStorage.setItem("sender",sender); },[sender]);
  useEffect(()=>{ localStorage.setItem("senderEmail",senderEmail); },[senderEmail]);
  useEffect(()=>{ localStorage.setItem("discount",discount); },[discount]);
  useEffect(()=>{ localStorage.setItem("expiryDays",expiryDays); },[expiryDays]);
  useEffect(()=>{ localStorage.setItem("lang",lang); },[lang]);
  useEffect(()=>{ localStorage.setItem("cotermMode",cotermMode); },[cotermMode]);
  useEffect(()=>{
    if (files.length === 0) return;
    const rerun = async () => {
      setAnalyzing(true);
      for (const f of files) {
        setAnalyses(prev=>({...prev,[f.name]:{...prev[f.name],loading:true}}));
        const data = await runAnalyze(f, discount, expiryDays, lang, cotermDates, sender);
        setAnalyses(prev=>({...prev,[f.name]:{loading:false,data,fileName:f.name}}));
        // Mémoriser la remise détectée si présente
        if (data?.detected_discount != null) setDetectedDiscount(data.detected_discount);
      }
      setAnalyzing(false);
    };
    rerun();
  }, [expiryDays, discount, cotermDates, sender, lang]);
  useEffect(()=>{
    checkServer();
    const interval = setInterval(checkServer, 9 * 60 * 1000); // ping toutes les 9 min — évite le cold start Render
    return () => clearInterval(interval);
  }, []);

  const toggleSheet = (k) => setSheets(p=>({...p,[k]:!p[k]}));

  const detectPartner = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const lines = e.target.result.split("\n").slice(0, 10);
      const header = lines[0].split(";").map(h => h.trim().replace(/^"|"$/g,"").toLowerCase());
      const emailIdx = header.findIndex(h => h === "email");
      const ownerIdx = header.findIndex(h => h === "owner");

      let name = null;

      // Priorité : extraire le nom depuis le domaine email
      if (emailIdx >= 0) {
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(";");
          const email = cols[emailIdx]?.trim().replace(/"/g,"");
          if (email && email.includes("@")) {
            const domain = email.split("@")[1];
            const company = domain.split(".")[0]; // ex: "proinfo" ou "connect-informatique"
            name = company
              .split("-")
              .map(w => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
            break;
          }
        }
      }

      // Fallback : colonne owner
      if (!name && ownerIdx >= 0) {
        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(";");
          const val = cols[ownerIdx]?.trim().replace(/"/g,"");
          if (val) { name = val; break; }
        }
      }

      setPartnerNames(prev => ({...prev, [file.name]: name || t.partnerNotFound}));
    };
    reader.readAsText(file, "utf-8");
  };

  const analyzeCSV = async (file, expiryDays) => {
    try {
      const text = await file.text();
      const lines = text.split("\n").filter(l => l.trim());
      if (lines.length < 2) return null;

      const sep = ";";
      const header = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,"").toLowerCase());

      const idx = (name) => header.findIndex(h => h === name);
      const iStatus            = idx("status");
      const iWithSup           = idx("with_support");
      const iExpiry            = idx("support_expiry_date");
      const iSoftware          = idx("software");
      const iOwner             = idx("owner");
      const iEmail             = idx("email");
      const iUsers             = idx("users");
      const iCustomerComments  = idx("customer_comments");
      const iComputerName      = idx("computer_name");

      const today = new Date();
      today.setHours(0,0,0,0);
      const thresholdMs = expiryDays * 24 * 60 * 60 * 1000;

      let total = 0, active = 0, expiring = 0, expired = 0;
      let id_full = 0, id_partial_no_machine = 0, id_partial_no_client = 0, id_none = 0;
      const products = {};
      const monthly = {};
      let companyName = "";
      let emailDomain = "";

      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g,""));
        const status    = iStatus >= 0 ? cols[iStatus] : "";
        const withSup   = iWithSup >= 0 ? parseInt(cols[iWithSup]) : 0;
        const expiryRaw = iExpiry >= 0 ? cols[iExpiry] : "";
        const software  = iSoftware >= 0 ? cols[iSoftware] : "Autre";
        const softwareNorm = software.startsWith("Advanced Security") ? "Advanced Security" : software;
        const owner     = iOwner >= 0 ? cols[iOwner] : "";
        const email     = iEmail >= 0 ? cols[iEmail] : "";
        const users     = iUsers >= 0 ? parseInt(cols[iUsers]) || 1 : 1;

        { const sv = status.toLowerCase(); if (sv === "disabled" || sv === "disabling..." || sv === "hidden") continue; }

        // Détecter nom société depuis domaine email
        if (!companyName) {
          if (email && email.includes("@")) {
            const domain = email.split("@")[1];
            const company = domain.split(".")[0];
            companyName = company.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
            if (!emailDomain) emailDomain = domain;
          } else if (owner) {
            companyName = owner;
          }
        }

        // Compteurs d'identification (même logique que Python build_rows)
        const customerComments = iCustomerComments >= 0 ? cols[iCustomerComments].trim() : "";
        const computerName     = iComputerName     >= 0 ? cols[iComputerName].trim()     : "";
        const hasClient  = customerComments !== "" && customerComments.toLowerCase() !== "nan";
        const hasMachine = computerName     !== "" && computerName.toLowerCase()     !== "nan";
        if (hasClient && hasMachine)        id_full++;
        else if (hasClient && !hasMachine)  id_partial_no_machine++;
        else if (!hasClient && hasMachine)  id_partial_no_client++;
        else                                id_none++;

        total++;
        products[softwareNorm] = (products[softwareNorm] || 0) + 1;

        if (withSup !== 1) {
          expired++;
          continue;
        }

        if (!expiryRaw || expiryRaw === "—" || expiryRaw === "") {
          expired++;  // sans date = U&S inconnu → expiré
          continue;
        }

        const expDate = new Date(expiryRaw);
        if (isNaN(expDate.getTime())) { expired++; continue; }

        const diff = expDate - today;
        if (diff < 0) {
          expired++;
        } else if (diff <= thresholdMs) {
          expiring++;
          const key = `${expDate.getFullYear()}-${String(expDate.getMonth()+1).padStart(2,"0")}`;
          monthly[key] = (monthly[key] || 0) + 1;
        } else {
          active++;
          const key = `${expDate.getFullYear()}-${String(expDate.getMonth()+1).padStart(2,"0")}`;
          if (expDate - today <= 365 * 24 * 60 * 60 * 1000) {
            monthly[key] = (monthly[key] || 0) + 1;
          }
        }
      }

      // ── Détection de la remise depuis le CSV ──────────────────────
      let detected_discount = null;
      for (let i = 1; i < lines.length; i++) {
        const cols2 = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g,""));
        const statusVal = iStatus >= 0 ? cols2[iStatus] : "";
        { const sv3 = statusVal.toLowerCase(); if (sv3 === "disabled" || sv3 === "disabling..." || sv3 === "hidden") continue; }
        const rawVal = parseFloat(cols2[iUsers >= 0 ? iUsers : 0]) || 0; // placeholder
        // Chercher colonnes "price" et "public_price" pour calculer la remise
        const iPriceWithUs  = header.findIndex(h => h === "price_with_us" || h === "pricewithus");
        const iPricePublic  = header.findIndex(h => h === "public_price" || h === "publicprice" || h === "msrp");
        if (iPriceWithUs >= 0 && iPricePublic >= 0) {
          const priceUs  = parseFloat(cols2[iPriceWithUs]);
          const pricePublic = parseFloat(cols2[iPricePublic]);
          if (pricePublic > 0 && priceUs > 0 && priceUs < pricePublic) {
            detected_discount = Math.round((1 - priceUs / pricePublic) * 100);
            break;
          }
        }
        break; // one row check enough
      }
      const today2 = new Date(); today2.setHours(0,0,0,0);
      const MOIS_FR_CT = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

      // Compter les expirations futures par mois (YYYY-MM)
      const expiryMonthCounts = {};
      for (let i = 1; i < lines.length; i++) {
        const cols2 = lines[i].split(sep).map(c => c.trim().replace(/^"|"$/g,""));
        { const sv2 = (cols2[iStatus]||"").toLowerCase(); if (sv2 === "disabled" || sv2 === "disabling..." || sv2 === "hidden") continue; }
        const expiryRaw2 = iExpiry >= 0 ? cols2[iExpiry] : "";
        if (!expiryRaw2 || expiryRaw2 === "—") continue;
        const expD = new Date(expiryRaw2);
        if (!isNaN(expD.getTime()) && expD > today2) {
          const key = `${expD.getFullYear()}-${expD.getMonth()}`;
          expiryMonthCounts[key] = (expiryMonthCounts[key] || 0) + 1;
        }
      }

      // Date de base = mois le plus fréquent → 1er du mois suivant
      let baseDate = null;
      const sorted = Object.entries(expiryMonthCounts).sort((a,b) => b[1]-a[1]);
      if (sorted.length > 0) {
        const [yearStr, monthStr] = sorted[0][0].split("-");
        baseDate = new Date(parseInt(yearStr), parseInt(monthStr) + 1, 1);
        // Si la date est dans moins de 2 mois, décaler d'un an
        if ((baseDate - today2) < 60 * 24 * 60 * 60 * 1000)
          baseDate = new Date(baseDate.getFullYear() + 1, baseDate.getMonth(), 1);
      }
      // Fallback si aucune expiration future : +13 mois
      if (!baseDate)
        baseDate = new Date(today2.getFullYear(), today2.getMonth() + 13, 1);

      const cotermRates = [0.21, 0.18, 0.15];
      const _rateForDuration = (durDays) => {
        const yrs = durDays / 365;
        if (yrs >= 3) return 0.15;
        if (yrs >= 2) return 0.18;
        return 0.21;
      };
      const coterm_options = [0, 1, 2].map(i => {
        const d = new Date(baseDate.getFullYear() + i, baseDate.getMonth(), 1);
        const day1 = d.getDate() === 1 ? "1er" : `${d.getDate()}`;
        const durDays = Math.max((d - today2) / 86400000, 1);
        return {
          option: String.fromCharCode(65 + i),
          label_fr: ["Court terme","Moyen terme","Long terme"][i],
          label_en: ["Short term","Medium term","Long term"][i],
          date: d.toISOString().slice(0,10),
          date_display: `${day1} ${MOIS_FR_CT[d.getMonth()]} ${d.getFullYear()}`,
          rate: Math.round(_rateForDuration(durDays) * 100),
          duration_years: i + 1,
          duration_months: Math.round(durDays / 30.44),
          total_cost: 0,
          annual_cost: 0,
          savings_vs_a: 0,
          rationale: "",
        };
      });

      return {
        company_name: companyName,
        email_domain: emailDomain,
        total, active, expiring_soon: expiring, expired_us: expired,
        products,
        us_status: { active, expiring, expired, unknown: 0 },
        monthly_expiries: monthly,
        coterm_options,
        id_counts: { full: id_full, partial_no_machine: id_partial_no_machine, partial_no_client: id_partial_no_client, none: id_none },
        detected_discount,
      };
    } catch(e) {
      console.error("analyzeCSV error:", e);
      return null;
    }
  };

  const runAnalyze = async (file, discountVal, expiryVal, langVal, cotermDatesVal, senderVal) => {
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("reseller_discount", discountVal / 100);
      fd.append("expiry_warning_days", expiryVal);
      fd.append("lang", langVal);
      fd.append("sender_name", senderVal || "");
      const activeDates = (cotermDatesVal || []).filter(d => d && d.trim() !== "");
      fd.append("coterm_candidates", JSON.stringify(activeDates));
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 35000);
      const res = await fetch(`${API_URL}/analyze`, { method:"POST", body:fd, signal:controller.signal });
      clearTimeout(timeout);
      if (!res.ok) throw new Error("backend");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      // Toujours compléter avec les données locales (email_domain, id_counts)
      const local = await analyzeCSV(file, expiryVal);
      if (!data.id_counts) data.id_counts = local?.id_counts;
      if (!data.email_domain && local?.email_domain) data.email_domain = local.email_domain;
      if (!data.coterm_options?.length && local?.coterm_options?.length) {
        data.coterm_options = local.coterm_options;
      }
      // Si le backend retourne moins de licences que le local (réponse partielle), utiliser le local
      if (local && data.total > 0 && local.total > 0 && data.total < local.total * 0.8) {
        console.warn(`Backend total (${data.total}) < local total (${local.total}) — using local`);
        return { ...local, _source: "local" };
      }
      return { ...data, _source: "backend" };
    } catch {
      const local = await analyzeCSV(file, expiryVal);
      return local ? { ...local, _source: "local" } : null;
    }
  };

  const addFiles = async (newFiles) => {
    const csvFiles = Array.from(newFiles).filter(f=>f.name.endsWith(".csv"));
    if (csvFiles.length===0) { setError(t.errNotCsv); return; }

    // Vérification du nombre de lignes
    for (const f of csvFiles) {
      const text = await f.text();
      const lineCount = text.split("\n").filter(l => l.trim()).length - 1; // -1 pour l'en-tête
      if (lineCount > 12000) {
        setError(t.errTooLarge(f.name, lineCount.toLocaleString()));
        return;
      }
    }

    const existing = new Set(files.map(f=>f.name));
    const toAdd = csvFiles.filter(f=>!existing.has(f.name));
    if (toAdd.length===0) return;
    toAdd.forEach(detectPartner);
    setFiles(prev=>[...prev,...toAdd]);
    setError(""); setSummary(null);
    setAnalyses(prev=>{
      const u={...prev};
      toAdd.forEach(f=>{ u[f.name]={loading:true}; });
      return u;
    });
    if (toAdd.length > 1) setActiveTab("global");
    else setActiveTab(toAdd[0].name);
    if (!pdfClient && toAdd.length > 0) setPdfClient(toAdd[0].name);
    for (const f of toAdd) {
      const data = await runAnalyze(f, discount, expiryDays, lang, cotermDates, sender);
      setAnalyses(prev=>({...prev,[f.name]:{loading:false,data,fileName:f.name}}));
    }
  };

  const removeFile = (name) => {
    setFiles(prev=>prev.filter(f=>f.name!==name));
    setAnalyses(prev=>{ const n={...prev}; delete n[name]; return n; });
  };

  const handleDrop = (e) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); };
  const isBatch = files.length > 1;

  const handleAiSummary = async () => {
    if (!files[0]) return;
    const analysis = analyses[files[0].name]?.data;
    setAiLoading(true); setAiError(""); setAiSummary("");
    const fd = new FormData();
    fd.append("company", analysis?.company_name || partnerNames[files[0].name] || "");
    fd.append("total",    analysis?.total        || 0);
    fd.append("active",   analysis?.active       || 0);
    fd.append("expiring", analysis?.expiring_soon|| 0);
    fd.append("expired",  analysis?.expired_us   || 0);
    fd.append("products", JSON.stringify(analysis?.products || {}));
    const opt = analysis?.coterm_options?.[0];
    fd.append("coterm_date",   opt?.date_display || "");
    fd.append("coterm_cost",   opt?.total_cost   || 0);
    fd.append("coterm_annual", opt?.annual_cost  || 0);
    fd.append("coterm_years",  opt?.duration_years || 1);
    fd.append("currency", currency);
    fd.append("discount", discount);
    fd.append("lang", lang);
    try {
      const res = await fetch(`${API_URL}/generate-ai-summary`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setAiSummary(data.summary);
    } catch(e) { setAiError(t.aiError); }
    finally { setAiLoading(false); }
  };

  const handlePdf = async () => {
    if (!files[0]) { setError(t.errNoFile); return; }
    // Utiliser le fichier de l'onglet actif, sinon le premier
    const selectedFile = isBatch && activeTab !== "global"
      ? (files.find(f => f.name === activeTab) || files[0])
      : files[0];
    setPdfLoading(true); setError("");
    const fd = new FormData();
    fd.append("file", selectedFile);
    fd.append("reseller_discount", discount / 100);
    fd.append("expiry_warning_days", expiryDays);
    fd.append("lang", lang);
    fd.append("currency", currency);
    fd.append("fx_rate", fxManual ? parseFloat(fxManual) : (fxRate || 0.92));
    fd.append("sender_name", sender);
    fd.append("sender_email", senderEmail);
    fd.append("recommended_opt", pdfOptions.length >= 2 ? pdfCoterm : pdfOptions[0] || "A");
    fd.append("pdf_options", JSON.stringify(pdfOptions));
    fd.append("show_inventory", pdfShowInventory ? "1" : "0");
    fd.append("show_prices", pdfShowPrices ? "1" : "0");
    fd.append("show_disabled", pdfShowDisabled ? "1" : "0");
    fd.append("custom_message", pdfCustomMessage || "");
    const validDates = cotermDates.filter(d => d.trim() !== "");
    fd.append("coterm_candidates", JSON.stringify(validDates));
    const activeAnalysis = analyses[selectedFile.name]?.data;
    const emailDomain = activeAnalysis?.email_domain;
    // Logo : 1) upload manuel (base64) 2) domaine → le PDF utilise les URLs directement comme le frontend
    if (pdfLogoManual) {
      fd.append("client_logo_b64", pdfLogoManual);  // logo uploadé manuellement → base64
    } else if (emailDomain) {
      fd.append("client_domain", emailDomain);  // domaine → le backend construit les URLs
    }
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(`${API_URL}/generate-pdf-html`, { method: "POST", body: fd, signal: controller.signal });
      clearTimeout(timeout);
      if (!res.ok) {
        let errMsg = "Erreur serveur";
        try { const j = await res.json(); errMsg = j.error || errMsg; } catch {}
        throw new Error(errMsg);
      }
      const html = await res.text();
      if (!html || html.length < 100) throw new Error("Réponse vide du serveur");
      const blob = new Blob([html], {type:"text/html"});
      const url = URL.createObjectURL(blob);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(url);
      setTimeout(() => pdfPreviewRef.current?.scrollIntoView({behavior:"smooth", block:"start"}), 100);
    } catch(e) {
      setError(e.name === "AbortError" ? t.errServer : (e.message || "Erreur inconnue"));
      console.error("PDF error:", e);
    } finally { setPdfLoading(false); }
  };

  const handleSubmit = async () => {
    console.log("handleSubmit called, files:", files.length, "cotermDates:", cotermDates);
    if (files.length===0) { setError(t.errNoFile); return; }
    if (cotermDates.some(d=>d && d<minCotermDate)) { setError(t.errCotermDate); return; }
    setLoading(true); setError(""); setSummary(null);

    // Étapes de progression
    const steps = lang === "fr"
      ? ["Lecture du CSV…", "Analyse des licences…", "Génération des onglets…", "Calcul du co-terming…", "Finalisation…"]
      : ["Reading CSV…", "Analysing licences…", "Generating sheets…", "Computing co-terming…", "Finalising…"];
    let si = 0;
    setGenStep(steps[0]); setGenStepIdx(0);
    const stepTimer = setInterval(() => {
      si = Math.min(si + 1, steps.length - 1);
      setGenStep(steps[si]); setGenStepIdx(si);
    }, 2800);

    const fd = new FormData();
    if (isBatch) files.forEach(f=>fd.append("files",f));
    else fd.append("file",files[0]);
    fd.append("email_sender",sender);
    fd.append("usd_to_eur", 0.92);
    fd.append("reseller_discount", discount / 100);
    fd.append("currency", currency);
    const effectiveRate = fxManual ? parseFloat(fxManual) : (fxRate || 0.92);
    fd.append("fx_rate", effectiveRate);
    fd.append("expiry_warning_days",expiryDays);
    fd.append("lang",lang);
    fd.append("coterm_candidates",JSON.stringify(cotermDates.filter(d=>d.trim()!=="")));
    Object.entries(sheets).forEach(([k,v])=>fd.append(`sheet_${k}`,v));
    const endpoint = isBatch ? "/generate-batch" : "/generate";
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 120000);
      const res = await fetch(`${API_URL}${endpoint}`,{method:"POST",body:fd,signal:controller.signal});
      clearTimeout(timeout);
      if (!res.ok) { const j=await res.json(); throw new Error(j.error||"Erreur serveur"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      if (isBatch) a.download="Rapports_Licences.zip";
      else {
        const m = res.headers.get("content-disposition")?.match(/filename="?([^"]+)"?/);
        a.download = m?m[1]:"Rapport_Licences.xlsx";
      }
      a.href=url; a.click(); URL.revokeObjectURL(url);
      setSummary({count:files.length,batch:isBatch});
      const n = Object.values(analyses).reduce((s,a)=>s+(a.data?.total||0),0);
      setDlFeedback({msg: lang==="fr" ? `✓ Rapport généré — ${n} licence${n>1?"s":""}` : `✓ Report generated — ${n} licence${n>1?"s":""}`, n});
      setTimeout(()=>setDlFeedback(null), 4000);
    } catch(e) {
      setError((e.name==="AbortError"||e.message.includes("fetch"))?t.errServer:e.message);
    } finally {
      clearInterval(stepTimer);
      setGenStep(null);
      setLoading(false);
    }
  };

  const [xlsxFile, setXlsxFile]         = useState(null);
  const [xlsxDragging, setXlsxDragging] = useState(false);
  const [xlsxLoading, setXlsxLoading]   = useState(false);
  const [xlsxPdfLoading, setXlsxPdfLoading] = useState(false);
  const [xlsxDetected, setXlsxDetected] = useState(null); // nombre de lignes détectées
  const [xlsxPreview, setXlsxPreview]   = useState([]);   // aperçu des lignes détectées
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null); // aperçu iframe PDF
  const [xlsxError, setXlsxError]       = useState("");
  const [xlsxSummary, setXlsxSummary]   = useState(null);
  const xlsxRef = useRef();
  const pdfPreviewRef = useRef();

  const handleXlsxFile = async (f) => {
    if (!f || !f.name.endsWith(".xlsx")) { setXlsxError(lang==="fr"?"Veuillez sélectionner un fichier .xlsx":"Please select a .xlsx file"); return; }
    setXlsxFile(f); setXlsxError(""); setXlsxSummary(null); setXlsxDetected(null);
    // Détection immédiate
    const fd = new FormData(); fd.append("file", f);
    try {
      const res = await fetch(`${API_URL}/detect-selection`, { method:"POST", body:fd, signal:AbortSignal.timeout(15000) });
      const data = await res.json();
      if (data.error) { setXlsxError(data.error); setXlsxDetected(0); return; }
      setXlsxDetected(data.count);
      setXlsxPreview(data.preview || []);
    } catch(e) { setXlsxDetected(null); }
  };

  const handleXlsxGenerate = async () => {
    if (!xlsxFile) return;
    setXlsxLoading(true); setXlsxError(""); setXlsxSummary(null);
    const fd = new FormData();
    fd.append("file", xlsxFile);
    fd.append("reseller_discount", discount / 100);
    fd.append("expiry_warning_days", expiryDays);
    fd.append("lang", lang);
    fd.append("currency", currency);
    fd.append("fx_rate", fxManual ? parseFloat(fxManual) : (fxRate || 0.92));
    fd.append("sender_name", sender);
    fd.append("sender_email", senderEmail);
    fd.append("coterm_candidates", JSON.stringify(cotermDates.filter(d=>d.trim()!=="")));
    try {
      const res = await fetch(`${API_URL}/generate-coterm-selection`, { method:"POST", body:fd, signal:AbortSignal.timeout(60000) });
      if (!res.ok) { const j=await res.json(); throw new Error(j.error||"Erreur serveur"); }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const m = res.headers.get("content-disposition")?.match(/filename="?([^"]+)"?/);
      a.download = m ? m[1] : "CoTerming_Selection.xlsx";
      a.href = url; a.click(); URL.revokeObjectURL(url);
      setXlsxSummary(lang==="fr"?"✅ Rapport co-terming généré et téléchargé":"✅ Co-terming report generated and downloaded");
      setDlFeedback({msg: lang==="fr" ? `✓ Rapport partiel généré — ${xlsxDetected} licence${xlsxDetected>1?"s":""}` : `✓ Partial report generated — ${xlsxDetected} licence${xlsxDetected>1?"s":""}`});
      setTimeout(()=>setDlFeedback(null), 4000);
    } catch(e) {
      setXlsxError(e.message || (lang==="fr"?"Erreur lors de la génération":"Error during generation"));
    } finally { setXlsxLoading(false); }
  };

  const handleXlsxPdf = async () => {
    if (!xlsxFile) return;
    setXlsxPdfLoading(true); setXlsxError("");
    const fd = new FormData();
    fd.append("file", xlsxFile);
    fd.append("reseller_discount", discount / 100);
    fd.append("expiry_warning_days", expiryDays);
    fd.append("lang", lang);
    fd.append("currency", currency);
    fd.append("fx_rate", fxManual ? parseFloat(fxManual) : (fxRate || 0.92));
    fd.append("sender_name", sender);
    fd.append("sender_email", senderEmail);
    fd.append("coterm_candidates", JSON.stringify(cotermDates.filter(d=>d.trim()!=="")));
    fd.append("recommended_opt", pdfCoterm);
    fd.append("pdf_options", JSON.stringify(pdfOptions));
    fd.append("show_inventory", pdfShowInventory ? "1" : "0");
    fd.append("show_prices", pdfShowPrices ? "1" : "0");
    if (pdfLogoManual) fd.append("client_logo_b64", pdfLogoManual);
    try {
      const res = await fetch(`${API_URL}/generate-pdf-selection`, { method:"POST", body:fd, signal:AbortSignal.timeout(60000) });
      if (!res.ok) { const j=await res.json(); throw new Error(j.error||"Erreur serveur"); }
      const html = await res.text();
      const blob = new Blob([html], {type:"text/html"});
      const url = URL.createObjectURL(blob);
      if (pdfPreviewUrl) URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(url);
      window.open(url, "_blank");
    } catch(e) {
      setXlsxError(e.message || (lang==="fr"?"Erreur PDF":"PDF error"));
    } finally { setXlsxPdfLoading(false); }
  };


  const fetchFxRate = async () => {
    if (currency === "EUR" || currency === "USD") return;
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${currency}`);
      const data = await res.json();
      if (data.rates?.[currency]) setFxRate(data.rates[currency] * 1.035);
    } catch(e) { console.error("FX rate fetch failed", e); }
  };

  const handleXlsxDetect = async () => {
    if (!xlsxFile) return;
    setXlsxLoading(true); setXlsxError("");
    const fd = new FormData();
    fd.append("file", xlsxFile);
    try {
      const res = await fetch(`${API_URL}/detect-selection`, { method:"POST", body:fd, signal:AbortSignal.timeout(30000) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setXlsxDetected(data.count || 0);
      setXlsxPreview(data.preview || []);
    } catch(e) { setXlsxError(e.message); }
    finally { setXlsxLoading(false); }
  };

  // ── Fonctions base globale ─────────────────────────────────────────
  const handleMasterLogin = () => {
    if (masterPwdInput === MASTER_PWD) {
      sessionStorage.setItem("master_auth", "1");
      setMasterAuth(true);
      setShowMasterLogin(false);
      setMasterPwdInput("");
      setMasterPwdError(false);
    } else {
      setMasterPwdError(true);
    }
  };

  const handleMasterCsvLoad = async (file) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter(l => l.trim());
    if (lines.length < 2) return;
    const sep = ";";
    const header = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,"").replace(/^\ufeff/,"").toLowerCase());
    const idx = n => header.findIndex(h => h === n);
    const iEmail    = idx("email");
    const iSoftware = idx("software");
    const iStatus   = idx("status");
    const iCompany  = idx("customer_comments");
    const iAK       = idx("activation_key");
    const iExpiry   = idx("support_expiry_date");
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const c = lines[i].split(sep).map(v => v.trim().replace(/^"|"$/g,""));
      if (!c[0]) continue;
      rows.push({ _raw: lines[i], _cols: c, _header: header,
        email:    iEmail   >= 0 ? c[iEmail]   : "",
        software: iSoftware>= 0 ? c[iSoftware]: "",
        status:   iStatus  >= 0 ? c[iStatus]  : "",
        company:  iCompany >= 0 ? c[iCompany] : "",
        ak:       iAK      >= 0 ? c[iAK]      : "",
        expiry:   iExpiry  >= 0 ? c[iExpiry]  : "",
      });
    }
    setMasterRows(rows);
    setMasterLoaded(new Date());
    setShowMasterLogin(false);

    // Grouper par clé d'activation (+ fallback domaine email)
    const akMap = {};
    rows.forEach(r => {
      const ak = r.ak || "";
      const email = r.email || "";
      const domain = email.includes("@") ? email.split("@")[1]?.toLowerCase() : "";
      // Clé de groupement : activation_key si dispo, sinon domaine email
      const groupKey = ak || domain;
      if (!groupKey) return;
      if (!akMap[groupKey]) akMap[groupKey] = {
        key: groupKey, ak, domain: domain||"", count: 0,
        company: r.company || "", emails: new Set()
      };
      akMap[groupKey].count++;
      if (email) akMap[groupKey].emails.add(email);
      if (r.company && r.company !== "—" && !akMap[groupKey].company) akMap[groupKey].company = r.company;
      if (!akMap[groupKey].domain && domain) akMap[groupKey].domain = domain;
    });
    setMasterClients(Object.values(akMap).sort((a,b) => b.count - a.count));
  };

  const handleMasterSelectClient = async (groupKey, label) => {
    // Filter rows by activation_key or email domain
    const clientRows = masterRows.filter(r => {
      if (r.ak && r.ak === groupKey) return true;
      if (!r.ak) {
        const email = r.email || "";
        const d = email.includes("@") ? email.split("@")[1]?.toLowerCase() : "";
        if (d && d === groupKey) return true;
      }
      return false;
    });
    if (!clientRows.length) return;

    // Rebuild CSV
    const header = masterRows[0]._header;
    const csvLines = [header.join(";")];
    clientRows.forEach(r => csvLines.push(r._cols.join(";")));
    const csvContent = csvLines.join("\n");

    const safeLabel = (label || groupKey).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 40);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const file = new File([blob], `${safeLabel}.csv`, { type: "text/csv" });
    addFiles([file]);
    setMasterSearch("");
    setV2Tab("dashboard");
  };

  const masterSearchResults = masterSearch.length >= 1
    ? masterClients.filter(c => {
        const q = masterSearch.toLowerCase();
        return c.company?.toLowerCase().includes(q) ||
               c.domain?.includes(q) ||
               c.ak?.toLowerCase().includes(q);
      }).slice(0, 10)
    : [];

  const analysisEntries = Object.values(analyses).sort((a, b) => {
    const expPctA = a.data?.total > 0 ? (a.data.expired_us / a.data.total) : 0;
    const expPctB = b.data?.total > 0 ? (b.data.expired_us / b.data.total) : 0;
    return expPctB - expPctA;
  });

  // activeAnalysis — disponible dans le scope du composant pour le rendu
  const _selectedFile = isBatch && activeTab !== "global"
    ? files.find(f => f.name === activeTab)
    : files[0];
  const activeAnalysis = _selectedFile ? analyses[_selectedFile.name]?.data : null;
  const showPreview = analysisEntries.length > 0;

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⬡</span>
            <span className="logo-text"><strong>{t.logo}</strong></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <div className="lang-switch">
              <button className={`lang-btn ${lang==="fr"?"active":""}`} onClick={()=>{ setLang("fr"); setCurrency("EUR"); setFxManual(""); }}>Français — prix en euros (€)</button>
              <button className={`lang-btn ${lang==="en"?"active":""}`} onClick={()=>{ setLang("en"); setCurrency("USD"); setFxManual(""); }}>English — USD-based prices (convert optional)</button>
            </div>

            <button className="theme-toggle" onClick={()=>setDarkMode(d=>!d)}>{darkMode?"☀️":"🌙"}</button>
            <button onClick={()=>{ if(masterAuth){setShowMasterLogin(s=>!s);}else{setShowMasterLogin(s=>!s);} }}
              style={{
                padding:"4px 10px", borderRadius:"7px", fontSize:".75rem",
                border:`1px solid ${masterAuth ? (masterLoaded && (Date.now()-masterLoaded.getTime())/3600000 > 24 ? "rgba(192,57,43,.4)" : (Date.now()-masterLoaded?.getTime())/3600000 > 12 ? "rgba(230,126,34,.4)" : "rgba(29,158,117,.4)") : "var(--border)"}`,
                background: masterAuth ? (masterLoaded && (Date.now()-masterLoaded.getTime())/3600000 > 24 ? "rgba(192,57,43,.1)" : (Date.now()-masterLoaded?.getTime())/3600000 > 12 ? "rgba(230,126,34,.1)" : "rgba(29,158,117,.1)") : "transparent",
                color: masterAuth ? ((Date.now()-masterLoaded?.getTime())/3600000 > 24 ? "#c0392b" : (Date.now()-masterLoaded?.getTime())/3600000 > 12 ? "#e67e22" : "#1D9E75") : "var(--muted)",
                cursor:"pointer", display:"flex", alignItems:"center", gap:"5px"
              }}>
              {masterAuth ? "🗂" : "🔐"}
              {masterAuth
                ? (masterLoaded ? (() => {
                    const ageH = (Date.now() - masterLoaded.getTime()) / 3600000;
                    const freshColor = ageH < 12 ? "#1D9E75" : ageH < 24 ? "#e67e22" : "#c0392b";
                    const ageLabel = ageH < 1 ? (lang==="fr"?"<1h":"<1h") : ageH < 24 ? `${Math.floor(ageH)}h` : `${Math.floor(ageH/24)}j`;
                    return `Base globale · ${masterClients.length} clients · ${ageLabel}`;
                  })() : "Base globale")
                : (lang==="fr" ? "Base globale" : "Global base")}
            </button>
          </div>
        </div>
      </header>

      {/* ── Panel Base Globale ───────────────────────────────────── */}
      {showMasterLogin && (
        <div style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,.5)",
          zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center"
        }} onClick={e=>{ if(e.target===e.currentTarget) setShowMasterLogin(false); }}>
          <div style={{
            background:"var(--surface)", border:"1px solid var(--border)",
            borderRadius:"14px", padding:"2rem", width:"100%", maxWidth:"420px",
            margin:"0 1rem"
          }}>
            {!masterAuth ? (
              <>
                <div style={{fontWeight:700, fontSize:"1.1rem", marginBottom:".5rem"}}>🔐 {lang==="fr"?"Accès base globale":"Global base access"}</div>
                <p style={{fontSize:".82rem", color:"var(--muted)", marginBottom:"1.2rem"}}>
                  {lang==="fr"?"Entrez le mot de passe pour accéder au mode base globale.":"Enter the password to access the global base mode."}
                </p>
                <input
                  type="password" autoFocus value={masterPwdInput}
                  onChange={e=>{ setMasterPwdInput(e.target.value); setMasterPwdError(false); }}
                  onKeyDown={e=>{ if(e.key==="Enter") handleMasterLogin(); }}
                  placeholder={lang==="fr"?"Mot de passe…":"Password…"}
                  style={{
                    width:"100%", padding:".6rem .75rem", borderRadius:"8px",
                    border:`1px solid ${masterPwdError?"#c0392b":"var(--border)"}`,
                    background:"var(--bg)", color:"var(--text)", fontSize:".9rem",
                    outline:"none", marginBottom:".5rem"
                  }}/>
                {masterPwdError && <p style={{color:"#c0392b",fontSize:".78rem",marginBottom:".5rem"}}>❌ {lang==="fr"?"Mot de passe incorrect":"Incorrect password"}</p>}
                <div style={{display:"flex",gap:"8px",marginTop:".5rem"}}>
                  <button onClick={handleMasterLogin} style={{flex:1,padding:".6rem",borderRadius:"8px",border:"none",background:"#1A3C5E",color:"#fff",cursor:"pointer",fontWeight:600}}>
                    {lang==="fr"?"Connexion →":"Login →"}
                  </button>
                  <button onClick={()=>setShowMasterLogin(false)} style={{padding:".6rem .9rem",borderRadius:"8px",border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer"}}>
                    {lang==="fr"?"Annuler":"Cancel"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"1rem"}}>
                  <div style={{fontWeight:700, fontSize:"1rem"}}>🗂 {lang==="fr"?"Base globale":"Global base"}</div>
                  <div style={{display:"flex",gap:"8px"}}>
                    {masterLoaded && <span style={{fontSize:".72rem",color:"var(--muted)"}}>
                      {lang==="fr"?"Chargée":"Loaded"} {masterLoaded.toLocaleTimeString()} · {masterClients.length} clients
                    </span>}
                    <button onClick={()=>{ sessionStorage.removeItem("master_auth"); setMasterAuth(false); setMasterRows([]); setMasterClients([]); setMasterLoaded(null); }} style={{fontSize:".72rem",color:"#c0392b",background:"none",border:"none",cursor:"pointer"}}>
                      {lang==="fr"?"Déconnexion":"Logout"}
                    </button>
                  </div>
                </div>

                {/* Upload CSV maître */}
                <div
                  onClick={()=>masterCsvRef.current.click()}
                  style={{
                    border:"1px dashed var(--border)", borderRadius:"10px",
                    padding:"1rem", textAlign:"center", cursor:"pointer",
                    marginBottom:"1rem", background:"var(--bg2,#f8fafe)"
                  }}>
                  <input ref={masterCsvRef} type="file" accept=".csv" style={{display:"none"}}
                    onChange={e=>{ const f=e.target.files[0]; if(f) handleMasterCsvLoad(f); e.target.value=""; }}/>
                  <div style={{fontSize:"1.5rem",marginBottom:"4px"}}>📂</div>
                  <div style={{fontSize:".82rem",color:"var(--text)",fontWeight:600}}>
                    {masterLoaded ? (lang==="fr"?"Recharger le CSV maître":"Reload master CSV") : (lang==="fr"?"Charger le CSV maître":"Load master CSV")}
                  </div>
                  <div style={{fontSize:".72rem",color:"var(--muted)",marginTop:"2px"}}>
                    {lang==="fr"?"Export complet de toutes les licences TSplus":"Full export of all TSplus licences"}
                  </div>
                </div>

                {/* Recherche client */}
                {masterLoaded && (
                  <>
                    <input
                      type="text" value={masterSearch}
                      onChange={e=>setMasterSearch(e.target.value)}
                      placeholder={lang==="fr"?"Rechercher par domaine ou nom client…":"Search by domain or client name…"}
                      style={{
                        width:"100%", padding:".6rem .75rem", borderRadius:"8px",
                        border:"1px solid var(--border)", background:"var(--bg)",
                        color:"var(--text)", fontSize:".85rem", outline:"none", marginBottom:".5rem"
                      }}/>
                    {masterSearchResults.length > 0 && (
                      <div style={{border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden"}}>
                        {masterSearchResults.map((c,i) => (
                          <div key={i} onClick={()=>{ handleMasterSelectClient(c.domain); setShowMasterLogin(false); }}
                            style={{
                              padding:".65rem .85rem", cursor:"pointer",
                              borderBottom: i < masterSearchResults.length-1 ? "0.5px solid var(--border)" : "none",
                              display:"flex", justifyContent:"space-between", alignItems:"center"
                            }}
                            onMouseEnter={e=>e.currentTarget.style.background="var(--bg2,#f8fafe)"}
                            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <div>
                              <div style={{fontWeight:600,fontSize:".82rem",color:"var(--text)"}}>{c.domain}</div>
                              {c.company && <div style={{fontSize:".72rem",color:"var(--muted)"}}>{c.company}</div>}
                            </div>
                            <span style={{fontSize:".75rem",color:"var(--accent)",fontWeight:600}}>{c.count} lic. →</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {masterSearch.length >= 2 && masterSearchResults.length === 0 && (
                      <p style={{fontSize:".78rem",color:"var(--muted)",textAlign:"center",padding:".5rem"}}>
                        {lang==="fr"?"Aucun client trouvé":"No client found"}
                      </p>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Bandeau cold start */}
      {serverStatus === "warming" && (
        <div style={{background:"#fef3cd",borderBottom:"1px solid #f0c040",padding:".5rem 2rem",textAlign:"center",fontSize:".8rem",color:"#856404",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
          <span className="spinner" style={{width:"12px",height:"12px",borderWidth:"2px",borderColor:"#856404",borderTopColor:"transparent"}}/>
          {lang==="fr" ? "Le serveur démarre — première requête plus lente (15–30s), merci de patienter…" : "Server is starting up — first request may take 15–30s, please wait…"}
        </div>
      )}
      {serverStatus === "error" && (
        <div style={{background:"#fde8e8",borderBottom:"1px solid #e0a0a0",padding:".5rem 2rem",textAlign:"center",fontSize:".8rem",color:"#721c24"}}>
          {lang==="fr" ? "⚠ Serveur inaccessible — les générations Excel/PDF ne fonctionneront pas." : "⚠ Server unreachable — Excel/PDF generation won't work."}
        </div>
      )}

      {/* Bandeau feedback téléchargement */}
      {dlFeedback && (
        <div style={{
          position:"fixed",bottom:"1.5rem",left:"50%",transform:"translateX(-50%)",
          background:"#1D9E75",color:"#fff",padding:".6rem 1.4rem",
          borderRadius:"30px",fontSize:".88rem",fontWeight:600,
          boxShadow:"0 4px 16px rgba(0,0,0,.18)",zIndex:9999,
          animation:"slideUp .25s ease",whiteSpace:"nowrap"
        }}>
          {dlFeedback.msg}
        </div>
      )}

      <main className={`main${analysisEntries.length > 0 && v2Tab === "dashboard" ? " main-full" : ""}`}>

        {/* ── Top bar ── */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          gap:"12px", marginBottom:"1rem", flexWrap:"wrap"
        }}>
          <div>
            <div style={{fontSize:"1.25rem", fontWeight:700, color:"var(--text)"}}>
              {t.heroTitle} <span style={{color:"var(--accent)"}}>{t.heroEm}</span>
            </div>
            <div style={{fontSize:".75rem", color:"var(--muted)", marginTop:"2px"}}>{t.heroSub}</div>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"8px", flexShrink:0}}>
            <div className="server-status">
              <div className={`server-dot server-dot-${serverStatus}`} />
              <span style={{fontSize:".72rem", color:"var(--muted)"}}>
                {serverStatus==="ok" ? (lang==="fr"?"Serveur actif":"Server active")
                 : serverStatus==="error" ? (lang==="fr"?"Hors ligne":"Offline")
                 : (lang==="fr"?"Démarrage…":"Starting…")}
              </span>
            </div>
          </div>
        </div>

        {/* ── Upload bar ── */}
        <div
          className="upload-bar"
          onDragOver={e=>{e.preventDefault();setDragging(true);}}
          onDragLeave={()=>setDragging(false)}
          onDrop={handleDrop}
          onClick={()=>fileRef.current.click()}
          style={{borderColor: dragging ? "var(--accent)" : undefined}}
        >
          <input ref={fileRef} type="file" accept=".csv" multiple style={{display:"none"}} onChange={e=>addFiles(e.target.files)}/>
          <span className="upload-bar-icon">📂</span>
          {files.length > 0 ? (
            <div className="upload-bar-files">
              {files.map(f=>(
                <span key={f.name} className="upload-bar-file">
                  {f.name.replace(".csv","")}
                  {analyses[f.name]?.data && (
                    <span style={{opacity:.7}}>· {analyses[f.name].data.total}</span>
                  )}
                  <button onClick={e=>{e.stopPropagation();removeFile(f.name);}}>✕</button>
                </span>
              ))}
              {analyzing && <span className="spinner" style={{width:"12px",height:"12px",marginLeft:"4px"}}/>}
            </div>
          ) : (
            <span className="upload-bar-label">
              {lang==="fr"
                ? "Glisser ou cliquer pour importer un export CSV du portail TSplus"
                : "Drop or click to import a TSplus portal CSV export"}
            </span>
          )}
          {files.length === 0 && (
            <span style={{fontSize:".72rem",color:"var(--accent)",fontWeight:600,flexShrink:0}}>
              {lang==="fr"?"Parcourir →":"Browse →"}
            </span>
          )}
          {files.length > 0 && (
            <button onClick={e=>{
              e.stopPropagation();
              setFiles([]); setAnalyses({}); setSummary(null); setError("");
              setActiveTab("global"); setPdfPreviewUrl(null); setPartnerNames({});
            }} style={{
              marginLeft:"auto", padding:"3px 8px", borderRadius:"6px",
              border:"1px solid var(--border)", background:"transparent",
              color:"var(--muted)", cursor:"pointer", fontSize:".72rem", flexShrink:0
            }}>↺ {lang==="fr"?"Réinitialiser":"Reset"}</button>
          )}
        </div>

        {error && <div className="alert alert-error" style={{marginBottom:"1rem"}}>⚠️ {error}</div>}
        {summary && <div className="alert alert-ok" style={{marginBottom:"1rem"}}>✅ {summary.batch?t.summaryBatch(summary.count):t.summarySingle}</div>}

        {/* ── Navigation onglets ── */}
        {analysisEntries.length > 0 && (
          <nav className="v2-nav">
            {[
              {key:"dashboard", icon:"📊", label:lang==="fr"?"Vue d'ensemble":"Overview",
               badge: analysisEntries.reduce((s,a)=>s+(a.data?.total||0),0)||null},
              {key:"generate",  icon:"⚙️", label:lang==="fr"?"Générer":"Generate",
               badge: null},
            ].map(tab=>(
              <button key={tab.key}
                className={`v2-nav-btn${v2Tab===tab.key?" active":""}`}
                onClick={()=>setV2Tab(tab.key)}>
                <span>{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span style={{
                    background: v2Tab===tab.key ? "rgba(255,255,255,.2)" : "var(--border)",
                    color: v2Tab===tab.key ? "#fff" : "var(--muted)",
                    borderRadius:"99px", padding:"1px 7px", fontSize:".68rem", fontWeight:600
                  }}>{tab.badge}</span>
                )}
              </button>
            ))}
          </nav>
        )}

        {/* ── Contenu selon onglet ── */}
        {analysisEntries.length === 0 && (
          masterLoaded ? (
            /* Mode base globale — recherche client */
            <div style={{maxWidth:"520px", margin:"2rem auto 0"}}>
              <div style={{textAlign:"center", marginBottom:"1.5rem"}}>
                <div style={{fontSize:"2rem", marginBottom:".5rem"}}>🔍</div>
                <div style={{fontWeight:700, fontSize:"1rem", color:"var(--text)", marginBottom:".25rem"}}>
                  {lang==="fr" ? "Rechercher un client" : "Search a client"}
                </div>
                <div style={{fontSize:".78rem", color:"var(--muted)"}}>
                  {lang==="fr"
                    ? `Base chargée · ${masterClients.length} clients · ${masterRows.length.toLocaleString()} licences`
                    : `Base loaded · ${masterClients.length} clients · ${masterRows.length.toLocaleString()} licences`}
                </div>
              </div>

              <div style={{position:"relative"}}>
                <input
                  autoFocus
                  type="text"
                  value={masterSearch}
                  onChange={e => setMasterSearch(e.target.value)}
                  placeholder={lang==="fr" ? "Domaine ou nom client (ex: acme.com)…" : "Domain or client name (e.g. acme.com)…"}
                  style={{
                    width:"100%", padding:".75rem 1rem .75rem 2.75rem",
                    borderRadius:"10px", border:"1px solid var(--border)",
                    background:"var(--surface)", color:"var(--text)",
                    fontSize:"1rem", outline:"none",
                    boxShadow:"0 2px 8px rgba(0,0,0,.08)"
                  }}
                  onFocus={e=>e.target.style.borderColor="var(--accent)"}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}
                />
                <span style={{position:"absolute",left:".85rem",top:"50%",transform:"translateY(-50%)",fontSize:"1.1rem",pointerEvents:"none"}}>🔎</span>
                {masterSearch && (
                  <button onClick={()=>setMasterSearch("")} style={{
                    position:"absolute", right:".75rem", top:"50%", transform:"translateY(-50%)",
                    background:"none", border:"none", cursor:"pointer", color:"var(--muted)", fontSize:".9rem"
                  }}>✕</button>
                )}
              </div>

              {/* Résultats autocomplete */}
              {masterSearch.length >= 1 && (
                <div style={{
                  border:"1px solid var(--border)", borderRadius:"10px",
                  overflow:"hidden", marginTop:"6px",
                  boxShadow:"0 4px 16px rgba(0,0,0,.1)"
                }}>
                  {masterSearchResults.length > 0 ? masterSearchResults.map((c, i) => (
                    <div key={i}
                      onClick={()=>{ handleMasterSelectClient(c.key, c.company || c.domain || c.ak); }}
                      style={{
                        padding:".75rem 1rem", cursor:"pointer", background:"var(--surface)",
                        borderBottom: i < masterSearchResults.length-1 ? "0.5px solid var(--border)" : "none",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        transition:"background .1s"
                      }}
                      onMouseEnter={e=>e.currentTarget.style.background="var(--bg2,#f0f2f5)"}
                      onMouseLeave={e=>e.currentTarget.style.background="var(--surface)"}
                    >
                      <div style={{minWidth:0}}>
                        <div style={{fontWeight:600, fontSize:".88rem", color:"var(--text)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>
                          {c.company && c.company !== "—" ? c.company : c.ak || c.domain}
                        </div>
                        <div style={{fontSize:".72rem", color:"var(--muted)", marginTop:"1px", fontFamily:"monospace"}}>
                          {c.ak ? c.ak : c.domain}
                          {c.domain && c.ak ? <span style={{color:"var(--border)"}}> · {c.domain}</span> : ""}
                        </div>
                      </div>
                      <div style={{textAlign:"right", flexShrink:0, marginLeft:"8px"}}>
                        <span style={{
                          fontSize:".78rem", fontWeight:700, color:"var(--accent)",
                          padding:"2px 8px", borderRadius:"99px",
                          background:"rgba(232,98,10,.08)", border:"1px solid rgba(232,98,10,.2)"
                        }}>{c.count} lic. →</span>
                      </div>
                    </div>
                  )) : (
                    <div style={{padding:"1rem", textAlign:"center", color:"var(--muted)", fontSize:".82rem"}}>
                      {lang==="fr" ? "Aucun client trouvé" : "No client found"}
                    </div>
                  )}
                </div>
              )}

              {masterSearch.length === 0 && (
                <p style={{textAlign:"center", fontSize:".75rem", color:"var(--muted)", marginTop:"1rem"}}>
                  {lang==="fr" ? "Tapez au moins 1 caractère pour rechercher" : "Type at least 1 character to search"}
                </p>
              )}
            </div>
          ) : (
            /* État vide normal */
            <div style={{
              textAlign:"center", padding:"3rem 1rem",
              border:"1px dashed var(--border)", borderRadius:"12px",
              marginTop:"1rem", color:"var(--muted)"
            }}>
              <div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📊</div>
              <div style={{fontWeight:600,fontSize:"1rem",color:"var(--text)",marginBottom:".5rem"}}>
                {lang==="fr"?"Importez un fichier CSV pour commencer":"Import a CSV file to get started"}
              </div>
              <div style={{fontSize:".8rem",lineHeight:1.6}}>
                {lang==="fr"
                  ? "Exportez vos licences depuis le portail TSplus, puis glissez le fichier ici."
                  : "Export your licences from the TSplus portal, then drop the file here."}
              </div>
            </div>
          )
        )}

        {/* Vue d'ensemble — Dashboard + Licences + Co-terming */}
        {analysisEntries.length > 0 && v2Tab === "dashboard" && (
          <>
            {/* Cartes clients — mode multi-CSV uniquement */}
            {analysisEntries.length > 1 && (
              <div style={{marginBottom:"1.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                  <div style={{width:"3px",height:"18px",background:"#1A3C5E",borderRadius:"2px"}}/>
                  <span style={{fontSize:".82rem",fontWeight:700,color:"var(--text)",textTransform:"uppercase",letterSpacing:".05em"}}>
                    {lang==="fr" ? `${analysisEntries.length} clients` : `${analysisEntries.length} clients`}
                  </span>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:"10px"}}>
                  {analysisEntries.map((a, i) => {
                    const d = a.data || {};
                    const total    = d.total || 0;
                    const active   = d.active || 0;
                    const expiring = d.expiring_soon || 0;
                    const expired  = d.expired_us || 0;
                    const name     = d.company_name || a.filename?.replace(".csv","") || "—";
                    const urgency  = total > 0 ? Math.round((expired + expiring) / total * 100) : 0;
                    const urgencyColor = urgency > 50 ? "#c0392b" : urgency > 20 ? "#e67e22" : "#1D9E75";
                    return (
                      <div key={i} style={{
                        background:"var(--surface)", border:`1px solid ${urgency > 30 ? "rgba(192,57,43,.3)" : "var(--border)"}`,
                        borderTop:`3px solid ${urgencyColor}`,
                        borderRadius:"10px", padding:"14px", cursor:"pointer",
                        transition:"box-shadow .15s"
                      }}
                        onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.12)"}
                        onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}
                        onClick={()=>setActiveTab(a.filename)}
                      >
                        {/* Nom client */}
                        <div style={{fontWeight:700,fontSize:".88rem",color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:"10px"}}>
                          {name}
                        </div>

                        {/* Grand chiffre */}
                        <div style={{fontSize:"2rem",fontWeight:700,color:"var(--text)",lineHeight:1,marginBottom:"4px"}}>
                          {total}
                        </div>
                        <div style={{fontSize:".7rem",color:"var(--muted)",marginBottom:"10px"}}>
                          {lang==="fr" ? "licences" : "licences"}
                        </div>

                        {/* Badges U&S */}
                        <div style={{display:"flex",gap:"4px",flexWrap:"wrap",marginBottom:"10px"}}>
                          {active > 0 && (
                            <span style={{fontSize:".68rem",fontWeight:600,padding:"2px 6px",borderRadius:"4px",background:"rgba(29,158,117,.12)",color:"#1D9E75"}}>
                              ● {active}
                            </span>
                          )}
                          {expiring > 0 && (
                            <span style={{fontSize:".68rem",fontWeight:600,padding:"2px 6px",borderRadius:"4px",background:"rgba(230,126,34,.12)",color:"#e67e22"}}>
                              ● {expiring}
                            </span>
                          )}
                          {expired > 0 && (
                            <span style={{fontSize:".68rem",fontWeight:600,padding:"2px 6px",borderRadius:"4px",background:"rgba(192,57,43,.12)",color:"#c0392b"}}>
                              ● {expired}
                            </span>
                          )}
                        </div>

                        {/* Boutons Excel + PDF */}
                        <div style={{display:"flex",gap:"6px"}} onClick={e=>e.stopPropagation()}>
                          <button
                            onClick={async e=>{
                              e.stopPropagation();
                              const f = files.find(f=>f.name===a.filename);
                              if (!f) return;
                              const fd = new FormData();
                              fd.append("file", f);
                              fd.append("email_sender", sender||"");
                              fd.append("reseller_discount", (discount||20)/100);
                              fd.append("currency", currency||"EUR");
                              fd.append("fx_rate", fxRate||0.92);
                              fd.append("expiry_warning_days", expiryDays||90);
                              fd.append("lang", lang);
                              fd.append("coterm_candidates", JSON.stringify(cotermDates.filter(d=>d.trim())));
                              const res = await fetch(`${API_URL}/generate`, {method:"POST",body:fd});
                              if (res.ok) { const blob=await res.blob(); const url=URL.createObjectURL(blob); const a2=document.createElement("a"); a2.href=url; a2.download=`${a.filename?.replace(".csv","")}_rapport.xlsx`; a2.click(); }
                            }}
                            style={{flex:1,padding:"4px 0",borderRadius:"6px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",cursor:"pointer",fontSize:".7rem",fontWeight:600}}
                          >
                            📊 Excel
                          </button>
                          <button
                            onClick={e=>{
                              e.stopPropagation();
                              setActiveTab(a.filename);
                              setV2Tab("generate");
                            }}
                            style={{flex:1,padding:"4px 0",borderRadius:"6px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",cursor:"pointer",fontSize:".7rem",fontWeight:600}}
                          >
                            📄 PDF
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Séparateur si multi */}
            {analysisEntries.length > 1 && (
              <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"1.5rem"}}>
                <div style={{flex:1,height:"1px",background:"var(--border)"}}/>
                <span style={{fontSize:".72rem",color:"var(--muted)",fontWeight:600,textTransform:"uppercase",letterSpacing:".06em"}}>
                  {lang==="fr" ? "Vue agrégée" : "Aggregated view"}
                </span>
                <div style={{flex:1,height:"1px",background:"var(--border)"}}/>
              </div>
            )}

            {/* KPI Dashboard style portail */}
            <OverviewDashboard analyses={analysisEntries} lang={lang} expiryDays={expiryDays} />

            {/* Tableau de licences full width */}
            <div style={{marginTop:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                <div style={{width:"3px",height:"18px",background:"#1A3C5E",borderRadius:"2px"}}/>
                <span style={{fontSize:".82rem",fontWeight:700,color:"var(--text)",textTransform:"uppercase",letterSpacing:".05em"}}>
                  {lang==="fr"?"Licences":"Licences"}
                </span>
              </div>
              <LicenceTable files={files} lang={lang} expiryDays={expiryDays} />
            </div>

            {/* Co-terming candidates */}
            {analysisEntries.length === 1 && analysisEntries[0]?.data?.coterm_options?.length > 0 && (
              <div style={{marginTop:"1.5rem"}}>
                <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                  <div style={{width:"3px",height:"18px",background:"#1A3C5E",borderRadius:"2px"}}/>
                  <span style={{fontSize:".82rem",fontWeight:700,color:"var(--text)",textTransform:"uppercase",letterSpacing:".05em"}}>
                    {lang==="fr"?"Dates de co-terming candidates":"Co-terming candidates"}
                  </span>
                  <span style={{fontSize:".72rem",color:"var(--accent)",fontWeight:600,padding:"2px 8px",borderRadius:"99px",background:"rgba(232,98,10,.1)",border:"1px solid rgba(232,98,10,.2)"}}>
                    {lang==="fr"?`remise partenaire -${discount}% appliquée`:`partner discount -${discount}% applied`}
                  </span>
                </div>
                <div className="coterm-rich-grid" style={{maxWidth:"800px", margin:"0 auto"}}>
                  {analysisEntries[0].data.coterm_options.map((opt, i) => {
                    const label = lang==="en" ? opt.label_en : opt.label_fr;
                    const HDRS = ["#1A3A5C","#1E4E7A","#1a6ea3"];
                    const hasCosts = opt.total_cost > 0;
                    const showSavings = analysisEntries[0].data.coterm_options.every(o => o.savings_vs_a > 0);
                    return (
                      <div key={opt.option} className="coterm-rich-card">
                        <div className="coterm-rich-header" style={{background:HDRS[i]}}>
                          <span className="coterm-rich-opt">Option {opt.option}</span>
                          <span className="coterm-rich-lbl-hdr">{label}</span>
                        </div>
                        <div className="coterm-rich-body">
                          <div className="coterm-rich-date">{opt.date_display}</div>
                          <div className="coterm-rich-meta">{opt.rate}% / an · ≃ {opt.duration_months ?? opt.duration_years*12} mois</div>
                          {hasCosts && <>
                            <hr className="coterm-rich-hr"/>
                            <div className="coterm-rich-row">
                              <span className="coterm-rich-lbl">{lang==="fr"?"Coût total":"Total cost"}</span>
                              <span className="coterm-rich-annual">{opt.total_cost?.toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0})}</span>
                            </div>
                            <div className="coterm-rich-row">
                              <span className="coterm-rich-lbl">{lang==="fr"?"Coût / an":"Cost / year"}</span>
                              <span className="coterm-rich-val">{opt.annual_cost?.toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0})}</span>
                            </div>
                            {showSavings && opt.savings_vs_a > 0 && <div className="coterm-rich-savings">↓ {opt.savings_vs_a?.toLocaleString("fr-FR",{style:"currency",currency:"EUR",maximumFractionDigits:0})} vs A</div>}
                          </>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Générer */}
        {analysisEntries.length > 0 && v2Tab === "generate" && (
          <div className="layout">
            {/* ── Colonne gauche : params + PDF ── */}
            <div className="col-main">
              {error && <div className="alert alert-error" style={{marginBottom:"1rem"}}>⚠️ {error}</div>}
              {summary && <div className="alert alert-ok" style={{marginBottom:"1rem"}}>✅ {summary.batch?t.summaryBatch(summary.count):t.summarySingle}</div>}

              {/* Paramètres co-terming + devise */}
              <div className="card" style={{marginBottom:"1rem"}}>
                <h3 style={{marginBottom:".5rem"}}>{t.cotermTitle}</h3>
                <p className="coterm-hint" style={{marginBottom:".75rem"}}>{t.cotermHint}</p>
                <div className="coterm-params" style={{marginBottom:".75rem"}}>
                  <div className="param-row">
                    <label className="param-label">{t.discountLabel}</label>
                    <div className="input-with-unit"><input type="number" min="0" max="100" value={discount} onChange={e=>setDiscount(parseInt(e.target.value))}/><span className="unit">%</span></div>
                  </div>
                  <div className="param-row">
                    <label className="param-label">{t.expiryLabel}</label>
                    <div className="input-with-unit"><input type="number" min="0" value={expiryDays} onChange={e=>setExpiryDays(parseInt(e.target.value))}/><span className="unit">{t.days}</span></div>
                  </div>
                  <div className="param-row">
                    <label className="param-label">{t.currencyLabel}</label>
                    <select value={currency} onChange={e => { setCurrency(e.target.value); setFxManual(""); }}>{["EUR","USD","GBP","AUD","CAD","CHF","JPY","SGD","NZD","NOK","SEK","DKK","HKD","BRL","MXN","INR","ZAR","PLN","CZK","HUF","RON","BGN","TRY","AED","SAR","THB","IDR","MYR","PHP","VND"].map(c=><option key={c} value={c}>{c}</option>)}</select>
                  </div>
                  {currency!=="EUR" && currency!=="USD" && (
                    <div className="param-row">
                      <label className="param-label">{t.fxLabel} (USD→{currency})</label>
                      <div className="input-with-unit">
                        <input type="number" step="0.0001" min="0" placeholder={fxRate?fxRate.toFixed(4):"…"} value={fxManual} onChange={e => setFxManual(e.target.value)} />
                        <span className="unit" style={{cursor:"pointer"}} onClick={fetchFxRate} title="Actualiser">↻</span>
                      </div>
                    </div>
                  )}
                </div>
                {cotermDates.map((d,i)=>(
                  <div key={i} className="coterm-date-row">
                    <span className="coterm-date-label">{`Option ${String.fromCharCode(65+i)}`}</span>
                    <input type="date" value={d} onChange={e=>{const u=[...cotermDates];u[i]=e.target.value;setCotermDates(u);}} min={new Date().toISOString().slice(0,10)}/>
                    {d && <button className="coterm-date-clear" onClick={()=>{const u=[...cotermDates];u[i]="";setCotermDates(u);}}>✕</button>}
                  </div>
                ))}
              </div>

              {/* Section PDF */}
              <div className="card">
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:".6rem"}}>
                  <h3 style={{margin:0,color:"#1A3C5E"}}>📄 {lang==="fr"?"Rapport PDF client":"Client PDF report"}</h3>
                  <span className="badge-experimental">{lang==="fr"?"EXPÉRIMENTAL":"EXPERIMENTAL"}</span>
                </div>
                <p className="coterm-hint" style={{marginBottom:".75rem"}}>{lang==="fr"?"Document de proposition généré en parallèle du fichier Excel.":"Commercial proposal document generated alongside the Excel file."}</p>
                <div style={{marginBottom:".6rem"}}>
                  <label className="param-label" style={{display:"block",marginBottom:".4rem"}}>{lang==="fr"?"OPTIONS CO-TERMING À INCLURE":"CO-TERMING OPTIONS TO INCLUDE"}</label>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {["A","B","C"].map(opt=>(
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"5px",cursor:"pointer",fontSize:".78rem",padding:".3rem .6rem",borderRadius:"6px",border:`1px solid ${pdfOptions.includes(opt)?"var(--accent)":"var(--border)"}`,background:pdfOptions.includes(opt)?"rgba(232,98,10,.08)":"transparent",color:pdfOptions.includes(opt)?"var(--accent)":"var(--muted)",transition:"all .15s"}}>
                        <input type="checkbox" style={{display:"none"}} checked={pdfOptions.includes(opt)} onChange={()=>setPdfOptions(p=>p.includes(opt)?p.filter(x=>x!==opt):[...p,opt].sort())}/>
                        Option {opt}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:".75rem"}}>
                  <label className="param-label" style={{display:"block",marginBottom:".4rem"}}>{lang==="fr"?"OPTION RECOMMANDÉE":"RECOMMENDED OPTION"}</label>
                  <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
                    {[...pdfOptions,"none"].map(opt=>(
                      <label key={opt} style={{display:"flex",alignItems:"center",gap:"5px",cursor:"pointer",fontSize:".78rem",padding:".3rem .6rem",borderRadius:"6px",border:`1px solid ${pdfCoterm===opt?"var(--accent)":"var(--border)"}`,background:pdfCoterm===opt?"rgba(232,98,10,.08)":"transparent",color:pdfCoterm===opt?"var(--accent)":"var(--muted)",transition:"all .15s"}}>
                        <input type="radio" style={{display:"none"}} name="pdfCoterm" checked={pdfCoterm===opt} onChange={()=>setPdfCoterm(opt)}/>
                        {opt==="none"?(lang==="fr"?"Aucune":"None"):(`Option ${opt}`)}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{marginBottom:".75rem"}}>
                  <label className="param-label" style={{display:"block",marginBottom:".4rem"}}>{lang==="fr"?"LOGO CLIENT":"CLIENT LOGO"} <span style={{fontWeight:400,color:"var(--muted)",textTransform:"none",letterSpacing:0}}>{lang==="fr"?"— optionnel":"— optional"}</span></label>
                  <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                    <label style={{display:"flex",alignItems:"center",gap:"6px",padding:".4rem .75rem",borderRadius:"8px",border:"1px dashed var(--border)",cursor:"pointer",fontSize:".78rem",color:"var(--muted)",flex:1,justifyContent:"center"}}>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                        const file=e.target.files[0];
                        if(!file) return;
                        const reader=new FileReader();
                        reader.onload=ev=>setPdfLogoManual(ev.target.result.split(",")[1]);
                        reader.readAsDataURL(file);
                        e.target.value="";
                      }}/>
                      {pdfLogoManual ? "✅ Logo importé" : "⬆ Importer un logo"}
                    </label>
                    {pdfLogoManual && <button onClick={()=>setPdfLogoManual("")} style={{padding:".4rem .6rem",borderRadius:"7px",border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontSize:".75rem"}}>✕</button>}
                  </div>
                  {!pdfLogoManual && activeAnalysis?.email_domain && (
                    <p style={{fontSize:".7rem",color:"var(--muted)",marginTop:".3rem"}}>
                      {lang==="fr"?"Logo détecté automatiquement depuis le domaine":"Logo auto-detected from domain"} <strong>{activeAnalysis.email_domain}</strong>
                    </p>
                  )}
                </div>
                {[
                  {label:lang==="fr"?"Exclure l'inventaire":"Exclude inventory",    val:!pdfShowInventory, set:()=>setPdfShowInventory(v=>!v)},
                  {label:lang==="fr"?"Masquer les prix":"Hide prices",              val:!pdfShowPrices,    set:()=>setPdfShowPrices(v=>!v)},
                  {label:lang==="fr"?"Inclure les licences désactivées":"Include disabled licences", val:pdfShowDisabled, set:()=>setPdfShowDisabled(v=>!v)},
                ].map(({label,val,set},i)=>(
                  <div key={i} onClick={set} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"0.5px solid var(--border)",cursor:"pointer",userSelect:"none"}}>
                    <span style={{fontSize:".8rem",color:"var(--text)"}}>{label}</span>
                    <div style={{width:"36px",height:"20px",borderRadius:"99px",flexShrink:0,background:val?"var(--accent)":"var(--border)",position:"relative",transition:"background .15s"}}>
                      <div style={{position:"absolute",top:"2px",left:val?"18px":"2px",width:"16px",height:"16px",borderRadius:"50%",background:"#fff",transition:"left .15s"}}/>
                    </div>
                  </div>
                ))}
                <div style={{marginBottom:".85rem",marginTop:".6rem"}}>
                  <div style={{fontSize:".75rem",color:"var(--muted)",marginBottom:".3rem"}}>{lang==="fr"?"Message personnalisé (avant les options)":"Custom message (before options)"}</div>
                  <textarea value={pdfCustomMessage} onChange={e=>setPdfCustomMessage(e.target.value)}
                    placeholder={lang==="fr"?"Ex : Suite à notre entretien du 15 avril…":"E.g. Following our meeting on April 15th…"}
                    rows={3} style={{width:"100%",fontSize:".8rem",padding:".5rem .65rem",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontFamily:"inherit",resize:"vertical",outline:"none"}}
                    onFocus={e=>e.target.style.borderColor="var(--accent)"} onBlur={e=>e.target.style.borderColor="var(--border)"}/>
                </div>
                <button className="btn-pdf" onClick={handlePdf} disabled={pdfLoading || files.length === 0 || (isBatch && activeTab === "global")}>
                  {pdfLoading ? <span className="spinner"/> : t.pdfBtnPreview}
                </button>
                {pdfPreviewUrl && (
                  <div ref={pdfPreviewRef} style={{marginTop:".75rem"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:".4rem"}}>
                      <span style={{fontSize:".75rem",color:"var(--muted)"}}>{lang==="fr"?"Aperçu (Ctrl+P pour imprimer)":"Preview (Ctrl+P to print)"}</span>
                      <button onClick={()=>window.open(pdfPreviewUrl,"_blank")} style={{fontSize:".72rem",padding:"2px 8px",borderRadius:"5px",border:"1px solid var(--border)",background:"transparent",color:"var(--accent)",cursor:"pointer"}}>{lang==="fr"?"Ouvrir ↗":"Open ↗"}</button>
                    </div>
                    <iframe src={pdfPreviewUrl} style={{width:"100%",height:"520px",border:"1px solid var(--border)",borderRadius:"8px"}} title="PDF Preview"/>
                  </div>
                )}
              </div>

              {/* Preview analyse */}
              {showPreview && (
                <div className="preview-area" style={{marginTop:"1rem"}}>
                  {isBatch && (
                    <div className="tab-bar">
                      <button className={`tab-btn${activeTab==="global"?" active":""}`} onClick={()=>setActiveTab("global")}>{t.tabGlobal}</button>
                      {analysisEntries.map(a=>(
                        <button key={a.filename} className={`tab-btn${activeTab===a.filename?" active":""}`} onClick={()=>setActiveTab(a.filename)}>
                          {(a.filename||"").replace(".csv","").slice(0,16)}
                          {analyses[a.filename]?.data?._source==="local" && <span title="Estimation locale" style={{marginLeft:"3px",opacity:.6}}>~</span>}
                          {a.data?.total > 0 && <span className="preview-tab-count">{a.data.total}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                  {activeTab==="global" && isBatch
                    ? <GlobalPreview analyses={Object.fromEntries(analysisEntries.filter(a=>a.filename).map(a=>[a.filename,a]))} t={t} discount={discount} expiryDays={expiryDays}/>
                    : (() => {
                        const entry = isBatch ? (analyses[activeTab] || analysisEntries[0]) : analysisEntries[0];
                        if (!entry?.data) return null;
                        return <PartnerPreview data={entry.data} t={t} discount={discount} expiryDays={expiryDays}/>;
                      })()
                  }
                </div>
              )}
            </div>

            {/* ── Colonne droite : identité + onglets Excel ── */}
            <div className="col-side">
              <div className="card">
                <h3>{t.agentTitle}</h3>
                <p className="coterm-hint" style={{marginBottom:".75rem"}}>{t.agentHint}</p>
                <div className="coterm-params">
                  <div className="param-row">
                    <label className="param-label">{t.senderLabel}</label>
                    <input value={sender} onChange={e=>setSender(e.target.value)} placeholder={t.senderPlaceholder}/>
                  </div>
                  <div className="param-row">
                    <label className="param-label">{t.senderEmailLabel}</label>
                    <input type="email" value={senderEmail} onChange={e=>setSenderEmail(e.target.value)} placeholder={t.senderEmailPlaceholder}/>
                  </div>
                </div>
              </div>
              <div className="card" style={{marginTop:"1rem"}}>
                <h3>{t.sheetsTitle}</h3>
                <div className="toggle-grid">
                  {Object.entries(t.sheetLabels).map(([k,label])=>(
                    <div key={k} className="toggle-wrapper" onMouseEnter={()=>setTooltip(k)} onMouseLeave={()=>setTooltip(null)}>
                      <label className={`toggle ${sheets[k]?"on":""}`}>
                        <input type="checkbox" checked={sheets[k]} onChange={()=>toggleSheet(k)}/>
                        {label}
                      </label>
                      {tooltip===k && <div className="tooltip">{t.tooltips[k]}</div>}
                    </div>
                  ))}
                </div>
              </div>
              <div style={{marginTop:"1rem"}}>
                <div className="generate-sticky-wrap" style={{display:"flex",gap:"8px",alignItems:"stretch"}}>
                  <button className="btn-generate" style={{marginBottom:0,flex:1}} onClick={handleSubmit} disabled={loading}>
                    {loading
                      ? <span style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",width:"100%",padding:"2px 0"}}>
                          <span style={{fontSize:".85rem",fontWeight:500}}>{genStep}</span>
                          <span style={{width:"100%",height:"4px",background:"rgba(255,255,255,.25)",borderRadius:"2px",overflow:"hidden"}}>
                            <span style={{display:"block",height:"100%",borderRadius:"2px",background:"rgba(255,255,255,.9)",width:`${Math.round((genStepIdx+1)/GEN_STEPS_COUNT*100)}%`,transition:"width 1.2s ease"}}/>
                          </span>
                        </span>
                      : files.length>1?t.btnGenerateBatch(files.length):t.btnGenerate}
                  </button>
                </div>
                <p style={{fontSize:".73rem",color:"var(--muted)",textAlign:"center",margin:".35rem 0 0",lineHeight:"1.4"}}>
                  🔒 {lang==="fr"
                    ? "Fichiers supprimés après téléchargement."
                    : "Files deleted after download."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── Outils avancés — toujours visibles sous les onglets ── */}
        {analysisEntries.length > 0 && v2Tab === "generate" && (
          <>
            <div className="section-divider" style={{marginTop:"1.5rem"}}>
              <span className="section-divider-label">{lang==="fr"?"Outils avancés":"Advanced tools"}</span>
            </div>
            <div className="card" style={{marginTop:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                <h3 style={{margin:0,color:"#1A3C5E"}}>📎 {lang==="fr"?"Rapport partiel — Sélection surlignée":"Partial report — Highlighted selection"}</h3>
              </div>
              <p className="coterm-hint" style={{marginBottom:"1rem"}}>{lang==="fr"?"Importez l'Excel renvoyé par votre client (lignes surlignées) pour générer un rapport Excel complet et un rapport PDF commercial sur les licences sélectionnées uniquement.":"Import the Excel returned by your client (highlighted rows) to generate a full Excel report and a commercial PDF report for the selected licences only."}</p>
              <div className={`coterm-select-dropzone${xlsxDragging?" drag-over":""}`}
                onDragOver={e=>{e.preventDefault();setXlsxDragging(true);}}
                onDragLeave={()=>setXlsxDragging(false)}
                onDrop={e=>{e.preventDefault();setXlsxDragging(false);const f=e.dataTransfer.files[0];if(f?.name.endsWith(".xlsx")){setXlsxFile(f);setXlsxDetected(0);setXlsxPreview([]);}}}
                onClick={()=>{const i=document.createElement("input");i.type="file";i.accept=".xlsx";i.onchange=e=>{const f=e.target.files[0];if(f){setXlsxFile(f);setXlsxDetected(0);setXlsxPreview([]); }};i.click();}}>
                {xlsxFile ? <><span style={{fontWeight:600}}>📊 </span>{xlsxFile.name}</> : <span>{lang==="fr"?"Glisser ou cliquer — fichier Excel annoté (.xlsx)":"Drop or click — annotated Excel file (.xlsx)"}</span>}
              </div>
              {xlsxError && <div className="alert alert-error" style={{marginTop:".5rem"}}>⚠️ {xlsxError}</div>}
              {xlsxFile && xlsxDetected === 0 && !xlsxLoading && (
                <button className="btn-coterm-select" style={{marginTop:".75rem"}} onClick={handleXlsxDetect}>
                  {lang==="fr"?"Détecter les lignes surlignées →":"Detect highlighted rows →"}
                </button>
              )}
              {xlsxDetected > 0 && (
                <div style={{marginTop:".75rem"}}>
                  <p style={{fontSize:".8rem",color:"var(--ok)",marginBottom:".5rem"}}>✅ {xlsxDetected} {lang==="fr"?`ligne${xlsxDetected>1?"s":""} surlignée${xlsxDetected>1?"s":""} détectée${xlsxDetected>1?"s":""}`:` highlighted row${xlsxDetected>1?"s":""} detected`}</p>
                  {xlsxPreview.length > 0 && (
                    <div style={{overflowX:"auto",marginBottom:".75rem"}}>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:".75rem"}}>
                        <thead><tr style={{background:"var(--bg2)"}}>
                          {["Client","Poste","Logiciel","Expiration","Statut"].map(h=><th key={h} style={{padding:"5px 8px",textAlign:"left",fontWeight:600,color:"var(--muted)",borderBottom:"1px solid var(--border)"}}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {xlsxPreview.slice(0,5).map((r,i)=>(
                            <tr key={i} style={{borderBottom:"0.5px solid var(--border)"}}>
                              <td style={{padding:"4px 8px"}}>{r.client||"—"}</td>
                              <td style={{padding:"4px 8px",color:"var(--muted)"}}>{r.computer||"—"}</td>
                              <td style={{padding:"4px 8px"}}>{r.software||"—"}</td>
                              <td style={{padding:"4px 8px",color:"var(--muted)"}}>{r.expiry||"—"}</td>
                              <td style={{padding:"4px 8px"}}>{r.status||"—"}</td>
                            </tr>
                          ))}
                          {xlsxPreview.length > 5 && <tr><td colSpan={5} style={{padding:"4px 8px",color:"var(--muted)",fontSize:".72rem",fontStyle:"italic"}}>+{xlsxPreview.length-5} {lang==="fr"?"autres lignes":"more rows"}</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div style={{display:"flex",gap:"8px"}}>
                    <button className="btn-coterm-select" style={{flex:1}} onClick={handleXlsxGenerate} disabled={xlsxLoading||!xlsxFile||xlsxDetected===0}>
                      {xlsxLoading?<span className="spinner"/>:lang==="fr"?"Générer le rapport Excel →":"Generate Excel report →"}
                    </button>
                    <button className="btn-coterm-select" style={{flex:1,background:"#1A3C5E"}} onClick={handleXlsxPdf} disabled={xlsxPdfLoading||!xlsxFile||xlsxDetected===0}>
                      {xlsxPdfLoading?<span className="spinner"/>:lang==="fr"?"Aperçu PDF →":"PDF preview →"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card" style={{marginTop:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                <h3 style={{margin:0,color:"#1D9E75"}}>🔀 {lang==="fr"?"Comparaison de deux exports CSV":"Compare two CSV exports"}</h3>
              </div>
              <p className="coterm-hint" style={{marginBottom:"1rem"}}>{lang==="fr"?"Comparez deux exports du Portail TSplus pour identifier les licences ajoutées, supprimées ou modifiées entre deux dates.":"Compare two TSplus Portal exports to identify licences added, removed or changed between two dates."}</p>
              <CsvCompare lang={lang} apiUrl={API_URL} expiryDays={expiryDays} />
            </div>

            <div className="card" style={{marginTop:"1rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:".75rem"}}>
                <h3 style={{margin:0,color:"#1D9E75"}}>🔍 {lang==="fr"?"Détecteur d'anomalies & doublons":"Anomaly & duplicate detector"}</h3>
              </div>
              <p className="coterm-hint" style={{marginBottom:"1rem"}}>{lang==="fr"?"Analysez un export TSplus pour détecter les doublons, licences orphelines, dates manquantes et incohérences avant d'envoyer une proposition.":"Analyse a TSplus export to detect duplicates, orphan licences, missing dates and inconsistencies before sending a proposal."}</p>
              <AnomalyDetector lang={lang} apiUrl={API_URL} expiryDays={expiryDays} discount={discount} />
            </div>
          </>
        )}

        {/* ── FAQ + Prochaines évolutions (toujours visibles) ── */}
        <FAQ t={t} />
        <div className="card" style={{marginTop:"1.5rem"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:"12px",marginBottom:"1.2rem",flexWrap:"wrap"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"4px"}}>
                <span style={{fontSize:"1.1rem"}}>🔮</span>
                <h3 style={{margin:0,color:"#1A3C5E",fontSize:"1rem"}}>
                  {lang==="fr"?"Nouveau portail TSplus — Cet outil sera prêt le jour J":"New TSplus portal — This tool will be ready on day one"}
                </h3>
              </div>
              <p style={{fontSize:".8rem",color:"var(--muted)",margin:0,lineHeight:1.5}}>
                {lang==="fr"
                  ? "La mise à jour du portail de licences TSplus est imminente. Nous avons analysé les nouvelles fonctionnalités — voici ce qui change et comment cet outil s'y adapte."
                  : "The TSplus licence portal update is imminent. We have analysed the new features — here is what changes and how this tool adapts."}
              </p>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:"6px",background:"rgba(29,158,117,.1)",border:"1px solid rgba(29,158,117,.3)",borderRadius:"20px",padding:"5px 12px",flexShrink:0}}>
              <span style={{width:"7px",height:"7px",borderRadius:"50%",background:"#1D9E75",flexShrink:0}}/>
              <span style={{fontSize:".72rem",fontWeight:600,color:"#1D9E75"}}>{lang==="fr"?"Prêt à migrer":"Migration ready"}</span>
            </div>
          </div>
          <div style={{background:"var(--bg2,#f8fafe)",border:"1px solid var(--border)",borderRadius:"10px",padding:"14px",marginBottom:"1.2rem"}}>
            <div style={{fontSize:".72rem",fontWeight:600,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:"10px"}}>{lang==="fr"?"Ce qui change dans l'export CSV":"What changes in the CSV export"}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"8px",alignItems:"center",fontSize:".78rem"}}>
              {[
                {old:lang==="fr"?"Statut U&S : 3 valeurs":"U&S status: 3 values",n:lang==="fr"?"7 valeurs dont Auto-renew":"7 values incl. Auto-renew"},
                {old:lang==="fr"?"Pas de type de licence":"No licence type",n:"Perpetual · Subscription · Trial"},
                {old:lang==="fr"?"1 clé d'activation par client":"1 activation key per client",n:lang==="fr"?"∞ clés par client (Custom AK)":"∞ keys per client (Custom AK)"},
              ].map((row,i)=>(
                <div key={i} style={{display:"contents"}}>
                  <div style={{padding:"6px 10px",background:"rgba(192,57,43,.07)",borderRadius:"6px",color:"#c0392b",textDecoration:"line-through",opacity:.8}}>{row.old}</div>
                  <div style={{textAlign:"center",color:"var(--muted)",fontSize:"1rem"}}>→</div>
                  <div style={{padding:"6px 10px",background:"rgba(29,158,117,.08)",borderRadius:"6px",color:"#1D9E75",fontWeight:600}}>{row.n}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"10px"}}>
            {[
              {icon:"✅",color:"#1D9E75",bgColor:"rgba(29,158,117,.08)",title:lang==="fr"?"Type de licence":"Licence type",subtitle:"Perpetual · Subscription · Trial",status:lang==="fr"?"Détection auto prévue":"Auto-detection planned",body:lang==="fr"?"Confirmé dans l'URL du nouveau portail.":"Confirmed in the new portal URL."},
              {icon:"✅",color:"#1D9E75",bgColor:"rgba(29,158,117,.08)",title:lang==="fr"?"Statuts U&S enrichis":"Enriched U&S statuses",subtitle:lang==="fr"?"7 valeurs au lieu de 3":"7 values instead of 3",status:lang==="fr"?"Mapping complet prévu":"Full mapping planned",body:lang==="fr"?"None, Failed renewal, Auto-renew s'ajoutent.":"None, Failed renewal, Auto-renew added."},
              {icon:"✅",color:"#1D9E75",bgColor:"rgba(29,158,117,.08)",title:lang==="fr"?"Auto-renouvellement":"Auto-renewal",subtitle:lang==="fr"?"Exclu du co-terming":"Excluded from co-terming",status:lang==="fr"?"Logique déjà intégrée":"Logic already integrated",body:lang==="fr"?"Les licences Auto-renew ne seront pas proposées comme urgentes.":"Auto-renew licences won't count as urgent."},
              {icon:"🔄",color:"#e67e22",bgColor:"rgba(230,126,34,.08)",title:lang==="fr"?"Multi-clés d'activation":"Multi activation keys",subtitle:"∞ keys per client",status:lang==="fr"?"Adaptation en cours":"Adaptation in progress",body:lang==="fr"?"Un client peut avoir plusieurs clés (Default + Custom).":"A client can have multiple activation keys."},
              {icon:"✅",color:"#1D9E75",bgColor:"rgba(29,158,117,.08)",title:lang==="fr"?"Compatibilité totale":"Full compatibility",subtitle:lang==="fr"?"Ancien format conservé":"Old format preserved",status:lang==="fr"?"Aucune action requise":"No action required",body:lang==="fr"?"Le format CSV actuel continuera de fonctionner.":"The current CSV format will keep working."},
            ].map((item,i)=>(
              <div key={i} style={{border:"1px solid var(--border)",borderRadius:"10px",padding:"12px",background:item.bgColor}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"4px"}}>
                  <div style={{fontWeight:700,fontSize:".83rem",color:"#1A3C5E"}}>{item.title}</div>
                  <span style={{fontSize:".9rem"}}>{item.icon}</span>
                </div>
                <div style={{fontSize:".7rem",color:item.color,fontWeight:600,marginBottom:"4px"}}>{item.subtitle}</div>
                <div style={{fontSize:".68rem",color:"var(--muted)",fontStyle:"italic",marginBottom:"6px",borderBottom:"0.5px solid var(--border)",paddingBottom:"6px"}}>{item.status}</div>
                <div style={{fontSize:".75rem",color:"var(--muted)",lineHeight:1.5}}>{item.body}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="footer"><p>{t.footer}</p></footer>
    </div>
  );
}

function CsvCompare({ lang, apiUrl, expiryDays }) {
  const [before, setBefore] = useState(null);
  const [after,  setAfter]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("added");
  const beforeRef = useRef(); const afterRef = useRef();
  const isFr = lang === "fr";

  const STATUS_COLOR = (s) => {
    if (!s) return "var(--muted)";
    const sl = s.toLowerCase();
    if (sl.includes("expir") && !sl.includes("dans")) return "#c0392b";
    if (sl.includes("dans") || sl.includes("days")) return "#e67e22";
    return "#27ae60";
  };

  const FIELD_LABELS = {
    expiry:   isFr ? "Expiration" : "Expiry",
    status:   isFr ? "Statut" : "Status",
    users:    isFr ? "Utilisateurs" : "Users",
    edition:  "Édition",
    software: isFr ? "Logiciel" : "Software",
    client:   isFr ? "Assignation" : "Assignment",
  };

  const handleCompare = async () => {
    if (!before || !after) return;
    setLoading(true); setError(""); setResult(null);
    const fd = new FormData();
    fd.append("file_before", before);
    fd.append("file_after",  after);
    fd.append("expiry_warning_days", expiryDays || 90);
    fd.append("lang", lang);
    try {
      const res = await fetch(`${apiUrl}/compare-csv`, { method:"POST", body:fd, signal:AbortSignal.timeout(30000) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
      setTab(data.added.length ? "added" : data.removed.length ? "removed" : "changed");
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const DropZone = ({label, file, onFile, inputRef}) => (
    <div style={{flex:1}}>
      <div style={{fontSize:".75rem",color:"var(--muted)",marginBottom:".3rem",fontWeight:600}}>{label}</div>
      <div
        onClick={()=>inputRef.current.click()}
        style={{
          border:`2px dashed ${file?"var(--accent)":"var(--border)"}`,
          borderRadius:"8px", padding:".75rem", textAlign:"center",
          cursor:"pointer", fontSize:".8rem",
          background: file?"rgba(232,98,10,.04)":"transparent",
          color: file?"var(--text)":"var(--muted)", transition:"all .15s"
        }}>
        <input ref={inputRef} type="file" accept=".csv" style={{display:"none"}}
          onChange={e=>e.target.files[0]&&onFile(e.target.files[0])}/>
        {file ? <><span style={{color:"var(--accent)"}}>✓ </span>{file.name}</> : <span>📂 {isFr?"Glisser ou cliquer":"Drop or click"}</span>}
      </div>
    </div>
  );

  const RowTable = ({rows, highlight}) => (
    <div style={{border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden",fontSize:".75rem"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",background:"var(--bg2)",padding:".35rem .6rem",color:"var(--muted)",fontWeight:600,gap:"6px"}}>
        <span>{isFr?"Client":"Client"}</span>
        <span>{isFr?"Logiciel":"Software"}</span>
        <span>{isFr?"Expiration":"Expiry"}</span>
        <span>{isFr?"Statut":"Status"}</span>
      </div>
      <div style={{maxHeight:"300px",overflowY:"auto"}}>
        {rows.map((r,i) => (
          <div key={i} style={{
            display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",
            padding:".3rem .6rem",gap:"6px",alignItems:"center",
            background:i%2===0?"transparent":"var(--bg2)",
            borderTop:"1px solid var(--border)"
          }}>
            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.client}</span>
            <span style={{color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontSize:".7rem"}}>{r.software}</span>
            <span style={{whiteSpace:"nowrap",fontSize:".7rem"}}>{r.expiry}</span>
            <span style={{whiteSpace:"nowrap",fontSize:".7rem",color:STATUS_COLOR(r.status)}}>{r.status?.split(" ")[0]||"—"}</span>
          </div>
        ))}
        {rows.length===0 && <div style={{padding:".6rem",color:"var(--muted)",textAlign:"center"}}>{isFr?"Aucune":"None"}</div>}
      </div>
    </div>
  );

  const ChangedTable = ({rows}) => (
    <div style={{border:"1px solid var(--border)",borderRadius:"8px",overflow:"hidden",fontSize:".75rem"}}>
      <div style={{background:"var(--bg2)",padding:".35rem .6rem",color:"var(--muted)",fontWeight:600}}>
        {isFr?"Client — Logiciel — Champ modifié":"Client — Software — Changed field"}
      </div>
      <div style={{maxHeight:"300px",overflowY:"auto"}}>
        {rows.map((c,i) => (
          <div key={i} style={{padding:".4rem .6rem",borderTop:"1px solid var(--border)",background:i%2===0?"transparent":"var(--bg2)"}}>
            <div style={{fontWeight:600,marginBottom:".2rem"}}>{c.row.client} <span style={{color:"var(--muted)",fontWeight:400,fontSize:".7rem"}}>· {c.row.software}</span></div>
            {Object.entries(c.diffs).map(([field, {before:bv, after:av}]) => (
              <div key={field} style={{fontSize:".7rem",color:"var(--muted)",display:"flex",gap:"6px",alignItems:"center"}}>
                <span style={{fontWeight:600,color:"var(--text)"}}>{FIELD_LABELS[field]||field} :</span>
                <span style={{textDecoration:"line-through",color:"#c0392b"}}>{String(bv)||"—"}</span>
                <span>→</span>
                <span style={{color:"#27ae60"}}>{String(av)||"—"}</span>
              </div>
            ))}
          </div>
        ))}
        {rows.length===0 && <div style={{padding:".6rem",color:"var(--muted)",textAlign:"center"}}>{isFr?"Aucune":"None"}</div>}
      </div>
    </div>
  );

  return (
    <>
      <div style={{display:"flex",gap:"10px",marginBottom:".85rem"}}>
        <DropZone label={isFr?"Export AVANT (ancien)":"Export BEFORE (older)"} file={before} onFile={setBefore} inputRef={beforeRef}/>
        <DropZone label={isFr?"Export APRÈS (récent)":"Export AFTER (recent)"} file={after}  onFile={setAfter}  inputRef={afterRef}/>
      </div>

      {error && <div className="alert alert-error" style={{marginBottom:".75rem"}}>⚠️ {error}</div>}

      <button className="btn-coterm-select" onClick={handleCompare}
        disabled={loading || !before || !after}>
        {loading ? <span className="spinner"/> : isFr?"Comparer les deux exports →":"Compare the two exports →"}
      </button>

      {result && (
        <div style={{marginTop:"1rem"}}>
          {/* Résumé */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:".85rem"}}>
            {[
              {key:"added",   label:isFr?"Ajoutées":"Added",    color:"#27ae60", bg:"#d4edda", count:result.summary.added},
              {key:"removed", label:isFr?"Supprimées":"Removed", color:"#c0392b", bg:"#fde8e8", count:result.summary.removed},
              {key:"changed", label:isFr?"Modifiées":"Changed", color:"#e67e22", bg:"#fef3cd", count:result.summary.changed},
            ].map(({key,label,color,bg,count}) => (
              <div key={key} onClick={()=>setTab(key)} style={{
                padding:".5rem",borderRadius:"8px",textAlign:"center",cursor:"pointer",
                background:tab===key?bg:"var(--bg2)",
                border:`1px solid ${tab===key?color:"var(--border)"}`,transition:"all .15s"
              }}>
                <div style={{fontSize:"1.4rem",fontWeight:700,color}}>{count}</div>
                <div style={{fontSize:".72rem",color:"var(--muted)"}}>{label}</div>
              </div>
            ))}
          </div>

          {tab==="added"   && <RowTable rows={result.added}/>}
          {tab==="removed" && <RowTable rows={result.removed}/>}
          {tab==="changed" && <ChangedTable rows={result.changed}/>}

          <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:".5rem",textAlign:"right"}}>
            {isFr
              ? `${result.summary.before} licences avant · ${result.summary.after} après`
              : `${result.summary.before} licences before · ${result.summary.after} after`}
          </div>
        </div>
      )}
    </>
  );
}

function AnomalyDetector({ lang, apiUrl, expiryDays, discount }) {
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [error,   setError]   = useState("");
  const [openIdx, setOpenIdx] = useState(null);
  const fileRef = useRef();
  const isFr = lang === "fr";

  const SEVERITY = {
    error:   { color:"#c0392b", bg:"#fde8e8", border:"#e0a0a0", icon:"🔴" },
    warning: { color:"#e67e22", bg:"#fef3cd", border:"#f0c040", icon:"🟡" },
    info:    { color:"#2980b9", bg:"#ebf5fb", border:"#aed6f1", icon:"🔵" },
  };

  const handleAnalyse = async () => {
    if (!file) return;
    setLoading(true); setError(""); setResult(null); setOpenIdx(null);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("expiry_warning_days", expiryDays || 90);
    fd.append("lang", lang);
    fd.append("reseller_discount", (discount || 20) / 100);
    try {
      const res = await fetch(`${apiUrl}/detect-anomalies`, { method:"POST", body:fd, signal:AbortSignal.timeout(30000) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch(e) { setError(e.message); }
    finally { setLoading(false); }
  };

  return (
    <>
      <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:".85rem"}}>
        <div onClick={()=>fileRef.current.click()} style={{
          flex:1, border:`2px dashed ${file?"#1D9E75":"var(--border)"}`,
          borderRadius:"8px", padding:".65rem 1rem", cursor:"pointer",
          fontSize:".8rem", color:file?"#1D9E75":"var(--muted)",
          background:file?"rgba(29,158,117,.04)":"transparent", transition:"all .15s"
        }}>
          <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}}
            onChange={e=>{ if(e.target.files[0]){ setFile(e.target.files[0]); setResult(null); e.target.value=""; }}}/>
          {file ? <><span style={{fontWeight:600}}>✓ </span>{file.name}</> : <span>📂 {isFr?"Glisser ou cliquer — fichier CSV":"Drop or click — CSV file"}</span>}
        </div>
        {file && <button onClick={()=>{setFile(null);setResult(null);setError("");}} style={{background:"none",border:"1px solid var(--border)",borderRadius:"6px",color:"var(--muted)",cursor:"pointer",padding:".35rem .6rem",fontSize:".8rem"}}>✕</button>}
      </div>

      {error && <div className="alert alert-error" style={{marginBottom:".75rem"}}>⚠️ {error}</div>}

      <button className="btn-coterm-select" style={{background:"#1D9E75"}} onClick={handleAnalyse} disabled={loading || !file}>
        {loading ? <span className="spinner"/> : isFr?"Analyser le parc →":"Analyse the park →"}
      </button>

      {result && (
        <div style={{marginTop:"1rem"}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px",marginBottom:"1rem"}}>
            {[
              {label:isFr?"Critique":"Critical",  key:"error",   ...SEVERITY.error},
              {label:isFr?"Attention":"Warning",   key:"warning", ...SEVERITY.warning},
              {label:isFr?"Info":"Info",           key:"info",    ...SEVERITY.info},
            ].map(s => (
              <div key={s.key} style={{padding:".6rem",borderRadius:"8px",textAlign:"center",background:s.bg,border:`1px solid ${s.border}`}}>
                <div style={{fontSize:"1.4rem",fontWeight:700,color:s.color}}>{result.counts[s.key]}</div>
                <div style={{fontSize:".7rem",color:s.color}}>{s.icon} {s.label}</div>
              </div>
            ))}
          </div>

          {result.anomalies.length === 0
            ? <div style={{textAlign:"center",padding:"1.5rem",color:"#1D9E75",fontWeight:600,fontSize:".9rem"}}>
                ✅ {isFr?`Aucune anomalie détectée — ${result.total_rows} licences analysées`:`No anomalies detected — ${result.total_rows} licences analysed`}
              </div>
            : result.anomalies.map((a, i) => {
                const s = SEVERITY[a.severity];
                const isOpen = openIdx === i;
                return (
                  <div key={i} style={{marginBottom:"8px",border:`1px solid ${s.border}`,borderRadius:"8px",overflow:"hidden"}}>
                    <div onClick={()=>setOpenIdx(isOpen?null:i)} style={{
                      display:"flex",justifyContent:"space-between",alignItems:"center",
                      padding:".6rem .85rem",background:s.bg,cursor:"pointer"
                    }}>
                      <div>
                        <span style={{fontWeight:700,fontSize:".85rem",color:s.color}}>{s.icon} {a.title}</span>
                        <span style={{fontSize:".75rem",color:"var(--muted)",marginLeft:"8px"}}>{a.detail}</span>
                      </div>
                      <span style={{color:s.color,fontSize:".8rem"}}>{isOpen?"▲":"▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{fontSize:".75rem"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",background:"var(--bg2)",padding:".3rem .6rem",color:"var(--muted)",fontWeight:600,gap:"6px"}}>
                          <span>{isFr?"Client":"Client"}</span>
                          <span>{isFr?"Poste":"Machine"}</span>
                          <span>{isFr?"Logiciel":"Software"}</span>
                          <span>{isFr?"Expiration":"Expiry"}</span>
                        </div>
                        {a.rows.map((r,j) => (
                          <div key={j} style={{
                            display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",
                            padding:".3rem .6rem",gap:"6px",
                            borderTop:"1px solid var(--border)",
                            background:j%2===0?"transparent":"var(--bg2)"
                          }}>
                            <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.client}</span>
                            <span style={{color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.computer}</span>
                            <span style={{color:"var(--muted)",fontSize:".7rem"}}>{r.software}{r.note?` (${r.note})`:""}</span>
                            <span style={{color:"var(--muted)",whiteSpace:"nowrap",fontSize:".7rem"}}>{r.expiry}</span>
                          </div>
                        ))}
                        {a.rows.length >= 10 && (
                          <div style={{padding:".3rem .6rem",color:"var(--muted)",fontSize:".7rem",fontStyle:"italic",borderTop:"1px solid var(--border)"}}>
                            {isFr?"(10 premières lignes affichées)":"(first 10 rows shown)"}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
          }
          <div style={{fontSize:".7rem",color:"var(--muted)",marginTop:".5rem",textAlign:"right"}}>
            {result.total_rows} {isFr?"licences analysées":"licences analysed"} · {result.total_anomalies} {isFr?"entrées concernées":"entries affected"}
          </div>
        </div>
      )}
    </>
  );
}

function ParkDashboard({ analyses, lang, expiryDays, t, files }) {
  const isFr = lang === "fr";
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [licenceRows, setLicenceRows] = useState([]);
  const [licenceSort, setLicenceSort] = useState({col:"urgency", dir:"asc"});
  const [licenceFilter, setLicenceFilter] = useState("");
  const [filterSoftware, setFilterSoftware] = useState([]);
  const [filterType, setFilterType]     = useState([]);
  const [filterStatus, setFilterStatus] = useState([]);

  // Agréger toutes les données
  const total    = analyses.reduce((s,a) => s + (a.data?.total||0), 0);
  const active   = analyses.reduce((s,a) => s + (a.data?.active||0), 0);
  const expiring = analyses.reduce((s,a) => s + (a.data?.expiring_soon||0), 0);
  const expired  = analyses.reduce((s,a) => s + (a.data?.expired_us||0), 0);
  const noUs     = total - active - expiring - expired;

  const pctActive   = total > 0 ? Math.round(active/total*100)   : 0;
  const pctExpiring = total > 0 ? Math.round(expiring/total*100) : 0;
  const pctExpired  = total > 0 ? Math.round(expired/total*100)  : 0;

  // Top clients par urgence (expiré × valeur approx)
  const topClients = [...analyses]
    .filter(a => a.data?.total > 0)
    .sort((a,b) => (b.data?.expired_us||0) - (a.data?.expired_us||0))
    .slice(0, 5);

  // Produits agrégés
  const prodMap = {};
  analyses.forEach(a => {
    if (!a.data?.products) return;
    Object.entries(a.data.products).forEach(([k,v]) => {
      prodMap[k] = (prodMap[k]||0) + v;
    });
  });
  const products = Object.entries(prodMap).sort((a,b)=>b[1]-a[1]);

  // Alertes issues du détecteur (si données disponibles)
  const alerts = [];
  if (expired > 0)  alerts.push({ color:"#c0392b", bg:"#fde8e8", icon:"🔴", msg: isFr ? `${expired} licence${expired>1?"s":""} avec U&S expiré` : `${expired} licence${expired>1?"s":""} with expired U&S` });
  if (expiring > 0) alerts.push({ color:"#e67e22", bg:"#fef3cd", icon:"🟡", msg: isFr ? `${expiring} licence${expiring>1?"s":""} expire${expiring>1?"nt":""} dans moins de ${expiryDays} jours` : `${expiring} licence${expiring>1?"s":""} expiring within ${expiryDays} days` });
  if (noUs > 0)     alerts.push({ color:"#2980b9", bg:"#ebf5fb", icon:"🔵", msg: isFr ? `${noUs} licence${noUs>1?"s":""} sans date U&S renseignée` : `${noUs} licence${noUs>1?"s":""} with no U&S date` });

  // Parse CSV rows for accordion
  useEffect(() => {
    if (!files || files.length === 0) { setLicenceRows([]); return; }
    const parseAll = async () => {
      const all = [];
      for (const file of files) {
        const text = await file.text();
        const lines = text.split("\n").filter(l => l.trim());
        if (lines.length < 2) continue;
        const sep = ";";
        const header = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,"").replace(/^\ufeff/,"").toLowerCase());
        const idx = n => header.findIndex(h => h === n);
        const iStatus   = idx("status"); const iSoftware = idx("software");
        const iEdition  = idx("edition"); const iUsers = idx("users");
        const iComputer = idx("computer_name"); const iAK = idx("activation_key");
        const iExpiry   = idx("support_expiry_date"); const iType = idx("type");
        const iOrder    = idx("orderid"); const iClient = idx("email"); const iCompany = idx("customer_comments");
        const iWithSup  = idx("with_support"); const iCreated = idx("created_at");
        for (let i = 1; i < lines.length; i++) {
          const c = lines[i].split(sep).map(v => v.trim().replace(/^"|"$/g,""));
          const statusVal1 = (c[iStatus]||"").toLowerCase(); if (iStatus >= 0 && (statusVal1 === "disabled" || statusVal1 === "disabling..." || statusVal1 === "hidden")) continue;
          const ws = iWithSup >= 0 ? parseInt(c[iWithSup]) : 0;
          const expiry = iExpiry >= 0 ? c[iExpiry] : "";
          const today = new Date(); today.setHours(0,0,0,0);
          let usStatus = "none";
          if (ws === 1 && expiry) {
            const ed = new Date(expiry); const diff = (ed - today) / 86400000;
            if (diff < 0) usStatus = "expired";
            else if (diff <= expiryDays) usStatus = "expiring";
            else usStatus = "active";
          } else if (ws === 1) usStatus = "nodate";
          all.push({
            client:   iClient   >= 0 ? c[iClient]   : "—",
            company:  iCompany  >= 0 ? c[iCompany]  : "—",
            software: iSoftware >= 0 ? c[iSoftware] : "—",
            edition:  iEdition  >= 0 ? c[iEdition]  : "—",
            users:    iUsers    >= 0 ? c[iUsers]    : "—",
            computer: iComputer >= 0 ? c[iComputer] : "—",
            ak:       iAK       >= 0 ? c[iAK]?.slice(0,20) : "—",
            expiry,
            type:     iType >= 0 ? c[iType] : "Perpetual",
            orderid:  iOrder    >= 0 ? c[iOrder]    : "—",
            created:  iCreated  >= 0 ? c[iCreated]?.slice(0,10) : "—",
            usStatus,
            _file: file.name,
          });
        }
      }
      setLicenceRows(all);
    };
    parseAll();
  }, [files, expiryDays]);

  const US_BADGE = {
    active:   { bg:"#D4EDDA", color:"#155724", label: isFr?"Actif":"Active" },
    expiring: { bg:"#FEF3CD", color:"#856404", label: isFr?"Bientôt":"Expiring" },
    expired:  { bg:"#FDE8E8", color:"#721C24", label: isFr?"Expiré":"Expired" },
    nodate:   { bg:"#FDE8E8", color:"#721C24", label: isFr?"Expiré":"Expired" },
    none:     { bg:"#FDE8E8", color:"#721C24", label: isFr?"Expiré":"Expired" },
  };

  // Valeurs uniques pour les filtres
  const uniqSoftware = [...new Set(licenceRows.map(r => r.software).filter(Boolean))].sort();
  const uniqType     = [...new Set(licenceRows.map(r => r.type||"Perpetual").filter(Boolean))].sort();
  const uniqStatus   = [...new Set(licenceRows.map(r => r.usStatus).filter(Boolean))];

  const toggleFilter = (setter, val) => setter(prev =>
    prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
  );

  const sortedFiltered = [...licenceRows]
    .filter(r => {
      if (licenceFilter) {
        const q = licenceFilter.toLowerCase();
        if (![r.client, r.software, r.computer, r.ak, r.edition].some(v => v?.toLowerCase().includes(q))) return false;
      }
      if (filterSoftware.length > 0 && !filterSoftware.includes(r.software)) return false;
      if (filterType.length > 0    && !filterType.includes(r.type||"Perpetual")) return false;
      if (filterStatus.length > 0  && !filterStatus.includes(r.usStatus)) return false;
      return true;
    })
    .sort((a, b) => {
      const _urgency = {expiring: 0, expired: 1, nodate: 2, none: 2, active: 3};
      const col = licenceSort.col;
      if (col === "urgency" || col === "expiry") {
        const ua = _urgency[a.usStatus] ?? 3;
        const ub = _urgency[b.usStatus] ?? 3;
        if (ua !== ub) return licenceSort.dir === "asc" ? ua - ub : ub - ua;
        // À égalité de statut, trier par date d'expiration
        const ea = a.expiry || "9999"; const eb = b.expiry || "9999";
        return licenceSort.dir === "asc" ? ea.localeCompare(eb) : eb.localeCompare(ea);
      }
      const va = a[col] || ""; const vb = b[col] || "";
      return licenceSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const handleSort = col => setLicenceSort(s => ({ col, dir: s.col === col && s.dir === "asc" ? "desc" : "asc" }));
  const sortIcon = col => licenceSort.col === col ? (licenceSort.dir === "asc" ? " ▲" : " ▼") : "";
  const PROD_SHORT = { "Remote Access":"RA", "Advanced Security":"AS", "Server Monitoring":"SM", "Virtual Printer":"VP", "Two-Factor Authentication":"2FA" };

  return (
    <div style={{marginBottom:"1rem",marginTop:".75rem"}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px"}}>
        <div style={{width:"3px",height:"18px",background:"#1A3C5E",borderRadius:"2px"}}/>
        <span style={{fontSize:".78rem",fontWeight:700,color:"#1A3C5E",textTransform:"uppercase",letterSpacing:".06em"}}>
          {isFr ? "Dashboard du parc" : "Park dashboard"}
        </span>
        {analyses.length > 1 && (
          <span style={{fontSize:".7rem",color:"var(--muted)",marginLeft:"4px"}}>
            · {analyses.length} {isFr?"clients":"clients"}
          </span>
        )}
      </div>

      {/* Barre de progression */}
      <div style={{marginBottom:"12px"}}>
        <div style={{height:"10px",borderRadius:"5px",overflow:"hidden",background:"var(--border)",display:"flex",gap:"2px"}}>
          {active   > 0 && <div style={{flex:active,  background:"#1D9E75",transition:"flex .4s"}}/>}
          {expiring > 0 && <div style={{flex:expiring, background:"#e67e22",transition:"flex .4s"}}/>}
          {expired  > 0 && <div style={{flex:expired,  background:"#c0392b",transition:"flex .4s"}}/>}
          {noUs     > 0 && <div style={{flex:noUs,     background:"#bbb",transition:"flex .4s"}}/>}
        </div>
        <div style={{display:"flex",gap:"12px",marginTop:"5px",flexWrap:"wrap"}}>
          {[
            {label:isFr?"U&S Actif":"U&S Active",       val:active,   pct:pctActive,   color:"#1D9E75"},
            {label:isFr?`Bientôt <${expiryDays}j`:`Soon <${expiryDays}d`, val:expiring, pct:pctExpiring, color:"#e67e22"},
            {label:isFr?"U&S Expiré":"U&S Expired",     val:expired,  pct:pctExpired,  color:"#c0392b"},
          ].map((s,i) => s.val > 0 && (
            <div key={i} style={{display:"flex",alignItems:"center",gap:"4px"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",background:s.color,flexShrink:0}}/>
              <span style={{fontSize:".72rem",color:"var(--muted)"}}>{s.label}</span>
              <span style={{fontSize:".72rem",fontWeight:700,color:s.color}}>{s.val}</span>
              <span style={{fontSize:".68rem",color:"var(--muted)"}}>({s.pct}%)</span>
            </div>
          ))}
          <div style={{display:"flex",alignItems:"center",gap:"4px",marginLeft:"auto"}}>
            <span style={{fontSize:".72rem",color:"var(--muted)",fontWeight:500}}>{isFr?"Total":"Total"}</span>
            <span style={{fontSize:".78rem",fontWeight:700,color:"#1A3C5E"}}>{total}</span>
          </div>
        </div>
      </div>

      {/* Grille : produits + alertes + top clients */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"10px"}}>

        {/* Répartition produits */}
        {products.length > 0 && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:"8px"}}>
              {isFr?"Répartition produits":"Product breakdown"}
            </div>
            {products.map(([name, count], i) => {
              const pct = total > 0 ? Math.round(count/total*100) : 0;
              const COLORS = ["#1A3C5E","#1D9E75","#e67e22","#2980b9","#8e44ad"];
              return (
                <div key={i} style={{marginBottom:"6px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:"2px"}}>
                    <span style={{fontSize:".72rem",color:"var(--text)"}}>{PROD_SHORT[name]||name.replace("TSplus ","")}</span>
                    <span style={{fontSize:".72rem",fontWeight:600,color:COLORS[i%COLORS.length]}}>{count}</span>
                  </div>
                  <div style={{height:"4px",borderRadius:"2px",background:"var(--border)",overflow:"hidden"}}>
                    <div style={{width:`${pct}%`,height:"100%",background:COLORS[i%COLORS.length],borderRadius:"2px"}}/>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Alertes */}
        {alerts.length > 0 && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:"8px"}}>
              {isFr?"Alertes":"Alerts"}
            </div>
            {alerts.map((a,i) => (
              <div key={i} style={{
                display:"flex",alignItems:"flex-start",gap:"7px",
                padding:"6px 8px",borderRadius:"7px",
                background:a.bg,marginBottom:"5px"
              }}>
                <span style={{fontSize:"11px",lineHeight:1.4}}>{a.icon}</span>
                <span style={{fontSize:".74rem",color:a.color,lineHeight:1.4}}>{a.msg}</span>
              </div>
            ))}
          </div>
        )}

        {/* Top clients */}
        {topClients.length > 1 && (
          <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px"}}>
            <div style={{fontSize:".72rem",fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:".05em",marginBottom:"8px"}}>
              {isFr?"Top clients (expiré)":"Top clients (expired)"}
            </div>
            {topClients.map((a,i) => {
              const d = a.data;
              const expPct = d.total > 0 ? Math.round((d.expired_us||0)/d.total*100) : 0;
              return (
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"6px"}}>
                  <div style={{
                    width:"22px",height:"22px",borderRadius:"50%",flexShrink:0,
                    background:"#1A3C5E",display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:".65rem",fontWeight:700,color:"#fff"
                  }}>{i+1}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:".74rem",fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {d.company_name || a.filename?.replace(".csv","") || "—"}
                    </div>
                    <div style={{fontSize:".68rem",color:"var(--muted)"}}>
                      {d.expired_us||0} {isFr?"expirées":"expired"} · {d.total} {isFr?"lic.":"lic."}
                    </div>
                  </div>
                  <div style={{
                    fontSize:".68rem",fontWeight:700,padding:"2px 6px",borderRadius:"4px",
                    background: expPct > 50 ? "#fde8e8" : "#fef3cd",
                    color: expPct > 50 ? "#c0392b" : "#e67e22",
                    flexShrink:0
                  }}>{expPct}%</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordéon — liste complète des licences */}
      {licenceRows.length > 0 && (
        <div style={{marginTop:"10px",border:"1px solid var(--border)",borderRadius:"10px",overflow:"hidden"}}>
          <div
            onClick={() => setAccordionOpen(o => !o)}
            style={{
              display:"flex",justifyContent:"space-between",alignItems:"center",
              padding:"9px 14px",cursor:"pointer",
              background: accordionOpen ? "var(--bg2,#f8fafe)" : "var(--surface)",
              borderBottom: accordionOpen ? "1px solid var(--border)" : "none"
            }}>
            <span style={{fontSize:".78rem",fontWeight:700,color:"#1A3C5E"}}>
              📋 {isFr ? `Liste des licences (${licenceRows.length})` : `Licence list (${licenceRows.length})`}
            </span>
            <span style={{fontSize:".75rem",color:"var(--muted)"}}>{accordionOpen ? "▲" : "▼"}</span>
          </div>
          {accordionOpen && (
            <div>
              {/* Barre de recherche */}
              <div style={{padding:"8px 12px",borderBottom:"1px solid var(--border)"}}>
                <input
                  type="text"
                  value={licenceFilter}
                  onChange={e => setLicenceFilter(e.target.value)}
                  placeholder={isFr ? "Rechercher par client, logiciel, poste…" : "Search by client, software, computer…"}
                  style={{
                    width:"100%", fontSize:".78rem", padding:"5px 10px",
                    borderRadius:"7px", border:"1px solid var(--border)",
                    background:"var(--surface)", color:"var(--text)", outline:"none"
                  }}
                />
              </div>

              {/* Filtres pills */}
              {[
                { label: isFr?"Produit":"Product", values: uniqSoftware, active: filterSoftware, setter: setFilterSoftware,
                  short: v => PROD_SHORT[v]||v.replace("TSplus ","") },
                { label: "Type", values: uniqType, active: filterType, setter: setFilterType, short: v => v },
                { label: "U&S", values: uniqStatus, active: filterStatus, setter: setFilterStatus,
                  short: v => US_BADGE[v]?.label || v },
              ].filter(g => g.values.length > 1).map((group, gi) => (
                <div key={gi} style={{
                  display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap",
                  padding:"6px 12px",borderBottom:"1px solid var(--border)",
                  background:"var(--bg2,#f8fafe)"
                }}>
                  <span style={{fontSize:".68rem",fontWeight:700,color:"var(--muted)",minWidth:"40px"}}>{group.label}</span>
                  {group.values.map(val => {
                    const isOn = group.active.includes(val);
                    const statusBadge = group.setter === setFilterStatus ? US_BADGE[val] : null;
                    return (
                      <span key={val} onClick={() => toggleFilter(group.setter, val)} style={{
                        padding:"2px 8px", borderRadius:"99px", fontSize:".7rem",
                        cursor:"pointer", userSelect:"none", transition:"all .12s",
                        fontWeight: isOn ? 700 : 400,
                        background: isOn ? (statusBadge?.bg||"#1A3C5E") : "var(--surface)",
                        color: isOn ? (statusBadge?.color||"#fff") : "var(--muted)",
                        border: `1px solid ${isOn ? (statusBadge?.bg||"#1A3C5E") : "var(--border)"}`,
                      }}>
                        {group.short(val)}
                      </span>
                    );
                  })}
                  {group.active.length > 0 && (
                    <span onClick={() => group.setter([])} style={{fontSize:".68rem",color:"var(--accent)",cursor:"pointer",marginLeft:"2px"}}>
                      ✕ {isFr?"tout":"all"}
                    </span>
                  )}
                </div>
              ))}
              {/* Tableau */}
              <div style={{overflowX:"auto",maxHeight:"400px",overflowY:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:".74rem"}}>
                  <thead>
                    <tr style={{background:"var(--bg2,#f8fafe)",position:"sticky",top:0,zIndex:1}}>
                      {[
                        {key:"client",  label: isFr?"Compte / Email":"Account / Email"},
                        {key:"software",label: isFr?"Produit":"Product"},
                        {key:"type",    label: "Type"},
                        {key:"computer",label: isFr?"Poste":"Computer"},
                        {key:"ak",      label: isFr?"Clé d'activation":"Activation key"},
                        {key:"expiry",  label: "Updates & Support"},
                        {key:"created", label: isFr?"Création":"Created"},
                      ].map(col => (
                        <th key={col.key} onClick={() => handleSort(col.key)} style={{
                          padding:"7px 10px", textAlign:"left", fontWeight:600,
                          color:"var(--muted)", cursor:"pointer", whiteSpace:"nowrap",
                          borderBottom:"1px solid var(--border)", userSelect:"none",
                          fontSize:".7rem", letterSpacing:".03em"
                        }}>
                          {col.label}{sortIcon(col.key)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedFiltered.map((r, i) => {
                      const badge = US_BADGE[r.usStatus] || US_BADGE.none;
                      const cleanClient = (!r.client || r.client.startsWith("(") || r.client === "—") ? "—" : r.client;
                      return (
                        <tr key={i} style={{borderBottom:"0.5px solid var(--border)",background:i%2===0?"transparent":"var(--bg2,#f8fafe)"}}>
                          <td style={{padding:"5px 10px",maxWidth:"120px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:"var(--text)"}}>{cleanClient}</td>
                          <td style={{padding:"5px 10px",whiteSpace:"nowrap",color:"var(--text)",fontWeight:500}}>{(PROD_SHORT[r.software]||r.software?.replace("TSplus ",""))}<span style={{color:"var(--muted)",fontWeight:400}}> · {r.edition}</span></td>
                          <td style={{padding:"5px 10px",whiteSpace:"nowrap"}}>
                            <span style={{fontSize:".68rem",padding:"2px 6px",borderRadius:"4px",background:"var(--border)",color:"var(--muted)"}}>{r.type||"Perpetual"}</span>
                          </td>
                          <td style={{padding:"5px 10px",color:"var(--muted)",maxWidth:"100px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.computer}</td>
                          <td style={{padding:"5px 10px",fontFamily:"monospace",fontSize:".68rem",color:"var(--muted)"}}>{r.ak}</td>
                          <td style={{padding:"5px 10px",whiteSpace:"nowrap"}}>
                            <span style={{fontSize:".7rem",padding:"2px 7px",borderRadius:"4px",background:badge.bg,color:badge.color,fontWeight:600}}>
                              {badge.label}{r.expiry ? ` · ${r.expiry}` : ""}
                            </span>
                          </td>
                          <td style={{padding:"5px 10px",color:"var(--muted)",whiteSpace:"nowrap"}}>{r.created}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {sortedFiltered.length === 0 && (
                  <div style={{padding:"1.5rem",textAlign:"center",color:"var(--muted)",fontSize:".78rem"}}>
                    {isFr ? "Aucun résultat" : "No results"}
                  </div>
                )}
              </div>
              <div style={{padding:"5px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"0.5px solid var(--border)"}}>
                <span style={{fontSize:".68rem",color:"var(--muted)"}}>
                  {sortedFiltered.length} {isFr ? "licences affichées" : "licences shown"}{licenceFilter ? ` · filtre: "${licenceFilter}"` : ""}
                </span>
                <button onClick={() => {
                  const cols = ["client","software","edition","type","users","computer","ak","expiry","usStatus","created","orderid"];
                  const headers = [isFr?"Compte":"Account","Produit","Édition","Type","Util.","Poste","Clé activation","Expiration U&S","Statut U&S","Création","Order ID"];
                  const csv = [headers.join(";"), ...sortedFiltered.map(r =>
                    cols.map(k => `"${(r[k]||"").toString().replace(/"/g,'""')}"`).join(";")
                  )].join("\n");
                  const blob = new Blob(["\uFEFF"+csv], {type:"text/csv;charset=utf-8"});
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(blob);
                  a.download = `licences_export_${new Date().toISOString().slice(0,10)}.csv`;
                  a.click();
                }} style={{
                  fontSize:".72rem",padding:"3px 10px",borderRadius:"6px",
                  border:"1px solid var(--border)",background:"var(--surface)",
                  color:"var(--text)",cursor:"pointer",display:"flex",alignItems:"center",gap:"4px"
                }}>
                  ⬇ {isFr ? "Exporter CSV" : "Export CSV"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LicenceTable({ files, lang, expiryDays }) {
  const isFr = lang === "fr";
  const [rows, setRows] = useState([]);
  const [sort, setSort] = useState({col:"urgency", dir:"asc"});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [colWidths, setColWidths] = useState({});
  const resizeRef = useRef({});
  const [search, setSearch] = useState("");
  const [openFilter, setOpenFilter] = useState(null); // which filter dropdown is open

  // Filter states
  const [fProduct,  setFProduct]  = useState([]);
  const [fType,     setFType]     = useState([]);
  const [fStatus,   setFStatus]   = useState([]);
  const [fUS,       setFUS]       = useState([]);
  const [fComputer, setFComputer] = useState("");
  const [fAccount,  setFAccount]  = useState("");
  const [fComment,  setFComment]  = useState("");
  const [fOrderId,  setFOrderId]  = useState("");
  const [fDateFrom, setFDateFrom] = useState("");
  const [fDateTo,   setFDateTo]   = useState("");

  // Temp states for pending filter values
  const [tmpProduct,  setTmpProduct]  = useState([]);
  const [tmpType,     setTmpType]     = useState([]);
  const [tmpStatus,   setTmpStatus]   = useState([]);
  const [tmpUS,       setTmpUS]       = useState([]);
  const [tmpComputer, setTmpComputer] = useState("");
  const [tmpAccount,  setTmpAccount]  = useState("");
  const [tmpComment,  setTmpComment]  = useState("");
  const [tmpOrderId,  setTmpOrderId]  = useState("");
  const [tmpDateFrom, setTmpDateFrom] = useState("");
  const [tmpDateTo,   setTmpDateTo]   = useState("");

  const US_BADGE = {
    active:  {bg:"#D4EDDA",color:"#155724",label:isFr?"U&S Valide":"Valid"},
    expiring:{bg:"#FEF3CD",color:"#856404",label:isFr?"Bientôt":"Expiring soon"},
    expired: {bg:"#FDE8E8",color:"#721C24",label:isFr?"Expiré":"Expired"},
    nodate:  {bg:"#FDE8E8",color:"#721C24",label:isFr?"Expiré":"Expired"},
    none:    {bg:"#FDE8E8",color:"#721C24",label:isFr?"Expiré":"Expired"},
  };

  const PROD_SHORT = {
    "TSplus Remote Access":"Remote Access","Remote Access":"Remote Access",
    "TSplus Advanced Security":"Advanced Security","Advanced Security":"Advanced Security",
    "TSplus Server Monitoring":"Server Monitoring","Server Monitoring":"Server Monitoring",
    "TSplus Virtual Printer":"Virtual Printer","Virtual Printer":"Virtual Printer",
    "Two-Factor Authentication":"2FA",
    "Remote Support":"Remote Support","Remote Work":"Remote Work",
    "Server Genius":"Server Genius",
  };

  useEffect(() => {
    if (!files?.length) { setRows([]); return; }
    const parseAll = async () => {
      const all = [];
      for (const file of files) {
        const text = await file.text();
        const lines = text.split("\n").filter(l => l.trim());
        if (lines.length < 2) continue;
        const sep = ";";
        const header = lines[0].split(sep).map(h => h.trim().replace(/^"|"$/g,"").replace(/^\ufeff/,"").toLowerCase());
        const idx = n => header.findIndex(h => h === n);
        const iStatus=idx("status"),iSoftware=idx("software"),iEdition=idx("edition"),
              iUsers=idx("users"),iComputer=idx("computer_name"),iAK=idx("activation_key"),
              iExpiry=idx("support_expiry_date"),iType=idx("type"),iOrder=idx("orderid"),
              iClient=idx("email"),iCompany=idx("customer_comments"),
              iWithSup=idx("with_support"),iCreated=idx("created_at"),
              iComments=idx("comments"),iHidden=idx("hidden");
        for (let i=1; i<lines.length; i++) {
          const c = lines[i].split(sep).map(v=>v.trim().replace(/^"|"$/g,""));
          if (!c[0]) continue;
          const sv = (c[iStatus]||"").toLowerCase();
          if (sv==="disabled"||sv==="disabling..."||sv==="hidden") continue;
          if (iHidden>=0 && c[iHidden]==="1") continue;
          const ws=iWithSup>=0?parseInt(c[iWithSup]):0;
          const expiry=iExpiry>=0?c[iExpiry]:"";
          const today=new Date(); today.setHours(0,0,0,0);
          let usStatus="none";
          if (ws===1 && expiry) {
            const diff=(new Date(expiry)-today)/86400000;
            usStatus=diff<0?"expired":diff<=expiryDays?"expiring":"active";
          } else if (ws===1) usStatus="nodate";
          const rawSw = iSoftware>=0?c[iSoftware]:"—";
          const swNorm = rawSw.replace("TSplus ","");
          all.push({
            client:   iClient  >=0?c[iClient]  :"—",
            company:  iCompany >=0?c[iCompany] :"—",
            software: swNorm,
            rawSw,
            edition:  iEdition >=0?c[iEdition] :"—",
            users:    iUsers   >=0?c[iUsers]   :"—",
            computer: iComputer>=0?c[iComputer]:"—",
            ak:       iAK      >=0?c[iAK]      :"—",
            expiry,
            type:     iType    >=0?c[iType]    :"Perpetual",
            orderid:  iOrder   >=0?c[iOrder]   :"—",
            created:  iCreated >=0?c[iCreated]?.slice(0,10):"—",
            comment:  iComments>=0?c[iComments]:"—",
            status:   iStatus  >=0?c[iStatus]  :"—",
            usStatus, _file:file.name,
          });
        }
      }
      setRows(all);
    };
    parseAll();
  }, [files, expiryDays]);

  // Unique values
  const uniqSw     = [...new Set(rows.map(r=>r.software?.includes("Advanced Security")?"Advanced Security":r.software).filter(Boolean))].sort();
  const uniqType   = [...new Set(rows.map(r=>r.type||"Perpetual"))].sort();
  const STATUS_OPTIONS = ["Enabled","Disabled","Refunded","Failed renewal","Auto-renew activated","Auto-renew deactivated","Expiring soon","Expired"];
  const US_OPTIONS = [{k:"active",label:"Valid"},{k:"expiring",label:"Expiring soon"},{k:"expired",label:"Expired"},{k:"none",label:"None"},{k:"nodate",label:"No date"}];

  const _urg = {expiring:0,expired:1,nodate:2,none:2,active:3};

  const filtered = [...rows].filter(r => {
    if (search) { const q=search.toLowerCase(); if(![r.client,r.software,r.computer,r.ak,r.edition,r.company,r.comment,r.orderid].some(v=>v?.toLowerCase().includes(q))) return false; }
    const swNorm = r.software?.includes("Advanced Security")?"Advanced Security":r.software;
    if (fProduct.length>0  && !fProduct.includes(swNorm)) return false;
    if (fType.length>0     && !fType.includes(r.type||"Perpetual")) return false;
    if (fStatus.length>0   && !fStatus.some(s => r.status?.toLowerCase().includes(s.toLowerCase()))) return false;
    if (fUS.length>0       && !fUS.includes(r.usStatus)) return false;
    if (fComputer && !r.computer?.toLowerCase().includes(fComputer.toLowerCase())) return false;
    if (fAccount  && ![r.client,r.company].some(v=>v?.toLowerCase().includes(fAccount.toLowerCase()))) return false;
    if (fComment  && !r.comment?.toLowerCase().includes(fComment.toLowerCase())) return false;
    if (fOrderId  && !r.orderid?.toLowerCase().includes(fOrderId.toLowerCase())) return false;
    if (fDateFrom && r.created < fDateFrom) return false;
    if (fDateTo   && r.created > fDateTo)   return false;
    return true;
  }).sort((a,b) => {
    if (files.length > 1 && a._file !== b._file) return (a._file||"").localeCompare(b._file||"");
    if (sort.col==="urgency"||sort.col==="expiry") {
      const ua=_urg[a.usStatus]??3, ub=_urg[b.usStatus]??3;
      if (ua!==ub) return sort.dir==="asc"?ua-ub:ub-ua;
      return sort.dir==="asc"?(a.expiry||"9999").localeCompare(b.expiry||"9999"):(b.expiry||"9999").localeCompare(a.expiry||"9999");
    }
    const va=a[sort.col]||"", vb=b[sort.col]||"";
    return sort.dir==="asc"?va.localeCompare(vb):vb.localeCompare(va);
  });

  const handleSort = col => { setSort(s=>({col,dir:s.col===col&&s.dir==="asc"?"desc":"asc"})); setPage(1); };
  const sortIcon = col => sort.col===col?(sort.dir==="asc"?" ▲":" ▼"):"";

  // Pagination
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page-1)*pageSize, page*pageSize);

  // Column resize
  const startResize = (e, colKey) => {
    e.preventDefault();
    const startX = e.clientX;
    const startW = colWidths[colKey] || 120;
    const onMove = ev => setColWidths(w => ({...w, [colKey]: Math.max(60, startW + ev.clientX - startX)}));
    const onUp = () => { document.removeEventListener("mousemove", onMove); document.removeEventListener("mouseup", onUp); };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  const exportCsv = () => {
    const cols=["client","company","software","edition","type","users","computer","ak","expiry","usStatus","created","orderid","comment","status"];
    const hdr=[isFr?"Email":"Email",isFr?"Compte":"Account","Produit","Édition","Type","Util.","Poste","Clé activation","Expiration U&S","Statut U&S","Création","Order ID","Commentaire","Statut brut"];
    const csv=[hdr.join(";"),...filtered.map(r=>cols.map(k=>`"${(r[k]||"").toString().replace(/"/g,'""')}"`).join(";"))].join("\n");
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));
    a.download=`licences_${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const openDropdown = (key, tmpSetter, curVal) => {
    if (openFilter === key) { setOpenFilter(null); return; }
    tmpSetter(curVal);
    setOpenFilter(key);
  };

  const activeFilters = [
    fProduct.length, fType.length, fStatus.length, fUS.length,
    fComputer?1:0, fAccount?1:0, fComment?1:0, fOrderId?1:0,
    (fDateFrom||fDateTo)?1:0
  ].reduce((a,b)=>a+b,0);

  const clearAll = () => {
    setFProduct([]); setFType([]); setFStatus([]); setFUS([]);
    setFComputer(""); setFAccount(""); setFComment(""); setFOrderId("");
    setFDateFrom(""); setFDateTo(""); setOpenFilter(null);
  };

  // KPI counts
  const kpiAll      = rows.length;
  const kpiNoUS     = rows.filter(r=>r.usStatus==="none"||r.usStatus==="nodate").length;
  const kpiExpired  = rows.filter(r=>r.usStatus==="expired").length;
  const kpiExpiring = rows.filter(r=>r.usStatus==="expiring").length;

  const COLS = [
    {key:"client",  label:isFr?"Compte / Email":"Account / Email", w:"16%"},
    {key:"software",label:isFr?"Produit":"Product", w:"15%"},
    {key:"type",    label:"Type", w:"7%"},
    {key:"computer",label:isFr?"Poste":"Computer", w:"11%"},
    {key:"ak",      label:isFr?"Clé d'activation":"Activation key", w:"14%"},
    {key:"urgency", label:"Updates & Support", w:"15%"},
    {key:"created", label:isFr?"Création":"Created on", w:"9%"},
    {key:"comment", label:"Comment", w:"10%"},
  ];

  // Filter dropdown component inline
  const Dropdown = ({id, label, children, isActive}) => (
    <div style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpenFilter(openFilter===id?null:id)} style={{
        display:"flex",alignItems:"center",gap:"5px",
        padding:"4px 10px",borderRadius:"99px",
        border:`1px solid ${isActive?"#1A3C5E":openFilter===id?"#1A3C5E":"var(--border)"}`,
        background:isActive?"#1A3C5E":openFilter===id?"rgba(26,60,94,.07)":"var(--surface)",
        color:isActive?"#fff":openFilter===id?"#1A3C5E":"var(--text)",
        fontSize:".75rem",cursor:"pointer",fontWeight:isActive?600:400,
        transition:"all .12s"
      }}>
        <span style={{fontSize:".8rem"}}>{isActive?"✕":"⊕"}</span>
        {label}
{isActive > 0 && <span style={{background:"rgba(255,255,255,.25)",borderRadius:"99px",padding:"0 5px",fontSize:".68rem"}}>{isActive}</span>}
      </button>
      {openFilter===id && (
        <div style={{
          position:"absolute",top:"calc(100% + 4px)",left:0,zIndex:100,
          background:"var(--surface)",border:"1px solid var(--border)",
          borderRadius:"10px",boxShadow:"0 8px 24px rgba(0,0,0,.15)",
          minWidth:"200px",overflow:"hidden"
        }}>
          {children}
        </div>
      )}
    </div>
  );

  const CheckList = ({values, selected, setSelected, applyFn}) => (
    <div>
      <div style={{maxHeight:"220px",overflowY:"auto"}}>
        {values.map(v=>(
          <label key={v} style={{display:"flex",alignItems:"center",gap:"10px",padding:"8px 14px",cursor:"pointer",fontSize:".82rem",color:"var(--text)"}}
            onMouseEnter={e=>e.currentTarget.style.background="var(--bg2,#f8fafe)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <input type="checkbox" checked={selected.includes(v)} onChange={()=>setSelected(p=>p.includes(v)?p.filter(x=>x!==v):[...p,v])}
              style={{width:"15px",height:"15px",accentColor:"#e67e22",cursor:"pointer"}}/>
            {v}
          </label>
        ))}
      </div>
      <div style={{padding:"8px 10px",borderTop:"1px solid var(--border)"}}>
        <button onClick={applyFn} style={{width:"100%",padding:"7px",borderRadius:"7px",border:"none",background:"linear-gradient(135deg,#e67e22,#d35400)",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:".82rem"}}>
          {isFr?"Appliquer":"Apply"}
        </button>
      </div>
    </div>
  );

  const TextSearch = ({placeholder, value, setValue, applyFn}) => (
    <div style={{padding:"10px"}}>
      <input autoFocus type="text" value={value} onChange={e=>setValue(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&applyFn()}
        placeholder={placeholder}
        style={{width:"100%",padding:"6px 10px",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:".82rem",outline:"none",marginBottom:"8px"}}/>
      <button onClick={applyFn} style={{width:"100%",padding:"7px",borderRadius:"7px",border:"none",background:"linear-gradient(135deg,#e67e22,#d35400)",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:".82rem"}}>
        {isFr?"Appliquer":"Apply"}
      </button>
    </div>
  );

  return (
    <div style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"10px",overflow:"hidden",marginBottom:"1rem"}}
      onClick={e=>{if(!e.target.closest("[data-filter]"))setOpenFilter(null)}}>

      {/* KPI Counts — style portail */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",borderBottom:"1px solid var(--border)"}}>
        {[
          {label:isFr?"Toutes":"All", val:kpiAll, active:true},
          {label:isFr?"Sans U&S":"No updates & support", val:kpiNoUS},
          {label:isFr?"U&S expiré":"Updates & Support expired", val:kpiExpired},
          {label:isFr?"U&S bientôt":"Updates & Support expiring soon", val:kpiExpiring},
        ].map((k,i)=>(
          <div key={i} style={{
            padding:"12px 16px",
            borderRight:i<3?"1px solid var(--border)":"none",
            borderLeft:i===0?"3px solid var(--accent)":"none",
          }}>
            <div style={{fontSize:".72rem",color:"var(--muted)",marginBottom:"2px"}}>{k.label}</div>
            <div style={{fontSize:"1.4rem",fontWeight:700,color:i===0?"var(--accent)":"var(--text)"}}>{k.val.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Filter pills bar */}
      <div data-filter style={{display:"flex",gap:"6px",flexWrap:"wrap",padding:"10px 12px",borderBottom:"1px solid var(--border)",alignItems:"center",background:"var(--bg2,#f8fafe)"}}>
        <input type="text" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder={isFr?"Recherche rapide…":"Quick search…"}
          style={{padding:"4px 10px",borderRadius:"99px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",fontSize:".75rem",outline:"none",minWidth:"140px"}}/>

        <Dropdown id="product" label={isFr?"Produit":"Product"} isActive={fProduct.length||0}>
          <div data-filter>
            <CheckList values={uniqSw} selected={tmpProduct} setSelected={setTmpProduct}
              applyFn={()=>{setFProduct(tmpProduct);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="type" label="Type" isActive={fType.length||0}>
          <div data-filter>
            <CheckList values={uniqType} selected={tmpType} setSelected={setTmpType}
              applyFn={()=>{setFType(tmpType);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="status" label={isFr?"Statut":"Status"} isActive={fStatus.length||0}>
          <div data-filter>
            <CheckList values={STATUS_OPTIONS} selected={tmpStatus} setSelected={setTmpStatus}
              applyFn={()=>{setFStatus(tmpStatus);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="us" label="Updates & Support" isActive={fUS.length||0}>
          <div data-filter>
            <CheckList values={US_OPTIONS.map(o=>o.label)} selected={tmpUS.map(k=>US_OPTIONS.find(o=>o.k===k)?.label||k)}
              setSelected={labels=>setTmpUS(labels.map(l=>US_OPTIONS.find(o=>o.label===l)?.k||l))}
              applyFn={()=>{setFUS(tmpUS);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="computer" label={isFr?"Poste":"Computer"} isActive={fComputer?1:0}>
          <div data-filter>
            <TextSearch placeholder={isFr?"Rechercher un poste…":"Search Computer…"}
              value={tmpComputer} setValue={setTmpComputer}
              applyFn={()=>{setFComputer(tmpComputer);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="account" label={isFr?"Compte":"Account"} isActive={fAccount?1:0}>
          <div data-filter>
            <TextSearch placeholder={isFr?"Rechercher un compte…":"Search Account…"}
              value={tmpAccount} setValue={setTmpAccount}
              applyFn={()=>{setFAccount(tmpAccount);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="comment" label={isFr?"Commentaire":"Comment"} isActive={fComment?1:0}>
          <div data-filter>
            <TextSearch placeholder={isFr?"Rechercher dans les commentaires…":"Search Comment…"}
              value={tmpComment} setValue={setTmpComment}
              applyFn={()=>{setFComment(tmpComment);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="orderid" label={isFr?"N° commande":"Order ID"} isActive={fOrderId?1:0}>
          <div data-filter>
            <TextSearch placeholder="Search Order ID…"
              value={tmpOrderId} setValue={setTmpOrderId}
              applyFn={()=>{setFOrderId(tmpOrderId);setOpenFilter(null);}}/>
          </div>
        </Dropdown>

        <Dropdown id="date" label={isFr?"Date commande":"Order date"} isActive={(fDateFrom||fDateTo)?1:0}>
          <div data-filter style={{padding:"12px"}}>
            <div style={{marginBottom:"8px"}}>
              <div style={{fontSize:".72rem",color:"var(--muted)",marginBottom:"3px"}}>From</div>
              <input type="date" value={tmpDateFrom} onChange={e=>setTmpDateFrom(e.target.value)}
                style={{width:"100%",padding:"5px 8px",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:".8rem"}}/>
            </div>
            <div style={{marginBottom:"10px"}}>
              <div style={{fontSize:".72rem",color:"var(--muted)",marginBottom:"3px"}}>To</div>
              <input type="date" value={tmpDateTo} onChange={e=>setTmpDateTo(e.target.value)}
                style={{width:"100%",padding:"5px 8px",borderRadius:"7px",border:"1px solid var(--border)",background:"var(--bg)",color:"var(--text)",fontSize:".8rem"}}/>
            </div>
            <button onClick={()=>{setFDateFrom(tmpDateFrom);setFDateTo(tmpDateTo);setOpenFilter(null);}}
              style={{width:"100%",padding:"7px",borderRadius:"7px",border:"none",background:"linear-gradient(135deg,#e67e22,#d35400)",color:"#fff",cursor:"pointer",fontWeight:600,fontSize:".82rem"}}>
              {isFr?"Appliquer":"Apply"}
            </button>
          </div>
        </Dropdown>

        <div style={{marginLeft:"auto",display:"flex",gap:"6px",alignItems:"center"}}>
          {activeFilters > 0 && (
            <button onClick={clearAll} style={{padding:"4px 10px",borderRadius:"99px",border:"1px solid var(--border)",background:"transparent",color:"var(--muted)",cursor:"pointer",fontSize:".72rem"}}>
              ✕ {isFr?"Effacer les filtres":"Clear filters"}
            </button>
          )}
          <button onClick={exportCsv} style={{padding:"4px 10px",borderRadius:"99px",border:"1px solid var(--border)",background:"var(--surface)",color:"var(--text)",cursor:"pointer",fontSize:".75rem",display:"flex",alignItems:"center",gap:"4px"}}>
            ⬇ Export CSV
          </button>
          <span style={{fontSize:".72rem",color:"var(--muted)",whiteSpace:"nowrap"}}>{filtered.length.toLocaleString()} / {rows.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Table */}
      <div style={{overflowX:"auto",maxHeight:"calc(100vh - 280px)",overflowY:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:".75rem",tableLayout:"fixed"}}>
          <thead>
            <tr style={{background:"var(--bg2,#f8fafe)",position:"sticky",top:0,zIndex:2,borderBottom:"2px solid var(--border)"}}>
              <th style={{width:"30px",padding:"8px 10px"}}><input type="checkbox" style={{accentColor:"#e67e22"}}/></th>
              {COLS.map(col=>(
                <th key={col.key} style={{
                  padding:"8px 10px",textAlign:"left",fontWeight:600,
                  color:"var(--text)",whiteSpace:"nowrap",
                  width:colWidths[col.key]||col.w,userSelect:"none",fontSize:".72rem",
                  borderRight:"1px solid var(--border)",position:"relative"
                }}>
                  <span onClick={()=>handleSort(col.key)} style={{cursor:"pointer"}}>
                    {col.label}{sortIcon(col.key)}
                  </span>
                  <span
                    onMouseDown={e=>startResize(e,col.key)}
                    style={{
                      position:"absolute",right:0,top:0,bottom:0,width:"5px",
                      cursor:"col-resize",background:"transparent",zIndex:1
                    }}/>
                </th>
              ))}
              <th style={{width:"30px"}}/>
            </tr>
          </thead>
          <tbody>
            {paginated.map((r,i)=>{
              const badge=US_BADGE[r.usStatus]||US_BADGE.none;
              const globalI = (page-1)*pageSize + i;
              const isFirstOfFile = files.length > 1 && (globalI === 0 || filtered[globalI-1]._file !== r._file);
              const cleanClient=(!r.client||r.client.startsWith("(")||r.client==="—")?"—":r.client;
              const isAS = r.software?.includes("Advanced Security");
              const swLabel = isAS ? "Advanced Security" : (r.software||"—");
              const edLabel = isAS
                ? (r.edition?.includes("Essentials")?" Essentials":r.edition?.includes("Ultimate")?" Ultimate":"")
                : r.edition;
              return (
                <Fragment key={i}>
                  {isFirstOfFile && (
                    <tr>
                      <td colSpan={COLS.length+2} style={{
                        padding:"5px 12px",background:"#1A3C5E",
                        color:"rgba(255,255,255,.9)",fontSize:".72rem",fontWeight:700
                      }}>
                        📄 {(r._file||"").replace(".csv","")}
                      </td>
                    </tr>
                  )}
                  <tr style={{
                    borderBottom:"1px solid var(--border)",
                    background:i%2===0?"transparent":"var(--bg2,#f8fafe)"
                  }}
                    onMouseEnter={e=>e.currentTarget.style.background="rgba(26,60,94,.04)"}
                    onMouseLeave={e=>e.currentTarget.style.background=i%2===0?"transparent":"var(--bg2,#f8fafe)"}
                  >
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)"}}><input type="checkbox" style={{accentColor:"#e67e22"}}/></td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      <div style={{fontWeight:500,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{cleanClient}</div>
                      {r.company && r.company!=="—" && <div style={{fontSize:".68rem",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.company}</div>}
                    </td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",overflow:"hidden"}}>
                      <div style={{fontWeight:700,color:"var(--text)",whiteSpace:"nowrap"}}>{swLabel}<span style={{color:"var(--muted)",fontWeight:400,fontSize:".68rem"}}>{edLabel ? " "+edLabel : ""}</span></div>
                      {r.users && r.users!=="—" && <div style={{fontSize:".68rem",color:"var(--muted)"}}>{r.users} {isFr?"util.":"users"}</div>}
                    </td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)"}}>
                      <span style={{fontSize:".7rem",padding:"2px 8px",borderRadius:"4px",background:"rgba(29,158,117,.1)",color:"#1D9E75",border:"1px solid rgba(29,158,117,.3)",fontWeight:500}}>{r.type||"Perpetual"}</span>
                    </td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.computer==="—"?"—":r.computer}</td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)"}}>
                      {r.ak && r.ak!=="—" && <>
                        <div style={{fontWeight:600,fontSize:".75rem",color:"var(--text)"}}>{r.orderid!=="—"?r.orderid:"—"}</div>
                        <div style={{fontFamily:"monospace",fontSize:".68rem",color:"var(--muted)"}}>{r.ak}</div>
                      </>}
                    </td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",whiteSpace:"nowrap"}}>
                      <span style={{fontSize:".72rem",padding:"2px 8px",borderRadius:"4px",background:badge.bg,color:badge.color,fontWeight:600,display:"inline-block"}}>
                        {badge.label}{(r.usStatus==="active"||r.usStatus==="expiring")&&r.expiry?` · ${r.expiry}`:""}
                      </span>
                    </td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",color:"var(--muted)",whiteSpace:"nowrap",fontSize:".72rem"}}>{r.created}</td>
                    <td style={{padding:"6px 10px",borderRight:"1px solid var(--border)",color:"var(--muted)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"100px"}}>{r.comment!=="—"?r.comment:""}</td>
                    <td style={{padding:"6px 8px",textAlign:"center"}}>
                      <span style={{cursor:"pointer",color:"var(--muted)",fontSize:".9rem"}}>···</span>
                    </td>
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
        {filtered.length===0 && (
          <div style={{padding:"2.5rem",textAlign:"center",color:"var(--muted)",fontSize:".82rem"}}>
            {isFr?"Aucune licence ne correspond aux filtres appliqués":"No licences match the applied filters"}
          </div>
        )}
      </div>

      {/* Footer + Pagination */}
      <div style={{padding:"8px 14px",borderTop:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span style={{fontSize:".72rem",color:"var(--muted)"}}>
            {isFr?`${filtered.length.toLocaleString()} licences`:`${filtered.length.toLocaleString()} licences`}
          </span>
          {activeFilters > 0 && <span style={{fontSize:".7rem",color:"var(--accent)"}}>{activeFilters} {isFr?"filtre(s)":"filter(s)"}</span>}
          <select value={pageSize} onChange={e=>{setPageSize(parseInt(e.target.value));setPage(1);}} style={{
            padding:"2px 6px",borderRadius:"5px",border:"1px solid var(--border)",
            background:"var(--surface)",color:"var(--text)",fontSize:".72rem",cursor:"pointer"
          }}>
            {[25,50,100,200].map(n=><option key={n} value={n}>{n} / {isFr?"page":"page"}</option>)}
          </select>
        </div>
        {totalPages > 1 && (
          <div style={{display:"flex",alignItems:"center",gap:"4px"}}>
            <button onClick={()=>setPage(1)} disabled={page===1} style={{padding:"2px 7px",borderRadius:"5px",border:"1px solid var(--border)",background:page===1?"var(--border)":"var(--surface)",color:page===1?"var(--muted)":"var(--text)",cursor:page===1?"default":"pointer",fontSize:".72rem"}}>«</button>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{padding:"2px 7px",borderRadius:"5px",border:"1px solid var(--border)",background:page===1?"var(--border)":"var(--surface)",color:page===1?"var(--muted)":"var(--text)",cursor:page===1?"default":"pointer",fontSize:".72rem"}}>‹</button>
            {Array.from({length:Math.min(5,totalPages)},(_,i)=>{
              let p;
              if (totalPages<=5) p=i+1;
              else if (page<=3) p=i+1;
              else if (page>=totalPages-2) p=totalPages-4+i;
              else p=page-2+i;
              return (
                <button key={p} onClick={()=>setPage(p)} style={{
                  padding:"2px 8px",borderRadius:"5px",border:"1px solid var(--border)",
                  background:p===page?"#1A3C5E":"var(--surface)",
                  color:p===page?"#fff":"var(--text)",cursor:"pointer",fontSize:".72rem",fontWeight:p===page?700:400
                }}>{p}</button>
              );
            })}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{padding:"2px 7px",borderRadius:"5px",border:"1px solid var(--border)",background:page===totalPages?"var(--border)":"var(--surface)",color:page===totalPages?"var(--muted)":"var(--text)",cursor:page===totalPages?"default":"pointer",fontSize:".72rem"}}>›</button>
            <button onClick={()=>setPage(totalPages)} disabled={page===totalPages} style={{padding:"2px 7px",borderRadius:"5px",border:"1px solid var(--border)",background:page===totalPages?"var(--border)":"var(--surface)",color:page===totalPages?"var(--muted)":"var(--text)",cursor:page===totalPages?"default":"pointer",fontSize:".72rem"}}>»</button>
            <span style={{fontSize:".7rem",color:"var(--muted)",marginLeft:"4px"}}>{page} / {totalPages}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function OverviewDashboard({ analyses, lang, expiryDays }) {
  const isFr = lang === "fr";
  const total    = analyses.reduce((s,a) => s+(a.data?.total||0), 0);
  const active   = analyses.reduce((s,a) => s+(a.data?.active||0), 0);
  const expiring = analyses.reduce((s,a) => s+(a.data?.expiring_soon||0), 0);
  const expired  = analyses.reduce((s,a) => s+(a.data?.expired_us||0), 0);

  const prodMap = {};
  analyses.forEach(a => {
    if (!a.data?.products) return;
    Object.entries(a.data.products).forEach(([k,v]) => { prodMap[k] = (prodMap[k]||0)+v; });
  });
  const products = Object.entries(prodMap).sort((a,b)=>b[1]-a[1]);
  const COLORS = ["#1A3C5E","#1D9E75","#e67e22","#2980b9","#8e44ad"];

  return (
    <div style={{marginBottom:"1rem", maxWidth:"700px", margin:"0 auto 1rem"}}>
      <div style={{
        border:"1px solid var(--border)", borderRadius:"12px", padding:"1.5rem",
        textAlign:"center", marginBottom:"12px", background:"var(--surface)"
      }}>
        <div style={{fontSize:"2.8rem",fontWeight:700,color:"var(--text)",lineHeight:1}}>{total}</div>
        <div style={{fontSize:".82rem",color:"var(--muted)",marginTop:"4px"}}>{isFr?"licences totales":"total licences"}</div>
        <div style={{display:"flex",height:"6px",borderRadius:"3px",overflow:"hidden",margin:"12px 0 4px",gap:"2px"}}>
          {active   > 0 && <div style={{flex:active,  background:"#1D9E75"}}/>}
          {expiring > 0 && <div style={{flex:expiring, background:"#e67e22"}}/>}
          {expired  > 0 && <div style={{flex:expired,  background:"#c0392b"}}/>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"10px",marginBottom:"12px"}}>
        {[
          {val:active,   label:isFr?"U&S actif":"U&S Active",   color:"#1D9E75", border:"#1D9E75"},
          {val:expiring, label:isFr?`< ${expiryDays}j`:`< ${expiryDays}d`, color:"#e67e22", border:"#e67e22"},
          {val:expired,  label:isFr?"U&S expiré":"U&S expired", color:"#c0392b", border:"#c0392b"},
        ].map((kpi,i) => (
          <div key={i} style={{
            border:"1px solid var(--border)", borderLeft:`3px solid ${kpi.border}`,
            borderRadius:"8px", padding:"1rem", background:"var(--surface)", textAlign:"center"
          }}>
            <div style={{fontSize:"1.8rem",fontWeight:700,color:kpi.color,lineHeight:1}}>{kpi.val}</div>
            <div style={{fontSize:".75rem",color:"var(--muted)",marginTop:"4px"}}>{kpi.label}</div>
          </div>
        ))}
      </div>
      {products.length > 0 && (
        <div style={{border:"1px solid var(--border)",borderRadius:"12px",padding:"1.2rem",background:"var(--surface)"}}>
          <div style={{fontSize:".8rem",fontWeight:700,color:"var(--accent)",marginBottom:"12px"}}>
            {isFr?"Répartition par produit":"Product breakdown"}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"2rem",flexWrap:"wrap"}}>
            <svg viewBox="0 0 80 80" width="80" height="80" style={{flexShrink:0}}>
              {(() => {
                let offset = 0;
                const circ = 2 * Math.PI * 30;
                return products.map(([name, count], i) => {
                  const p = count / total;
                  const dash = p * circ;
                  const el = (
                    <circle key={i} cx="40" cy="40" r="30" fill="none"
                      stroke={COLORS[i % COLORS.length]} strokeWidth="12"
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={-offset * circ}
                      transform="rotate(-90 40 40)"
                    />
                  );
                  offset += p;
                  return el;
                });
              })()}
              <circle cx="40" cy="40" r="18" fill="var(--bg)" />
            </svg>
            <div style={{flex:1,display:"flex",flexDirection:"column",gap:"8px"}}>
              {products.map(([name, count], i) => (
                <div key={i} style={{display:"flex",alignItems:"center",gap:"8px"}}>
                  <div style={{width:"10px",height:"10px",borderRadius:"50%",background:COLORS[i%COLORS.length],flexShrink:0}}/>
                  <span style={{flex:1,fontSize:".8rem",color:"var(--text)"}}>{name.replace("TSplus ","")}</span>
                  <span style={{fontWeight:700,fontSize:".82rem",color:COLORS[i%COLORS.length]}}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
