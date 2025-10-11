'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Truck, Shield, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ProductCard from '@/components/ProductCard';
import { supabase } from '@/lib/supabase';
import { fadeInUp, slideInLeft, slideInRight } from '@/lib/animations';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    if (heroRef.current) {
      fadeInUp(heroRef.current.querySelectorAll('.animate-item'), 0);
    }

    const fetchData = async () => {
      const { data: products } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .limit(4);

      const { data: cats } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (products) setFeaturedProducts(products);
      if (cats) setCategories(cats);
    };

    fetchData();
  }, []);

  return (
    <div className="overflow-hidden">
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background pt-20"
      >
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg')] bg-cover bg-center opacity-5"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="animate-item opacity-0">
              <Badge className="gold-gradient px-6 py-2 text-sm font-semibold">
                Crafted with Excellence
              </Badge>
            </div>

            <h1 className="animate-item opacity-0 text-5xl md:text-7xl font-bold leading-tight">
              Timeless Elegance in{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Premium Wood
              </span>
            </h1>

            <p className="animate-item opacity-0 text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover handcrafted furniture that transforms your space into a
              sanctuary of luxury and comfort. Each piece tells a story of
              masterful craftsmanship.
            </p>

            <div className="animate-item opacity-0 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="gold-gradient text-lg px-8 py-6 hover:opacity-90 transition-opacity group"
                asChild
              >
                <Link href="/products">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                asChild
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </div>

            <div className="animate-item opacity-0 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-8">
              <FeatureCard
                icon={<Truck className="h-8 w-8" />}
                title="Free Delivery"
                description="On orders over $1,000"
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8" />}
                title="Quality Guarantee"
                description="Lifetime craftsmanship warranty"
              />
              <FeatureCard
                icon={<Award className="h-8 w-8" />}
                title="Premium Materials"
                description="Sustainably sourced wood"
              />
            </div>
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="py-24 bg-card/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Shop by Category
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find the perfect furniture for every room in your home
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {featuredProducts.length > 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center space-x-2 text-accent">
                <Sparkles className="h-6 w-6" />
                <span className="text-sm font-semibold uppercase tracking-wider">
                  Featured Collection
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                Signature Pieces
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Handpicked selections that embody luxury and craftsmanship
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
                asChild
              >
                <Link href="/products">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      <section className="py-24 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Crafted for Generations
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every piece of Royalwood furniture is meticulously handcrafted by
              master artisans using time-honored techniques. We source only the
              finest sustainable hardwoods, ensuring your furniture will be
              treasured for generations to come.
            </p>
            <Button
              size="lg"
              className="gold-gradient text-lg px-8 py-6"
              asChild
            >
              <Link href="/about">
                Our Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 text-center space-y-3 glass-effect hover:shadow-xl transition-shadow duration-300">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/20 text-accent">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

function CategoryCard({ category, index }: { category: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      fadeInUp(cardRef.current, index * 100);
    }
  }, [index]);

  return (
    <Link href={`/categories/${category.slug}`}>
      <Card
        ref={cardRef}
        className="group relative overflow-hidden aspect-[4/3] opacity-0 hover:shadow-2xl transition-all duration-500"
      >
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${category.image_url})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-white/80">{category.description}</p>
        </div>
      </Card>
    </Link>
  );
}

function Badge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`inline-block rounded-full ${className || 'bg-accent text-accent-foreground'}`}
    >
      {children}
    </div>
  );
}
