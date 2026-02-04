import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Phone, Search, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "@/components/cart/CartDrawer";
import logo from "@/assets/logo.png";
import { useWishlist } from "@/contexts/WishlistContext";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { UserNav } from "./UserNav";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api";



const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Philosophy", path: "/philosophy" },
  { name: "Materials", path: "/materials" },
  { name: "Quality", path: "/quality" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { wishlist } = useWishlist();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const isActive = (path: string) => location.pathname === path;
  const isProductsActive = location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center justify-between px-4 md:px-6 md:h-20">
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-3 xl:gap-6 flex-[0_0_240px] xl:max-w-[calc(100%-580px)]">
          <Link to="/" className="flex items-center shrink-0 w-[200px] md:w-[220px]">
            <img
              src={logo}
              alt="Dipak Furniture"
              className="h-[40px] sm:h-[48px] md:h-[56px] lg:h-[64px] w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-0.5 xl:flex flex-1">
            {navLinks.slice(0, 3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-2 text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${isActive(link.path)
                  ? "text-accent font-bold"
                  : "text-muted-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={`flex items-center gap-1 px-2.5 py-2 text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${isProductsActive ? "text-accent font-bold" : "text-muted-foreground"
                      }`}
                  >
                    Products
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-64 p-2">
                  <DropdownMenuItem asChild className="p-2 mb-1">
                    <Link to="/products" className="w-full font-bold flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center text-accent">
                        <Search size={14} />
                      </div>
                      All Products
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-px bg-slate-100 my-1" />
                  {categories.filter(c => !c.parent).map((category) => (
                    <DropdownMenuItem key={category.slug} asChild className="p-2 rounded-lg cursor-pointer">
                      <Link to={`/products/${category.slug}`} className="w-full flex items-center gap-3">
                        {category.image && (
                          <img src={category.image} alt="" className="w-10 h-10 rounded-md object-cover border border-slate-100" />
                        )}
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {navLinks.slice(3).map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2.5 py-2 text-sm font-medium transition-colors hover:text-accent whitespace-nowrap ${isActive(link.path)
                  ? "text-accent font-bold"
                  : "text-muted-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Middle: Search Bar */}
        <div className="hidden transition-all md:flex flex-[0_0_340px] justify-center px-4">
          <GlobalSearch />
        </div>

        {/* Right Cluster Structure */}
        <div className="flex items-center gap-2 flex-[0_0_220px] justify-end">
          {/* Mobile Only Search (Icon) */}
          <div className="md:hidden">
            <GlobalSearch />
          </div>

          {/* Desktop Only Tools */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="tel:+919824044585"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-foreground hover:text-accent transition-colors whitespace-nowrap"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden xl:inline">+91 98240 44585</span>
            </a>
          </div>

          {/* Subtle Vertical Divider */}
          <div className="hidden lg:block h-6 w-px bg-border/60" />

          {/* Icons Group */}
          <div className="flex items-center gap-3">
            <Link
              to="/wishlist"
              className="relative h-11 w-11 flex items-center justify-center bg-gray-100 text-foreground transition-all hover:bg-accent/10 hover:text-accent group rounded-xl"
              title="Wishlist"
            >
              <Heart className="h-5 w-5 transition-transform group-hover:scale-110" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-md ring-2 ring-background">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <CartDrawer />

            <div className="hidden sm:block">
              <UserNav />
            </div>
          </div>

          {/* Hamburger (Mobile Only) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 lg:hidden">
                <Menu className="h-7 w-7" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-accent ${isActive(link.path)
                      ? "text-accent"
                      : "text-foreground"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {categories.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="mb-3 text-sm font-semibold text-muted-foreground">
                      Products
                    </p>
                    <Link
                      to="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mb-2 block text-base font-medium text-foreground hover:text-accent"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        to={`/products/${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-1.5 text-sm text-muted-foreground hover:text-accent"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-4 border-t pt-4">
                  <Link
                    to="/search"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent"
                  >
                    <Search className="h-4 w-4" />
                    Search Products
                  </Link>
                  <a
                    href="tel:+919824044585"
                    className="mb-4 flex items-center gap-2 text-sm font-medium text-muted-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    +91 98240 44585
                  </a>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm text-muted-foreground">Your List:</span>
                    <CartDrawer />
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
