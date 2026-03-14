import { HomeFeatures } from "@/components/home/features";
import { HomeFooter } from "@/components/home/footer";
import { HomeHero } from "@/components/home/hero";
import { HomeNavigation } from "@/components/home/navigation";
import { ProductPreview } from "@/components/home/product-preview";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNavigation />
      <HomeHero />
      <ProductPreview />
      <HomeFeatures />
      <HomeFooter />
    </div>
  );
}