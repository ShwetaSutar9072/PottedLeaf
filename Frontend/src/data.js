// Sample products (same items and images as your website folder).
// Used when the backend has no plants yet. The old HTML had no prices, so these are PLACEHOLDERS.
const p = (id, category, name, image, price) => ({
  id, category, name, image: "/images/" + image, price, stock: 99, description: "",
});

export const plants = [
  p(1, "Plants", "Bambu Palm Plant", "bambu.jpg", 499),
  p(2, "Plants", "Peace Lily Plant", "lily.jpg", 349),
  p(3, "Plants", "Jade Mini Plant", "jade.jpg", 299),
  p(4, "Plants", "Brazzilian Wood Plant", "wood.jpg", 599),
  p(5, "Plants", "Lucky Bambu Plant", "luckybamboo.jpg", 249),
  p(6, "Plants", "Broken Heart Plant", "brokenheart.jpg", 199),
  p(7, "Plants", "Golden Money Plant", "goldenmoney.jpg", 279),
  p(8, "Plants", "ZZ Plant", "zz.jpg", 549),
];
export const seeds = [
  p(101, "Seeds", "Dahlia", "dahlia.jpg", 99),
  p(102, "Seeds", "Water Rain Lily", "lily1.jpg", 129),
  p(103, "Seeds", "Lotus", "lotus.jpg", 149),
  p(104, "Seeds", "Mixed Flowers", "mixed.jpg", 89),
  p(105, "Seeds", "Lavender", "lavender.jpg", 119),
  p(106, "Seeds", "Cherry and Tomato", "cherry.jpg", 79),
  p(107, "Seeds", "Brinjal", "brinjal.jpg", 59),
  p(108, "Seeds", "Bhindi", "bhindi.jpg", 59),
];
export const fertilizers = [
  p(201, "Fertilizers", "Vermi Compost", "vermicompost.jpg", 199),
  p(202, "Fertilizers", "Grow Roots", "growroots.jpg", 149),
  p(203, "Fertilizers", "Aqua Plant Food", "aquaplantfood.jpg", 179),
  p(204, "Fertilizers", "Cocopeat", "cocopeat.jpg", 129),
  p(205, "Fertilizers", "Magic soil", "magicsoil.jpg", 249),
  p(206, "Fertilizers", "Plant Food Sticks", "plantfoodsticks.jpg", 99),
  p(207, "Fertilizers", "Potting Mixture", "pottingmixture.jpg", 189),
  p(208, "Fertilizers", "Sagarika", "sagarika.jpg", 159),
];
export const sampleCatalog = [...plants, ...seeds, ...fertilizers];
export const LOCAL_IMAGES = new Set(sampleCatalog.map((x) => x.image));
export const CATEGORIES = ["Plants", "Seeds", "Fertilizers"];

export const intro =
  "Plants make for the best house companions, suitable for all your moods and every aesthetic. The Potted Leaf, an online website for decorative plants, offers a wide variety of plants so that you can buy plants online from the comfort of your home!";
