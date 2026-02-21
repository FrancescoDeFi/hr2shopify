(() => {
  var lang = (window.__LOCALE__ || "de").toLowerCase();

  var INGREDIENTS_DE = [
    {
      id: "anagain",
      name: "Anagain",
      subtitle: "Erbsensprossen\u2011Extrakt",
      category: "Naturstoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Haarwurzel-Aktivierung",
      description: "Ein pflanzlicher Erbsensprossen\u2011Extrakt, der die Haarwurzel in ihrer Aktivit\u00e4t unterst\u00fctzt. Gerade bei diffusem Ausfall wird er h\u00e4ufig eingesetzt, um den Haarzyklus zu begleiten und die Basis f\u00fcr kr\u00e4ftigeres Wachstum zu unterst\u00fctzen."
    },
    {
      id: "sawpalmetto",
      name: "S\u00e4gepalmenextrakt",
      subtitle: "Serenoa repens",
      category: "Naturstoffe",
      amount: "50 mg",
      nrv: null,
      benefit: "Unterst\u00fctzt Haarf\u00fclle",
      contains: [{ name: "Fetts\u00e4uren", amount: "12,5 mg", nrv: null }],
      description: "S\u00e4gepalmenextrakt wird traditionell im Kontext von vollerem Haar eingesetzt. Er kann Prozesse unterst\u00fctzen, die mit der Erhaltung von Haarf\u00fclle in Verbindung stehen, und erg\u00e4nzt so eine ganzheitliche Routine f\u00fcr Kopfhaut und Haarwurzel."
    },
    {
      id: "pomegranate",
      name: "Granatapfelextrakt",
      subtitle: "Punica granatum",
      category: "Naturstoffe",
      amount: "10 mg",
      nrv: null,
      benefit: "Antioxidativer Schutz",
      contains: [{ name: "Ellags\u00e4ure", amount: "4 mg", nrv: null }],
      description: "Granatapfel ist reich an Polyphenolen. Antioxidative Pflanzenstoffe unterst\u00fctzen den Schutz der Zellen vor oxidativem Stress \u2013 ein Faktor, der auch f\u00fcr Kopfhaut und Haarwurzel relevant sein kann."
    },
    {
      id: "ashwagandha_extract",
      name: "Ashwagandhaextrakt",
      subtitle: "KSM-66\u00ae",
      category: "Sonstige Stoffe",
      amount: "300 mg",
      nrv: null,
      benefit: "Stressbalance",
      contains: [{ name: "Withanolide", amount: "15 mg", nrv: null }],
      description: "Ashwagandha gilt als Adaptogen und wird h\u00e4ufig genutzt, um Stressbalance zu unterst\u00fctzen. Da Stress den Haarzyklus beeinflussen kann, kann eine bessere Stressregulation indirekt zu stabileren Haarzyklen beitragen."
    },
    {
      id: "vitamin_c",
      name: "Vitamin C",
      subtitle: null,
      category: "Vitamine",
      amount: "40 mg",
      nrv: "50 %",
      benefit: "Kollagenbildung",
      description: "Vitamin C tr\u00e4gt zu einer normalen Kollagenbildung f\u00fcr eine normale Funktion der Haut bei und sch\u00fctzt Zellen vor oxidativem Stress. Beides ist wichtig, um die Kopfhaut als Umfeld f\u00fcr gesundes Haar zu unterst\u00fctzen."
    },
    {
      id: "vitamin_e",
      name: "Vitamin E (nat\u00fcrlich)",
      subtitle: null,
      category: "Vitamine",
      amount: "18 mg",
      nrv: "150 %",
      benefit: "Zellschutz",
      description: "Vitamin E tr\u00e4gt dazu bei, die Zellen vor oxidativem Stress zu sch\u00fctzen. Das kann helfen, Kopfhaut und Haarwurzel vor belastenden Umwelteinfl\u00fcssen zu unterst\u00fctzen."
    },
    {
      id: "riboflavin",
      name: "Riboflavin",
      subtitle: "Vitamin B2",
      category: "Vitamine",
      amount: "1,4 mg",
      nrv: "100 %",
      benefit: "Gesunde Kopfhaut",
      description: "Riboflavin (Vitamin B2) tr\u00e4gt zur Erhaltung normaler Haut und zum Schutz der Zellen vor oxidativem Stress bei. Eine gesunde Kopfhaut ist die Grundlage f\u00fcr kr\u00e4ftiges Haar."
    },
    {
      id: "niacin",
      name: "Niacin",
      subtitle: "Vitamin B3",
      category: "Vitamine",
      amount: "20 mg",
      nrv: "125 %",
      benefit: "Hautbarriere",
      description: "Niacin (Vitamin B3) tr\u00e4gt zur Erhaltung normaler Haut bei. Da Haare aus der Kopfhaut heraus wachsen, kann eine gut versorgte Hautbarriere das Haarumfeld unterst\u00fctzen."
    },
    {
      id: "pantothenic_acid",
      name: "Pantothens\u00e4ure",
      subtitle: "Vitamin B5",
      category: "Vitamine",
      amount: "18 mg",
      nrv: "300 %",
      benefit: "Energiestoffwechsel",
      description: "Pantothens\u00e4ure (Vitamin B5) tr\u00e4gt zu einem normalen Energiestoffwechsel bei. Energie- und N\u00e4hrstoffprozesse sind grundlegend, damit der K\u00f6rper auch \u201enicht lebensnotwendige\u201c Strukturen wie Haare zuverl\u00e4ssig versorgen kann."
    },
    {
      id: "vitamin_b6",
      name: "Vitamin B6",
      subtitle: null,
      category: "Vitamine",
      amount: "7 mg",
      nrv: "500 %",
      benefit: "Protein-Stoffwechsel",
      description: "Vitamin B6 tr\u00e4gt zu einem normalen Eiwei\u00df- und Energiestoffwechsel bei. Da Haare haupts\u00e4chlich aus Protein (Keratin) bestehen, ist ein funktionierender Protein-Stoffwechsel ein wichtiger Baustein f\u00fcr Haarstruktur und Wachstum."
    },
    {
      id: "folic_acid",
      name: "Fols\u00e4ure",
      subtitle: null,
      category: "Vitamine",
      amount: "200 \u00b5g",
      nrv: "100 %",
      benefit: "Zellteilung",
      description: "Fols\u00e4ure tr\u00e4gt zu einer normalen Zellteilung bei. Schnell teilende Zellen spielen auch im Haarfollikel eine Rolle \u2013 eine gute Folatversorgung unterst\u00fctzt daher die physiologischen Wachstumsprozesse."
    },
    {
      id: "vitamin_a",
      name: "Vitamin A",
      subtitle: null,
      category: "Vitamine",
      amount: "800 \u00b5g",
      nrv: "100 %",
      benefit: "Normale Haut",
      description: "Vitamin A tr\u00e4gt zur Erhaltung normaler Haut bei. Eine gesunde Kopfhaut unterst\u00fctzt das Umfeld, in dem Haare wachsen."
    },
    {
      id: "beta_carotene",
      name: "Beta Carotin",
      subtitle: null,
      category: "Vitamine",
      amount: "0,8 mg",
      nrv: null,
      benefit: "Vitamin-A-Vorstufe",
      description: "Beta-Carotin ist eine Vorstufe von Vitamin A. Es erg\u00e4nzt die Versorgung mit Vitamin-A-relevanten Bausteinen, die f\u00fcr Hautgesundheit (und damit auch f\u00fcr die Kopfhaut) wichtig ist."
    },
    {
      id: "vitamin_d",
      name: "Vitamin D",
      subtitle: null,
      category: "Vitamine",
      amount: "10 \u00b5g",
      nrv: "200 %",
      benefit: "Immunsystem",
      description: "Vitamin D tr\u00e4gt zu einer normalen Funktion des Immunsystems und zu einer normalen Zellteilung bei. Beides kann f\u00fcr ein ausgeglichenes Kopfhautmilieu relevant sein, das gesundes Haar unterst\u00fctzt."
    },
    {
      id: "lcysteine",
      name: "L\u2011Cysteine",
      subtitle: "Aminos\u00e4ure",
      category: "Aminos\u00e4uren",
      amount: "50 mg",
      nrv: null,
      benefit: "Keratin-Baustein",
      description: "L\u2011Cystein ist ein wichtiger Baustein von Keratin, dem Strukturprotein der Haare. Eine ausreichende Versorgung kann die nat\u00fcrliche Haarstruktur unterst\u00fctzen \u2013 besonders bei br\u00fcchigem oder strapaziertem Haar."
    },
    {
      id: "llysine_hcl",
      name: "L\u2011Lysin HCL",
      subtitle: null,
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Strukturprotein",
      contains: [{ name: "L Lysin", amount: "79 mg", nrv: null }],
      description: "L\u2011Lysin ist eine essentielle Aminos\u00e4ure und beteiligt am Aufbau von Strukturproteinen. In der Haarroutine wird es h\u00e4ufig genutzt, um die Versorgung mit Proteinbausteinen zu erg\u00e4nzen, die f\u00fcr Haarstruktur wichtig sind."
    },
    {
      id: "zinc",
      name: "Zink",
      subtitle: "Mineralstoff",
      category: "Mineralstoffe",
      amount: "10 mg",
      nrv: "100 %",
      benefit: "Erhaltung normaler Haare",
      description: "Zink tr\u00e4gt zur Erhaltung normaler Haare und Haut bei. Es unterst\u00fctzt zudem den Schutz der Zellen vor oxidativem Stress \u2013 beides wichtige Faktoren f\u00fcr Haarwurzel und Kopfhaut."
    },
    {
      id: "boron",
      name: "Bor",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: null,
      benefit: "Mineralstoffhaushalt",
      description: "Bor wird oft als erg\u00e4nzender Spurenn\u00e4hrstoff in Formulierungen eingesetzt. Es kann helfen, den Mineralstoffhaushalt ganzheitlich abzurunden \u2013 indirekt relevant, weil Haare stark von einer insgesamt guten N\u00e4hrstoffversorgung profitieren."
    },
    {
      id: "manganese",
      name: "Mangan",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "50 %",
      benefit: "Bindegewebsbildung",
      description: "Mangan tr\u00e4gt zum Schutz der Zellen vor oxidativem Stress und zu einer normalen Bindegewebsbildung bei. Das kann die Haut-/Kopfhautstruktur unterst\u00fctzen, die f\u00fcr gesunde Haarbedingungen wichtig ist."
    },
    {
      id: "copper",
      name: "Kupfer",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "100 %",
      benefit: "Haarpigmentierung",
      description: "Kupfer tr\u00e4gt zu einer normalen Haarpigmentierung bei und unterst\u00fctzt den Schutz der Zellen vor oxidativem Stress. Damit kann es sowohl optische Aspekte (Farbe) als auch die allgemeine Haarumgebung unterst\u00fctzen."
    },
    {
      id: "iodine",
      name: "Jod",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "225 \u00b5g",
      nrv: "150 %",
      benefit: "Schilddr\u00fcsenfunktion",
      description: "Jod tr\u00e4gt zu einer normalen Schilddr\u00fcsenfunktion und Hormonproduktion bei. Da Hormone den Haarzyklus beeinflussen k\u00f6nnen, kann eine gute Jodversorgung indirekt zu stabileren Haarbedingungen beitragen."
    },
    {
      id: "selenium",
      name: "Selen",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "44 \u00b5g",
      nrv: "80 %",
      benefit: "Erhaltung normaler Haare",
      description: "Selen tr\u00e4gt zur Erhaltung normaler Haare bei und unterst\u00fctzt den Schutz der Zellen vor oxidativem Stress. Das macht es zu einem zentralen Spurenelement f\u00fcr Haar- und Kopfhautgesundheit."
    },
    {
      id: "biotin",
      name: "Biotin",
      subtitle: "Vitamin B7",
      category: "Vitamine",
      amount: "150 \u00b5g",
      nrv: "300 %",
      benefit: "Erhaltung normaler Haare",
      description: "Biotin tr\u00e4gt zur Erhaltung normaler Haare und Haut bei. Es wird h\u00e4ufig als Basis-N\u00e4hrstoff eingesetzt, wenn es um Haarqualit\u00e4t, Widerstandskraft und die Unterst\u00fctzung des Wachstumsumfelds geht."
    },
    {
      id: "sprouted_pea_seed",
      name: "gekeimtes Erbsensamenextrakt Pulver",
      subtitle: "AnaGain\u2122 Nu",
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Unterst\u00fctzt Haarzyklus",
      description: "Gekeimtes Erbsensamenextrakt ist eine pflanzliche Quelle funktioneller Inhaltsstoffe, die in der Haarroutine h\u00e4ufig zur Unterst\u00fctzung der Haarwurzel eingesetzt wird. Er erg\u00e4nzt die Formel mit pflanzlichen Bausteinen, die den Haarzyklus begleiten k\u00f6nnen."
    }
  ];

  var INGREDIENTS_EN = [
    {
      id: "anagain",
      name: "AnaGain",
      subtitle: "Pea sprout extract",
      category: "Naturstoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Hair root activation",
      description: "A plant-based pea sprout extract that supports hair root activity. It is often used for diffuse hair loss to support the hair cycle and build a foundation for stronger growth."
    },
    {
      id: "sawpalmetto",
      name: "Saw palmetto extract",
      subtitle: "Serenoa repens",
      category: "Naturstoffe",
      amount: "50 mg",
      nrv: null,
      benefit: "Supports hair fullness",
      contains: [{ name: "Fatty acids", amount: "12.5 mg", nrv: null }],
      description: "Saw palmetto extract has traditionally been used in the context of fuller hair. It can support processes associated with maintaining hair fullness and complements a holistic routine for scalp and hair root."
    },
    {
      id: "pomegranate",
      name: "Pomegranate extract",
      subtitle: "Punica granatum",
      category: "Naturstoffe",
      amount: "10 mg",
      nrv: null,
      benefit: "Antioxidant protection",
      contains: [{ name: "Ellagic acid", amount: "4 mg", nrv: null }],
      description: "Pomegranate is rich in polyphenols. Antioxidant plant compounds support the protection of cells from oxidative stress \u2013 a factor that can also be relevant for scalp and hair root."
    },
    {
      id: "ashwagandha_extract",
      name: "Ashwagandha extract",
      subtitle: "KSM-66\u00ae",
      category: "Sonstige Stoffe",
      amount: "300 mg",
      nrv: null,
      benefit: "Stress balance",
      contains: [{ name: "Withanolides", amount: "15 mg", nrv: null }],
      description: "Ashwagandha is considered an adaptogen and is frequently used to support stress balance. Since stress can affect the hair cycle, better stress regulation can indirectly contribute to more stable hair cycles."
    },
    {
      id: "vitamin_c",
      name: "Vitamin C",
      subtitle: null,
      category: "Vitamine",
      amount: "40 mg",
      nrv: "50 %",
      benefit: "Collagen formation",
      description: "Vitamin C contributes to normal collagen formation for the normal function of the skin and protects cells from oxidative stress. Both are important for supporting the scalp as an environment for healthy hair."
    },
    {
      id: "vitamin_e",
      name: "Vitamin E (natural)",
      subtitle: null,
      category: "Vitamine",
      amount: "18 mg",
      nrv: "150 %",
      benefit: "Cell protection",
      description: "Vitamin E helps protect cells from oxidative stress. This can help support the scalp and hair root against damaging environmental influences."
    },
    {
      id: "riboflavin",
      name: "Riboflavin",
      subtitle: "Vitamin B2",
      category: "Vitamine",
      amount: "1.4 mg",
      nrv: "100 %",
      benefit: "Healthy scalp",
      description: "Riboflavin (Vitamin B2) contributes to the maintenance of normal skin and the protection of cells from oxidative stress. A healthy scalp is the foundation for strong hair."
    },
    {
      id: "niacin",
      name: "Niacin",
      subtitle: "Vitamin B3",
      category: "Vitamine",
      amount: "20 mg",
      nrv: "125 %",
      benefit: "Skin barrier",
      description: "Niacin (Vitamin B3) contributes to the maintenance of normal skin. Since hair grows from the scalp, a well-nourished skin barrier can support the hair environment."
    },
    {
      id: "pantothenic_acid",
      name: "Pantothenic acid",
      subtitle: "Vitamin B5",
      category: "Vitamine",
      amount: "18 mg",
      nrv: "300 %",
      benefit: "Energy metabolism",
      description: "Pantothenic acid (Vitamin B5) contributes to normal energy metabolism. Energy and nutrient processes are fundamental for the body to reliably supply \u201cnon-essential\u201d structures like hair."
    },
    {
      id: "vitamin_b6",
      name: "Vitamin B6",
      subtitle: null,
      category: "Vitamine",
      amount: "7 mg",
      nrv: "500 %",
      benefit: "Protein metabolism",
      description: "Vitamin B6 contributes to normal protein and energy metabolism. Since hair is primarily made of protein (keratin), a functioning protein metabolism is an important building block for hair structure and growth."
    },
    {
      id: "folic_acid",
      name: "Folic acid",
      subtitle: null,
      category: "Vitamine",
      amount: "200 \u00b5g",
      nrv: "100 %",
      benefit: "Cell division",
      description: "Folic acid contributes to normal cell division. Rapidly dividing cells also play a role in the hair follicle \u2013 a good folate supply therefore supports the physiological growth processes."
    },
    {
      id: "vitamin_a",
      name: "Vitamin A",
      subtitle: null,
      category: "Vitamine",
      amount: "800 \u00b5g",
      nrv: "100 %",
      benefit: "Normal skin",
      description: "Vitamin A contributes to the maintenance of normal skin. A healthy scalp supports the environment in which hair grows."
    },
    {
      id: "beta_carotene",
      name: "Beta carotene",
      subtitle: null,
      category: "Vitamine",
      amount: "0.8 mg",
      nrv: null,
      benefit: "Vitamin A precursor",
      description: "Beta-carotene is a precursor of Vitamin A. It supplements the supply of Vitamin A-related building blocks that are important for skin health (and therefore also for the scalp)."
    },
    {
      id: "vitamin_d",
      name: "Vitamin D",
      subtitle: null,
      category: "Vitamine",
      amount: "10 \u00b5g",
      nrv: "200 %",
      benefit: "Immune system",
      description: "Vitamin D contributes to normal immune system function and normal cell division. Both can be relevant for a balanced scalp environment that supports healthy hair."
    },
    {
      id: "lcysteine",
      name: "L\u2011Cysteine",
      subtitle: "Amino acid",
      category: "Aminos\u00e4uren",
      amount: "50 mg",
      nrv: null,
      benefit: "Keratin building block",
      description: "L\u2011Cysteine is an important building block of keratin, the structural protein of hair. An adequate supply can support the natural hair structure \u2013 especially for brittle or damaged hair."
    },
    {
      id: "llysine_hcl",
      name: "L\u2011Lysine HCL",
      subtitle: null,
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Structural protein",
      contains: [{ name: "L\u2011Lysine", amount: "79 mg", nrv: null }],
      description: "L\u2011Lysine is an essential amino acid involved in building structural proteins. In hair care routines, it is often used to supplement the supply of protein building blocks that are important for hair structure."
    },
    {
      id: "zinc",
      name: "Zinc",
      subtitle: "Mineral",
      category: "Mineralstoffe",
      amount: "10 mg",
      nrv: "100 %",
      benefit: "Maintenance of normal hair",
      description: "Zinc contributes to the maintenance of normal hair and skin. It also supports the protection of cells from oxidative stress \u2013 both important factors for hair root and scalp."
    },
    {
      id: "boron",
      name: "Boron",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: null,
      benefit: "Mineral balance",
      description: "Boron is often used as a complementary trace nutrient in formulations. It can help to holistically round out mineral balance \u2013 indirectly relevant because hair benefits greatly from overall good nutrient supply."
    },
    {
      id: "manganese",
      name: "Manganese",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "50 %",
      benefit: "Connective tissue formation",
      description: "Manganese contributes to the protection of cells from oxidative stress and to normal connective tissue formation. This can support the skin/scalp structure that is important for healthy hair conditions."
    },
    {
      id: "copper",
      name: "Copper",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "1 mg",
      nrv: "100 %",
      benefit: "Hair pigmentation",
      description: "Copper contributes to normal hair pigmentation and supports the protection of cells from oxidative stress. It can therefore support both visual aspects (colour) and the general hair environment."
    },
    {
      id: "iodine",
      name: "Iodine",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "225 \u00b5g",
      nrv: "150 %",
      benefit: "Thyroid function",
      description: "Iodine contributes to normal thyroid function and hormone production. Since hormones can influence the hair cycle, a good iodine supply can indirectly contribute to more stable hair conditions."
    },
    {
      id: "selenium",
      name: "Selenium",
      subtitle: null,
      category: "Mineralstoffe",
      amount: "44 \u00b5g",
      nrv: "80 %",
      benefit: "Maintenance of normal hair",
      description: "Selenium contributes to the maintenance of normal hair and supports the protection of cells from oxidative stress. This makes it a key trace element for hair and scalp health."
    },
    {
      id: "biotin",
      name: "Biotin",
      subtitle: "Vitamin B7",
      category: "Vitamine",
      amount: "150 \u00b5g",
      nrv: "300 %",
      benefit: "Maintenance of normal hair",
      description: "Biotin contributes to the maintenance of normal hair and skin. It is often used as a foundational nutrient when it comes to hair quality, resilience and support of the growth environment."
    },
    {
      id: "sprouted_pea_seed",
      name: "Sprouted pea seed extract powder",
      subtitle: "AnaGain\u2122 Nu",
      category: "Sonstige Stoffe",
      amount: "100 mg",
      nrv: null,
      benefit: "Supports hair cycle",
      description: "Sprouted pea seed extract is a plant-based source of functional ingredients often used in hair routines to support the hair root. It complements the formula with plant-based building blocks that can accompany the hair cycle."
    }
  ];

  /* Category display names for English */
  var CATEGORY_LABELS = {
    "Naturstoffe": lang === "en" ? "Botanicals" : "Naturstoffe",
    "Vitamine": lang === "en" ? "Vitamins" : "Vitamine",
    "Mineralstoffe": lang === "en" ? "Minerals" : "Mineralstoffe",
    "Aminos\u00e4uren": lang === "en" ? "Amino acids" : "Aminos\u00e4uren",
    "Sonstige Stoffe": lang === "en" ? "Other substances" : "Sonstige Stoffe"
  };

  /* UI strings */
  var UI = lang === "en" ? {
    showMore: 'Show more <span aria-hidden="true">\u25be</span>',
    showLess: 'Show less <span aria-hidden="true">\u25b4</span>',
    capsules: "2 capsules",
    viewLabel: "View"
  } : {
    showMore: 'Mehr anzeigen <span aria-hidden="true">\u25be</span>',
    showLess: 'Weniger anzeigen <span aria-hidden="true">\u25b4</span>',
    capsules: "2 Kapseln",
    viewLabel: "anzeigen"
  };

  var INGREDIENTS = lang === "en" ? INGREDIENTS_EN : INGREDIENTS_DE;

  /* ─── Gallery rendering ─── */
  var gallery = document.getElementById("inh-gallery");
  var backdrop = document.getElementById("ingredient-backdrop");
  var drawer = document.getElementById("ingredient-drawer");
  var closeBtn = document.getElementById("ingredient-drawer-close");
  var titleEl = document.getElementById("ingredient-drawer-title");
  var subtitleEl = document.getElementById("ingredient-drawer-subtitle");
  var descriptionEl = document.getElementById("ingredient-drawer-description");
  var factsEl = document.getElementById("ingredient-drawer-facts");
  var containsEl = document.getElementById("ingredient-drawer-contains");
  var kickerEl = document.getElementById("ingredient-drawer-kicker");
  var drawerImage = document.getElementById("ingredient-drawer-image");

  if (!gallery) return;

  var hasDrawer = backdrop && drawer && closeBtn && titleEl && subtitleEl && descriptionEl && factsEl && containsEl && kickerEl;
  var activeFilter = "all";

  /* Capsule image URL — grab from existing img in drawer or fallback */
  var capsuleUrl = "capsule.svg";
  var existingCapsule = document.querySelector(".ingredient-drawer-media-icon");
  if (existingCapsule && existingCapsule.src) capsuleUrl = existingCapsule.src;

  /* Per-ingredient images (set from Liquid), fallback to capsule */
  var ingredientImages = window.__INGREDIENT_IMAGES__ || {};
  function getImageUrl(item) {
    return ingredientImages[item.id] || capsuleUrl;
  }

  function normalizeAssetUrl(url) {
    if (!url) return "";
    return url
      .replace(/ingredients%2F/ig, "")
      .replace(/\/ingredients\//ig, "/");
  }

  function setImageSrcWithFallback(img, primaryUrl) {
    if (!img) return;
    var firstUrl = primaryUrl || capsuleUrl;
    var secondUrl = normalizeAssetUrl(firstUrl);

    img.dataset.fallbackPrimary = firstUrl;
    img.dataset.fallbackSecondary = secondUrl;
    img.dataset.fallbackStep = "0";
    img.onerror = function () {
      if (
        this.dataset.fallbackStep === "0" &&
        this.dataset.fallbackSecondary &&
        this.dataset.fallbackSecondary !== this.dataset.fallbackPrimary
      ) {
        this.dataset.fallbackStep = "1";
        this.src = this.dataset.fallbackSecondary;
        return;
      }
      if (this.dataset.fallbackStep !== "2" && capsuleUrl && this.src !== capsuleUrl) {
        this.dataset.fallbackStep = "2";
        this.src = capsuleUrl;
        return;
      }
      this.onerror = null;
    };
    img.src = firstUrl;
  }

  function metaLine(item) {
    var parts = [];
    if (item.amount) parts.push(item.amount);
    if (item.nrv) parts.push("NRV " + item.nrv);
    return parts.join(" \u00b7 ");
  }

  function openDrawer(item) {
    if (!hasDrawer) return;
    titleEl.textContent = item.name;
    var subParts = [];
    if (item.subtitle) subParts.push(item.subtitle);
    var meta = metaLine(item);
    if (meta) subParts.push(meta);
    subtitleEl.textContent = subParts.join(" \u00b7 ");

    /* Update drawer image to match the ingredient */
    if (drawerImage) {
      setImageSrcWithFallback(drawerImage, getImageUrl(item));
    }

    if (item.amount || item.nrv) {
      factsEl.hidden = false;
      factsEl.innerHTML =
        '<div class="ingredient-fact-row"><div class="ingredient-fact-label">' + UI.capsules + '</div><div class="ingredient-fact-value">' + (item.amount || "\u2013") + '</div></div>' +
        '<div class="ingredient-fact-row"><div class="ingredient-fact-label">NRV (%)</div><div class="ingredient-fact-value">' + (item.nrv || "\u2013") + '</div></div>';
    } else {
      factsEl.hidden = true;
      factsEl.innerHTML = "";
    }

    if (item.description) {
      descriptionEl.hidden = false;
      descriptionEl.textContent = item.description;
    } else {
      descriptionEl.hidden = true;
      descriptionEl.textContent = "";
    }

    if (Array.isArray(item.contains) && item.contains.length) {
      containsEl.hidden = false;
      containsEl.innerHTML = item.contains.map(function (c) {
        var cMeta = [c.amount, c.nrv ? "NRV " + c.nrv : null].filter(Boolean).join(" \u00b7 ");
        return '<li><span class="ingredient-contains-name">' + c.name + '</span><span class="ingredient-contains-meta">' + (cMeta || "\u2013") + '</span></li>';
      }).join("");
    } else {
      containsEl.hidden = true;
      containsEl.innerHTML = "";
    }
    kickerEl.textContent = (CATEGORY_LABELS[item.category] || item.category).toUpperCase();

    backdrop.hidden = false;
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("drawer-open");
    closeBtn.focus();
  }

  function closeDrawerFn() {
    if (!hasDrawer) return;
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("drawer-open");
    backdrop.hidden = true;
  }

  function renderGallery() {
    gallery.innerHTML = "";
    INGREDIENTS.forEach(function (item) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "inh-card";
      card.setAttribute("aria-label", item.name + " " + UI.viewLabel);
      card.dataset.category = item.category;

      if (activeFilter !== "all" && item.category !== activeFilter) {
        card.hidden = true;
      }

      var metaStr = metaLine(item);
      var categoryDisplay = CATEGORY_LABELS[item.category] || item.category;

      var imgUrl = getImageUrl(item);
      card.innerHTML =
        '<div class="inh-pill-ring">' +
        '<span class="inh-pill-benefit">' + (item.benefit || '') + '</span>' +
        '<img class="inh-pill-capsule" src="' + capsuleUrl + '" alt="" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="inh-card-name">' + item.name + '</div>' +
        (metaStr ? '<div class="inh-card-meta">' + metaStr + '</div>' : '') +
        '<div class="inh-card-category">' + categoryDisplay + '</div>';

      card.addEventListener("click", function () { openDrawer(item); });
      gallery.appendChild(card);
      setImageSrcWithFallback(card.querySelector(".inh-pill-capsule"), imgUrl);
    });
  }

  /* ─── Filters ─── */
  var filterBtns = document.querySelectorAll(".inh-filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;

      var cards = gallery.querySelectorAll(".inh-card");
      cards.forEach(function (card) {
        if (activeFilter === "all" || card.dataset.category === activeFilter) {
          card.hidden = false;
        } else {
          card.hidden = true;
        }
      });
    });
  });

  /* ─── Drawer events ─── */
  if (hasDrawer) {
    backdrop.addEventListener("click", closeDrawerFn);
    closeBtn.addEventListener("click", closeDrawerFn);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawerFn();
    });
  }

  renderGallery();

  /* ─── Nutrition toggle ─── */
  var root = document.getElementById("nutrition-collapsible");
  if (root) {
    var btn = root.querySelector(".nutrition-toggle");
    var tableWrap = root.querySelector(".nutrition-table-wrap");
    if (btn && tableWrap) {
      function setExpanded(expanded) {
        root.classList.toggle("is-expanded", expanded);
        btn.setAttribute("aria-expanded", expanded ? "true" : "false");
        btn.innerHTML = expanded ? UI.showLess : UI.showMore;
      }
      btn.addEventListener("click", function () {
        var expanded = btn.getAttribute("aria-expanded") === "true";
        setExpanded(!expanded);
      });
      setExpanded(false);
    }
  }
})();
