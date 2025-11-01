import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('transactions')) || [];
    setTransactions(saved.reverse()); // tampilkan dari terbaru ke lama
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex justify-center items-center p-6">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-3xl shadow-xl w-full max-w-5xl p-8 relative">
        {/* 🔙 Tombol kembali */}
        <button onClick={() => navigate('/')} className="absolute top-4 right-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
          ⬅️ Dashboard
        </button>

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">Riwayat Transaksi</h2>
        <p className="text-center text-gray-600 mb-6">Daftar transaksi yang sudah kamu lakukan 💸</p>

        {/* 🧾 Daftar transaksi */}
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada transaksi yang tercatat.</p>
        ) : (
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
            {transactions.map((t) => (
              <div key={t.id} className="bg-white border border-purple-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">🕒 {t.date}</span>
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-lg text-sm shadow">Total: Rp{t.total.toLocaleString('id-ID')}</span>
                </div>
                <hr className="border-purple-200 my-2" />
                <ul className="list-disc pl-6 text-gray-700">
                  {t.items.map((item, index) => (
                    <li key={index}>
                      {item.name} × {item.quantity} — Rp
                      {(item.price * item.quantity).toLocaleString('id-ID')}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
