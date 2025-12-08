import React from 'react'
import { Link } from 'react-router-dom'
import { FaTruck, FaCheckCircle, FaUsers, FaMedal } from 'react-icons/fa'

const About = () => {
  return (
    <div>
      {/* Breadcrumbs */}
      <section className="breadcrumb_section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb_link">Trang chủ</Link>
            <span className="breadcrumb_separator"> / </span>
            <span className="breadcrumb_current">Giới thiệu</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="section" style={{ paddingBottom: '0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 50px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', textTransform: 'uppercase' }}>
              Về SaigonGenZ
            </h1>
            <p style={{ fontSize: '1.4rem', color: '#666', lineHeight: '1.6' }}>
              Nơi định hình phong cách cho thế hệ trẻ. Chúng tôi không chỉ bán quần áo, chúng tôi bán sự tự tin và cá tính.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
            {/* Image Placeholder */}
            <div style={{ borderRadius: '8px', overflow: 'hidden', height: '400px', backgroundColor: '#f0f0f0' }}>
              <img 
                src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Our Story" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            
            {/* Content */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Câu chuyện thương hiệu</h2>
              <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                Được thành lập vào năm 2023, SaigonGenZ bắt đầu với một ý tưởng đơn giản: Thời trang chất lượng cao không nhất thiết phải đắt đỏ. Chúng tôi lấy cảm hứng từ nhịp sống năng động của Sài Gòn và tinh thần phóng khoáng của thế hệ Gen Z.
              </p>
              <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '25px', lineHeight: '1.6' }}>
                Từ những chiếc áo thun basic đến những bộ outfit street style phá cách, mỗi sản phẩm của SaigonGenZ đều được chọn lọc kỹ càng để đảm bảo bạn luôn nổi bật.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '1.3rem', fontWeight: '500' }}>Thiết kế độc quyền</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '1.3rem', fontWeight: '500' }}>Chất liệu cao cấp</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '1.3rem', fontWeight: '500' }}>Giao hàng hỏa tốc</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FaCheckCircle style={{ color: '#d32f2f', fontSize: '1.2rem' }} />
                  <span style={{ fontSize: '1.3rem', fontWeight: '500' }}>Đổi trả dễ dàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section" style={{ backgroundColor: '#f9f9f9' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '30px', textAlign: 'center' }}>
            {[
              { icon: <FaUsers />, num: '10,000+', text: 'Khách hàng hài lòng' },
              { icon: <FaTruck />, num: '50+', text: 'Tỉnh thành phục vụ' },
              { icon: <FaMedal />, num: '100%', text: 'Cam kết chính hãng' },
              { icon: <FaUsers />, num: '24/7', text: 'Hỗ trợ khách hàng' },
            ].map((item, index) => (
              <div key={index} style={{ padding: '20px' }}>
                <div style={{ fontSize: '2.5rem', color: '#d32f2f', marginBottom: '10px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '5px' }}>{item.num}</h3>
                <p style={{ fontSize: '1.3rem', color: '#666' }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>Sẵn sàng thay đổi phong cách?</h2>
          <Link 
            to="/products" 
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: '#d32f2f', // Màu đỏ giống nút "Xem chi tiết"
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b71c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#d32f2f'}
          >
            MUA SẮM NGAY
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About