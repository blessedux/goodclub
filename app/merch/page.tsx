"use client"

import { useState } from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  category: "coffee" | "merch" | "magazine"
  image: string
  description: string
}

const products: Product[] = [
  {
    id: "1",
    name: "Brasil Roasted Beans - 1/4 kg",
    price: 15000,
    category: "coffee",
    image: "/brazilian-coffee-beans-quarter-kg-package.jpg",
    description: "Premium Brazilian whole beans, expertly roasted for the perfect cup",
  },
  {
    id: "2",
    name: "Brasil Roasted Beans - 1 kg",
    price: 23000,
    category: "coffee",
    image: "/brazilian-coffee-beans-one-kg-package.jpg",
    description: "Premium Brazilian whole beans, expertly roasted for the perfect cup",
  },
  {
    id: "3",
    name: "Joia Hoodie",
    price: 8500,
    category: "merch",
    image: "/premium-coffee-shop-hoodie-earth-tones.jpg",
    description: "Comfortable premium hoodie with GOODCLUB branding",
  },
  {
    id: "4",
    name: "Joia T-Shirt",
    price: 4500,
    category: "merch",
    image: "/coffee-shop-t-shirt-minimalist-design.jpg",
    description: "Soft cotton t-shirt with minimalist GOODCLUB design",
  },
  {
    id: "5",
    name: "Joia Cap",
    price: 3200,
    category: "merch",
    image: "/coffee-shop-baseball-cap-earth-tones.jpg",
    description: "Adjustable cap with embroidered Joia logo",
  },
  {
    id: "6",
    name: "Joia Jewelry Set",
    price: 12000,
    category: "merch",
    image: "/minimalist-jewelry-set-coffee-inspired.jpg",
    description: "Elegant jewelry set inspired by coffee culture",
  },
  {
    id: "7",
    name: "Joia Magazine - Issue #1",
    price: 2800,
    category: "magazine",
    image: "/premium-coffee-magazine-cover-minimalist-design.jpg",
    description: "Our inaugural magazine featuring coffee culture and stories",
  },
]

export default function MerchPage() {
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [activeCategory, setActiveCategory] = useState<"all" | "coffee" | "merch" | "magazine">("all")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const getCartTotal = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId)
      return total + (product?.price || 0) * quantity
    }, 0)
  }

  const getCartItemCount = () => {
    return Object.values(cart).reduce((total, quantity) => total + quantity, 0)
  }

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  const formatPrice = (price: number) => {
    return `R$ ${(price / 100).toFixed(2).replace(".", ",")}`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                GOODCLUB
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-6">
                <button
                  onClick={() => setActiveCategory("coffee")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "coffee" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  COFFEE
                </button>
                <button
                  onClick={() => setActiveCategory("merch")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "merch" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  MERCH
                </button>
                <button
                  onClick={() => setActiveCategory("magazine")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "magazine" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  MAGAZINE
                </button>
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "all" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  ALL
                </button>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="text-foreground hover:text-primary transition-colors p-2" title="Back to Gallery">
                  🏠
                </button>
              </Link>
              <button className="text-foreground hover:text-primary transition-colors p-2">
                👤
              </button>
              <button className="text-foreground hover:text-primary transition-colors p-2 relative">
                🛒
                {getCartItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {getCartItemCount()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-foreground hover:text-primary transition-colors p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-3">
                <Link 
                  href="/"
                  className="text-left text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ← BACK TO GALLERY
                </Link>
                <button
                  onClick={() => {
                    setActiveCategory("coffee")
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "coffee" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  COFFEE
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("merch")
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "merch" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  MERCH
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("magazine")
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "magazine" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  MAGAZINE
                </button>
                <button
                  onClick={() => {
                    setActiveCategory("all")
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === "all" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  ALL
                </button>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              GOODCLUB STORE
              <br />
              SHOP OUR COLLECTION
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Discover our curated collection of premium Brazilian coffee, merchandise, and magazines. 
              Each item is carefully selected to bring you the authentic Joia experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 rounded transition-all">
                  VIEW GALLERY
                </button>
              </Link>
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded transition-all"
                onClick={() => setActiveCategory("coffee")}
              >
                SHOP COFFEE
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {activeCategory === "all"
                ? "ALL PRODUCTS"
                : activeCategory === "coffee"
                  ? "COFFEE COLLECTION"
                  : activeCategory === "merch"
                    ? "MERCHANDISE"
                    : "GOODCLUB MAGAZINE"}
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {activeCategory === "coffee"
                ? "Premium Brazilian roasted whole beans, available in convenient sizes"
                : activeCategory === "merch"
                  ? "Express your coffee passion with our curated merchandise collection"
                : activeCategory === "magazine"
                  ? "Dive deep into coffee culture with our premium magazine"
                  : "Everything you need for the perfect coffee experience"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group hover:shadow-lg transition-shadow duration-300 bg-card border border-border rounded-lg overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {product.category.toUpperCase()}
                    </span>
                    <span className="text-lg font-bold text-foreground">{formatPrice(product.price)}</span>
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 text-balance">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty">{product.description}</p>
                  <button
                    onClick={() => addToCart(product.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded transition-all"
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">CRAFTED WITH PASSION</h3>
            <p className="text-lg text-muted-foreground mb-8 text-pretty">
              At Joia, we believe coffee is more than just a beverage—it's a moment of connection, a ritual of
              mindfulness, and a celebration of craftsmanship. Our Brazilian roasted whole beans are carefully selected
              and roasted to perfection, bringing you the authentic taste of Brazil in every cup.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">☕</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Premium Quality</h4>
                <p className="text-sm text-muted-foreground">Hand-selected Brazilian beans roasted to perfection</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌱</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Sustainable</h4>
                <p className="text-sm text-muted-foreground">
                  Ethically sourced with respect for farmers and environment
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h4 className="font-semibold text-foreground mb-2">Experience</h4>
                <p className="text-sm text-muted-foreground">More than coffee—a complete cultural experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="font-bold text-lg mb-4">GOODCLUB</h5>
              <p className="text-sm opacity-80">
                Premium Brazilian coffee experience, crafted with passion and served with purpose.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Products</h6>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Coffee Beans</li>
                <li>Merchandise</li>
                <li>Magazine</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Support</h6>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Contact Us</li>
                <li>Shipping Info</li>
                <li>Returns</li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Connect</h6>
              <ul className="space-y-2 text-sm opacity-80">
                <li>Instagram</li>
                <li>Newsletter</li>
                <li>Community</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
            <p className="text-sm opacity-80">© 2025 Joia Coffee. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cart Summary (Fixed) */}
      {getCartItemCount() > 0 && (
        <div className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-4 rounded-lg shadow-lg">
          <div className="text-sm font-medium">Cart: {getCartItemCount()} items</div>
          <div className="text-lg font-bold">{formatPrice(getCartTotal())}</div>
        </div>
      )}
    </div>
  )
}