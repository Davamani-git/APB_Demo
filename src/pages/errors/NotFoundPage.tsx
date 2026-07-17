import React from 'react';
import MainLayout from '@layouts/MainLayout';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="py-10 flex justify-center">
        <div className="max-w-lg w-full">
          <Card title="Page not found">
            <p className="text-sm text-gray-600 mb-4">
              The page you are looking for does not exist. It might have been moved or removed.
            </p>
            <Button variant="primary" size="sm" onClick={() => navigate('/insights/monthly-spend')}>
              Go to Monthly Spend Dashboard
            </Button>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default NotFoundPage;
