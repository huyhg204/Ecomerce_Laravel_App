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
        // Chỉ lấy danh mục đang hoạt động (status_category === 0)
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
        params: { position: 0 } // Lấy banner cho hero slider
      })
      
      if (response.data.status === 'success') {
        const bannersData = response.data.data || []
        const bannersArray = Array.isArray(bannersData) ? bannersData : []
        // Chỉ lấy banner đang hoạt động và có ảnh
        const activeBanners = bannersArray
          .filter(banner => banner.status === 1 && banner.image)
          .map(banner => ({
            id: banner.id,
            badge: banner.badge || '',
            title: banner.title || '',
            description: banner.description || '',
            image: getImageUrl(banner.image),
            link: banner.link || '/collections/featured'
          }))
        
        setHeroSlides(activeBanners.length > 0 ? activeBanners : [
          // Fallback banner nếu không có banner nào
          {
            id: 1,
            badge: 'iPhone 15 Series',
            title: 'Voucher giảm đến 10%',
            description: 'Thiết bị cao cấp với chip A17 siêu nhanh cho mọi nhu cầu.',
            image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
            link: '/collections/featured'
          },
        ])
      } else {
        // Fallback nếu API lỗi
        setHeroSlides([{
          id: 1,
          badge: 'iPhone 15 Series',
          title: 'Voucher giảm đến 10%',
          description: 'Thiết bị cao cấp với chip A17 siêu nhanh cho mọi nhu cầu.',
          image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
          link: '/collections/featured'
        }])
      }
    } catch (error) {
      console.error('Lỗi khi lấy banner:', error)
      // Fallback nếu API lỗi
      setHeroSlides([{
        id: 1,
        badge: 'iPhone 15 Series',
        title: 'Voucher giảm đến 10%',
        description: 'Thiết bị cao cấp với chip A17 siêu nhanh cho mọi nhu cầu.',
        image: 'https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=900&q=80',
        link: '/collections/featured'
      }])
    } finally {
      setBannersLoading(false)
    }
  }

  return (
    <header className="header">
      <div className="container header_container">
        <aside className="header_filter">
          {loading ? (
            <ul className="header_filter_list">
              <li className="header_filter_item" style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                padding: '20px',
                gap: '10px'
              }}>
                <ClipLoader color="#1976d2" size={20} />
                <span style={{ fontSize: '1.2rem', color: '#666' }}>Đang tải...</span>
              </li>
            </ul>
          ) : (
            <ul className="header_filter_list">
              {categories.map((category) => {
                const categoryName = category.name_category || category.name || ''
                return (
                  <li key={category.id} className="header_filter_item">
                    <Link 
                      to={`/products?category=${encodeURIComponent(categoryName)}`} 
                      className="header_filter_link"
                    >
                      {categoryName}
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
        <div className="hero_slider">
          {bannersLoading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '400px'
            }}>
              <ClipLoader color="#1976d2" size={40} />
            </div>
          ) : heroSlides.length > 0 ? (
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
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
                        Mua ngay
                      </Link>
                    </div>
                    {slide.image && (
                      <img
                        src={slide.image}
                        alt={slide.title || 'Banner'}
                        className="hero_slide_img"
                      />
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header