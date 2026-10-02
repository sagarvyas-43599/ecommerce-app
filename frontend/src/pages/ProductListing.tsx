import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { ProductService } from '../services/ecommerce.service';
import type { IProduct, ICategory } from '../types';
import { ProductCard } from '../components/ProductCard';

export const ProductListing: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = { sort, limit: 100 };
      if (search) params.search = search;
      if (category) params.category = category;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await ProductService.getProducts(params);
      if (res?.data) {
        setProducts(res.data);
      }
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ProductService.getCategories().then((res) => {
      if (res?.data) setCategories(res.data);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const handleCategoryChange = (slug: string) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('category', slug);
    else params.delete('category');
    params.set('page', '1');
    setSearchParams(params);
  };

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', newSort);
    setSearchParams(params);
  };

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '30px 20px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800 }}>
            {search ? (
              <span>Search results for: <span style={{ color: 'var(--primary)' }}>"{search}"</span></span>
            ) : category ? (
              `${category.toUpperCase()} Catalog`
            ) : (
              'Explore All Products'
            )}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Showing {products.length} {products.length === 1 ? 'product' : 'premium products'}
            </p>
            {search && (
              <button
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.delete('search');
                  setSearchParams(params);
                }}
                className="badge badge-primary"
                style={{ cursor: 'pointer', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid var(--primary)', color: '#fff' }}
              >
                Clear Search ✕
              </button>
            )}
          </div>
        </div>

        {/* Sort dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ArrowUpDown size={18} color="var(--text-muted)" />
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            style={{
              background: 'var(--bg-input)',
              color: 'var(--text-main)',
              border: '1px solid var(--border-color)',
              padding: '10px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.9rem',
            }}
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 30 }} className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="glass-panel" style={{ padding: 24, height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontWeight: 700, fontSize: '1.1rem' }}>
            <SlidersHorizontal size={20} color="var(--primary)" /> Filters
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: 10, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Categories
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => handleCategoryChange('')}
                style={{
                  textAlign: 'left',
                  background: !category ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: !category ? 'var(--primary)' : 'var(--text-main)',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9rem',
                  fontWeight: !category ? 700 : 500,
                }}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCategoryChange(c.slug)}
                  style={{
                    textAlign: 'left',
                    background: category === c.slug ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    color: category === c.slug ? 'var(--primary)' : 'var(--text-main)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                    fontWeight: category === c.slug ? 700 : 500,
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="glass-panel" style={{ textAlign: 'center', padding: 80 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search criteria.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 24,
            }}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
