import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { BackgroundDecor } from './BackgroundDecor';
import { useSiteConfig } from '../context/SiteConfigContext';
import { categoryService } from '../services/categoryService';
import { Category } from '../types/api';

interface CategoryDisplay {
  name: string;
  image: string;
  gender?: 'women' | 'men';
  category?: string;
  id?: string;
}

function CategoryCard({ category, index }: { category: CategoryDisplay; index: number }) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate using route params the category pages actually support.
    const normalizedCategory = category.category?.toLowerCase();
    const isTopLevelGenderCard =
      !!category.gender && normalizedCategory === category.gender;

    if (isTopLevelGenderCard && category.gender) {
      navigate(`/category/${category.gender}`);
    } else if (category.gender && category.category) {
      navigate(`/category/${category.gender}/${category.category.toLowerCase()}`);
    } else if (category.gender) {
      navigate(`/category/${category.gender}`);
    } else if (category.category) {
      navigate(`/all-products?category=${encodeURIComponent(category.category)}`);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative aspect-[4/5] overflow-hidden block w-full text-left shadow-md hover:shadow-2xl transition-shadow duration-500"
    >
      <motion.img
        src={category.image}
        alt={category.name}
        className="w-full h-full object-cover"
        style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"
        initial={{ opacity: 0.8 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <motion.h3
          className="text-white text-xl md:text-2xl tracking-wide relative"
          initial={{ y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {category.name}
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
          />
        </motion.h3>
      </div>
    </motion.button>
  );
}

export function Categories() {
  const { config } = useSiteConfig();
  const [categories, setCategories] = useState<CategoryDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  // Don't render if shop by category section is disabled
  if (!config.homepage.sections.shopByCategory) {
    return null;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const apiCategories = await categoryService.list();
        const displayCategories: CategoryDisplay[] = [];

        if (apiCategories && apiCategories.length > 0) {
          apiCategories.forEach((cat) => {
            if (cat.name && cat.image) {
              displayCategories.push({
                name: cat.name,
                image: cat.image,
                id: cat.id,
                category: cat.name,
                gender: cat.gender === 'women' ? 'women' : cat.gender === 'men' ? 'men' : undefined,
              });
            }
          });
        }
        setCategories(displayCategories);
      } catch (error) {
        console.error('Failed to fetch categories from API:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section id="categories" className="py-16 md:py-24 relative overflow-hidden bg-background">
        <div className="text-center">Loading categories...</div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Reusable Background Decoration */}
      <BackgroundDecor 
        variant="default"
        showDots={true}
        showLines={true}
        showOrbs={true}
        showGeometric={true}
      />

      {/* Main Content */}
      <div className="relative z-10">
        <div className="w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-12 md:mb-16"
          >
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '3rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-0.5 bg-foreground mx-auto mb-6"
            />
            <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight mb-3">
              Shop by Category
            </h2>
            <p className="text-foreground/60 text-sm md:text-base max-w-2xl mx-auto">
              Explore our diverse collection of premium fashion categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6 px-2 md:px-4">
            {categories.map((category, index) => (
              <CategoryCard key={category.name} category={category} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}