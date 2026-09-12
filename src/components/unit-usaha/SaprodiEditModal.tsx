import React, { useState, useEffect } from 'react';
import { X, Store, Save, AlertCircle, Calculator, TrendingUp, ShieldCheck } from 'lucide-react';
import { SaprodiItem } from '../../types/koperasi';
import { formatRupiah } from '../../utils/exportUtils';

interface SaprodiEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: SaprodiItem | null;
  onSave: (data: {
    kodeBarang: string;
    namaBarang: string;
    kategori: 'Pupuk' | 'Pestisida & Obat' | 'Benih' | 'Alat & Perlengkapan' | 'Lainnya';
    satuan: string;
    stok: number;
    stokMinimal: number;
    hargaBeli: number;
    hargaJual: number;
  }) => void;
}

export const SaprodiEditModal: React.FC<SaprodiEditModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onSave
}) => {
  const isEditing = !!itemToEdit;

  const [formData, setFormData] = useState({
    kodeBarang: '',
    namaBarang: '',
    kategori: 'Pupuk' as 'Pupuk' | 'Pestisida & Obat' | 'Benih' | 'Alat & Perlengkapan' | 'Lainnya',
    satuan: 'Karung',
    stok: 25,
    stokMinimal: 5,
    hargaBeli: 250000,
    hargaJual: 280000
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        kodeBarang: itemToEdit.kodeBarang,
        namaBarang: itemToEdit.namaBarang,
        kategori: itemToEdit.kategori,
        satuan: itemToEdit.satuan,
        stok: itemToEdit.stok,
        stokMinimal: itemToEdit.stokMinimal,
        hargaBeli: itemToEdit.hargaBeli,
        hargaJual: itemToEdit.hargaJual
      });
    } else {
      setFormData({
        kodeBarang: `SPD-${Date.now().toString().slice(-4)}`,
        namaBarang: '',
        kategori: 'Pupuk',
        satuan: 'Karung',
        stok: 25,
        stokMinimal: 5,
        hargaBeli: 250000,
        hargaJual: 280000
      });
    }
    setValidationError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  // Live calculation of margin & dana taktis
  const margin = formData.hargaJual - formData.hargaBeli;
  const marginPersen =
    formData.hargaBeli > 0
      ? Number(((margin / formData.hargaBeli) * 100).toFixed(2))
      : 0;
  const danaTaktis10 = Math.max(0, Math.round(margin * 0.1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaBarang.trim()) {
      setValidationError('Nama barang saprodi wajib diisi.');
      return;
    }
    if (formData.hargaBeli < 0 || formData.hargaJual < 0) {
      setValidationError('Harga beli dan harga jual tidak boleh negatif.');
      return;
    }
    if (formData.stok < 0) {
      setValidationError('Jumlah stok tidak boleh negatif.');
      return;
    }

    onSave({
      kodeBarang: formData.kodeBarang.trim() || `SPD-${Date.now().toString().slice(-4)}`,
      namaBarang: formData.namaBarang.trim(),
      kategori: formData.kategori,
      satuan: formData.satuan.trim() || 'Pcs',
      stok: Number(formData.stok),
      stokMinimal: Number(formData.stokMinimal),
      hargaBeli: Number(formData.hargaBeli),
      hargaJual: Number(formData.hargaJual)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Barang Saprodi & Penetapan Harga' : 'Tambah Barang Saprodi Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Perbarui stok, harga beli, dan harga jual untuk ${itemToEdit.kodeBarang}`
                  : 'Daftarkan sarana produksi baru (pupuk, benih, pestisida, alat) ke toko'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kode Barang *
              </label>
              <input
                type="text"
                required
                value={formData.kodeBarang}
                onChange={e => setFormData({ ...formData, kodeBarang: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-blue-700 focus:border-blue-500 focus:outline-hidden"
                placeholder="Contoh: SPD-PK-01"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Barang Sarana Produksi *
              </label>
              <input
                type="text"
                required
                value={formData.namaBarang}
                onChange={e => setFormData({ ...formData, namaBarang: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                placeholder="Contoh: Pupuk NPK Mutiara 16-16-16 (50 Kg)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kategori Barang
              </label>
              <select
                value={formData.kategori}
                onChange={e => setFormData({ ...formData, kategori: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Pupuk">Pupuk (Urea, NPK, Organik, dll)</option>
                <option value="Pestisida & Obat">Pestisida & Obat (Insektisida, Fungisida)</option>
                <option value="Benih">Benih / Bibit Tanaman</option>
                <option value="Alat & Perlengkapan">Alat & Perlengkapan (Mulsa, Sprayer, Selang)</option>
                <option value="Lainnya">Lain-lain</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Satuan Kemasan *
              </label>
              <input
                type="text"
                required
                value={formData.satuan}
                onChange={e => setFormData({ ...formData, satuan: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-blue-500 focus:outline-hidden"
                placeholder="Contoh: Karung (50kg), Botol (500ml), Sachet, Roll"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Jumlah Stok Fisik *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stok}
                onChange={e => setFormData({ ...formData, stok: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Batas Minimum Stok (Alert) *
              </label>
              <input
                type="number"
                min="0"
                required
                value={formData.stokMinimal}
                onChange={e => setFormData({ ...formData, stokMinimal: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-blue-500 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Jika stok di bawah ini, muncul notifikasi &quot;Stok Menipis&quot;
              </span>
            </div>
          </div>

          {/* Pricing & Automatic Margin Box */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-950 flex items-center gap-1.5 text-xs">
                <Calculator className="w-3.5 h-3.5 text-blue-600" />
                Penetapan Harga & Margin Otomatis
              </span>
              <span className="text-[10px] text-blue-700 font-medium">Sistem Kalkulasi Real-time</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Harga Beli / Modal Toko (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={formData.hargaBeli}
                  onChange={e => setFormData({ ...formData, hargaBeli: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-blue-300 bg-white font-bold text-slate-800 text-sm focus:border-blue-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formatRupiah(formData.hargaBeli)} per {formData.satuan}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Harga Jual ke Petani (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  required
                  value={formData.hargaJual}
                  onChange={e => setFormData({ ...formData, hargaJual: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-blue-300 bg-white font-bold text-blue-900 text-sm focus:border-blue-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formatRupiah(formData.hargaJual)} per {formData.satuan}
                </span>
              </div>
            </div>

            {/* Margin Calculation Live Results */}
            <div className="pt-2 border-t border-blue-200/80 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Margin Nominal</span>
                <span className={`text-xs font-bold ${margin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {margin >= 0 ? `+${formatRupiah(margin)}` : formatRupiah(margin)}
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Margin (%)</span>
                <span className={`text-xs font-bold ${margin >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                  {marginPersen}%
                </span>
              </div>

              <div className="bg-white/80 p-2 rounded-lg border border-blue-100">
                <span className="text-[10px] text-slate-500 block">Dana Taktis 10%</span>
                <span className="text-xs font-bold text-amber-700">
                  {formatRupiah(danaTaktis10)}
                </span>
              </div>
            </div>

            {margin < 0 && (
              <p className="text-[11px] text-red-600 font-semibold text-center">
                ⚠️ Harga jual lebih rendah dari harga modal (akan rugi).
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Barang' : 'Simpan Barang Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
