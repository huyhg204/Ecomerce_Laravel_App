import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { axiosInstance } from '../utils/axiosConfig'
import { getImageUrl } from '../utils/imageHelper'

const Header = () => {
  const [categories, setCategories] = useState([])
  const [heroSlides, setHeroSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [bannersLoading, setBannersLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
    fetchBanners()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/categories')
      if (response.data.status === 'success') {
        const data = response.data.data
        const categoriesList = Array.isArray(data) ? data : (data?.categories || [])
        const activeCategories = categoriesList.filter(category => category.status_category === 0)
        setCategories(activeCategories)
      } else {
        setCategories([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error)
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  const fetchBanners = async () => {
    try {
      setBannersLoading(true)
      const response = await axiosInstance.get('/banners', {
        params: { position: 0 } // Hero slider
      })
      
      if (response.data.status === 'success') {
        const bannersData = response.data.data || []
        const bannersArray = Array.isArray(bannersData) ? bannersData : []
        const activeBanners = bannersArray
          .filter(banner => banner.status === 1 && banner.image)
          .map(banner => ({
            id: banner.id,
            badge: banner.badge || '',
            title: banner.title || '',
            description: banner.description || '',
            image: getImageUrl(banner.image),
            link: banner.link || '/products'
          }))
        
        setHeroSlides(activeBanners.length > 0 ? activeBanners : getFallbackSlides())
      } else {
        setHeroSlides(getFallbackSlides())
      }
    } catch (error) {
      console.error('Lỗi khi lấy banner:', error)
      setHeroSlides(getFallbackSlides())
    } finally {
      setBannersLoading(false)
    }
  }

  // Dữ liệu mặc định chuẩn Fashion (Giống ảnh thiết kế)
  const getFallbackSlides = () => [
    {
      id: 1,
      badge: 'Summer Sale',
      title: 'Giảm Giá Lên Đến 50%',
      description: 'Săn ngay những bộ outfit cực chất cho mùa hè này. Số lượng có hạn!',
      // Ảnh cô gái đeo kính râm, nền vàng/sáng giống ảnh mẫu
      image: 'https://images.unsplash.com/photo-1507086183495-2d9326e2e259?auto=format&fit=crop&w=900&q=80',
      link: '/products'
    },
    {
      id: 2,
      badge: 'New Collection',
      title: 'Thời Trang Gen Z',
      description: 'Định hình phong cách cá nhân với các thiết kế mới nhất.',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80',
      link: '/products'
    }
  ]

  return (
    <header className="header">
      <div className="container header_container">
        <aside className="header_filter">
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <ClipLoader color="#d32f2f" size={20} />
            </div>
          ) : (
            <ul className="header_filter_list">
              {categories.map((category) => (
                <li key={category.id} className="header_filter_item">
                  <Link 
                    to={`/products?category=${encodeURIComponent(category.name_category)}`} 
                    className="header_filter_link"
                  >
                    {category.name_category}
                  </Link>
                </li>
              ))}
              {/* Fallback categories nếu API trống để layout không bị gãy */}
              {categories.length === 0 && ['Áo Thun', 'Áo Khoác', 'Quần Jeans', 'Váy', 'Phụ Kiện'].map((item, index) => (
                 <li key={index} className="header_filter_item">
                   <Link to="/products" className="header_filter_link">{item}</Link>
                 </li>
              ))}
            </ul>
          )}
        </aside>
        
        <div className="hero_slider">
          {bannersLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
              <ClipLoader color="#d32f2f" size={40} />
            </div>
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              loop={heroSlides.length > 1}
              className="hero_swiper"
            >
              {heroSlides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="hero_slide">
                    <div className="hero_slide_content">
                      {slide.badge && <p className="hero_slide_badge">{slide.badge}</p>}
                      {slide.title && <h2 className="hero_slide_title">{slide.title}</h2>}
                      {slide.description && <p className="hero_slide_desc">{slide.description}</p>}
                      <Link to={slide.link} className="hero_cta">
                        MUA NGAY
                      </Link>
                    </div>
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="hero_slide_img"
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header