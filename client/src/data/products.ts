export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price?: string;
  variant?: string;
  image?: string;
  keyBenefits?: string[];
  ingredientsUsage?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  productCount: number;
}

export const categories: Category[] = [
  {
    id: 'bath-soaps',
    name: 'Bath Soaps',
    description: 'Premium quality bath soaps for daily freshness',
    icon: '🧼',
    productCount: 12
  },
  {
    id: 'detergents',
    name: 'Detergents',
    description: 'Powerful cleaning detergents for all fabrics',
    icon: '🧺',
    productCount: 15
  },
  {
    id: 'fabric-conditioner',
    name: 'Fabric Conditioner',
    description: 'Soft and fragrant fabric care solutions',
    icon: '👕',
    productCount: 10
  },
  {
    id: 'airdrops',
    name: 'Airdrops',
    description: 'Long-lasting freshness for your spaces',
    icon: '/ri.png',
    productCount: 8
  },
  {
    id: 'hair-oil',
    name: 'Hair Oil',
    description: 'Nourishing hair oils for healthy hair',
    icon: '💆',
    productCount: 12
  },
  {
    id: 'handwash',
    name: 'Handwash Liquid',
    description: 'Gentle and effective handwash solutions',
    icon: '🖐️',
    productCount: 9
  },
  {
    id: 'shampoo',
    name: 'Shampoo',
    description: 'Quality shampoos for all hair types',
    icon: '🧴',
    productCount: 14
  },
  {
    id: 'toiletries',
    name: 'Toiletries',
    description: 'Complete range of personal care products',
    icon: '🚿',
    productCount: 18
  }
];

