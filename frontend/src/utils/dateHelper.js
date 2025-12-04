/**
 * Format date string từ backend (UTC) sang timezone Việt Nam (GMT+7)
 * @param {string} dateString - Date string từ backend (format: YYYY-MM-DD HH:mm:ss hoặc ISO 8601)
 * @param {object} options - Options cho toLocaleDateString/toLocaleString
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-'
  
  try {
    // Parse date string từ backend (thường là UTC)
    const date = new Date(dateString)
    
    // Kiểm tra nếu date không hợp lệ
    if (isNaN(date.getTime())) {
      return '-'
    }
    
    // Default options cho Việt Nam
    const defaultOptions = {
      timeZone: 'Asia/Ho_Chi_Minh',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      ...options
    }
    
    // Nếu có hour và minute trong options, dùng toLocaleString
    if (defaultOptions.hour !== undefined || defaultOptions.minute !== undefined) {
      return date.toLocaleString('vi-VN', defaultOptions)
    }
    
    // Ngược lại dùng toLocaleDateString
    return date.toLocaleDateString('vi-VN', defaultOptions)
  } catch (error) {
    console.error('Error formatting date:', error, dateString)
    return '-'
  }
}

/**
 * Format date với đầy đủ thông tin (ngày, tháng, năm, giờ, phút)
 */
export const formatDateTime = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

/**
 * Format date ngắn gọn (DD/MM/YYYY)
 */
export const formatDateShort = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

/**
 * Format date với giờ phút (DD/MM/YYYY HH:mm)
 */
export const formatDateTimeShort = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}

/**
 * Format chỉ ngày, không có giờ (DD/MM/YYYY) - dùng cho Orders, Reviews
 */
export const formatDateOnly = (dateString) => {
  return formatDate(dateString, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  })
}
