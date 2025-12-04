import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaArrowLeft, FaEnvelope } from 'react-icons/fa'
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
          description: 'Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến.',
        })
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0]
          const errorMessage = Array.isArray(firstError) ? firstError[0] : firstError
          setError(errorMessage)
          toast.error('Gửi OTP thất bại', {
            description: errorMessage,
          })
        } else {
          const errorMessage = errorData.message || 'Không thể gửi OTP. Vui lòng thử lại sau.'
          setError(errorMessage)
          toast.error('Gửi OTP thất bại', {
            description: errorMessage,
          })
        }
      } else {
        setError('Không thể kết nối đến server. Vui lòng thử lại sau.')
        toast.error('Lỗi kết nối', {
          description: 'Không thể kết nối đến server. Vui lòng thử lại sau.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="section">
        <div className="auth_container">
          <div className="auth_content" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '30px',
              borderRadius: '10px',
              textAlign: 'center',
              border: '2px solid #4caf50'
            }}>
              <FaEnvelope style={{
                fontSize: '60px',
                color: '#4caf50',
                marginBottom: '20px'
              }} />
              <h2 style={{ fontSize: '2rem', color: '#4caf50', marginBottom: '15px' }}>
                Email đã được gửi!
              </h2>
              <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
                Chúng tôi đã gửi mã OTP đến email <strong>{email}</strong>. 
                Vui lòng kiểm tra hộp thư đến và nhập mã OTP để tiếp tục.
              </p>
              <button
                onClick={() => navigate('/verify-otp', { state: { email } })}
                style={{
                  padding: '12px 30px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  marginBottom: '15px'
                }}
              >
                Nhập mã OTP
              </button>
              <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '20px' }}>
                Không nhận được email?{' '}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#1976d2',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: '1.2rem'
                  }}
                >
                  Gửi lại
                </button>
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link to="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '1.4rem'
              }}>
                <FaArrowLeft />
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="auth_container">
        <div className="auth_content">
          <form className="auth_form" onSubmit={handleSubmit}>
            <h2 className="form_title">Quên mật khẩu</h2>
            <p className="auth_p">Nhập email của bạn để nhận mã OTP đặt lại mật khẩu</p>
            
            {error && (
              <div className="form_group" style={{
                color: '#d32f2f',
                backgroundColor: '#ffebee',
                padding: '12px 15px',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '1.3rem'
              }}>
                {error}
              </div>
            )}

            <div className="form_group">
              <input
                type="email"
                placeholder="Email đăng ký"
                className="form_input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                required
                disabled={loading}
              />
            </div>

            <div className="form_group">
              <button
                type="submit"
                className="form_btn"
                disabled={loading}
                style={{ position: 'relative' }}
              >
                {loading ? (
                  <span className="form_link" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}>
                    <ClipLoader color="#fff" size={16} />
                    Đang gửi...
                  </span>
                ) : (
                  <span className="form_link">Gửi mã OTP</span>
                )}
              </button>
            </div>

            <div className="form_group" style={{ textAlign: 'center' }}>
              <Link to="/login" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1976d2',
                textDecoration: 'none',
                fontSize: '1.4rem'
              }}>
                <FaArrowLeft />
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword
