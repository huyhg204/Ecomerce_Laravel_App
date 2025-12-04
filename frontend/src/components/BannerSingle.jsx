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
        // Lấy banner đầu tiên đang hoạt động và có ảnh
        const activeBanner = bannersArray.find(b => b.status === 1 && b.image)
        
        if (activeBanner) {
          setBanner({
            id: activeBanner.id,
            badge: activeBanner.badge || 'Danh mục',
            title: activeBanner.title || '',
            description: activeBanner.description || '',
            image: getImageUrl(activeBanner.image),
            link: activeBanner.link || '/collections/featured'
          })
        } else {
          // Fallback banner nếu không có
          setBanner(null)
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy banner:', error)
      setBanner(null)
    } finally {
      setLoading(false)
    }
  }

  // Nếu không có banner, không hiển thị gì cả
  if (loading) {
    return (
      <section className="section">
        <div className="container">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '200px'
          }}>
            <ClipLoader color="#1976d2" size={30} />
          </div>
        </div>
      </section>
    )
  }

  if (!banner) {
    return null // Không hiển thị nếu không có banner
  }

  return (
    <section className="section">
      <div className="container">
        <div className="trending">
          <div className="trending_content">
            {banner.badge && <p className="trending_p">{banner.badge}</p>}
            {banner.title && <h2 className="trending_title">{banner.title}</h2>}
            {banner.description && (
              <div className="trending_stats" style={{ marginTop: '20px' }}>
                <p style={{ fontSize: '1.4rem', color: '#666' }}>{banner.description}</p>
              </div>
            )}
            <Link to={banner.link} className="trending_btn">
              Mua ngay
            </Link>
          </div>
          {banner.image && (
            <img
              src={banner.image}
              alt={banner.title || 'Banner'}
              className="trending_img"
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default BannerSingle