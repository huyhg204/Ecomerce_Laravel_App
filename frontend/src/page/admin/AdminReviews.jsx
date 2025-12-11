import { useState, useEffect, useMemo } from 'react'
import { ClipLoader } from 'react-spinners'
import { FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaStar, FaEye, FaEyeSlash } from 'react-icons/fa'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'
import { formatDateOnly } from '../../utils/dateHelper'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [togglingStatus, setTogglingStatus] = useState(null)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  })
  const itemsPerPage = 20
  const [detailReview, setDetailReview] = useState(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
      setCurrentPage(1)
    }, 350)

    return () => clearTimeout(timeout)
  }, [searchTerm])

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, ratingFilter, statusFilter, debouncedSearchTerm])

  // Đảm bảo reviews luôn là mảng
  useEffect(() => {
    if (!Array.isArray(reviews)) {
      console.warn('reviews is not an array, resetting to []')
      setReviews([])
    }
  }, [reviews])

  const fetchReviews = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true)
      }
      
      const params = {
        page: currentPage,
        per_page: itemsPerPage
      }
      
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm
      }
      
      if (ratingFilter) {
        params.rating = ratingFilter
      }
      
      if (statusFilter !== '') {
        params.status = statusFilter
      }
      
      const response = await axiosInstance.get('/admin/reviews', { params })
      if (response.data.status === 'success') {
        const reviewsData = response.data.data?.reviews || response.data.data
        setReviews(Array.isArray(reviewsData) ? reviewsData : [])
        
        if (response.data.data?.pagination) {
          setPagination(response.data.data.pagination)
        }
      } else {
        setReviews([])
      }
    } catch (error) {
      if (!silent) {
        toast.error('Không thể tải danh sách đánh giá')
      }
      console.error('Lỗi khi tải đánh giá:', error)
      setReviews([])
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa đánh giá này?')) return
    
    try {
      // Optimistic update: Xóa ngay khỏi UI
      setReviews(prevReviews => prevReviews.filter(review => review.id !== id))
      
      await axiosInstance.delete(`/admin/reviews/${id}`)
      toast.success('Xóa đánh giá thành công')
      
      // Refresh dữ liệu trong background (silent mode - không hiển thị loading)
      fetchReviews(true)
    } catch (error) {
      // Rollback nếu có lỗi
      fetchReviews(true)
      toast.error('Xóa đánh giá thất bại')
      console.error('Lỗi:', error)
    }
  }

  const handleReply = async (reviewId) => {
    if (!replyText.trim()) {
      toast.error('Vui lòng nhập nội dung phản hồi')
      return
    }

    try {
      await axiosInstance.post(`/admin/reviews/${reviewId}/reply`, {
        admin_reply: replyText.trim()
      })
      
      toast.success('Đã thêm phản hồi thành công')
      setReplyingTo(null)
      setReplyText('')
      fetchReviews(true)
    } catch (error) {
      toast.error('Không thể thêm phản hồi')
      console.error('Lỗi:', error)
    }
  }

  const handleToggleStatus = async (reviewId, currentStatus) => {
    try {
      setTogglingStatus(reviewId)
      
      // Optimistic update
      setReviews(prevReviews => 
        prevReviews.map(review => 
          review.id === reviewId 
            ? { ...review, status: currentStatus === 1 ? 0 : 1 }
            : review
        )
      )
      
      await axiosInstance.put(`/admin/reviews/${reviewId}/toggle-status`)
      
      toast.success(currentStatus === 1 ? 'Đã ẩn đánh giá' : 'Đã hiển thị đánh giá')
      fetchReviews(true)
    } catch (error) {
      // Rollback
      fetchReviews(true)
      toast.error('Không thể thay đổi trạng thái đánh giá')
      console.error('Lỗi:', error)
    } finally {
      setTogglingStatus(null)
    }
  }

  // Đảm bảo reviews luôn là mảng
  const safeReviews = useMemo(() => {
    if (!reviews) return []
    if (!Array.isArray(reviews)) {
      console.warn('reviews is not an array:', reviews)
      return []
    }
    return reviews
  }, [reviews])

  // Load reply text khi mở modal
  const replyingReview = useMemo(
    () => safeReviews.find(r => r.id === replyingTo),
    [replyingTo, safeReviews]
  )

  useEffect(() => {
    if (replyingReview?.admin_reply) {
      setReplyText(replyingReview.admin_reply)
    } else {
      setReplyText('')
    }
  }, [replyingReview])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [ratingFilter, statusFilter])

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < pagination.last_page) {
      handlePageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const totalPages = pagination.last_page
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Render stars
  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{
              color: star <= rating ? '#ffc107' : '#e0e0e0',
              fontSize: '1.4rem'
            }}
          />
        ))}
        <span style={{ marginLeft: '8px', fontSize: '1.3rem', fontWeight: '600' }}>
          {rating}/5
        </span>
      </div>
    )
  }

  // Format date - sử dụng utility function
  // Sử dụng formatDateOnly từ dateHelper (chỉ hiển thị ngày, không có giờ)
  const formatDate = formatDateOnly

  return (
    <div>
      <h1 style={{ fontSize: '3rem', marginBottom: '30px', color: '#333' }}>
        Quản lý đánh giá sản phẩm
      </h1>

      {/* Search and Filter */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        gap: '15px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{
          position: 'relative',
          maxWidth: '400px',
          flex: '1',
          minWidth: '250px'
        }}>
          <FaSearch style={{
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '1.6rem'
          }} />
          <input
            type="text"
            placeholder="Tìm kiếm đánh giá..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 45px',
              fontSize: '1.4rem',
              border: '1px solid #e0e0e0',
              borderRadius: '5px',
              outline: 'none'
            }}
          />
        </div>
        
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          style={{
            padding: '12px 15px',
            fontSize: '1.4rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="">Tất cả đánh giá</option>
          <option value="5">5 sao</option>
          <option value="4">4 sao</option>
          <option value="3">3 sao</option>
          <option value="2">2 sao</option>
          <option value="1">1 sao</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '12px 15px',
            fontSize: '1.4rem',
            border: '1px solid #e0e0e0',
            borderRadius: '5px',
            outline: 'none',
            cursor: 'pointer',
            minWidth: '150px'
          }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Đang hiển thị</option>
          <option value="0">Đã ẩn</option>
        </select>
      </div>

      {/* Reviews Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '960px', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #e0e0e0'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '70px' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '190px' }}>Người dùng</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '240px' }}>Sản phẩm</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '140px' }}>Đánh giá</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '140px' }}>Trạng thái</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '140px' }}>Ngày tạo</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold', whiteSpace: 'nowrap', width: '210px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ 
                    padding: '60px 40px', 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '15px'
                    }}>
                      <ClipLoader color="#1976d2" size={40} />
                      <p style={{ margin: 0 }}>Đang tải danh sách đánh giá...</p>
                    </div>
                  </td>
                </tr>
              ) : safeReviews.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ padding: '40px', textAlign: 'center', fontSize: '1.4rem', color: '#666' }}>
                    Không có đánh giá nào
                  </td>
                </tr>
              ) : (
                safeReviews.map((review) => (
                  <tr
                    key={review.id}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'background-color 0.2s',
                      opacity: review.status === 0 ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                      const row = e.currentTarget
                      row.style.backgroundColor = '#f9f9f9'
                    }}
                    onMouseLeave={(e) => {
                      const row = e.currentTarget
                      row.style.backgroundColor = 'transparent'
                    }}
                  >
                    <td style={{ padding: '15px', fontSize: '1.4rem' }}>{review.id}</td>
                    <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px', wordBreak: 'break-word' }}>
                          {review.user_name || '-'}
                        </div>
                        <div style={{ fontSize: '1.2rem', color: '#666', wordBreak: 'break-word' }}>
                          {review.user_email || '-'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {review.product_image && (
                          <img 
                            src={review.product_image} 
                            alt={review.product_name}
                            style={{
                              width: '64px',
                              height: '64px',
                              objectFit: 'cover',
                              borderRadius: '6px',
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontWeight: '600', wordBreak: 'break-word' }}>
                            {review.product_name || '-'}
                          </div>
                          {review.product_id && (
                            <div style={{ fontSize: '1.2rem', color: '#666' }}>ID: {review.product_id}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {renderStars(review.rating)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        backgroundColor: review.status === 1 ? '#d4edda' : '#f8d7da',
                        color: review.status === 1 ? '#155724' : '#721c24'
                      }}>
                        {review.status === 1 ? 'Hiển thị' : 'Đã ẩn'}
                      </span>
                    </td>
                    <td style={{ padding: '15px', fontSize: '1.3rem', color: '#666' }}>
                      {formatDate(review.created_at)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => setDetailReview(review)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#6f42c1',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#59359c'
                            e.target.style.transform = 'translateY(-1px)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#6f42c1'
                            e.target.style.transform = 'translateY(0)'
                          }}
                        >
                          <FaEye /> Chi tiết
                        </button>
                        <button
                          onClick={() => setReplyingTo(review.id)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#138496'
                            e.target.style.transform = 'translateY(-1px)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#17a2b8'
                            e.target.style.transform = 'translateY(0)'
                          }}
                        >
                          Trả lời
                        </button>
                        <button
                          onClick={() => handleToggleStatus(review.id, review.status)}
                          disabled={togglingStatus === review.id}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: review.status === 1 ? '#ffc107' : '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: togglingStatus === review.id ? 'not-allowed' : 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            opacity: togglingStatus === review.id ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => {
                            if (togglingStatus !== review.id) {
                              e.target.style.transform = 'translateY(-1px)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)'
                          }}
                        >
                          {review.status === 1 ? <FaEyeSlash /> : <FaEye />}
                          {review.status === 1 ? 'Ẩn' : 'Hiện'}
                        </button>
                        <button
                          onClick={() => handleDelete(review.id)}
                          style={{
                            padding: '8px 14px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(220, 53, 69, 0.2)'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#c82333'
                            e.target.style.transform = 'translateY(-1px)'
                            e.target.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#dc3545'
                            e.target.style.transform = 'translateY(0)'
                            e.target.style.boxShadow = '0 2px 4px rgba(220, 53, 69, 0.2)'
                          }}
                        >
                          <FaTrash /> Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {!loading && safeReviews.length > 0 && pagination.last_page > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginTop: '32px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            style={{
              padding: '10px 16px',
              fontSize: '1.4rem',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              backgroundColor: currentPage === 1 ? '#f8f9fa' : '#fff',
              color: currentPage === 1 ? '#adb5bd' : '#495057',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (currentPage > 1) {
                e.target.style.backgroundColor = '#e9ecef'
                e.target.style.borderColor = '#dee2e6'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage > 1) {
                e.target.style.backgroundColor = '#fff'
                e.target.style.borderColor = '#e9ecef'
              }
            }}
          >
            <FaChevronLeft /> Trước
          </button>

          {getPageNumbers().map((page, index) => (
            page === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} style={{
                padding: '10px 16px',
                fontSize: '1.4rem',
                color: '#6c757d'
              }}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                style={{
                  padding: '10px 16px',
                  fontSize: '1.4rem',
                  border: '2px solid',
                  borderColor: currentPage === page ? '#1976d2' : '#e9ecef',
                  borderRadius: '10px',
                  backgroundColor: currentPage === page ? '#1976d2' : '#fff',
                  color: currentPage === page ? '#fff' : '#495057',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.borderColor = '#dee2e6'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.target.style.backgroundColor = '#fff'
                    e.target.style.borderColor = '#e9ecef'
                  }
                }}
              >
                {page}
              </button>
            )
          ))}

          <button
            onClick={handleNextPage}
            disabled={currentPage >= pagination.last_page}
            style={{
              padding: '10px 16px',
              fontSize: '1.4rem',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              backgroundColor: currentPage >= pagination.last_page ? '#f8f9fa' : '#fff',
              color: currentPage >= pagination.last_page ? '#adb5bd' : '#495057',
              cursor: currentPage >= pagination.last_page ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (currentPage < pagination.last_page) {
                e.target.style.backgroundColor = '#e9ecef'
                e.target.style.borderColor = '#dee2e6'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage < pagination.last_page) {
                e.target.style.backgroundColor = '#fff'
                e.target.style.borderColor = '#e9ecef'
              }
            }}
          >
            Sau <FaChevronRight />
          </button>
        </div>
      )}

      {/* Pagination Info */}
      {!loading && safeReviews.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '16px',
          fontSize: '1.3rem',
          color: '#6c757d'
        }}>
          Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, pagination.total)} trong tổng số {pagination.total} đánh giá
        </div>
      )}

      {/* Modal Chi tiết */}
      {detailReview && (
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
            zIndex: 2100,
            padding: '20px'
          }}
          onClick={() => setDetailReview(null)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#333' }}>Chi tiết đánh giá</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '1.3rem', color: '#666' }}>Người dùng</div>
                <div style={{ fontWeight: 600, fontSize: '1.4rem' }}>{detailReview.user_name || '-'}</div>
                <div style={{ fontSize: '1.2rem', color: '#888' }}>{detailReview.user_email || '-'}</div>
              </div>
              <div>
                <div style={{ fontSize: '1.3rem', color: '#666' }}>Ngày tạo</div>
                <div style={{ fontWeight: 600, fontSize: '1.4rem' }}>{formatDate(detailReview.created_at)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              {detailReview.product_image && (
                <img
                  src={detailReview.product_image}
                  alt={detailReview.product_name}
                  style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: '8px' }}
                />
              )}
              <div>
                <div style={{ fontSize: '1.3rem', color: '#666' }}>Sản phẩm</div>
                <div style={{ fontWeight: 600, fontSize: '1.4rem' }}>{detailReview.product_name || '-'}</div>
                {detailReview.product_id && (
                  <div style={{ fontSize: '1.2rem', color: '#888' }}>ID: {detailReview.product_id}</div>
                )}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '1.3rem', color: '#666', marginBottom: '4px' }}>Đánh giá</div>
              {renderStars(detailReview.rating)}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '1.3rem', color: '#666', marginBottom: '4px' }}>Nội dung</div>
              <div style={{ fontSize: '1.4rem', color: '#333', whiteSpace: 'pre-wrap' }}>
                {detailReview.content || '(Không có nội dung)'}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '1.3rem', color: '#666', marginBottom: '4px' }}>Phản hồi Admin</div>
              {detailReview.admin_reply ? (
                <div style={{ fontSize: '1.4rem', color: '#333', whiteSpace: 'pre-wrap' }}>
                  {detailReview.admin_reply}
                </div>
              ) : (
                <div style={{ fontSize: '1.3rem', color: '#999', fontStyle: 'italic' }}>Chưa có phản hồi</div>
              )}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '1.3rem', color: '#666', marginBottom: '4px' }}>Trạng thái</div>
              <span style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '1.2rem',
                fontWeight: '600',
                backgroundColor: detailReview.status === 1 ? '#d4edda' : '#f8d7da',
                color: detailReview.status === 1 ? '#155724' : '#721c24'
              }}>
                {detailReview.status === 1 ? 'Hiển thị' : 'Đã ẩn'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                onClick={() => setDetailReview(null)}
                style={{
                  padding: '10px 18px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.3rem',
                  fontWeight: '600'
                }}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trả lời đánh giá */}
      {replyingTo && (
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
          onClick={() => {
            setReplyingTo(null)
            setReplyText('')
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '2rem', marginBottom: '20px', color: '#333' }}>
              {replyingReview?.admin_reply ? 'Sửa phản hồi' : 'Trả lời đánh giá'}
            </h2>
            
            {replyingReview && (
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '15px', 
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '8px' }}>
                  Đánh giá từ: {replyingReview.user_name}
                </div>
                <div style={{ fontSize: '1.4rem', color: '#333' }}>
                  {replyingReview.content || '(Không có nội dung)'}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontSize: '1.4rem', 
                fontWeight: '600',
                color: '#495057'
              }}>
                Phản hồi:
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập phản hồi của bạn..."
                rows="5"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '1.4rem',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#1976d2'
                  e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef'
                  e.target.style.boxShadow = 'none'
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => {
                  setReplyingTo(null)
                  setReplyText('')
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  fontWeight: '600'
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleReply(replyingTo)}
                disabled={!replyText.trim()}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: !replyText.trim() ? 'not-allowed' : 'pointer',
                  fontSize: '1.4rem',
                  fontWeight: '600',
                  opacity: !replyText.trim() ? 0.6 : 1
                }}
              >
                {replyingReview?.admin_reply ? 'Cập nhật' : 'Gửi phản hồi'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminReviews

