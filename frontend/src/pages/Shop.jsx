import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { medicineAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [medicines, setMedicines] = useState([]);
    const [filteredMedicines, setFilteredMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState(10000);

    const location = useLocation();

    const categories = [
        'All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Cold & Flu',
        'Children Products', 'Beauty', 'Perfume', 'Protection',
        'Diapers', 'Baby Wipes', 'Baby Skincare', 'Baby Food'
    ];

    useEffect(() => {
        // Check URL for category filter (e.g., from Home page)
        const params = new URLSearchParams(location.search);
        const categoryParam = params.get('category');
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [location.search]);

    useEffect(() => {
        const fetchMedicines = async () => {
            setLoading(true);
            try {
                const response = await medicineAPI.getAll();
                // Handle different response structures
                const data = Array.isArray(response.data) ? response.data : response.data.medicines || [];
                setMedicines(data);
                setFilteredMedicines(data);
            } catch (err) {
                console.error('Error fetching medicines:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchMedicines();
    }, []);

    useEffect(() => {
        let result = medicines;

        // Filter by Category
        if (selectedCategory !== 'All') {
            result = result.filter(med => med.category === selectedCategory);
        }

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(med =>
                med.name.toLowerCase().includes(query) ||
                med.description?.toLowerCase().includes(query)
            );
        }

        // Filter by Price
        result = result.filter(med => med.price <= priceRange);

        setFilteredMedicines(result);
    }, [medicines, selectedCategory, searchQuery, priceRange]);

    return (
        <div className="container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Sidebar Filters */}
            <aside style={{ flex: '1 0 250px', maxWidth: '300px' }} className="glass sticky-sidebar">
                <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Filters</h3>

                    {/* Search */}
                    <div className="form-group">
                        <label className="form-label">Search</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Search medicines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categories */}
                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="form-group">
                        <label className="form-label">Price Range: ₹0 - ₹{priceRange}</label>
                        <input
                            type="range"
                            style={{ width: '100%' }}
                            min="0"
                            max="10000"
                            step="100"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                        />
                    </div>

                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', marginTop: '1rem' }}
                        onClick={() => {
                            setSelectedCategory('All');
                            setSearchQuery('');
                            setPriceRange(10000);
                        }}
                    >
                        Reset Filters
                    </button>
                </div>
            </aside>

            {/* Product Grid */}
            <main style={{ flex: '1 0 300px' }}>
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2>Shop Products</h2>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        Showing {filteredMedicines.length} results
                    </span>
                </div>

                {loading ? (
                    <div className="spinner"></div>
                ) : error ? (
                    <div className="alert alert-error">{error}</div>
                ) : filteredMedicines.length === 0 ? (
                    <div className="text-center" style={{ padding: '3rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                        <h3>No medicines found</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                    </div>
                ) : (
                    <div className="grid grid-3">
                        {filteredMedicines.map(medicine => (
                            <ProductCard key={medicine._id} medicine={medicine} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Shop;
