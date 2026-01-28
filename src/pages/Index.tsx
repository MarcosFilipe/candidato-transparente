import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { SearchContainer } from '@/features/search/SearchContainer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <SearchContainer />
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default Index;
