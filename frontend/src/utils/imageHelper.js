/**
 * Helper function để xử lý đường dẫn hình ảnh
 * Nếu đường dẫn là relative path, sẽ thêm base URL của API
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  
  // Nếu đã là URL đầy đủ (http/https), trả về nguyên vẹn
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Base URL của backend (bỏ /api vì static files không nằm trong /api)
  const baseURL = 'http://localhost:8000'
  
  // Nếu bắt đầu bằng /, thêm base URL
  if (imagePath.startsWith('/')) {
    return `${baseURL}${imagePath}`
  }
  
  // Nếu là relative path (uploads/products/...), thêm base URL và /
  // Laravel thường serve static files từ public folder, nên cần thêm /
  return `${baseURL}/${imagePath}`
}

