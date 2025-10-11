'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { scaleIn } from '@/lib/animations';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price?: number | null;
    images: string[];
    in_stock: boolean;
    featured: boolean;
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      scaleIn(cardRef.current, index * 100);
    }
  }, [index]);

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) *
          100
      )
    : 0;

  return (
    <Card
      ref={cardRef}
      className="group overflow-hidden opacity-0 hover:shadow-2xl transition-all duration-500"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {product.featured && (
            <Badge className="absolute top-4 left-4 gold-gradient text-primary-foreground">
              Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground">
              -{discount}%
            </Badge>
          )}
          {!product.in_stock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="p-6 space-y-3">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-lg group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
              {product.compare_at_price && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.compare_at_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <Button
            size="icon"
            className="rounded-full gold-gradient hover:opacity-90 transition-opacity"
            disabled={!product.in_stock}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