export const products: Product[] = [
  // Bath Soaps
  { id: 'bs1', name: 'Lavender Bath Soap', description: 'Refreshing lavender scented soap', category: 'bath-soaps', variant: '100g' },
  { id: 'bs2', name: 'Sandalwood Bath Soap', description: 'Traditional sandalwood fragrance', category: 'bath-soaps', variant: '125g' },
  { id: 'bs3', name: 'Rose Bath Soap', description: 'Gentle rose scented soap', category: 'bath-soaps', variant: '100g' },
  { id: 'bs4', name: 'Neem Bath Soap', description: 'Natural neem for healthy skin', category: 'bath-soaps', variant: '100g' },
  { id: 'bs5', name: 'Coconut Bath Soap', description: 'Moisturizing coconut oil soap', category: 'bath-soaps', variant: '125g' },
  { id: 'bs6', name: 'Aloe Vera Bath Soap', description: 'Soothing aloe vera extracts', category: 'bath-soaps', variant: '100g' },
  { id: 'bs7', name: 'Turmeric Bath Soap', description: 'Brightening turmeric soap', category: 'bath-soaps', variant: '100g' },
  { id: 'bs8', name: 'Charcoal Bath Soap', description: 'Deep cleansing charcoal', category: 'bath-soaps', variant: '125g' },
  { id: 'bs9', name: 'Glycerine Bath Soap', description: 'Transparent glycerine soap', category: 'bath-soaps', variant: '100g' },
  { id: 'bs10', name: 'Honey Bath Soap', description: 'Natural honey enriched', category: 'bath-soaps', variant: '100g' },
  { id: 'bs11', name: 'Mint Fresh Bath Soap', description: 'Cooling mint freshness', category: 'bath-soaps', variant: '125g' },
  { id: 'bs12', name: 'Lemon Bath Soap', description: 'Zesty lemon fragrance', category: 'bath-soaps', variant: '100g' },

  // Detergents
  { id: 'dt1', name: 'Premium Detergent Powder', description: 'High efficiency cleaning powder', category: 'detergents', variant: '1kg' },
  { id: 'dt2', name: 'Liquid Detergent', description: 'Concentrated liquid formula', category: 'detergents', variant: '2L' },
  { id: 'dt3', name: 'Active Wash Powder', description: 'Active stain removal', category: 'detergents', variant: '500g' },
  { id: 'dt4', name: 'Color Care Detergent', description: 'Protects fabric colors', category: 'detergents', variant: '1kg' },
  { id: 'dt5', name: 'Gentle Touch Detergent', description: 'Gentle on hands', category: 'detergents', variant: '750g' },
  { id: 'dt6', name: 'Stain Fighter Powder', description: 'Tough on stains', category: 'detergents', variant: '1.5kg' },
  { id: 'dt7', name: 'Floral Detergent', description: 'Long-lasting floral scent', category: 'detergents', variant: '1kg' },
  { id: 'dt8', name: 'White Magic Powder', description: 'Whitening formula', category: 'detergents', variant: '1kg' },
  { id: 'dt9', name: 'Baby Care Detergent', description: 'Gentle for baby clothes', category: 'detergents', variant: '500g' },
  { id: 'dt10', name: 'Eco Friendly Detergent', description: 'Biodegradable formula', category: 'detergents', variant: '1kg' },
  { id: 'dt11', name: 'Sport Wash Detergent', description: 'For active wear', category: 'detergents', variant: '750g' },
  { id: 'dt12', name: 'Quick Wash Powder', description: 'Fast acting formula', category: 'detergents', variant: '1kg' },
  { id: 'dt13', name: 'Heavy Duty Detergent', description: 'For tough stains', category: 'detergents', variant: '2kg' },
  { id: 'dt14', name: 'Delicate Fabric Wash', description: 'For silk and wool', category: 'detergents', variant: '500g' },
  { id: 'dt15', name: 'Herbal Detergent', description: 'Natural herbal extracts', category: 'detergents', variant: '1kg' },

  // Fabric Conditioner
  { id: 'fc1', name: 'Soft Touch Conditioner', description: 'Ultra soft fabric feel', category: 'fabric-conditioner', variant: '1L' },
  { id: 'fc2', name: 'Floral Bliss Conditioner', description: 'Fresh floral fragrance', category: 'fabric-conditioner', variant: '1.5L' },
  { id: 'fc3', name: 'Ocean Breeze Conditioner', description: 'Refreshing ocean scent', category: 'fabric-conditioner', variant: '1L' },
  { id: 'fc4', name: 'Spring Fresh Conditioner', description: 'Spring garden freshness', category: 'fabric-conditioner', variant: '2L' },
  { id: 'fc5', name: 'Lavender Dream Conditioner', description: 'Calming lavender', category: 'fabric-conditioner', variant: '1L' },
  { id: 'fc6', name: 'Sensitive Skin Conditioner', description: 'Hypoallergenic formula', category: 'fabric-conditioner', variant: '1L' },
  { id: 'fc7', name: 'Long Lasting Freshness', description: 'Extended fresh scent', category: 'fabric-conditioner', variant: '1.5L' },
  { id: 'fc8', name: 'Baby Soft Conditioner', description: 'Gentle for baby clothes', category: 'fabric-conditioner', variant: '1L' },
  { id: 'fc9', name: 'Premium Conditioner', description: 'Luxury fabric care', category: 'fabric-conditioner', variant: '2L' },
  { id: 'fc10', name: 'Anti-Static Conditioner', description: 'Reduces static cling', category: 'fabric-conditioner', variant: '1L' },

  // Air Fresheners
  { id: 'af1', name: 'Citrus Burst Air Freshener', description: 'Energizing citrus scent', category: 'airdrops', variant: '300ml' },
  { id: 'af2', name: 'Lavender Fields Spray', description: 'Relaxing lavender aroma', category: 'airdrops', variant: '250ml' },
  { id: 'af3', name: 'Ocean Mist Freshener', description: 'Cool ocean breeze', category: 'airdrops', variant: '300ml' },
  { id: 'af4', name: 'Jasmine Garden Spray', description: 'Exotic jasmine fragrance', category: 'airdrops', variant: '250ml' },
  { id: 'af5', name: 'Pine Forest Freshener', description: 'Fresh pine scent', category: 'airdrops', variant: '300ml' },
  { id: 'af6', name: 'Rose Bouquet Spray', description: 'Elegant rose fragrance', category: 'airdrops', variant: '250ml' },
  { id: 'af7', name: 'Vanilla Dream Freshener', description: 'Sweet vanilla aroma', category: 'airdrops', variant: '300ml' },
  { id: 'af8', name: 'Sandalwood Mist', description: 'Traditional sandalwood', category: 'airdrops', variant: '250ml' },

  // Hair Oil
  { id: 'ho1', name: 'Coconut Hair Oil', description: 'Pure coconut oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho2', name: 'Almond Hair Oil', description: 'Nourishing almond oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho3', name: 'Amla Hair Oil', description: 'Traditional amla oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho4', name: 'Bhringraj Hair Oil', description: 'Ayurvedic bhringraj', category: 'hair-oil', variant: '200ml' },
  { id: 'ho5', name: 'Jasmine Hair Oil', description: 'Fragrant jasmine oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho6', name: 'Argan Hair Oil', description: 'Moroccan argan oil', category: 'hair-oil', variant: '100ml' },
  { id: 'ho7', name: 'Onion Hair Oil', description: 'Hair growth formula', category: 'hair-oil', variant: '200ml' },
  { id: 'ho8', name: 'Castor Hair Oil', description: 'Strengthening castor oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho9', name: 'Rosemary Hair Oil', description: 'Scalp care oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho10', name: 'Olive Hair Oil', description: 'Moisturizing olive oil', category: 'hair-oil', variant: '200ml' },
  { id: 'ho11', name: 'Neem Hair Oil', description: 'Anti-dandruff formula', category: 'hair-oil', variant: '200ml' },
  { id: 'ho12', name: 'Herbal Hair Oil', description: 'Multi-herb blend', category: 'hair-oil', variant: '200ml' },

  // Handwash
  { id: 'hw1', name: 'Antibacterial Handwash', description: 'Kills 99.9% germs', category: 'handwash', variant: '250ml' },
  { id: 'hw2', name: 'Aloe Vera Handwash', description: 'Moisturizing aloe vera', category: 'handwash', variant: '250ml' },
  { id: 'hw3', name: 'Lavender Handwash', description: 'Soothing lavender', category: 'handwash', variant: '250ml' },
  { id: 'hw4', name: 'Lemon Fresh Handwash', description: 'Zesty lemon scent', category: 'handwash', variant: '250ml' },
  { id: 'hw5', name: 'Neem Handwash', description: 'Natural neem extracts', category: 'handwash', variant: '250ml' },
  { id: 'hw6', name: 'Rose Handwash', description: 'Gentle rose fragrance', category: 'handwash', variant: '250ml' },
  { id: 'hw7', name: 'Mint Fresh Handwash', description: 'Cooling mint formula', category: 'handwash', variant: '250ml' },
  { id: 'hw8', name: 'Glycerine Handwash', description: 'Extra moisturizing', category: 'handwash', variant: '250ml' },
  { id: 'hw9', name: 'Sensitive Skin Handwash', description: 'pH balanced formula', category: 'handwash', variant: '250ml' },

  // Shampoo
  { id: 'sh1', name: 'Anti-Dandruff Shampoo', description: 'Controls dandruff', category: 'shampoo', variant: '200ml' },
  { id: 'sh2', name: 'Hair Fall Control Shampoo', description: 'Reduces hair fall', category: 'shampoo', variant: '200ml' },
  { id: 'sh3', name: 'Smoothing Shampoo', description: 'For smooth silky hair', category: 'shampoo', variant: '200ml' },
  { id: 'sh4', name: 'Volumizing Shampoo', description: 'Adds volume and bounce', category: 'shampoo', variant: '200ml' },
  { id: 'sh5', name: 'Moisturizing Shampoo', description: 'Deep moisture therapy', category: 'shampoo', variant: '200ml' },
  { id: 'sh6', name: 'Color Protect Shampoo', description: 'For colored hair', category: 'shampoo', variant: '200ml' },
  { id: 'sh7', name: 'Herbal Shampoo', description: 'Natural herbal blend', category: 'shampoo', variant: '200ml' },
  { id: 'sh8', name: 'Kids Shampoo', description: 'Tear-free formula', category: 'shampoo', variant: '200ml' },
  { id: 'sh9', name: 'Protein Shampoo', description: 'Strengthening protein', category: 'shampoo', variant: '200ml' },
  { id: 'sh10', name: 'Onion Shampoo', description: 'Hair growth formula', category: 'shampoo', variant: '200ml' },
  { id: 'sh11', name: 'Coconut Shampoo', description: 'Nourishing coconut', category: 'shampoo', variant: '200ml' },
  { id: 'sh12', name: 'Tea Tree Shampoo', description: 'Scalp care formula', category: 'shampoo', variant: '200ml' },
  { id: 'sh13', name: 'Argan Oil Shampoo', description: 'Luxury hair care', category: 'shampoo', variant: '200ml' },
  { id: 'sh14', name: 'Biotin Shampoo', description: 'Hair thickening', category: 'shampoo', variant: '200ml' },

  // Toiletries
  { id: 'tl1', name: 'Toothpaste Mint Fresh', description: 'Fresh breath all day', category: 'toiletries', variant: '100g' },
  { id: 'tl2', name: 'Toothpaste Whitening', description: 'Whitens teeth', category: 'toiletries', variant: '100g' },
  { id: 'tl3', name: 'Mouthwash Fresh', description: 'Antibacterial mouthwash', category: 'toiletries', variant: '250ml' },
  { id: 'tl4', name: 'Toothbrush Soft', description: 'Gentle on gums', category: 'toiletries', variant: 'Single' },
  { id: 'tl5', name: 'Toothbrush Medium', description: 'Effective cleaning', category: 'toiletries', variant: 'Single' },
  { id: 'tl6', name: 'Dental Floss', description: 'Reaches between teeth', category: 'toiletries', variant: '50m' },
  { id: 'tl7', name: 'Shaving Cream', description: 'Smooth shaving', category: 'toiletries', variant: '100g' },
  { id: 'tl8', name: 'Aftershave Lotion', description: 'Soothes skin', category: 'toiletries', variant: '100ml' },
  { id: 'tl9', name: 'Face Wash Gel', description: 'Deep cleansing', category: 'toiletries', variant: '150ml' },
  { id: 'tl10', name: 'Face Scrub', description: 'Exfoliating scrub', category: 'toiletries', variant: '100g' },
  { id: 'tl11', name: 'Body Lotion', description: 'Moisturizing lotion', category: 'toiletries', variant: '200ml' },
  { id: 'tl12', name: 'Talcum Powder', description: 'Fresh feeling', category: 'toiletries', variant: '100g' },
  { id: 'tl13', name: 'Deodorant Spray', description: 'Long-lasting freshness', category: 'toiletries', variant: '150ml' },
  { id: 'tl14', name: 'Roll-on Deodorant', description: '24-hour protection', category: 'toiletries', variant: '50ml' },
  { id: 'tl15', name: 'Body Wash', description: 'Refreshing body wash', category: 'toiletries', variant: '250ml' },
  { id: 'tl16', name: 'Wet Wipes', description: 'Antibacterial wipes', category: 'toiletries', variant: '30 sheets' },
  { id: 'tl17', name: 'Hand Sanitizer', description: 'Instant germ kill', category: 'toiletries', variant: '100ml' },
  { id: 'tl18', name: 'Cotton Pads', description: 'Soft cotton pads', category: 'toiletries', variant: '100 pieces' }
];

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.category === categoryId);
}

export function getCategoryById(categoryId: string): Category | undefined {
  return categories.find(c => c.id === categoryId);
}

export function getFeaturedProducts(): Product[] {
  return [
    products.find(p => p.id === 'bs1'),
    products.find(p => p.id === 'dt1'),
    products.find(p => p.id === 'ho1'),
    products.find(p => p.id === 'sh1'),
    products.find(p => p.id === 'fc1'),
    products.find(p => p.id === 'hw1')
  ].filter(Boolean) as Product[];
}
