import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useI18nStore } from '@/store/useI18nStore';

const NotFound = () => {
  const { t } = useI18nStore();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-background-page">
      <div className="text-center max-w-md">
        <h1 className="text-7xl md:text-8xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="default" size="lg">
            {t('common.back') || 'Back to Home'}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
