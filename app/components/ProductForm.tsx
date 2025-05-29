import {Link, useNavigate} from 'react-router';
import {
  RichText,
  VariantSelector,
  type MappedProductOptions,
} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  product,
  productOptions,
  selectedVariant,
  className,
}: {
  product: ProductFragment;
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  className?: string;
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="space-y-8">
        {/** Variant Options */}
        {productOptions.map((option) => {
          if (option.optionValues.length === 1) return null;
          return (
            <div className="product-options" key={option.name}>
              <h5>{option.name}</h5>
              <div className="product-options-grid">
                {option.optionValues.map((value) => {
                  const {
                    name,
                    handle,
                    variantUriQuery,
                    selected,
                    available,
                    exists,
                    isDifferentProduct,
                    swatch,
                  } = value;

                  if (isDifferentProduct) {
                    // SEO
                    // When the variant is a combined listing child product
                    // that leads to a different url, we need to render it
                    // as an anchor tag
                    return (
                      <Link
                        className="product-options-item"
                        key={option.name + name}
                        prefetch="intent"
                        preventScrollReset
                        replace
                        to={`/products/${handle}?${variantUriQuery}`}
                        style={{
                          border: selected
                            ? '1px solid black'
                            : '1px solid transparent',
                          opacity: available ? 1 : 0.3,
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </Link>
                    );
                  } else {
                    // SEO
                    // When the variant is an update to the search param,
                    // render it as a button with javascript navigating to
                    // the variant so that SEO bots do not index these as
                    // duplicated links
                    return (
                      <button
                        type="button"
                        className={`product-options-item${
                          exists && !selected ? ' link' : ''
                        }`}
                        key={option.name + name}
                        style={{
                          border: selected
                            ? '1px solid black'
                            : '1px solid transparent',
                          opacity: available ? 1 : 0.3,
                        }}
                        disabled={!exists}
                        onClick={() => {
                          if (!selected) {
                            navigate(`?${variantUriQuery}`, {
                              replace: true,
                              preventScrollReset: true,
                            });
                          }
                        }}
                      >
                        <ProductOptionSwatch swatch={swatch} name={name} />
                      </button>
                    );
                  }
                })}
              </div>
              <br />
            </div>
          );
        })}

        {/** Add to Cart Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-source text-brand-navy/60">
              {selectedVariant?.availableForSale
                ? 'Ready to ship'
                : 'Currently unavailable'}
            </div>
            {selectedVariant?.sku && (
              <div className="text-sm font-source text-brand-navy/60">
                SKU: {selectedVariant.sku}
              </div>
            )}
          </div>
          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            afterAddToCart={() => {
              open('cart');
            }}
            lines={
              selectedVariant
                ? [
                    {
                      merchandiseId: selectedVariant.id,
                      quantity: 1,
                      selectedVariant,
                    },
                  ]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold out'}
          </AddToCartButton>
        </div>

        {/** Product Details Accordion */}
        <div className="mt-12 border-t border-brand-navy/10">
          <div className="grid grid-cols-1 divide-y divide-brand-navy/10">
            {/** Materials Section */}
            {product.materials?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Materials & Construction
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">
                    <svg
                      className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <RichText data={product.materials?.value} />
                  {product.construction?.value && (
                    <div className="mt-4">
                      <h4 className="font-playfair text-base text-brand-navy">
                        Construction
                      </h4>
                      <p>{product.construction.value}</p>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/** Size & Fit Section */}
            {product.sizingNotes?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Size & Fit
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">
                    <svg
                      className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <p>{product.sizingNotes.value}</p>
                </div>
              </details>
            )}

            {/** Care Instructions */}
            {product.careInstructions?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Care Guide
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">
                    <svg
                      className="absolute inset-0 w-4 h-4 transition duration-300 group-open:rotate-180"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <RichText data={product.careInstructions.value} />
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}
