import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, X, ChevronRight, ShoppingBag, Heart, CreditCard, User, Search, TrendingUp, Package, HelpCircle } from 'lucide-react';

interface GuideSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export function CustomerGuideButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('getting-started');

  const guides: GuideSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <TrendingUp className="w-4 h-4" />,
      content: <GettingStartedGuide />
    },
    {
      id: 'shopping',
      title: 'Shopping Guide',
      icon: <ShoppingBag className="w-4 h-4" />,
      content: <ShoppingGuide />
    },
    {
      id: 'checkout',
      title: 'Checkout Process',
      icon: <CreditCard className="w-4 h-4" />,
      content: <CheckoutGuide />
    },
    {
      id: 'account',
      title: 'Account & Wishlist',
      icon: <Heart className="w-4 h-4" />,
      content: <AccountGuide />
    },
    {
      id: 'orders',
      title: 'Orders & Returns',
      icon: <Package className="w-4 h-4" />,
      content: <OrdersGuide />
    },
    {
      id: 'faq',
      title: 'FAQ & Support',
      icon: <HelpCircle className="w-4 h-4" />,
      content: <FAQGuide />
    }
  ];

  const activeGuide = guides.find(g => g.id === activeTab);

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 bg-[#B4770E] text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <BookOpen className="w-6 h-6" />
        <motion.div
          className="absolute -top-12 right-0 bg-black text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        >
          Shopping Guide
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-2 h-2 bg-black"></div>
        </motion.div>
      </motion.button>

      {/* Help Guide Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full max-w-5xl bg-white shadow-2xl z-[61] overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-black to-[#B4770E] text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-full p-3">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light tracking-wider">RLOCO SHOPPING GUIDE</h2>
                    <p className="text-sm text-white/80 tracking-wide">Complete guide to shopping on Rloco</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex h-[calc(100%-88px)]">
                {/* Sidebar Tabs */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                  <div className="space-y-2">
                    {guides.map((guide) => (
                      <button
                        key={guide.id}
                        onClick={() => setActiveTab(guide.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeTab === guide.id
                            ? 'bg-[#B4770E] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {guide.icon}
                        <span className="flex-1 text-left font-light tracking-wide text-sm">{guide.title}</span>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === guide.id ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 tracking-wide">QUICK LINKS</h3>
                    <div className="space-y-2 text-xs">
                      <a href="/" className="block text-[#B4770E] hover:underline">🏠 Home</a>
                      <a href="/all-products" className="block text-[#B4770E] hover:underline">🛍️ All Products</a>
                      <a href="/cart" className="block text-[#B4770E] hover:underline">🛒 Shopping Cart</a>
                      <a href="/wishlist" className="block text-[#B4770E] hover:underline">❤️ Wishlist</a>
                      <a href="/contact" className="block text-[#B4770E] hover:underline">📧 Contact Us</a>
                    </div>
                  </div>

                  {/* Support Card */}
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-blue-900 mb-2 tracking-wide">NEED HELP?</h3>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>📧 support@rloco.com</div>
                      <div>📞 +1 (555) 123-4567</div>
                      <div>⏰ Mon-Fri 9AM-6PM EST</div>
                      <div className="pt-2">
                        <a href="/contact" className="text-blue-800 hover:underline font-medium">Contact Form →</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeGuide?.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Getting Started Guide
function GettingStartedGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">🎉 Welcome to Rloco!</h1>
      <p className="text-gray-600 mb-8">Your complete guide to luxury fashion shopping</p>

      <div className="bg-gradient-to-r from-[#B4770E]/10 to-transparent border-l-4 border-[#B4770E] p-6 rounded-r-lg mb-8">
        <h2 className="text-xl font-light tracking-wide text-gray-900 mb-2">What is Rloco?</h2>
        <p className="text-gray-700">
          Rloco is your premier destination for luxury fashion, cosmetics, and jewelry. We curate the finest collections from top designers and emerging brands, bringing you exclusive pieces for every occasion.
        </p>
      </div>

      {/* Quick Tour */}
      <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🗺️ Site Navigation</h2>
      
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Top Navigation Bar</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Logo:</strong> Click to return to homepage</div>
                <div><strong>Search Bar:</strong> Search by product name, brand, or category</div>
                <div><strong>Currency Selector:</strong> Switch between USD, EUR, GBP, CAD, AUD</div>
                <div><strong>Wishlist Icon (❤️):</strong> View saved items</div>
                <div><strong>Cart Icon (🛒):</strong> View shopping cart and checkout</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-gray-800 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Main Menu Categories</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>Women:</strong> Dresses, tops, bottoms, outerwear, shoes</div>
                <div><strong>Men:</strong> Shirts, pants, suits, jackets, accessories</div>
                <div><strong>Jewelry:</strong> Necklaces, earrings, bracelets, rings</div>
                <div><strong>Beauty:</strong> Skincare, makeup, fragrances, hair care</div>
                <div><strong>Accessories:</strong> Bags, belts, scarves, sunglasses</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Featured Sections</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><strong>New Arrivals:</strong> Latest products added in last 30 days</div>
                <div><strong>Sale:</strong> All discounted items and promotions</div>
                <div><strong>Trending:</strong> Popular items that customers are loving</div>
                <div><strong>Best Sellers:</strong> Top-rated products by sales</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Homepage Features */}
      <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🏠 Homepage Features</h2>
      
      <div className="space-y-4 mb-6">
        <div className="bg-gradient-to-r from-purple-50 to-white border-l-4 border-purple-500 p-5 rounded-r-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">📱 Style Videos</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Swipe through style and inspiration videos showcasing our latest collections:</p>
            <div className="bg-white rounded-lg p-3 space-y-1 text-xs">
              <div>• <strong>Auto-Scroll:</strong> Videos change every 10 seconds automatically</div>
              <div>• <strong>Manual Navigation:</strong> Click arrows to browse at your pace</div>
              <div>• <strong>Sound:</strong> Tap video to unmute audio</div>
              <div>• <strong>Shop Now:</strong> Click button to view featured product</div>
              <div>• <strong>Mobile Optimized:</strong> Full-screen vertical videos on mobile</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-white border-l-4 border-green-500 p-5 rounded-r-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">🎯 Featured Collections</h3>
          <div className="text-sm text-gray-700">
            <p className="mb-2">Browse curated collections organized by:</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>• Season (Spring, Summer, Fall, Winter)</div>
              <div>• Occasion (Casual, Formal, Party)</div>
              <div>• Style (Minimalist, Boho, Classic)</div>
              <div>• Designer Collections</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-white border-l-4 border-orange-500 p-5 rounded-r-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-2">🔥 Promotional Banners</h3>
          <div className="text-sm text-gray-700">
            <p>Watch for special offers and limited-time promotions:</p>
            <div className="bg-white rounded-lg p-3 mt-2 text-xs space-y-1">
              <div>• Flash Sales (24-48 hours)</div>
              <div>• Seasonal Discounts (20-40% off)</div>
              <div>• Free Shipping Promotions (orders over $75)</div>
              <div>• Bundle Deals (Buy 2 Get 1 Free)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Steps */}
      <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🚀 Getting Started in 3 Steps</h2>
      
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">1</div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Browse Our Collections</h3>
            <p className="text-sm text-gray-600 mb-3">Start exploring products by category, search, or featured sections</p>
            <div className="flex gap-2">
              <a href="/category/women" className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs text-gray-700 transition-colors">👗 Women</a>
              <a href="/category/men" className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs text-gray-700 transition-colors">👔 Men</a>
              <a href="/new-arrivals" className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs text-gray-700 transition-colors">✨ New</a>
              <a href="/sale" className="inline-block bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs text-gray-700 transition-colors">🔥 Sale</a>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">2</div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Add Items to Cart or Wishlist</h3>
            <p className="text-sm text-gray-600 mb-2">Found something you love?</p>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Click product to view details</div>
              <div>• Select size and color</div>
              <div>• Click <strong>"Add to Cart"</strong> to purchase now</div>
              <div>• Click <strong>❤️ icon</strong> to save for later</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">3</div>
          <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Checkout & Enjoy</h3>
            <p className="text-sm text-gray-600 mb-2">Complete your purchase in minutes:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Review cart items</div>
              <div>• Enter shipping address</div>
              <div>• Choose payment method</div>
              <div>• Receive order confirmation via email</div>
              <div>• Track your shipment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <h3 className="text-lg font-medium text-blue-900 mb-3 flex items-center gap-2">
          💡 Pro Shopping Tips
        </h3>
        <div className="text-sm text-blue-800 space-y-2">
          <div>• <strong>Sign up for newsletter:</strong> Get 10% off your first order + exclusive deals</div>
          <div>• <strong>Use filters:</strong> Narrow down products by size, color, price, brand</div>
          <div>• <strong>Save to wishlist:</strong> Track price drops on items you love</div>
          <div>• <strong>Free shipping:</strong> Orders over $75 ship free!</div>
          <div>• <strong>Read reviews:</strong> See what other customers say before buying</div>
          <div>• <strong>Size guide:</strong> Check our size chart for perfect fit</div>
        </div>
      </div>
    </div>
  );
}

// Shopping Guide
function ShoppingGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">🛍️ Shopping Guide</h1>
      <p className="text-gray-600 mb-8">Everything you need to know about browsing and finding products</p>

      {/* Search & Browse */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🔍 Search & Browse</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Using the Search Bar</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search for products, brands, or categories..." 
                  className="flex-1 border-0 bg-transparent text-gray-900 focus:outline-none"
                  disabled
                />
              </div>
              <div className="text-xs text-gray-600">
                Located in the top navigation bar - always accessible
              </div>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div><strong>Search by Product:</strong> "silk dress", "leather jacket", "diamond earrings"</div>
              <div><strong>Search by Brand:</strong> "Versace", "Gucci", "Chanel"</div>
              <div><strong>Search by Style:</strong> "bohemian", "minimalist", "vintage"</div>
              <div><strong>Search by Color:</strong> "black dress", "red shoes", "navy suit"</div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Browse by Category</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-lg p-4">
                <div className="text-2xl mb-2">👗</div>
                <div className="font-medium text-gray-900 mb-1">Women's Fashion</div>
                <div className="text-xs text-gray-600">
                  Dresses • Tops • Bottoms<br/>
                  Outerwear • Shoes • Accessories
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-lg p-4">
                <div className="text-2xl mb-2">👔</div>
                <div className="font-medium text-gray-900 mb-1">Men's Fashion</div>
                <div className="text-xs text-gray-600">
                  Shirts • Pants • Suits<br/>
                  Jackets • Shoes • Accessories
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
                <div className="text-2xl mb-2">💍</div>
                <div className="font-medium text-gray-900 mb-1">Jewelry</div>
                <div className="text-xs text-gray-600">
                  Necklaces • Earrings<br/>
                  Bracelets • Rings • Watches
                </div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4">
                <div className="text-2xl mb-2">💄</div>
                <div className="font-medium text-gray-900 mb-1">Beauty</div>
                <div className="text-xs text-gray-600">
                  Skincare • Makeup<br/>
                  Fragrances • Hair Care
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filtering & Sorting */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🎯 Filtering & Sorting</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
          <p className="text-sm text-blue-900">Use filters to narrow down products and find exactly what you're looking for!</p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Available Filters:</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-medium text-gray-800 mb-1">📏 Size</div>
                <div className="text-xs text-gray-600">XS, S, M, L, XL, XXL<br/>Or numeric sizes (2, 4, 6, etc.)</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">🎨 Color</div>
                <div className="text-xs text-gray-600">Black, White, Red, Blue, etc.<br/>Color swatches for easy selection</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">💰 Price Range</div>
                <div className="text-xs text-gray-600">$0-$100, $100-$500, $500+<br/>Or custom range slider</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">🏷️ Brand</div>
                <div className="text-xs text-gray-600">Filter by designer or brand<br/>Multi-select available</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">⭐ Rating</div>
                <div className="text-xs text-gray-600">4+ stars, 3+ stars, etc.<br/>See customer-rated items</div>
              </div>
              <div>
                <div className="font-medium text-gray-800 mb-1">🔖 Badges</div>
                <div className="text-xs text-gray-600">NEW, SALE, TRENDING<br/>LIMITED, BEST SELLER</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 text-sm">Sorting Options:</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Featured:</strong> Our hand-picked selections (default)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Price: Low to High:</strong> Budget-friendly first</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Price: High to Low:</strong> Premium items first</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Newest:</strong> Latest arrivals first</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Best Selling:</strong> Most popular items</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#B4770E]"></div>
                <span><strong>Top Rated:</strong> Highest customer ratings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">📦 Product Detail Pages</h2>
        
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">What You'll Find on Product Pages:</h3>
            <div className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">📸</div>
                <div>
                  <div className="font-medium text-gray-900">Product Images</div>
                  <div className="text-gray-600 text-xs">
                    • 4-6 high-resolution photos<br/>
                    • Click to zoom and see details<br/>
                    • Swipe through gallery on mobile
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">💰</div>
                <div>
                  <div className="font-medium text-gray-900">Pricing Information</div>
                  <div className="text-gray-600 text-xs">
                    • Current price in your selected currency<br/>
                    • Original price (if on sale) shown strikethrough<br/>
                    • Savings percentage displayed
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">📏</div>
                <div>
                  <div className="font-medium text-gray-900">Size & Color Selection</div>
                  <div className="text-gray-600 text-xs">
                    • Available sizes with stock indicators<br/>
                    • Color swatches (click to change)<br/>
                    • "Out of stock" clearly marked
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">📝</div>
                <div>
                  <div className="font-medium text-gray-900">Product Description</div>
                  <div className="text-gray-600 text-xs">
                    • Detailed description of materials and features<br/>
                    • Care instructions<br/>
                    • Model measurements and size worn
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">⭐</div>
                <div>
                  <div className="font-medium text-gray-900">Customer Reviews</div>
                  <div className="text-gray-600 text-xs">
                    • Average star rating<br/>
                    • Verified purchase reviews<br/>
                    • Photos from customers<br/>
                    • Sort by most helpful/recent
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-xl flex-shrink-0">🔗</div>
                <div>
                  <div className="font-medium text-gray-900">Related Products</div>
                  <div className="text-gray-600 text-xs">
                    • Similar items you might like<br/>
                    • Complete the look suggestions<br/>
                    • Frequently bought together
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">📐 Size Guide</h3>
            <p className="text-sm text-yellow-800 mb-2">Not sure about your size? Click "Size Guide" on product pages to see:</p>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>• Detailed measurement charts (bust, waist, hips, inseam)</div>
              <div>• How to measure yourself correctly</div>
              <div>• Size conversion charts (US, UK, EU)</div>
              <div>• Fit notes (runs small/large/true to size)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Badges */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🏷️ Product Badges Explained</h2>
        <p className="text-sm text-gray-600 mb-4">Look for these badges to identify special products:</p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-[#B4770E] text-white px-2 py-1 rounded text-xs font-medium">NEW</div>
              <span className="text-sm font-medium text-yellow-900">New Arrivals</span>
            </div>
            <p className="text-xs text-yellow-800">Products added in the last 30 days. Be the first to wear the latest trends!</p>
          </div>
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">SALE</div>
              <span className="text-sm font-medium text-red-900">On Sale</span>
            </div>
            <p className="text-xs text-red-800">Discounted items. Save money on premium products - limited time offers!</p>
          </div>
          <div className="bg-gray-50 border-2 border-gray-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-black text-white px-2 py-1 rounded text-xs font-medium">TRENDING</div>
              <span className="text-sm font-medium text-gray-900">Trending Now</span>
            </div>
            <p className="text-xs text-gray-700">Popular items that customers are loving right now. Join the trend!</p>
          </div>
          <div className="bg-orange-50 border-2 border-orange-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-orange-600 text-white px-2 py-1 rounded text-xs font-medium">LIMITED</div>
              <span className="text-sm font-medium text-orange-900">Limited Stock</span>
            </div>
            <p className="text-xs text-orange-800">Low inventory! Only a few items left. Order soon before they sell out.</p>
          </div>
          <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-purple-700 text-white px-2 py-1 rounded text-xs font-medium">EXCLUSIVE</div>
              <span className="text-sm font-medium text-purple-900">Exclusive</span>
            </div>
            <p className="text-xs text-purple-800">Premium exclusive items. Limited edition pieces you won't find elsewhere.</p>
          </div>
          <div className="bg-green-50 border-2 border-green-400 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-medium">BEST SELLER</div>
              <span className="text-sm font-medium text-green-900">Best Seller</span>
            </div>
            <p className="text-xs text-green-800">Customer favorites! Our top-selling products that everyone loves.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Checkout Guide
function CheckoutGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">💳 Checkout Process</h1>
      <p className="text-gray-600 mb-8">Complete step-by-step guide to purchasing your items</p>

      <div className="bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 p-5 rounded-r-lg mb-6">
        <h2 className="text-lg font-medium text-green-900 mb-2">🎉 Myntra-Style Checkout</h2>
        <p className="text-sm text-green-800">We use a streamlined 4-step checkout process inspired by Myntra for a fast, easy shopping experience!</p>
      </div>

      {/* Checkout Steps */}
      <div className="space-y-6">
        {/* Step 1: Cart */}
        <div className="bg-white border-2 border-[#B4770E] rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#B4770E] to-[#9a6409] text-white p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white text-[#B4770E] rounded-full w-10 h-10 flex items-center justify-center font-bold">1</div>
              <div>
                <h3 className="text-lg font-medium">Shopping Cart</h3>
                <p className="text-sm text-white/80">Review your items and apply discounts</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-medium text-gray-900 mb-3">What You Can Do:</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>Review Items:</strong> See all products in your cart with images, sizes, colors, and prices
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>Update Quantity:</strong> Change quantities using +/- buttons (max 10 per item)
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>Remove Items:</strong> Click trash icon to remove unwanted items
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>Move to Wishlist:</strong> Save items for later instead of removing
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>Apply Coupon Code:</strong> Enter promo codes for discounts
                </div>
              </div>
              <div className="flex gap-3">
                <div className="text-green-600">✓</div>
                <div>
                  <strong>See Price Breakdown:</strong> Subtotal, shipping, taxes, and total clearly displayed
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">💰 Order Summary Example:</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <div className="flex justify-between"><span>Subtotal (3 items):</span><span>$299.97</span></div>
                <div className="flex justify-between"><span>Shipping:</span><span className="text-green-600">FREE</span></div>
                <div className="flex justify-between"><span>Tax:</span><span>$24.00</span></div>
                <div className="flex justify-between font-medium text-base border-t border-blue-300 pt-2 mt-2">
                  <span>Total:</span><span>$323.97</span>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block bg-[#B4770E] text-white px-6 py-3 rounded-lg font-medium">
                PROCEED TO ADDRESS →
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Address */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center font-bold">2</div>
              <div>
                <h3 className="text-lg font-medium">Delivery Address</h3>
                <p className="text-sm text-white/80">Choose or add shipping address</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-medium text-gray-900 mb-3">Address Options:</h4>
            
            <div className="space-y-3 mb-4">
              <div className="border-2 border-[#B4770E] bg-[#B4770E]/5 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="address" checked className="mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Home</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Sarah Johnson<br/>
                        123 Fashion Street, Apt 4B<br/>
                        New York, NY 10001<br/>
                        Phone: (555) 123-4567
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-[#B4770E] hover:underline">Edit</button>
                    <button className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="address" className="mt-1" />
                    <div>
                      <div className="font-medium text-gray-900">Work</div>
                      <div className="text-sm text-gray-600 mt-1">
                        Sarah Johnson<br/>
                        456 Business Ave, Suite 200<br/>
                        New York, NY 10002<br/>
                        Phone: (555) 987-6543
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-[#B4770E] hover:underline">Edit</button>
                    <button className="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-[#B4770E] hover:bg-gray-50 transition-colors">
              + ADD NEW ADDRESS
            </button>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <h4 className="text-sm font-medium text-yellow-900 mb-2">📦 New Address Form Includes:</h4>
              <div className="text-xs text-yellow-800 space-y-1">
                <div>• Full name</div>
                <div>• Phone number</div>
                <div>• Street address (line 1 & 2)</div>
                <div>• City, State/Province, ZIP/Postal code</div>
                <div>• Country</div>
                <div>• Address type (Home/Work/Other)</div>
                <div>• Set as default option</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block bg-[#B4770E] text-white px-6 py-3 rounded-lg font-medium">
                CONTINUE TO PAYMENT →
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Payment */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white text-green-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">3</div>
              <div>
                <h3 className="text-lg font-medium">Payment Method</h3>
                <p className="text-sm text-white/80">Secure payment processing</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <h4 className="font-medium text-gray-900 mb-3">Payment Options:</h4>
            
            <div className="space-y-3">
              <div className="border-2 border-[#B4770E] bg-[#B4770E]/5 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <input type="radio" name="payment" checked />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Credit / Debit Card</span>
                  </div>
                </div>
                <div className="pl-8 space-y-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs text-gray-600 block mb-1">Expiry Date</label>
                      <input type="text" placeholder="MM / YY" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600 block mb-1">CVV</label>
                      <input type="text" placeholder="123" className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>We accept:</span>
                    <span className="font-medium">Visa • Mastercard • Amex • Discover</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">PayPal</span>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <input type="radio" name="payment" />
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Apple Pay / Google Pay</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-2">
                <div className="text-green-600 text-xl">🔒</div>
                <div>
                  <h4 className="text-sm font-medium text-green-900 mb-1">Secure Payment</h4>
                  <p className="text-xs text-green-800">
                    All transactions are encrypted and secure. We never store your complete card details.
                    Your payment information is processed by trusted payment gateways.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="inline-block bg-[#B4770E] text-white px-6 py-3 rounded-lg font-medium">
                PLACE ORDER →
              </div>
            </div>
          </div>
        </div>

        {/* Step 4: Confirmation */}
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-4">
            <div className="flex items-center gap-3">
              <div className="bg-white text-purple-600 rounded-full w-10 h-10 flex items-center justify-center font-bold">4</div>
              <div>
                <h3 className="text-lg font-medium">Order Confirmation</h3>
                <p className="text-sm text-white/80">Your order is confirmed!</p>
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3">🎉</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Thank You for Your Order!</h3>
              <p className="text-gray-600">Order #ORD-123456</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-gray-900 mb-3">What Happens Next:</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex gap-3">
                  <div className="text-green-600">✓</div>
                  <div><strong>Order Confirmation Email:</strong> Sent to your email immediately</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600">✓</div>
                  <div><strong>Processing:</strong> We prepare your items (1-2 business days)</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600">✓</div>
                  <div><strong>Shipping Notification:</strong> You'll receive tracking number via email</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-green-600">✓</div>
                  <div><strong>Delivery:</strong> Arrives in 3-5 business days (standard shipping)</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="border border-gray-300 rounded-lg py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                View Order Details
              </button>
              <button className="bg-[#B4770E] text-white rounded-lg py-3 hover:bg-[#9a6409] transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-medium text-blue-900 mb-3">💳 Accepted Payment Methods</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
          <div>• Visa, Mastercard, American Express</div>
          <div>• Discover, Diners Club</div>
          <div>• PayPal</div>
          <div>• Apple Pay, Google Pay</div>
          <div>• Shop Pay</div>
          <div>• Venmo</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-4">
        <h3 className="text-lg font-medium text-yellow-900 mb-2">⚡ Order Processing Times</h3>
        <div className="text-sm text-yellow-800 space-y-1">
          <div>• <strong>Standard Processing:</strong> 1-2 business days</div>
          <div>• <strong>Standard Shipping:</strong> 3-5 business days after processing</div>
          <div>• <strong>Express Shipping:</strong> 1-2 business days after processing (+$12.99)</div>
          <div>• <strong>International:</strong> 7-14 business days (+$24.99)</div>
        </div>
      </div>
    </div>
  );
}

// Account & Wishlist Guide
function AccountGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">👤 Account & Wishlist</h1>
      <p className="text-gray-600 mb-8">Manage your account and save your favorite items</p>

      {/* Account Features */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🔐 Your Account</h2>
        
        <div className="bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
          <p className="text-sm text-blue-900">Create an account to enjoy faster checkout, order tracking, wishlists, and exclusive offers!</p>
        </div>

        <h3 className="font-medium text-gray-900 mb-3">Account Benefits:</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-200 rounded-lg p-4">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-medium text-gray-900 mb-1">Fast Checkout</div>
            <div className="text-xs text-gray-600">Saved addresses and payment methods for one-click ordering</div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-lg p-4">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-medium text-gray-900 mb-1">Order History</div>
            <div className="text-xs text-gray-600">Track all orders and reorder with a single click</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-white border border-pink-200 rounded-lg p-4">
            <div className="text-2xl mb-2">❤️</div>
            <div className="font-medium text-gray-900 mb-1">Wishlists</div>
            <div className="text-xs text-gray-600">Save unlimited items and get price drop alerts</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-200 rounded-lg p-4">
            <div className="text-2xl mb-2">🎁</div>
            <div className="font-medium text-gray-900 mb-1">Exclusive Offers</div>
            <div className="text-xs text-gray-600">Members-only sales and early access to new collections</div>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-3 mt-6">Account Dashboard:</h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span>📊 <strong>Dashboard:</strong> Overview of your activity</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span>📦 <strong>Orders:</strong> View and track all orders</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span>📍 <strong>Addresses:</strong> Manage shipping addresses</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span>💳 <strong>Payment Methods:</strong> Saved cards and PayPal</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span>⭐ <strong>Reviews:</strong> Your product reviews</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>⚙️ <strong>Settings:</strong> Email preferences, password, privacy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">❤️ Wishlist Features</h2>
        
        <h3 className="font-medium text-gray-900 mb-3">How to Use Wishlists:</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">1</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Add Items to Wishlist</h4>
              <p className="text-sm text-gray-600 mb-2">Click the ❤️ icon on any product card or product page</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                The heart icon will turn red when item is saved. Click again to remove from wishlist.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">2</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">View Your Wishlist</h4>
              <p className="text-sm text-gray-600 mb-2">Click the ❤️ icon in the top navigation bar</p>
              <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
                See all saved items with current prices. Items show "Price Drop" badge if price decreased.
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#B4770E] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 font-medium">3</div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">Quick Actions</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="bg-gray-50 rounded-lg p-3">
                  <strong>Move to Cart:</strong> Click "Add to Cart" button to purchase immediately
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <strong>Remove Item:</strong> Click X icon or ❤️ to unsave
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <strong>Share Wishlist:</strong> Copy link to share with friends/family
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-6">
          <h4 className="font-medium text-purple-900 mb-2">💡 Wishlist Pro Tips:</h4>
          <div className="text-sm text-purple-800 space-y-1">
            <div>• <strong>Price Alerts:</strong> We'll email you when wishlist items go on sale</div>
            <div>• <strong>Stock Alerts:</strong> Get notified when out-of-stock items are back</div>
            <div>• <strong>Holiday Lists:</strong> Share wishlist for gift ideas</div>
            <div>• <strong>Size Availability:</strong> We track your preferred sizes and notify you</div>
          </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🔒 Account Security</h2>
        
        <div className="space-y-3 text-sm">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Password Requirements:</h4>
            <div className="text-gray-700 space-y-1">
              <div>• Minimum 8 characters</div>
              <div>• At least one uppercase letter</div>
              <div>• At least one number</div>
              <div>• At least one special character (!@#$%^&*)</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Privacy & Security:</h4>
            <div className="text-gray-700 space-y-1">
              <div>• Your data is encrypted and secure</div>
              <div>• We never share your personal information</div>
              <div>• Two-factor authentication available</div>
              <div>• Review our <a href="/privacy" className="text-[#B4770E] hover:underline">Privacy Policy</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Orders & Returns Guide
function OrdersGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">📦 Orders & Returns</h1>
      <p className="text-gray-600 mb-8">Track your orders and learn about our return policy</p>

      {/* Order Tracking */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">📍 Order Tracking</h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-transparent border-l-4 border-blue-500 p-4 rounded-r-lg">
            <h3 className="font-medium text-blue-900 mb-2">How to Track Your Order:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <div>1. Check your email for shipping confirmation with tracking number</div>
              <div>2. Click tracking link in email, or</div>
              <div>3. Log into your account → Orders → View Details</div>
              <div>4. Click "Track Package" button</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Order Status Meanings:</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Processing</div>
                <div className="text-sm text-gray-700">
                  <strong>We're preparing your order</strong><br/>
                  Items are being picked, packed, and prepared for shipment (1-2 business days)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Shipped</div>
                <div className="text-sm text-gray-700">
                  <strong>Your order is on the way!</strong><br/>
                  Package has left our warehouse. Check tracking for delivery updates.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Out for Delivery</div>
                <div className="text-sm text-gray-700">
                  <strong>Delivery today!</strong><br/>
                  Package is with the delivery driver and will arrive today.
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">Delivered</div>
                <div className="text-sm text-gray-700">
                  <strong>Package delivered</strong><br/>
                  Your order has been successfully delivered. Enjoy your purchase!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Returns Policy */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">↩️ Returns & Exchanges</h2>
        
        <div className="bg-gradient-to-r from-green-50 to-transparent border-l-4 border-green-500 p-5 rounded-r-lg mb-4">
          <h3 className="text-lg font-medium text-green-900 mb-2">30-Day Return Policy</h3>
          <p className="text-sm text-green-800">
            Not satisfied? Return any item within 30 days of delivery for a full refund or exchange. No questions asked!
          </p>
        </div>

        <h3 className="font-medium text-gray-900 mb-3">Return Requirements:</h3>
        <div className="space-y-2 mb-4">
          <div className="flex gap-3 text-sm">
            <div className="text-green-600">✓</div>
            <div className="text-gray-700"><strong>Unworn & unwashed</strong> with original tags attached</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-green-600">✓</div>
            <div className="text-gray-700"><strong>Original packaging</strong> whenever possible</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-green-600">✓</div>
            <div className="text-gray-700"><strong>Within 30 days</strong> of delivery date</div>
          </div>
          <div className="flex gap-3 text-sm">
            <div className="text-green-600">✓</div>
            <div className="text-gray-700"><strong>Proof of purchase</strong> (order number or receipt)</div>
          </div>
        </div>

        <h3 className="font-medium text-gray-900 mb-3">How to Return an Item:</h3>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="bg-[#B4770E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-medium">1</div>
            <div className="flex-1 text-sm">
              <strong className="text-gray-900">Initiate Return</strong>
              <p className="text-gray-600 mt-1">Log into your account → Orders → Select order → Click "Return Items"</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#B4770E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-medium">2</div>
            <div className="flex-1 text-sm">
              <strong className="text-gray-900">Select Items & Reason</strong>
              <p className="text-gray-600 mt-1">Choose items to return and reason (Wrong size, Changed mind, Defective, etc.)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#B4770E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-medium">3</div>
            <div className="flex-1 text-sm">
              <strong className="text-gray-900">Print Return Label</strong>
              <p className="text-gray-600 mt-1">We'll email you a prepaid return shipping label</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#B4770E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-medium">4</div>
            <div className="flex-1 text-sm">
              <strong className="text-gray-900">Pack & Ship</strong>
              <p className="text-gray-600 mt-1">Pack items securely, attach label, drop off at any UPS/FedEx location</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="bg-[#B4770E] text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 text-sm font-medium">5</div>
            <div className="flex-1 text-sm">
              <strong className="text-gray-900">Receive Refund</strong>
              <p className="text-gray-600 mt-1">Refund processed within 5-7 days after we receive your return</p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-yellow-900 mb-2">⚠️ Non-Returnable Items:</h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <div>• Intimate apparel, swimwear, and bodysuits (for hygiene reasons)</div>
            <div>• Earrings (pierced jewelry)</div>
            <div>• Opened beauty products and fragrances</div>
            <div>• Final sale items (marked as "Final Sale" on product page)</div>
            <div>• Gift cards</div>
          </div>
        </div>
      </div>

      {/* Exchanges */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🔄 Exchanges</h2>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-700">
            Need a different size or color? We make exchanges easy!
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Exchange Process:</h4>
            <div className="text-sm text-gray-700 space-y-2">
              <div><strong>Option 1: Quick Exchange</strong></div>
              <div className="pl-4 text-xs space-y-1">
                <div>• Go to Orders → Select item → Choose "Exchange"</div>
                <div>• Select new size/color</div>
                <div>• We'll ship new item immediately</div>
                <div>• Return original item using prepaid label</div>
                <div>• No charge unless price difference</div>
              </div>
              
              <div className="pt-2"><strong>Option 2: Return & Repurchase</strong></div>
              <div className="pl-4 text-xs space-y-1">
                <div>• Return item for full refund</div>
                <div>• Place new order for different size/color</div>
                <div>• Good option if you want to apply a promo code</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💰 Exchange Pricing:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div>• <strong>Same price:</strong> Free exchange</div>
              <div>• <strong>Higher price:</strong> Pay difference only</div>
              <div>• <strong>Lower price:</strong> Receive refund for difference</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Guide
function FAQGuide() {
  return (
    <div className="prose prose-sm max-w-none">
      <h1 className="text-4xl font-light tracking-wider text-gray-900 mb-2">❓ FAQ & Support</h1>
      <p className="text-gray-600 mb-8">Frequently asked questions and how to get help</p>

      {/* Shipping FAQs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">🚚 Shipping Questions</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Do you offer free shipping?</h3>
            <p className="text-sm text-gray-700">
              Yes! We offer <strong>FREE standard shipping on all orders over $75</strong> within the continental US. Orders under $75 have a flat $5.99 shipping fee.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">How long does shipping take?</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <div><strong>Processing:</strong> 1-2 business days</div>
              <div><strong>Standard Shipping:</strong> 3-5 business days after processing</div>
              <div><strong>Express Shipping:</strong> 1-2 business days after processing (+$12.99)</div>
              <div><strong>International:</strong> 7-14 business days (+$24.99)</div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Do you ship internationally?</h3>
            <p className="text-sm text-gray-700">
              Yes! We ship to most countries worldwide. International shipping starts at $24.99. Customs fees and import duties may apply and are the customer's responsibility.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Can I change my shipping address after ordering?</h3>
            <p className="text-sm text-gray-700">
              If your order hasn't shipped yet, contact us immediately at <a href="mailto:support@rloco.com" className="text-[#B4770E] hover:underline">support@rloco.com</a> and we'll update the address. Once shipped, contact the carrier directly.
            </p>
          </div>
        </div>
      </div>

      {/* Payment FAQs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">💳 Payment Questions</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
            <p className="text-sm text-gray-700 mb-2">We accept:</p>
            <div className="text-sm text-gray-700 space-y-1">
              <div>• Credit/Debit Cards (Visa, Mastercard, Amex, Discover)</div>
              <div>• PayPal</div>
              <div>• Apple Pay & Google Pay</div>
              <div>• Shop Pay</div>
              <div>• Venmo</div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Is my payment information secure?</h3>
            <p className="text-sm text-gray-700">
              Absolutely! All transactions are encrypted with SSL technology. We use trusted payment processors and never store your complete card details on our servers.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">When will I be charged?</h3>
            <p className="text-sm text-gray-700">
              Your payment method is charged immediately when you place your order. Authorization may appear sooner, but the final charge processes after order confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Product FAQs */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">👗 Product Questions</h2>
        
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">How do I know what size to order?</h3>
            <p className="text-sm text-gray-700">
              Check our detailed <a href="/size-guide" className="text-[#B4770E] hover:underline">Size Guide</a> with measurement charts for each category. Also read product reviews - customers often mention if items run small/large.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">Are product photos accurate?</h3>
            <p className="text-sm text-gray-700">
              We strive for accuracy, but colors may vary slightly due to screen settings. Check customer photos in reviews for real-world examples!
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium text-gray-900 mb-2">When will out-of-stock items be restocked?</h3>
            <p className="text-sm text-gray-700">
              Click "Notify Me" on the product page to receive an email alert when items are back in stock. Restocking timelines vary by product and vendor.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-[#B4770E]/10 to-transparent border-2 border-[#B4770E] rounded-lg p-6">
        <h2 className="text-2xl font-light tracking-wide text-gray-900 mb-4">📞 Contact Customer Support</h2>
        
        <p className="text-sm text-gray-700 mb-4">
          Can't find the answer you're looking for? Our customer support team is here to help!
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">📧</div>
            <div className="font-medium text-gray-900 mb-1">Email Support</div>
            <a href="mailto:support@rloco.com" className="text-[#B4770E] hover:underline text-sm">support@rloco.com</a>
            <div className="text-xs text-gray-600 mt-2">Response within 24 hours</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">📞</div>
            <div className="font-medium text-gray-900 mb-1">Phone Support</div>
            <a href="tel:+15551234567" className="text-[#B4770E] hover:underline text-sm">+1 (555) 123-4567</a>
            <div className="text-xs text-gray-600 mt-2">Mon-Fri 9AM-6PM EST</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">💬</div>
            <div className="font-medium text-gray-900 mb-1">Live Chat</div>
            <button className="text-[#B4770E] hover:underline text-sm">Start Chat</button>
            <div className="text-xs text-gray-600 mt-2">Available during business hours</div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-medium text-gray-900 mb-1">Contact Form</div>
            <a href="/contact" className="text-[#B4770E] hover:underline text-sm">Submit Request</a>
            <div className="text-xs text-gray-600 mt-2">Detailed inquiries</div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-yellow-900 mb-2">⚡ Faster Support Tips:</h4>
          <div className="text-sm text-yellow-800 space-y-1">
            <div>• Include your order number in all communications</div>
            <div>• Attach photos for product issues</div>
            <div>• Check your spam folder for our replies</div>
            <div>• Business hours are Mon-Fri 9AM-6PM EST</div>
          </div>
        </div>
      </div>
    </div>
  );
}
