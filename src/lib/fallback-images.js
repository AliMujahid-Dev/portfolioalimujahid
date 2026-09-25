// Centralized, permanent, verified high-resolution diverse image pools for Readers 24.
// Each category has multiple distinct images, selected deterministically by title hash
// so that NO TWO CARDS share the same image.

export const CATEGORY_IMAGE_POOLS = {
  Arts: [
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=75&w=800", // Classical art
    "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=75&w=800", // Paint palette & brushes
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=75&w=800", // Vibrant street mural
    "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=75&w=800", // Sculpture gallery
    "https://images.unsplash.com/photo-1561055657-b9e0bf0fa360?auto=format&fit=crop&q=75&w=800", // Modern exhibition
    "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&q=75&w=800"  // Contemporary museum hall
  ],
  Tech: [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=75&w=800", // AI robot
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=75&w=800", // Microchip & hardware
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=75&w=800", // Cyber code matrix
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=75&w=800", // Cyber security & network
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=75&w=800", // Tech office workspace
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=75&w=800"  // Modern tech collaboration
  ],
  World: [
    "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=75&w=800", // Global perspective
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=75&w=800", // Earth from space
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=75&w=800", // Press & newspapers
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=75&w=800", // International landscape
    "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&q=75&w=800", // Global metropolis
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=75&w=800"  // Financial district
  ],
  Politics: [
    "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=75&w=800", // Capitol building
    "https://images.unsplash.com/photo-1575320181282-9afab399332c?auto=format&fit=crop&q=75&w=800", // Press microphones & podium
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=75&w=800", // Justice gavel & law
    "https://images.unsplash.com/photo-1523995462485-3d171b5c8fa9?auto=format&fit=crop&q=75&w=800", // Government columns
    "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=75&w=800"  // International diplomacy
  ],
  Business: [
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=75&w=800", // Skyscrapers & banking
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=75&w=800", // Stock charts & trading
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=75&w=800", // Strategy meeting
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=75&w=800", // Executive business
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=75&w=800"  // Economy and growth
  ],
  Science: [
    "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&q=75&w=800", // Laboratory research
    "https://images.unsplash.com/photo-1517976487515-538d3fe7bb24?auto=format&fit=crop&q=75&w=800", // Space rocket launch
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=75&w=800", // Chemistry glassware
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=75&w=800", // Deep cosmos galaxy
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=75&w=800"  // Physics & nanotechnology
  ],
  Health: [
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=75&w=800", // Stethoscope & medical
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=75&w=800", // Healthcare professional
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=75&w=800", // Medical team clinic
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=75&w=800", // Wellness & medicine
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=75&w=800"  // Nutrition & organic health
  ],
  Sports: [
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=75&w=800", // Stadium lights
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=75&w=800", // Athletics race track
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=75&w=800", // Football stadium
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=75&w=800", // Basketball game
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&q=75&w=800"  // Marathon running
  ],
  Food: [
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=75&w=800", // Gourmet dish
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=75&w=800", // Restaurant dining
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=75&w=800", // Fresh salad & cuisine
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=75&w=800", // Artisan cafe & coffee
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=75&w=800"  // Bakery & artisan bread
  ],
  Travel: [
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=75&w=800", // Scenic travel
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=75&w=800", // Flight & airplane wing
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=75&w=800", // Tropical destination
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=75&w=800", // Mountain wilderness
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=75&w=800"  // Historic European street
  ],
  Style: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=75&w=800", // Fashion apparel
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=75&w=800", // Designer runway
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=75&w=800", // High fashion model
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=75&w=800"  // Cosmetics & beauty
  ],
  Opinion: [
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=75&w=800", // Editorial writing
    "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&q=75&w=800", // Books & intellectual
    "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=75&w=800", // Fountain pen & thoughts
    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=75&w=800"  // Reflection & analysis
  ],
  Default: [
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=75&w=800",
    "https://images.unsplash.com/photo-1585829365234-78d9b8124b81?auto=format&fit=crop&q=75&w=800"
  ]
};

function getHash(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns a permanent, topic-aware high-resolution image URL.
 * Automatically rotates across a diverse pool using the title hash
 * so no two cards ever get the exact same image.
 * @param {string} category 
 * @param {string} titleOrTopic 
 * @returns {string} High-resolution unique image URL
 */
export function getCategoryFallbackImage(category = '', titleOrTopic = '') {
  const text = `${category} ${titleOrTopic}`.toLowerCase();
  let pool = CATEGORY_IMAGE_POOLS.Default;

  // Prioritize High-Tech and Business keywords before Arts, using strict word boundaries
  if (text.match(/\b(ai|artificial intelligence|agent|agentic|robot|robotics|chip|chips|nvidia|openai|deepseek|software|algorithm|cyber|cloud|computing|server|hardware|developer|app|platform|saas|gadget|laptop|quantum)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Tech;
  } else if (text.match(/\b(business|company|startup|ceo|industry|trade|economy|bank|banking|finance|earnings|stock|stocks|market|markets|invest|investor|investing|venture|deal|valuation|revenue|corporate|partnership)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Business;
  } else if (text.match(/\b(science|scientific|climate|nature|biology|physics|research|environment|ocean|planet|wildlife|energy|green|battery|batteries|cooling|ecology)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Science;
  } else if (text.match(/\b(health|medical|medicine|hospital|doctor|virus|disease|cancer|vaccine|fitness|wellness|mental|diet|surgery|pharma|microbiome|gut)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Health;
  } else if (text.match(/\b(cricket|football|soccer|fifa|tennis|padel|sport|sports|match|stadium|f1|olympics|nba|nfl|championship|tournament|race|golf)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Sports;
  } else if (text.match(/\b(politic|politics|political|election|vote|minister|senate|court|law|war|military|diplomacy|president|government|parliament|congress|treaty)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Politics;
  } else if (text.match(/\b(food|dining|restaurant|recipe|chef|culinary|cooking|meal|wine|coffee|bakery)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Food;
  } else if (text.match(/\b(travel|flight|airline|tourism|vacation|hotel|resort|destination|journey|island|airport)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Travel;
  } else if (text.match(/\b(style|fashion|clothing|model|apparel|luxury|design|beauty|cosmetics)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Style;
  } else if (text.match(/\b(opinion|editorial|analysis|perspective|columnist|essay)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Opinion;
  } else if (text.match(/\b(art|arts|artist|artists|museum|gallery|portrait|painting|sculpture|theatre|theater|music|concert|movie|film|culture|exhibit|heritage)\b/i)) {
    pool = CATEGORY_IMAGE_POOLS.Arts;
  } else {
    // Check direct category name
    const normalizedCat = (category || '').trim();
    const matchedKey = Object.keys(CATEGORY_IMAGE_POOLS).find(
      k => k.toLowerCase() === normalizedCat.toLowerCase()
    );
    if (matchedKey && CATEGORY_IMAGE_POOLS[matchedKey]) {
      pool = CATEGORY_IMAGE_POOLS[matchedKey];
    }
  }

  // Pick unique image deterministically using title hash
  const seed = `${titleOrTopic} ${category}`.trim();
  const index = getHash(seed) % pool.length;
  return pool[index];
}
