// Service để xử lý thao tác giỏ hàng
import { axiosInstance } from './axiosConfig';
import { authService } from './authService';

export const cartService = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (productId, quantity = 1, options = {}) => {
    if (!authService.isAuthenticated()) {
      throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
    }

    try {
      const payload = {
        product_id: productId,
        quantity_item: quantity,
      };
      
      // Thêm size và product_attribute_id nếu có
      if (options.size) {
        payload.size = options.size;
      }
      if (options.product_attribute_id) {
        payload.product_attribute_id = options.product_attribute_id;
      }
      
      const response = await axiosInstance.post('/cart/add', payload);
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Đã thêm vào giỏ hàng' };
      }
      return { success: false, message: 'Không thể thêm vào giỏ hàng' };
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      const errorMessage = error.response?.data?.message || 'Không thể thêm vào giỏ hàng';
      throw new Error(errorMessage);
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (productId) => {
    try {
      const response = await axiosInstance.post('/cart/remove', {
        product_id: productId,
      });
      
      if (response.data.status === 'success') {
        return { success: true, message: 'Đã xóa khỏi giỏ hàng' };
      }
      return { success: false, message: 'Không thể xóa khỏi giỏ hàng' };
    } catch (error) {
      console.error('Lỗi khi xóa khỏi giỏ hàng:', error);
      const errorMessage = error.response?.data?.message || 'Không thể xóa khỏi giỏ hàng';
      throw new Error(errorMessage);
    }
  },

  // Lấy giỏ hàng
  getCart: async () => {
    if (!authService.isAuthenticated()) {
      return [];
    }

    try {
      const response = await axiosInstance.get('/cart');
      if (response.data.status === 'success') {
        const data = response.data.data;
        if (Array.isArray(data)) {
          return data;
        } else if (data && Array.isArray(data.cart)) {
          return data.cart;
        } else if (data && Array.isArray(data.items)) {
          return data.items;
        }
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy giỏ hàng:', error);
      return [];
    }
  },
};

