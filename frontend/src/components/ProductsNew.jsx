import React from 'react'
import { Link } from 'react-router-dom'

const galleryItems = [
  {
    id: 1,
    title: 'Streetwear Collection',
    description: 'Bùng nổ phong cách đường phố với các thiết kế độc quyền.',
    cta: 'Khám phá ngay',
    // Ảnh thay thế: Một người mẫu nam phong cách streetwear, đội nón, đeo kính cực ngầu
    image:
      'https://images.unsplash.com/photo-1512353087810-25dfcd100962?auto=format&fit=crop&w=1100&q=80',
    modifier: 'gallery_item_1',
  },
  {
    id: 2,
    title: "Sneaker Trends",
    description: 'Bộ sưu tập giày "hype" nhất mùa này.',
    cta: 'Xem chi tiết',
    // Ảnh giày Sneaker hiện đại
    image:
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1100&q=80',
    modifier: 'gallery_item_2',
  },
  {
    id: 3,
    title: 'Hot Accessories',
    description: 'Mũ, túi, kính - Điểm nhấn cho outfit của bạn.',
    cta: 'Mua ngay',
    // Ảnh phụ kiện thời trang
    image:
      'https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?auto=format&fit=crop&w=1100&q=80',
    modifier: 'gallery_item_3',
  },
  {
    id: 4,
    title: 'Denim Jacket',
    description: 'Phong cách bụi bặm, bền bỉ theo thời gian.',
    cta: 'Mua ngay',
    // Ảnh áo khoác Denim
    image:
      'https://images.unsplash.com/photo-1559551409-dadc959f76b8?auto=format&fit=crop&w=1100&q=80',
    modifier: 'gallery_item_4',
  },
]

const ProductsNew = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="section_category">
          <p className="section_category_p">Xu hướng</p>
        </div>
        <div className="section_header">
          <h3 className="section_title">Bộ sưu tập mới</h3>
        </div>
        <div className="gallery">
          {galleryItems.map((item) => (
            <div key={item.id} className={`gallery_item ${item.modifier}`}>
              <img src={item.image} alt={item.title} className="gallery_item_img" />
              <div className="gallery_item_content">
                <div className="gallery_item_title">{item.title}</div>
                <p className="gallery_item_p">{item.description}</p>
                <Link to="/products" className="gallery_item_link">
                  {item.cta.toUpperCase()}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsNew