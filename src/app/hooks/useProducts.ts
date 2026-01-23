import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types/api';

export const useProducts = (params?: {
  limit?: number;
  skip?: number;
  category?: string;
  gender?: string;
  on_sale?: boolean;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  sort?: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productService.list(params);
      setProducts(response.data || response.products || []);
      setTotal(response.total || 0);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [params?.limit, params?.skip, params?.category, params?.gender, params?.on_sale, params?.featured, params?.min_price, params?.max_price, params?.sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, total, loading, error, refetch: fetchProducts };
};

export const useFeaturedProducts = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getFeatured(limit);
        setProducts(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch featured products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [limit]);

  return { products, loading, error };
};

export const useNewArrivals = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getNewArrivals(limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch new arrivals');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [limit]);

  return { products, loading, error };
};

export const useOnSaleProducts = (limit: number = 10) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOnSale = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getOnSale(limit);
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch on-sale products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOnSale();
  }, [limit]);

  return { products, loading, error };
};

export const useProduct = (id: string) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    // Validate ObjectID format (24 character hex string)
    const isValidObjectID = /^[0-9a-fA-F]{24}$/.test(id);
    if (!isValidObjectID) {
      setError('Invalid product ID format. Expected MongoDB ObjectID (24 hex characters).');
      setProduct(null);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);
        setProduct(data);
      } catch (err: any) {
        // Suppress 400 errors (invalid ID format) as we already validated
        if (err?.response?.status === 400) {
          setError('Invalid product ID format');
        } else {
          setError(err.message || 'Failed to fetch product');
        }
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};
