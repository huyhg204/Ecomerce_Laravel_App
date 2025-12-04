import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FaHeart, FaEye, FaStar } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'

const HeartIcon = () => <FaHeart className="card_top_icon" />

const EyeIcon = () => <FaEye className="card_top_icon" />

const StarIcon = () => <FaStar className="w-6 h-6" />

const ProductsBestSelling = () => {
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
        // Lấy 4 sản phẩm đầu tiên cho best selling
        setProducts(activeProducts.slice(0, 4).map(product => ({
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
        })))
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm bán chạy:', error)
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
          <p className="section_category_p">Tháng này</p>
        </div>
        <div className="section_header section_header--between">
          <h3 className="section_title">Sản phẩm bán chạy</h3>
          <Link to="/products" className="section_btn section_btn--primary">
            Xem tất cả
          </Link>
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
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              slidesPerView={1}
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 24 },
              }}
              className="mySwiper"
            >
                {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <div className="card">
                    <div className="card_top">
                      {product.image ? (
                        <img src={product.image} alt={product.title} className="card_img" />
                      ) : (
                        <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                          <span>Không có ảnh</span>
                        </div>
                      )}
                      {product.discount && <div className="card_tag">{product.discount}</div>}
                      <div className="card_top_icons">
                        <HeartIcon />
                        <EyeIcon />
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
                            <StarIcon 
                              key={index} 
                              className={index < Math.floor(product.average_rating || 0) ? 'active' : ''}
                            />
                          ))}
                        </div>
                        <p className="card_rating_numbers">({product.reviews_count || 0})</p>
                      </div>
                      <Link
                        to={`/products/${product.id}`}
                        className="add_to_cart"
                        style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="container_btn">
              <Link to="/collections/best-selling" className="container_btn_a">
                XEM TẤT CẢ SẢN PHẨM
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductsBestSelling