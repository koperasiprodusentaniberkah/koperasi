import React, { useState } from 'react';
import {
  X,
  CreditCard,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coins,
  ShieldCheck,
  Calendar,
  Banknote,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Anggota, LoanApplication } from '../../types/koperasi';
import { useKoperasi } from '../../context/KoperasiContext';
import { formatRupiah } from '../../utils/exportUtils';

interface PersonalLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Anggota;
  onLockPin: () => void;
}

export const PersonalLoanModal: React.FC<PersonalLoanModalProps> = ({
  isOpen,
  onClose,
  member,
  onLockPin
}) => {
  const { loans, ajukanPinjaman } = useKoperasi();

  // Form Pengajuan Pinjaman Baru state
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [jumlahPinjaman, setJumlahPinjaman] = useState(1000000);
  const [tenorBulan, setTenorBulan] = useState(6);
  const [tujuanPinjaman, setTujuanPinjaman] = useState('Pembelian sarana produksi benih & pupuk');
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState('');

  if (!isOpen) return null;

  // Personal loans for this specific member
  const personalLoans = loans.filter(l => l.anggotaId === member.id);

  // Financial calculations
  const totalSimpanan = member.simpananPokok + member.simpananWajib + member.simpananSukarela;
  const plafonMaksimal = totalSimpanan * 2;
  const totalPinjamanBerjalan = personalLoans
    .filter(l => l.status === 'Dicairkan' || l.status === 'Disetujui')
    .reduce((sum, l) => sum + (l.sisaPinjaman ?? l.jumlahPinjaman), 0);
  const sisaPlafonTersedia = Math.max(0, plafonMaksimal - totalPinjamanBerjalan);

  // Estimasi cicilan bulanan pengajuan baru (Pokok/tenor + Bunga 1%)
  const bungaPerBulan = jumlahPinjaman * 0.01;
  const pokokPerBulan = Math.round(jumlahPinjaman / tenorBulan);
  const estimasiCicilan = Math.round(pokokPerBulan + bungaPerBulan);

  const handleApplyLoan = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError('');
    setApplySuccess('');

    if (jumlahPinjaman <= 0) {
      setApplyError('Jumlah pinjaman harus lebih besar dari Rp 0.');
      return;
    }

    if (jumlahPinjaman > plafonMaksimal) {
      setApplyError(
        `Pengajuan melebihi Plafon Maksimal (${formatRupiah(plafonMaksimal)})! Plafon dibatasi maksimal 2x total simpanan.`
      );
      return;
    }

    if (jumlahPinjaman > sisaPlafonTersedia) {
      setApplyError(
        `Jumlah pinjaman melebihi sisa plafon Anda yang tersedia (${formatRupiah(sisaPlafonTersedia)}).`
      );
      return;
    }

    const res = ajukanPinjaman({
      anggotaId: member.id,
      jumlahPinjaman,
      tenorBulan,
      tujuanPinjaman
    });

    if (res.success) {
      setApplySuccess(`Pengajuan pinjaman berhasil diajukan dengan kode ${res.loan?.kodePinjaman || ''}! Menunggu verifikasi pengurus.`);
      setTimeout(() => {
        setShowApplyForm(false);
        setApplySuccess('');
      }, 2000);
    } else {
      setApplyError(res.message || 'Gagal mengajukan pinjaman.');
    }
  };

  return (
    <div
      id="modal-personal-loan"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  PIN Terverifikasi • Akses Pribadi
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                Rincian Pinjaman Pribadi: {member.nama}
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLockPin();
                onClose();
              }}
              title="Kunci Kembali dengan PIN"
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Kunci Akses</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Member Profile Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {member.nama.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-900">{member.nama}</div>
              <div className="text-slate-500 font-mono text-[11px]">
                {member.nomorAnggota} • NIK: {member.nik} • HP: {member.noHp}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              Status: {member.status}
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800">
              Lahan: {member.luasLahan} {member.satuanLahan}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-6">
          {/* Metrics 4 Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-medium text-slate-500 block">Total Simpanan</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 mt-1 block">
                {formatRupiah(totalSimpanan)}
              </span>
              <span className="text-[10px] text-slate-400">Pokok + Wajib + Sukarela</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-[11px] font-medium text-emerald-700 block">Plafon Maksimal (2x)</span>
              <span className="text-sm sm:text-base font-bold text-emerald-900 mt-1 block">
                {formatRupiah(plafonMaksimal)}
              </span>
              <span className="text-[10px] text-emerald-600">Hak batas pinjaman</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100">
              <span className="text-[11px] font-medium text-amber-700 block">Pinjaman Berjalan</span>
              <span className="text-sm sm:text-base font-bold text-amber-900 mt-1 block">
                {formatRupiah(totalPinjamanBerjalan)}
              </span>
              <span className="text-[10px] text-amber-600">Sisa saldo hutang aktif</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100">
              <span className="text-[11px] font-medium text-indigo-700 block">Plafon Tersedia</span>
              <span className="text-sm sm:text-base font-bold text-indigo-900 mt-1 block">
                {formatRupiah(sisaPlafonTersedia)}
              </span>
              <span className="text-[10px] text-indigo-600">Dapat diajukan lagi</span>
            </div>
          </div>

          {/* Form Pengajuan Pinjaman Baru (Collapsible) */}
          {showApplyForm ? (
            <div className="p-5 rounded-2xl bg-slate-50 border border-blue-200 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Form Pengajuan Pinjaman Baru</h4>
                    <p className="text-[11px] text-slate-500">
                      Batas maksimal plafon Anda: <strong>{formatRupiah(sisaPlafonTersedia)}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApplyForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Batal
                </button>
              </div>

              {applyError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{applyError}</span>
                </div>
              )}

              {applySuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{applySuccess}</span>
                </div>
              )}

              <form onSubmit={handleApplyLoan} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-slate-700 font-semibold">
                        Jumlah Pinjaman (Rp)
                      </label>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Bebas Nominal
                      </span>
                    </div>
                    <input
                      id="input-personal-loan-amount"
                      type="number"
                      min={1}
                      step={50000}
                      max={sisaPlafonTersedia > 0 ? sisaPlafonTersedia : 1000000}
                      value={jumlahPinjaman}
                      onChange={e => setJumlahPinjaman(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500 font-semibold text-slate-900"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Bebas tanpa batasan minimal: <strong>{formatRupiah(jumlahPinjaman)}</strong>
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Jangka Waktu (Tenor)
                    </label>
                    <select
                      id="select-personal-loan-tenor"
                      value={tenorBulan}
                      onChange={e => setTenorBulan(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500 font-medium text-slate-800 bg-white"
                    >
                      <option value={3}>3 Bulan</option>
                      <option value={6}>6 Bulan</option>
                      <option value={10}>10 Bulan</option>
                      <option value={12}>12 Bulan (1 Tahun)</option>
                    </select>
                    <span className="text-[10px] text-blue-600 mt-1 block">
                      Jasa Bunga Koperasi: 1.0% flat per bulan
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Tujuan Penggunaan Pinjaman
                  </label>
                  <input
                    id="input-personal-loan-purpose"
                    type="text"
                    value={tujuanPinjaman}
                    onChange={e => setTujuanPinjaman(e.target.value)}
                    placeholder="Contoh: Pembelian pupuk dasar dan mulsa tanam..."
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-blue-500"
                    required
                  />
                </div>

                {/* Simulasi Card */}
                <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Estimasi Angsuran:</span>
                    <strong className="text-blue-900 text-sm ml-1.5">
                      {formatRupiah(estimasiCicilan)} / bulan
                    </strong>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Pokok {formatRupiah(pokokPerBulan)} + Bunga 1% {formatRupiah(bungaPerBulan)}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowApplyForm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    id="btn-submit-personal-loan"
                    type="submit"
                    disabled={sisaPlafonTersedia <= 0}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    Kirimkan Pengajuan Pinjaman
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 gap-3">
              <div>
                <h4 className="text-xs font-bold text-blue-900">
                  Perlu Tambahan Modal Usaha Tani?
                </h4>
                <p className="text-[11px] text-blue-700 mt-0.5">
                  Sisa plafon Anda sebesar <strong>{formatRupiah(sisaPlafonTersedia)}</strong> siap diajukan untuk modal saprodi, alsintan, atau budidaya.
                </p>
              </div>
              <button
                id="btn-ajukan-pinjaman-baru"
                onClick={() => setShowApplyForm(true)}
                disabled={sisaPlafonTersedia <= 0}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Ajukan Pinjaman Baru</span>
              </button>
            </div>
          )}

          {/* Table of Personal Loans */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span>Riwayat Pinjaman Pribadi ({personalLoans.length})</span>
              <span className="text-[11px] text-slate-500 font-normal">
                Kerahasiaan data terproteksi PIN khusus
              </span>
            </h4>

            {personalLoans.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs space-y-2">
                <CreditCard className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="font-semibold text-slate-700">Belum Ada Riwayat Pinjaman</p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Anda belum pernah memiliki catatan pinjaman aktif. Klik tombol "Ajukan Pinjaman Baru" di atas jika membutuhkan modal kerja pertanian.
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="py-2.5 px-3">Kode Pinjaman</th>
                      <th className="py-2.5 px-3">Tgl Pengajuan</th>
                      <th className="py-2.5 px-3 text-right">Jumlah Pinjaman</th>
                      <th className="py-2.5 px-3 text-center">Tenor</th>
                      <th className="py-2.5 px-3 text-right">Cicilan/Bulan</th>
                      <th className="py-2.5 px-3 text-right">Sisa Hutang</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {personalLoans.map(l => {
                      const isPending = l.status === 'Menunggu Persetujuan';
                      const isApproved = l.status === 'Disetujui';
                      const isDisbursed = l.status === 'Dicairkan';
                      const isPaidOff = l.status === 'Lunas';

                      return (
                        <tr key={l.id} className="hover:bg-slate-50/70">
                          <td className="py-3 px-3 font-mono font-bold text-blue-700">
                            {l.kodePinjaman}
                            <div className="text-[10px] text-slate-400 font-sans font-normal truncate max-w-[160px]" title={l.tujuanPinjaman}>
                              {l.tujuanPinjaman}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 whitespace-nowrap">
                            {l.tanggalPengajuan}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-900 whitespace-nowrap">
                            {formatRupiah(l.jumlahPinjaman)}
                          </td>
                          <td className="py-3 px-3 text-center text-slate-700 whitespace-nowrap">
                            {l.tenorBulan} Bln
                          </td>
                          <td className="py-3 px-3 text-right text-slate-700 font-medium whitespace-nowrap">
                            {formatRupiah(l.cicilanBulanan)}
                          </td>
                          <td className="py-3 px-3 text-right font-semibold text-rose-700 whitespace-nowrap">
                            {formatRupiah(l.sisaPinjaman ?? l.jumlahPinjaman)}
                          </td>
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isDisbursed
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : isApproved
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : isPending
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {l.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Koperasi Produsen Mitra Tani Berkah • Plafon Terproteksi 2x Simpanan</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
          >
            Tutup Rincian
          </button>
        </div>
      </div>
    </div>
  );
};
