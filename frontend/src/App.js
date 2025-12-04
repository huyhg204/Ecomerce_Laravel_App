import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import './css/styles.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Nav from './components/Nav'
import AdminLayout from './components/AdminLayout'
import Home from './page/Home'
import Login from './page/Login'
import Register from './page/Register'
import ForgotPassword from './page/ForgotPassword'
import VerifyOTP from './page/VerifyOTP'
import ResetPassword from './page/ResetPassword'
import Carts from './page/Carts'
import ProductsDetail from './page/ProductsDetail'
import CheckOut from './page/CheckOut'
import ProductList from './page/ProductList'
import Profile from './page/Profile'
import Orders from './page/Orders'
import OrderDetail from './page/OrderDetail'
import OrderSuccess from './page/OrderSuccess'
import WishList from './page/WishList'
import Error from './page/Error'
import AdminDashboard from './page/admin/AdminDashboard'
import AdminProducts from './page/admin/AdminProducts'
import AdminCategories from './page/admin/AdminCategories'
import AdminUsers from './page/admin/AdminUsers'
import AdminOrders from './page/admin/AdminOrders'
import AdminOrderDetail from './page/admin/AdminOrderDetail'
import AdminReviews from './page/admin/AdminReviews'
import AdminVouchers from './page/admin/AdminVouchers'
import AdminBanners from './page/admin/AdminBanners'

function App() {
  return (
    <Router>
      <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <>
                <Nav />
                <Header />
                <Home />
                <Footer />
              </>
            }
          />
          <Route path="/login" element={<><Nav /><Login /><Footer /></>} />
          <Route path="/register" element={<><Nav /><Register /><Footer /></>} />
          <Route path="/forgot-password" element={<><Nav /><ForgotPassword /><Footer /></>} />
          <Route path="/verify-otp" element={<><Nav /><VerifyOTP /><Footer /></>} />
          <Route path="/reset-password" element={<><Nav /><ResetPassword /><Footer /></>} />
          <Route path="/cart" element={<><Nav /><Carts /><Footer /></>} />
          <Route path="/products" element={<><Nav /><ProductList /><Footer /></>} />
          <Route path="/products/:id" element={<><Nav /><ProductsDetail /><Footer /></>} />
          <Route path="/checkout" element={<><Nav /><CheckOut /><Footer /></>} />
          <Route path="/profile" element={<><Nav /><Profile /><Footer /></>} />
          <Route path="/orders" element={<><Nav /><Orders /><Footer /></>} />
          <Route path="/orders/:id" element={<><Nav /><OrderDetail /><Footer /></>} />
          <Route path="/order-success" element={<><Nav /><OrderSuccess /><Footer /></>} />
          <Route path="/wishlist" element={<><Nav /><WishList /><Footer /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          } />
          <Route path="/admin/products" element={
            <AdminLayout>
              <AdminProducts />
            </AdminLayout>
          } />
          <Route path="/admin/categories" element={
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          } />
          <Route path="/admin/users" element={
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          } />
          <Route path="/admin/orders" element={
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          } />
          <Route path="/admin/orders/:id" element={
            <AdminLayout>
              <AdminOrderDetail />
            </AdminLayout>
          } />
          <Route path="/admin/reviews" element={
            <AdminLayout>
              <AdminReviews />
            </AdminLayout>
          } />
          <Route path="/admin/vouchers" element={
            <AdminLayout>
              <AdminVouchers />
            </AdminLayout>
          } />
          <Route path="/admin/banners" element={
            <AdminLayout>
              <AdminBanners />
            </AdminLayout>
          } />
          
          <Route path="*" element={<><Nav /><Error /><Footer /></>} />
      </Routes>
      <Toaster position="top-right" richColors expand={true} />
    </Router>
  )
}

export default App
