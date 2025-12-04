import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaArrowLeft, FaLock } from 'react-icons/fa'
import { axiosInstance } from '../utils/axiosConfig'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [resetToken, setResetToken] = useState(location.state?.reset_token || '')
  const [formData, setFormData] = useState({
    password: '',
    password_confirmation: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!email || !resetToken) {
      toast.error('Thông tin không hợp lệ', {
        description: 'Vui lòng thực hiện lại quy trình quên mật khẩu.',
      })
      navigate('/forgot-password')
    }
  }, [email, resetToken, navigate])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password) {
      newErrors.password = 'Mật khẩu mới là bắt buộc'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = 'Xác nhận mật khẩu là bắt buộc'
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Mật khẩu xác nhận không khớp'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Vui lòng kiểm tra lại thông tin', {
        description: 'Có một số trường không hợp lệ',
      })
      return
    }

    setLoading(true)

    try {
      const response = await axiosInstance.post('/reset-password', {
        email,
        reset_token: resetToken,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })

      if (response.data.status === 'success') {
        toast.success('Đặt lại mật khẩu thành công!', {
          description: 'Vui lòng đăng nhập với mật khẩu mới.',
        })
        navigate('/login')
      }
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data
        if (errorData.errors) {
          const serverErrors = {}
          Object.keys(errorData.errors).forEach((key) => {
            const fieldErrors = errorData.errors[key]
            serverErrors[key] = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors
          })
          setErrors(serverErrors)
          toast.error('Đặt lại mật khẩu thất bại', {
            description: 'Vui lòng kiểm tra lại thông tin',
          })
        } else {
          const errorMessage = errorData.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại sau.'
          toast.error('Đặt lại mật khẩu thất bại', {
            description: errorMessage,
          })
        }
      } else {
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
              <FaLock style={{ fontSize: '50px', color: '#1976d2', marginBottom: '15px' }} />
              <h2 className="form_title">Đặt lại mật khẩu</h2>
              <p className="auth_p">Nhập mật khẩu mới cho tài khoản {email}</p>
            </div>

            <div className="form_group form_pass">
              <input
                type="password"
                placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                className={`form_input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value })
                  if (errors.password) setErrors({ ...errors, password: '' })
                }}
                required
                disabled={loading}
              />
              {errors.password && (
                <span
                  style={{
                    color: 'red',
                    fontSize: '1.2rem',
                    marginTop: '0.5rem',
                    display: 'block',
                  }}
                >
                  {errors.password}
                </span>
              )}
            </div>

            <div className="form_group form_pass">
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                className={`form_input ${errors.password_confirmation ? 'error' : ''}`}
                value={formData.password_confirmation}
                onChange={(e) => {
                  setFormData({ ...formData, password_confirmation: e.target.value })
                  if (errors.password_confirmation)
                    setErrors({ ...errors, password_confirmation: '' })
                }}
                required
                disabled={loading}
              />
              {errors.password_confirmation && (
                <span
                  style={{
                    color: 'red',
                    fontSize: '1.2rem',
                    marginTop: '0.5rem',
                    display: 'block',
                  }}
                >
                  {errors.password_confirmation}
                </span>
              )}
            </div>

            <div className="form_group">
              <button
                type="submit"
                className="form_btn"
                disabled={loading}
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
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="form_link">Đặt lại mật khẩu</span>
                )}
              </button>
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

export default ResetPassword
