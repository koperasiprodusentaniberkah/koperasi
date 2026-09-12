import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Printer, 
  Check, 
  Copy, 
  Store, 
  ExternalLink,
  Calendar,
  User,
  CreditCard,
  Package
} from 'lucide-react';
import { SaprodiTransaction } from '../../types/koperasi';
import { formatRupiah, formatAngka, formatTanggalIndo, generateWhatsAppSaprodiNota } from '../../utils/exportUtils';

interface SaprodiNotaModalProps {
  transaction: SaprodiTransaction | null;
  onClose: () => void;
}

export const SaprodiNotaModal: React.FC<SaprodiNotaModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const isSale = transaction.tipe === 'Penjualan';

  const { text: waText, waUrl } = generateWhatsAppSaprodiNota({
    kodeTransaksi: transaction.kodeTransaksi,
    tanggal: transaction.tanggal,
    tipe: transaction.tipe,
    namaPihak: transaction.namaPihak,
    tipePihak: transaction.tipePihak,
    noHp: transaction.noHp,
    namaBarang: transaction.namaBarang,
    kategori: transaction.kategoriBarang,
    satuan: transaction.satuan,
    jumlah: transaction.jumlah,
    hargaSatuan: transaction.hargaSatuan,
    totalBiaya: transaction.totalBiaya,
    metodePembayaran: transaction.metodePembayaran,
    catatan: transaction.catatan
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(waText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 animate-in fade-in zoom-in-95">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isSale ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
              <Store className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-800">
              Nota Digital Toko Saprodi
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title="Cetak Nota"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Struk Body */}
        <div className="mt-4 p-5 rounded-2xl bg-slate-50/70 border border-slate-200 text-slate-800 font-sans">
          
          {/* Logo & Koperasi Brand */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm mb-1">
              MTB
            </div>
            <h4 className="text-xs font-black tracking-wide text-slate-900 uppercase">
              Koperasi Produsen Mitra Tani Berkah
            </h4>
            <p className="text-[10px] text-slate-500 font-medium mt-0.5">
              Unit Usaha Toko Sarana Produksi Pertanian (Saprodi)
            </p>
            <p className="text-[9px] text-slate-400">
              SK AHU-0004819.AH.01.26.TAHUN 2023 • NIB: 1904230058291
            </p>
          </div>

          {/* Meta Info Transaksi */}
          <div className="py-3 border-b border-dashed border-slate-300 grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">No. Transaksi</span>
              <span className="font-mono font-bold text-slate-900">{transaction.kodeTransaksi}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Tanggal Transaksi</span>
              <span className="font-semibold text-slate-800">{formatTanggalIndo(transaction.tanggal)}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">{isSale ? 'Nama Pelanggan' : 'Distributor / Supplier'}</span>
              <span className="font-bold text-slate-900">{transaction.namaPihak}</span>
              <span className="block text-[9px] text-slate-500">({transaction.tipePihak})</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px]">Jenis & Pembayaran</span>
              <span className={`inline-block font-bold text-[10px] px-2 py-0.5 rounded-full ${
                isSale ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {transaction.tipe}
              </span>
              <span className="block text-[9px] text-slate-500 mt-0.5">{transaction.metodePembayaran}</span>
            </div>
          </div>

          {/* Rincian Barang */}
          <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900">
              <span>{transaction.namaBarang}</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>
                {formatAngka(transaction.jumlah)} {transaction.satuan} x {formatRupiah(transaction.hargaSatuan)}
              </span>
              <span className="font-semibold text-slate-800">
                {formatRupiah(transaction.totalBiaya)}
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Kode: {transaction.kodeBarang} • Kategori: {transaction.kategoriBarang}
            </div>
          </div>

          {/* Total Ringkasan */}
          <div className="pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1">
              <span>TOTAL PEMBAYARAN:</span>
              <span className={isSale ? 'text-emerald-700' : 'text-blue-700'}>
                {formatRupiah(transaction.totalBiaya)}
              </span>
            </div>

            {isSale && transaction.margin !== undefined && (
              <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 mt-2 text-[10px] text-emerald-800 flex justify-between">
                <span>Margin Laba Toko:</span>
                <span className="font-bold">+{formatRupiah(transaction.margin)}</span>
              </div>
            )}

            {transaction.catatan && (
              <div className="text-[10px] text-slate-500 italic pt-2">
                Catatan: {transaction.catatan}
              </div>
            )}
          </div>

          {/* Struk Footer Note */}
          <div className="text-center pt-4 border-t border-slate-200 mt-3 text-[10px] text-slate-400">
            Terima kasih telah bertransaksi di Unit Usaha Saprodi Koperasi Mitra Tani Berkah.
          </div>
        </div>

        {/* WhatsApp & Copy Action Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          {waUrl ? (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Kirim Nota ke WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          ) : (
            <button
              onClick={handleCopy}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Teks Nota Disalin!' : 'Salin Teks Nota'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="w-full sm:w-auto py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Tersalin' : 'Salin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
