import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { axiosInstance } from '../utils/axiosConfig'
import { getImageUrl } from '../utils/imageHelper'

const BannerSingle = () => {
  const [banner, setBanner] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBanner()
  }, [])

  const fetchBanner = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/banners', {
        params: { position: 1 } // Lấy banner single
      })
      
      if (response.data.status === 'success') {
        const bannersData = response.data.data || []
        const bannersArray = Array.isArray(bannersData) ? bannersData : []
        const activeBanner = bannersArray.find(b => b.status === 1 && b.image)
        
        if (activeBanner) {
          setBanner({
            id: activeBanner.id,
            badge: activeBanner.badge || 'Trending',
            title: activeBanner.title || '',
            description: activeBanner.description || '',
            image: getImageUrl(activeBanner.image),
            link: activeBanner.link || '/products'
          })
        } else {
          handleFallback()
        }
      } else {
        handleFallback()
      }
    } catch (error) {
      console.error('Lỗi khi lấy banner:', error)
      handleFallback()
    } finally {
      setLoading(false)
    }
  }

  // Dữ liệu mặc định nếu API lỗi hoặc chưa có banner (Giống thiết kế trong ảnh)
  const handleFallback = () => {
    setBanner({
      id: 'fallback',
      badge: 'New Style',
      title: 'Nâng Tầm Phong Cách Của Bạn',
      description: 'Khám phá bộ sưu tập thời trang đường phố độc đáo, thể hiện cá tính riêng biệt của Gen Z.',
      // Ảnh fashion ngầu, nền tối phù hợp với banner đen
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
      link: '/products'
    })
  }

  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <ClipLoader color="#d32f2f" size={30} />
          </div>
        </div>
      </section>
    )
  }

  if (!banner) return null

  return (
    <section className="section">
      <div className="container">
        <div className="trending">
          <div className="trending_content">
            {banner.badge && <p className="trending_p">{banner.badge}</p>}
            {banner.title && <h2 className="trending_title">{banner.title}</h2>}
            {banner.description && (
              <div className="trending_stats" style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '1.4rem', color: '#ccc', lineHeight: '1.6' }}>{banner.description}</p>
              </div>
            )}
            <Link to={banner.link} className="trending_btn">
              MUA NGAY
            </Link>
          </div>
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title || 'Banner'}
              className="trending_img"
              style={{ objectFit: 'cover' }}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default BannerSingle