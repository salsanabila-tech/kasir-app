import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase'; // sesuaikan path jika berbeda
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('Makanan');
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Load produk dari localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(saved);
  }, []);

  // Tambah / Update produk
  const handleAddOrUpdateProduct = () => {
    if (!name || !price || !stock) {
      alert('Semua field harus diisi!');
      return;
    }

    let updatedProducts;

    if (editingId) {
      updatedProducts = products.map((p) => (p.id === editingId ? { ...p, name, price: parseInt(price), stock: parseInt(stock), category } : p));
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        name,
        price: parseInt(price),
        stock: parseInt(stock),
        category,
      };
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setName('');
    setPrice('');
    setStock('');
    setCategory('Makanan');
  };

  // Hapus produk
  const handleDeleteProduct = (id) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  // Edit produk
  const handleEditProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock);
    setCategory(product.category);
    setEditingId(product.id);
  };

  // Logout
  const handleLogout = async () => {
    try {
      // 1) sign out dari firebase
      await signOut(auth);

      // 2) arahkan ke /login dan replace history supaya back tidak kembali ke dashboard
      navigate('/login', { replace: true });

      // 3) paksa reload singkat untuk memastikan halaman login mount ulang dengan bersih
      //    (tidak mengubah UI; hanya memastikan React + listener auth tidak meninggalkan layar putih)
      setTimeout(() => {
        // use replace supaya tidak menumpuk history
        window.location.replace('/login');
      }, 50);
    } catch (err) {
      console.error('Logout error:', err);
      alert('Gagal logout — coba lagi.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex justify-center items-center text-gray-800">
      <div className="bg-white bg-opacity-90 p-8 rounded-3xl shadow-xl w-[90%] max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-purple-700">KasirApp 💰</h1>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
            Logout
          </button>
        </div>

        <p className="text-center text-gray-700 text-lg font-semibold">
          Selamat Datang di <span className="text-purple-700 font-bold">Dashboard Kasir 🎉</span>
        </p>
        <p className="text-center text-gray-600 mb-8">Kelola produk dan pantau transaksi kamu dengan mudah.</p>

        {/* Form Tambah Produk */}
        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Tambah Produk</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
            <input type="text" placeholder="Nama Produk" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg p-2" />
            <input type="number" placeholder="Harga" value={price} onChange={(e) => setPrice(e.target.value)} className="border rounded-lg p-2" />
            <input type="number" placeholder="Stok" value={stock} onChange={(e) => setStock(e.target.value)} className="border rounded-lg p-2" />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded-lg p-2">
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Rokok">Rokok</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            <button onClick={handleAddOrUpdateProduct} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg">
              {editingId ? 'Update' : 'Tambah'}
            </button>
          </div>
        </div>

        {/* Tabel Produk */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-purple-100 text-left">
                <th className="p-2">Nama</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Harga</th>
                <th className="p-2">Stok</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-4 text-gray-500">
                    Belum ada produk ditambahkan.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="p-2 capitalize">{p.name}</td>
                    <td className="p-2">{p.category}</td>
                    <td className="p-2">Rp{p.price.toLocaleString('id-ID')}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2 flex justify-center gap-2">
                      <button onClick={() => handleEditProduct(p)} className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Navigasi Bawah */}
        <div className="flex justify-center gap-4">
          <button onClick={() => navigate('/transaksi')} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-lg shadow-md">
            💸 Buka Halaman Transaksi
          </button>
          <button onClick={() => navigate('/riwayat')} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md">
            📜 Lihat Riwayat Transaksi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
