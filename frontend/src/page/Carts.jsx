import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { FaTimes, FaChevronUp, FaChevronDown } from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'
import { authService } from '../utils/authService'

const Carts = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [availableQuantities, setAvailableQuantities] = useState({}) // { productId_size: availableQty }

  const fetchCart = async () => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    
    try {
      setLoading(true)
      const response = await axiosInstance.get('/cart')
      if (response.data.status === 'success' && response.data.data?.cart) {
        setCartItems(response.data.data.cart)
      } else {
        setCartItems([])
      }
    } catch (error) {
      setError('Không thể tải giỏ hàng. Vui lòng thử lại sau.')
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  // Hàm lấy tồn kho của sản phẩm
  const getAvailableQuantity = async (productId, productAttributeId, size) => {
    try {
      // Lấy thông tin sản phẩm
      const productResponse = await axiosInstance.get(`/product/${productId}`)
      if (productResponse.data.status === 'success') {
        const productData = productResponse.data.data.product || productResponse.data.data
        
        // Nếu có product_attribute_id, lấy quantity từ attribute
        if (productAttributeId) {
          const attributes = productResponse.data.data.attributes || []
          const attribute = attributes.find(attr => attr.id === productAttributeId)
          if (attribute) {
            return attribute.quantity || 0
          }
        }
        
        // Nếu không có attribute, lấy từ product
        return productData.quantity_product || 0
      }
      return 0
    } catch (error) {
      console.error('Lỗi khi lấy tồn kho:', error)
      return 0
    }
  }

  // Fetch tồn kho cho tất cả sản phẩm trong cart
  const fetchAvailableQuantities = async () => {
    if (!cartItems || cartItems.length === 0) return
    
    const quantities = {}
    for (const item of cartItems) {
      const key = `${item.product_id}_${item.size || ''}`
      if (!quantities[key]) {
        const availableQty = await getAvailableQuantity(item.product_id, item.product_attribute_id, item.size)
        quantities[key] = availableQty
      }
    }
    setAvailableQuantities(quantities)
  }

  const updateQuantity = async (productId, size, newQuantity, productAttributeId) => {
    if (newQuantity < 1) {
      toast.error('Số lượng phải lớn hơn 0')
      return
    }
    
    // Lấy tồn kho từ state hoặc fetch mới
    const key = `${productId}_${size || ''}`
    let availableQty = availableQuantities[key]
    
    // Nếu chưa có trong state, fetch mới
    if (availableQty === undefined) {
      availableQty = await getAvailableQuantity(productId, productAttributeId, size)
      setAvailableQuantities(prev => ({ ...prev, [key]: availableQty }))
    }
    
    if (availableQty === 0) {
      toast.error('Sản phẩm đã hết hàng', {
        description: 'Không thể tăng số lượng. Sản phẩm đã hết hàng.'
      })
      return
    }
    
    if (newQuantity > availableQty) {
      toast.error('Số lượng vượt quá tồn kho', {
        description: `Chỉ còn ${availableQty} sản phẩm trong kho.`
      })
      return
    }
    
    try {
      const payload = {
        product_id: productId,
        quantity_item: newQuantity,
        update_mode: true, // Báo cho backend biết là set quantity mới
      }
      if (size) {
        payload.size = size
      }
      if (productAttributeId) {
        payload.product_attribute_id = productAttributeId
      }
      
      await axiosInstance.post('/cart/add', payload)
      // Refresh cart từ API để lấy dữ liệu mới nhất
      await fetchCart()
      // Refresh tồn kho sau khi update
      await fetchAvailableQuantities()

      // *** CẬP NHẬT BADGE TRÊN NAV ***
      window.dispatchEvent(new Event('updateCartCount'))

    } catch (error) {
      toast.error('Không thể cập nhật số lượng', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    }
  }

  const removeItem = async (productId, size) => {
    try {
      const payload = {
        product_id: productId,
      }
      if (size) {
        payload.size = size
      }
      await axiosInstance.post('/cart/remove', payload)
      // Refresh cart từ API để lấy dữ liệu mới nhất
      await fetchCart()

      // *** CẬP NHẬT BADGE TRÊN NAV ***
      window.dispatchEvent(new Event('updateCartCount'))

    } catch (error) {
      toast.error('Không thể xóa sản phẩm', {
        description: 'Vui lòng thử lại sau.',
      })
    }
  }

  // Lấy giỏ hàng từ API
  useEffect(() => {
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Fetch tồn kho khi cartItems thay đổi
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      fetchAvailableQuantities()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartItems])

  // Tính tổng giá giảm (tạm tính)
  const subtotal = cartItems.reduce((sum, item) => {
    const discountPrice = item.discount_price || item.price_product
    return sum + (discountPrice * item.quantity_item)
  }, 0)
  
  // Tính tổng giá gốc
  const totalOriginal = cartItems.reduce((sum, item) => {
    const originalPrice = item.original_price || item.price_product
    return sum + (originalPrice * item.quantity_item)
  }, 0)
  
  // Tiết kiệm = tổng giá gốc - tổng giá giảm
  const savings = totalOriginal - subtotal


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
            <span className="breadcrumb_current">Giỏ hàng</span>
          </nav>
        </div>
      </section>

      {/* Cart Content */}
      <section className="section">
        <div className="container">
          <h2 style={{ fontSize: '2.4rem', marginBottom: '30px', fontWeight: 'bold' }}>
            Giỏ hàng của bạn
          </h2>
          
          {error && (
            <div style={{ 
              color: '#d32f2f', 
              marginBottom: '20px', 
              padding: '15px 20px', 
              backgroundColor: '#ffebee', 
              border: '1px solid #ef5350',
              borderRadius: '8px',
              fontSize: '1.4rem'
            }}>
              <strong>⚠️ Lỗi:</strong> {error}
            </div>
          )}
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px', 
            gap: '30px'
          }}>
            {/* Left Column - Product List */}
            <div>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}>
                {/* Table Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                  backgroundColor: '#f5f5f5',
                  padding: '15px 20px',
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: 'bold',
                  fontSize: '1.4rem'
                }}>
                  <div>Sản phẩm</div>
                  <div style={{ textAlign: 'right' }}>Giá</div>
                  <div style={{ textAlign: 'center' }}>Số lượng</div>
                  <div style={{ textAlign: 'right' }}>Tổng tiền</div>
                </div>

                {/* Table Body */}
                <div>
                  {loading ? (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column',
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      minHeight: '300px',
                      padding: '40px 0',
                      gap: '15px'
                    }}>
                      <ClipLoader color="#1976d2" size={40} />
                      <p style={{ fontSize: '1.4rem', color: '#666', marginTop: '10px' }}>
                        Đang tải giỏ hàng...
                      </p>
                    </div>
                  ) : !Array.isArray(cartItems) || cartItems.length === 0 ? (
                    <div style={{ 
                      textAlign: 'center', 
                      padding: '60px 20px',
                      fontSize: '1.6rem',
                      color: '#666'
                    }}>
                      <p style={{ marginBottom: '20px' }}>Giỏ hàng của bạn đang trống</p>
                      <Link 
                        to="/" 
                        style={{
                          display: 'inline-block',
                          padding: '12px 24px',
                          backgroundColor: '#1976d2',
                          color: 'white',
                          borderRadius: '5px',
                          textDecoration: 'none',
                          fontSize: '1.4rem'
                        }}
                      >
                        Tiếp tục mua sắm
                      </Link>
                    </div>
                  ) : (
                    cartItems.map((item, index) => {
                      const productId = item.product_id
                      const productName = item.name_product
                      const productImage = item.image_product
                      const discountPrice = item.discount_price || item.price_product
                      const originalPrice = item.original_price || item.price_product
                      const quantity = item.quantity_item
                      const size = item.size
                      const productAttributeId = item.product_attribute_id
                      
                      // Lấy tồn kho từ state
                      const key = `${productId}_${size || ''}`
                      const availableQty = availableQuantities[key] ?? null
                      const maxQuantity = availableQty !== null ? availableQty : Infinity
                      
                      return (
                        <div 
                          key={`${productId}_${size || ''}`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1.5fr 1fr 1fr',
                            padding: '20px',
                            borderBottom: index < cartItems.length - 1 ? '1px solid #e0e0e0' : 'none',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button
                              onClick={() => removeItem(productId, size)}
                              aria-label="Xóa sản phẩm"
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#d32f2f',
                                cursor: 'pointer',
                                fontSize: '1.6rem',
                                padding: '5px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <FaTimes />
                            </button>
                            {productImage ? (
                              <img 
                                src={productImage} 
                                alt={productName}
                                style={{
                                  width: '80px',
                                  height: '80px',
                                  objectFit: 'cover',
                                  borderRadius: '5px'
                                }}
                              />
                            ) : (
                              <div style={{ 
                                width: '80px',
                                height: '80px',
                                backgroundColor: '#f0f0f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '5px',
                                fontSize: '1.2rem',
                                color: '#999'
                              }}>
                                Không có ảnh
                              </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                              <span style={{ fontSize: '1.4rem', fontWeight: '500' }}>{productName}</span>
                              {size && (
                                <span style={{ fontSize: '1.2rem', color: '#666' }}>Size: {size}</span>
                              )}
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '1.4rem' }}>
                            {originalPrice > discountPrice ? (
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                                <span style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                  {formatCurrency(discountPrice)}
                                </span>
                                <span style={{ 
                                  color: '#999', 
                                  textDecoration: 'line-through',
                                  fontSize: '1.2rem'
                                }}>
                                  {formatCurrency(originalPrice)}
                                </span>
                              </div>
                            ) : (
                              <span>{formatCurrency(discountPrice)}</span>
                            )}
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center',
                              border: '1px solid #e0e0e0',
                              borderRadius: '5px',
                              overflow: 'hidden'
                            }}>
                              <button
                                onClick={() => updateQuantity(productId, size, quantity - 1, productAttributeId)}
                                aria-label="Giảm số lượng"
                                disabled={quantity <= 1}
                                style={{
                                  padding: '8px 12px',
                                  border: 'none',
                                  backgroundColor: '#f5f5f5',
                                  cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
                                  fontSize: '1.2rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  opacity: quantity <= 1 ? 0.5 : 1
                                }}
                              >
                                <FaChevronDown />
                              </button>
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                  const newQty = parseInt(e.target.value) || 1
                                  if (availableQty !== null && newQty > maxQuantity) {
                                    toast.error(`Số lượng tối đa là ${maxQuantity}`, {
                                      description: `Chỉ còn ${maxQuantity} sản phẩm trong kho.`
                                    })
                                    return
                                  }
                                  updateQuantity(productId, size, newQty, productAttributeId)
                                }}
                                min="1"
                                max={availableQty !== null ? maxQuantity : undefined}
                                disabled={availableQty === 0}
                                style={{
                                  width: '50px',
                                  padding: '8px',
                                  border: 'none',
                                  textAlign: 'center',
                                  fontSize: '1.4rem',
                                  outline: 'none',
                                  opacity: availableQty === 0 ? 0.5 : 1,
                                  cursor: availableQty === 0 ? 'not-allowed' : 'text'
                                }}
                              />
                              <button
                                onClick={() => updateQuantity(productId, size, quantity + 1, productAttributeId)}
                                aria-label="Tăng số lượng"
                                disabled={
                                  availableQty === 0 || 
                                  (availableQty !== null && quantity >= maxQuantity)
                                }
                                style={{
                                  padding: '8px 12px',
                                  border: 'none',
                                  backgroundColor: '#f5f5f5',
                                  cursor: (
                                    availableQty === 0 || 
                                    (availableQty !== null && quantity >= maxQuantity)
                                  ) ? 'not-allowed' : 'pointer',
                                  fontSize: '1.2rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  opacity: (
                                    availableQty === 0 || 
                                    (availableQty !== null && quantity >= maxQuantity)
                                  ) ? 0.5 : 1
                                }}
                              >
                                <FaChevronUp />
                              </button>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', fontSize: '1.5rem', fontWeight: 'bold', color: '#1976d2' }}>
                            {formatCurrency(discountPrice * quantity)}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '15px', 
                marginTop: '20px',
                marginBottom: '20px'
              }}>
                <Link 
                  to="/" 
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fff',
                    color: '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '1.4rem',
                    fontWeight: '500'
                  }}
                >
                  Quay lại cửa hàng
                </Link>
                <button 
                  onClick={fetchCart}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#fff',
                    color: '#1976d2',
                    border: '1px solid #1976d2',
                    borderRadius: '5px',
                    fontSize: '1.4rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cập nhật giỏ hàng
                </button>
              </div>

            </div>

            {/* Right Column - Cart Total */}
            <div style={{
              backgroundColor: '#fff',
              padding: '30px',
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              height: 'fit-content',
              position: 'sticky',
              top: '20px'
            }}>
              <h3 style={{ fontSize: '2rem', marginBottom: '25px', fontWeight: 'bold' }}>
                Tổng giỏ hàng
              </h3>
              <div style={{ marginBottom: '25px' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginBottom: '15px',
                  fontSize: '1.4rem'
                }}>
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                {savings > 0 && (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '15px',
                    fontSize: '1.4rem',
                    color: '#28a745'
                  }}>
                    <span>Tiết kiệm:</span>
                    <span>{formatCurrency(savings)}</span>
                  </div>
                )}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  paddingTop: '15px',
                  borderTop: '2px solid #e0e0e0',
                  fontSize: '1.8rem',
                  fontWeight: 'bold'
                }}>
                  <span>Tổng cộng:</span>
                  <span style={{ color: '#1976d2' }}>{formatCurrency(subtotal)}</span>
                </div>
              </div>
              <Link 
                to="/checkout" 
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '15px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  textAlign: 'center',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '1.6rem',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
              >
                Thanh toán
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Carts