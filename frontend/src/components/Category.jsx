import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import {
  FaMobileAlt,
  FaLaptop,
  FaClock,
  FaCamera,
  FaHeadphonesAlt,
  FaGamepad,
  FaTshirt,
  FaFemale,
  FaMale,
  FaRunning,
  FaBed,
  FaGem,
  FaShoePrints,
} from 'react-icons/fa'
import { axiosInstance } from '../utils/axiosConfig'
import { getImageUrl } from '../utils/imageHelper'

// Icon mapping cho các category
const iconMap = {
  'Điện thoại': FaMobileAlt,
  'Smartphone': FaMobileAlt,
  'Máy tính': FaLaptop,
  'Laptop': FaLaptop,
  'Đồng hồ thông minh': FaClock,
  'Wearable': FaClock,
  'Máy ảnh': FaCamera,
  'Camera': FaCamera,
  'Tai nghe': FaHeadphonesAlt,
  'Audio': FaHeadphonesAlt,
  'Thiết bị gaming': FaGamepad,
  'Gaming': FaGamepad,
  // Danh mục thời trang
  'Áo Nam': FaTshirt,
  'Áo Nữ': FaTshirt,
  'Quần Nam': FaMale,
  'Quần Nữ': FaFemale,
  'Váy Đầm': FaFemale,
  'Áo Khoác': FaTshirt,
  'Đồ Thể Thao': FaRunning,
  'Đồ Ngủ': FaBed,
  'Phụ Kiện': FaGem,
  'Giày Dép': FaShoePrints,
  'default': FaMobileAlt,
}

// Component con để quản lý state cho từng category item
const CategoryItem = ({ category, getIcon }) => {
  const [imageError, setImageError] = useState(false)
  const categoryName = category.name_category || category.name || ''
  const Icon = getIcon(categoryName)
  const categoryImage = category.image_category

  return (
    <Link
      to={`/products?category=${encodeURIComponent(categoryName)}`}
      className="category"
      style={{
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)'
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <span 
        className="category_icon_wrapper"
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {categoryImage && !imageError ? (
          <img
            src={getImageUrl(categoryImage)}
            alt={categoryName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon 
            className="category_icon" 
            style={{
              fontSize: '2.5rem',
              color: '#d32f2f'
            }}
          />
        )}
      </span>
      <p 
        className="category_name"
        style={{
          margin: 0,
          fontSize: '1.4rem',
          fontWeight: '600',
          color: '#333',
          textAlign: 'center'
        }}
      >
        {categoryName}
      </p>
    </Link>
  )
}

const Category = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
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

  const getIcon = (categoryName) => {
    const Icon = iconMap[categoryName] || iconMap.default
    return Icon
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section_category">
          <p className="section_category_p">Danh mục</p>
        </div>
        <div className="section_header">
          <h3 className="section_title">Khám phá theo danh mục</h3>
        </div>
        {loading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px',
            padding: '40px 0',
            gap: '15px'
          }}>
            <ClipLoader color="#d32f2f" size={40} />
            <p style={{ fontSize: '1.4rem', color: '#666' }}>
              Đang tải danh mục...
            </p>
          </div>
        ) : categories.length === 0 ? null : (
          <div className="categories">
            {categories.map((category) => (
              <CategoryItem 
                key={category.id} 
                category={category} 
                getIcon={getIcon}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Category