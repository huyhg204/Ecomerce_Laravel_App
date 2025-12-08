import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatDateTime } from '../../utils/dateHelper'

const AdminOrderDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [statusForm, setStatusForm] = useState({
    status: ''
  })

  useEffect(() => {
    if (id) {
      fetchOrderDetail()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchOrderDetail = async (silent = false) => {
    try {
      // Chỉ hiển thị loading khi không phải silent mode (lần đầu load)
      if (!silent) {
        setLoading(true)
      }
      
      const response = await axiosInstance.get(`/admin/orders/${id}`)
      if (response.data.status === 'success') {
        const data = response.data.data
        setOrder(data)
        // Gộp trạng thái: nếu status_order = 2 và có status_delivery, thì dùng status_delivery
        // Ngược lại dùng status_order
        let unifiedStatus = data.order?.status_order?.toString() || '0'
        if (data.order?.status_order === 2 && data.order?.status_delivery !== null && data.order?.status_delivery !== undefined) {
          // Khi đã giao cho vận chuyển, dùng status_delivery + 2 để phân biệt
          unifiedStatus = (2 + data.order.status_delivery).toString()
        }
        setStatusForm({
          status: unifiedStatus
        })
      }
    } catch (error) {
      if (!silent) {
        toast.error('Không thể tải chi tiết đơn hàng')
      }
      console.error('Lỗi:', error)
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleUpdateStatus = async () => {
    // Sử dụng nextAvailableStatus thay vì statusForm.status
    if (!nextAvailableStatus) {
      toast.error('Không thể cập nhật trạng thái. Đơn hàng đã hoàn thành hoặc đã bị hủy.')
      return
    }

    const statusValue = parseInt(nextAvailableStatus.value)
    if (isNaN(statusValue) || statusValue < 0) {
      toast.error('Trạng thái không hợp lệ')
      return
    }

    try {
      setUpdating(true)
      
      // Optimistic update: Cập nhật UI ngay lập tức dựa trên status mới
      const oldOrder = order
      if (oldOrder && oldOrder.order) {
        // Tính toán status mới dựa trên unified_status
        let newStatusOrder = oldOrder.order.status_order
        let newStatusDelivery = oldOrder.order.status_delivery
        
        if (statusValue <= 2) {
          newStatusOrder = statusValue
          newStatusDelivery = null
        } else if (statusValue >= 3 && statusValue <= 5) {
          newStatusOrder = 2
          // unified_status = 3 => status_delivery = 0, unified_status = 4 => status_delivery = 1, unified_status = 5 => status_delivery = 2
          newStatusDelivery = statusValue - 3
        }
        
        // Cập nhật UI ngay lập tức
        setOrder({
          ...oldOrder,
          order: {
            ...oldOrder.order,
            status_order: newStatusOrder,
            status_delivery: newStatusDelivery
          }
        })
        
        // Không cập nhật statusForm ở đây vì sẽ được cập nhật tự động qua useEffect khi orderData thay đổi
      }
      
      // Sử dụng API thống nhất để cập nhật trạng thái
      // unified_status: 0=Chờ xác nhận, 1=Đang xử lý, 2=Đã giao cho vận chuyển, 
      //                 3=Đã nhận hàng từ kho, 4=Đang giao hàng, 5=Đã giao hàng
      await axiosInstance.put(`/admin/orders/${id}/unified-status`, { 
        unified_status: statusValue 
      })
      
      toast.success('Cập nhật trạng thái thành công')
      
      // Refresh dữ liệu trong background (silent mode - không hiển thị loading)
      fetchOrderDetail(true)
    } catch (error) {
      // Rollback nếu có lỗi
      fetchOrderDetail(true)
      const errorMessage = error.response?.data?.message || error.message || 'Cập nhật trạng thái thất bại'
      toast.error(errorMessage)
      console.error('Lỗi khi cập nhật trạng thái:', error.response?.data || error)
    } finally {
      setUpdating(false)
    }
  }


  // Hàm lấy trạng thái thống nhất từ status_order và status_delivery
  const getUnifiedStatus = (orderData) => {
    if (!orderData) return { label: 'Không xác định', color: '#6c757d', value: '0' }
    
    // Nếu đã hủy đơn
    if (orderData.status_user_order === 1) {
      return { label: 'Đã hủy đơn', color: '#dc3545', value: '-1' }
    }
    
    // Nếu đã giao cho vận chuyển (status_order = 2), kiểm tra status_delivery
    if (orderData.status_order === 2) {
      if (orderData.status_delivery === 2) {
        return { label: 'Đã giao hàng', color: '#28a745', value: '5' }
      } else if (orderData.status_delivery === 1) {
        return { label: 'Đang giao hàng', color: '#17a2b8', value: '4' }
      } else if (orderData.status_delivery === 0) {
        return { label: 'Đã nhận hàng từ kho', color: '#ffa500', value: '3' }
      } else {
        return { label: 'Đã giao cho bên vận chuyển', color: '#28a745', value: '2' }
      }
    }
    
    // Các trạng thái đơn hàng ban đầu
    if (orderData.status_order === 1) {
      return { label: 'Đang xử lý', color: '#17a2b8', value: '1' }
    }
    
    if (orderData.status_order === 0) {
      return { label: 'Chờ xác nhận', color: '#ffa500', value: '0' }
    }
    
    return { label: 'Không xác định', color: '#6c757d', value: '0' }
  }

  // Hàm tính toán trạng thái tiếp theo có thể chọn
  const getNextAvailableStatus = (orderData) => {
    if (!orderData || orderData.status_user_order === 1) {
      return null // Đã hủy, không thể cập nhật
    }

    // Tính unified_status hiện tại
    let currentUnifiedStatus = 0
    if (orderData.status_order < 2) {
      currentUnifiedStatus = orderData.status_order
    } else if (orderData.status_order === 2) {
      if (orderData.status_delivery === null || orderData.status_delivery === undefined) {
        currentUnifiedStatus = 2 // Đã giao cho vận chuyển nhưng chưa có trạng thái giao hàng
      } else {
        currentUnifiedStatus = 3 + parseInt(orderData.status_delivery) // 3 + 0 = 3, 3 + 1 = 4, 3 + 2 = 5
      }
    }

    // Nếu đã đạt trạng thái cuối cùng (5 = Đã giao hàng)
    if (currentUnifiedStatus >= 5) {
      return null
    }

    // Trả về trạng thái tiếp theo (chỉ tăng 1 bước)
    const nextStatus = currentUnifiedStatus + 1

    // Map unified_status về label
    const statusLabels = {
      0: 'Chờ xác nhận',
      1: 'Đang xử lý',
      2: 'Đã giao cho bên vận chuyển',
      3: 'Đã nhận hàng từ kho',
      4: 'Đang giao hàng',
      5: 'Đã giao hàng'
    }

    return {
      value: nextStatus.toString(),
      label: statusLabels[nextStatus] || 'Không xác định'
    }
  }

  // Sử dụng formatDateTime từ dateHelper
  const formatDate = formatDateTime

  // Hàm lấy phương thức thanh toán
  const getPaymentMethod = (methodPay) => {
    // method_pay: 0 = cash, 1 = bank, 2 = MoMo
    const methodMap = {
      0: 'Thanh toán khi nhận hàng',
      1: 'Thanh toán qua ngân hàng',
      2: 'Thanh toán qua MoMo',
    }
    return methodMap[methodPay] || 'Không xác định'
  }

  // Tính toán orderData, unifiedStatus, nextAvailableStatus trước khi render
  const orderData = order?.order || order
  const unifiedStatus = orderData ? getUnifiedStatus(orderData) : { label: 'Không xác định', color: '#6c757d', value: '0' }
  const nextAvailableStatus = orderData ? getNextAvailableStatus(orderData) : null
  const paymentMethod = orderData ? getPaymentMethod(orderData.method_pay) : null
  
  // Cập nhật statusForm khi orderData thay đổi để đồng bộ với trạng thái hiện tại
  useEffect(() => {
    if (orderData && !orderData.status_user_order) {
      const currentUnifiedStatus = getUnifiedStatus(orderData).value
      if (statusForm.status !== currentUnifiedStatus) {
        setStatusForm({ status: currentUnifiedStatus })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData])

  if (loading) {
    return (
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
    )
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '1.6rem', color: '#666', marginBottom: '20px' }}>
          Không tìm thấy đơn hàng
        </p>
        <button
          onClick={() => navigate('/admin/orders')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.4rem'
          }}
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    )
  }

  const orderDetails = order?.details || []

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
      active: !isCancelled && orderData.status_order === 2 && (orderData.status_delivery === null || orderData.status_delivery === undefined),
      color: '#28a745',
      cancelled: isCancelled
    })

    // Chỉ hiển thị các bước delivery khi status_order = 2
    if (orderData.status_order === 2) {
      // Bước 4: Đã nhận hàng từ kho (status_delivery = 0)
      workflowSteps.push({
        step: 4,
        label: 'Đã nhận hàng từ kho',
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

  if (loading) {
    return (
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
    )
  }

  if (!order) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ fontSize: '1.6rem', color: '#666', marginBottom: '20px' }}>
          Không tìm thấy đơn hàng
        </p>
        <button
          onClick={() => navigate('/admin/orders')}
          style={{
            padding: '12px 24px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.4rem'
          }}
        >
          Quay lại danh sách đơn hàng
        </button>
      </div>
    )
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '3.2rem', 
            margin: 0, 
            marginBottom: '8px',
            color: '#1a1a1a',
            fontWeight: '700',
            letterSpacing: '-0.02em'
          }}>
            Chi tiết đơn hàng #{id}
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#6c757d',
            margin: 0
          }}>
            Xem và quản lý thông tin chi tiết đơn hàng
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/orders')}
          style={{
            padding: '14px 28px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1.4rem',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 4px rgba(108, 117, 125, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#5a6268'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6c757d'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 2px 4px rgba(108, 117, 125, 0.2)'
          }}
        >
          Quay lại
        </button>
      </div>

      {/* Order Info */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '32px',
        marginBottom: '24px',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          <div>
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#6c757d', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Ngày đặt
            </p>
            <p style={{ 
              fontSize: '1.6rem', 
              fontWeight: '600',
              color: '#212529'
            }}>
              {formatDate(orderData.date_order)}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#6c757d', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Trạng thái đơn hàng
            </p>
            <span style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '1.2rem',
              fontWeight: '600',
              backgroundColor: unifiedStatus.color === '#ffa500' ? '#fff3cd' : 
                              unifiedStatus.color === '#17a2b8' ? '#d1ecf1' : 
                              unifiedStatus.color === '#dc3545' ? '#f8d7da' : '#d4edda',
              color: unifiedStatus.color === '#ffa500' ? '#856404' : 
                     unifiedStatus.color === '#17a2b8' ? '#0c5460' : 
                     unifiedStatus.color === '#dc3545' ? '#721c24' : '#155724',
              display: 'inline-block'
            }}>
              {unifiedStatus.label}
            </span>
          </div>
          <div>
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#6c757d', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Tổng tiền
            </p>
            <p style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#1976d2'
            }}>
              {formatCurrency(orderData.total_order)}
            </p>
          </div>
          <div>
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#6c757d', 
              marginBottom: '8px',
              fontWeight: '500'
            }}>
              Phương thức thanh toán
            </p>
            <p style={{ 
              fontSize: '1.6rem', 
              fontWeight: '600',
              color: '#212529'
            }}>
              {paymentMethod}
            </p>
          </div>
        </div>

        {/* Workflow */}
        {renderWorkflow()}

        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px', 
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Thông tin khách hàng
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
            gap: '20px' 
          }}>
            <div>
              <p style={{ 
                fontSize: '1.3rem', 
                color: '#6c757d', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Tên
              </p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600',
                color: '#212529'
              }}>
                {orderData.name_customer}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '1.3rem', 
                color: '#6c757d', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Email
              </p>
              <p style={{ 
                fontSize: '1.5rem',
                color: '#495057'
              }}>
                {orderData.user_email || '-'}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '1.3rem', 
                color: '#6c757d', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Số điện thoại
              </p>
              <p style={{ 
                fontSize: '1.5rem',
                color: '#495057'
              }}>
                {orderData.phone_customer}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '1.3rem', 
                color: '#6c757d', 
                marginBottom: '8px',
                fontWeight: '500'
              }}>
                Địa chỉ
              </p>
              <p style={{ 
                fontSize: '1.5rem',
                color: '#495057'
              }}>
                {orderData.address_customer}
              </p>
            </div>
          </div>
        </div>

        {/* Hiển thị lý do hủy đơn nếu đã hủy */}
        {orderData.status_user_order === 1 && (
          <div style={{
            backgroundColor: '#fff3cd',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffc107'
          }}>
            <h3 style={{ fontSize: '1.8rem', marginBottom: '15px', fontWeight: 'bold', color: '#856404' }}>
              Đơn hàng đã bị hủy
            </h3>
            <div>
              <p style={{ fontSize: '1.4rem', color: '#666', marginBottom: '10px' }}>
                <strong>Lý do hủy đơn:</strong>
              </p>
              <p style={{ fontSize: '1.4rem', color: '#856404', fontStyle: 'italic' }}>
                {orderData.reason_user_order || 'Không có lý do'}
              </p>
            </div>
          </div>
        )}

        {/* Update Status */}
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '24px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid #bbdefb',
          opacity: orderData.status_user_order === 1 ? 0.6 : 1
        }}>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px', 
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Cập nhật trạng thái
          </h3>
          {orderData.status_user_order === 1 ? (
            <p style={{ 
              fontSize: '1.5rem', 
              color: '#dc3545', 
              fontStyle: 'italic',
              fontWeight: '500'
            }}>
              Không thể cập nhật trạng thái đơn hàng đã bị hủy
            </p>
          ) : (
            <>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '1.4rem', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Trạng thái đơn hàng
              </label>
              <select
                value={nextAvailableStatus ? nextAvailableStatus.value : unifiedStatus.value}
                onChange={(e) => setStatusForm(prev => ({ ...prev, status: e.target.value }))}
                disabled={!nextAvailableStatus || orderData?.status_user_order === 1}
                style={{
                  padding: '12px 16px',
                  fontSize: '1.4rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  outline: 'none',
                  minWidth: '280px',
                  backgroundColor: '#fff',
                  cursor: (!nextAvailableStatus || orderData?.status_user_order === 1) ? 'not-allowed' : 'pointer',
                  opacity: (!nextAvailableStatus || orderData?.status_user_order === 1) ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  if (nextAvailableStatus && orderData?.status_user_order !== 1) {
                    e.target.style.borderColor = '#1976d2'
                    e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.boxShadow = 'none'
                }}
              >
                {nextAvailableStatus ? (
                  <option value={nextAvailableStatus.value}>{nextAvailableStatus.label}</option>
                ) : (
                  <option value={unifiedStatus.value} disabled>{unifiedStatus.label} (Đã hoàn thành)</option>
                )}
              </select>
            </div>
            <button
              onClick={handleUpdateStatus}
              disabled={updating || !nextAvailableStatus || orderData?.status_user_order === 1}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: (updating || !nextAvailableStatus || orderData?.status_user_order === 1) ? 'not-allowed' : 'pointer',
                fontSize: '1.4rem',
                fontWeight: '600',
                opacity: (updating || orderData?.status_user_order === 1 || (orderData?.status_order === 2 && orderData?.status_delivery === 2)) ? 0.6 : 1,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!updating && orderData?.status_user_order !== 1 && !(orderData?.status_order === 2 && orderData?.status_delivery === 2)) {
                  e.target.style.backgroundColor = '#1565c0'
                  e.target.style.transform = 'translateY(-1px)'
                  e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)'
                }
              }}
              onMouseLeave={(e) => {
                if (!updating && orderData?.status_user_order !== 1 && !(orderData?.status_order === 2 && orderData?.status_delivery === 2)) {
                  e.target.style.backgroundColor = '#1976d2'
                  e.target.style.transform = 'translateY(0)'
                  e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)'
                }
              }}
            >
              {updating ? <ClipLoader color="#fff" size={16} /> : 'Cập nhật trạng thái'}
            </button>
          </div>
            </>
          )}
        </div>
      </div>

      {/* Order Products */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        padding: '32px',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <h3 style={{ 
          fontSize: '2rem', 
          marginBottom: '24px', 
          fontWeight: '700',
          color: '#1a1a1a'
        }}>
          Sản phẩm
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8f9fa',
                borderBottom: '2px solid #e9ecef'
              }}>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Sản phẩm
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Size
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'right', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Giá
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Số lượng
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'right', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Tổng tiền
                </th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ 
                    padding: '60px 40px', 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    Không có sản phẩm
                  </td>
                </tr>
              ) : (
                orderDetails.map((detail, index) => {
                  const quantity = detail.quantity_detail || 0
                  const totalDetail = detail.total_detail || 0
                  // Lấy giá từ API response
                  const originalPrice = parseFloat(detail.original_price) || 0
                  const discountPrice = parseFloat(detail.discount_price) || (quantity > 0 ? totalDetail / quantity : 0)
                  const hasDiscount = originalPrice > 0 && originalPrice > discountPrice
                  
                  return (
                    <tr 
                      key={detail.id || index} 
                      style={{ 
                        borderBottom: '1px solid #e9ecef',
                        transition: 'background-color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#f8f9fa'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <td style={{ 
                        padding: '16px', 
                        fontSize: '1.4rem',
                        fontWeight: '500',
                        color: '#212529'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          {detail.image_product && (
                            <img
                              src={detail.image_product.startsWith('http') ? detail.image_product : `/${detail.image_product}`}
                              alt={detail.name_product}
                              style={{
                                width: '50px',
                                height: '50px',
                                objectFit: 'cover',
                                borderRadius: '8px'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none'
                              }}
                            />
                          )}
                          <span>{detail.name_product}</span>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        fontSize: '1.4rem',
                        fontWeight: '500',
                        color: '#495057'
                      }}>
                        {detail.size || '-'}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right', 
                        fontSize: '1.4rem'
                      }}>
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
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'center', 
                        fontSize: '1.4rem',
                        fontWeight: '500',
                        color: '#495057'
                      }}>
                        {quantity}
                      </td>
                      <td style={{ 
                        padding: '16px', 
                        textAlign: 'right', 
                        fontSize: '1.4rem', 
                        fontWeight: '700',
                        color: '#1976d2'
                      }}>
                        {formatCurrency(totalDetail)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Order Summary */}
        <div style={{ 
          marginTop: '32px',
          padding: '24px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ 
            fontSize: '2rem', 
            marginBottom: '20px', 
            fontWeight: '700',
            color: '#1a1a1a'
          }}>
            Tóm tắt đơn hàng
          </h3>
          
          {/* Tính tổng tiền gốc và tiết kiệm từ sản phẩm */}
          {(() => {
            let subtotalOriginal = 0
            let subtotalDiscount = 0
            let totalSavings = 0
            
            orderDetails.forEach(detail => {
              const quantity = detail.quantity_detail || 0
              const originalPrice = parseFloat(detail.original_price) || 0
              const discountPrice = parseFloat(detail.discount_price) || (detail.total_detail ? parseFloat(detail.total_detail) / quantity : 0)
              
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
      </div>
    </div>
  )
}

export default AdminOrderDetail


