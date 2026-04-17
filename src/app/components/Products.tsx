import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState } from 'react';
import { toast } from 'sonner';

const products = [
  {
    id: 1,
    name: 'Tailored Blazer',
    price: 425,
    image: 'https://images.unsplash.com/photo-1654512697655-b2899afacae5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGNsb3RoaW5nfGVufDF8fHx8MTc2NjU4NTU0MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Outerwear',
  },
  {
    id: 2,
    name: 'Silk Midi Dress',
    price: 385,
    image: 'https://images.unsplash.com/photo-1548768041-2fceab4c0b85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwY2xvdGhpbmclMjBmYXNoaW9ufGVufDF8fHx8MTc2NjY1NTc1Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Dresses',
  },
  {
    id: 3,
    name: 'Cashmere Sweater',
    price: 295,
    image: 'https://images.unsplash.com/photo-1668952135116-2bcd8a9a2f8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R1ZGlvJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc2NjY1NTc1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Knitwear',
  },
  {
    id: 4,
    name: 'Wide Leg Trousers',
    price: 245,
    image: 'https://images.unsplash.com/photo-1615652142324-274f2bfbc88d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjY2NDI5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Bottoms',
  },
  {
    id: 5,
    name: 'Leather Crossbody',
    price: 495,
    image: 'https://images.unsplash.com/photo-1569388330292-79cc1ec67270?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzY2NjQwOTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Accessories',
  },
  {
    id: 6,
    name: 'Linen Shirt',
    price: 185,
    image: 'https://images.unsplash.com/photo-1580656940647-8854a00547f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwc3RvcmV8ZW58MXx8fHwxNzY2NjQ0MjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Tops',
  },
];

export function Products() {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({});
  const [addedToCart, setAddedToCart] = useState<number | null>(null);

  const handleAddToCart = (product: typeof products[0]) => {
    const size = selectedSize[product.id] || 'M';
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
    });
    
    setAddedToCart(product.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  return (
    <section id="new-arrivals" className="py-32 px-4 md:px-6 lg:px-12 xl:px-16 bg-accent/20 relative">
      <div className="w-full" style={{ position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '4rem' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-0.5 bg-foreground mx-auto mb-8"
          />
          <h2 className="text-5xl md:text-6xl mb-4 tracking-tighter">
            New Arrivals
          </h2>
          <p className="text-xl text-foreground/70">
            Fresh pieces for the season
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-accent">
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                
                <motion.button
                  type="button"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const id = String(product.id);
                    if (isInWishlist(id)) {
                      removeFromWishlist(id);
                      toast.success('Removed from wishlist');
                    } else {
                      addToWishlist({
                        id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        gender: 'unisex',
                        colors: [],
                        onSale: false,
                        newArrival: true,
                        featured: false,
                      });
                      toast.success('Added to wishlist');
                    }
                  }}
                  className={`absolute z-10 top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg ${
                    isInWishlist(String(product.id)) ? 'bg-red-500 text-white' : 'bg-white text-foreground'
                  }`}
                >
                  <Heart size={20} fill={isInWishlist(String(product.id)) ? 'currentColor' : 'none'} />
                </motion.button>

                <motion.div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              >
                <div className="text-sm text-foreground/50 mb-2 tracking-wider uppercase">{product.category}</div>
                <h3 className="text-xl mb-3 group-hover:text-foreground/70 transition-colors">{product.name}</h3>
                <div className="mb-4 text-lg">${product.price}</div>
                
                <div className="flex gap-2 mb-4">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <motion.button
                      key={size}
                      onClick={() => setSelectedSize({ ...selectedSize, [product.id]: size })}
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-11 h-11 border transition-all duration-300 flex items-center justify-center text-sm ${
                        selectedSize[product.id] === size
                          ? 'border-primary bg-primary text-primary-foreground shadow-lg'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {size}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  onClick={() => handleAddToCart(product)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-foreground/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    {addedToCart === product.id ? 'Added to Bag!' : 'Add to Bag'}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}