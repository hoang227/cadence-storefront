import {Suspense, useEffect, useState} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {Menu, Search, ShoppingBag, User} from 'lucide-react';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const {type: asideType} = useAside();

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      '--announcement-height',
      isScrolled ? '0px' : '40px',
    );
    root.style.setProperty('--header-height', isScrolled ? '64px' : '80px');

    const handleScroll = () => {
      if (asideType !== 'closed') return;

      const currentScrollY = window.scrollY;

      setIsScrollingUp(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);

      setIsScrolled(currentScrollY > 0);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isScrolled, asideType]);

  return (
    <div className="fixed w-full z-40 transition-transform duration-500 ease-in-out translate-y-0">
      {/** Announcement bar */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out bg-brand-navy text-white
          ${isScrolled ? 'max-h-0' : 'max-h-12'}`}
      >
        <div className="container mx-auto text-center py-2.5 px-4">
          <p className="font-source text-[13px] leading-tight sm:text-sm font-light tracking-wider">
            Complimentary Shipping on orders above $500
          </p>
        </div>
      </div>

      {/** Main header */}
      <header
        className={`transition-all duration-500 ease-in-out border-b 
          ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-transparent' : 'bg-white border-gray-100'}`}
      >
        <div className="container mx-auto">
          {/** Mobile Logo (550px and below) */}
          <div
            className={`hidden max-[550px]:block text-center border-b 
              border-gray-100 transition-all duration-300 ease-in-out ${isScrolled ? 'py-1' : 'py-2'}`}
          >
            <NavLink
              prefetch="intent"
              to="/"
              className="font-playfair text-2xl tracking-normal inline-block"
            >
              <h1 className="font-medium my-0 ">CADENCE</h1>
            </NavLink>
          </div>

          {/** Header Content */}
          <div
            className={`flex items-center justify-between px-4 sm:px-6 transition-all duration-300 ease-in-out 
              ${isScrolled ? 'py-3 sm:py-4' : 'py-4 sm:py-6'}`}
          >
            {/** Mobile Menu Toggle */}
            <div className="lg:hidden ">
              <HeaderMenuMobileToggle />
            </div>

            {/** Logo (Above 550px) */}
            <NavLink
              prefetch="intent"
              to="/"
              className={`font-playfair tracking-wider text-center max-[550px]:hidden 
                absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 lg:text-left
                transition-all duration-300 ease-in-out ${isScrolled ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[28px'}`}
            >
              <h1 className="font-medium">CADENCE</h1>
            </NavLink>

            {/** Desktop Navigation */}
            <div className="hidden lg:block flex-1-px-12">
              <HeaderMenu
                menu={menu}
                viewport="desktop"
                primaryDomainUrl={header.shop.primaryDomain.url}
                publicStoreDomain={publicStoreDomain}
              />
            </div>

            {/** CTAS */}
            <div className="flex items-center">
              <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const {close} = useAside();

  const baseClassName =
    'transition-all duration-200 hover:text-brand-gold font-source relative after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-1 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full';
  const desktopClassName =
    'flex items-center justify-center space-x-12 text-sm uppercase tracking-wider';
  const mobileClassName = 'flex flex-col px-6';

  return (
    <nav
      className={viewport === 'desktop' ? desktopClassName : mobileClassName}
      role="navigation"
    >
      {viewport === 'mobile' && (
        <>
          {/** Mobile Navigation Links */}
          <div className="space-y-6 py-4">
            {menu?.items.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) || // cadence.com/collections
                item.url.includes(primaryDomainUrl) // store.cadence.com/collections
                  ? new URL(item.url).pathname // --> collections
                  : item.url; // google.com ?

              return (
                <NavLink
                  className={({isActive}) =>
                    `${baseClassName} text-lg py-2 block
                  ${isActive ? 'text-brand-gold' : 'text-brand-navy'}`
                  }
                  end // /product/boot --> /products NOT ACTIVE
                  key={item.id}
                  onClick={close}
                  prefetch="intent"
                  to={url}
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>

          {/** Mobile Footer Links */}
          <div className="mt-auto border-t border-gray-100 py-6">
            <div className="space-y-4">
              <NavLink
                to="/account"
                className="flex items-center space-x-2 text-brand-navy hover:text-brand-gold"
              >
                <User className="w-5 h-5" />
                <span className="font-source text-base">Account</span>
              </NavLink>

              <button
                onClick={() => {
                  close();

                  // todo search logic
                }}
                className="flex items-center space-x-2 text-brand-navy hover:text-brand-gold w-full text-left"
              >
                <Search className="w-5 h-5" />
                <span className="font-source text-base">Account</span>
              </button>
            </div>
          </div>
        </>
      )}

      {viewport === 'desktop' &&
        // Desktop menu
        menu?.items.map((item) => {
          if (!item.url) return null;
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) || // cadence.com/collections
            item.url.includes(primaryDomainUrl) // store.cadence.com/collections
              ? new URL(item.url).pathname // --> collections
              : item.url; // google.com ?

          return (
            <NavLink
              className={({isActive}) =>
                `${baseClassName} ${isActive ? 'text-brand-gold' : 'text-brand-navy'}`
              }
              end // /product/boot --> /products NOT ACTIVE
              key={item.id}
              onClick={close}
              prefetch="intent"
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav
      className="flex items-center space-x-2 sm:space-x-3 lg:space-x-8"
      role="navigation"
    >
      <SearchToggle />
      <NavLink
        prefetch="intent"
        to="/account"
        className='hover:text-brand-gold transition-colors duration-200 p-2 relative after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full'
      >
        <span className="sr-only">Account</span>
        <User className="w-5 h-5 " />
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="p-2 -ml-2 hover:text-brand-gold transition-colors duration-200"
      onClick={() => open('mobile')}
    >
      <Menu className="w-6 h-6" />
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button
      className='p-2 hover:text-brand-gold transition-colors duration-200 relative after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full'
      onClick={() => open('search')}
    >
      <Search className="w-5 h-5" />
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      className='relative p-2 hover:text-brand-gold transition-colors duration-200 after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[1px] after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full'
      onClick={() => {
        open('cart');
        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        });
      }}
    >
      <ShoppingBag className="w-5 h-5" />
      {count !== null && count > 0 && (
        <span className="absolute top-1 right-1 bg-brand-gold text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}
