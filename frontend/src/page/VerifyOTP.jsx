import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaArrowLeft, FaKey } from 'react-icons/fa'
import { axiosInstance } from '../utils/axiosConfig'

const VerifyOTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 phút = 600 giây
  const inputRefs = useRef([])

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password')
      return
    }

    // Đếm ngược thời gian
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // Chỉ cho phép số

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Chỉ lấy ký tự cuối cùng
    setOtp(newOtp)
    setError('')

    // Tự động chuyển sang ô tiếp theo
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const otpString = otp.join('')
    if (otpString.length !== 6) {
      setError('Vui lòng nhập đầy đủ 6 chữ số OTP')
      return
    }

    if (timeLeft <= 0) {
      setError('Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.')
      toast.error('OTP đã hết hạn', {
        description: 'Vui lòng quay lại và yêu cầu mã OTP mới.',
      })
      navigate('/forgot-password', { state: { email } })
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/verify-otp', {
        email,
        otp: otpString,
      })

      if (response.data.status === 'success') {
        toast.success('Xác thực OTP thành công!', {
          description: 'Vui lòng đặt lại mật khẩu mới.',
        })
        navigate('/reset-password', {
          state: {
            email,
            reset_token: response.data.data.reset_token,
          },
        })
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          'Mã OTP không hợp lệ. Vui lòng thử lại.'
        setError(errorMessage)
        toast.error('Xác thực OTP thất bại', {
          description: errorMessage,
        })
        // Xóa OTP khi nhập sai
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
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

  return (
    <section className="section">
      <div className="auth_container">
        <div className="auth_content" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form className="auth_form" onSubmit={handleSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <FaKey style={{ fontSize: '50px', color: '#1976d2', marginBottom: '15px' }} />
              <h2 className="form_title">Nhập mã OTP</h2>
              <p className="auth_p">
                Chúng tôi đã gửi mã OTP 6 chữ số đến email <strong>{email}</strong>
              </p>
            </div>

            {error && (
              <div
                className="form_group"
                style={{
                  color: '#d32f2f',
                  backgroundColor: '#ffebee',
                  padding: '12px 15px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '1.3rem',
                }}
              >
                {error}
              </div>
            )}

            <div className="form_group">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '20px',
                }}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    style={{
                      width: '50px',
                      height: '60px',
                      fontSize: '2rem',
                      textAlign: 'center',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      outline: 'none',
                      transition: 'all 0.3s',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1976d2'
                      e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0'
                      e.target.style.boxShadow = 'none'
                    }}
                    disabled={loading || timeLeft <= 0}
                  />
                ))}
              </div>

              {timeLeft > 0 ? (
                <p style={{ textAlign: 'center', color: '#666', fontSize: '1.3rem', marginBottom: '10px' }}>
                  Mã OTP còn hiệu lực: <strong style={{ color: '#1976d2' }}>{formatTime(timeLeft)}</strong>
                </p>
              ) : (
                <p style={{ textAlign: 'center', color: '#d32f2f', fontSize: '1.3rem', marginBottom: '10px' }}>
                  Mã OTP đã hết hạn
                </p>
              )}
            </div>

            <div className="form_group">
              <button
                type="submit"
                className="form_btn"
                disabled={loading || timeLeft <= 0}
                style={{ position: 'relative' }}
              >
                {loading ? (
                  <span
                    className="form_link"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    <ClipLoader color="#fff" size={16} />
                    Đang xác thực...
                  </span>
                ) : (
                  <span className="form_link">Xác thực OTP</span>
                )}
              </button>
            </div>

            <div className="form_group" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '10px' }}>
                Không nhận được mã OTP?
              </p>
              <Link
                to="/forgot-password"
                state={{ email }}
                style={{
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontSize: '1.4rem',
                  fontWeight: '500',
                }}
              >
                Gửi lại mã OTP
              </Link>
            </div>

            <div className="form_group" style={{ textAlign: 'center', marginTop: '20px' }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#1976d2',
                  textDecoration: 'none',
                  fontSize: '1.4rem',
                }}
              >
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

export default VerifyOTP
