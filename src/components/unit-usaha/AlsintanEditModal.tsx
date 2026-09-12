import React, { useState, useEffect } from 'react';
import { X, Tractor, Save, AlertCircle, Sparkles } from 'lucide-react';
import { AlsintanItem } from '../../types/koperasi';
import { formatRupiah } from '../../utils/exportUtils';

interface AlsintanEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: AlsintanItem | null;
  onSave: (data: {
    kodeAlat: string;
    namaAlat: string;
    jenis: string;
    hargaSewaHari: number;
    hargaSewaJam: number;
    status: 'Tersedia' | 'Disewa' | 'Perawatan';
    kondisi: 'Sangat Baik' | 'Baik' | 'Perlu Servis';
    lokasi: string;
  }) => void;
}

export const AlsintanEditModal: React.FC<AlsintanEditModalProps> = ({
  isOpen,
  onClose,
  itemToEdit,
  onSave
}) => {
  const isEditing = !!itemToEdit;

  const [formData, setFormData] = useState({
    kodeAlat: '',
    namaAlat: '',
    jenis: 'Traktor Olah Tanah',
    hargaSewaHari: 200000,
    hargaSewaJam: 35000,
    status: 'Tersedia' as 'Tersedia' | 'Disewa' | 'Perawatan',
    kondisi: 'Sangat Baik' as 'Sangat Baik' | 'Baik' | 'Perlu Servis',
    lokasi: 'Gudang Utama Koperasi'
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        kodeAlat: itemToEdit.kodeAlat,
        namaAlat: itemToEdit.namaAlat,
        jenis: itemToEdit.jenis,
        hargaSewaHari: itemToEdit.hargaSewaHari,
        hargaSewaJam: itemToEdit.hargaSewaJam,
        status: itemToEdit.status,
        kondisi: itemToEdit.kondisi,
        lokasi: itemToEdit.lokasi
      });
    } else {
      setFormData({
        kodeAlat: `ALT-${Date.now().toString().slice(-4)}`,
        namaAlat: '',
        jenis: 'Traktor Olah Tanah',
        hargaSewaHari: 200000,
        hargaSewaJam: 35000,
        status: 'Tersedia',
        kondisi: 'Sangat Baik',
        lokasi: 'Gudang Utama Koperasi'
      });
    }
    setValidationError('');
  }, [itemToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaAlat.trim()) {
      setValidationError('Nama mesin / alat pertanian wajib diisi.');
      return;
    }
    if (formData.hargaSewaHari <= 0 && formData.hargaSewaJam <= 0) {
      setValidationError('Minimal salah satu tarif sewa (harian atau per jam) harus lebih dari 0.');
      return;
    }

    onSave({
      kodeAlat: formData.kodeAlat.trim() || `ALT-${Date.now().toString().slice(-4)}`,
      namaAlat: formData.namaAlat.trim(),
      jenis: formData.jenis,
      hargaSewaHari: Number(formData.hargaSewaHari),
      hargaSewaJam: Number(formData.hargaSewaJam),
      status: formData.status,
      kondisi: formData.kondisi,
      lokasi: formData.lokasi.trim() || 'Gudang Utama Koperasi'
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
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Tractor className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEditing ? 'Edit Inventaris Mesin & Tarif Sewa' : 'Tambah Mesin Alsintan Baru'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? `Perbarui spesifikasi dan tarif sewa untuk ${itemToEdit.kodeAlat}`
                  : 'Daftarkan alat atau mesin pertanian baru ke inventaris koperasi'}
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
                Kode Alat *
              </label>
              <input
                type="text"
                required
                value={formData.kodeAlat}
                onChange={e => setFormData({ ...formData, kodeAlat: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 focus:border-amber-500 focus:outline-hidden"
                placeholder="Contoh: ALT-TRK-01"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Nama Alat / Mesin Pertanian *
              </label>
              <input
                type="text"
                required
                value={formData.namaAlat}
                onChange={e => setFormData({ ...formData, namaAlat: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-slate-900 focus:border-amber-500 focus:outline-hidden"
                placeholder="Contoh: Traktor Roda 4 Kubota L4018 40 HP"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kategori / Jenis Alsintan
              </label>
              <select
                value={formData.jenis}
                onChange={e => setFormData({ ...formData, jenis: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Traktor Olah Tanah">Traktor Olah Tanah (Roda 2 / 4)</option>
                <option value="Cultivator">Cultivator / Rotavator Guludan</option>
                <option value="Pompa Air Irigasi">Pompa Air Irigasi (Alkon / Submersible)</option>
                <option value="Pengolah Hasil Panen">Pengolah Hasil Panen (Pemipil/Perontok)</option>
                <option value="Transplanter Bibit">Transplanter / Mesin Tanam</option>
                <option value="Hand Sprayer & Mist Blower">Hand Sprayer & Mist Blower Listrik</option>
                <option value="Drone Pertanian">Drone Pertanian Pemupukan/Semprot</option>
                <option value="Lainnya">Alat Pertanian Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Lokasi Penyimpanan / Unit
              </label>
              <input
                type="text"
                value={formData.lokasi}
                onChange={e => setFormData({ ...formData, lokasi: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
                placeholder="Contoh: Gudang Utama Koperasi"
              />
            </div>
          </div>

          {/* Tarif Sewa Section (Highlighted) */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Penetapan Tarif Sewa (Tarif Khusus Anggota)
              </span>
              <span className="text-[10px] text-amber-700 font-medium">Bisa Harian & Per Jam</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tarif Sewa per Hari (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.hargaSewaHari}
                  onChange={e => setFormData({ ...formData, hargaSewaHari: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-bold text-amber-900 text-sm focus:border-amber-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formatRupiah(formData.hargaSewaHari)} per hari (24 jam)
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Tarif Sewa per Jam (Rp) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={formData.hargaSewaJam}
                  onChange={e => setFormData({ ...formData, hargaSewaJam: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-amber-300 bg-white font-bold text-amber-900 text-sm focus:border-amber-600 focus:outline-hidden"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  {formatRupiah(formData.hargaSewaJam)} per jam operasional
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Status Unit
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Tersedia">Tersedia (Siap Disewa)</option>
                <option value="Disewa">Disewa (Sedang Beroperasi)</option>
                <option value="Perawatan">Perawatan (Dalam Servis/Maintenance)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Kondisi Fisik / Mesin
              </label>
              <select
                value={formData.kondisi}
                onChange={e => setFormData({ ...formData, kondisi: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="Sangat Baik">Sangat Baik (Prima / Siap Tempur)</option>
                <option value="Baik">Baik (Normal Operasional)</option>
                <option value="Perlu Servis">Perlu Servis (Oli / Sparepart)</option>
              </select>
            </div>
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
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Tarif & Mesin' : 'Simpan Alsintan Baru'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
