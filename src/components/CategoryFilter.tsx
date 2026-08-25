import React from 'react';
import { Sparkles, Flame, SlidersHorizontal } from 'lucide-react';
import { Category, CategoryItem } from '../types';
import { getEnglishCategoryName } from '../lib/translations';

interface CategoryFilterProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  categories?: CategoryItem[];
  totalProductsCount: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating') => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  activeCategory,
  onSelectCategory,
  categories = [],
  totalProductsCount,
  sortBy,
  onSortChange,
}) => {
  const activeCategories = categories.filter((c) => c.isActive !== false);

  return (
    <div id="products-section" className="border-b border-neutral-200 bg-white sticky top-16 sm:top-20 z-30 font-brand" dir="ltr">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Categories Horizontal Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {/* All Products */}
            <button
              onClick={() => onSelectCategory('all')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              All Products
            </button>

            {/* New In */}
            <button
              onClick={() => onSelectCategory('new')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'new'
                  ? 'bg-black text-white'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New Arrivals</span>
            </button>

            {/* Dynamic Categories from DB */}
            {activeCategories.map((cat) => {
              const isSelected = activeCategory === cat.slug;
              const displayName = cat.nameEn || getEnglishCategoryName(cat.name, cat.slug);
              return (
                <button
                  key={cat.id || cat.slug}
                  onClick={() => onSelectCategory(cat.slug)}
                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {displayName}
                </button>
              );
            })}

            {/* Sale */}
            <button
              onClick={() => onSelectCategory('sale')}
              className={`px-4 py-2 text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                activeCategory === 'sale'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Sale 🔥</span>
            </button>
          </div>

          {/* Right side: Count & Sort */}
          <div className="flex items-center justify-between md:justify-end gap-4 text-xs">
            <span className="text-neutral-500 whitespace-nowrap">
              Showing <strong className="text-black font-semibold">{totalProductsCount}</strong> items
            </span>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value as any)}
                className="bg-neutral-50 border border-neutral-200 text-neutral-900 text-xs px-2.5 py-1.5 font-medium focus:outline-none focus:border-black cursor-pointer"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
