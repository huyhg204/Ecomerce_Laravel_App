import { useState, useEffect, useMemo } from 'react'
import { ClipLoader } from 'react-spinners'
import { FaTrash, FaSearch, FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1
  })
  const itemsPerPage = 20

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, ratingFilter, searchTerm])

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
      
      if (searchTerm) {
        params.search = searchTerm
      }
      
      if (ratingFilter) {
        params.rating = ratingFilter
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

  // Đảm bảo reviews luôn là mảng
  const safeReviews = useMemo(() => {
    if (!reviews) return []
    if (!Array.isArray(reviews)) {
      console.warn('reviews is not an array:', reviews)
      return []
    }
    return reviews
  }, [reviews])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, ratingFilter])

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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
      </div>

      {/* Reviews Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #e0e0e0'
              }}>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>ID</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Người dùng</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Sản phẩm</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>Đánh giá</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Nội dung</th>
                <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Ngày tạo</th>
                <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ 
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
                  <td colSpan="7" style={{ padding: '40px', textAlign: 'center', fontSize: '1.4rem', color: '#666' }}>
                    Không có đánh giá nào
                  </td>
                </tr>
              ) : (
                safeReviews.map((review) => (
                  <tr
                    key={review.id}
                    style={{
                      borderBottom: '1px solid #e0e0e0',
                      transition: 'background-color 0.2s'
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
                        <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                          {review.user_name || '-'}
                        </div>
                        <div style={{ fontSize: '1.2rem', color: '#666' }}>
                          {review.user_email || '-'}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                      <div style={{ maxWidth: '200px' }}>
                        <div style={{ fontWeight: '500' }}>
                          {review.product_name || '-'}
                        </div>
                        {review.product_image && (
                          <img 
                            src={review.product_image} 
                            alt={review.product_name}
                            style={{
                              width: '50px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '5px',
                              marginTop: '5px'
                            }}
                          />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      {renderStars(review.rating)}
                    </td>
                    <td style={{ padding: '15px', fontSize: '1.4rem', maxWidth: '300px' }}>
                      <div style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        color: review.content ? '#333' : '#999'
                      }}>
                        {review.content || '(Không có nội dung)'}
                      </div>
                    </td>
                    <td style={{ padding: '15px', fontSize: '1.3rem', color: '#666' }}>
                      {formatDate(review.created_at)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
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
    </div>
  )
}

export default AdminReviews

