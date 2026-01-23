import { Product } from '../types/product';

// Gender-specific categories
export const categoriesByGender: Record<'all' | 'women' | 'men', string[]> = {
  all: ['All', 'Tops', 'Dresses', 'Pants', 'Skirts', 'Sweaters', 'Outerwear', 'Denim', 'Accessories', 'Jewelry', 'Beauty', 'Footwear'],
  women: ['All', 'Tops', 'Dresses', 'Pants', 'Skirts', 'Sweaters', 'Outerwear', 'Denim', 'Accessories', 'Jewelry', 'Beauty', 'Footwear'],
  men: ['All', 'Shirts', 'Pants', 'Sweaters', 'Denim', 'Outerwear', 'Footwear', 'Accessories'],
};

export const categories = categoriesByGender.all;

// Color mapping for visual display
export const colorMap: { [key: string]: string } = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Navy': '#001F3F',
  'Grey': '#808080',
  'Gray': '#808080',
  'Beige': '#F5F5DC',
  'Brown': '#8B4513',
  'Camel': '#C19A6B',
  'Red': '#FF0000',
  'Burgundy': '#800020',
  'Pink': '#FFC0CB',
  'Blush': '#FFB6C1',
  'Blue': '#0000FF',
  'Green': '#008000',
  'Olive': '#808000',
  'Yellow': '#FFFF00',
  'Orange': '#FFA500',
  'Purple': '#800080',
  'Cream': '#FFFDD0',
  'Tan': '#D2B48C',
  'Charcoal': '#36454F',
  'Ivory': '#FFFFF0',
  'Light Blue': '#ADD8E6',
  'Dark Wash': '#1C2841',
  'Light Wash': '#8DA9C4',
  'Nude': '#E3BC9A',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Clear': '#F0F0F0',
  'Amber': '#FFBF00',
  'Multi': '#E0E0E0',
  'Natural Beige': '#D4C5B9',
  'White Gold': '#F5F5F5',
  'Emerald': '#50C878',
  'Indigo': '#4B0082',
};

// These will be populated from API - using static defaults for now
// In a real app, these would be fetched from the API or computed from products
export const allColors: string[] = [];
export const allSizes: string[] = [];
export const allMaterials: string[] = [];
export const allSubcategories: string[] = [];

// Helper function to extract filter options from products array
export const extractFilterOptions = (products: Product[]) => {
  const colors = Array.from(new Set(products.flatMap(p => p.colors || []))).sort();
  const sizes = Array.from(new Set(products.flatMap(p => p.sizes || []))).sort((a, b) => {
    const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'];
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return parseInt(a) - parseInt(b);
  });
  const materials = Array.from(new Set(products.map(p => p.material).filter(Boolean))).sort();
  const subcategories = Array.from(new Set(products.map(p => p.subcategory).filter(Boolean))).sort();
  
  return { colors, sizes, materials, subcategories };
};

// Get subcategories for a specific category and gender
// Can be called with products array or without (backward compatible)
export const getSubcategoriesForCategory = (
  productsOrCategory: Product[] | string, 
  categoryOrGender?: string, 
  gender?: 'all' | 'women' | 'men'
): string[] => {
  // Handle backward compatibility: if first param is string, it's the old signature
  if (typeof productsOrCategory === 'string') {
    // Old signature: getSubcategoriesForCategory(category, gender)
    // Return empty array since we don't have products
    return [];
  }
  
  // New signature: getSubcategoriesForCategory(products, category, gender)
  const products = productsOrCategory as Product[];
  const category = categoryOrGender || 'All';
  const genderFilter = gender || 'all';
  
  // Ensure products is an array
  if (!Array.isArray(products)) {
    return [];
  }
  
  let filtered = [...products];
  
  // Filter by gender first
  if (genderFilter !== 'all') {
    filtered = filtered.filter(p => p.gender === genderFilter || p.gender === 'unisex');
  }
  
  // Then filter by category if not 'All'
  if (category !== 'All') {
    filtered = filtered.filter(p => p.category === category);
  }
  
  return Array.from(
    new Set(filtered.map(p => p.subcategory).filter(Boolean))
  ).sort();
};

export const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Best Rating', value: 'rating' },
];