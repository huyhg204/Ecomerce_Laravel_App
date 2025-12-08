import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaTrash, FaEye, FaHeart, FaStar } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'
import { authService } from '../utils/authService'

const WishList = () => {
  const navigate = useNavigate()
  const [wishlistItems, setWishlistItems] = useState([])
  const [justForYouProducts, setJustForYouProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    fetchWishlist()
    fetchJustForYou()
  }, [navigate])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get('/user/wishlist')
      if (response.data.status === 'success') {
        const items = response.data.data.map(item => ({
          id: item.id,
          product_id: item.product_id,
          title: item.name_product,
          price: item.price_product || 0,
          image: item.image_product || '',
          stock: item.quantity_product || 0,
          description: item.description_product || '',
        }))
        setWishlistItems(items)
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy wishlist:', error)
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Vui lòng đăng nhập để xem danh sách yêu thích')
      } else {
        setError('Không thể tải danh sách yêu thích. Vui lòng thử lại sau.')
      }
      setWishlistItems([])
    } finally {
      setLoading(false)
    }
  }

  const fetchJustForYou = async () => {
    try {
      const response = await axiosInstance.get('/products')
      if (response.data.status === 'success') {
        const data = response.data.data
        const productsList = Array.isArray(data) ? data : (data?.products || [])
        setJustForYouProducts(productsList.slice(0, 4).map(product => ({
          id: product.id,
          title: product.name_product,
          price: product.price_product || 0,
          image: product.image_product || '',
          rating: product.rating || 4.0,
          reviews: product.reviews_count || 0,
          discount: product.discount || '',
        })))
      } else {
        setJustForYouProducts([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error)
      setJustForYouProducts([])
    }
  }

  const handleRemoveFromWishlist = async (id) => {
    try {
      await axiosInstance.delete(`/user/wishlist/${id}`)
      setWishlistItems(wishlistItems.filter((item) => item.id !== id))
      toast.success('Đã xóa khỏi danh sách yêu thích')
      
      // *** CẬP NHẬT BADGE WISHLIST TRÊN NAV ***
      window.dispatchEvent(new Event('updateWishlistCount'))

    } catch (error) {
      toast.error('Không thể xóa sản phẩm', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    }
  }



  return (
    <div>
      {/* Breadcrumbs */}
      <section className="breadcrumb_section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb_link">
              Trang chủ
            </Link>
            <span className="breadcrumb_separator"> / </span>
            <span className="breadcrumb_current">Danh sách yêu thích</span>
          </nav>
        </div>
      </section>

      {/* Wishlist Section */}
      <section className="section">
        <div className="container">
          {error && (
            <div style={{ color: 'red', marginBottom: '20px' }}>
              {error}
            </div>
          )}
          <div className="wishlist_header">
            <h2 className="wishlist_title">Danh sách yêu thích ({wishlistItems.length})</h2>
          </div>

          {loading ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px',
              padding: '40px 0',
              gap: '15px'
            }}>
              <ClipLoader color="#1976d2" size={40} />
              <p style={{ fontSize: '1.4rem', color: '#666' }}>
                Đang tải danh sách yêu thích...
              </p>
            </div>
          ) : wishlistItems.length === 0 ? (
            <div className="wishlist_empty">
              <FaHeart className="wishlist_empty_icon" />
              <p className="wishlist_empty_text">Danh sách yêu thích của bạn đang trống</p>
              <Link to="/products" className="wishlist_empty_link">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="wishlist_grid">
              {wishlistItems.map((product) => (
                <div key={product.id} className="card">
                  <div className="card_top">
                    <Link to={`/products/${product.id}`}>
                      {product.image ? (
                        <img src={product.image} alt={product.title || product.name_product} className="card_img" />
                      ) : (
                        <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                          <span>Không có ảnh</span>
                        </div>
                      )}
                    </Link>
                    {product.discount && (
                      <div className="card_tag">{product.discount}</div>
                    )}
                    <button
                      className="wishlist_remove_btn"
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      aria-label="Xóa khỏi danh sách yêu thích"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="card_body">
                    <Link to={`/products/${product.id}`} className="card_title_link">
                      <h3 className="card_title">{product.title || product.name_product}</h3>
                    </Link>
                    <div className="card_price_wrapper">
                      <p className="card_price">{formatCurrency(product.price || product.price_product || 0)}</p>
                      {product.originalPrice && (
                        <p className="card_price_original">
                          {formatCurrency(product.originalPrice)}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/products/${product.product_id || product.id}`}
                      className="add_to_cart wishlist_add_to_cart"
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                      }}
                    >
                      <FaEye /> Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Just For You Section */}
      <section className="section">
        <div className="container">
          <div className="wishlist_section_header">
            <div className="wishlist_section_header_left">
              <div className="wishlist_section_bar"></div>
              <h3 className="wishlist_section_title">Dành cho bạn</h3>
            </div>
            <Link to="/products" className="wishlist_see_all_btn">
              Xem tất cả
            </Link>
          </div>

          {justForYouProducts.length === 0 ? null : (
            <div className="wishlist_grid">
              {justForYouProducts.map((product) => (
                <div key={product.id} className="card">
                  <div className="card_top">
                    <Link to={`/products/${product.id}`}>
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="card_img" />
                      ) : (
                        <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                          <span>Không có ảnh</span>
                        </div>
                      )}
                    </Link>
                    {product.discount && (
                      <div className="card_tag">{product.discount}</div>
                    )}
                    {product.badge && (
                      <div className="card_tag card_tag--new">{product.badge}</div>
                    )}
                    <div className="card_top_icons">
                      <button className="card_top_icon_btn" aria-label="Yêu thích">
                        <FaHeart />
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="card_top_icon_btn"
                        aria-label="Xem nhanh"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </div>
                  <div className="card_body">
                    <Link to={`/products/${product.id}`} className="card_title_link">
                      <h3 className="card_title">{product.title}</h3>
                    </Link>
                    <div className="card_price_wrapper">
                      <p className="card_price">{formatCurrency(product.price)}</p>
                      {product.originalPrice && (
                        <p className="card_price_original">
                          {formatCurrency(product.originalPrice)}
                        </p>
                      )}
                    </div>
                    <div className="card_ratings">
                      <div className="card_stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar
                            key={index}
                            className={`w-6 h-6 ${index < Math.floor(product.rating) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <p className="card_rating_numbers">({product.reviews})</p>
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="add_to_cart"
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default WishList