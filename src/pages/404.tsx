
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SEOHead from '@/components/seo/SEOHead';

const NotFound = () => {
  return (
    <>
      <SEOHead 
        title="Page Not Found - Zyra Custom Craft"
        description="The page you're looking for doesn't exist. Return to Zyra Custom Craft homepage."
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-2xl text-center bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="text-primary">
                  <h1 className="text-9xl font-bold opacity-20">404</h1>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-foreground">
                    Page Not Found
                  </h2>
                  <p className="text-muted-foreground text-lg max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist. 
                    It might have been moved, deleted, or you entered the wrong URL.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                  <Button asChild size="lg" className="min-w-[140px]">
                    <Link to="/">
                      <Home className="h-4 w-4 mr-2" />
                      Go Home
                    </Link>
                  </Button>
                  
                  <Button asChild variant="outline" size="lg" className="min-w-[140px]">
                    <Link to="/shop">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Browse Shop
                    </Link>
                  </Button>
                  
                  <Button asChild variant="ghost" size="lg" onClick={() => window.history.back()}>
                    <span className="cursor-pointer">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Go Back
                    </span>
                  </Button>
                </div>

                <div className="pt-8 border-t border-border/50">
                  <p className="text-sm text-muted-foreground">
                    Need help? <Link to="/contact" className="text-primary hover:underline">Contact us</Link>
                  </p>
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
