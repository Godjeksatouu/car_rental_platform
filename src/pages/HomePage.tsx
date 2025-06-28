import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { Features } from '../components/home/Features';
import { DemoSection } from '../components/home/DemoSection';
import { PricingSection } from '../components/home/PricingSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <HowItWorks />
      <Features />
      <DemoSection />
      <TestimonialsSection />
      <PricingSection />
      <Footer />
    </div>
  );
};