import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/cart/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useRef} from 'react';
import {FetcherWithComponents} from 'react-router';
import {CreditCard, Gift} from 'lucide-react';
import CartDiscounts from './CartDiscounts';
import CartGiftCard from './CartGiftCard';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  return (
    <div className="bg-white px-6 py-8">
      {/** Subtotal */}
      <div className="flex items-center justify-between mb-4">
        <span className="font-source text-gray-600">Subtotal</span>
      </div>
      <span className="font-source font-medium">
        {cart.cost?.subtotalAmount ? (
          <Money data={cart.cost.subtotalAmount} />
        ) : (
          '-'
        )}
      </span>

      {/** Discounts */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/** Gift Cards */}
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

      {/** Checkout Button */}
      {/** Extra Information */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Gift className="w-4 h-4" />
          <span>Complimentary gift wrapping available</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CreditCard className="w-4 h-4" />
          <span>Secure checkout powered by Spotify</span>
        </div>
      </div>
    </div>
  );
}
function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}
