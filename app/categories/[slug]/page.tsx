'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [params.slug]);

  const fetchData = async () => {
    const { data: cat } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', params.slug)
      .maybeSingle();

    if (cat) {
      setCategory(cat);

      const { data: prods } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', cat.id);

      if (prods) setProducts(prods);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-[400px] bg-muted rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Category not found</h1>
          <Button asChild>
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">{category.name}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {category.description}
          </p>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-muted-foreground">
              No products in this category yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
