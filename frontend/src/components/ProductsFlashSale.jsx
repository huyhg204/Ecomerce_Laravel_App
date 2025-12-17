import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { FaHeart, FaStar } from 'react-icons/fa'
import { toast } from 'sonner'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'
import { authService } from '../utils/authService'

const StarIcon = () => <FaStar className="w-6 h-6" />

const ProductsFlashSale = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [wishlistStatus, setWishlistStatus] = useState({}) // { productId: boolean }
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  })

  const saleDeadline = useMemo(() => {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + 5)
    return deadline
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [])

  // Check wishlist status khi products thay đổi
  useEffect(() => {
    if (products.length > 0 && authService.isAuthenticated()) {
      checkWishlistStatus()
    }
  }, [products])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      // Thử lấy từ API /home hoặc /products
      const response = await axiosInstance.get('/products')
      if (response.data.status === 'success') {
        const data = response.data.data
        const productsList = Array.isArray(data) ? data : (data?.products || [])
        // Chỉ lấy sản phẩm đang hoạt động (status_product === 0)
        const activeProducts = productsList.filter(product => product.status_product === 0)
        // Lấy 6 sản phẩm đầu tiên cho flash sale (ưu tiên sản phẩm có giảm giá)
        const sortedProducts = activeProducts.sort((a, b) => {
          const aHasDiscount = a.discount_percent > 0
          const bHasDiscount = b.discount_percent > 0
          if (aHasDiscount && !bHasDiscount) return -1
          if (!aHasDiscount && bHasDiscount) return 1
          return 0
        })
        
        setProducts(sortedProducts.slice(0, 6).map(product => ({
          id: product.id,
          name_product: product.name_product,
          price_product: product.discount_price || product.original_price || 0,
          original_price: product.original_price,
          discount_price: product.discount_price,
          discount_percent: product.discount_percent,
          image_product: product.image_product || '',
          discount: product.discount_percent ? `-${product.discount_percent}%` : null,
          reviews_count: product.reviews_count || 0,
          average_rating: product.average_rating || 0,
        })))
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm flash sale:', error)
      setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = saleDeadline.getTime() - now

      if (distance <= 0) return setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' })

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setTimeLeft({
        days: days.toString().padStart(2, '0'),
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0'),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [saleDeadline])

  const checkWishlistStatus = async () => {
    if (!authService.isAuthenticated()) return
    
    try {
      const response = await axiosInstance.get('/user/wishlist')
      if (response.data.status === 'success') {
        const wishlistItems = response.data.data || []
        const wishlistMap = {}
        wishlistItems.forEach(item => {
          wishlistMap[item.product_id] = true
        })
        setWishlistStatus(wishlistMap)
      }
    } catch (error) {
      // Silent fail - không hiển thị lỗi nếu không check được wishlist
      console.error('Lỗi khi kiểm tra wishlist:', error)
    }
  }

  const handleToggleWishlist = async (productId, e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!authService.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để thêm vào yêu thích. Đi đến trang đăng nhập?')) {
        navigate('/login')
      }
      return
    }

    const isInWishlist = wishlistStatus[productId]

    try {
      if (isInWishlist) {
        await axiosInstance.post('/user/wishlist/remove', { product_id: productId })
        setWishlistStatus(prev => ({ ...prev, [productId]: false }))
        toast.success('Đã xóa khỏi danh sách yêu thích')
      } else {
        await axiosInstance.post('/user/wishlist', { product_id: productId })
        setWishlistStatus(prev => ({ ...prev, [productId]: true }))
        toast.success('Đã thêm vào danh sách yêu thích')
      }
      
      // Cập nhật badge wishlist trên nav
      window.dispatchEvent(new Event('updateWishlistCount'))
    } catch (error) {
      toast.error('Không thể cập nhật danh sách yêu thích', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section_category">
          <p className="section_category_p">Trong ngày</p>
        </div>
        <div className="section_header section_header--between">
          <h3 className="section_title">Ưu đãi chớp nhoáng</h3>
          <div className="countdown">
            {Object.entries(timeLeft).map(([label, value]) => {
              const labelMap = {
                days: 'Ngày',
                hours: 'Giờ',
                minutes: 'Phút',
                seconds: 'Giây',
              }
              return (
                <div key={label} className="countdown_item">
                  <span className="countdown_value">{value}</span>
                  <span className="countdown_label">{labelMap[label]}</span>
                </div>
              )
            })}
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
            <ClipLoader color="#d32f2f" size={40} />
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
                      {product.image_product ? (
                        <img src={product.image_product} alt={product.name_product} className="card_img" />
                      ) : (
                        <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                          <span>Không có ảnh</span>
                        </div>
                      )}
                      {product.discount && <div className="card_tag">{product.discount}</div>}
                      <div className="card_top_icons">
                        <button
                          onClick={(e) => handleToggleWishlist(product.id, e)}
                          className="card_top_icon"
                          style={{
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: wishlistStatus[product.id] ? '#dc3545' : 'var(--colo-white-1)',
                            color: wishlistStatus[product.id] ? '#fff' : 'var(--colo-dark-1)'
                          }}
                          aria-label="Thêm vào yêu thích"
                        >
                          <FaHeart />
                        </button>
                      </div>
                    </div>
                    <div className="card_body">
                      <Link to={`/products/${product.id}`} className="card_title_link">
                        <h3 className="card_title">{product.name_product}</h3>
                      </Link>
                      <div className="card_price_wrapper" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {product.original_price && product.discount_price && product.original_price > product.discount_price ? (
                          <>
                            <p className="card_price" style={{ color: '#dc3545', margin: 0, fontWeight: 'bold' }}>
                              {formatCurrency(product.discount_price || product.original_price)}
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
                          <p className="card_price" style={{ margin: 0 }}>{formatCurrency(product.discount_price || product.original_price)}</p>
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
              <Link to="/collections/flash-sale" className="container_btn_a">
                XEM TẤT CẢ SẢN PHẨM
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default ProductsFlashSale