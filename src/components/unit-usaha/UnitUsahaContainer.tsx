import React, { useState } from 'react';
import {
  Store,
  Tractor,
  Wheat,
  Banknote,
  PiggyBank,
  Plus,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
  Share2,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Calculator,
  Search,
  Check,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Tag,
  CreditCard,
  ShoppingCart,
  PackagePlus,
  Filter
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import {
  PanenTransaction,
  SaprodiItem,
  SaprodiCashFlow,
  SaprodiTransaction,
  AlsintanItem,
  BrilinkTransaction,
  Anggota
} from '../../types/koperasi';
import {
  formatRupiah,
  formatAngka,
  formatTanggalIndo,
  exportToExcel,
  exportToWord,
  exportToPdf
} from '../../utils/exportUtils';
import { NotaModal } from './NotaModal';
import { AlsintanEditModal } from './AlsintanEditModal';
import { SaprodiEditModal } from './SaprodiEditModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { SaprodiTransaksiModal } from './SaprodiTransaksiModal';
import { SaprodiNotaModal } from './SaprodiNotaModal';

export interface UnitUsahaContainerProps {
  initialSubTab?: 'saprodi' | 'alsintan' | 'agribisnis' | 'brilink' | 'simpan-pinjam';
}

export const UnitUsahaContainer: React.FC<UnitUsahaContainerProps> = ({ initialSubTab = 'agribisnis' }) => {
  const {
    authType,
    activeAnggota,
    anggotaList,
    commodityPrices,
    updateHargaKomoditas,
    panenList,
    tambahTransaksiPanen,
    saprodiItems,
    tambahBarangSaprodi,
    updateBarangSaprodi,
    hapusBarangSaprodi,
    saprodiCashflow,
    tambahArusKasSaprodi,
    saprodiTransactions,
    hapusTransaksiSaprodi,
    alsintanItems,
    tambahAlsintan,
    updateAlsintan,
    hapusAlsintan,
    alsintanRentals,
    tambahSewaAlsintan,
    selesaikanSewaAlsintan,
    brilinkList,
    tambahTransaksiBrilink,
    loans,
    ajukanPinjaman,
    hitungStatistikKeuangan
  } = useKoperasi();

  const isMemberMode = authType === 'anggota' && !!activeAnggota;
  const stats = hitungStatistikKeuangan();

  // Sub-tabs inside Module 4
  const [activeSubTab, setActiveSubTab] = useState<
    'saprodi' | 'alsintan' | 'agribisnis' | 'brilink' | 'simpan-pinjam'
  >(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Modal / Form States
  const [activeNota, setActiveNota] = useState<PanenTransaction | null>(null);

  // 1. Agribisnis States
  const [selectedAnggotaId, setSelectedAnggotaId] = useState<string>(
    isMemberMode && activeAnggota ? activeAnggota.id : (anggotaList[0]?.id || '')
  );
  const [selectedKomoditas, setSelectedKomoditas] = useState<string>('Cabai Rawit Merah');
  const [panenKg, setPanenKg] = useState<number>(100);
  const [hargaPanenCustom, setHargaPanenCustom] = useState<number>(0);
  const [tipePenjualan, setTipePenjualan] = useState<'Koperasi Mandiri' | 'BUMDes'>('Koperasi Mandiri');
  const [catatanPanen, setCatatanPanen] = useState<string>('');

  // 2. Saprodi Form & Edit States
  const [showAddSaprodiModal, setShowAddSaprodiModal] = useState(false);
  const [editingSaprodiItem, setEditingSaprodiItem] = useState<SaprodiItem | null>(null);
  const [deleteSaprodiItem, setDeleteSaprodiItem] = useState<SaprodiItem | null>(null);

  // Saprodi Jual Beli Transaction States
  const [showSaprodiTrxModal, setShowSaprodiTrxModal] = useState(false);
  const [saprodiTrxInitialType, setSaprodiTrxInitialType] = useState<'Penjualan' | 'Pembelian'>('Penjualan');
  const [saprodiTrxPreselectedItem, setSaprodiTrxPreselectedItem] = useState<SaprodiItem | null>(null);
  const [activeSaprodiNota, setActiveSaprodiNota] = useState<SaprodiTransaction | null>(null);
  const [deleteSaprodiTrxItem, setDeleteSaprodiTrxItem] = useState<SaprodiTransaction | null>(null);
  const [saprodiTrxFilter, setSaprodiTrxFilter] = useState<'Semua' | 'Penjualan' | 'Pembelian'>('Semua');
  const [saprodiTrxSearch, setSaprodiTrxSearch] = useState<string>('');

  // Saprodi order helper calculation (pemesanan barang saprodi)
  const [orderBarangId, setOrderBarangId] = useState<string>('');
  const [orderJumlah, setOrderJumlah] = useState<number>(10);
  const [orderModalCustom, setOrderModalCustom] = useState<number>(0);
  const [orderMarginPersenCustom, setOrderMarginPersenCustom] = useState<number>(10);

  // 3. Alsintan Form & Edit States
  const [showAddAlsintanModal, setShowAddAlsintanModal] = useState(false);
  const [editingAlsintanItem, setEditingAlsintanItem] = useState<AlsintanItem | null>(null);
  const [deleteAlsintanItem, setDeleteAlsintanItem] = useState<AlsintanItem | null>(null);

  const [sewaAlatId, setSewaAlatId] = useState<string>('');
  const [sewaAnggotaId, setSewaAnggotaId] = useState<string>(anggotaList[0]?.id || '');
  const [sewaDurasi, setSewaDurasi] = useState<number>(1);
  const [sewaSatuan, setSewaSatuan] = useState<'Hari' | 'Jam'>('Hari');

  // 4. Brilink Form State
  const [brilinkTipe, setBrilinkTipe] = useState<
    'Top-Up E-Wallet' | 'Tarik Tunai' | 'Transfer Bank' | 'PLN / Token' | 'Pulsa & Paket Data' | 'BPJS & Lainnya'
  >('Transfer Bank');
  const [brilinkNominal, setBrilinkNominal] = useState<number>(500000);
  const [brilinkFee, setBrilinkFee] = useState<number>(6500);
  const [brilinkNasabah, setBrilinkNasabah] = useState<string>('Pak Slamet');
  const [brilinkTujuan, setBrilinkTujuan] = useState<string>('BRI 4321-xxx');

  // 5. Simpan Pinjam Quick Application
  const [pinjamAnggotaId, setPinjamAnggotaId] = useState<string>(
    isMemberMode && activeAnggota ? activeAnggota.id : (anggotaList[0]?.id || '')
  );
  const [pinjamJumlah, setPinjamJumlah] = useState<number>(2000000);
  const [pinjamTenor, setPinjamTenor] = useState<number>(6);
  const [pinjamTujuan, setPinjamTujuan] = useState<string>('Modal pembelian pupuk & benih');
  const [pinjamAlert, setPinjamAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  React.useEffect(() => {
    if (isMemberMode && activeAnggota) {
      setPinjamAnggotaId(activeAnggota.id);
      setSelectedAnggotaId(activeAnggota.id);
    }
  }, [isMemberMode, activeAnggota]);

  // Sync selected commodity price
  const currentCommodityObj = commodityPrices.find(c => c.nama === selectedKomoditas);
  const defaultHargaAcuan = currentCommodityObj ? currentCommodityObj.hargaAcuan : 30000;
  const activeHargaPerKg = hargaPanenCustom > 0 ? hargaPanenCustom : defaultHargaAcuan;

  // Selected member for loan or panen
  const currentPinjamMember = anggotaList.find(a => a.id === pinjamAnggotaId);
  const currentPinjamTotalSimpanan = currentPinjamMember
    ? currentPinjamMember.simpananPokok + currentPinjamMember.simpananWajib + currentPinjamMember.simpananSukarela
    : 0;
  const currentPinjamPlafon = currentPinjamTotalSimpanan * 2;

  // Filtered Saprodi Transactions
  const filteredSaprodiTrx = saprodiTransactions.filter(t => {
    const matchFilter = saprodiTrxFilter === 'Semua' || t.tipe === saprodiTrxFilter;
    const q = saprodiTrxSearch.toLowerCase();
    const matchSearch = saprodiTrxSearch === '' ||
      t.namaBarang.toLowerCase().includes(q) ||
      t.kodeBarang.toLowerCase().includes(q) ||
      t.namaPihak.toLowerCase().includes(q) ||
      t.kodeTransaksi.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  // Handler: Input Transaksi Panen
  const handleSubmitPanen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnggotaId || panenKg <= 0) {
      alert('Pilih anggota dan masukkan berat panen yang valid!');
      return;
    }

    const newTransaction = tambahTransaksiPanen({
      anggotaId: selectedAnggotaId,
      komoditas: selectedKomoditas,
      beratKg: Number(panenKg),
      hargaPerKg: Number(activeHargaPerKg),
      tipePenjualan,
      catatan: catatanPanen
    });

    // Auto open Nota modal to send to WhatsApp!
    setActiveNota(newTransaction);
    setPanenKg(100);
    setCatatanPanen('');
  };

  // Handler: Submit Sewa Alsintan
  const handleAddSewa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sewaAlatId || !sewaAnggotaId) {
      alert('Pilih alat dan penyewa!');
      return;
    }
    tambahSewaAlsintan({
      alsintanId: sewaAlatId,
      anggotaId: sewaAnggotaId,
      durasi: Number(sewaDurasi),
      satuanDurasi: sewaSatuan
    });
    alert('Penyewaan alsintan berhasil dicatat!');
  };

  // Handler: Submit Brilink
  const handleAddBrilink = (e: React.FormEvent) => {
    e.preventDefault();
    tambahTransaksiBrilink({
      tipe: brilinkTipe,
      nominal: Number(brilinkNominal),
      feeAdmin: Number(brilinkFee),
      namaNasabah: brilinkNasabah,
      nomorTujuan: brilinkTujuan,
      status: 'Berhasil'
    });
    alert('Transaksi Brilink berhasil dibukukan.');
  };

  // Handler: Ajukan Pinjaman
  const handleAjukanPinjaman = (e: React.FormEvent) => {
    e.preventDefault();
    const res = ajukanPinjaman({
      anggotaId: pinjamAnggotaId,
      jumlahPinjaman: Number(pinjamJumlah),
      tenorBulan: Number(pinjamTenor),
      tujuanPinjaman: pinjamTujuan
    });

    if (res.success) {
      setPinjamAlert({ type: 'success', message: res.message });
    } else {
      setPinjamAlert({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Navigation between 5 business units */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-xs">
        {isMemberMode && (
          <div className="mb-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <div>
                <span className="font-bold">Akses Anggota Tani (Mode Lihat Saja):</span>
                <span className="text-emerald-800 ml-1">
                  Anda dapat memantau katalog barang, tarif alsintan, harga acuan panen, dan layanan secara transparan. Penambahan, pengubahan, dan penghapusan data hanya dapat dilakukan oleh Pengurus Koperasi.
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
              View-Only
            </span>
          </div>
        )}

        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Store className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Unit Usaha Terpadu Koperasi
              </h2>
              <p className="text-[11px] text-slate-500">
                Integrasi hulu-hilir pertanian: Saprodi, Alsintan, Agribisnis Sayuran, Brilink, dan Simpan Pinjam.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          <button
            id="tab-unit-agribisnis"
            onClick={() => setActiveSubTab('agribisnis')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'agribisnis'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Wheat className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">Agribisnis Sayuran</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'agribisnis' ? 'text-emerald-100' : 'text-slate-400'}`}>
                Panen & Potongan
              </div>
            </div>
          </button>

          <button
            id="tab-unit-saprodi"
            onClick={() => setActiveSubTab('saprodi')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'saprodi'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Store className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">Toko Saprodi</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'saprodi' ? 'text-blue-100' : 'text-slate-400'}`}>
                Stok & Dana Taktis 10%
              </div>
            </div>
          </button>

          <button
            id="tab-unit-alsintan"
            onClick={() => setActiveSubTab('alsintan')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'alsintan'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Tractor className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">Sewa Alsintan</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'alsintan' ? 'text-amber-100' : 'text-slate-400'}`}>
                Traktor & Mesin Tani
              </div>
            </div>
          </button>

          <button
            id="tab-unit-brilink"
            onClick={() => setActiveSubTab('brilink')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all ${
              activeSubTab === 'brilink'
                ? 'bg-sky-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Banknote className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">Layanan Brilink</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'brilink' ? 'text-sky-100' : 'text-slate-400'}`}>
                Top-Up & Transfer
              </div>
            </div>
          </button>

          <button
            id="tab-unit-simpanpinjam"
            onClick={() => setActiveSubTab('simpan-pinjam')}
            className={`p-2.5 rounded-xl text-left flex items-center gap-2.5 transition-all col-span-2 sm:col-span-1 ${
              activeSubTab === 'simpan-pinjam'
                ? 'bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <PiggyBank className="w-4 h-4 shrink-0" />
            <div className="truncate">
              <div className="text-xs truncate">Simpan Pinjam</div>
              <div className={`text-[10px] truncate ${activeSubTab === 'simpan-pinjam' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Validasi 2x Plafon
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. AGRIBISNIS SAYURAN SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'agribisnis' && (
        <div className="space-y-6">
          {/* Rules Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
            <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
              <Wheat className="w-4 h-4 text-emerald-700" />
              Aturan Pemotongan Simpanan Otomatis Transaksi Panen
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-xs text-emerald-900">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                <strong>1. Komoditas Percabaian (Rawit / Keriting / Aneka Cabai):</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Total potongan <strong>Rp 500 / Kg</strong> (Dialokasikan: <strong>Rp 400 Simpanan Sukarela</strong> & <strong>Rp 100 Simpanan Wajib</strong>).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-emerald-200">
                <strong>2. Komoditas Selain Percabaian (Sayuran Lain):</strong>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Total potongan <strong>Rp 150 / Kg</strong> (Dialokasikan: <strong>Rp 100 Simpanan Sukarela</strong> & <strong>Rp 50 Simpanan Wajib</strong>).
                </p>
              </div>
            </div>
          </div>

          {/* Form Input Transaksi Panen & Update Harga Harian */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Panen (2 cols) - Khusus Pengurus */}
            {!isMemberMode && (
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                Input Pembelian Hasil Panen (Petani ke Koperasi)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Sistem menghitung potongan simpanan otomatis, sisa bersih petani, dan siap share nota via WhatsApp.
              </p>

              <form onSubmit={handleSubmitPanen} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Pilih Petani / Anggota *
                    </label>
                    <select
                      id="select-panen-anggota"
                      value={selectedAnggotaId}
                      onChange={e => setSelectedAnggotaId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      {anggotaList.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nomorAnggota} - {a.nama} ({a.alamat.slice(0, 20)}...)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Komoditas Panen *
                    </label>
                    <select
                      id="select-panen-komoditas"
                      value={selectedKomoditas}
                      onChange={e => {
                        setSelectedKomoditas(e.target.value);
                        setHargaPanenCustom(0);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      {commodityPrices.map(c => (
                        <option key={c.id} value={c.nama}>
                          {c.nama} ({c.kategori === 'percabaian' ? 'Percabaian' : 'Sayuran Lain'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Volume Berat (Kg) *
                    </label>
                    <input
                      id="input-panen-berat"
                      type="number"
                      required
                      min="1"
                      value={panenKg}
                      onChange={e => setPanenKg(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Harga Acuan Harian (Rp/Kg)
                    </label>
                    <input
                      id="input-panen-harga"
                      type="number"
                      value={activeHargaPerKg}
                      onChange={e => setHargaPanenCustom(Number(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Saluran Penjualan
                    </label>
                    <select
                      value={tipePenjualan}
                      onChange={e => setTipePenjualan(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value="Koperasi Mandiri">Koperasi Mandiri (Pasar Induk)</option>
                      <option value="BUMDes">Kemitraan BUMDes Mitra Tani</option>
                    </select>
                  </div>
                </div>

                {/* Live calculation box */}
                {(() => {
                  const isChili = selectedKomoditas.toLowerCase().includes('cabai') || selectedKomoditas.toLowerCase().includes('cabe');
                  const potSukarela = panenKg * (isChili ? 400 : 100);
                  const potWajib = panenKg * (isChili ? 100 : 50);
                  const totalPot = potSukarela + potWajib;
                  const subtotal = panenKg * activeHargaPerKg;
                  const bersih = subtotal - totalPot;
                  const sharingProfit = panenKg * (isChili ? 350 : 200);

                  return (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-600">Subtotal Bruto ({panenKg} Kg × {formatRupiah(activeHargaPerKg)}):</span>
                        <span className="font-bold text-slate-900">{formatRupiah(subtotal)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-blue-700">
                        <span>Potongan Simpanan Otomatis ({isChili ? 'Rp 500/kg' : 'Rp 150/kg'}):</span>
                        <span className="font-mono font-semibold">-{formatRupiah(totalPot)}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-emerald-700">
                        <span>Sharing Profit Margin Koperasi:</span>
                        <span className="font-mono font-semibold">+{formatRupiah(sharingProfit)}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-900">Total Diterima Bersih Petani:</span>
                        <span className="text-emerald-700 text-base">{formatRupiah(bersih)}</span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Catatan Kualitas / Sortir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Petik merah super, kemasan keranjang bambu rapi"
                    value={catatanPanen}
                    onChange={e => setCatatanPanen(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-hidden"
                  />
                </div>

                <button
                  id="btn-submit-panen"
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Proses Transaksi & Buat Nota WhatsApp</span>
                </button>
              </form>
            </div>
            )}

            {/* Daily Commodity Prices Manager */}
            <div className={`${isMemberMode ? 'lg:col-span-3' : 'lg:col-span-1'} bg-white rounded-2xl border border-slate-200 p-5 shadow-xs`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  {isMemberMode ? 'Katalog Acuan Harga Komoditas Sayuran' : 'Update Harga Harian'}
                </h3>
                <span className="text-[10px] text-slate-400 font-medium">Acuan Resmi Hari Ini</span>
              </div>

              <div className={`space-y-2 mt-3 ${isMemberMode ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 space-y-0' : 'max-h-[380px] overflow-y-auto pr-1'}`}>
                {commodityPrices.map(c => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">{c.nama}</div>
                      <div className="text-[10px] text-slate-400">
                        {c.kategori === 'percabaian' ? 'Percabaian (Rp500/kg)' : 'Sayuran Lain (Rp150/kg)'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isMemberMode ? (
                        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md border border-emerald-200">
                          {formatRupiah(c.hargaAcuan)}
                        </span>
                      ) : (
                        <input
                          type="number"
                          defaultValue={c.hargaAcuan}
                          onBlur={e => updateHargaKomoditas(c.id, Number(e.target.value))}
                          className="w-20 p-1 text-xs text-right font-mono font-bold rounded-md border border-slate-200 bg-white"
                        />
                      )}
                      <span className="text-[10px] text-slate-500">/Kg</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Panen Otomatis & Export */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Rekapitulasi Transaksi Panen Sayuran
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Riwayat penampungan panen, potongan simpanan otomatis, dan sharing profit koperasi & BUMDes.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const data = panenList.map(p => ({
                      'Kode Nota': p.kodeNota,
                      'Tanggal': p.tanggal,
                      'Petani': p.namaAnggota,
                      'Komoditas': p.komoditas,
                      'Volume (Kg)': p.beratKg,
                      'Harga /Kg': p.hargaPerKg,
                      'Subtotal': p.subtotal,
                      'Potongan Sukarela': p.potonganSukarela,
                      'Potongan Wajib': p.potonganWajib,
                      'Total Potongan Simpanan': p.totalPotongan,
                      'Total Bersih Petani': p.totalBersihPetani,
                      'Sharing Profit Koperasi': p.sharingProfitKoperasi,
                      'Saluran Jual': p.tipePenjualan
                    }));
                    exportToExcel(data, `Rekap_Panen_Mitra_Tani_${panenList.length}`);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => {
                    const headers = ['No. Nota', 'Petani', 'Komoditas', 'Kg', 'Harga/Kg', 'Potongan', 'Bersih Petani', 'Profit Koperasi'];
                    const rows = panenList.map(p => [
                      p.kodeNota,
                      p.namaAnggota,
                      p.komoditas,
                      p.beratKg,
                      formatRupiah(p.hargaPerKg),
                      formatRupiah(p.totalPotongan),
                      formatRupiah(p.totalBersihPetani),
                      formatRupiah(p.sharingProfitKoperasi)
                    ]);
                    exportToPdf('REKAPITULASI TRANSAKSI PANEN SAYURAN', headers, rows, 'Rekap_Panen_Sayuran');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>PDF</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Nota & Tanggal</th>
                    <th className="pb-2">Petani</th>
                    <th className="pb-2">Komoditas & Volume</th>
                    <th className="pb-2 text-right">Harga/Kg</th>
                    <th className="pb-2 text-right">Potongan Simpanan</th>
                    <th className="pb-2 text-right">Bersih Petani</th>
                    <th className="pb-2 text-right">Profit Koperasi</th>
                    <th className="pb-2 text-center">Saluran</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {panenList.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 font-mono">
                        <div className="font-bold text-slate-900">{p.kodeNota}</div>
                        <div className="text-[10px] text-slate-400">{p.tanggal}</div>
                      </td>
                      <td className="py-2.5 font-medium text-slate-800">
                        {p.namaAnggota}
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-slate-900">{p.komoditas}</div>
                        <div className="text-[11px] text-slate-500">{formatAngka(p.beratKg)} Kg</div>
                      </td>
                      <td className="py-2.5 text-right font-medium text-slate-700">
                        {formatRupiah(p.hargaPerKg)}
                      </td>
                      <td className="py-2.5 text-right text-emerald-700 font-semibold">
                        +{formatRupiah(p.totalPotongan)}
                        <span className="block text-[9px] text-emerald-600">
                          (W:{formatRupiah(p.potonganWajib)} / S:{formatRupiah(p.potonganSukarela)})
                        </span>
                      </td>
                      <td className="py-2.5 text-right font-bold text-slate-900">
                        {formatRupiah(p.totalBersihPetani)}
                      </td>
                      <td className="py-2.5 text-right font-semibold text-blue-700">
                        {formatRupiah(p.sharingProfitKoperasi)}
                      </td>
                      <td className="py-2.5 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {p.tipePenjualan}
                        </span>
                      </td>
                      <td className="py-2.5 text-center">
                        <button
                          onClick={() => setActiveNota(p)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors"
                          title="Lihat & Kirim Nota via WhatsApp"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>Nota WA</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TOKO SAPRODI SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'saprodi' && (
        <div className="space-y-6">
          {/* Action Banner Toko Saprodi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Unit Toko Sarana Produksi Pertanian (Saprodi)</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif & Terintegrasi
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Penyediaan pupuk bersubsidi/non-subsidi, benih unggul, obat pertanian, dan input transaksi jual beli.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                id="btn-transaksi-jual-saprodi"
                onClick={() => {
                  setSaprodiTrxInitialType('Penjualan');
                  setSaprodiTrxPreselectedItem(null);
                  setShowSaprodiTrxModal(true);
                }}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>+ Kasir Penjualan</span>
              </button>

              <button
                id="btn-transaksi-beli-saprodi"
                onClick={() => {
                  setSaprodiTrxInitialType('Pembelian');
                  setSaprodiTrxPreselectedItem(null);
                  setShowSaprodiTrxModal(true);
                }}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
              >
                <PackagePlus className="w-4 h-4" />
                <span>+ Restock Pembelian</span>
              </button>

              <button
                id="btn-tambah-master-saprodi"
                onClick={() => setShowAddSaprodiModal(true)}
                className="flex-1 md:flex-none px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-500" />
                <span>Katalog Barang</span>
              </button>
            </div>
          </div>

          {/* Toko Saprodi Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200">
              <div className="text-xs text-blue-700 font-medium">Total Item Sarana Produksi</div>
              <div className="text-xl font-bold text-blue-950 mt-1">
                {saprodiItems.length} Produk Terdaftar
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">Pupuk, Benih, Pestisida, Alat</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs text-amber-800 font-medium">Peringatan Stok Menipis</div>
              <div className="text-xl font-bold text-amber-950 mt-1">
                {saprodiItems.filter(i => i.stok <= i.stokMinimal).length} Item Kritis
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">Perlu restock segera</div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200">
              <div className="text-xs text-purple-800 font-medium flex items-center justify-between">
                <span>Total Transaksi Jual-Beli</span>
                <span className="text-[10px] bg-purple-200 text-purple-900 px-1.5 py-0.5 rounded font-bold">
                  {saprodiTransactions.length} Trx
                </span>
              </div>
              <div className="text-xl font-bold text-purple-950 mt-1">
                {formatRupiah(
                  saprodiTransactions
                    .filter(t => t.tipe === 'Penjualan')
                    .reduce((sum, t) => sum + t.totalBiaya, 0)
                )}
              </div>
              <div className="text-[11px] text-purple-700 mt-0.5">
                Omzet penjualan sarana produksi
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-semibold flex items-center justify-between">
                <span>Ketentuan Dana Taktis (10%)</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">Otomatis</span>
              </div>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                {formatRupiah(
                  saprodiTransactions.filter(t => t.tipe === 'Penjualan').length > 0
                    ? saprodiTransactions
                        .filter(t => t.tipe === 'Penjualan')
                        .reduce((sum, t) => sum + (t.danaTaktis || 0), 0)
                    : stats.danaTaktisSaprodi10Persen
                )}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">
                Dipotong 10% dari laba kotor saprodi
              </div>
            </div>
          </div>

          {/* Pemesanan Barang Saprodi: Kalkulator Harga Beli, Margin, dan Harga Jual Rekomendasi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-blue-600" />
              Kalkulator Pemesanan & Rekomendasi Harga Jual Saprodi
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Saat menginput pesanan barang (misalnya Pupuk), sistem secara otomatis menampilkan rincian Harga Beli, Margin, dan Harga Jual yang disarankan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Pilih Item Barang</label>
                <select
                  value={orderBarangId}
                  onChange={e => {
                    const id = e.target.value;
                    setOrderBarangId(id);
                    const item = saprodiItems.find(i => i.id === id);
                    if (item) {
                      setOrderModalCustom(item.hargaBeli);
                      setOrderMarginPersenCustom(item.marginPersen || 10);
                    }
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="">-- Pilih Barang Toko --</option>
                  {saprodiItems.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.namaBarang} (Stok: {i.stok} {i.satuan})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Jumlah Pemesanan (Qty)</label>
                <input
                  type="number"
                  min="1"
                  value={orderJumlah}
                  onChange={e => setOrderJumlah(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Harga Beli / Modal (Rp)</label>
                <input
                  type="number"
                  value={orderModalCustom}
                  onChange={e => setOrderModalCustom(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Margin Keuntungan (%)</label>
                <input
                  type="number"
                  value={orderMarginPersenCustom}
                  onChange={e => setOrderMarginPersenCustom(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>
            </div>

            {/* Live calculation results */}
            {orderModalCustom > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs flex-1">
                  <div>
                    <span className="text-slate-500 block">Total Modal Pembelian:</span>
                    <span className="text-sm font-bold text-slate-900">
                      {formatRupiah(orderModalCustom * orderJumlah)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Margin per Satuan:</span>
                    <span className="text-sm font-bold text-emerald-700">
                      +{formatRupiah(Math.round(orderModalCustom * (orderMarginPersenCustom / 100)))}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Harga Jual Disarankan:</span>
                    <span className="text-sm font-bold text-blue-800">
                      {formatRupiah(Math.round(orderModalCustom * (1 + orderMarginPersenCustom / 100)))}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Potongan Dana Taktis 10%:</span>
                    <span className="text-sm font-bold text-amber-700">
                      {formatRupiah(Math.round((orderModalCustom * (orderMarginPersenCustom / 100) * orderJumlah) * 0.1))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const item = saprodiItems.find(i => i.id === orderBarangId);
                      setSaprodiTrxInitialType('Pembelian');
                      setSaprodiTrxPreselectedItem(item || null);
                      setShowSaprodiTrxModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-colors"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    <span>Input Restock Ini</span>
                  </button>
                  <button
                    onClick={() => {
                      const item = saprodiItems.find(i => i.id === orderBarangId);
                      setSaprodiTrxInitialType('Penjualan');
                      setSaprodiTrxPreselectedItem(item || null);
                      setShowSaprodiTrxModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs whitespace-nowrap transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Kasir Jual Ini</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Transaksi Jual Beli Barang Saprodi */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-emerald-600" />
                  <span>Riwayat Transaksi Jual Beli Saprodi</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {filteredSaprodiTrx.length} Transaksi
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Catatan real-time penjualan ke petani/umum serta restock distributor, terintegrasi ke kas dan stok.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari barang, pihak, kode..."
                    value={saprodiTrxSearch}
                    onChange={e => setSaprodiTrxSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/60 focus:bg-white focus:ring-1 focus:ring-emerald-500 w-48 sm:w-56"
                  />
                </div>

                {/* Export Excel */}
                <button
                  onClick={() => {
                    const data = filteredSaprodiTrx.map(t => ({
                      'Kode Transaksi': t.kodeTransaksi,
                      'Tanggal': t.tanggal,
                      'Jenis Transaksi': t.tipe,
                      'Kode Barang': t.kodeBarang,
                      'Nama Barang': t.namaBarang,
                      'Kategori': t.kategoriBarang,
                      'Jumlah (Qty)': t.jumlah,
                      'Satuan': t.satuan,
                      'Harga Satuan': t.hargaSatuan,
                      'Total Biaya': t.totalBiaya,
                      'Pihak Terkait': t.namaPihak,
                      'Tipe Pihak': t.tipePihak,
                      'No. HP / WA': t.noHp || '-',
                      'Metode Pembayaran': t.metodePembayaran,
                      'Margin (Laba)': t.margin || 0,
                      'Dana Taktis 10%': t.danaTaktis || 0,
                      'Catatan': t.catatan || '-'
                    }));
                    exportToExcel(data, 'Transaksi_Saprodi_Mitra_Tani');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                  title="Export Transaksi ke Excel"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                {/* Export PDF */}
                <button
                  onClick={() => {
                    const headers = ['Kode', 'Tgl', 'Tipe', 'Barang', 'Qty', 'Pihak', 'Total', 'Metode', 'Margin'];
                    const rows = filteredSaprodiTrx.map(t => [
                      t.kodeTransaksi,
                      t.tanggal,
                      t.tipe,
                      t.namaBarang,
                      `${t.jumlah} ${t.satuan}`,
                      t.namaPihak,
                      formatRupiah(t.totalBiaya),
                      t.metodePembayaran,
                      t.margin !== undefined ? formatRupiah(t.margin) : '-'
                    ]);
                    exportToPdf('LAPORAN TRANSAKSI JUAL BELI TOKO SAPRODI', headers, rows, 'Laporan_Transaksi_Saprodi');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                  title="Cetak Laporan Transaksi PDF"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>PDF</span>
                </button>

                {/* New Transaction Button */}
                <button
                  id="btn-tambah-transaksi-saprodi-table"
                  onClick={() => {
                    setSaprodiTrxInitialType('Penjualan');
                    setSaprodiTrxPreselectedItem(null);
                    setShowSaprodiTrxModal(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Transaksi</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mt-3 text-xs overflow-x-auto pb-1">
              <button
                onClick={() => setSaprodiTrxFilter('Semua')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                  saprodiTrxFilter === 'Semua'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({saprodiTransactions.length})
              </button>
              <button
                onClick={() => setSaprodiTrxFilter('Penjualan')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  saprodiTrxFilter === 'Penjualan'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Penjualan ({saprodiTransactions.filter(t => t.tipe === 'Penjualan').length})</span>
              </button>
              <button
                onClick={() => setSaprodiTrxFilter('Pembelian')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  saprodiTrxFilter === 'Pembelian'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>Pembelian / Restock ({saprodiTransactions.filter(t => t.tipe === 'Pembelian').length})</span>
              </button>
            </div>

            {/* Transaction List Table */}
            <div className="overflow-x-auto mt-3">
              {filteredSaprodiTrx.length === 0 ? (
                <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                  <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">Belum ada transaksi jual beli yang cocok</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {saprodiTrxSearch ? 'Coba ubah kata kunci pencarian Anda.' : 'Mulai catat transaksi penjualan ke petani atau restock dari supplier.'}
                  </p>
                  <button
                    onClick={() => {
                      setSaprodiTrxInitialType('Penjualan');
                      setShowSaprodiTrxModal(true);
                    }}
                    className="mt-3 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Catat Transaksi Pertama</span>
                  </button>
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2">No. Transaksi</th>
                      <th className="pb-2">Tanggal</th>
                      <th className="pb-2">Jenis</th>
                      <th className="pb-2">Barang & Qty</th>
                      <th className="pb-2">Pelanggan / Pemasok</th>
                      <th className="pb-2 text-right">Total Biaya</th>
                      <th className="pb-2">Metode Bayar</th>
                      <th className="pb-2 text-right">Margin Toko</th>
                      <th className="pb-2 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSaprodiTrx.map(trx => {
                      const isSale = trx.tipe === 'Penjualan';
                      return (
                        <tr key={trx.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-2.5 font-mono font-bold text-slate-800">
                            {trx.kodeTransaksi}
                          </td>
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">
                            {formatTanggalIndo(trx.tanggal)}
                          </td>
                          <td className="py-2.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSale ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isSale ? <ArrowUpRight className="w-3 h-3 text-emerald-600" /> : <ArrowDownRight className="w-3 h-3 text-blue-600" />}
                              <span>{trx.tipe}</span>
                            </span>
                          </td>
                          <td className="py-2.5">
                            <div className="font-bold text-slate-900">{trx.namaBarang}</div>
                            <div className="text-[10px] text-slate-500">
                              <span className="font-semibold text-slate-800">{formatAngka(trx.jumlah)} {trx.satuan}</span> x {formatRupiah(trx.hargaSatuan)}
                            </div>
                          </td>
                          <td className="py-2.5">
                            <div className="font-bold text-slate-800">{trx.namaPihak}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                                trx.tipePihak === 'Anggota'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : trx.tipePihak === 'Non-Anggota'
                                  ? 'bg-slate-100 text-slate-600'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}>
                                {trx.tipePihak}
                              </span>
                              {trx.noHp && (
                                <span className="text-[9px] text-slate-400">• {trx.noHp}</span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 text-right font-bold text-slate-900 whitespace-nowrap">
                            {formatRupiah(trx.totalBiaya)}
                          </td>
                          <td className="py-2.5 text-slate-600 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-700">
                              {trx.metodePembayaran}
                            </span>
                          </td>
                          <td className="py-2.5 text-right whitespace-nowrap">
                            {isSale && trx.margin !== undefined ? (
                              <div>
                                <span className="font-bold text-emerald-700">
                                  +{formatRupiah(trx.margin)}
                                </span>
                                {trx.danaTaktis !== undefined && (
                                  <span className="block text-[9px] text-amber-700">
                                    Taktis: {formatRupiah(trx.danaTaktis)}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-2.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setActiveSaprodiNota(trx)}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1 transition-colors"
                                title="Lihat Struk Nota & Bagikan ke WhatsApp"
                              >
                                <Share2 className="w-3 h-3" />
                                <span>Nota WA</span>
                              </button>
                              <button
                                onClick={() => setDeleteSaprodiTrxItem(trx)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                title="Hapus Catatan Transaksi Ini"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Daftar Barang Saprodi & Stok */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Store className="w-4 h-4 text-blue-600" />
                  Daftar Barang & Harga Harian Toko Saprodi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Margin keuntungan dihitung secara otomatis oleh sistem.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const data = saprodiItems.map(i => ({
                      'Kode Barang': i.kodeBarang,
                      'Nama Barang': i.namaBarang,
                      'Kategori': i.kategori,
                      'Satuan': i.satuan,
                      'Stok': i.stok,
                      'Batas Min': i.stokMinimal,
                      'Harga Beli': i.hargaBeli,
                      'Harga Jual': i.hargaJual,
                      'Margin (Rp)': i.margin,
                      'Margin (%)': `${i.marginPersen}%`,
                      'Update': i.tanggalUpdate
                    }));
                    exportToExcel(data, 'Katalog_Barang_Saprodi_Mitra_Tani');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Excel</span>
                </button>

                <button
                  onClick={() => {
                    const headers = ['Kode', 'Nama Barang', 'Kategori', 'Stok', 'Harga Beli', 'Harga Jual', 'Margin', 'Update'];
                    const rows = saprodiItems.map(i => [
                      i.kodeBarang,
                      i.namaBarang,
                      i.kategori,
                      `${i.stok} ${i.satuan}`,
                      formatRupiah(i.hargaBeli),
                      formatRupiah(i.hargaJual),
                      `${formatRupiah(i.margin)} (${i.marginPersen}%)`,
                      i.tanggalUpdate
                    ]);
                    exportToPdf('KATALOG BARANG & HARGA HARIAN SAPRODI', headers, rows, 'Katalog_Saprodi');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>PDF</span>
                </button>

                <button
                  id="btn-tambah-barang-saprodi"
                  onClick={() => setShowAddSaprodiModal(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Barang</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Kode</th>
                    <th className="pb-2">Nama Barang & Kategori</th>
                    <th className="pb-2 text-center">Stok</th>
                    <th className="pb-2 text-right">Harga Beli (Modal)</th>
                    <th className="pb-2 text-right">Harga Jual</th>
                    <th className="pb-2 text-right">Margin Otomatis</th>
                    <th className="pb-2 text-center">Status Stok</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {saprodiItems.map(item => {
                    const isLowStock = item.stok <= item.stokMinimal;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 font-mono font-bold text-blue-700">{item.kodeBarang}</td>
                        <td className="py-2.5">
                          <div className="font-bold text-slate-900">{item.namaBarang}</div>
                          <span className="text-[10px] text-slate-400">{item.kategori} • {item.satuan}</span>
                        </td>
                        <td className="py-2.5 text-center font-bold text-slate-800">
                          {item.stok} {item.satuan}
                        </td>
                        <td className="py-2.5 text-right font-medium text-slate-600">
                          {formatRupiah(item.hargaBeli)}
                        </td>
                        <td className="py-2.5 text-right font-bold text-slate-900">
                          {formatRupiah(item.hargaJual)}
                        </td>
                        <td className="py-2.5 text-right font-semibold text-emerald-700">
                          +{formatRupiah(item.margin)}
                          <span className="block text-[9px] text-emerald-600 font-normal">
                            ({item.marginPersen}%)
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          {isLowStock ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                              Stok Menipis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Aman
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-center whitespace-nowrap">
                          {!isMemberMode ? (
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => {
                                  setSaprodiTrxInitialType('Penjualan');
                                  setSaprodiTrxPreselectedItem(item);
                                  setShowSaprodiTrxModal(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Catat Penjualan Barang Ini"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                <span>Jual</span>
                              </button>
                              <button
                                onClick={() => {
                                  setSaprodiTrxInitialType('Pembelian');
                                  setSaprodiTrxPreselectedItem(item);
                                  setShowSaprodiTrxModal(true);
                                }}
                                className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Restock / Pembelian Barang Ini"
                              >
                                <PackagePlus className="w-3 h-3" />
                                <span>Beli</span>
                              </button>
                              <button
                                id={`btn-edit-saprodi-${item.id}`}
                                onClick={() => setEditingSaprodiItem(item)}
                                className="px-2 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit Barang & Penetapan Harga"
                              >
                                <Edit2 className="w-3 h-3" />
                                <span>Edit</span>
                              </button>
                              <button
                                id={`btn-delete-saprodi-${item.id}`}
                                onClick={() => setDeleteSaprodiItem(item)}
                                className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Hapus Barang Saprodi"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Katalog Toko
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tabel Arus Kas Saprodi: Terpisah Pemasukan & Pengeluaran */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pemasukan Saprodi */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-emerald-900 flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                  Arus Kas: Pemasukan Saprodi (Penjualan)
                </h3>
                <span className="text-[11px] font-bold text-emerald-700">
                  {formatRupiah(
                    saprodiCashflow
                      .filter(c => c.tipe === 'Pemasukan')
                      .reduce((sum, c) => sum + c.jumlah, 0)
                  )}
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-3 max-h-56 overflow-y-auto">
                {saprodiCashflow.filter(c => c.tipe === 'Pemasukan').map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{c.keterangan}</div>
                      <div className="text-[10px] text-slate-400">{c.tanggal} • Ref: {c.referensi || '-'}</div>
                    </div>
                    <div className="font-bold text-emerald-700">+{formatRupiah(c.jumlah)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pengeluaran Saprodi & Dana Taktis 10% */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-red-900 flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-red-600" />
                  Arus Kas: Pengeluaran Saprodi & Dana Taktis 10%
                </h3>
                <span className="text-[11px] font-bold text-red-700">
                  {formatRupiah(
                    saprodiCashflow
                      .filter(c => c.tipe === 'Pengeluaran')
                      .reduce((sum, c) => sum + c.jumlah, 0)
                  )}
                </span>
              </div>

              <div className="divide-y divide-slate-100 mt-3 max-h-56 overflow-y-auto">
                {saprodiCashflow.filter(c => c.tipe === 'Pengeluaran').map(c => (
                  <div key={c.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{c.keterangan}</div>
                      <div className="text-[10px] text-slate-400">{c.tanggal} • {c.kategori}</div>
                    </div>
                    <div className="font-bold text-red-700">-{formatRupiah(c.jumlah)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SEWA ALSINTAN SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'alsintan' && (
        <div className="space-y-6">
          {/* Top Banner & Action */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Tractor className="w-5 h-5 text-amber-600" />
                Unit Sewa Alsintan (Alat & Mesin Pertanian)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Mekanisasi olah tanah, irigasi, dan pasca panen bagi anggota kelompok tani.
              </p>
            </div>

            {!isMemberMode ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddAlsintanModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Alat Baru</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Katalog & Tarif Alsintan</span>
              </div>
            )}
          </div>

          {/* Form Sewa Baru & Katalog Mesin */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Input Sewa (1 col) - Khusus Pengurus */}
            {!isMemberMode && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-amber-600" />
                  Input Penyewaan Alsintan
                </h4>

                <form onSubmit={handleAddSewa} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Pilih Alat Mesin *</label>
                    <select
                      value={sewaAlatId}
                      onChange={e => setSewaAlatId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="">-- Pilih Alsintan --</option>
                      {alsintanItems.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.namaAlat} (Tarif: {formatRupiah(a.hargaSewaHari)}/hari)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Penyewa (Anggota) *</label>
                    <select
                      value={sewaAnggotaId}
                      onChange={e => setSewaAnggotaId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      {anggotaList.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.nomorAnggota} - {a.nama}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Durasi</label>
                      <input
                        type="number"
                        min="1"
                        value={sewaDurasi}
                        onChange={e => setSewaDurasi(Number(e.target.value))}
                        className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Satuan</label>
                      <select
                        value={sewaSatuan}
                        onChange={e => setSewaSatuan(e.target.value as any)}
                        className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Hari">Hari</option>
                        <option value="Jam">Jam</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shadow-xs mt-2 cursor-pointer"
                  >
                    Catat Penyewaan
                  </button>
                </form>
              </div>
            )}

            {/* List Alat Mesin Tersedia */}
            <div className={`${isMemberMode ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white rounded-2xl border border-slate-200 p-5 shadow-xs`}>
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Inventaris Mesin & Tarif Sewa
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Total {alsintanItems.length} unit mesin & alat pertanian siap kerja
                  </p>
                </div>

                {!isMemberMode && (
                  <button
                    id="btn-tambah-alsintan-baru"
                    onClick={() => setShowAddAlsintanModal(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Mesin</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {alsintanItems.map(item => (
                  <div key={item.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col justify-between hover:border-amber-300 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-200 text-slate-700 inline-block mb-1">
                            {item.kodeAlat}
                          </span>
                          <h5 className="font-bold text-slate-900 leading-snug">{item.namaAlat}</h5>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                          item.status === 'Tersedia'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Disewa'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        <div><strong className="text-slate-700">Jenis:</strong> {item.jenis}</div>
                        <div><strong className="text-slate-700">Kondisi:</strong> {item.kondisi}</div>
                        <div className="truncate"><strong className="text-slate-700">Lokasi:</strong> {item.lokasi}</div>
                      </div>
                    </div>

                    <div className="pt-2.5 mt-2.5 border-t border-slate-200">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block leading-tight">Tarif Harian</span>
                          <span className="font-bold text-amber-700">{formatRupiah(item.hargaSewaHari)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block leading-tight">Tarif Per Jam</span>
                          <span className="font-semibold text-slate-700">{formatRupiah(item.hargaSewaJam)}</span>
                        </div>
                      </div>

                      {/* Action buttons: Edit & Hapus (Khusus Pengurus) */}
                      {!isMemberMode && (
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            id={`btn-edit-alsintan-${item.id}`}
                            onClick={() => setEditingAlsintanItem(item)}
                            className="flex-1 py-1.5 px-2 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-amber-900 font-semibold text-[11px] flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3 text-amber-600" />
                            <span>Edit Mesin & Tarif</span>
                          </button>
                          <button
                            id={`btn-delete-alsintan-${item.id}`}
                            onClick={() => setDeleteAlsintanItem(item)}
                            className="p-1.5 rounded-lg bg-white hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-400 hover:text-red-600 transition-colors shadow-2xs cursor-pointer"
                            title="Hapus Unit Alsintan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Rekapitulasi Sewa Alsintan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Rekapitulasi Riwayat Sewa Alsintan
                </h4>
                <p className="text-[11px] text-slate-500">Total Pendapatan Sewa: <strong>{formatRupiah(stats.pendapatanSewaAlsintan)}</strong></p>
              </div>

              <button
                onClick={() => {
                  const data = alsintanRentals.map(r => ({
                    'Kode Sewa': r.kodeSewa,
                    'Tanggal': r.tanggal,
                    'Alat Mesin': r.namaAlat,
                    'Penyewa': r.namaPenyewa,
                    'Kontak': r.kontak,
                    'Durasi': `${r.durasi} ${r.satuanDurasi}`,
                    'Total Biaya': r.totalBiaya,
                    'Status': r.status
                  }));
                  exportToExcel(data, 'Laporan_Sewa_Alsintan');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export Rekap</span>
              </button>
            </div>

            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                    <th className="pb-2">Kode & Tanggal</th>
                    <th className="pb-2">Nama Alat</th>
                    <th className="pb-2">Penyewa</th>
                    <th className="pb-2 text-center">Durasi</th>
                    <th className="pb-2 text-right">Total Biaya</th>
                    <th className="pb-2 text-center">Status</th>
                    <th className="pb-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alsintanRentals.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50/70">
                      <td className="py-2 font-mono">
                        <div className="font-bold text-slate-900">{r.kodeSewa}</div>
                        <div className="text-[10px] text-slate-400">{r.tanggal}</div>
                      </td>
                      <td className="py-2 font-medium text-slate-800">{r.namaAlat}</td>
                      <td className="py-2 text-slate-700">{r.namaPenyewa}</td>
                      <td className="py-2 text-center">{r.durasi} {r.satuanDurasi}</td>
                      <td className="py-2 text-right font-bold text-amber-700">{formatRupiah(r.totalBiaya)}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        {r.status === 'Aktif' && !isMemberMode ? (
                          <button
                            onClick={() => selesaikanSewaAlsintan(r.id)}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-emerald-50 text-emerald-700 text-[10px] font-bold cursor-pointer"
                          >
                            Kembalikan
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px]">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. LAYANAN BRILINK SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'brilink' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Transaksi Brilink (Khusus Pengurus) */}
            {!isMemberMode && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <Banknote className="w-4 h-4 text-sky-600" />
                  Input Transaksi Loket Brilink
                </h3>

                <form onSubmit={handleAddBrilink} className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Jenis Transaksi</label>
                    <select
                      value={brilinkTipe}
                      onChange={e => setBrilinkTipe(e.target.value as any)}
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Tarik Tunai">Tarik Tunai Bank</option>
                      <option value="Transfer Bank">Transfer Antar Bank</option>
                      <option value="Top-Up E-Wallet">Top-Up DANA / OVO / GoPay</option>
                      <option value="PLN / Token">PLN Token & Tagihan Listrik</option>
                      <option value="Pulsa & Paket Data">Pulsa Seluler</option>
                      <option value="BPJS & Lainnya">Iuran BPJS Kesehatan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nominal Transaksi (Rp)</label>
                    <input
                      type="number"
                      value={brilinkNominal}
                      onChange={e => setBrilinkNominal(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Fee Admin Koperasi (Rp)</label>
                    <input
                      type="number"
                      value={brilinkFee}
                      onChange={e => setBrilinkFee(Number(e.target.value))}
                      className="w-full p-2 rounded-lg border border-slate-200 font-bold text-sky-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Nasabah / Petani</label>
                    <input
                      type="text"
                      value={brilinkNasabah}
                      onChange={e => setBrilinkNasabah(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nomor Rekening / ID Pelanggan</label>
                    <input
                      type="text"
                      value={brilinkTujuan}
                      onChange={e => setBrilinkTujuan(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    Simpan Transaksi Loket
                  </button>
                </form>
              </div>
            )}

            {/* Riwayat Transaksi Brilink */}
            <div className={`${isMemberMode ? 'lg:col-span-3' : 'lg:col-span-2'} bg-white rounded-2xl border border-slate-200 p-5 shadow-xs`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Riwayat Transaksi & Akumulasi Fee Loket
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Total Pendapatan Fee: <strong className="text-sky-700">{formatRupiah(stats.pendapatanFeeBrilink)}</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    const data = brilinkList.map(b => ({
                      'Kode': b.kodeTransaksi,
                      'Waktu': b.tanggal,
                      'Tipe': b.tipe,
                      'Nasabah': b.namaNasabah,
                      'Nominal': b.nominal,
                      'Fee Admin': b.feeAdmin,
                      'Status': b.status
                    }));
                    exportToExcel(data, 'Rekap_Brilink_Mitra_Tani');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export Excel</span>
                </button>
              </div>

              <div className="overflow-x-auto mt-3">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                      <th className="pb-2">Waktu & Kode</th>
                      <th className="pb-2">Jenis Layanan</th>
                      <th className="pb-2">Nasabah</th>
                      <th className="pb-2 text-right">Nominal</th>
                      <th className="pb-2 text-right">Fee Admin</th>
                      <th className="pb-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brilinkList.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 font-mono">
                          <div className="font-bold text-slate-900">{b.kodeTransaksi}</div>
                          <div className="text-[10px] text-slate-400">{b.tanggal}</div>
                        </td>
                        <td className="py-2.5 font-medium text-slate-800">{b.tipe}</td>
                        <td className="py-2.5 text-slate-700">{b.namaNasabah}</td>
                        <td className="py-2.5 text-right font-semibold text-slate-900">{formatRupiah(b.nominal)}</td>
                        <td className="py-2.5 text-right font-bold text-sky-700">+{formatRupiah(b.feeAdmin)}</td>
                        <td className="py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. SIMPAN PINJAM SUBTAB */}
      {/* ========================================================================= */}
      {activeSubTab === 'simpan-pinjam' && (
        <div className="space-y-6">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200">
              <div className="text-xs text-indigo-800 font-semibold">Total Seluruh Simpanan</div>
              <div className="text-xl font-bold text-indigo-950 mt-1">
                {formatRupiah(stats.totalAkumulasiSimpanan)}
              </div>
              <div className="text-[11px] text-indigo-700 mt-0.5">Dari 93 Anggota Terdaftar</div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs text-amber-800 font-semibold">Total Pinjaman Berjalan</div>
              <div className="text-xl font-bold text-amber-950 mt-1">
                {formatRupiah(stats.totalPinjamanBerjalan)}
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5">Akad aktif produktif tani</div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs text-emerald-800 font-semibold">Pendapatan Jasa Pinjaman (1%)</div>
              <div className="text-xl font-bold text-emerald-950 mt-1">
                {formatRupiah(stats.pendapatanJasaPinjaman)}
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5">Bagi hasil jasa koperasi</div>
            </div>
          </div>

          {/* Form Pengajuan Pinjaman dengan Validasi Otomatis Max 2x Total Simpanan */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-600" />
                Formulir Pengajuan Pinjaman Baru (Validasi Plafon Otomatis 2x)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sistem menolak otomatis pengajuan yang melebihi 2x dari total simpanan anggota terkait.
              </p>
            </div>

            {pinjamAlert && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  pinjamAlert.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {pinjamAlert.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{pinjamAlert.message}</span>
              </div>
            )}

            <form onSubmit={handleAjukanPinjaman} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Pilih Anggota Pemohon * {isMemberMode && '(Akun Anda)'}
                  </label>
                  <select
                    id="select-pinjam-anggota"
                    disabled={isMemberMode}
                    value={pinjamAnggotaId}
                    onChange={e => setPinjamAnggotaId(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border border-slate-200 ${isMemberMode ? 'bg-slate-100 text-slate-700 font-semibold cursor-not-allowed' : 'bg-white'}`}
                  >
                    {anggotaList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nomorAnggota} - {a.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plafon Information Card */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block">Total Simpanan Anggota:</span>
                    <span className="font-bold text-slate-800">{formatRupiah(currentPinjamTotalSimpanan)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-700 font-semibold block">Plafon Maksimal (2x):</span>
                    <span className="text-sm font-bold text-blue-900">{formatRupiah(currentPinjamPlafon)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jumlah Pengajuan (Rp) *
                    <span className="text-[10px] text-emerald-600 font-normal ml-1">(Bebas tanpa minimal)</span>
                  </label>
                  <input
                    id="input-pinjam-jumlah"
                    type="number"
                    min="1"
                    value={pinjamJumlah}
                    onChange={e => setPinjamJumlah(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                  {pinjamJumlah > currentPinjamPlafon && (
                    <span className="text-[10px] text-red-600 font-bold block mt-1">
                      ⚠️ Melebihi batas plafon (Maksimal: {formatRupiah(currentPinjamPlafon)})
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tenor (Bulan)</label>
                  <select
                    value={pinjamTenor}
                    onChange={e => setPinjamTenor(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan</option>
                    <option value={10}>10 Bulan</option>
                    <option value={12}>12 Bulan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Keperluan Pinjaman</label>
                  <input
                    type="text"
                    value={pinjamTujuan}
                    onChange={e => setPinjamTujuan(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                    placeholder="Contoh: Beli pupuk musim tanam"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  id="btn-ajukan-pinjaman"
                  type="submit"
                  disabled={pinjamJumlah > currentPinjamPlafon}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  Ajukan Pinjaman untuk Verifikasi Pengurus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Nota Share Modal */}
      {activeNota && (
        <NotaModal
          panen={activeNota}
          anggota={anggotaList.find(a => a.id === activeNota.anggotaId)}
          onClose={() => setActiveNota(null)}
        />
      )}

      {/* Modal Tambah Alsintan Baru */}
      <AlsintanEditModal
        isOpen={showAddAlsintanModal}
        onClose={() => setShowAddAlsintanModal(false)}
        onSave={(data) => {
          tambahAlsintan(data);
        }}
      />

      {/* Modal Edit Alsintan & Tarif Sewa */}
      <AlsintanEditModal
        isOpen={!!editingAlsintanItem}
        itemToEdit={editingAlsintanItem}
        onClose={() => setEditingAlsintanItem(null)}
        onSave={(data) => {
          if (editingAlsintanItem) {
            updateAlsintan(editingAlsintanItem.id, data);
            setEditingAlsintanItem(null);
          }
        }}
      />

      {/* Modal Konfirmasi Hapus Alsintan */}
      <DeleteConfirmModal
        isOpen={!!deleteAlsintanItem}
        title="Hapus Unit Alsintan"
        itemName={deleteAlsintanItem?.namaAlat || ''}
        itemDetail={`Kode: ${deleteAlsintanItem?.kodeAlat || ''} • Tarif: ${formatRupiah(deleteAlsintanItem?.hargaSewaHari || 0)}/hari • Status: ${deleteAlsintanItem?.status || ''}`}
        onClose={() => setDeleteAlsintanItem(null)}
        onConfirm={() => {
          if (deleteAlsintanItem) {
            hapusAlsintan(deleteAlsintanItem.id);
            setDeleteAlsintanItem(null);
          }
        }}
        confirmLabel="Ya, Hapus Alsintan"
      />

      {/* Modal Tambah Barang Saprodi Baru */}
      <SaprodiEditModal
        isOpen={showAddSaprodiModal}
        onClose={() => setShowAddSaprodiModal(false)}
        onSave={(data) => {
          tambahBarangSaprodi(data);
        }}
      />

      {/* Modal Edit Barang Saprodi, Stok & Penetapan Harga */}
      <SaprodiEditModal
        isOpen={!!editingSaprodiItem}
        itemToEdit={editingSaprodiItem}
        onClose={() => setEditingSaprodiItem(null)}
        onSave={(data) => {
          if (editingSaprodiItem) {
            updateBarangSaprodi(editingSaprodiItem.id, data);
            setEditingSaprodiItem(null);
          }
        }}
      />

      {/* Modal Konfirmasi Hapus Barang Saprodi */}
      <DeleteConfirmModal
        isOpen={!!deleteSaprodiItem}
        title="Hapus Barang Saprodi"
        itemName={deleteSaprodiItem?.namaBarang || ''}
        itemDetail={`Kode: ${deleteSaprodiItem?.kodeBarang || ''} • Kategori: ${deleteSaprodiItem?.kategori || ''} • Stok Tersedia: ${deleteSaprodiItem?.stok || 0} ${deleteSaprodiItem?.satuan || ''}`}
        onClose={() => setDeleteSaprodiItem(null)}
        onConfirm={() => {
          if (deleteSaprodiItem) {
            hapusBarangSaprodi(deleteSaprodiItem.id);
            setDeleteSaprodiItem(null);
          }
        }}
        confirmLabel="Ya, Hapus Barang"
      />

      {/* Modal Input Transaksi Jual Beli Saprodi */}
      <SaprodiTransaksiModal
        isOpen={showSaprodiTrxModal}
        initialType={saprodiTrxInitialType}
        preselectedItem={saprodiTrxPreselectedItem}
        onClose={() => {
          setShowSaprodiTrxModal(false);
          setSaprodiTrxPreselectedItem(null);
        }}
        onSuccess={(trx) => {
          setActiveSaprodiNota(trx);
        }}
      />

      {/* Modal Nota Digital & WhatsApp Saprodi */}
      <SaprodiNotaModal
        transaction={activeSaprodiNota}
        onClose={() => setActiveSaprodiNota(null)}
      />

      {/* Modal Konfirmasi Hapus Transaksi Saprodi */}
      <DeleteConfirmModal
        isOpen={!!deleteSaprodiTrxItem}
        title="Hapus Transaksi Saprodi"
        itemName={deleteSaprodiTrxItem?.kodeTransaksi || ''}
        itemDetail={`${deleteSaprodiTrxItem?.tipe || ''}: ${deleteSaprodiTrxItem?.namaBarang || ''} (${deleteSaprodiTrxItem?.jumlah || 0} ${deleteSaprodiTrxItem?.satuan || ''}) • ${deleteSaprodiTrxItem?.namaPihak || ''} • Total: ${formatRupiah(deleteSaprodiTrxItem?.totalBiaya || 0)}`}
        onClose={() => setDeleteSaprodiTrxItem(null)}
        onConfirm={() => {
          if (deleteSaprodiTrxItem) {
            hapusTransaksiSaprodi(deleteSaprodiTrxItem.id);
            setDeleteSaprodiTrxItem(null);
          }
        }}
        confirmLabel="Ya, Hapus Transaksi"
      />
    </div>
  );
};
