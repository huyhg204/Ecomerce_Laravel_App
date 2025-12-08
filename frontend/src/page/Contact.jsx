import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Giả lập gửi form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Vui lòng điền đầy đủ thông tin!')
      return
    }
    
    toast.success('Gửi tin nhắn thành công!', {
      description: 'Chúng tôi sẽ phản hồi bạn sớm nhất có thể.'
    })
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 15px',
    marginBottom: '20px',
    border: '1px solid #e0e0e0',
    borderRadius: '4px',
    fontSize: '1.4rem',
    outline: 'none',
    transition: 'border-color 0.3s'
  }

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    marginBottom: '25px'
  }

  return (
    <div>
      {/* Breadcrumbs */}
      <section className="breadcrumb_section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb_link">Trang chủ</Link>
            <span className="breadcrumb_separator"> / </span>
            <span className="breadcrumb_current">Liên hệ</span>
          </nav>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '50px' }}>
            
            {/* Form Column */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '10px' }}>Gửi tin nhắn cho chúng tôi</h2>
              <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '30px' }}>
                Bạn có thắc mắc về sản phẩm hay đơn hàng? Đừng ngần ngại để lại lời nhắn.
              </p>

              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Họ tên của bạn" 
                    style={inputStyle}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Email" 
                    style={inputStyle}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <input 
                  type="text" 
                  name="subject"
                  placeholder="Tiêu đề" 
                  style={inputStyle}
                  value={formData.subject}
                  onChange={handleChange}
                />
                <textarea 
                  name="message"
                  placeholder="Nội dung tin nhắn..." 
                  rows="5" 
                  style={{ ...inputStyle, resize: 'vertical' }}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                
                <button 
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px 35px',
                    backgroundColor: '#d32f2f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b71c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#d32f2f'}
                >
                  <FaPaperPlane /> GỬI TIN NHẮN
                </button>
              </form>
            </div>

            {/* Info Column */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '40px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '30px' }}>Thông tin liên hệ</h2>
              
              <div style={contactItemStyle}>
                <div style={{ color: '#d32f2f', fontSize: '1.8rem', marginTop: '3px' }}><FaMapMarkerAlt /></div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Địa chỉ</h4>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>

              <div style={contactItemStyle}>
                <div style={{ color: '#d32f2f', fontSize: '1.8rem', marginTop: '3px' }}><FaPhoneAlt /></div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Điện thoại</h4>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>0909 123 456</p>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>028 3822 5588</p>
                </div>
              </div>

              <div style={contactItemStyle}>
                <div style={{ color: '#d32f2f', fontSize: '1.8rem', marginTop: '3px' }}><FaEnvelope /></div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Email</h4>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>support@saigongenz.com</p>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>career@saigongenz.com</p>
                </div>
              </div>

              <div style={contactItemStyle}>
                <div style={{ color: '#d32f2f', fontSize: '1.8rem', marginTop: '3px' }}><FaClock /></div>
                <div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>Giờ làm việc</h4>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>Thứ 2 - Thứ 6: 8:00 - 21:00</p>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>Thứ 7 - CN: 9:00 - 22:00</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="section" style={{ paddingBottom: '0' }}>
        <div style={{ width: '100%', height: '450px', filter: 'grayscale(0.8)' }}>
           <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4945199616056!2d106.70175551535624!3d10.773380262196652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f468202b8d5%3A0x633d45d1341643c7!2zTmd1eeG7hW4gSHXhu4csQuG6v24gTmdow6ksIFF14bqtbi 1,IEhvIENoaSBNaW5oIENpdHksIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1626340244673!5m2!1sen!2s" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen="" 
             loading="lazy"
             title="SaigonGenZ Map"
           ></iframe>
        </div>
      </section>
    </div>
  )
}

export default Contact