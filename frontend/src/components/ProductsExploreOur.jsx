import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { FaHeart, FaEye, FaStar } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'

const ProductsExploreOur = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/products')
      if (response.data.status === 'success') {
        const data = response.data.data
        const productsList = Array.isArray(data) ? data : (data?.products || [])
        // Chỉ lấy sản phẩm đang hoạt động (status_product === 0)
        const activeProducts = productsList.filter(product => product.status_product === 0)
        // Lấy 8 sản phẩm đầu tiên
        setProducts(activeProducts.slice(0, 8).map(product => ({
          id: product.id,
          title: product.name_product,
          price_product: product.discount_price || product.price_product || 0,
          original_price: product.original_price,
          discount_price: product.discount_price,
          discount_percent: product.discount_percent,
          image: product.image_product || '',
          discount: product.discount_percent ? `-${product.discount_percent}%` : null,
          reviews_count: product.reviews_count || 0,
          average_rating: product.average_rating || 0,
          badge: product.badge || '',
        })))
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm:', error)
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="section">
      <div className="container">
        <div className="section_category">
          <p className="section_category_p">Sản phẩm của chúng tôi</p>
        </div>
        <div className="section_header section_header--between">
          <h3 className="section_title">Khám phá sản phẩm</h3>
          <div className="section_arrows">
            <button aria-label="Sản phẩm trước" className="section_arrow">
              ‹
            </button>
            <button aria-label="Sản phẩm kế tiếp" className="section_arrow">
              ›
            </button>
          </div>
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
              Đang tải sản phẩm...
            </p>
          </div>
        ) : error ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '300px',
            padding: '40px 0'
          }}>
            <p style={{ color: 'red' }}>{error}</p>
          </div>
        ) : products.length === 0 ? null : (
          <>
            <div className="products">
              {products.map((product) => (
                <div key={product.id} className="card">
                  <div className="card_top">
                    {product.image ? (
                      <img src={product.image} alt={product.title} className="card_img" />
                    ) : (
                      <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                        <span>Không có ảnh</span>
                      </div>
                    )}
                    {product.discount && <div className="card_tag">{product.discount}</div>}
                    {product.badge && <div className="card_tag card_tag--new">{product.badge}</div>}
                    <div className="card_top_icons">
                      <FaHeart className="card_top_icon" />
                      <FaEye className="card_top_icon" />
                    </div>
                  </div>
                  <div className="card_body">
                    <Link to={`/products/${product.id}`} className="card_title_link">
                      <h3 className="card_title">{product.title}</h3>
                    </Link>
                    <div className="card_price_wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {product.original_price && product.original_price > (product.discount_price || product.price_product) ? (
                        <>
                          <p className="card_price" style={{ color: '#dc3545', margin: 0, fontWeight: 'bold' }}>
                            {formatCurrency(product.discount_price || product.price_product)}
                          </p>
                          <p style={{ 
                            fontSize: '1.2rem', 
                            color: '#999', 
                            textDecoration: 'line-through',
                            margin: 0
                          }}>
                            {formatCurrency(product.original_price)}
                          </p>
                        </>
                      ) : (
                        <p className="card_price" style={{ margin: 0 }}>{formatCurrency(product.price_product)}</p>
                      )}
                    </div>
                    <div className="card_ratings">
                      <div className="card_stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar 
                            key={index}
                            className={`w-6 h-6 ${index < Math.floor(product.average_rating || 0) ? 'active' : ''}`}
                          />
                        ))}
                      </div>
                      <p className="card_rating_numbers">({product.reviews_count || 0})</p>
                    </div>
                    <Link
                      to={`/products/${product.id}`}
                      className="add_to_cart add_to_cart--inline"
                      style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="container_btn">
              <Link to="/collections/all" className="container_btn_a">
                XEM TOÀN BỘ
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductsExploreOur