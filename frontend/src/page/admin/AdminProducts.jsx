import { useState, useEffect, useMemo, useRef } from 'react'
import { ClipLoader } from 'react-spinners'
import { FaPlus, FaEdit, FaUndo, FaSearch, FaEye, FaEyeSlash, FaChevronLeft, FaChevronRight, FaTrash, FaInfoCircle } from 'react-icons/fa'
import { toast } from 'sonner'
import { axiosInstance } from '../../utils/axiosConfig'
import { formatCurrency } from '../../utils/formatCurrency'
import { getImageUrl } from '../../utils/imageHelper'

const AdminProducts = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    discount_percent: '',
    category_id: '',
    stock: '',
    image: ''
  })
  const [attributes, setAttributes] = useState([]) // [{ type: 'Size', value: 'S', quantity: 10 }, ...]
  // eslint-disable-next-line no-unused-vars
  const [attributeTypes, setAttributeTypes] = useState(['Size', 'Color', 'Material']) // Các loại thuộc tính
  // eslint-disable-next-line no-unused-vars
  const [availableAttributeValues, setAvailableAttributeValues] = useState({}) // { 'Size': ['S', 'M', 'L'], 'Color': ['Đỏ', 'Xanh'], ... }
  const [productAttributesDetail, setProductAttributesDetail] = useState(null) // { productId: { attributes: [...] } }
  const [showAttributesTooltip, setShowAttributesTooltip] = useState(null) // productId đang hiển thị tooltip
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Đóng tooltip khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showAttributesTooltip && !e.target.closest('[data-attributes-tooltip]')) {
        setShowAttributesTooltip(null)
      }
    }
    if (showAttributesTooltip) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showAttributesTooltip])

  // Đảm bảo products luôn là mảng
  useEffect(() => {
    if (!Array.isArray(products)) {
      console.warn('products is not an array, resetting to []')
      setProducts([])
    }
  }, [products])

  const fetchProducts = async (silent = false) => {
    try {
      // Chỉ hiển thị loading khi không phải silent mode (lần đầu load)
      if (!silent) {
        setLoading(true)
      }
      
      // Tối ưu: Chỉ gọi 1 lần với per_page lớn để lấy tất cả sản phẩm
      // Frontend sẽ tự pagination để hiển thị
      const response = await axiosInstance.get('/admin/products', {
        params: { per_page: 1000 } // Lấy tối đa 1000 sản phẩm (giới hạn của backend)
      })
      
      if (response.data.status === 'success') {
        const productsData = response.data.data?.products || response.data.data || []
        const productsArray = Array.isArray(productsData) ? productsData : []
        setProducts(productsArray)
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`Đã tải thành công ${productsArray.length} sản phẩm`)
        }
      } else {
        setProducts([])
      }
    } catch (error) {
      if (!silent) {
        toast.error('Không thể tải danh sách sản phẩm')
      }
      console.error('Lỗi khi tải sản phẩm:', error)
      setProducts([])
    } finally {
      if (!silent) {
        setLoading(false)
      }
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/admin/categories')
      if (response.data.status === 'success') {
        // Chỉ lấy các category đang hoạt động (status_category === 0)
        const activeCategories = (response.data.data || []).filter(
          cat => cat.status_category === 0
        )
        setCategories(activeCategories)
      }
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target
    
    // Xử lý file upload
    if (name === 'image' && files && files.length > 0) {
      const file = files[0]
      // Kiểm tra loại file
      if (!file.type.startsWith('image/')) {
        toast.error('Vui lòng chọn file hình ảnh')
        return
      }
      // Kiểm tra kích thước file (max 2048KB = 2MB)
      if (file.size > 2048 * 1024) {
        toast.error('Kích thước file không được vượt quá 2MB')
        return
      }
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // Validate dữ liệu trước khi gửi
      if (!formData.name || formData.name.trim() === '') {
        toast.error('Vui lòng nhập tên sản phẩm')
        return
      }
      
      if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast.error('Vui lòng nhập giá sản phẩm hợp lệ')
        return
      }
      
      if (!formData.category_id || formData.category_id === '') {
        toast.error('Vui lòng chọn danh mục sản phẩm')
        return
      }
      
      // Chuẩn bị dữ liệu theo format API yêu cầu
      const prepareFormData = () => {
        const nameProduct = formData.name.trim()
        const priceProduct = parseFloat(formData.price)
        const categoryId = parseInt(formData.category_id)
        
        // Validate lại sau khi parse
        if (!nameProduct) {
          throw new Error('Tên sản phẩm không hợp lệ')
        }
        if (isNaN(priceProduct) || priceProduct <= 0) {
          throw new Error('Giá sản phẩm không hợp lệ')
        }
        if (isNaN(categoryId) || categoryId <= 0) {
          throw new Error('Danh mục sản phẩm không hợp lệ')
        }
        
        const data = {
          name_product: nameProduct,
          price_product: priceProduct,
          category_id: categoryId,
        }
        
        // Thêm các field optional nếu có giá trị
        if (formData.description && formData.description.trim() !== '') {
          data.description_product = formData.description.trim()
        }
        
        if (formData.stock && formData.stock !== '') {
          const stock = parseInt(formData.stock)
          if (!isNaN(stock) && stock >= 0) {
            data.quantity_product = stock
          }
        }
        
        // Tính giá: nhập giá gốc và % giảm, backend sẽ tự tính giá giảm
        if (formData.original_price && formData.original_price !== '') {
          const originalPrice = parseFloat(formData.original_price)
          if (!isNaN(originalPrice) && originalPrice > 0) {
            data.original_price = originalPrice
            
            // Nếu có % giảm, gửi % giảm để backend tự tính giá giảm
            if (formData.discount_percent && formData.discount_percent !== '') {
              const discountPercent = parseFloat(formData.discount_percent)
              if (!isNaN(discountPercent) && discountPercent >= 0 && discountPercent <= 100) {
                data.discount_percent = Math.round(discountPercent)
                // Tính giá sau giảm để cập nhật price_product (giá bán hiện tại)
                // Ép kiểu về số nguyên trước khi tính để tránh floating point error
                const originalPriceInt = Math.round(parseFloat(originalPrice))
                const discountPercentInt = Math.round(parseFloat(discountPercent))
                // Sử dụng công thức: (giá_gốc * (100 - %giảm)) / 100 để tránh floating point error
                // Ví dụ: (1000000 * 90) / 100 = 900000
                const discountPrice = (originalPriceInt * (100 - discountPercentInt)) / 100
                // Đảm bảo giá là số nguyên (không có số thập phân) - làm tròn để xử lý trường hợp có số lẻ
                data.price_product = Math.round(discountPrice)
              }
            } else {
              // Nếu không có % giảm, giá bán = giá gốc
              data.price_product = originalPrice
            }
          }
        }
        
        return data
      }
      
      // Kiểm tra xem có file image mới được chọn không
      const hasImageFile = formData.image instanceof File
      
      if (editingProduct) {
        // Update - gửi đầy đủ các field theo API yêu cầu
        const updateData = prepareFormData()
        
        // Kiểm tra xem có file image mới không để quyết định gửi FormData hay JSON
        if (hasImageFile) {
          const formDataToSend = new FormData()
          // Gửi tất cả dữ liệu dưới dạng FormData khi có file
          formDataToSend.append('name_product', updateData.name_product)
          formDataToSend.append('price_product', updateData.price_product.toString())
          formDataToSend.append('category_id', updateData.category_id.toString())
          if (updateData.description_product) {
            formDataToSend.append('description_product', updateData.description_product)
          }
          if (updateData.quantity_product !== undefined) {
            formDataToSend.append('quantity_product', updateData.quantity_product.toString())
          }
          if (updateData.original_price) {
            formDataToSend.append('original_price', updateData.original_price.toString())
          }
          if (updateData.discount_percent) {
            formDataToSend.append('discount_percent', updateData.discount_percent.toString())
          }
          // Gửi attributes
          if (attributes.length > 0) {
            formDataToSend.append('attributes', JSON.stringify(attributes))
          }
          formDataToSend.append('image_product', formData.image)
          // Laravel cần _method=PUT khi dùng FormData với POST
          formDataToSend.append('_method', 'PUT')
          
          // Debug: Log FormData để kiểm tra
          if (process.env.NODE_ENV === 'development') {
            console.log('FormData contents:')
            for (let pair of formDataToSend.entries()) {
              console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]))
            }
            console.log('Sending update request with POST + _method=PUT')
          }
          
          // Dùng POST với _method=PUT vì Laravel không hỗ trợ PUT với FormData tốt
          await axiosInstance.post(`/admin/products/${editingProduct.id}`, formDataToSend)
        } else {
          // Gửi JSON nếu không có file mới (giữ nguyên hình ảnh cũ)
          if (attributes.length > 0) {
            updateData.attributes = attributes
          }
          await axiosInstance.put(`/admin/products/${editingProduct.id}`, updateData)
        }
        toast.success('Cập nhật sản phẩm thành công')
      } else {
        // Create - gửi tất cả các field theo API yêu cầu
        const createData = prepareFormData()
        
        // Kiểm tra xem có file image không để quyết định gửi FormData hay JSON
        if (hasImageFile) {
          const formDataToSend = new FormData()
          // Gửi tất cả dữ liệu dưới dạng FormData khi có file
          formDataToSend.append('name_product', createData.name_product)
          formDataToSend.append('price_product', createData.price_product.toString())
          formDataToSend.append('category_id', createData.category_id.toString())
          if (createData.description_product) {
            formDataToSend.append('description_product', createData.description_product)
          }
          if (createData.quantity_product !== undefined) {
            formDataToSend.append('quantity_product', createData.quantity_product.toString())
          }
          if (createData.original_price) {
            formDataToSend.append('original_price', createData.original_price.toString())
          }
          if (createData.discount_percent) {
            formDataToSend.append('discount_percent', createData.discount_percent.toString())
          }
          // Gửi attributes
          if (attributes.length > 0) {
            formDataToSend.append('attributes', JSON.stringify(attributes))
          }
          formDataToSend.append('image_product', formData.image)
          
          // Debug: Log FormData để kiểm tra
          if (process.env.NODE_ENV === 'development') {
            console.log('FormData contents:')
            for (let pair of formDataToSend.entries()) {
              console.log(pair[0] + ': ' + (pair[1] instanceof File ? `File(${pair[1].name})` : pair[1]))
            }
            console.log('Sending create request with FormData')
          }
          
          // Không set Content-Type header, để axios tự động detect FormData và set boundary
          await axiosInstance.post('/admin/products', formDataToSend)
        } else {
          // Gửi JSON nếu không có file (image là optional)
          if (attributes.length > 0) {
            createData.attributes = attributes
          }
          await axiosInstance.post('/admin/products', createData)
        }
        toast.success('Tạo sản phẩm thành công')
      }
      setShowModal(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        discount_percent: '',
        category_id: '',
        stock: '',
        image: ''
      })
      setAttributes([])
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      // Refresh dữ liệu trong background (silent mode - không hiển thị loading)
      fetchProducts(true)
    } catch (error) {
      console.error('Lỗi:', error)
      
      // Xử lý lỗi validation chi tiết
      if (error.response?.status === 422 && error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
        const errorMessages = []
        
        // Lấy tất cả các lỗi validation
        Object.keys(validationErrors).forEach(field => {
          const fieldErrors = validationErrors[field]
          if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
            // Map tên field sang tiếng Việt
            const fieldNames = {
              'name_product': 'Tên sản phẩm',
              'price_product': 'Giá sản phẩm',
              'category_id': 'Danh mục',
              'description_product': 'Mô tả',
              'quantity_product': 'Số lượng',
              'image_product': 'Hình ảnh'
            }
            const fieldName = fieldNames[field] || field
            errorMessages.push(`${fieldName}: ${fieldErrors[0]}`)
          }
        })
        
        const errorMessage = errorMessages.length > 0 
          ? errorMessages.join('\n')
          : error.response?.data?.message || 'Dữ liệu không hợp lệ'
        
        toast.error(errorMessage, {
          duration: 5000,
          style: { whiteSpace: 'pre-line' }
        })
        console.error('Validation errors:', validationErrors)
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra'
        toast.error(editingProduct ? `Cập nhật thất bại: ${errorMessage}` : `Tạo sản phẩm thất bại: ${errorMessage}`)
      }
    }
  }

  const handleEdit = async (product) => {
    setEditingProduct(product)
    
    // Lấy đầy đủ thông tin sản phẩm từ API (bao gồm discount_percent và attributes)
    try {
      const response = await axiosInstance.get(`/admin/products/${product.id}`)
      if (response.data.status === 'success' && response.data.data) {
        const productData = response.data.data.product || product
        const productAttributes = response.data.data.attributes || []
        
        // Lấy discount_percent từ API response (ưu tiên) hoặc tính từ giá
    let discountPercent = ''
        if (productData.discount_percent !== null && productData.discount_percent !== undefined) {
          discountPercent = productData.discount_percent.toString()
        } else if (productData.original_price && productData.discount_price && productData.original_price > productData.discount_price) {
          discountPercent = Math.round(((productData.original_price - productData.discount_price) / productData.original_price) * 100).toString()
    }
    
    setFormData({
          name: productData.name_product || '',
          description: productData.description_product || '',
          price: productData.discount_price || productData.price_product || '',
          original_price: productData.original_price || '',
      discount_percent: discountPercent,
          category_id: productData.category_id || '',
          stock: productData.quantity_product || '',
      image: '' // Không set image URL, chỉ hiển thị preview ở form
    })
    
        // Lấy attributes từ API response
        if (Array.isArray(productAttributes) && productAttributes.length > 0) {
          const mappedAttributes = productAttributes.map(attr => ({
          type: attr.type || (attr.size ? 'Size' : attr.color ? 'Color' : ''),
          value: attr.value || attr.size || attr.color || '',
          quantity: attr.quantity || 0,
          attribute_option_id: attr.attribute_option_id || null
        }))
          setAttributes(mappedAttributes)
      } else {
          setAttributes([])
        }
      } else {
        // Fallback nếu API không trả về đúng format
        let discountPercent = ''
        if (product.original_price && product.discount_price && product.original_price > product.discount_price) {
          discountPercent = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100).toString()
        }
        
        setFormData({
          name: product.name_product || '',
          description: product.description_product || '',
          price: product.discount_price || product.price_product || '',
          original_price: product.original_price || '',
          discount_percent: discountPercent,
          category_id: product.category_id || '',
          stock: product.quantity_product || '',
          image: ''
        })
        setAttributes([])
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin sản phẩm:', error)
      // Fallback với dữ liệu từ product object
      let discountPercent = ''
      if (product.original_price && product.discount_price && product.original_price > product.discount_price) {
        discountPercent = Math.round(((product.original_price - product.discount_price) / product.original_price) * 100).toString()
      }
      
      setFormData({
        name: product.name_product || '',
        description: product.description_product || '',
        price: product.discount_price || product.price_product || '',
        original_price: product.original_price || '',
        discount_percent: discountPercent,
        category_id: product.category_id || '',
        stock: product.quantity_product || '',
        image: ''
      })
      setAttributes([])
    }
    
    setShowModal(true)
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      // Optimistic update: Cập nhật UI ngay lập tức
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id 
            ? { ...product, status_product: currentStatus === 0 ? 1 : 0 }
            : product
        )
      )
      
      // Sử dụng destroy để ẩn, restore để hiện
      if (currentStatus === 0) {
        // Đang hiện -> ẩn
        await axiosInstance.delete(`/admin/products/${id}`)
        toast.success('Đã ẩn sản phẩm thành công')
      } else {
        // Đang ẩn -> hiện
        await axiosInstance.put(`/admin/products/${id}/restore`)
        toast.success('Đã hiển thị sản phẩm thành công')
      }
      
      // Refresh dữ liệu trong background (silent mode - không hiển thị loading)
      fetchProducts(true)
    } catch (error) {
      // Rollback nếu có lỗi
      fetchProducts(true)
      const errorMessage = error.response?.data?.message || 'Thay đổi trạng thái sản phẩm thất bại'
      toast.error(errorMessage)
      console.error('Lỗi:', error)
    }
  }

  const handleRestore = async (id) => {
    try {
      // Optimistic update: Cập nhật UI ngay lập tức
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id 
            ? { ...product, status_product: 0 }
            : product
        )
      )
      
      await axiosInstance.put(`/admin/products/${id}/restore`)
      toast.success('Khôi phục sản phẩm thành công')
      
      // Refresh dữ liệu trong background (silent mode - không hiển thị loading)
      fetchProducts(true)
    } catch (error) {
      // Rollback nếu có lỗi
      fetchProducts(true)
      const errorMessage = error.response?.data?.message || 'Khôi phục sản phẩm thất bại'
      toast.error(errorMessage)
      console.error('Lỗi:', error)
    }
  }

  // Đảm bảo products luôn là mảng
  const safeProducts = useMemo(() => {
    if (!products) return []
    if (!Array.isArray(products)) {
      console.warn('products is not an array:', products)
      return []
    }
    return products
  }, [products])

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(safeProducts)) {
      console.warn('safeProducts is not an array:', safeProducts)
      return []
    }
    const filtered = safeProducts.filter(product =>
      product.name_product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description_product?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // Log để debug nếu cần (chỉ trong development)
    if (process.env.NODE_ENV === 'development' && searchTerm) {
      console.log('Tổng số sản phẩm sau khi filter:', filtered.length, '| Từ tổng:', safeProducts.length)
    }
    return filtered
  }, [safeProducts, searchTerm])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

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
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    
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
            Quản lý sản phẩm
          </h1>
          <p style={{
            fontSize: '1.5rem',
            color: '#6c757d',
            margin: 0
          }}>
            Quản lý và theo dõi tất cả sản phẩm của cửa hàng
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              original_price: '',
              discount_percent: '',
              category_id: '',
              stock: '',
              image: ''
            })
            setAttributes([])
            // Reset file input
            if (fileInputRef.current) {
              fileInputRef.current.value = ''
            }
            setShowModal(true)
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 28px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '1.4rem',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)'
          }}
        >
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          position: 'relative',
          maxWidth: '450px'
        }}>
          <FaSearch style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#6c757d',
            fontSize: '1.6rem',
            zIndex: 1
          }} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 50px',
              fontSize: '1.4rem',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              outline: 'none',
              transition: 'all 0.3s ease',
              backgroundColor: '#fff'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#1976d2'
              e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e9ecef'
              e.target.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{
          overflowX: 'auto'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
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
                  ID
                </th>
                <th style={{ 
                  padding: '18px 12px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em',
                  width: '70px'
                }}>
                  Hình ảnh
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Tên
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Danh mục
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Giá
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Giá gốc / Giảm
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Tồn kho
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'left', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Trạng thái
                </th>
                <th style={{ 
                  padding: '18px 16px', 
                  textAlign: 'center', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  color: '#495057',
                  letterSpacing: '0.01em'
                }}>
                  Thao tác
                </th>
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
                      <p style={{ margin: 0 }}>Đang tải danh sách sản phẩm...</p>
                    </div>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ 
                    padding: '60px 40px', 
                    textAlign: 'center', 
                    fontSize: '1.5rem', 
                    color: '#6c757d',
                    fontWeight: '500'
                  }}>
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
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
                      color: '#495057',
                      fontWeight: '500'
                    }}>
                      #{product.id}
                    </td>
                    <td style={{ padding: '16px 12px', width: '70px' }}>
                      {product.image_product ? (
                        <img
                          src={getImageUrl(product.image_product)}
                          alt={product.name_product}
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          onError={(e) => {
                            // Nếu hình ảnh không load được, ẩn đi
                            e.target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#e9ecef',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.9rem',
                          color: '#adb5bd',
                          fontWeight: '500'
                        }}>
                          📷
                        </div>
                      )}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '1.4rem',
                      fontWeight: '500',
                      color: '#212529'
                    }}>
                      {product.name_product}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '1.4rem', 
                      color: '#6c757d'
                    }}>
                      {product.name_category || '-'}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '1.4rem',
                      fontWeight: '600',
                      color: '#1976d2'
                    }}>
                      {formatCurrency(product.discount_price || product.price_product)}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '1.3rem'
                    }}>
                      {product.original_price && product.original_price > 0 && (
                        (product.discount_percent && product.discount_percent > 0) || 
                        (product.discount_price && product.original_price > product.discount_price)
                      ) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ 
                            color: '#999',
                            textDecoration: 'line-through',
                            fontSize: '1.2rem'
                          }}>
                            {formatCurrency(product.original_price)}
                          </span>
                          <span style={{ 
                            color: '#d32f2f',
                            fontWeight: '600',
                            fontSize: '1.2rem'
                          }}>
                            -{product.discount_percent && product.discount_percent > 0 
                              ? product.discount_percent 
                              : (product.discount_price && product.original_price 
                                ? Math.round(((product.original_price - product.discount_price) / product.original_price) * 100) 
                                : 0)}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: '#999' }}>-</span>
                      )}
                    </td>
                    <td style={{ 
                      padding: '16px', 
                      fontSize: '1.4rem',
                      fontWeight: '500',
                      color: '#212529',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{product.quantity_product}</span>
                        <div style={{ position: 'relative', display: 'inline-block' }} data-attributes-tooltip>
                          <button
                            type="button"
                            onClick={async (e) => {
                              e.stopPropagation()
                              // Nếu đã có dữ liệu, toggle tooltip
                              if (productAttributesDetail?.[product.id]) {
                                setShowAttributesTooltip(showAttributesTooltip === product.id ? null : product.id)
                              } else {
                                // Load attributes từ API
                                try {
                                  const response = await axiosInstance.get(`/admin/products/${product.id}`)
                                  if (response.data.status === 'success' && response.data.data?.attributes) {
                                    const attrs = response.data.data.attributes
                                    setProductAttributesDetail(prev => ({
                                      ...prev,
                                      [product.id]: attrs
                                    }))
                                    setShowAttributesTooltip(product.id)
                                  } else {
                                    toast.info('Sản phẩm này chưa có thuộc tính')
                                  }
                                } catch (error) {
                                  console.error('Lỗi khi lấy thuộc tính:', error)
                                  toast.error('Không thể tải thông tin thuộc tính')
                                }
                              }
                            }}
                            onMouseEnter={async (e) => {
                              // Đổi màu khi hover
                              e.target.style.color = '#1565c0'
                              // Load attributes khi hover nếu chưa có
                              if (!productAttributesDetail?.[product.id]) {
                                try {
                                  const response = await axiosInstance.get(`/admin/products/${product.id}`)
                                  if (response.data.status === 'success' && response.data.data?.attributes) {
                                    const attrs = response.data.data.attributes
                                    if (attrs && attrs.length > 0) {
                                      setProductAttributesDetail(prev => ({
                                        ...prev,
                                        [product.id]: attrs
                                      }))
                                    }
                                  }
                                } catch (error) {
                                  // Silent fail
                                }
                              }
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: '#1976d2',
                              fontSize: '1.4rem',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s ease'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.color = '#1976d2'
                            }}
                            title="Xem chi tiết số lượng theo thuộc tính"
                          >
                            <FaInfoCircle />
                          </button>
                          {showAttributesTooltip === product.id && productAttributesDetail?.[product.id] && (
                            <div 
                              style={{
                                position: 'absolute',
                                backgroundColor: '#fff',
                                border: '2px solid #e9ecef',
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                zIndex: 2000,
                                minWidth: '220px',
                                maxWidth: '300px',
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginTop: '8px'
                              }}
                              onClick={(e) => e.stopPropagation()}
                              data-attributes-tooltip
                            >
                              <div style={{ 
                                fontSize: '1.3rem', 
                                fontWeight: '600', 
                                marginBottom: '8px',
                                color: '#495057',
                                borderBottom: '1px solid #e9ecef',
                                paddingBottom: '6px'
                              }}>
                                Số lượng theo thuộc tính:
                              </div>
                              {productAttributesDetail[product.id].length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '200px', overflowY: 'auto' }}>
                                  {productAttributesDetail[product.id].map((attr, idx) => (
                                    <div key={idx} style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      fontSize: '1.2rem',
                                      padding: '6px 0',
                                      borderBottom: idx < productAttributesDetail[product.id].length - 1 ? '1px solid #f0f0f0' : 'none'
                                    }}>
                                      <span style={{ color: '#6c757d' }}>
                                        <strong style={{ color: '#212529' }}>
                                          {attr.type || (attr.size ? 'Size' : attr.color ? 'Color' : 'N/A')}
                                        </strong>
                                        {': '}
                                        <span style={{ color: '#495057' }}>
                                          {attr.value || attr.size || attr.color || 'N/A'}
                                        </span>
                                      </span>
                                      <span style={{ fontWeight: '600', color: '#1976d2', marginLeft: '12px' }}>
                                        {attr.quantity || 0}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '1.2rem', color: '#6c757d', padding: '8px 0' }}>
                                  Chưa có thuộc tính
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '1.2rem',
                        fontWeight: '600',
                        backgroundColor: product.status_product === 0 ? '#d4edda' : 
                                        product.status_product === 1 ? '#fff3cd' : '#f8d7da',
                        color: product.status_product === 0 ? '#155724' : 
                               product.status_product === 1 ? '#856404' : '#721c24',
                        display: 'inline-block'
                      }}>
                        {product.status_product === 0 ? 'Hoạt động' : 
                         product.status_product === 1 ? 'Đã ẩn' : 'Đã xóa'}
                      </span>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center' }}>
                      <div style={{
                        display: 'flex',
                        gap: '8px',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        {product.status_product > 1 ? (
                          // Đã xóa - chỉ hiển thị nút Khôi phục
                          <button
                            onClick={() => handleRestore(product.id)}
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
                              transition: 'all 0.2s ease',
                              boxShadow: '0 2px 4px rgba(23, 162, 184, 0.2)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor = '#138496'
                              e.target.style.transform = 'translateY(-1px)'
                              e.target.style.boxShadow = '0 4px 8px rgba(23, 162, 184, 0.3)'
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = '#17a2b8'
                              e.target.style.transform = 'translateY(0)'
                              e.target.style.boxShadow = '0 2px 4px rgba(23, 162, 184, 0.2)'
                            }}
                          >
                            <FaUndo /> Khôi phục
                          </button>
                        ) : (
                          // Đang hoạt động (0) hoặc Đã ẩn (1) - hiển thị Sửa và Toggle
                          <>
                            <button
                              onClick={() => handleEdit(product)}
                              style={{
                                padding: '8px 14px',
                                backgroundColor: '#1976d2',
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
                                boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#1565c0'
                                e.target.style.transform = 'translateY(-1px)'
                                e.target.style.boxShadow = '0 4px 8px rgba(25, 118, 210, 0.3)'
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = '#1976d2'
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.boxShadow = '0 2px 4px rgba(25, 118, 210, 0.2)'
                              }}
                            >
                              <FaEdit /> Sửa
                            </button>
                            <button
                              onClick={() => handleToggleStatus(product.id, product.status_product)}
                              style={{
                                padding: '8px 14px',
                                backgroundColor: product.status_product === 0 ? '#ffc107' : '#28a745',
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
                                boxShadow: product.status_product === 0 
                                  ? '0 2px 4px rgba(255, 193, 7, 0.2)' 
                                  : '0 2px 4px rgba(40, 167, 69, 0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-1px)'
                                if (product.status_product === 0) {
                                  e.target.style.backgroundColor = '#ffb300'
                                  e.target.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.3)'
                                } else {
                                  e.target.style.backgroundColor = '#218838'
                                  e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)'
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)'
                                e.target.style.backgroundColor = product.status_product === 0 ? '#ffc107' : '#28a745'
                                e.target.style.boxShadow = product.status_product === 0 
                                  ? '0 2px 4px rgba(255, 193, 7, 0.2)' 
                                  : '0 2px 4px rgba(40, 167, 69, 0.2)'
                              }}
                            >
                              {product.status_product === 0 ? (
                                <>
                                  <FaEyeSlash /> Ẩn
                                </>
                              ) : (
                                <>
                                  <FaEye /> Hiển thị
                                </>
                              )}
                            </button>
                          </>
                        )}
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
      {!loading && filteredProducts.length > 0 && totalPages > 1 && (
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
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#f8f9fa'
                e.target.style.borderColor = '#1976d2'
                e.target.style.color = '#1976d2'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#fff'
                e.target.style.borderColor = '#e9ecef'
                e.target.style.color = '#495057'
              }
            }}
          >
            <FaChevronLeft />
            <span>Trước</span>
          </button>

          {getPageNumbers().map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  style={{
                    padding: '10px 5px',
                    fontSize: '1.4rem',
                    color: '#666'
                  }}
                >
                  ...
                </span>
              )
            }
            return (
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
                  minWidth: '44px',
                  transition: 'all 0.2s ease',
                  fontWeight: currentPage === page ? '700' : '600',
                  boxShadow: currentPage === page ? '0 2px 8px rgba(25, 118, 210, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.target.style.backgroundColor = '#f8f9fa'
                    e.target.style.borderColor = '#1976d2'
                    e.target.style.color = '#1976d2'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.target.style.backgroundColor = '#fff'
                    e.target.style.borderColor = '#e9ecef'
                    e.target.style.color = '#495057'
                  }
                }}
              >
                {page}
              </button>
            )
          })}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              padding: '10px 16px',
              fontSize: '1.4rem',
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              backgroundColor: currentPage === totalPages ? '#f8f9fa' : '#fff',
              color: currentPage === totalPages ? '#adb5bd' : '#495057',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease',
              fontWeight: '600'
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#f8f9fa'
                e.target.style.borderColor = '#1976d2'
                e.target.style.color = '#1976d2'
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== totalPages) {
                e.target.style.backgroundColor = '#fff'
                e.target.style.borderColor = '#e9ecef'
                e.target.style.color = '#495057'
              }
            }}
          >
            <span>Sau</span>
            <FaChevronRight />
          </button>
        </div>
      )}

      {/* Info */}
      {!loading && filteredProducts.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginTop: '15px',
          fontSize: '1.3rem',
          color: '#666'
        }}>
          Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} trong tổng số {filteredProducts.length} sản phẩm
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
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px',
          backdropFilter: 'blur(4px)'
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowModal(false)
            setShowAttributesTooltip(null)
          }
        }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '650px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ 
              fontSize: '2.4rem', 
              marginBottom: '24px', 
              color: '#1a1a1a',
              fontWeight: '700'
            }}>
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '1.4rem', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1.4rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1976d2'
                    e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '1.4rem', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1.4rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.3s ease',
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
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '1.4rem', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Giá bán *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="Giá bán hiện tại"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1.4rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1976d2'
                      e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef'
                      e.target.style.boxShadow = 'none'
                    }}
                    disabled={true}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '1.4rem', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Tồn kho *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    min="0"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1.4rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1976d2'
                      e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '1.4rem', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    Giá gốc (tùy chọn)
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    value={formData.original_price}
                    onChange={(e) => {
                      setFormData({ ...formData, original_price: e.target.value })
                      // Tự động tính giá giảm nếu có % giảm
                      if (formData.discount_percent && e.target.value) {
                        const originalPrice = parseFloat(e.target.value)
                        const discountPercent = parseFloat(formData.discount_percent)
                        if (!isNaN(originalPrice) && !isNaN(discountPercent)) {
                        // Tính giá sau giảm: ép kiểu về số nguyên trước khi tính
                        const originalPriceInt = Math.round(parseFloat(originalPrice))
                        const discountPercentInt = Math.round(parseFloat(discountPercent))
                        // Sử dụng công thức: (giá_gốc * (100 - %giảm)) / 100
                        const discountPrice = (originalPriceInt * (100 - discountPercentInt)) / 100
                        const roundedPrice = Math.round(discountPrice)
                        setFormData(prev => ({ ...prev, price: roundedPrice.toString() }))
                        }
                      }
                    }}
                    min="0"
                    placeholder="Giá gốc trước khi giảm"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1.4rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1976d2'
                      e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px', 
                    fontSize: '1.4rem', 
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    % Giảm giá (tùy chọn)
                  </label>
                  <input
                    type="number"
                    name="discount_percent"
                    value={formData.discount_percent}
                    onChange={(e) => {
                      const discountPercent = e.target.value
                      setFormData({ ...formData, discount_percent: discountPercent })
                      // Tự động tính giá giảm nếu có giá gốc
                      if (formData.original_price && discountPercent) {
                        const originalPrice = parseFloat(formData.original_price)
                        const percent = parseFloat(discountPercent)
                        if (!isNaN(originalPrice) && !isNaN(percent) && percent >= 0 && percent <= 100) {
                          // Tính giá sau giảm: ép kiểu về số nguyên trước khi tính
                          const originalPriceInt = Math.round(parseFloat(originalPrice))
                          const percentInt = Math.round(parseFloat(percent))
                          // Sử dụng công thức: (giá_gốc * (100 - %giảm)) / 100
                          const discountPrice = (originalPriceInt * (100 - percentInt)) / 100
                          const roundedPrice = Math.round(discountPrice)
                          setFormData(prev => ({ ...prev, price: roundedPrice.toString() }))
                        }
                      }
                    }}
                    min="0"
                    max="100"
                    placeholder="Phần trăm giảm (0-100)"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '1.4rem',
                      border: '2px solid #e9ecef',
                      borderRadius: '10px',
                      outline: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#1976d2'
                      e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e9ecef'
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                  {formData.original_price && formData.discount_percent && (
                    <p style={{ 
                      marginTop: '8px', 
                      fontSize: '1.2rem', 
                      color: '#d32f2f',
                      fontWeight: '600'
                    }}>
                      Giá sau giảm: {formatCurrency(
                        (() => {
                          const originalPriceInt = Math.round(parseFloat(formData.original_price))
                          const discountPercentInt = Math.round(parseFloat(formData.discount_percent))
                          return Math.round((originalPriceInt * (100 - discountPercentInt)) / 100)
                        })()
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '1.4rem', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Danh mục *
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1.4rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1976d2'
                    e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_category}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Quản lý thuộc tính sản phẩm */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '12px', 
                  fontSize: '1.4rem', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Thuộc tính sản phẩm (Size, Color, Material, v.v.)
                </label>
                <div style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  padding: '16px',
                  backgroundColor: '#f8f9fa'
                }}>
                  {attributes.length === 0 ? (
                    <p style={{ fontSize: '1.3rem', color: '#6c757d', marginBottom: '12px' }}>
                      Chưa có thuộc tính nào. Nhấn "Thêm thuộc tính" để thêm.
                    </p>
                  ) : (
                    attributes.map((attr, index) => (
                      <div key={index} style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr auto',
                        gap: '12px',
                        marginBottom: '12px',
                        alignItems: 'end'
                      }}>
                        <div>
                          <label style={{ fontSize: '1.2rem', color: '#666', marginBottom: '4px', display: 'block' }}>
                            Loại
                          </label>
                          <select
                            value={attr.type}
                            onChange={(e) => {
                              const newAttributes = [...attributes]
                              newAttributes[index].type = e.target.value
                              setAttributes(newAttributes)
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              fontSize: '1.3rem',
                              border: '2px solid #e9ecef',
                              borderRadius: '8px',
                              outline: 'none'
                            }}
                          >
                            {attributeTypes.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label style={{ fontSize: '1.2rem', color: '#666', marginBottom: '4px', display: 'block' }}>
                            Giá trị
                          </label>
                          <input
                            type="text"
                            value={attr.value}
                            onChange={(e) => {
                              const newAttributes = [...attributes]
                              newAttributes[index].value = e.target.value
                              setAttributes(newAttributes)
                            }}
                            placeholder="S, M, L, Đỏ, Xanh..."
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              fontSize: '1.3rem',
                              border: '2px solid #e9ecef',
                              borderRadius: '8px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '1.2rem', color: '#666', marginBottom: '4px', display: 'block' }}>
                            Số lượng
                          </label>
                          <input
                            type="number"
                            value={attr.quantity}
                            onChange={(e) => {
                              const newAttributes = [...attributes]
                              newAttributes[index].quantity = parseInt(e.target.value) || 0
                              setAttributes(newAttributes)
                            }}
                            min="0"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              fontSize: '1.3rem',
                              border: '2px solid #e9ecef',
                              borderRadius: '8px',
                              outline: 'none'
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newAttributes = attributes.filter((_, i) => i !== index)
                            setAttributes(newAttributes)
                          }}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.3rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setAttributes([...attributes, { type: 'Size', value: '', quantity: 0 }])
                    }}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '1.3rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FaPlus /> Thêm thuộc tính
                  </button>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontSize: '1.4rem', 
                  fontWeight: '600',
                  color: '#495057'
                }}>
                  Hình ảnh sản phẩm
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/jpeg,image/png,image/jpg,image/gif"
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '1.4rem',
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#1976d2'
                    e.target.style.boxShadow = '0 0 0 3px rgba(25, 118, 210, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                <p style={{ 
                  marginTop: '8px', 
                  fontSize: '1.2rem', 
                  color: '#6c757d',
                  marginBottom: 0
                }}>
                  Chấp nhận: JPEG, PNG, JPG, GIF (tối đa 2MB)
                </p>
                {/* Hiển thị preview nếu có file hoặc URL */}
                {(formData.image instanceof File || (typeof formData.image === 'string' && formData.image !== '')) && (
                  <div style={{ marginTop: '12px' }}>
                    <img
                      src={formData.image instanceof File 
                        ? URL.createObjectURL(formData.image) 
                        : formData.image}
                      alt="Preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                )}
                {/* Hiển thị hình ảnh hiện tại khi edit */}
                {editingProduct && editingProduct.image_product && !formData.image && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '1.2rem', color: '#6c757d', marginBottom: '8px' }}>
                      Hình ảnh hiện tại:
                    </p>
                    <img
                      src={getImageUrl(editingProduct.image_product)}
                      alt="Current"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        border: '1px solid #e9ecef',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        // Nếu hình ảnh không load được, hiển thị placeholder
                        e.target.style.display = 'none'
                        const parent = e.target.parentElement
                        if (parent && !parent.querySelector('.image-error')) {
                          const errorDiv = document.createElement('div')
                          errorDiv.className = 'image-error'
                          errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #999; font-size: 1.2rem;'
                          errorDiv.textContent = 'Không thể tải hình ảnh'
                          parent.appendChild(errorDiv)
                        }
                      }}
                    />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingProduct(null)
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category_id: '',
                      stock: '',
                      image: ''
                    })
                    // Reset file input
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
                  }}
                  style={{
                    padding: '12px 24px',
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
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 4px 8px rgba(108, 117, 125, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#6c757d'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 2px 4px rgba(108, 117, 125, 0.2)'
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#1565c0'
                    e.target.style.transform = 'translateY(-1px)'
                    e.target.style.boxShadow = '0 6px 16px rgba(25, 118, 210, 0.4)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1976d2'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.3)'
                  }}
                >
                  {editingProduct ? 'Cập nhật' : 'Tạo mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminProducts

