import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionPage = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(saved);
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'Semua' || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product) => {
    if (product.stock <= 0) {
      alert('Stok habis!');
      return;
    }
    const newCart = [...cart];
    const exist = newCart.find((i) => i.id === product.id);
    if (exist) exist.quantity++;
    else newCart.push({ ...product, quantity: 1 });
    setCart(newCart);
  };

  const completeTransaction = () => {
    if (cart.length === 0) return alert('Keranjang kosong!');

    const updatedProducts = products.map((p) => {
      const item = cart.find((c) => c.id === p.id);
      return item ? { ...p, stock: p.stock - item.quantity } : p;
    });

    const history = JSON.parse(localStorage.getItem('transactions')) || [];
    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const newTransaction = {
      id: Date.now(),
      date: new Date().toLocaleString('id-ID'),
      items: cart,
      total,
    };

    localStorage.setItem('products', JSON.stringify(updatedProducts));
    localStorage.setItem('transactions', JSON.stringify([...history, newTransaction]));

    alert('Transaksi berhasil disimpan!');
    setProducts(updatedProducts);
    setCart([]);
  };

  const totalHarga = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-black flex flex-col items-center">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Halaman Transaksi</h2>
          <button onClick={() => navigate('/')} className="bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700">
            🏠 Kembali ke Dashboard
          </button>
        </div>

        {/* 🔍 Pencarian & Filter */}
        <div className="flex gap-3 mb-4">
          <input type="text" placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="border rounded-xl p-2 flex-1" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border rounded-xl p-2">
            <option value="Semua">Semua</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Rokok">Rokok</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* 📦 Daftar Produk */}
        <div className="bg-white border rounded-2xl shadow p-4 mb-6">
          {filteredProducts.length === 0 ? (
            <p className="text-gray-500">Tidak ada produk ditemukan.</p>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className="flex justify-between items-center border-b py-2">
                <span>
                  {p.name} — Rp{p.price.toLocaleString('id-ID')} — Stok: {p.stock}
                </span>
                <button onClick={() => addToCart(p)} className="bg-purple-500 text-white px-3 py-1 rounded-xl hover:bg-purple-600">
                  Tambah
                </button>
              </div>
            ))
          )}
        </div>

        {/* 🛒 Keranjang */}
        <div className="bg-purple-100 p-5 rounded-2xl shadow-md">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Keranjang</h3>
          {cart.length === 0 ? (
            <p className="text-gray-600">Belum ada produk di keranjang.</p>
          ) : (
            cart.map((i) => (
              <div key={i.id} className="flex justify-between mb-1">
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>Rp{(i.price * i.quantity).toLocaleString('id-ID')}</span>
              </div>
            ))
          )}
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total:</span>
            <span>Rp{totalHarga.toLocaleString('id-ID')}</span>
          </div>
        </div>

        <div className="text-center mt-5">
          <button onClick={completeTransaction} className="bg-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-purple-700">
            💾 Selesaikan Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionPage;
