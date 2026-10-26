import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AmbientCanvas } from './components/AmbientCanvas';
import { GlobalNavbar } from './components/GlobalNavbar';
import { Footer } from './components/Footer';
import { HomeView } from './pages/HomeView';
import { ProductsView } from './pages/ProductsView';
import { CheckoutView } from './pages/CheckoutView';
import { AdminView } from './pages/AdminView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AnimatePresence, motion } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeView } = useStore();

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      {/* Persistent Ambient Canvas with Gold Light Embers & Waves */}
      <AmbientCanvas />

      {/* Centered Floating Pill Navigation Bar */}
      <GlobalNavbar />

      {/* Main Page Views with Fluid Motion Transitions */}
      <main className="flex-1 w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(3px)' }}
            transition={{
              duration: 0.32,
              ease: [0.16, 1, 0.3, 1], // Custom luxury smooth settling curve
            }}
            className="w-full"
          >
            {activeView === 'home' && <HomeView />}
            {activeView === 'products' && <ProductsView />}
            {activeView === 'checkout' && <CheckoutView />}
            {activeView === 'admin' && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal />

      {/* Footer with subtle secret Admin Keyhole */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainContent />
    </StoreProvider>
  );
}
