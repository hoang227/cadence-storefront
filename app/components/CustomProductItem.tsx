import {Image, Money} from '@shopify/hydrogen';
import {ArrowRight} from 'lucide-react';
import React from 'react';
import {Link} from 'react-router';
import {
  CollectionItemFragment,
  ProductItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

type CustomProductItemProps = {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  hidePrice?: boolean;
};

const CustomProductItem = ({
  product,
  loading,
  hidePrice,
}: CustomProductItemProps) => {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant?.selectedOptions);
  const firstImage = product.featuredImage;
  const secondImage = product.images?.nodes?.[1];

  return (
    <Link
      key={product.id}
      className="group block relative"
      prefetch="intent"
      to={variantUrl}
    >
      {/** Image Container with hover effects */}
      <div className="group relative aspect-square overflow-hidden bg-brand-cream mb-6">
        {firstImage && (
          <>
            <Image
              alt={firstImage.altText || product.title}
              data={firstImage}
              className="w-full h-full object-cover opacity-100 transition-opacity duration-500
              group-hover:opacity-0"
              loading={loading}
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            />
            {secondImage && (
              <Image
                alt={secondImage.altText || `${product.title} - Second Image`}
                data={secondImage}
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500
              group-hover:opacity-100"
                loading={loading}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            )}
            {/** Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 ease-out"></div>

            {/** Quick View Button */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
              <div className="bg-white/90 backdrop-blur-sm py-3 px-4 text-center">
                <span className="font-source text-sm font-medium text-brand-navy tracking-wide">
                  View Details
                </span>
              </div>
            </div>
          </>
        )}

        {/** Corner accents */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/** Product Information */}
      <div className="relative">
        <h4 className="font-playfair text-lg text-brand-navy mb-2 group-hover:text-brand-gold transition-colors duration-500">
          {product.title}
        </h4>
        <div className="flex justify-between items-baseline">
          {!hidePrice && (
            <Money
              data={product.priceRange.maxVariantPrice}
              className="font-source text-gray-600 group-hover:text-brand-navy transition-colors duration-500"
            />
          )}
          <span className="flex items-center font-source text-sm text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            Explore
            <ArrowRight className="ml-1 w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CustomProductItem;
