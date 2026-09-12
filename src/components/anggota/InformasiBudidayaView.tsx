import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Share2,
  Camera,
  Upload,
  Calendar,
  MapPin,
  Maximize2,
  FileSpreadsheet,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Edit2,
  Sparkles,
  BookOpen,
  Send,
  X,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useKoperasi } from '../../context/KoperasiContext';
import { BudidayaReport, TahapAktivitasBudidaya } from '../../types/koperasi';
import { exportToExcel, exportToPdf, formatAngka } from '../../utils/exportUtils';

const TAHAP_OPTIONS: TahapAktivitasBudidaya[] = [
  'Tahap Pengolahan Lahan & Bedengan',
  'Tahap Penanaman Bibit',
  'Tahap Vegetatif (Pemupukan & Perawatan Rutin)',
  'Tahap Generatif (Pembungaan & Pembuahan)',
  'Tahap Panen Berjalan',
  'Tahap Produksi Akhir / Pasca Panen'
];

const KOMODITAS_OPTIONS = [
  'Cabai Merah Keriting',
  'Cabai Rawit Merah',
  'Tomat',
  'Bawang Daun',
  'Buncis',
  'Terong',
  'Kubis / Kol',
  'Jagung Manis',
  'Pakcoy',
  'Pare',
  'Sawi',
  'Kembang Kol',
  'Selada',
  'Wortel',
  'Mentimun'
];

const STAGE_COLORS: Partial<Record<TahapAktivitasBudidaya, { bg: string; text: string; border: string }>> = {
  'Tahap Pengolahan Lahan': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Tahap Pengolahan Lahan & Bedengan': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Tahap Penanaman': { bg: 'bg-lime-50', text: 'text-lime-800', border: 'border-lime-200' },
  'Tahap Penanaman Bibit': { bg: 'bg-lime-50', text: 'text-lime-800', border: 'border-lime-200' },
  'Tahap Vegetatif (Pertumbuhan)': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Tahap Vegetatif (Pemupukan & Perawatan Rutin)': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'Tahap Generatif (Pembuahan)': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'Tahap Generatif (Pembungaan & Pembuahan)': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'Tahap Panen (Usia Produktif)': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Tahap Panen Berjalan': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Tahap Produksi Akhir': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' },
  'Tahap Produksi Akhir / Pasca Panen': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200' }
};

export const InformasiBudidayaView: React.FC = () => {
  const {
    budidayaReports,
    tambahLaporanBudidaya,
    updateLaporanBudidaya,
    hapusLaporanBudidaya,
    bagikanFormBudidaya,
    anggotaList,
    authType,
    activeAnggota
  } = useKoperasi();

  const isMemberMode = authType === 'anggota' && !!activeAnggota;

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedReportDetail, setSelectedReportDetail] = useState<BudidayaReport | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTahap, setFilterTahap] = useState<string>('Semua');
  const [filterKomoditas, setFilterKomoditas] = useState<string>('Semua');

  // Input form data
  const [formAnggotaId, setFormAnggotaId] = useState<string>(
    isMemberMode ? activeAnggota.id : (anggotaList[0]?.id || '')
  );
  const [formAlamatLahan, setFormAlamatLahan] = useState<string>(
    isMemberMode ? activeAnggota.alamat : 'Blok Pasir Bedengan RT 02/03'
  );
  const [formLuasLahan, setFormLuasLahan] = useState<number>(
    isMemberMode ? (activeAnggota.luasLahan || 50) : 50
  );
  const [formSatuanLuas, setFormSatuanLuas] = useState<'Bata' | 'Hektar' | 'm²'>('Bata');
  const [formJenisKomoditas, setFormJenisKomoditas] = useState<string>('Cabai Merah Keriting');
  const [formTahapAktivitas, setFormTahapAktivitas] = useState<TahapAktivitasBudidaya>(
    'Tahap Vegetatif (Pemupukan & Perawatan Rutin)'
  );
  const [formEstimasiPanenKg, setFormEstimasiPanenKg] = useState<number | ''>('');
  const [formEstimasiTanggalPanen, setFormEstimasiTanggalPanen] = useState<string>('');
  const [formBerbagiIlmu, setFormBerbagiIlmu] = useState<string>('');
  const [formFotoPreview, setFormFotoPreview] = useState<string>('');

  // Handle Photo Upload / Camera Capture
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormFotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetForm = () => {
    setFormAlamatLahan(isMemberMode ? activeAnggota.alamat : 'Blok Pasir Bedengan RT 02/03');
    setFormLuasLahan(isMemberMode ? (activeAnggota.luasLahan || 50) : 50);
    setFormSatuanLuas('Bata');
    setFormJenisKomoditas('Cabai Merah Keriting');
    setFormTahapAktivitas('Tahap Vegetatif (Pemupukan & Perawatan Rutin)');
    setFormEstimasiPanenKg('');
    setFormEstimasiTanggalPanen('');
    setFormBerbagiIlmu('');
    setFormFotoPreview('');
    setIsFormOpen(false);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMember = isMemberMode
      ? activeAnggota
      : anggotaList.find(a => a.id === formAnggotaId) || anggotaList[0];

    if (!selectedMember) return;

    // Default authentic agriculture photos if not provided
    const defaultPhotos = [
      'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1598170845058-32b9d6a5c317?w=800&auto=format&fit=crop&q=80'
    ];
    const photoUrl = formFotoPreview || defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];

    tambahLaporanBudidaya({
      anggotaId: selectedMember.id,
      namaPetani: selectedMember.nama,
      nomorAnggota: selectedMember.nomorAnggota,
      noHp: selectedMember.noHp,
      alamatLahan: formAlamatLahan,
      luasLahan: formLuasLahan,
      satuanLuas: formSatuanLuas,
      jenisKomoditas: formJenisKomoditas,
      tahapAktivitas: formTahapAktivitas,
      estimasiPanenKg: formEstimasiPanenKg ? Number(formEstimasiPanenKg) : undefined,
      estimasiTanggalPanen: formEstimasiTanggalPanen || undefined,
      berbagiIlmu: formBerbagiIlmu.trim() || 'Pertumbuhan tanaman subur, penyemprotan pupuk organik cair rutin setiap 4 hari sekali dan drainase bedengan terjaga baik.',
      fotoUrl: photoUrl
    });

    handleResetForm();
  };

  // Filter reports
  const visibleReports = budidayaReports.filter(report => {
    // Member mode restriction: only view their own reports
    if (isMemberMode && report.anggotaId !== activeAnggota.id) {
      return false;
    }

    const matchesSearch =
      report.namaPetani.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.alamatLahan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.jenisKomoditas.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.kodeLaporan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTahap = filterTahap === 'Semua' || report.tahapAktivitas === filterTahap;
    const matchesKomoditas = filterKomoditas === 'Semua' || report.jenisKomoditas === filterKomoditas;

    return matchesSearch && matchesTahap && matchesKomoditas;
  });

  // Calculate statistics
  const totalLaporan = isMemberMode
    ? budidayaReports.filter(r => r.anggotaId === activeAnggota.id).length
    : budidayaReports.length;

  const totalLuasBata = visibleReports.reduce((acc, r) => {
    if (r.satuanLuas === 'Bata') return acc + r.luasLahan;
    if (r.satuanLuas === 'Hektar') return acc + (r.luasLahan * 700); // 1 Ha ~ 700 Bata
    if (r.satuanLuas === 'm²') return acc + (r.luasLahan / 14); // 1 Bata = 14 m²
    return acc;
  }, 0);

  const totalPanenBerjalan = visibleReports.filter(r => r.tahapAktivitas === 'Tahap Panen Berjalan').length;
  const totalVegetatif = visibleReports.filter(r => r.tahapAktivitas === 'Tahap Vegetatif (Pemupukan & Perawatan Rutin)').length;

  const handleCopyShareLink = () => {
    const url = `${window.location.origin}?tab=keanggotaan&sub=budidaya`;
    navigator.clipboard?.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Informasi Perkembangan Budidaya Anggota</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {totalLaporan} Laporan
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isMemberMode
                  ? `Pantauan lahan garapan pribadi ${activeAnggota.nama}. Bagikan ilmu perawatan, foto tanaman, dan estimasi panen.`
                  : 'Monitoring kondisi lahan, komoditas sayuran, dan transfer ilmu budidaya dari 93 petani mitra Koperasi.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Admin "Bagikan Form Budidaya" Button */}
          {!isMemberMode && (
            <button
              id="btn-bagikan-form-budidaya"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              title="Bagikan formulir digital kepada 93 petani mitra"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Form Budidaya</span>
            </button>
          )}

          <button
            id="btn-tambah-laporan-budidaya"
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isMemberMode ? 'Laporkan Lahan Saya' : 'Input Laporan Budidaya'}</span>
          </button>

          <button
            onClick={() => {
              const data = visibleReports.map(r => ({
                'Kode Laporan': r.kodeLaporan,
                'Tanggal': r.tanggalLaporan,
                'Petani': r.namaPetani,
                'Nomor Anggota': r.nomorAnggota,
                'No. HP': r.noHp,
                'Alamat Lahan': r.alamatLahan,
                'Luas Lahan': `${r.luasLahan} ${r.satuanLuas}`,
                'Komoditas': r.jenisKomoditas,
                'Tahap Aktivitas': r.tahapAktivitas,
                'Estimasi Panen (Kg)': r.estimasiPanenKg || '-',
                'Estimasi Tanggal': r.estimasiTanggalPanen || '-',
                'Catatan Berbagi Ilmu': r.berbagiIlmu
              }));
              exportToExcel(data, `Laporan_Budidaya_Mitra_Tani_${visibleReports.length}`);
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Excel</span>
          </button>

          <button
            onClick={() => {
              const headers = ['Kode', 'Petani', 'Lokasi Lahan', 'Luas', 'Komoditas', 'Tahap Aktivitas', 'Catatan Perawatan'];
              const rows = visibleReports.map(r => [
                r.kodeLaporan,
                r.namaPetani,
                r.alamatLahan,
                `${r.luasLahan} ${r.satuanLuas}`,
                r.jenisKomoditas,
                r.tahapAktivitas,
                r.berbagiIlmu.slice(0, 60) + '...'
              ]);
              exportToPdf('LAPORAN PERKEMBANGAN BUDIDAYA PETANI', headers, rows, 'Laporan_Budidaya_Petani');
            }}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            {isMemberMode ? 'Laporan Anda' : 'Total Laporan Terdata'}
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalLaporan} <span className="text-xs font-normal text-slate-500">titik lahan</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Tersimpan aktif dalam database
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Estimasi Luas Lahan Terdata
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            ~{Math.round(totalLuasBata)} <span className="text-xs font-normal text-slate-500">Bata ({((totalLuasBata * 14) / 10000).toFixed(2)} Ha)</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            1 Bata = 14 m² standar pertanian Jawa Barat
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Tahap Panen Berjalan
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-1">
            {totalPanenBerjalan} <span className="text-xs font-normal text-slate-500">petik panen</span>
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">
            Siap tampung di Agribisnis Sayuran
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase">
            Tahap Vegetatif & Rawat
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {totalVegetatif} <span className="text-xs font-normal text-slate-500">lahan aktif</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Kebutuhan pupuk & saprodi aktif
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isMemberMode ? "Cari lokasi lahan atau komoditas Anda..." : "Cari nama petani, alamat lahan, komoditas..."}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500 font-medium">Tahap:</span>
          </div>
          <select
            value={filterTahap}
            onChange={e => setFilterTahap(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-hidden"
          >
            <option value="Semua">Semua Tahap</option>
            {TAHAP_OPTIONS.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filterKomoditas}
            onChange={e => setFilterKomoditas(e.target.value)}
            className="px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-hidden"
          >
            <option value="Semua">Semua Komoditas</option>
            {KOMODITAS_OPTIONS.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid of Budidaya Reports */}
      {visibleReports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Sprout className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Belum Ada Laporan Budidaya</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {isMemberMode
              ? 'Anda belum pernah mengirimkan laporan perkembangan lahan garapan. Klik tombol "Laporkan Lahan Saya" di atas untuk mengisi formulir.'
              : 'Tidak ada laporan yang sesuai dengan kriteria pencarian atau filter yang dipilih.'}
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Isi Laporan Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleReports.map(report => {
            const stageStyle = STAGE_COLORS[report.tahapAktivitas] || STAGE_COLORS['Tahap Vegetatif (Pemupukan & Perawatan Rutin)'];
            const isOwnReport = isMemberMode || (activeAnggota && report.anggotaId === activeAnggota.id);

            return (
              <div
                key={report.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden group">
                    <img
                      src={report.fotoUrl || 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=800&auto=format&fit=crop&q=80'}
                      alt={report.jenisKomoditas}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-md ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}>
                        {report.tahapAktivitas}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs font-bold truncate flex items-center gap-1">
                        <span>{report.namaPetani}</span>
                        <span className="text-[10px] font-normal opacity-80">({report.nomorAnggota})</span>
                      </div>
                      <div className="text-[11px] opacity-90 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{report.alamatLahan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {report.jenisKomoditas}
                        </span>
                        <span className="text-xs font-semibold text-slate-700">
                          {report.luasLahan} {report.satuanLuas}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {report.tanggalLaporan}
                      </span>
                    </div>

                    {/* Estimasi Panen (if any) */}
                    {(report.estimasiPanenKg || report.estimasiTanggalPanen) && (
                      <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between text-xs">
                        <span className="text-purple-800 font-medium">Estimasi Panen:</span>
                        <span className="font-bold text-purple-950">
                          {report.estimasiPanenKg ? `${formatAngka(report.estimasiPanenKg)} Kg` : ''}
                          {report.estimasiTanggalPanen ? ` (${report.estimasiTanggalPanen})` : ''}
                        </span>
                      </div>
                    )}

                    {/* Berbagi Ilmu Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Catatan & Berbagi Ilmu Petani:</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">
                        "{report.berbagiIlmu}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action Controls */}
                <div className="p-3 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    {report.kodeLaporan}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedReportDetail(report)}
                      className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Rincian</span>
                    </button>

                    {/* Petani can delete their own, or Admin can delete */}
                    {(isOwnReport || !isMemberMode) && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Hapus laporan budidaya ${report.kodeLaporan} oleh ${report.namaPetani}?`)) {
                            hapusLaporanBudidaya(report.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus Laporan Budidaya"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* FORM INPUT PERKEMBANGAN BUDIDAYA MODAL */}
      {/* ========================================================================= */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Formulir Perkembangan Budidaya Petani
                  </h3>
                  <p className="text-xs text-slate-500">
                    Isi perkembangan garapan tanaman sayuran, tips perawatan, dan dokumentasi foto lahan.
                  </p>
                </div>
              </div>

              <button
                onClick={handleResetForm}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              {/* Nama Petani & Akun */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Nama Petani / Anggota *
                </label>
                {isMemberMode ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-emerald-950 text-sm">{activeAnggota.nama}</div>
                      <div className="text-[11px] text-emerald-700">
                        {activeAnggota.nomorAnggota} • Akun Aktif Login
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white">
                      Otomatis Terverifikasi
                    </span>
                  </div>
                ) : (
                  <select
                    value={formAnggotaId}
                    onChange={e => {
                      setFormAnggotaId(e.target.value);
                      const m = anggotaList.find(a => a.id === e.target.value);
                      if (m) {
                        setFormAlamatLahan(m.alamat);
                        setFormLuasLahan(m.luasLahan || 50);
                      }
                    }}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  >
                    {anggotaList.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.nomorAnggota} - {a.nama} ({a.alamat.slice(0, 30)}...)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Alamat Lahan & Luas Lahan (Bata / Hektar / m²) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    Alamat / Lokasi Lahan Garapan *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Blok Pasir Cikadu RT 02/03 Desa Sukatani"
                      value={formAlamatLahan}
                      onChange={e => setFormAlamatLahan(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Luas Lahan & Satuan *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      required
                      min={1}
                      step={0.1}
                      value={formLuasLahan}
                      onChange={e => setFormLuasLahan(Number(e.target.value))}
                      className="w-24 p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
                    />
                    <select
                      value={formSatuanLuas}
                      onChange={e => setFormSatuanLuas(e.target.value as any)}
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-white font-semibold"
                    >
                      <option value="Bata">Bata (14 m²)</option>
                      <option value="Hektar">Hektar (Ha)</option>
                      <option value="m²">m²</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Jenis Komoditas & Aktivitas Garapan (Dropdown) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Jenis Komoditas Sayuran *
                  </label>
                  <select
                    value={formJenisKomoditas}
                    onChange={e => setFormJenisKomoditas(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  >
                    {KOMODITAS_OPTIONS.map(k => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Aktivitas Garapan (Tahap Budidaya) *
                  </label>
                  <select
                    value={formTahapAktivitas}
                    onChange={e => setFormTahapAktivitas(e.target.value as TahapAktivitasBudidaya)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-slate-900 focus:border-blue-500 focus:outline-hidden"
                  >
                    {TAHAP_OPTIONS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estimasi Panen (Opsional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                <div>
                  <label className="block text-purple-900 font-semibold mb-1">
                    Estimasi Hasil Panen (Kg) <span className="text-[10px] font-normal text-purple-600">(Opsional)</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    placeholder="Contoh: 1200"
                    value={formEstimasiPanenKg}
                    onChange={e => setFormEstimasiPanenKg(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-purple-200 bg-white font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-semibold mb-1">
                    Estimasi Tanggal Panen <span className="text-[10px] font-normal text-purple-600">(Opsional)</span>
                  </label>
                  <input
                    type="date"
                    value={formEstimasiTanggalPanen}
                    onChange={e => setFormEstimasiTanggalPanen(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-purple-200 bg-white font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* Berbagi Ilmu / Catatan Perawatan */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Berbagi Ilmu / Catatan Perawatan & Pengalaman Bertani *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ceritakan pengalaman Anda: tips penanganan hama, pupuk yang dipakai, kendala cuaca, atau cara perawatan bedengan..."
                  value={formBerbagiIlmu}
                  onChange={e => setFormBerbagiIlmu(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              {/* Upload Foto / Kamera */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Dokumentasi Foto Lahan / Tanaman (Upload / Kamera)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="w-full sm:w-auto px-4 py-3 rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/40 text-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span className="font-semibold">Buka Kamera / Pilih Foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>

                  {formFotoPreview && (
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden border border-slate-300 shrink-0">
                      <img src={formFotoPreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormFotoPreview('')}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}

                  {!formFotoPreview && (
                    <span className="text-[11px] text-slate-400 italic">
                      Jika foto kosong, sistem akan menggunakan foto representatif tanaman sayuran secara otomatis.
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan Laporan Budidaya</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL BAGIKAN FORM BUDIDAYA (ADMIN) */}
      {/* ========================================================================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Bagikan Formulir Budidaya ke 93 Petani
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ajak seluruh petani anggota melaporkan perkembangan lahan dan komoditas secara digital.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Copy Link Box */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-slate-600 font-semibold mb-1">Tautan Formulir Digital Koperasi:</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}?tab=keanggotaan&sub=budidaya`}
                    className="w-full p-2 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-600 select-all"
                  />
                  <button
                    onClick={handleCopyShareLink}
                    className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>

              {/* Action 1: Send In-App Notification to All 93 Members */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Send className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-blue-950">1. Kirim Pemberitahuan Aplikasi ke 93 Petani</div>
                  <p className="text-[11px] text-blue-700 mt-0.5">
                    Notifikasi push instan akan muncul di dasbor akun seluruh 93 petani mitra untuk mengisi perkembangan lahan.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      bagikanFormBudidaya('semua');
                      setIsShareModalOpen(false);
                    }}
                    className="mt-2.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sebarkan Pemberitahuan Sekarang</span>
                  </button>
                </div>
              </div>

              {/* Action 2: Share via WhatsApp */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-emerald-950">2. Siarkan via Grup WhatsApp Petani</div>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Buka teks undangan dan tautan langsung untuk disebarkan di WhatsApp Group Petani Sayuran Koperasi.
                  </p>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Halo Bapak/Ibu Petani Mitra Koperasi Produsen Mitra Tani Berkah!\n\nMohon bantuannya untuk memperbarui informasi perkembangan budidaya tanaman sayuran Anda (luas lahan, komoditas, dan foto lahan) melalui tautan berikut:\n${window.location.origin}?tab=keanggotaan&sub=budidaya\n\nTerima kasih atas kerja samanya!`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka WhatsApp Web / App</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL REPORT MODAL */}
      {/* ========================================================================= */}
      {selectedReportDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400">
                  {selectedReportDetail.kodeLaporan}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Rincian Budidaya - {selectedReportDetail.namaPetani}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportDetail(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="w-full h-52 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={selectedReportDetail.fotoUrl}
                  alt={selectedReportDetail.jenisKomoditas}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Petani:</span>
                  <span className="font-bold text-slate-900">{selectedReportDetail.namaPetani}</span>
                  <span className="block text-[10px] text-slate-400">{selectedReportDetail.nomorAnggota}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-500 block text-[10px]">Komoditas:</span>
                  <span className="font-bold text-emerald-700">{selectedReportDetail.jenisKomoditas}</span>
                  <span className="block text-[10px] text-slate-600">{selectedReportDetail.luasLahan} {selectedReportDetail.satuanLuas}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Alamat Lahan:</span>
                  <span className="font-medium text-slate-900 text-right">{selectedReportDetail.alamatLahan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tahap Aktivitas:</span>
                  <span className="font-bold text-blue-700">{selectedReportDetail.tahapAktivitas}</span>
                </div>
                {selectedReportDetail.estimasiPanenKg && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Panen:</span>
                    <span className="font-bold text-purple-700">{formatAngka(selectedReportDetail.estimasiPanenKg)} Kg</span>
                  </div>
                )}
                {selectedReportDetail.estimasiTanggalPanen && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Estimasi Tanggal:</span>
                    <span className="font-medium text-slate-800">{selectedReportDetail.estimasiTanggalPanen}</span>
                  </div>
                )}
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <div className="font-bold text-amber-950 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  <span>Berbagi Ilmu & Catatan Perawatan Petani:</span>
                </div>
                <p className="text-amber-900 leading-relaxed italic">
                  "{selectedReportDetail.berbagiIlmu}"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
