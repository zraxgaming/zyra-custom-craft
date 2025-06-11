
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import SEOHead from '@/components/seo/SEOHead';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="About Us - Zyra Custom Craft"
        description="Learn more about Zyra Custom Craft, our mission, and our commitment to creating beautiful custom products."
      />
      <Navbar />
      
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About Zyra Custom Craft</h1>
            <p className="text-xl text-muted-foreground">
              Creating beautiful, personalized products that tell your story
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Zyra Custom Craft was founded with a simple mission: to help people create 
                  meaningful, personalized products that celebrate life's special moments. 
                  From custom gifts to personalized home decor, we bring your ideas to life 
                  with quality craftsmanship and attention to detail.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We believe that every product should be as unique as the person who owns it. 
                  Our team of skilled artisans and designers work closely with each customer 
                  to create custom pieces that exceed expectations and create lasting memories.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Visit Our Store</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-muted-foreground">
                        Warsan City Building<br />
                        International City Phase 2<br />
                        Dubai, UAE
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Store Hours</p>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 7:00 PM<br />
                        Saturday: 10:00 AM - 6:00 PM<br />
                        Sunday: 12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-muted-foreground">+971 XX XXX XXXX</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-muted-foreground">info@zyracustomcraft.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Ready to Create Something Special?</h2>
            <p className="text-muted-foreground mb-6">
              Browse our collection or contact us to discuss your custom project ideas.
            </p>
          </div>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default About;
