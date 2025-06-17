
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const NotFound = () => {
  return (
    <>
      <SEOHead 
        title="Page Not Found | Zyra Custom Craft"
        description="The page you're looking for doesn't exist. Browse our custom products and personalized gifts."
        url="https://shopzyra.vercel.app/404"
        noIndex={true}
      />
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="w-full max-w-lg shadow-xl border-0 bg-gradient-to-br from-card via-card to-muted/30">
            <CardContent className="p-8 text-center space-y-6">
              {/* Animated 404 */}
              <div className="relative">
                <div className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                  404
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 blur-3xl animate-pulse"></div>
              </div>

              {/* Error Message */}
              <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                  Oops! Page Not Found
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  The page you're looking for seems to have wandered off into the digital wilderness. 
                  Let's get you back on track!
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild size="lg" className="flex-1">
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
                
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/shop">
                    <Search className="h-4 w-4 mr-2" />
                    Browse Shop
                  </Link>
                </Button>
              </div>

              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="w-full mt-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>

              {/* Helpful Links */}
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-3">
                  Looking for something specific?
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link 
                    to="/categories" 
                    className="text-sm text-primary hover:underline"
                  >
                    Categories
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link 
                    to="/about" 
                    className="text-sm text-primary hover:underline"
                  >
                    About Us
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link 
                    to="/contact" 
                    className="text-sm text-primary hover:underline"
                  >
                    Contact
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link 
                    to="/faq" 
                    className="text-sm text-primary hover:underline"
                  >
                    FAQ
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default NotFound;
