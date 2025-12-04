import { useState, useEffect, useRef } from 'react'
import { ClipLoader } from 'react-spinners'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage } from 'react-icons/fa'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'
import { getImageUrl } from '../../utils/imageHelper'

const AdminBanners = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [positionFilter, setPositionFilter] = useState('all') // 'all', '0', '1'
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
    badge: '',
    position: '0', // 0: hero slider, 1: banner single
    order: 0,
    status: 1
  })
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/admin/banners')
      
      if (response.data.status === 'success') {
        const bannersData = response.data.data || []
        setBanners(Array.isArray(bannersData) ? bannersData : [])
      }
    } catch (error) {
      toast.error('Không thể tải danh sách banner')
      console.error('Lỗi khi tải banner:', error)
      setBanners([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước ảnh không được vượt quá 5MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        image: file
      }))
      
      // Tạo preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('description', formData.description || '')
      payload.append('link', formData.link || '')
      payload.append('badge', formData.badge || '')
      payload.append('position', formData.position)
      payload.append('order', formData.order)
      payload.append('status', formData.status)
      
      if (formData.image instanceof File) {
        payload.append('image', formData.image)
      } else if (typeof formData.image === 'string' && formData.image) {
        payload.append('image', formData.image)
      }

      if (editingBanner) {
        await axiosInstance.post(`/admin/banners/${editingBanner.id}`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success('Cập nhật banner thành công')
      } else {
        await axiosInstance.post('/admin/banners', payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success('Thêm banner thành công')
      }

      setShowModal(false)
      resetForm()
      fetchBanners()
    } catch (error) {
      toast.error('Không thể lưu banner', {
        description: error.response?.data?.message || 'Vui lòng thử lại'
      })
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      image: banner.image || '',
      link: banner.link || '',
      badge: banner.badge || '',
      position: banner.position?.toString() || '0',
      order: banner.order || 0,
      status: banner.status ?? 1
    })
    setPreviewImage(banner.image ? getImageUrl(banner.image) : null)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa banner này?')) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/banners/${id}`)
      toast.success('Xóa banner thành công')
      fetchBanners()
    } catch (error) {
      toast.error('Không thể xóa banner', {
        description: error.response?.data?.message || 'Vui lòng thử lại'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      link: '',
      badge: '',
      position: '0',
      order: 0,
      status: 1
    })
    setEditingBanner(null)
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = 
      (banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (banner.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      (banner.badge?.toLowerCase().includes(searchTerm.toLowerCase()) || '')
    
    const matchesPosition = positionFilter === 'all' || banner.position?.toString() === positionFilter
    
    return matchesSearch && matchesPosition
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <ClipLoader color="#1976d2" size={50} />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 'bold' }}>Quản lý Banner</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          style={{
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}
        >
          <FaPlus /> Thêm Banner
        </button>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '15px', 
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
          <FaSearch style={{ 
            position: 'absolute', 
            left: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#999',
            fontSize: '1.6rem'
          }} />
          <input
            type="text"
            placeholder="Tìm kiếm banner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 15px 12px 45px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '1.4rem'
            }}
          />
        </div>
        <select
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
          style={{
            padding: '12px 15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '1.4rem',
            cursor: 'pointer'
          }}
        >
          <option value="all">Tất cả vị trí</option>
          <option value="0">Hero Slider</option>
          <option value="1">Banner Single</option>
        </select>
      </div>

      {/* Banner List */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Ảnh</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Tiêu đề</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Vị trí</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Thứ tự</th>
              <th style={{ padding: '15px', textAlign: 'left', fontSize: '1.4rem', fontWeight: 'bold' }}>Trạng thái</th>
              <th style={{ padding: '15px', textAlign: 'center', fontSize: '1.4rem', fontWeight: 'bold' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredBanners.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', fontSize: '1.6rem', color: '#999' }}>
                  {searchTerm || positionFilter !== 'all' ? 'Không tìm thấy banner nào' : 'Chưa có banner nào'}
                </td>
              </tr>
            ) : (
              filteredBanners.map((banner) => (
                <tr key={banner.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '15px' }}>
                    {banner.image ? (
                      <img
                        src={getImageUrl(banner.image)}
                        alt={banner.title || 'Banner'}
                        style={{
                          width: '100px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100px',
                        height: '60px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '4px',
                        color: '#999'
                      }}>
                        <FaImage size={20} />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                    <div style={{ fontWeight: '500' }}>{banner.title || 'Không có tiêu đề'}</div>
                    {banner.badge && (
                      <div style={{ fontSize: '1.2rem', color: '#666', marginTop: '4px' }}>
                        Badge: {banner.badge}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                    {banner.position === 0 ? 'Hero Slider' : 'Banner Single'}
                  </td>
                  <td style={{ padding: '15px', fontSize: '1.4rem' }}>{banner.order || 0}</td>
                  <td style={{ padding: '15px', fontSize: '1.4rem' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      fontWeight: '500',
                      backgroundColor: banner.status === 1 ? '#d4edda' : '#f8d7da',
                      color: banner.status === 1 ? '#155724' : '#721c24'
                    }}>
                      {banner.status === 1 ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                      <button
                        onClick={() => handleEdit(banner)}
                        style={{
                          backgroundColor: '#28a745',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '1.3rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FaEdit /> Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
                        style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '1.3rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
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

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }} onClick={handleCloseModal}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '800px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
              {editingBanner ? 'Chỉnh sửa Banner' : 'Thêm Banner Mới'}
            </h2>

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Vị trí *
                  </label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem'
                    }}
                  >
                    <option value="0">Hero Slider (Slider đầu trang)</option>
                    <option value="1">Banner Single (Banner đơn lẻ)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Tiêu đề
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Badge
                  </label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    placeholder="Ví dụ: iPhone 15 Series"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Link (URL khi click vào banner)
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                    Ảnh {!editingBanner && '(Tối đa 5MB)'}
                  </label>
                  {previewImage && (
                    <div style={{ marginBottom: '10px' }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '300px',
                          borderRadius: '4px',
                          border: '1px solid #ddd'
                        }}
                      />
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '1.4rem'
                    }}
                  />
                  {!editingBanner && !previewImage && (
                    <div style={{ marginTop: '8px', fontSize: '1.2rem', color: '#666' }}>
                      Hoặc nhập link ảnh:
                      <input
                        type="url"
                        name="image"
                        value={typeof formData.image === 'string' ? formData.image : ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, image: e.target.value }))
                          setPreviewImage(e.target.value || null)
                        }}
                        placeholder="https://..."
                        style={{
                          width: '100%',
                          padding: '8px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          fontSize: '1.3rem',
                          marginTop: '8px'
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                      Thứ tự
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1.4rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '1.4rem', fontWeight: '500' }}>
                      Trạng thái
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        fontSize: '1.4rem'
                      }}
                    >
                      <option value={1}>Hiển thị</option>
                      <option value={0}>Ẩn</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    padding: '12px 24px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    backgroundColor: '#1976d2',
                    color: '#fff'
                  }}
                >
                  {editingBanner ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminBanners
