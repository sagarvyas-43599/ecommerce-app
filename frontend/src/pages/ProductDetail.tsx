import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, ShieldCheck, Truck, CheckCircle } from 'lucide-react';
import { ProductService, ReviewService } from '../services/ecommerce.service';
import type { IProduct, IReview } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export const ProductDetail: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title?: string; comment?: string }>({});
  const [reviewMessage, setReviewMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (!idOrSlug) return;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await ProductService.getProductByIdOrSlug(idOrSlug);
        if (res?.data) {
          setProduct(res.data);
          setSelectedImage(res.data.images[0]?.url || '');

          // Fetch reviews
          const revRes = await ReviewService.getProductReviews(res.data._id);
          if (revRes?.data) setReviews(revRes.data);
        }
      } catch (err) {
        console.error('Failed to load product details', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [idOrSlug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const errors: { title?: string; comment?: string } = {};
    const trimmedTitle = reviewTitle.trim();
    const trimmedComment = reviewComment.trim();

    if (!trimmedTitle || trimmedTitle.length < 2) {
      errors.title = 'Review title must be at least 2 characters';
    }
    if (!trimmedComment || trimmedComment.length < 5) {
      errors.comment = 'Review comment must be at least 5 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmittingReview(true);
    setReviewMessage(null);
    try {
      await ReviewService.addReview(product._id, {
        rating,
        title: trimmedTitle,
        comment: trimmedComment,
      });
      // Refresh reviews
      const revRes = await ReviewService.getProductReviews(product._id);
      if (revRes?.data) setReviews(revRes.data);
      setReviewTitle('');
      setReviewComment('');
      setReviewMessage({ type: 'success', text: 'Thank you! Your verified review has been published.' });
    } catch (err: any) {
      setReviewMessage({ type: 'error', text: err.message || 'Failed to submit review' });
    } finally {
      setSubmittingReview(false);
      setTimeout(() => setReviewMessage(null), 5000);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 100, color: 'var(--text-muted)' }}>Loading product details...</div>;
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <h2>Product not found</h2>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
          Back to Store
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 20px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 50, marginBottom: 80 }}>
        {/* Left Column: Image Gallery */}
        <div>
          <div
            className="glass-panel"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              height: 480,
              background: '#0d121f',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 20 }}
            />
          </div>

          {/* Image Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                    border: selectedImage === img.url ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: '#0d121f',
                  }}
                >
                  <img
                    src={img.url}
                    alt=""
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800';
                    }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Actions */}
        <div>
          <span className="badge badge-primary" style={{ marginBottom: 12 }}>
            {product.brand}
          </span>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={18} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>{product.ratingsAverage.toFixed(1)}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>({product.ratingsQuantity} ratings)</span>
            </div>
            <span style={{ color: 'var(--text-dim)' }}>•</span>
            <span style={{ color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 600, fontSize: '0.9rem' }}>
              {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
            </span>
          </div>

          {/* Pricing */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff' }}>
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && (
              <span style={{ fontSize: '1.2rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: 30 }}>
            {product.description}
          </p>

          {/* Quantity and Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 16px', color: 'var(--text-main)', background: 'transparent' }}
              >
                -
              </button>
              <span style={{ padding: '0 12px', fontWeight: 700 }}>{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{ padding: '10px 16px', color: 'var(--text-main)', background: 'transparent' }}
              >
                +
              </button>
            </div>

            <button
              onClick={() => addToCart(product._id, quantity)}
              className="btn btn-primary"
              style={{ flex: 1, padding: '14px 24px', fontSize: '1rem' }}
              disabled={product.stock <= 0}
            >
              <ShoppingBag size={20} />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={() => toggleWishlist(product._id)}
              className="btn btn-secondary"
              style={{ padding: 14, color: inWishlist ? 'var(--secondary)' : 'var(--text-main)' }}
            >
              <Heart size={20} fill={inWishlist ? 'var(--secondary)' : 'none'} />
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="glass-panel" style={{ padding: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
              <Truck size={18} color="var(--primary)" /> Express Delivery Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
              <ShieldCheck size={18} color="var(--success)" /> Official Warranty Included
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section style={{ borderTop: '1px solid var(--border-color)', paddingTop: 50 }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 700, marginBottom: 30 }}>
          Customer Reviews & Ratings ({reviews.length})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
          {/* Write a Review Form */}
          <div className="glass-panel" style={{ padding: 30, height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 16 }}>Leave a Review</h3>
            <form onSubmit={handleReviewSubmit} noValidate>
              {reviewMessage && (
                <div
                  style={{
                    background: reviewMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${reviewMessage.type === 'success' ? 'var(--success)' : 'var(--danger)'}`,
                    color: reviewMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                    marginBottom: 16,
                  }}
                >
                  {reviewMessage.text}
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: 6, color: 'var(--text-muted)' }}>Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', color: '#fff', borderRadius: 'var(--radius-sm)' }}
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 - Exceptional)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value={3}>⭐⭐⭐ (3 - Average)</option>
                  <option value={2}>⭐⭐ (2 - Poor)</option>
                  <option value={1}>⭐ (1 - Terrible)</option>
                </select>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review Title</label>
                  <span style={{ fontSize: '0.75rem', color: reviewTitle.trim().length >= 2 ? 'var(--success)' : 'var(--text-dim)' }}>
                    {reviewTitle.trim().length}/2 min chars
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Incredible camera & battery life"
                  value={reviewTitle}
                  onChange={(e) => {
                    setReviewTitle(e.target.value);
                    if (fieldErrors.title) setFieldErrors({ ...fieldErrors, title: undefined });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'var(--bg-input)',
                    border: fieldErrors.title ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                {fieldErrors.title && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>
                    {fieldErrors.title}
                  </span>
                )}
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Detailed Comment</label>
                  <span style={{ fontSize: '0.75rem', color: reviewComment.trim().length >= 5 ? 'var(--success)' : 'var(--text-dim)' }}>
                    {reviewComment.trim().length}/5 min chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Write honest feedback (at least 5 characters)..."
                  value={reviewComment}
                  onChange={(e) => {
                    setReviewComment(e.target.value);
                    if (fieldErrors.comment) setFieldErrors({ ...fieldErrors, comment: undefined });
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: 'var(--bg-input)',
                    border: fieldErrors.comment ? '1px solid var(--danger)' : '1px solid var(--border-color)',
                    color: '#fff',
                    borderRadius: 'var(--radius-sm)',
                  }}
                />
                {fieldErrors.comment && (
                  <span style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: 4, display: 'block' }}>
                    {fieldErrors.comment}
                  </span>
                )}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submittingReview}>
                {submittingReview ? 'Submitting Review...' : 'Post Customer Review'}
              </button>
            </form>
          </div>

          {/* Review List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No reviews yet. Be the first to review this product!</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id} className="glass-panel" style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontWeight: 700 }}>{rev.user?.name || 'Customer'}</span>
                      {rev.isVerifiedPurchase && (
                        <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>
                          <CheckCircle size={10} /> Verified Purchase
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                      ))}
                    </div>
                  </div>
                  <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: 6 }}>{rev.title}</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{rev.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
