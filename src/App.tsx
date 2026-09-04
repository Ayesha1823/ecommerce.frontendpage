import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Menu,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react';

type Category = 'All' | 'Electronics' | 'Fashion' | 'Shoes' | 'Accessories' | 'Home & Living';
type Page = 'home' | 'products' | 'details' | 'cart' | 'checkout' | 'confirmation';

type Product = {
  id: number;
  name: string;
  category: Exclude<Category, 'All'>;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  description: string;
  stock: number;
  badge?: string;
};

type CartItem = { product: Product; quantity: number };

const products: Product[] = [
  { id: 1, name: 'Aero Wireless Headphones', category: 'Electronics', price: 129, originalPrice: 159, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.9, reviews: 128, description: 'Immerse yourself in rich, balanced sound with plush memory-foam cushions and a 30-hour battery.', stock: 12, badge: 'Best seller' },
  { id: 2, name: 'Luna Leather Tote', category: 'Accessories', price: 88, originalPrice: 110, image: 'https://images.pexels.com/photos/1744651/pexels-photo-1744651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.8, reviews: 84, description: 'A considered everyday tote in smooth leather with room for everything you carry.', stock: 8, badge: '20% off' },
  { id: 3, name: 'Cloudline Sneakers', category: 'Shoes', price: 96, image: 'https://images.pexels.com/photos/27204251/pexels-photo-27204251.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.7, reviews: 216, description: 'Featherlight everyday sneakers designed with a cushioned sole and breathable knit upper.', stock: 18, badge: 'New' },
  { id: 4, name: 'Sol Ceramic Vase', category: 'Home & Living', price: 42, image: 'https://images.pexels.com/photos/29904622/pexels-photo-29904622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.6, reviews: 52, description: 'A sculptural ceramic accent that brings soft, sun-washed warmth to a shelf or table.', stock: 24 },
  { id: 5, name: 'Cove Travel Sunglasses', category: 'Accessories', price: 54, originalPrice: 69, image: 'https://images.pexels.com/photos/9267586/pexels-photo-9267586.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.8, reviews: 72, description: 'Classic rounded frames with UV400 protection and a lightweight, easy-going feel.', stock: 16 },
  { id: 6, name: 'Studio Desk Speaker', category: 'Electronics', price: 79, image: 'https://images.pexels.com/photos/18311089/pexels-photo-18311089.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.5, reviews: 39, description: 'Compact, room-filling audio with a calm design made for your creative corner.', stock: 10 },
  { id: 7, name: 'Form Abstract Sculpture', category: 'Home & Living', price: 64, image: 'https://images.pexels.com/photos/32541183/pexels-photo-32541183.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.9, reviews: 31, description: 'A tactile shelf sculpture with a contemporary silhouette and a matte stone finish.', stock: 7 },
  { id: 8, name: 'Everyday Canvas Low', category: 'Shoes', price: 72, originalPrice: 89, image: 'https://images.pexels.com/photos/11513443/pexels-photo-11513443.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.6, reviews: 103, description: 'The low-profile canvas staple that pairs with everything and goes anywhere.', stock: 21, badge: '20% off' },
  { id: 9, name: 'Haven Ribbed Throw', category: 'Home & Living', price: 58, image: 'https://images.pexels.com/photos/5793641/pexels-photo-5793641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.7, reviews: 44, description: 'A soft, textured layer for slow mornings, cool evenings and relaxed rooms.', stock: 14 },
  { id: 10, name: 'Arc Essential Wallet', category: 'Accessories', price: 38, image: 'https://images.pexels.com/photos/8062369/pexels-photo-8062369.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.5, reviews: 67, description: 'A slim leather wallet with considered pockets for your daily essentials.', stock: 30 },
  { id: 11, name: 'Breeze Knit Runner', category: 'Shoes', price: 110, image: 'https://images.pexels.com/photos/27008322/pexels-photo-27008322.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.8, reviews: 95, description: 'Responsive comfort with a streamlined knit upper, made for movement all day.', stock: 11 },
  { id: 12, name: 'Milo Lounge Lamp', category: 'Home & Living', price: 74, image: 'https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', rating: 4.6, reviews: 28, description: 'Warm, ambient light in a softly curved ceramic form for a calmer home.', stock: 9 },
];

const categories: { label: Exclude<Category, 'All'>; image: string }[] = [
  { label: 'Electronics', image: products[0].image },
  { label: 'Fashion', image: products[1].image },
  { label: 'Shoes', image: products[2].image },
  { label: 'Accessories', image: products[4].image },
  { label: 'Home & Living', image: products[3].image },
];

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[0]);
  const [category, setCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [cart, setCart] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('maison-cart') || '[]') as CartItem[]; } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  useEffect(() => { localStorage.setItem('maison-cart', JSON.stringify(cart)); }, [cart]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesCategory = category === 'All' || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || product.category.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
    if (sort === 'price-low') return [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-high') return [...result].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [category, search, sort]);

  const navigate = (nextPage: Page) => { setPage(nextPage); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const openProduct = (product: Product) => { setSelectedProduct(product); navigate('details'); };
  const addToCart = (product: Product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find((item) => item.product.id === product.id);
      if (existing) return current.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item);
      return [...current, { product, quantity }];
    });
  };
  const updateQuantity = (id: number, amount: number) => setCart((current) => current.map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, Math.min(item.quantity + amount, item.product.stock)) } : item).filter((item) => item.quantity > 0));
  const toggleWishlist = (id: number) => setWishlist((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="app-shell">
      <div className="announcement"><Sparkles size={14} /> Free shipping on orders over $75 <span>•</span> Easy 30-day returns</div>
      <header className="site-header">
        <div className="header-inner">
          <button className="mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open menu"><Menu size={22} /></button>
          <button className="brand" onClick={() => navigate('home')}><span className="brand-mark">M</span><span>maison</span></button>
          <nav className={mobileOpen ? 'main-nav mobile-visible' : 'main-nav'}>
            <button className={page === 'home' ? 'active' : ''} onClick={() => navigate('home')}>Home</button>
            <button className={page === 'products' ? 'active' : ''} onClick={() => navigate('products')}>Shop all</button>
            <button onClick={() => { setCategory('Fashion'); navigate('products'); }}>Collections</button>
            <button onClick={() => { setCategory('Home & Living'); navigate('products'); }}>Home & living</button>
          </nav>
          <div className="header-actions">
            <label className="search-box"><Search size={17} /><input value={search} onChange={(event) => { setSearch(event.target.value); if (page !== 'products') setPage('products'); }} placeholder="Search products" /></label>
            <button className="icon-button wishlist-button" onClick={() => setWishlist([])} aria-label="Wishlist"><Heart size={20} fill={wishlist.length ? 'currentColor' : 'none'} /><span>{wishlist.length}</span></button>
            <button className="icon-button bag-button" onClick={() => navigate('cart')} aria-label="Shopping bag"><ShoppingBag size={20} /><span>{cartCount}</span></button>
          </div>
        </div>
      </header>

      {page === 'home' && <HomePage navigate={navigate} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
      {page === 'products' && <ProductsPage products={filteredProducts} category={category} setCategory={setCategory} sort={sort} setSort={setSort} search={search} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
      {page === 'details' && <ProductDetails product={selectedProduct} addToCart={addToCart} openProduct={openProduct} navigate={navigate} toggleWishlist={toggleWishlist} wishlist={wishlist} />}
      {page === 'cart' && <CartPage cart={cart} subtotal={subtotal} updateQuantity={updateQuantity} navigate={navigate} openProduct={openProduct} />}
      {page === 'checkout' && <CheckoutPage cart={cart} subtotal={subtotal} navigate={navigate} setOrderNumber={setOrderNumber} />}
      {page === 'confirmation' && <ConfirmationPage orderNumber={orderNumber} cart={cart} subtotal={subtotal} navigate={navigate} />}

      <footer className="footer"><div className="footer-grid"><div><button className="brand footer-brand" onClick={() => navigate('home')}><span className="brand-mark">M</span><span>maison</span></button><p>Thoughtful goods for everyday living.<br />Designed to bring a little more joy.</p></div><div><strong>Shop</strong><button onClick={() => navigate('products')}>All products</button><button onClick={() => { setCategory('Electronics'); navigate('products'); }}>Electronics</button><button onClick={() => { setCategory('Home & Living'); navigate('products'); }}>Home & living</button></div><div><strong>Help</strong><button>Shipping & returns</button><button>Contact us</button><button>FAQ</button></div><div><strong>Stay in the know</strong><p>Get first access to new drops and considered offers.</p><label className="newsletter"><input placeholder="Your email address" /><button aria-label="Subscribe"><ArrowRight size={17} /></button></label></div></div><div className="footer-bottom"><span>© 2024 maison. All rights reserved.</span><span>Secure checkout · Carefully packed</span></div></footer>
    </div>
  );
}

function HomePage({ navigate, openProduct, addToCart, toggleWishlist, wishlist }: { navigate: (page: Page) => void; openProduct: (product: Product) => void; addToCart: (product: Product) => void; toggleWishlist: (id: number) => void; wishlist: number[] }) {
  return <main>
    <section className="hero"><div className="hero-copy"><p className="eyebrow"><Zap size={14} /> The everyday edit</p><h1>Good things,<br /><em>beautifully</em> chosen.</h1><p className="hero-text">A considered collection of pieces that make daily rituals feel a little more special.</p><button className="button button-dark" onClick={() => navigate('products')}>Shop the collection <ArrowRight size={17} /></button><div className="hero-note"><span className="avatars"><i /><i /><i /></span><span>Loved by 12,000+ mindful shoppers</span></div></div><div className="hero-image"><img src="https://images.pexels.com/photos/3682236/pexels-photo-3682236.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Curated everyday accessories" /><div className="hero-card"><span>01 / 04</span><strong>Objects with<br />intention</strong><button onClick={() => openProduct(products[1])}>Explore edit <ArrowUpRightIcon /></button></div></div></section>
    <section className="trust-strip"><div><Truck size={20} /><span><strong>Free shipping</strong> On orders over $75</span></div><div><Package size={20} /><span><strong>30-day returns</strong> No questions asked</span></div><div><Sparkles size={20} /><span><strong>Thoughtfully packed</strong> Ready to gift</span></div></section>
    <section className="section featured-section"><div className="section-heading"><div><p className="eyebrow">Just in</p><h2>Curated for you</h2></div><button className="text-button" onClick={() => navigate('products')}>View all <ArrowRight size={16} /></button></div><div className="product-grid four">{products.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />)}</div></section>
    <section className="category-section"><div className="section-heading"><div><p className="eyebrow">Shop by mood</p><h2>Find your next favourite</h2></div></div><div className="category-grid">{categories.map((item) => <button key={item.label} className="category-card" onClick={() => navigate('products')}><img src={item.image} alt={item.label} /><span>{item.label}</span><ArrowRight size={17} /></button>)}</div></section>
    <section className="editorial"><div className="editorial-image"><img src="https://images.pexels.com/photos/29904622/pexels-photo-29904622.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" alt="Warm ceramic homeware" /></div><div className="editorial-copy"><p className="eyebrow">The maison standard</p><h2>Less, but<br /><em>better.</em></h2><p>We look for the quiet details: the good weight in your hand, the texture that gets better with time, the design that earns its place.</p><button className="button button-outline" onClick={() => navigate('products')}>Our point of view <ArrowRight size={17} /></button></div></section>
    <section className="section featured-section"><div className="section-heading"><div><p className="eyebrow">From the journal</p><h2>Notes for living well</h2></div><button className="text-button">Read the journal <ArrowRight size={16} /></button></div><div className="journal-grid"><article><img src={products[8].image} alt="A warm home interior" /><p className="eyebrow">At home · 04 min read</p><h3>The art of making space for slow</h3></article><article><img src={products[5].image} alt="A creative desk setup" /><p className="eyebrow">In focus · 03 min read</p><h3>Small upgrades, big everyday energy</h3></article><article><img src={products[4].image} alt="Everyday accessories" /><p className="eyebrow">The edit · 05 min read</p><h3>Five things we are carrying into summer</h3></article></div></section>
  </main>;
}

function ProductCard({ product, openProduct, addToCart, toggleWishlist, isWishlisted }: { product: Product; openProduct: (product: Product) => void; addToCart: (product: Product) => void; toggleWishlist: (id: number) => void; isWishlisted: boolean }) {
  return <article className="product-card"><div className="product-image" onClick={() => openProduct(product)}><img src={product.image} alt={product.name} />{product.badge && <span className="badge">{product.badge}</span>}<button className="heart" onClick={(event) => { event.stopPropagation(); toggleWishlist(product.id); }} aria-label="Save product"><Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} /></button><button className="quick-add" onClick={(event) => { event.stopPropagation(); addToCart(product); }}>Quick add <Plus size={15} /></button></div><div className="product-info"><div><p className="product-category">{product.category}</p><h3 onClick={() => openProduct(product)}>{product.name}</h3></div><strong>${product.price}</strong></div><div className="rating"><Star size={13} fill="currentColor" /> {product.rating} <span>({product.reviews})</span></div></article>;
}

function ProductsPage({ products: visibleProducts, category, setCategory, sort, setSort, search, openProduct, addToCart, toggleWishlist, wishlist }: { products: Product[]; category: Category; setCategory: (category: Category) => void; sort: string; setSort: (sort: string) => void; search: string; openProduct: (product: Product) => void; addToCart: (product: Product) => void; toggleWishlist: (id: number) => void; wishlist: number[] }) {
  return <main className="shop-page"><div className="shop-hero"><p className="eyebrow">The full collection</p><h1>Shop all <em>good things.</em></h1><p>Pieces for the way you live, work, wander and wind down.</p></div><div className="shop-controls"><div className="category-tabs">{(['All', 'Electronics', 'Fashion', 'Shoes', 'Accessories', 'Home & Living'] as Category[]).map((item) => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="sort-select">Sort by <select value={sort} onChange={(event) => setSort(event.target.value)}><option value="featured">Featured</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select><ChevronDown size={15} /></label></div>{search && <p className="result-line">Showing results for “{search}” · {visibleProducts.length} items</p>}<div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(product.id)} />)}</div>{visibleProducts.length === 0 && <div className="empty-state"><Search size={30} /><h2>No matches found</h2><p>Try a different search or browse the full collection.</p></div>}</main>;
}

function ProductDetails({ product, addToCart, openProduct, navigate, toggleWishlist, wishlist }: { product: Product; addToCart: (product: Product, quantity?: number) => void; openProduct: (product: Product) => void; navigate: (page: Page) => void; toggleWishlist: (id: number) => void; wishlist: number[] }) {
  const [quantity, setQuantity] = useState(1);
  return <main className="detail-page"><button className="back-button" onClick={() => navigate('products')}><ArrowLeft size={16} /> Back to shop</button><div className="detail-layout"><div className="detail-photo"><img src={product.image} alt={product.name} /><span className="detail-number">0{product.id} / 12</span></div><div className="detail-copy"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1><div className="detail-rating"><span><Star size={15} fill="currentColor" /> {product.rating}</span> <u>{product.reviews} verified reviews</u></div><div className="detail-price"><strong>${product.price}</strong>{product.originalPrice && <del>${product.originalPrice}</del>}{product.originalPrice && <span>Save ${product.originalPrice - product.price}</span>}</div><p className="detail-description">{product.description}</p><div className="detail-line" /><p className="stock"><span /> In stock · Ships within 24 hours</p><div className="purchase-row"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15} /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}><Plus size={15} /></button></div><button className="button button-dark grow" onClick={() => addToCart(product, quantity)}>Add to bag <ShoppingBag size={17} /></button><button className="detail-heart" onClick={() => toggleWishlist(product.id)}><Heart size={19} fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} /></button></div><div className="detail-perks"><div><Truck size={18} /><span><strong>Free delivery</strong>Orders over $75</span></div><div><Package size={18} /><span><strong>Gift ready</strong>Beautifully packed</span></div></div></div></div><section className="section related"><div className="section-heading"><div><p className="eyebrow">You may also like</p><h2>More to explore</h2></div></div><div className="product-grid four">{products.filter((item) => item.id !== product.id).slice(0, 4).map((item) => <ProductCard key={item.id} product={item} openProduct={openProduct} addToCart={addToCart} toggleWishlist={toggleWishlist} isWishlisted={wishlist.includes(item.id)} />)}</div></section></main>;
}

function CartPage({ cart, subtotal, updateQuantity, navigate, openProduct }: { cart: CartItem[]; subtotal: number; updateQuantity: (id: number, amount: number) => void; navigate: (page: Page) => void; openProduct: (product: Product) => void }) {
  return <main className="cart-page"><div className="page-heading"><p className="eyebrow">Your selection</p><h1>Your shopping bag <em>({cart.length})</em></h1></div>{cart.length === 0 ? <div className="empty-state cart-empty"><ShoppingBag size={34} /><h2>Your bag is waiting</h2><p>Discover something lovely to bring home.</p><button className="button button-dark" onClick={() => navigate('products')}>Start shopping <ArrowRight size={17} /></button></div> : <div className="cart-layout"><div className="cart-items"><div className="cart-header"><span>Product</span><span>Total</span></div>{cart.map(({ product, quantity }) => <div className="cart-item" key={product.id}><button className="cart-thumb" onClick={() => openProduct(product)}><img src={product.image} alt={product.name} /></button><div className="cart-item-info"><p className="product-category">{product.category}</p><h3>{product.name}</h3><p>${product.price} each</p><div className="quantity"><button onClick={() => updateQuantity(product.id, -1)}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, 1)}><Plus size={14} /></button></div></div><strong>${product.price * quantity}</strong></div>)}</div><aside className="summary-card"><h2>Order summary</h2><div><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div><div><span>Shipping</span><span className="free">Free</span></div><div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><button className="button button-dark full" onClick={() => navigate('checkout')}>Proceed to checkout <ArrowRight size={17} /></button><p className="secure-note"><Check size={14} /> Secure, encrypted checkout</p></aside></div>}</main>;
}

function CheckoutPage({ cart, subtotal, navigate, setOrderNumber }: { cart: CartItem[]; subtotal: number; navigate: (page: Page) => void; setOrderNumber: (number: string) => void }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', postal: '', payment: 'card' });
  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const placeOrder = (event: React.FormEvent) => { event.preventDefault(); const number = `NS-${Math.floor(100000 + Math.random() * 899999)}`; setOrderNumber(number); navigate('confirmation'); };
  return <main className="checkout-page"><button className="back-button" onClick={() => navigate('cart')}><ArrowLeft size={16} /> Back to bag</button><div className="page-heading"><p className="eyebrow">Almost there</p><h1>Complete your <em>order.</em></h1></div><div className="checkout-layout"><form className="checkout-form" onSubmit={placeOrder}><section className="form-section"><h2>Contact details</h2><div className="form-grid"><label>Full name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Alex Morgan" /></label><label>Email address<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="alex@example.com" /></label><label>Phone number<input required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+1 555 000 0000" /></label></div></section><section className="form-section"><h2>Delivery address</h2><div className="form-grid"><label className="wide">Street address<input required value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="123 Maple Street" /></label><label>City<input required value={form.city} onChange={(event) => update('city', event.target.value)} placeholder="Brooklyn" /></label><label>Postal code<input required value={form.postal} onChange={(event) => update('postal', event.target.value)} placeholder="11201" /></label></div></section><section className="form-section"><h2>Payment method</h2><div className="payment-option selected"><span className="radio" /><div><strong>Card payment</strong><small>Visa, Mastercard, Amex</small></div><span className="card-dots">•••• 4242</span></div><div className="payment-option"><span className="radio" /><div><strong>Cash on delivery</strong><small>Pay when your order arrives</small></div></div></section><button className="button button-dark full mobile-place" type="submit">Place order <ArrowRight size={17} /></button></form><aside className="summary-card checkout-summary"><h2>Your order</h2>{cart.map(({ product, quantity }) => <div className="mini-product" key={product.id}><img src={product.image} alt={product.name} /><span>{product.name} <small>Qty {quantity}</small></span><strong>${product.price * quantity}</strong></div>)}<div className="summary-total"><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div><button className="button button-dark full" type="submit" onClick={placeOrder}>Place order <ArrowRight size={17} /></button><p className="secure-note"><Check size={14} /> No payment is taken in this demo</p></aside></div></main>;
}

function ConfirmationPage({ orderNumber, cart, subtotal, navigate }: { orderNumber: string; cart: CartItem[]; subtotal: number; navigate: (page: Page) => void }) {
  return <main className="confirmation"><div className="success-icon"><Check size={30} /></div><p className="eyebrow">Order confirmed</p><h1>Thank you for<br /><em>shopping thoughtfully.</em></h1><p className="confirmation-copy">Your order is on its way to becoming part of your everyday. We have sent the details to your inbox.</p><div className="confirmation-card"><div><span>Order number</span><strong>{orderNumber}</strong></div><div><span>Items</span><strong>{cart.reduce((total, item) => total + item.quantity, 0)}</strong></div><div><span>Total</span><strong>${subtotal.toFixed(2)}</strong></div></div><div className="confirmation-actions"><button className="button button-dark" onClick={() => navigate('home')}>Continue shopping <ArrowRight size={17} /></button><button className="text-button">View order details <ArrowRight size={16} /></button></div></main>;
}

function ArrowUpRightIcon() { return <ArrowRight size={15} />; }

export default App;
