import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaArrowLeft, FaEnvelope, FaLock } from 'react-icons/fa'
import { axiosInstance } from '../utils/axiosConfig'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!email.trim()) {
      setError('Vui lòng nhập email')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email không hợp lệ')
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/forgot-password', { email })
      
      if (response.data.status === 'success') {
        setSuccess(true)
        toast.success('Gửi OTP thành công!', {
          description: 'Mã OTP đã được gửi đến email của bạn.',
        })
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        const errorMessage = errorData.errors 
          ? (Array.isArray(Object.values(errorData.errors)[0]) ? Object.values(errorData.errors)[0][0] : Object.values(errorData.errors)[0])
          : (errorData.message || 'Không thể gửi OTP. Vui lòng thử lại sau.')
        
        setError(errorMessage)
        toast.error('Gửi OTP thất bại', { description: errorMessage })
      } else {
        setError('Lỗi kết nối server.')
        toast.error('Lỗi kết nối')
      }
    } finally {
      setLoading(false)
    }
  }

  // --- Màn hình thông báo thành công ---
  if (success) {
    return (
      <section className="section" style={{ backgroundColor: '#f8f9fa', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container">
          <div style={{ 
            maxWidth: '500px', 
            margin: '0 auto',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '40px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#ffebee', // Nền đỏ nhạt
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <FaEnvelope style={{ fontSize: '36px', color: '#d32f2f' }} />
            </div>
            
            <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '16px' }}>
              Kiểm tra email của bạn
            </h2>
            
            <p style={{ fontSize: '1.5rem', color: '#666', marginBottom: '32px', lineHeight: '1.6' }}>
              Chúng tôi đã gửi mã OTP đến <strong>{email}</strong>.<br/>
              Vui lòng nhập mã OTP để đặt lại mật khẩu.
            </p>

            <button
              onClick={() => navigate('/verify-otp', { state: { email } })}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#d32f2f',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.6rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'background 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#b71c1c'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#d32f2f'}
            >
              Nhập mã OTP
            </button>

            <div style={{ fontSize: '1.4rem', color: '#666' }}>
              Chưa nhận được email?{' '}
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d32f2f',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Gửi lại
              </button>
            </div>
            
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', fontSize: '1.4rem', fontWeight: '500' }}>
                <FaArrowLeft /> Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // --- Màn hình nhập Email ---
  return (
    <section className="section" style={{ backgroundColor: '#f8f9fa', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container">
        <div style={{ 
          maxWidth: '450px', 
          margin: '0 auto', 
          backgroundColor: '#fff', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)' 
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ width: '60px', height: '60px', backgroundColor: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <FaLock style={{ fontSize: '24px', color: '#333' }} />
            </div>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '8px' }}>Quên mật khẩu?</h2>
            <p style={{ fontSize: '1.4rem', color: '#666' }}>Đừng lo, hãy nhập email để lấy lại mật khẩu.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                padding: '12px',
                borderRadius: '6px',
                marginBottom: '20px',
                fontSize: '1.3rem',
                border: '1px solid #ffcdd2',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '1.4rem', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Email đăng ký</label>
              <div style={{ position: 'relative' }}>
                <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999', fontSize: '1.4rem' }} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    fontSize: '1.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#d32f2f'
                    e.target.style.boxShadow = '0 0 0 3px rgba(211, 47, 47, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e0e0e0'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#d32f2f', // Màu đỏ thương hiệu
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1.6rem',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.3s',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => { if(!loading) e.target.style.backgroundColor = '#b71c1c' }}
              onMouseLeave={(e) => { if(!loading) e.target.style.backgroundColor = '#d32f2f' }}
            >
              {loading ? (
                <>
                  <ClipLoader color="#fff" size={20} /> Đang gửi...
                </>
              ) : 'Gửi mã OTP'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Link to="/login" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#333',
              textDecoration: 'none',
              fontSize: '1.4rem',
              fontWeight: '500',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#d32f2f'}
            onMouseLeave={(e) => e.target.style.color = '#333'}
            >
              <FaArrowLeft /> Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword