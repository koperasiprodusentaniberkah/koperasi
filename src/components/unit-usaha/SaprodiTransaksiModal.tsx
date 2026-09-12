import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingCart, 
  PackagePlus, 
  ArrowUpRight, 
  ArrowDownRight, 
  User, 
  Truck, 
  DollarSign, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  Search,
  Wallet,
  Building2,
  Calendar,
  FileText
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { SaprodiItem, SaprodiTransaction } from '../../types/koperasi';
import { formatRupiah, formatAngka } from '../../utils/exportUtils';

interface SaprodiTransaksiModalProps {
  isOpen: boolean;
  initialType?: 'Penjualan' | 'Pembelian';
  preselectedItem?: SaprodiItem | null;
  onClose: () => void;
  onSuccess?: (transaction: SaprodiTransaction) => void;
}

export const SaprodiTransaksiModal: React.FC<SaprodiTransaksiModalProps> = ({
  isOpen,
  initialType = 'Penjualan',
  preselectedItem = null,
  onClose,
  onSuccess
}) => {
  const { 
    saprodiItems, 
    anggotaList, 
    tambahTransaksiSaprodi 
  } = useKoperasi();

  const [tipe, setTipe] = useState<'Penjualan' | 'Pembelian'>(initialType);
  const [tanggal, setTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [barangId, setBarangId] = useState<string>('');
  const [jumlah, setJumlah] = useState<number>(1);
  const [hargaSatuan, setHargaSatuan] = useState<number>(0);
  
  // Pihak (Pembeli / Supplier)
  const [tipePihak, setTipePihak] = useState<'Anggota' | 'Non-Anggota' | 'Supplier / Distributor'>('Anggota');
  const [anggotaId, setAnggotaId] = useState<string>('');
  const [namaManual, setNamaManual] = useState<string>('');
  const [noHp, setNoHp] = useState<string>('');
  const [searchAnggota, setSearchAnggota] = useState<string>('');
  
  // Pembayaran & Opsi
  const [metodePembayaran, setMetodePembayaran] = useState<'Tunai' | 'Transfer Bank' | 'Potong Simpanan Sukarela'>('Tunai');
  const [catatan, setCatatan] = useState<string>('');
  const [updateHargaBeliMaster, setUpdateHargaBeliMaster] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Sinkronisasi saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setTipe(initialType);
      setTanggal(new Date().toISOString().split('T')[0]);
      setErrorMsg('');
      
      if (initialType === 'Penjualan') {
        setTipePihak('Anggota');
        setMetodePembayaran('Tunai');
      } else {
        setTipePihak('Supplier / Distributor');
        setMetodePembayaran('Transfer Bank');
      }

      if (preselectedItem) {
        setBarangId(preselectedItem.id);
        setHargaSatuan(initialType === 'Penjualan' ? preselectedItem.hargaJual : preselectedItem.hargaBeli);
      } else if (saprodiItems.length > 0) {
        const first = saprodiItems[0];
        setBarangId(first.id);
        setHargaSatuan(initialType === 'Penjualan' ? first.hargaJual : first.hargaBeli);
      }
    }
  }, [isOpen, initialType, preselectedItem, saprodiItems]);

  // Handle pergantian tipe transaksi
  const handleSwitchTipe = (newType: 'Penjualan' | 'Pembelian') => {
    setTipe(newType);
    setErrorMsg('');
    if (newType === 'Penjualan') {
      setTipePihak('Anggota');
      setMetodePembayaran('Tunai');
      const item = saprodiItems.find(i => i.id === barangId);
      if (item) setHargaSatuan(item.hargaJual);
    } else {
      setTipePihak('Supplier / Distributor');
      setMetodePembayaran('Transfer Bank');
      const item = saprodiItems.find(i => i.id === barangId);
      if (item) setHargaSatuan(item.hargaBeli);
    }
  };

  // Handle pergantian item barang
  const handleSelectBarang = (id: string) => {
    setBarangId(id);
    const item = saprodiItems.find(i => i.id === id);
    if (item) {
      setHargaSatuan(tipe === 'Penjualan' ? item.hargaJual : item.hargaBeli);
    }
  };

  const selectedItem = saprodiItems.find(i => i.id === barangId) || saprodiItems[0];
  const selectedAnggota = anggotaList.find(a => a.id === anggotaId);

  // Perhitungan live
  const totalBiaya = (hargaSatuan || 0) * (jumlah || 0);
  const marginSatuan = selectedItem && tipe === 'Penjualan' ? Math.max(0, hargaSatuan - selectedItem.hargaBeli) : 0;
  const totalMargin = marginSatuan * (jumlah || 0);
  const danaTaktis10 = Math.round(totalMargin * 0.10);
  const netMargin = totalMargin - danaTaktis10;

  // Nama pihak efektif
  const effectiveNamaPihak = tipe === 'Penjualan'
    ? (tipePihak === 'Anggota' ? (selectedAnggota?.nama || '') : namaManual)
    : namaManual;

  const effectiveNoHp = tipe === 'Penjualan'
    ? (tipePihak === 'Anggota' ? (selectedAnggota?.noHp || '') : noHp)
    : noHp;

  // Filter anggota untuk pencarian
  const filteredAnggota = anggotaList.filter(a => 
    a.nama.toLowerCase().includes(searchAnggota.toLowerCase()) ||
    a.nomorAnggota.toLowerCase().includes(searchAnggota.toLowerCase()) ||
    (a.kelompokTani && a.kelompokTani.toLowerCase().includes(searchAnggota.toLowerCase()))
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedItem) {
      setErrorMsg('Pilih produk barang yang valid.');
      return;
    }

    if (!jumlah || jumlah <= 0) {
      setErrorMsg('Jumlah (Qty) harus lebih dari 0.');
      return;
    }

    if (tipe === 'Penjualan') {
      if (jumlah > selectedItem.stok) {
        setErrorMsg(`Stok barang tidak mencukupi! Stok ${selectedItem.namaBarang} saat ini hanya tersedia ${selectedItem.stok} ${selectedItem.satuan}.`);
        return;
      }

      if (tipePihak === 'Anggota' && !anggotaId) {
        setErrorMsg('Silakan pilih anggota koperasi sebagai pembeli.');
        return;
      }

      if (tipePihak === 'Non-Anggota' && !namaManual.trim()) {
        setErrorMsg('Silakan masukkan nama pembeli.');
        return;
      }

      if (metodePembayaran === 'Potong Simpanan Sukarela' && tipePihak === 'Anggota') {
        const saldoSukarela = selectedAnggota?.simpananSukarela || 0;
        if (saldoSukarela < totalBiaya) {
          setErrorMsg(`Saldo Simpanan Sukarela ${selectedAnggota?.nama} (${formatRupiah(saldoSukarela)}) tidak mencukupi untuk pembayaran Rp ${totalBiaya.toLocaleString('id-ID')}.`);
          return;
        }
      }
    } else {
      // Pembelian
      if (!namaManual.trim()) {
        setErrorMsg('Silakan masukkan nama distributor / supplier pemasok.');
        return;
      }
    }

    try {
      const created = tambahTransaksiSaprodi({
        tipe,
        barangId: selectedItem.id,
        jumlah,
        hargaSatuan,
        namaPihak: effectiveNamaPihak,
        tipePihak,
        anggotaId: tipePihak === 'Anggota' ? anggotaId : undefined,
        noHp: effectiveNoHp,
        metodePembayaran,
        catatan,
        updateHargaBeliMaster: tipe === 'Pembelian' ? updateHargaBeliMaster : undefined
      });

      if (onSuccess) {
        onSuccess(created);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses transaksi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-6 animate-in fade-in zoom-in-95">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              tipe === 'Penjualan' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {tipe === 'Penjualan' ? <ShoppingCart className="w-5 h-5" /> : <PackagePlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Input Transaksi Toko Saprodi
              </h3>
              <p className="text-xs text-slate-500">
                Pencatatan jual-beli sarana produksi pertanian, stok otomatis, dan arus kas toko.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switch: Penjualan vs Pembelian */}
        <div className="mt-4 grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleSwitchTipe('Penjualan')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tipe === 'Penjualan'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
            <span>Penjualan Barang (Ke Petani/Umum)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSwitchTipe('Pembelian')}
            className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              tipe === 'Pembelian'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownRight className="w-4 h-4 text-blue-600" />
            <span>Pembelian / Restock (Dari Supplier)</span>
          </button>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Row 1: Tanggal Transaksi & Produk Barang */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={e => setTanggal(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1 flex items-center justify-between">
                <span>Pilih Produk Saprodi *</span>
                {selectedItem && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedItem.stok <= selectedItem.stokMinimal
                      ? 'bg-red-100 text-red-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    Sisa Stok: {selectedItem.stok} {selectedItem.satuan}
                  </span>
                )}
              </label>
              <select
                value={barangId}
                onChange={e => handleSelectBarang(e.target.value)}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-800"
              >
                {saprodiItems.map(item => (
                  <option key={item.id} value={item.id}>
                    [{item.kodeBarang}] {item.namaBarang} — Stok: {item.stok} {item.satuan} (Jual: {formatRupiah(item.hargaJual)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Informasi Pihak (Pembeli atau Supplier) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            {tipe === 'Penjualan' ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    Identitas Pembeli
                  </span>

                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tipePihak"
                        checked={tipePihak === 'Anggota'}
                        onChange={() => {
                          setTipePihak('Anggota');
                          setNamaManual('');
                        }}
                        className="text-emerald-600"
                      />
                      <span className="text-slate-700 font-medium">Anggota Koperasi</span>
                    </label>

                    <label className="inline-flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="tipePihak"
                        checked={tipePihak === 'Non-Anggota'}
                        onChange={() => {
                          setTipePihak('Non-Anggota');
                          setAnggotaId('');
                          if (metodePembayaran === 'Potong Simpanan Sukarela') {
                            setMetodePembayaran('Tunai');
                          }
                        }}
                        className="text-emerald-600"
                      />
                      <span className="text-slate-700 font-medium">Non-Anggota / Umum</span>
                    </label>
                  </div>
                </div>

                {tipePihak === 'Anggota' ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Cari nama anggota, no. anggota, atau kelompok tani..."
                        value={searchAnggota}
                        onChange={e => setSearchAnggota(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <select
                      value={anggotaId}
                      onChange={e => {
                        const id = e.target.value;
                        setAnggotaId(id);
                        const a = anggotaList.find(x => x.id === id);
                        if (a) setNoHp(a.noHp);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
                    >
                      <option value="">-- Pilih Petani Anggota Koperasi --</option>
                      {filteredAnggota.slice(0, 50).map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nama} ({a.nomorAnggota}) • {a.kelompokTani || 'Mandiri'} • Simp. Sukarela: {formatRupiah(a.simpananSukarela)}
                        </option>
                      ))}
                    </select>

                    {selectedAnggota && (
                      <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50/70 border border-emerald-200 text-[11px]">
                        <span className="text-emerald-800 font-medium">
                          No. HP / WA: <strong className="text-emerald-950">{selectedAnggota.noHp || '-'}</strong>
                        </span>
                        <span className="text-emerald-800 font-medium">
                          Saldo Simpanan Sukarela: <strong className="text-emerald-950">{formatRupiah(selectedAnggota.simpananSukarela)}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Nama Pembeli *</label>
                      <input
                        type="text"
                        placeholder="Contoh: Pak Suwarno (Petani Mitra)"
                        value={namaManual}
                        onChange={e => setNamaManual(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">No. WhatsApp / Kontak (Opsional)</label>
                      <input
                        type="text"
                        placeholder="08xxxxxxxxxx"
                        value={noHp}
                        onChange={e => setNoHp(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Pembelian / Restock dari Supplier */
              <>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    Pemasok / Distributor Pabrik
                  </span>
                  <span className="text-[10px] text-slate-500">Restock stok toko</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Distributor / Pabrik *</label>
                    <input
                      type="text"
                      list="supplier-list"
                      placeholder="Contoh: PT Petrokimia Gresik / CV Tani Jaya"
                      value={namaManual}
                      onChange={e => setNamaManual(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                    />
                    <datalist id="supplier-list">
                      <option value="PT Petrokimia Gresik (Distributor Pupuk Resmi)" />
                      <option value="PT BISI International (Cap Panah Merah)" />
                      <option value="PT Bayer Indonesia (Pestisida & Proteksi)" />
                      <option value="CV Tani Makmur Sejahtera (Grosir Saprodi)" />
                      <option value="Distributor Mulsa & Alat Pertanian Solo" />
                    </datalist>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">No. Kontak / Sales Supplier</label>
                    <input
                      type="text"
                      placeholder="08xxxxxxxxxx"
                      value={noHp}
                      onChange={e => setNoHp(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Row 3: Jumlah Qty & Harga Satuan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  Volume / Qty ({selectedItem?.satuan || 'Pcs'}) *
                </label>
                {tipe === 'Penjualan' && (
                  <span className="text-[10px] text-slate-500">
                    Max: {selectedItem?.stok || 0} {selectedItem?.satuan}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="1"
                  max={tipe === 'Penjualan' ? selectedItem?.stok : undefined}
                  value={jumlah}
                  onChange={e => setJumlah(Math.max(1, Number(e.target.value)))}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-1">
                  {[1, 5, 10].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setJumlah(val)}
                      className="px-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-[11px] text-slate-700"
                    >
                      +{val}
                    </button>
                  ))}
                  {tipe === 'Penjualan' && selectedItem && (
                    <button
                      type="button"
                      onClick={() => setJumlah(selectedItem.stok)}
                      className="px-2 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 font-bold text-[11px] text-blue-700"
                    >
                      Max
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-semibold">
                  {tipe === 'Penjualan' ? 'Harga Jual per Satuan (Rp) *' : 'Harga Beli Modal per Satuan (Rp) *'}
                </label>
                <span className="text-[10px] text-slate-500">
                  {tipe === 'Penjualan' 
                    ? `Modal: ${formatRupiah(selectedItem?.hargaBeli || 0)}` 
                    : `Standar: ${formatRupiah(selectedItem?.hargaBeli || 0)}`}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={hargaSatuan}
                onChange={e => setHargaSatuan(Math.max(0, Number(e.target.value)))}
                required
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-900 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Opsi khusus pembelian: Update harga beli master */}
          {tipe === 'Pembelian' && (
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-200 text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={updateHargaBeliMaster}
                onChange={e => setUpdateHargaBeliMaster(e.target.checked)}
                className="rounded text-blue-600"
              />
              <span className="text-[11px]">
                Perbarui Harga Pokok Modal di Katalog Barang menjadi <strong>{formatRupiah(hargaSatuan)}</strong>
              </span>
            </label>
          )}

          {/* Live Calculation Card */}
          <div className={`p-4 rounded-xl border ${
            tipe === 'Penjualan'
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-blue-50/60 border-blue-200'
          }`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left">
              <div>
                <span className="text-slate-500 block text-[10px]">Total Nilai Transaksi:</span>
                <span className="text-base font-bold text-slate-900">
                  {formatRupiah(totalBiaya)}
                </span>
              </div>

              {tipe === 'Penjualan' ? (
                <>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Margin Laba:</span>
                    <span className="text-sm font-bold text-emerald-700">
                      +{formatRupiah(totalMargin)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Dana Taktis (10%):</span>
                    <span className="text-sm font-bold text-amber-700">
                      {formatRupiah(danaTaktis10)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Laba Bersih Toko (90%):</span>
                    <span className="text-sm font-bold text-blue-700">
                      {formatRupiah(netMargin)}
                    </span>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-3 text-right flex flex-col justify-center">
                  <span className="text-slate-500 block text-[10px]">Arus Kas Toko:</span>
                  <span className="text-sm font-bold text-red-600">
                    Pengeluaran Restock -{formatRupiah(totalBiaya)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Row 4: Metode Pembayaran & Catatan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                Metode Pembayaran *
              </label>
              <select
                value={metodePembayaran}
                onChange={e => setMetodePembayaran(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="Tunai">Tunai / Cash (Kasir Toko)</option>
                <option value="Transfer Bank">Transfer Bank Rekening Koperasi</option>
                {tipe === 'Penjualan' && tipePihak === 'Anggota' && (
                  <option value="Potong Simpanan Sukarela">
                    Potong Simpanan Sukarela Petani
                  </option>
                )}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                Catatan / Keterangan (Opsional)
              </label>
              <input
                type="text"
                placeholder={tipe === 'Penjualan' ? 'Contoh: Pupuk dasar cabai musim 3' : 'Contoh: No. Faktur PO-DST-991'}
                value={catatan}
                onChange={e => setCatatan(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              />
            </div>
          </div>

          {/* Footer Modal Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium"
            >
              Batal
            </button>

            <button
              type="submit"
              className={`px-5 py-2.5 rounded-xl font-bold text-white flex items-center gap-2 shadow-xs transition-colors ${
                tipe === 'Penjualan'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Simpan Transaksi {tipe}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
