import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { FaStar } from 'react-icons/fa'
import { toast } from 'sonner'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'
import { authService } from '../utils/authService'
import { formatDateTime } from '../utils/dateHelper'

const OrderDetail = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [reviewForms, setReviewForms] = useState({})
  const [submittingReview, setSubmittingReview] = useState({})
  const [reviewsByProduct, setReviewsByProduct] = useState({})
  const [submittedReview, setSubmittedReview] = useState({})
  const [editReviewId, setEditReviewId] = useState(null)
  const [editForms, setEditForms] = useState({})
  const [savingEdit, setSavingEdit] = useState(false)
  const currentUser = authService.getUser()
  const buildReviewKey = (orderId, productId) => `reviewed_${orderId}_${productId}`

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login')
      return
    }
    if (id) {
      fetchOrderDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchOrderDetail = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await axiosInstance.get(`/user/orders/${id}`)
      if (response.data.status === 'success') {
        setOrder(response.data.data)
        const products = response.data.data?.products || []
        fetchReviewsForProducts(products)
        // Load trạng thái đã đánh giá theo từng đơn + sản phẩm từ localStorage
        if (products.length > 0) {
          const flags = {}
          products.forEach((p) => {
            const key = buildReviewKey(id, p.product_id)
            if (localStorage.getItem(key)) {
              flags[p.product_id] = true
            }
          })
          if (Object.keys(flags).length > 0) {
            setSubmittedReview(flags)
          }
        }
      } else {
        setError('Không tìm thấy đơn hàng')
      }
    } catch (error) {
      
      if (error.response?.status === 401) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
      } else if (error.response?.status === 403) {
        // Không có quyền truy cập
        const errorMessage = error.response?.data?.message || 'Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản khách hàng.'
        setError(errorMessage)
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy đơn hàng')
      } else {
        setError(error.response?.data?.message || 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchReviewsForProducts = async (products) => {
    if (!products || products.length === 0) return
    try {
      const reviewPromises = products.map((p) =>
        axiosInstance.get(`/product/${p.product_id}/reviews`, {
          params: { order_id: id }
        }).catch(() => null)
      )
      const results = await Promise.all(reviewPromises)
      const map = {}
      products.forEach((p, idx) => {
        const res = results[idx]
        const reviews = res?.data?.data?.reviews || []
        // Chỉ hiển thị lịch sử của chính user hiện tại trong trang đơn hàng
        const filtered = currentUser ? reviews.filter((r) => r.user_id === currentUser.id) : []
        map[p.product_id] = filtered
      })
      setReviewsByProduct(map)
    } catch (error) {
      // Không chặn màn hình nếu lỗi
    }
  }

  const handleReviewChange = (productId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [productId]: {
        rating: prev[productId]?.rating ?? 5,
        content: prev[productId]?.content ?? '',
        [field]: value,
      },
    }))
  }

  const handleSubmitReview = async (productId) => {
    const formData = reviewForms[productId] || { rating: 5, content: '' }
    if (!formData.content.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá')
      return
    }

    // Chỉ cho phép đánh giá khi đơn đã giao và chưa bị hủy
    if (!orderData || orderData.status_delivery !== 2 || orderData.status_user_order !== 0) {
      toast.error('Chỉ được đánh giá sau khi bạn đã xác nhận Đã nhận hàng.')
      return
    }

    try {
      setSubmittingReview((prev) => ({ ...prev, [productId]: true }))
      const response = await axiosInstance.post('/user/reviews', {
        product_id: productId,
        order_id: id,
        rating: formData.rating || 5,
        content: formData.content.trim(),
      })

      if (response.data.status === 'success') {
        toast.success('Đã gửi đánh giá, cảm ơn bạn!')
        setReviewForms((prev) => ({
          ...prev,
          [productId]: { rating: 5, content: '' },
        }))
        setSubmittedReview((prev) => ({ ...prev, [productId]: true }))
        // Lưu dấu đã đánh giá theo đơn hàng + sản phẩm để không hiện lại sau reload
        localStorage.setItem(buildReviewKey(id, productId), '1')
        setReviewsByProduct((prev) => {
          const existing = prev[productId] || []
          const newItem = {
            id: response.data.data?.id || `temp-${Date.now()}`,
            user_name: 'Bạn',
            user_id: currentUser?.id,
            rating: formData.rating || 5,
            content: formData.content.trim(),
            created_at: new Date().toISOString(),
            order_id: id,
          }
          return { ...prev, [productId]: [newItem, ...existing] }
        })
      }
    } catch (error) {
      toast.error('Không thể gửi đánh giá', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    } finally {
      setSubmittingReview((prev) => ({ ...prev, [productId]: false }))
    }
  }

  const handleStartEdit = (review, productId) => {
    setEditReviewId(review.id)
    setEditForms({
      rating: review.rating,
      content: review.content || '',
      productId,
    })
  }

  const handleEditChange = (field, value) => {
    setEditForms((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveEdit = async () => {
    if (!editReviewId || !editForms.content?.trim()) {
      toast.error('Vui lòng nhập nội dung đánh giá')
      return
    }
    const productId = editForms.productId
    try {
      setSavingEdit(true)
      const response = await axiosInstance.put(`/user/reviews/${editReviewId}`, {
        rating: editForms.rating || 5,
        content: editForms.content.trim(),
      })
      if (response.data.status === 'success') {
        toast.success('Đã cập nhật đánh giá')
        setReviewsByProduct((prev) => {
          const list = prev[productId] || []
          const updated = list.map((r) =>
            r.id === editReviewId ? { ...r, rating: editForms.rating || 5, content: editForms.content.trim() } : r
          )
          return { ...prev, [productId]: updated }
        })
        setEditReviewId(null)
        setEditForms({})
      }
    } catch (error) {
      toast.error('Không thể cập nhật đánh giá', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    } finally {
      setSavingEdit(false)
    }
  }

  const getFinalStatus = (orderData) => {
    // Logic xác định trạng thái cuối cùng giống AdminOrderDetail
    if (!orderData) return { label: 'Không xác định', color: '#6c757d' }

    const statusUserOrder = orderData.status_user_order
    const statusOrder = orderData.status_order
    const statusDelivery = orderData.status_delivery

    // Nếu đã hủy đơn
    if (statusUserOrder === 1) {
      return { label: 'Đã hủy đơn', color: '#dc3545' }
    }

    // Nếu Đã nhận hàng
    if (statusUserOrder === 0 && statusOrder === 2 && statusDelivery === 2) {
      return { label: 'Đã nhận hàng', color: '#28a745' }
    }

    // Nếu đã giao cho bên vận chuyển, kiểm tra trạng thái giao hàng
    if (statusOrder === 2) {
      if (statusDelivery === 2) {
        return { label: 'Đã giao hàng', color: '#28a745' }
      } else if (statusDelivery === 1) {
        return { label: 'Đang giao hàng', color: '#17a2b8' }
      } else if (statusDelivery === 0) {
        return { label: 'Đã nhận hàng', color: '#ffa500' }
      } else {
        return { label: 'Đã giao cho bên vận chuyển', color: '#28a745' }
      }
    }

    // Các trạng thái đơn hàng ban đầu
    if (statusOrder === 1) {
      return { label: 'Đang xử lý', color: '#17a2b8' }
    }

    if (statusOrder === 0) {
      return { label: 'Chờ xác nhận', color: '#ffa500' }
    }

    return { label: 'Không xác định', color: '#6c757d' }
  }

  // Hàm render workflow trạng thái đơn hàng
  const renderWorkflow = () => {
    if (!orderData) return null

    const isCancelled = orderData.status_user_order === 1
    const workflowSteps = []
    
    // Bước 1: Chờ xác nhận (status_order = 0)
    workflowSteps.push({
      step: 1,
      label: 'Chờ xác nhận',
      completed: !isCancelled && orderData.status_order >= 0,
      active: !isCancelled && orderData.status_order === 0,
      color: '#ffa500',
      cancelled: isCancelled
    })

    // Bước 2: Đang xử lý (status_order = 1)
    workflowSteps.push({
      step: 2,
      label: 'Đang xử lý',
      completed: !isCancelled && orderData.status_order >= 1,
      active: !isCancelled && orderData.status_order === 1,
      color: '#17a2b8',
      cancelled: isCancelled
    })

    // Bước 3: Đã giao cho bên vận chuyển (status_order = 2)
    workflowSteps.push({
      step: 3,
      label: 'Đã giao cho bên vận chuyển',
      completed: !isCancelled && orderData.status_order >= 2,
      active: !isCancelled && orderData.status_order === 2,
      color: '#28a745',
      cancelled: isCancelled
    })

    // Chỉ hiển thị các bước delivery khi status_order = 2
    if (orderData.status_order === 2) {
      // Bước 4: Đã nhận hàng (status_delivery = 0)
      workflowSteps.push({
        step: 4,
        label: 'Đã nhận hàng',
        completed: !isCancelled && orderData.status_delivery >= 0,
        active: !isCancelled && orderData.status_delivery === 0,
        color: '#ffa500',
        cancelled: isCancelled
      })

      // Bước 5: Đang giao hàng (status_delivery = 1)
      workflowSteps.push({
        step: 5,
        label: 'Đang giao hàng',
        completed: !isCancelled && orderData.status_delivery >= 1,
        active: !isCancelled && orderData.status_delivery === 1,
        color: '#17a2b8',
        cancelled: isCancelled
      })

      // Bước 6: Đã giao hàng (status_delivery = 2)
      workflowSteps.push({
        step: 6,
        label: 'Đã giao hàng',
        completed: !isCancelled && orderData.status_delivery >= 2,
        active: !isCancelled && orderData.status_delivery === 2,
        color: '#28a745',
        cancelled: isCancelled
      })
    }

    // Bước cuối: Trạng thái user order
    if (orderData.status_user_order === 0) {
      workflowSteps.push({
        step: workflowSteps.length + 1,
        label: 'Đã nhận hàng',
        completed: true,
        active: false,
        color: '#28a745',
        cancelled: false
      })
    } else if (orderData.status_user_order === 1) {
      workflowSteps.push({
        step: workflowSteps.length + 1,
        label: 'Đã hủy đơn',
        completed: true,
        active: true,
        color: '#dc3545',
        cancelled: false
      })
    }

    return (
      <div style={{ 
        marginBottom: '30px',
        padding: '15px 20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        <h3 style={{ fontSize: '1.6rem', marginBottom: '15px', fontWeight: 'bold', color: '#333' }}>
          Tiến trình đơn hàng
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '0',
          minWidth: 'max-content',
          paddingBottom: '5px'
        }}>
          {workflowSteps.map((step, index) => {
            const isCancelledStep = step.cancelled
            const nextStep = workflowSteps[index + 1]
            const isNextCancelled = nextStep?.cancelled
            
            return (
              <div key={index} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '6px', 
                  minWidth: '90px',
                  maxWidth: '90px',
                  padding: '0 5px'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: isCancelledStep ? '#e0e0e0' : (step.completed ? step.color : '#e0e0e0'),
                    color: isCancelledStep ? '#999' : (step.completed ? 'white' : '#999'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    border: step.active ? `2px solid ${step.color}` : 'none',
                    boxShadow: step.active ? `0 0 0 2px rgba(25, 118, 210, 0.15)` : 'none',
                    zIndex: 2,
                    flexShrink: 0,
                    opacity: isCancelledStep ? 0.5 : 1,
                    transition: 'all 0.3s ease'
                  }}>
                    {step.label === 'Đã hủy đơn' ? '✕' : (step.completed && !isCancelledStep ? '✓' : step.step)}
                  </div>
                  <p style={{ 
                    fontSize: '1rem', 
                    fontWeight: step.active ? '600' : '400',
                    color: isCancelledStep ? '#999' : (step.completed ? '#333' : '#999'),
                    margin: 0,
                    textAlign: 'center',
                    lineHeight: '1.2',
                    opacity: isCancelledStep ? 0.6 : 1,
                    wordBreak: 'break-word',
                    hyphens: 'auto'
                  }}>
                    {step.label}
                  </p>
                </div>
                {index < workflowSteps.length - 1 && (
                  <div style={{
                    width: '40px',
                    height: '2px',
                    backgroundColor: isNextCancelled ? '#e0e0e0' : (nextStep?.completed ? nextStep.color : '#e0e0e0'),
                    margin: '0 2px',
                    marginTop: '16px',
                    flexShrink: 0,
                    opacity: isNextCancelled ? 0.5 : 1
                  }} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const getPaymentMethod = (methodPay) => {
    // method_pay: 0 = cash, 1 = bank, 2 = MoMo
    const methodMap = {
      0: 'Thanh toán khi nhận hàng',
      1: 'Thanh toán qua ngân hàng',
      2: 'Thanh toán qua MoMo',
    }
    return methodMap[methodPay] || 'Không xác định'
  }

  // Sử dụng formatDateTime từ dateHelper (đã import ở trên)
  const formatDate = formatDateTime

  const orderData = order ? (order.order || order) : null
  const orderProducts = order ? (order.products || []) : []
  const finalStatus = orderData ? getFinalStatus(orderData) : null
  const paymentMethod = orderData ? getPaymentMethod(orderData.method_pay) : null
  // Chỉ cho phép đánh giá khi user đã bấm xác nhận nhận hàng (status_user_order = 0)
  const canReviewOrder = orderData && orderData.status_delivery === 2 && orderData.status_user_order === 0

  // Kiểm tra điều kiện để hiển thị nút xác nhận đơn
  // Điều kiện: status_delivery = 2 (đã giao hàng) — bắt buộc và status_user_order != 1 (chưa hủy) và status_user_order != 0 (chưa xác nhận)
  const canConfirmReceived = orderData && 
    orderData.status_delivery === 2 && // Đã giao hàng — bắt buộc
    orderData.status_user_order !== 1 && // Chưa hủy đơn
    orderData.status_user_order !== 0 // Chưa xác nhận đã nhận hàng

  // Kiểm tra điều kiện để hiển thị nút hủy đơn
  // Điều kiện 1: status_order = 0 (Chờ xác nhận) và status_user_order = null (chưa có hành động)
  // HOẶC Điều kiện 2: status_order = 1 (đang xử lý) và status_delivery != 2 (chưa giao) và status_user_order = null (chưa có hành động)
  const canCancelOrder = orderData && 
    (orderData.status_user_order === null || orderData.status_user_order === undefined) && // Chưa có hành động (bắt buộc)
    (
      (orderData.status_order === 0) || // Điều kiện 1: Chờ xác nhận - luôn cho phép hủy
      (orderData.status_order === 1 && orderData.status_delivery !== 2) // Điều kiện 2: Đang xử lý nhưng chưa giao hàng
    )

  const handleConfirmReceived = async () => {
    if (!canConfirmReceived) {
      toast.error('Không thể xác nhận đã nhận hàng. Đơn hàng chưa được giao hoặc đã bị hủy.')
      return
    }

    try {
      setUpdating(true)
      const response = await axiosInstance.put(`/user/orders/${id}/status`, {
        status_user_order: 0
      })
      
      if (response.data.status === 'success') {
        toast.success('Xác nhận đã nhận hàng thành công')
        fetchOrderDetail()
      } else {
        toast.error(response.data.message || 'Xác nhận đã nhận hàng thất bại')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Xác nhận đã nhận hàng thất bại'
      toast.error(errorMessage)
      console.error('Lỗi khi xác nhận đã nhận hàng:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn hàng')
      return
    }

    if (!canCancelOrder) {
      toast.error('Không thể hủy đơn hàng này')
      return
    }

    try {
      setUpdating(true)
      const response = await axiosInstance.put(`/user/orders/${id}/status`, {
        status_user_order: 1,
        reason_user_order: cancelReason.trim()
      })
      
      if (response.data.status === 'success') {
        toast.success('Hủy đơn hàng thành công')
        setShowCancelModal(false)
        setCancelReason('')
        fetchOrderDetail()
      } else {
        toast.error(response.data.message || 'Hủy đơn hàng thất bại')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Hủy đơn hàng thất bại'
      toast.error(errorMessage)
      console.error('Lỗi khi hủy đơn hàng:', error)
    } finally {
      setUpdating(false)
    }
  }

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
            <Link to="/orders" className="breadcrumb_link">
              Đơn hàng của tôi
            </Link>
            <span className="breadcrumb_separator"> / </span>
            <span className="breadcrumb_current">Chi tiết đơn hàng #{id || (orderData?.id || '')}</span>
          </nav>
        </div>
      </section>

      {/* Order Detail Content */}
      <section className="section">
        <div className="container">
          <div className="profile_wrapper">
            {/* Left Sidebar */}
            <aside className="profile_sidebar">
              <div className="profile_sidebar_section">
                <h3 className="profile_sidebar_title">Quản lý tài khoản</h3>
                <ul className="profile_sidebar_list">
                  <li className="profile_sidebar_item">
                    <Link 
                      to="/profile" 
                      className={`profile_sidebar_link ${pathname === '/profile' ? 'active' : ''}`}
                    >
                      Thông tin tài khoản
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="profile_sidebar_section">
                <h3 className="profile_sidebar_title">Đơn hàng của tôi</h3>
                <ul className="profile_sidebar_list">
                  <li className="profile_sidebar_item">
                    <Link 
                      to="/orders" 
                      className={`profile_sidebar_link ${pathname === '/orders' || pathname.startsWith('/orders/') ? 'active' : ''}`}
                    >
                      Đơn hàng của tôi
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="profile_sidebar_section">
                <h3 className="profile_sidebar_title">Danh sách yêu thích</h3>
                <ul className="profile_sidebar_list">
                  <li className="profile_sidebar_item">
                    <Link 
                      to="/wishlist" 
                      className={`profile_sidebar_link ${pathname === '/wishlist' ? 'active' : ''}`}
                    >
                      Danh sách yêu thích
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>

            {/* Right Main Content */}
            <div className="profile_main">
              <h2 className="profile_main_title">Thông tin đơn hàng</h2>
              
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '400px',
                  gap: '15px'
                }}>
                  <ClipLoader color="#1976d2" size={50} />
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>
                    Đang tải chi tiết đơn hàng...
                  </p>
                </div>
              ) : error || !order ? (
                <div style={{ 
                  color: '#d32f2f', 
                  marginBottom: '20px', 
                  padding: '20px', 
                  backgroundColor: '#ffebee', 
                  border: '1px solid #ef5350',
                  borderRadius: '5px',
                  fontSize: '1.4rem'
                }}>
                  <strong>⚠️ Lỗi:</strong> {error || 'Không tìm thấy đơn hàng'}
                  {error && error.includes('Customer access only') && (
                    <div style={{ marginTop: '15px' }}>
                      <p style={{ marginBottom: '10px', fontSize: '1.3rem' }}>
                        Có vẻ như tài khoản của bạn không có quyền truy cập trang này.
                      </p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <Link 
                          to="/orders" 
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#1976d2',
                            color: 'white',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '1.3rem'
                          }}
                        >
                          Quay lại danh sách đơn hàng
                        </Link>
                        <Link 
                          to="/login" 
                          style={{
                            padding: '10px 20px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            borderRadius: '5px',
                            textDecoration: 'none',
                            fontSize: '1.3rem'
                          }}
                        >
                          Đăng nhập lại
                        </Link>
                      </div>
                    </div>
                  )}
                  {!error && (
                    <div style={{ marginTop: '15px' }}>
                      <Link 
                        to="/orders" 
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
                        Quay lại danh sách đơn hàng
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Workflow */}
                  {renderWorkflow()}

                  {/* Order Header */}
                  <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '30px',
                paddingBottom: '20px',
                borderBottom: '1px solid #e0e0e0'
              }}>
                <div>
                  <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '5px' }}>
                    Ngày đặt: {formatDate(orderData.date_order)}
                  </p>
                  <p style={{ fontSize: '1.4rem', color: '#666' }}>
                    Phương thức thanh toán: {paymentMethod}
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  {finalStatus && (
                    <span
                      style={{
                        padding: '8px 16px',
                        borderRadius: '5px',
                        color: 'white',
                        fontSize: '1.3rem',
                        backgroundColor: finalStatus.color
                      }}
                    >
                      {finalStatus.label}
                    </span>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: 'bold' }}>
                  Thông tin giao hàng
                </h3>
                <div style={{ 
                  backgroundColor: '#f9f9f9', 
                  padding: '20px', 
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <p style={{ fontSize: '1.4rem' }}>
                    <strong>Người nhận:</strong> {orderData.name_customer || 'N/A'}
                  </p>
                  <p style={{ fontSize: '1.4rem' }}>
                    <strong>Địa chỉ:</strong> {orderData.address_customer || 'N/A'}
                  </p>
                  <p style={{ fontSize: '1.4rem' }}>
                    <strong>Số điện thoại:</strong> {orderData.phone_customer || 'N/A'}
                  </p>
                  {orderData.note_customer && (
                    <p style={{ fontSize: '1.4rem' }}>
                      <strong>Ghi chú:</strong> {orderData.note_customer}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: 'bold' }}>
                  Sản phẩm
                </h3>
                <div style={{ 
                  border: '1px solid #e0e0e0', 
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}>
                  {/* Table Header */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                    backgroundColor: '#f5f5f5',
                    padding: '15px',
                    borderBottom: '1px solid #e0e0e0',
                    fontWeight: 'bold',
                    fontSize: '1.4rem'
                  }}>
                    <div>Sản phẩm</div>
                    <div style={{ textAlign: 'left' }}>Size</div>
                    <div style={{ textAlign: 'right' }}>Giá</div>
                    <div style={{ textAlign: 'center' }}>Số lượng</div>
                    <div style={{ textAlign: 'right' }}>Tổng tiền</div>
                  </div>
                  
                  {/* Table Body */}
                  <div>
                    {orderProducts.length > 0 ? (
                      orderProducts.map((product, index) => {
                        const productName = product.name_product || 'Sản phẩm'
                        const productImage = product.image_product || ''
                        const quantity = product.quantity_detail || 0
                        const totalDetail = product.total_detail || 0
                        // Lấy giá từ API response
                        const originalPrice = parseFloat(product.original_price) || 0
                        const discountPrice = parseFloat(product.discount_price) || (quantity > 0 ? totalDetail / quantity : 0)
                        const hasDiscount = originalPrice > 0 && originalPrice > discountPrice

                        return (
                          <div 
                            key={index} 
                            style={{ 
                              display: 'grid', 
                              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                              padding: '15px',
                              borderBottom: index < orderProducts.length - 1 ? '1px solid #e0e0e0' : 'none',
                              alignItems: 'center'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              {productImage ? (
                                <img
                                  src={productImage.startsWith('http') ? productImage : `/${productImage}`}
                                  alt={productName}
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    objectFit: 'cover',
                                    borderRadius: '5px'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: '#f0f0f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '5px',
                                    fontSize: '1.2rem',
                                    color: '#999'
                                  }}
                                >
                                  Không có ảnh
                                </div>
                              )}
                              <span style={{ fontSize: '1.4rem' }}>{productName}</span>
                            </div>
                            <div style={{ textAlign: 'left', fontSize: '1.4rem', color: '#495057' }}>
                              {product.size || '-'}
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '1.4rem' }}>
                              {hasDiscount ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                  <span style={{ 
                                    fontWeight: '700',
                                    color: '#d32f2f'
                                  }}>
                                    {formatCurrency(discountPrice)}
                                  </span>
                                  <span style={{ 
                                    fontSize: '1.2rem',
                                    color: '#999',
                                    textDecoration: 'line-through'
                                  }}>
                                    {formatCurrency(originalPrice)}
                                  </span>
                                </div>
                              ) : (
                                <span style={{ 
                                  fontWeight: '600',
                                  color: '#1976d2'
                                }}>
                                  {formatCurrency(discountPrice)}
                                </span>
                              )}
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '1.4rem' }}>
                              {quantity}
                            </div>
                            <div style={{ textAlign: 'right', fontSize: '1.4rem', fontWeight: 'bold' }}>
                              {formatCurrency(totalDetail)}
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', fontSize: '1.4rem', color: '#666' }}>
                        Không có sản phẩm
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {canReviewOrder && orderProducts.length > 0 && (
                <div style={{ 
                  marginBottom: '30px',
                  padding: '20px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <h3 style={{ fontSize: '1.8rem', marginBottom: '10px', fontWeight: 'bold' }}>
                    Đánh giá sản phẩm đã nhận
                  </h3>
                  <p style={{ fontSize: '1.3rem', color: '#666', marginBottom: '20px' }}>
                    Chỉ những đơn đã giao hàng mới có thể gửi đánh giá. Đánh giá sẽ hiển thị tại trang chi tiết sản phẩm.
                  </p>

                  <div style={{ display: 'grid', gap: '16px' }}>
                    {orderProducts.map((product) => {
                      const productId = product.product_id
                      const formState = reviewForms[productId] || { rating: 5, content: '' }
                      const history = reviewsByProduct[productId] || []
                      const hideForm = submittedReview[productId]

                      return (
                        <div 
                          key={productId}
                          style={{
                            backgroundColor: 'white',
                            borderRadius: '8px',
                            border: '1px solid #e5e7eb',
                            padding: '16px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            {product.image_product ? (
                              <img 
                                src={product.image_product.startsWith('http') ? product.image_product : `/${product.image_product}`} 
                                alt={product.name_product} 
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                              />
                            ) : (
                              <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 6 }} />
                            )}
                            <div>
                              <Link to={`/products/${productId}`} style={{ fontWeight: 600, color: '#1976d2', fontSize: '1.4rem' }}>
                                {product.name_product || 'Sản phẩm'}
                              </Link>
                              <p style={{ margin: 0, color: '#666', fontSize: '1.2rem' }}>
                                Số lượng: {product.quantity_detail || 0} {product.size ? `| Size: ${product.size}` : ''}
                              </p>
                            </div>
                          </div>

                          {!hideForm && (
                            <>
                              <div style={{ marginBottom: '12px' }}>
                                <p style={{ marginBottom: '6px', fontWeight: 600, fontSize: '1.3rem' }}>Đánh giá:</p>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <button
                                      key={i}
                                      type="button"
                                      onClick={() => handleReviewChange(productId, 'rating', i + 1)}
                                      style={{
                                        border: 'none',
                                        background: 'transparent',
                                        cursor: 'pointer',
                                        color: i < formState.rating ? '#fbc02d' : '#d1d5db',
                                        fontSize: '1.6rem'
                                      }}
                                    >
                                      <FaStar />
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div style={{ marginBottom: '12px' }}>
                                <p style={{ marginBottom: '6px', fontWeight: 600, fontSize: '1.3rem' }}>Nội dung đánh giá:</p>
                                <textarea
                                  value={formState.content}
                                  onChange={(e) => handleReviewChange(productId, 'content', e.target.value)}
                                  rows="3"
                                  placeholder="Chia sẻ cảm nhận sau khi nhận hàng..."
                                  style={{
                                    width: '100%',
                                    borderRadius: '6px',
                                    border: '1px solid #d1d5db',
                                    padding: '10px',
                                    fontSize: '1.3rem',
                                    resize: 'vertical'
                                  }}
                                />
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Link to={`/products/${productId}`} style={{ fontSize: '1.2rem', color: '#1976d2' }}>
                                  Xem trang sản phẩm
                                </Link>
                                <button
                                  onClick={() => handleSubmitReview(productId)}
                                  disabled={submittingReview[productId]}
                                  style={{
                                    padding: '10px 18px',
                                    backgroundColor: submittingReview[productId] ? '#90caf9' : '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: submittingReview[productId] ? 'not-allowed' : 'pointer',
                                    fontWeight: 600,
                                    minWidth: '140px'
                                  }}
                                >
                                  {submittingReview[productId] ? 'Đang gửi...' : 'Gửi đánh giá'}
                                </button>
                              </div>
                            </>
                          )}

                          {history.length > 0 && (
                            <div style={{ marginTop: '14px' }}>
                              <p style={{ fontWeight: 600, fontSize: '1.3rem', marginBottom: '8px' }}>Lịch sử đánh giá</p>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {history.map((review) => {
                                  const isOwner = currentUser && review.user_id === currentUser.id && (!review.order_id || review.order_id === id)
                                  const isEditing = editReviewId === review.id
                                  return (
                                    <div
                                      key={review.id}
                                      style={{
                                        padding: '10px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e5e7eb',
                                        backgroundColor: '#fff'
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                        <strong style={{ fontSize: '1.2rem' }}>{review.user_name || 'Người dùng'}</strong>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <FaStar
                                              key={i}
                                              style={{ color: i < review.rating ? '#fbc02d' : '#d1d5db', fontSize: '1.2rem' }}
                                            />
                                          ))}
                                        </div>
                                      </div>

                                      {isEditing ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                          <div style={{ display: 'flex', gap: '6px' }}>
                                            {Array.from({ length: 5 }).map((_, i) => (
                                              <button
                                                key={i}
                                                type="button"
                                                onClick={() => handleEditChange('rating', i + 1)}
                                                style={{
                                                  border: 'none',
                                                  background: 'transparent',
                                                  cursor: 'pointer',
                                                  color: i < (editForms.rating || 0) ? '#fbc02d' : '#d1d5db',
                                                  fontSize: '1.5rem'
                                                }}
                                              >
                                                <FaStar />
                                              </button>
                                            ))}
                                          </div>
                                          <textarea
                                            value={editForms.content || ''}
                                            onChange={(e) => handleEditChange('content', e.target.value)}
                                            rows="3"
                                            style={{
                                              width: '100%',
                                              borderRadius: '6px',
                                              border: '1px solid #d1d5db',
                                              padding: '10px',
                                              fontSize: '1.2rem',
                                              resize: 'vertical'
                                            }}
                                          />
                                          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                            <button
                                              onClick={() => {
                                                setEditReviewId(null)
                                                setEditForms({})
                                              }}
                                              style={{
                                                padding: '8px 14px',
                                                borderRadius: '6px',
                                                border: '1px solid #d1d5db',
                                                background: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem'
                                              }}
                                            >
                                              Hủy
                                            </button>
                                            <button
                                              onClick={handleSaveEdit}
                                              disabled={savingEdit}
                                              style={{
                                                padding: '8px 14px',
                                                borderRadius: '6px',
                                                border: 'none',
                                                background: savingEdit ? '#90caf9' : '#1976d2',
                                                color: '#fff',
                                                cursor: savingEdit ? 'not-allowed' : 'pointer',
                                                fontSize: '1.2rem',
                                                fontWeight: 600
                                              }}
                                            >
                                              {savingEdit ? 'Đang lưu...' : 'Lưu'}
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <p style={{ margin: 0, fontSize: '1.2rem', color: '#444' }}>{review.content}</p>
                                          {isOwner && (
                                            <div style={{ marginTop: '8px', textAlign: 'right' }}>
                                              <button
                                                onClick={() => handleStartEdit(review, productId)}
                                                style={{
                                                  padding: '6px 10px',
                                                  borderRadius: '6px',
                                                  border: '1px solid #1976d2',
                                                  background: '#e3f2fd',
                                                  color: '#1976d2',
                                                  cursor: 'pointer',
                                                  fontSize: '1.1rem',
                                                  fontWeight: 600
                                                }}
                                              >
                                                Sửa
                                              </button>
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Order Summary */}
              <div style={{ 
                marginBottom: '30px',
                padding: '20px',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px'
              }}>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: 'bold' }}>
                  Tóm tắt đơn hàng
                </h3>
                
                {/* Tính tổng tiền gốc và tiết kiệm từ sản phẩm */}
                {(() => {
                  let subtotalOriginal = 0
                  let subtotalDiscount = 0
                  let totalSavings = 0
                  
                  orderProducts.forEach(product => {
                    const quantity = product.quantity_detail || 0
                    const originalPrice = parseFloat(product.original_price) || 0
                    const discountPrice = parseFloat(product.discount_price) || (product.total_detail ? parseFloat(product.total_detail) / quantity : 0)
                    
                    if (originalPrice > 0) {
                      subtotalOriginal += originalPrice * quantity
                    }
                    subtotalDiscount += discountPrice * quantity
                    if (originalPrice > discountPrice) {
                      totalSavings += (originalPrice - discountPrice) * quantity
                    }
                  })
                  
                  // Sử dụng subtotal_order từ order nếu có, nếu không thì dùng subtotalDiscount đã tính
                  const subtotalFromOrder = parseFloat(orderData.subtotal_order) || subtotalDiscount
                  const voucherDiscount = parseFloat(orderData.voucher_discount) || 0
                  const finalTotal = parseFloat(orderData.total_order) || (subtotalFromOrder - voucherDiscount)
                  
                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {subtotalOriginal > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', color: '#999' }}>
                          <span>Tổng giá gốc:</span>
                          <span style={{ textDecoration: 'line-through' }}>{formatCurrency(subtotalOriginal)}</span>
                        </div>
                      )}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem' }}>
                        <span>Tạm tính:</span>
                        <span>{formatCurrency(subtotalFromOrder)}</span>
                      </div>
                      
                      {totalSavings > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', color: '#28a745' }}>
                          <span>Tiết kiệm từ sản phẩm:</span>
                          <span>-{formatCurrency(totalSavings)}</span>
                        </div>
                      )}
                      
                      {voucherDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', color: '#d32f2f' }}>
                          <span>Giảm giá voucher {orderData.voucher_code ? `(${orderData.voucher_code})` : ''}:</span>
                          <span>-{formatCurrency(voucherDiscount)}</span>
                        </div>
                      )}
                      
                      <div style={{ 
                        marginTop: '10px', 
                        paddingTop: '15px', 
                        borderTop: '2px solid #e0e0e0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                        <span style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Thành tiền:</span>
                <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1976d2' }}>
                          {formatCurrency(finalTotal)}
                </span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginTop: '20px' }}>
                <Link 
                  to="/orders" 
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '1.4rem',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#5a6268'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6c757d'}
                >
                  ← Quay lại danh sách đơn hàng
                </Link>

                {/* Nút xác nhận đã nhận hàng */}
                {canConfirmReceived && (
                  <button
                    onClick={handleConfirmReceived}
                    disabled={updating}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: updating ? 'not-allowed' : 'pointer',
                      fontSize: '1.4rem',
                      fontWeight: '500',
                      opacity: updating ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#218838'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#28a745'
                      }
                    }}
                  >
                    {updating ? (
                      <>
                        <ClipLoader color="#fff" size={16} />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '1.6rem' }}>✓</span>
                        <span>Xác nhận đã nhận hàng</span>
                      </>
                    )}
                  </button>
                )}

                {/* Nút hủy đơn hàng */}
                {canCancelOrder && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={updating}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: updating ? 'not-allowed' : 'pointer',
                      fontSize: '1.4rem',
                      fontWeight: '500',
                      opacity: updating ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#c82333'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!updating) {
                        e.target.style.backgroundColor = '#dc3545'
                      }
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>✕</span>
                    <span>Hủy đơn hàng</span>
                  </button>
                )}
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Modal hủy đơn hàng */}
      {showCancelModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
          onClick={() => !updating && setShowCancelModal(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
              Hủy đơn hàng
            </h2>
            <p style={{ fontSize: '1.4rem', marginBottom: '20px', color: '#666' }}>
              Vui lòng nhập lý do hủy đơn hàng:
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng..."
              rows="4"
              disabled={updating}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1.4rem',
                border: '1px solid #e0e0e0',
                borderRadius: '5px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                marginBottom: '20px'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1976d2'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false)
                  setCancelReason('')
                }}
                disabled={updating}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: updating ? 'not-allowed' : 'pointer',
                  fontSize: '1.4rem',
                  opacity: updating ? 0.6 : 1
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={updating || !cancelReason.trim()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: updating || !cancelReason.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '1.4rem',
                  opacity: updating || !cancelReason.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {updating ? (
                  <>
                    <ClipLoader color="#fff" size={16} />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <span>Xác nhận hủy</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderDetail

