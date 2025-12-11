import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ClipLoader } from 'react-spinners'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import {
  FaHeart,
  FaStar,
  FaChevronUp,
  FaChevronDown,
  FaTruck,
  FaUndo,
  FaUser,
  FaEye,
} from 'react-icons/fa'
import { formatCurrency } from '../utils/formatCurrency'
import { axiosInstance } from '../utils/axiosConfig'
import { cartService } from '../utils/cartService'
import { authService } from '../utils/authService'
import { formatDateOnly, formatDateShort } from '../utils/dateHelper'


const ProductsDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [productComments, setProductComments] = useState([])
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    if (id) {
      fetchProduct()
      fetchRelatedProducts()
      fetchReviews()
      if (authService.isAuthenticated()) {
        checkWishlistStatus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const [selectedSize, setSelectedSize] = useState(null)
  const [availableSizes, setAvailableSizes] = useState([])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/product/${id}`)
      if (response.data.status === 'success') {
        const data = response.data.data
        const productData = data.product || data
        const attributes = data.attributes || []
        
        // Lấy danh sách size từ attributes
        const sizes = attributes
          .filter(attr => attr.size)
          .map(attr => ({
            size: attr.size,
            quantity: attr.quantity || 0,
            id: attr.id
          }))
        
        setAvailableSizes(sizes)
        if (sizes.length > 0 && !selectedSize) {
          setSelectedSize(sizes[0].size)
        }
        
        setProduct({
          id: productData.id,
          name: productData.name_product,
          price: productData.discount_price || productData.price_product || 0,
          originalPrice: productData.original_price,
          discountPrice: productData.discount_price,
          discountPercent: productData.discount_percent,
          description: productData.description_product || '',
          image: productData.image_product || '',
          images: productData.images || [productData.image_product],
          stock: productData.quantity_product || 0,
          category: productData.name_category || productData.category,
        })
        // Set first image as default
        if (productData.images && productData.images.length > 0) {
          setSelectedImage(0)
        }
      }
    } catch (error) {
      console.error('Lỗi khi lấy chi tiết sản phẩm:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await axiosInstance.get('/products')
      if (response.data.status === 'success') {
        const data = response.data.data
        const productsList = Array.isArray(data) ? data : (data?.products || [])
        // Lấy 4 sản phẩm khác (loại trừ sản phẩm hiện tại)
        const related = productsList
          .filter(p => p.id !== parseInt(id))
          .slice(0, 4)
          .map(p => ({
            id: p.id,
            title: p.name_product,
            price: p.price_product || 0,
            image: p.image_product || '',
            reviews: p.reviews_count || 0,
          }))
        setRelatedProducts(related)
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm liên quan:', error)
      setRelatedProducts([])
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get(`/product/${id}/reviews`)
      if (response.data.status === 'success') {
        const reviewsData = response.data.data
        setProductComments(reviewsData.reviews || [])
        setAverageRating(reviewsData.average_rating || 0)
        setTotalReviews(reviewsData.total_reviews || 0)
      }
    } catch (error) {
      console.error('Lỗi khi lấy đánh giá:', error)
      setProductComments([])
    }
  }

  const checkWishlistStatus = async () => {
    try {
      const response = await axiosInstance.get(`/user/wishlist/check/${id}`)
      if (response.data.status === 'success') {
        setIsInWishlist(response.data.data.is_in_wishlist || false)
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra wishlist:', error)
    }
  }

  const handleToggleWishlist = async () => {
    if (!authService.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để thêm vào yêu thích. Đi đến trang đăng nhập?')) {
        navigate('/login')
      }
      return
    }

    try {
      if (isInWishlist) {
        await axiosInstance.post('/user/wishlist/remove', { product_id: id })
        setIsInWishlist(false)
        toast.success('Đã xóa khỏi danh sách yêu thích')
      } else {
        await axiosInstance.post('/user/wishlist', { product_id: id })
        setIsInWishlist(true)
        toast.success('Đã thêm vào danh sách yêu thích')
      }
    } catch (error) {
      toast.error('Không thể cập nhật danh sách yêu thích', {
        description: error.response?.data?.message || 'Vui lòng thử lại sau.',
      })
    }
  }

  // Tính số lượng có sẵn (từ size nếu có, nếu không thì từ product stock)
  const getAvailableQuantity = () => {
    if (!product) return 0
    
    // Nếu có size được chọn, lấy quantity từ size đó
    if (selectedSize && availableSizes.length > 0) {
      const selectedSizeItem = availableSizes.find(s => s.size === selectedSize)
      if (selectedSizeItem) {
        return selectedSizeItem.quantity || 0
      }
    }
    
    // Nếu không có size, lấy từ product stock
    return product.stock || 0
  }

  // Lấy số lượng đã có trong cart (cần fetch từ API)
  const [quantityInCart, setQuantityInCart] = useState(0)

  useEffect(() => {
    const fetchCartQuantity = async () => {
      if (!authService.isAuthenticated() || !product) return
      
      try {
        const cartItems = await cartService.getCart()
        const cartItem = cartItems.find(item => {
          if (item.product_id === product.id) {
            if (selectedSize) {
              return item.size === selectedSize
            }
            return !item.size || item.size === null
          }
          return false
        })
        setQuantityInCart(cartItem ? cartItem.quantity_item : 0)
      } catch (error) {
        console.error('Lỗi khi lấy số lượng trong cart:', error)
        setQuantityInCart(0)
      }
    }
    
    fetchCartQuantity()
  }, [product, selectedSize])

  const updateQuantity = (delta) => {
    const availableQty = getAvailableQuantity()
    const maxQuantity = availableQty - quantityInCart // Trừ đi số lượng đã có trong cart
    
    // Nếu không còn hàng để thêm, không cho tăng
    if (maxQuantity <= 0) {
      toast.error('Đã hết hàng', {
        description: `Bạn đã thêm tất cả ${availableQty} sản phẩm vào giỏ hàng.`
      })
      return
    }
    
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    } else if (newQuantity > maxQuantity) {
      // Nếu cố tăng quá max, set về max
      setQuantity(maxQuantity)
      toast.error(`Số lượng tối đa có thể thêm là ${maxQuantity}`, {
        description: `Hiện có ${quantityInCart} sản phẩm trong giỏ hàng. Tổng tồn kho: ${availableQty}`
      })
    } else if (newQuantity < 1) {
      setQuantity(1)
    }
  }

  const handleAddToCart = async () => {
    if (!authService.isAuthenticated()) {
      if (window.confirm('Bạn cần đăng nhập để thêm vào giỏ hàng. Đi đến trang đăng nhập?')) {
        navigate('/login')
      }
      return
    }

    // Kiểm tra tồn kho trước khi thêm vào cart
    const availableQty = getAvailableQuantity()
    const maxQuantity = availableQty - quantityInCart
    
    if (availableQty === 0) {
      toast.error('Sản phẩm đã hết hàng', {
        description: 'Vui lòng chọn sản phẩm khác hoặc quay lại sau.'
      })
      return
    }

    if (quantity > maxQuantity) {
      toast.error('Số lượng vượt quá tồn kho', {
        description: `Chỉ còn ${maxQuantity} sản phẩm có thể thêm vào giỏ hàng. (Tổng tồn kho: ${availableQty}, Đã có trong giỏ: ${quantityInCart})`
      })
      return
    }

    try {
      // Tìm product_attribute_id từ size đã chọn
      const selectedSizeItem = availableSizes.find(s => s.size === selectedSize)
      const productAttributeId = selectedSizeItem?.id || null
      
      await cartService.addToCart(product.id, quantity, {
        size: selectedSize,
        product_attribute_id: productAttributeId
      })
      
      // Cập nhật số lượng trong cart sau khi thêm thành công
      const newQuantityInCart = quantityInCart + quantity
      setQuantityInCart(newQuantityInCart)
      
      // Reset quantity về 1 sau khi thêm vào cart
      setQuantity(1)
      
      // Kiểm tra nếu đã hết hàng sau khi thêm vào cart
      const remainingQty = availableQty - newQuantityInCart
      if (remainingQty <= 0) {
        toast.success('Đã thêm vào giỏ hàng!', {
          description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng. Sản phẩm đã hết hàng.`,
        })
      } else {
        toast.success('Đã thêm vào giỏ hàng!', {
          description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng. Còn lại ${remainingQty} sản phẩm.`,
        })
      }
    } catch (error) {
      toast.error('Không thể thêm vào giỏ hàng', {
        description: error.message || 'Vui lòng thử lại sau.',
      })
    }
  }

  if (!product && !loading) {
    return (
      <div>
        <section className="breadcrumb_section">
          <div className="container">
            <nav className="breadcrumb">
              <Link to="/" className="breadcrumb_link">
                Trang chủ
              </Link>
              <span className="breadcrumb_separator"> / </span>
              <span className="breadcrumb_current">Sản phẩm</span>
            </nav>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <p>Sản phẩm không tồn tại</p>
            <Link to="/products">Quay lại danh sách sản phẩm</Link>
          </div>
        </section>
      </div>
    )
  }

  const productImages = product && product.images && product.images.length > 0 
    ? product.images 
    : product && product.image 
      ? [product.image] 
      : ['https://via.placeholder.com/600']

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
            {product?.category && (
              <>
                <Link to={`/products?category=${encodeURIComponent(product.category?.name || product.category || '')}`} className="breadcrumb_link">
                  {product.category?.name || product.category || 'Danh mục'}
                </Link>
                <span className="breadcrumb_separator"> / </span>
              </>
            )}
            <span className="breadcrumb_current">{product?.name || 'Sản phẩm'}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="section">
        <div className="container">
          {loading ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '400px',
              padding: '40px 0',
              gap: '15px'
            }}>
              <ClipLoader color="#1976d2" size={50} />
              <p style={{ fontSize: '1.4rem', color: '#666' }}>
                Đang tải chi tiết sản phẩm...
              </p>
            </div>
          ) : product ? (
          <div className="product_detail_wrapper">
            {/* Left Column - Product Images */}
            <div className="product_detail_images">
              <div className="product_main_image">
                {productImages[selectedImage] ? (
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="product_main_img"
                  />
                ) : (
                  <div className="product_main_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                                  <span>Không có ảnh</span>
                  </div>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="product_thumbnails">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      className={`product_thumbnail ${selectedImage === index ? 'active' : ''}`}
                      onClick={() => setSelectedImage(index)}
                    >
                      {img ? (
                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0' }} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="product_detail_info">
              <h1 className="product_detail_title">{product.name}</h1>

              <div className="product_detail_rating">
                <div className="product_stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`product_star ${i < Math.floor(averageRating) ? 'active' : ''}`}
                      style={{ color: i < Math.floor(averageRating) ? '#ffc107' : '#ddd' }}
                    />
                  ))}
                </div>
                <span className="product_reviews_count">({totalReviews} đánh giá)</span>
                <span className="product_stock">| {product.stock > 0 ? 'Còn hàng' : 'Hết hàng'}</span>
              </div>

              <div className="product_detail_price_wrapper">
                {product.originalPrice && product.originalPrice > product.price ? (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                      <div className="product_detail_price" style={{ color: '#dc3545' }}>
                        {formatCurrency(product.price)}
                      </div>
                      <div style={{ 
                        fontSize: '1.8rem', 
                        color: '#999', 
                        textDecoration: 'line-through' 
                      }}>
                        {formatCurrency(product.originalPrice)}
                      </div>
                      {product.discountPercent && (
                        <div style={{
                          backgroundColor: '#dc3545',
                          color: '#fff',
                          padding: '5px 10px',
                          borderRadius: '5px',
                          fontSize: '1.4rem',
                          fontWeight: 'bold'
                        }}>
                          -{product.discountPercent}%
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="product_detail_price">{formatCurrency(product.price)}</div>
                )}
              </div>

              <p className="product_detail_description">
                {product.description || 'Không có mô tả cho sản phẩm này.'}
              </p>

              <div className="product_detail_divider"></div>

              {/* Color Selection - Tạm ẩn khi API chưa sẵn sàng */}
              {/* <div className="product_option">
                <label className="product_option_label">Màu sắc:</label>
                <div className="product_colors">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      className={`product_color_btn ${selectedColor === color.id ? 'active' : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color.id)}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div> */}

              {/* Size Selection */}
              {availableSizes.length > 0 && (
                <div className="product_option">
                  <label className="product_option_label">Kích thước:</label>
                  <div className="product_sizes">
                    {availableSizes.map((sizeItem) => (
                      <button
                        key={sizeItem.size}
                        className={`product_size_btn ${selectedSize === sizeItem.size ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedSize(sizeItem.size)
                          // Reset quantity về 1 khi đổi size
                          setQuantity(1)
                          // Reset quantityInCart để fetch lại
                          setQuantityInCart(0)
                        }}
                        disabled={sizeItem.quantity === 0}
                        style={{
                          opacity: sizeItem.quantity === 0 ? 0.5 : 1,
                          cursor: sizeItem.quantity === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {sizeItem.size}
                        {sizeItem.quantity === 0 && ' (Hết)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="product_actions">
                <div className="product_quantity">
                  <button
                    className="quantity_btn"
                    onClick={() => updateQuantity(-1)}
                    aria-label="Giảm số lượng"
                    disabled={quantity <= 1 || getAvailableQuantity() === 0}
                    style={{
                      opacity: (quantity <= 1 || getAvailableQuantity() === 0) ? 0.5 : 1,
                      cursor: (quantity <= 1 || getAvailableQuantity() === 0) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaChevronDown />
                  </button>
                  <input
                    type="number"
                    className="quantity_input"
                    value={quantity}
                    onChange={(e) => {
                      const newQty = parseInt(e.target.value) || 1
                      const availableQty = getAvailableQuantity()
                      const maxQuantity = availableQty - quantityInCart
                      
                      // Nếu không còn hàng để thêm
                      if (maxQuantity <= 0) {
                        setQuantity(1)
                        toast.error('Đã hết hàng', {
                          description: `Bạn đã thêm tất cả ${availableQty} sản phẩm vào giỏ hàng.`
                        })
                        return
                      }
                      
                      if (newQty >= 1 && newQty <= maxQuantity) {
                        setQuantity(newQty)
                      } else if (newQty > maxQuantity) {
                        setQuantity(maxQuantity)
                        toast.error(`Số lượng tối đa là ${maxQuantity}`, {
                          description: `Tổng tồn kho: ${availableQty}, Đã có trong giỏ: ${quantityInCart}`
                        })
                      } else {
                        setQuantity(1)
                      }
                    }}
                    min="1"
                    max={Math.max(1, getAvailableQuantity() - quantityInCart)}
                    disabled={getAvailableQuantity() === 0 || (getAvailableQuantity() - quantityInCart) <= 0}
                    style={{
                      opacity: getAvailableQuantity() === 0 ? 0.5 : 1,
                      cursor: getAvailableQuantity() === 0 ? 'not-allowed' : 'text'
                    }}
                  />
                  <button
                    className="quantity_btn"
                    onClick={() => updateQuantity(1)}
                    aria-label="Tăng số lượng"
                    disabled={
                      getAvailableQuantity() === 0 || 
                      (getAvailableQuantity() - quantityInCart) <= 0 ||
                      quantity >= (getAvailableQuantity() - quantityInCart)
                    }
                    style={{
                      opacity: (
                        getAvailableQuantity() === 0 || 
                        (getAvailableQuantity() - quantityInCart) <= 0 ||
                        quantity >= (getAvailableQuantity() - quantityInCart)
                      ) ? 0.5 : 1,
                      cursor: (
                        getAvailableQuantity() === 0 || 
                        (getAvailableQuantity() - quantityInCart) <= 0 ||
                        quantity >= (getAvailableQuantity() - quantityInCart)
                      ) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <FaChevronUp />
                  </button>
                </div>
                <button 
                  className="product_buy_btn" 
                  onClick={handleAddToCart}
                  disabled={
                    getAvailableQuantity() === 0 || 
                    (getAvailableQuantity() - quantityInCart) <= 0
                  }
                  style={{
                    opacity: (
                      getAvailableQuantity() === 0 || 
                      (getAvailableQuantity() - quantityInCart) <= 0
                    ) ? 0.5 : 1,
                    cursor: (
                      getAvailableQuantity() === 0 || 
                      (getAvailableQuantity() - quantityInCart) <= 0
                    ) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {
                    getAvailableQuantity() === 0 || (getAvailableQuantity() - quantityInCart) <= 0
                      ? 'Hết hàng' 
                      : 'Thêm vào giỏ'
                  }
                </button>
                <button 
                  className={`product_wishlist_btn ${isInWishlist ? 'active' : ''}`}
                  aria-label="Thêm vào yêu thích"
                  onClick={handleToggleWishlist}
                  style={{ 
                    backgroundColor: isInWishlist ? '#dc3545' : 'transparent',
                    color: isInWishlist ? '#fff' : '#333'
                  }}
                >
                  <FaHeart />
                </button>
              </div>

              {/* Delivery Info */}
              <div className="product_delivery">
                <div className="product_delivery_item">
                  <FaTruck className="product_delivery_icon" />
                  <div>
                    <p className="product_delivery_title">Giao hàng miễn phí</p>
                    <Link to="/shipping" className="product_delivery_link">
                      Nhập mã bưu điện để kiểm tra khả năng giao hàng
                    </Link>
                  </div>
                </div>
                <div className="product_delivery_item">
                  <FaUndo className="product_delivery_icon" />
                  <div>
                    <p className="product_delivery_title">Đổi trả miễn phí</p>
                    <Link to="/returns" className="product_delivery_link">
                      Đổi trả miễn phí trong 30 ngày. Chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ) : null}
        </div>
      </section>

      {/* Comments Section */}
      <section className="section">
        <div className="container">
          <div className="product_comments">
            <h2 className="product_comments_title">Đánh giá sản phẩm</h2>

            {/* Comments List */}
            <div className="comments_list">
              {productComments.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '40px', fontSize: '1.4rem', color: '#666' }}>
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm này!
                </p>
              ) : (
                productComments.map((comment) => (
                  <div key={comment.id} className="comment_item">
                    <div className="comment_header">
                      <div className="comment_user_info">
                        <FaUser className="comment_user_icon" />
                        <div>
                          <p className="comment_user_name">{comment.user_name || 'Người dùng'}</p>
                          <div className="comment_meta">
                            <div className="comment_stars">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`comment_star ${i < comment.rating ? 'active' : ''}`}
                                  style={{ color: i < comment.rating ? '#ffc107' : '#ddd' }}
                                />
                              ))}
                            </div>
                            <span className="comment_date">
                              {formatDateShort(comment.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="comment_content">{comment.content || 'Không có nội dung'}</p>
                    
                    {/* Admin Reply */}
                    {comment.admin_reply && (
                      <div style={{
                        marginTop: '15px',
                        padding: '15px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '8px',
                        border: '1px solid #bbdefb',
                        borderLeft: '4px solid #1976d2'
                      }}>
                        <div style={{
                          fontSize: '1.3rem',
                          fontWeight: '600',
                          color: '#1976d2',
                          marginBottom: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span>Phản hồi từ Admin:</span>
                        </div>
                        <p style={{
                          fontSize: '1.4rem',
                          color: '#333',
                          margin: 0,
                          lineHeight: '1.6'
                        }}>
                          {comment.admin_reply}
                        </p>
                        {comment.admin_replied_at && (
                          <div style={{
                            fontSize: '1.2rem',
                            color: '#666',
                            marginTop: '8px',
                            fontStyle: 'italic'
                          }}>
                            {formatDateOnly(comment.admin_replied_at)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section">
        <div className="container">
          <div className="section_category">
            <p className="section_category_p">Sản phẩm liên quan</p>
          </div>
          <div className="section_header">
            <h3 className="section_title">Sản phẩm liên quan</h3>
          </div>
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            slidesPerView={1}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="mySwiper"
          >
            {relatedProducts.length > 0 ? relatedProducts.map((relatedProduct) => (
              <SwiperSlide key={relatedProduct.id}>
                <div className="card">
                  <div className="card_top">
                    {relatedProduct.image ? (
                      <img src={relatedProduct.image} alt={relatedProduct.title} className="card_img" />
                    ) : (
                      <div className="card_img" style={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                                  <span>Không có ảnh</span>
                      </div>
                    )}
                    {relatedProduct.discount && <div className="card_tag">{relatedProduct.discount}</div>}
                    <div className="card_top_icons">
                      <FaHeart className="card_top_icon" />
                      <FaEye className="card_top_icon" />
                    </div>
                  </div>
                  <div className="card_body">
                    <Link to={`/products/${relatedProduct.id}`} className="card_title_link">
                      <h3 className="card_title">{relatedProduct.title}</h3>
                    </Link>
                    <div className="card_price_wrapper">
                      <p className="card_price">{formatCurrency(relatedProduct.price)}</p>
                    </div>
                    <div className="card_ratings">
                      <div className="card_stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <FaStar key={index} className="w-6 h-6" />
                        ))}
                      </div>
                      <p className="card_rating_numbers">({relatedProduct.reviews})</p>
                    </div>
                    <button 
                      className="add_to_cart"
                      onClick={async (e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        
                        if (!authService.isAuthenticated()) {
                          if (window.confirm('Bạn cần đăng nhập để thêm vào giỏ hàng. Đi đến trang đăng nhập?')) {
                            navigate('/login')
                          }
                          return
                        }

                        try {
                          await cartService.addToCart(relatedProduct.id, 1)
                          toast.success('Đã thêm vào giỏ hàng!', {
                            description: `${relatedProduct.name_product} đã được thêm vào giỏ hàng.`,
                          })
                        } catch (error) {
                          toast.error('Không thể thêm vào giỏ hàng', {
                            description: error.message || 'Vui lòng thử lại sau.',
                          })
                        }
                      }}
                    >
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            )) : (
              <SwiperSlide>
                <p>Không có sản phẩm liên quan</p>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </section>
    </div>
  )
}

export default ProductsDetail
