import PageHero from '../components/PageHero';
import Products from '../components/sections/Products';
import PaymentMethods from '../components/sections/PaymentMethods';
import CTA from '../components/sections/CTA';

export default function ProductsPage() {
  return (
    <>
      <PageHero eyebrow="Products" title={<>A product for <span className="gradient-text">every need</span></>} subtitle="From checkout to settlement, PayFlow gives you a unified suite of payment products." />
      <Products />
      <PaymentMethods />
      <CTA />
    </>
  );
}
