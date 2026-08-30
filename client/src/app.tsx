import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import NotFound from './pages/NotFound/NotFound';
import HomePage from './pages/Home/HomePage';
import ProductsPage from './pages/Products/ProductsPage';
import ProductDetailPage from './pages/Products/ProductDetailPage';
import AboutPage from './pages/About/AboutPage';
import ContactPage from './pages/Contact/ContactPage';
import CheckoutPage from './pages/Checkout/CheckoutPage';
import OrderSuccessPage from './pages/Checkout/OrderSuccessPage';
import PrivacyPage from './pages/Privacy/PrivacyPage';
import AdminLayout from './pages/Admin/AdminLayout';
import DashboardPage from './pages/Admin/DashboardPage';
import ProductsManagePage from './pages/Admin/ProductsManagePage';
import CategoriesManagePage from './pages/Admin/CategoriesManagePage';
import BannersManagePage from './pages/Admin/BannersManagePage';
import CasesManagePage from './pages/Admin/CasesManagePage';
import NewsManagePage from './pages/Admin/NewsManagePage';
import InquiriesManagePage from './pages/Admin/InquiriesManagePage';
import OrdersManagePage from './pages/Admin/OrdersManagePage';
import SettingsPage from './pages/Admin/SettingsPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:slug" element={<ProductDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="order-success" element={<OrderSuccessPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsManagePage />} />
        <Route path="categories" element={<CategoriesManagePage />} />
        <Route path="banners" element={<BannersManagePage />} />
        <Route path="cases" element={<CasesManagePage />} />
        <Route path="news" element={<NewsManagePage />} />
        <Route path="inquiries" element={<InquiriesManagePage />} />
        <Route path="orders" element={<OrdersManagePage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesComponent;
