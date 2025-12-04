import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FaCheckCircle, FaEnvelope, FaHome, FaShoppingBag } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { authService } from '../utils/authService'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const orderCode = searchParams.get('code')
  const orderId = searchParams.get('id')

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
  }, [navigate])

  return (
    <div>
      {/* Breadcrumbs */}
      <section className="breadcrumb_section">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/" className="breadcrumb_link">
              Trang chủ
            </Link>
            <span className="breadcrumb_separator"> / </span>
            <span className="breadcrumb_current">Đặt hàng thành công</span>
          </nav>
        </div>
      </section>

      {/* Success Content */}
      <section className="section">
        <div className="container">
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
            padding: '60px 20px'
          }}>
            {/* Success Icon */}
            <div style={{
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#e8f5e9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <FaCheckCircle style={{
                  fontSize: '80px',
                  color: '#4caf50'
                }} />
              </div>
            </div>

            {/* Success Message */}
            <h1 style={{
              fontSize: '3.2rem',
              fontWeight: 'bold',
              color: '#4caf50',
              marginBottom: '20px'
            }}>
              Đặt hàng thành công!
            </h1>

            <p style={{
              fontSize: '1.8rem',
              color: '#666',
              marginBottom: '40px',
              lineHeight: '1.6'
            }}>
              Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.
            </p>

            {/* Order Info */}
            {orderCode && (
              <div style={{
                backgroundColor: '#f5f5f5',
                padding: '30px',
                borderRadius: '10px',
                marginBottom: '40px',
                border: '2px solid #4caf50'
              }}>
                <p style={{
                  fontSize: '1.6rem',
                  color: '#333',
                  marginBottom: '15px',
                  fontWeight: '600'
                }}>
                  Mã đơn hàng của bạn:
                </p>
                <p style={{
                  fontSize: '2.4rem',
                  color: '#1976d2',
                  fontWeight: 'bold',
                  letterSpacing: '2px'
                }}>
                  {orderCode}
                </p>
              </div>
            )}

            {/* Email Notification */}
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '25px',
              borderRadius: '10px',
              marginBottom: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              flexWrap: 'wrap'
            }}>
              <FaEnvelope style={{
                fontSize: '2.4rem',
                color: '#1976d2'
              }} />
              <div style={{ textAlign: 'left' }}>
                <p style={{
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  color: '#1976d2',
                  margin: 0,
                  marginBottom: '5px'
                }}>
                  Thông tin đơn hàng đã được gửi về email
                </p>
                <p style={{
                  fontSize: '1.4rem',
                  color: '#666',
                  margin: 0
                }}>
                  Vui lòng kiểm tra hộp thư đến của bạn để xem chi tiết đơn hàng
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              {orderId && (
                <Link
                  to={`/orders/${orderId}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '15px 30px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '1.6rem',
                    fontWeight: '600',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
                >
                  <FaShoppingBag />
                  Xem chi tiết đơn hàng
                </Link>
              )}
              
              <Link
                to="/orders"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 30px',
                  backgroundColor: '#fff',
                  color: '#1976d2',
                  border: '2px solid #1976d2',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5'
                  e.target.style.borderColor = '#1565c0'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff'
                  e.target.style.borderColor = '#1976d2'
                }}
              >
                <FaShoppingBag />
                Xem tất cả đơn hàng
              </Link>

              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '15px 30px',
                  backgroundColor: '#fff',
                  color: '#333',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '1.6rem',
                  fontWeight: '600',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f5f5f5'
                  e.target.style.borderColor = '#1976d2'
                  e.target.style.color = '#1976d2'
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fff'
                  e.target.style.borderColor = '#e0e0e0'
                  e.target.style.color = '#333'
                }}
              >
                <FaHome />
                Về trang chủ
              </Link>
            </div>

            {/* Additional Info */}
            <div style={{
              marginTop: '50px',
              padding: '25px',
              backgroundColor: '#fff3cd',
              borderRadius: '10px',
              border: '1px solid #ffc107'
            }}>
              <p style={{
                fontSize: '1.4rem',
                color: '#856404',
                margin: 0,
                lineHeight: '1.6'
              }}>
                <strong>Lưu ý:</strong> Nếu bạn chọn thanh toán khi nhận hàng, vui lòng chuẩn bị đúng số tiền khi nhận đơn hàng. 
                Chúng tôi sẽ liên hệ với bạn qua số điện thoại đã cung cấp để xác nhận đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default OrderSuccess
