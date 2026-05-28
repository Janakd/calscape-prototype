// plants-data.js — sets window.PLANTS_DATA
// Functionally equivalent to plants.json; uses script-tag delivery so the
// prototype runs from file:// without a local server.

window.PLANTS_DATA = [
  {
    slug: "manzanita",
    common_name: "Manzanita",
    scientific_name: "Arctostaphylos densiflora 'Howard McMinn'",
    summary: "Evergreen shrub native to California's chaparral. Famously challenging to propagate from cuttings or stratified seed.",
    tags: ["evergreen", "shrub", "drought-tolerant", "pollinator", "chaparral", "full-sun"],
    propagation_keywords: ["cuttings", "stratification", "semi-hardwood", "smoke", "layering", "scarification"],
    thumb: "assets/img/thumbs/manzanita.svg",
    has_full_page: true
  },
  {
    slug: "coast-live-oak",
    common_name: "Coast Live Oak",
    scientific_name: "Quercus agrifolia",
    summary: "Iconic evergreen oak of coastal California. Long-lived; grows from acorn with no special treatment.",
    tags: ["tree", "evergreen", "oak", "wildlife", "long-lived"],
    propagation_keywords: ["acorn", "seed", "direct-sow"],
    thumb: "assets/img/thumbs/coast-live-oak.svg",
    has_full_page: false
  },
  {
    slug: "toyon",
    common_name: "Toyon",
    scientific_name: "Heteromeles arbutifolia",
    summary: "Evergreen shrub with red winter berries. The 'Holly' that named Hollywood. Grows from seed after cold stratification.",
    tags: ["evergreen", "shrub", "wildlife", "berries", "drought-tolerant"],
    propagation_keywords: ["seed", "stratification", "cold-strat"],
    thumb: "assets/img/thumbs/toyon.svg",
    has_full_page: false
  },
  {
    slug: "ceanothus",
    common_name: "California Lilac",
    scientific_name: "Ceanothus thyrsiflorus",
    summary: "Evergreen shrub covered in clouds of blue flowers in spring. Nitrogen-fixing. Cuttings or scarified seed.",
    tags: ["evergreen", "shrub", "pollinator", "blue-flower", "nitrogen-fixer", "drought-tolerant"],
    propagation_keywords: ["cuttings", "seed", "scarification", "hot-water"],
    thumb: "assets/img/thumbs/ceanothus.svg",
    has_full_page: false
  },
  {
    slug: "monkeyflower",
    common_name: "Sticky Monkeyflower",
    scientific_name: "Diplacus aurantiacus",
    summary: "Sub-shrub with orange-yellow flowers. Easy from cuttings or seed.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "orange-flower"],
    propagation_keywords: ["cuttings", "seed", "softwood"],
    thumb: "assets/img/thumbs/monkeyflower.svg",
    has_full_page: false
  },
  {
    slug: "yarrow",
    common_name: "Common Yarrow",
    scientific_name: "Achillea millefolium",
    summary: "Tough herbaceous perennial. Spreads by rhizome; easy from seed or division.",
    tags: ["perennial", "herbaceous", "pollinator", "drought-tolerant", "lawn-alternative"],
    propagation_keywords: ["division", "seed", "rhizome"],
    thumb: "assets/img/thumbs/yarrow.svg",
    has_full_page: false
  },
  {
    slug: "matilija-poppy",
    common_name: "Matilija Poppy",
    scientific_name: "Romneya coulteri",
    summary: "Six-foot perennial with huge white 'fried egg' flowers. Notoriously hard to transplant; root cuttings or layering work best.",
    tags: ["perennial", "tall", "drought-tolerant", "white-flower"],
    propagation_keywords: ["root-cuttings", "layering", "difficult"],
    thumb: "assets/img/thumbs/matilija-poppy.svg",
    has_full_page: false
  },
  {
    slug: "buckwheat",
    common_name: "California Buckwheat",
    scientific_name: "Eriogonum fasciculatum",
    summary: "Hardworking sub-shrub. Critical pollinator forage. Grows readily from seed.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "chaparral"],
    propagation_keywords: ["seed", "direct-sow"],
    thumb: "assets/img/thumbs/buckwheat.svg",
    has_full_page: false
  },
  {
    slug: "deergrass",
    common_name: "Deergrass",
    scientific_name: "Muhlenbergia rigens",
    summary: "Large bunchgrass, traditional Indigenous basketry material. Easy from seed or division.",
    tags: ["grass", "perennial", "drought-tolerant", "wildlife"],
    propagation_keywords: ["seed", "division"],
    thumb: "assets/img/thumbs/deergrass.svg",
    has_full_page: false
  },
  {
    slug: "elderberry",
    common_name: "Blue Elderberry",
    scientific_name: "Sambucus nigra ssp. caerulea",
    summary: "Fast-growing tree-shrub with edible berries. Roots readily from hardwood cuttings.",
    tags: ["tree", "shrub", "wildlife", "edible", "deciduous"],
    propagation_keywords: ["cuttings", "hardwood", "seed"],
    thumb: "assets/img/thumbs/elderberry.svg",
    has_full_page: false
  },
  {
    slug: "white-sage",
    common_name: "White Sage",
    scientific_name: "Salvia apiana",
    summary: "Sacred sage with silver foliage. Slow but reliable from semi-hardwood cuttings; conservation concerns around wild harvest.",
    tags: ["sub-shrub", "pollinator", "drought-tolerant", "salvia", "silver-foliage", "conservation"],
    propagation_keywords: ["cuttings", "seed", "semi-hardwood"],
    thumb: "assets/img/thumbs/white-sage.svg",
    has_full_page: false
  },
  {
    slug: "douglas-iris",
    common_name: "Douglas Iris",
    scientific_name: "Iris douglasiana",
    summary: "Coastal native iris with purple-blue flowers. Spreads from rhizome division.",
    tags: ["perennial", "iris", "rhizomatous", "purple-flower", "coastal"],
    propagation_keywords: ["division", "rhizome"],
    thumb: "assets/img/thumbs/douglas-iris.svg",
    has_full_page: false
  },
  {
    slug: "redbud",
    common_name: "Western Redbud",
    scientific_name: "Cercis occidentalis",
    summary: "Small deciduous tree with magenta spring flowers. Grows from scarified, stratified seed.",
    tags: ["tree", "deciduous", "pink-flower", "drought-tolerant"],
    propagation_keywords: ["seed", "scarification", "stratification"],
    thumb: "assets/img/thumbs/redbud.svg",
    has_full_page: false
  }
];
