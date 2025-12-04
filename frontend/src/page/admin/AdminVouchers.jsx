import { useState, useEffect } from 'react'
import { ClipLoader } from 'react-spinners'
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'
import { formatCurrency } from '../../utils/formatCurrency'

const AdminVouchers = () => {
  const [vouchers, setVouchers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingVoucher, setEditingVoucher] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    type: 'percent',
    value: '',
    min_order_amount: '',
    max_discount_amount: '',
    usage_limit: '',
    start_date: '',
    end_date: '',
    is_active: true
  })

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/admin/vouchers', {
        params: { per_page: 1000 }
      })
      
      if (response.data.status === 'success') {
        const vouchersData = response.data.data?.vouchers || response.data.data || []
        setVouchers(Array.isArray(vouchersData) ? vouchersData : [])
      }
    } catch (error) {
      toast.error('Không thể tải danh sách voucher')
      console.error('Lỗi khi tải voucher:', error)
      setVouchers([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const payload = {
        ...formData,
        value: parseFloat(formData.value),
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
        max_discount_amount: formData.max_discount_amount ? parseFloat(formData.max_discount_amount) : null,
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      }

      if (editingVoucher) {
        await axiosInstance.put(`/admin/vouchers/${editingVoucher.id}`, payload)
        toast.success('Cập nhật voucher thành công')
      } else {
        await axiosInstance.post('/admin/vouchers', payload)
        toast.success('Thêm voucher thành công')
      }

      setShowModal(false)
      resetForm()
      fetchVouchers()
    } catch (error) {
      toast.error('Không thể lưu voucher', {
        description: error.response?.data?.message || 'Vui lòng thử lại'
      })
    }
  }

  const handleEdit = (voucher) => {
    setEditingVoucher(voucher)
    setFormData({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description || '',
      type: voucher.type,
      value: voucher.value,
      min_order_amount: voucher.min_order_amount || '',
      max_discount_amount: voucher.max_discount_amount || '',
      usage_limit: voucher.usage_limit || '',
      start_date: voucher.start_date ? voucher.start_date.split(' ')[0] : '',
      end_date: voucher.end_date ? voucher.end_date.split(' ')[0] : '',
      is_active: voucher.is_active
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      return
    }

    try {
      await axiosInstance.delete(`/admin/vouchers/${id}`)
      toast.success('Xóa voucher thành công')
      fetchVouchers()
    } catch (error) {
      toast.error('Không thể xóa voucher', {
        description: error.response?.data?.message || 'Vui lòng thử lại'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      description: '',
      type: 'percent',
      value: '',
      min_order_amount: '',
      max_discount_amount: '',
      usage_limit: '',
      start_date: '',
      end_date: '',
      is_active: true
    })
    setEditingVoucher(null)
  }

  const filteredVouchers = vouchers.filter(voucher =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voucher.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 'bold' }}>Quản lý Voucher</h1>
        <button
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1.4rem'
          }}
        >
          <FaPlus /> Thêm Voucher
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <FaSearch style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
          <input
            type="text"
            placeholder="Tìm kiếm voucher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 10px 10px 35px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '1.4rem'
            }}
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <ClipLoader color="#1976d2" size={50} />
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '5px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Mã</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Tên</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Loại</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Giá trị</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Đơn tối thiểu</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Đã dùng</th>
                <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Trạng thái</th>
                <th style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredVouchers.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    {searchTerm ? 'Không tìm thấy voucher nào' : 'Chưa có voucher nào'}
                  </td>
                </tr>
              ) : (
                filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>
                      <strong style={{ color: '#1976d2' }}>{voucher.code}</strong>
                    </td>
                    <td style={{ padding: '12px' }}>{voucher.name}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        backgroundColor: voucher.type === 'percent' ? '#e3f2fd' : '#fff3e0',
                        color: voucher.type === 'percent' ? '#1976d2' : '#f57c00',
                        fontSize: '1.2rem'
                      }}>
                        {voucher.type === 'percent' ? 'Phần trăm' : 'Số tiền'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      {voucher.type === 'percent' ? `${voucher.value}%` : formatCurrency(voucher.value)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {voucher.min_order_amount ? formatCurrency(voucher.min_order_amount) : 'Không'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {voucher.used_count} / {voucher.usage_limit || '∞'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '3px',
                        backgroundColor: voucher.is_active ? '#e8f5e9' : '#ffebee',
                        color: voucher.is_active ? '#2e7d32' : '#c62828',
                        fontSize: '1.2rem'
                      }}>
                        {voucher.is_active ? 'Hoạt động' : 'Tạm dừng'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(voucher)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(voucher.id)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#dc3545',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

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
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff',
            borderRadius: '8px',
            padding: '30px',
            width: '90%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ marginBottom: '20px', fontSize: '2rem' }}>
              {editingVoucher ? 'Sửa Voucher' : 'Thêm Voucher'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mã Voucher *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tên Voucher *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Mô tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Loại *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                >
                  <option value="percent">Phần trăm (%)</option>
                  <option value="fixed">Số tiền cố định</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giá trị *</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Đơn hàng tối thiểu</label>
                <input
                  type="number"
                  name="min_order_amount"
                  value={formData.min_order_amount}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              {formData.type === 'percent' && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giảm tối đa</label>
                  <input
                    type="number"
                    name="max_discount_amount"
                    value={formData.max_discount_amount}
                    onChange={handleInputChange}
                    min="0"
                    step="1000"
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '1.4rem'
                    }}
                  />
                </div>
              )}

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Giới hạn sử dụng</label>
                <input
                  type="number"
                  name="usage_limit"
                  value={formData.usage_limit}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="Để trống = không giới hạn"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ngày bắt đầu *</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Ngày kết thúc *</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '1.4rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    style={{ width: '18px', height: '18px' }}
                  />
                  <span>Kích hoạt</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#999',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.4rem'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.4rem'
                  }}
                >
                  {editingVoucher ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminVouchers
