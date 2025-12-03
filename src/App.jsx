import React, { useState, useCallback } from 'react';
import { CreditCard, Calendar, TrendingUp, DollarSign, Clock, AlertTriangle, ChevronRight, CheckCircle, Smartphone, Calculator } from 'lucide-react';

// --- Data Konfigurasi Platform ---
const PLATFORM_RATES = {
    shopee: { name: "SPayLater", rate: 0.0295, color: "bg-orange-500", icon: "S", lateFeeType: 'percentage', lateFeeRate: 0.05, adminFee: 0.01 },
    kredivo: { name: "Kredivo", rate: 0.026, color: "bg-blue-600", icon: "K", lateFeeType: 'percentage', lateFeeRate: 0.10, adminFee: 0.01 },
    gopay: { name: "GoPayLater", rate: 0.025, color: "bg-green-500", icon: "G", lateFeeType: 'fixed', lateFeeAmount: 80000, adminFee: 0.01 },
    traveloka: { name: "TPayLater", rate: 0.035, color: "bg-cyan-600", icon: "T", lateFeeType: 'percentage', lateFeeRate: 0.05, adminFee: 0.01 },
    akulaku: { name: "Akulaku", rate: 0.028, color: "bg-purple-600", icon: "A", lateFeeType: 'percentage', lateFeeRate: 0.05, adminFee: 0.01 },
};

const TENURES = [1, 3, 6, 12];
const baseBlue = 'blue';
const accentCyan = 'cyan';

// --- Utilitas Pemformatan ---
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(Math.max(0, amount));
};

// --- Komponen Pembantu Detail Hasil ---
const DetailItem = ({ icon: Icon, title, value, color, isBold = false }) => (
    <div className="flex items-start p-4 bg-white rounded-xl shadow-md border border-gray-200">
        <Icon className={`w-5 h-5 mr-3 mt-1 ${color}`} />
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className={`text-lg ${isBold ? 'font-bold' : 'font-semibold'} ${color}`}>{value}</p>
        </div>
    </div>
);

// --- Komponen Utama Aplikasi ---
const App = () => {
    const [amount, setAmount] = useState('');
    const [platformKey, setPlatformKey] = useState(Object.keys(PLATFORM_RATES)[0]);
    const [tenure, setTenure] = useState(TENURES[0]);
    // daysLate disimpan sebagai angka (0, 10, 100, dst)
    const [daysLate, setDaysLate] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const calculateSimulation = useCallback(() => {
        const principal = parseFloat(amount.replace(/[^0-9]/g, ''));

        if (isNaN(principal) || principal <= 0) {
            setError("Mohon masukkan jumlah pembayaran yang valid (> 0).");
            setResult(null);
            return;
        }

        setError('');

        const platform = PLATFORM_RATES[platformKey];
        const monthlyRate = platform.rate;
        
        // Perhitungan Dasar
        const initialAdminFee = principal * platform.adminFee; 
        const totalInterest = principal * monthlyRate * tenure;
        const totalRepayment = principal + totalInterest + initialAdminFee;
        const monthlyInstallmentBase = totalRepayment / tenure;
        
        // Perhitungan Denda Keterlambatan
        let lateFeePerMonth = 0;
        let lateFeeDetails = '';
        const lateMonths = daysLate > 0 ? Math.ceil(daysLate / 30) : 0;
        
        if (lateMonths > 0) {
            if (platform.lateFeeType === 'percentage') {
                lateFeePerMonth = monthlyInstallmentBase * platform.lateFeeRate;
                lateFeeDetails = `Denda ${platform.lateFeeRate * 100}% dari angsuran bulanan, dikalikan ${lateMonths} bulan keterlambatan.`;
            } else if (platform.lateFeeType === 'fixed') {
                lateFeePerMonth = platform.lateFeeAmount; 
                lateFeeDetails = `Denda Tetap Rp ${platform.lateFeeAmount.toLocaleString('id-ID')} per bulan, dikalikan ${lateMonths} bulan keterlambatan.`;
            }
        }
        
        const totalAccumulatedLateFee = lateFeePerMonth * lateMonths;
        const totalDueWithLateFee = monthlyInstallmentBase + totalAccumulatedLateFee;

        setResult({
            principal,
            platformName: platform.name,
            tenure,
            monthlyInstallmentBase,
            totalRepayment,
            totalInterest,
            initialAdminFee,
            totalRate: (monthlyRate * 100).toFixed(2),
            lateFeePerMonth,
            totalAccumulatedLateFee,
            lateMonths,
            lateFeeDetails,
            totalDueWithLateFee,
        });

    }, [amount, platformKey, tenure, daysLate]);

    // Handler Input Jumlah Pinjaman
    const handleAmountChange = (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, '');
        const formattedValue = rawValue ? parseInt(rawValue).toLocaleString('id-ID') : '';
        setAmount(formattedValue);
        setResult(null);
        setError('');
    };

    const handlePlatformChange = (key) => {
        setPlatformKey(key);
        setResult(null);
    };

    const handleTenureChange = (t) => {
        setTenure(t);
        setResult(null);
    };
    
    // UI Styling Functions
    const tenureButtonClass = (t) => (
        `px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 shadow-md w-full ${
            tenure === t
                ? `bg-gradient-to-r from-${baseBlue}-600 to-${accentCyan}-500 text-white transform scale-105`
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600'
        }`
    );

    const platformButtonClass = (key) => {
        const platform = PLATFORM_RATES[key];
        return `flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl transition-all duration-200 transform shadow-md w-full h-24 sm:h-auto text-center ${
            platformKey === key
                ? `bg-blue-600 text-white ring-4 ring-offset-2 ring-cyan-300 scale-105`
                : 'bg-white text-gray-800 hover:bg-gray-100'
        }`;
    };

    // Fungsi Smooth Scroll
    const handleSmoothScroll = (id) => {
        const element = document.getElementById(id.substring(1));
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>{`
                .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                #simulator { scroll-margin-top: 80px; } 
            `}</style>
            
            {/* HEADER */}
            <header className={`sticky top-0 z-10 bg-white shadow-lg border-b border-gray-200`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <Smartphone className={`w-8 h-8 mr-2 text-${baseBlue}-600`} />
                        <h1 className="text-xl font-bold text-gray-900">
                            PayLater Sim ID
                        </h1>
                    </div>
                    {/* Tombol dengan smooth scroll */}
                    <button 
                        onClick={() => handleSmoothScroll('#simulator')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-${baseBlue}-500 to-${accentCyan}-400 hover:from-${baseBlue}-600 hover:to-${accentCyan}-500 transition-all`}
                    >
                        Mulai Hitung
                    </button>
                </div>
            </header>

            {/* MAIN CONTENT / LANDING SECTION */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">

                {/* Hero Section */}
                <section className="text-center py-16 sm:py-24 bg-gradient-to-br from-blue-50 to-white rounded-3xl shadow-xl mb-12">
                    <Calculator className={`w-12 h-12 mx-auto text-${baseBlue}-600 mb-4`} />
                    <h2 className="4xl sm:text-6xl font-extrabold text-gray-900 leading-tight">
                        Hitung Cerdas PayLater Anda.
                    </h2>
                    <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                        Simulasikan cicilan bulanan, bunga flat, dan potensi denda keterlambatan dari platform PayLater populer di Indonesia.
                    </p>
                </section>

                {/* Simulation Section */}
                <section id="simulator" className="py-10">
                    <div className="text-center mb-10">
                        <h3 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                            Mulai Simulasi Pinjaman
                        </h3>
                        <p className="lg text-gray-500">
                            Masukkan detail untuk mendapatkan rincian tagihan yang transparan.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Inputs */}
                        <div className="lg:col-span-2 space-y-6 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                            <h4 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                                <CreditCard className="w-5 h-5 mr-3 text-red-500" />
                                Parameter & Pilihan
                            </h4>
                            
                            {/* INPUT AMOUNT */}
                            <div className="mb-4">
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    Jumlah Pokok Pinjaman (Rp)
                                </label>
                                <div className="relative">
                                    <input
                                        id="amount"
                                        type="text"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        placeholder="Cth: 1.500.000"
                                        className={`w-full p-4 pl-12 text-xl border-2 rounded-xl font-mono focus:ring-${baseBlue}-500 focus:border-${baseBlue}-500 transition-all ${error ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                </div>
                                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                            </div>

                            {/* SELECT PLATFORM */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Pilih Platform PayLater
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                                    {Object.entries(PLATFORM_RATES).map(([key, platform]) => (
                                        <button
                                            key={key}
                                            onClick={() => handlePlatformChange(key)}
                                            className={platformButtonClass(key)}
                                        >
                                            <span className="text-2xl font-extrabold">{platform.icon}</span>
                                            <span className="mt-1 text-sm font-medium">{platform.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* SELECT TENURE & DAYS LATE */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                                {/* SELECT TENURE */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Pilihan Tempo (Bulan)
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {TENURES.map(t => (
                                            <button
                                                key={t}
                                                onClick={() => handleTenureChange(t)}
                                                className={tenureButtonClass(t)}
                                            >
                                                {t} Bln
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* INPUT DAYS LATE - PERBAIKAN LOGIKA */}
                                <div>
                                    <label htmlFor="daysLate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Simulasikan Keterlambatan (Hari)
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="daysLate"
                                            type="text" 
                                            min="0"
                                            value={daysLate > 0 ? daysLate.toString() : ''} 
                                            onChange={(e) => {
                                                let value = e.target.value;
                                                
                                                // 1. Hapus semua karakter non-digit
                                                let cleanedValue = value.replace(/[^0-9]/g, '');
                                                
                                                // 2. Hapus nol di awal jika ada (e.g., '010' jadi '10')
                                                if (cleanedValue.length > 1 && cleanedValue.startsWith('0')) {
                                                    cleanedValue = cleanedValue.replace(/^0+/, '');
                                                }

                                                // 3. Konversi ke angka. Jika cleanedValue kosong, hasilnya 0.
                                                const numericValue = cleanedValue === '' ? 0 : parseInt(cleanedValue);
                                                
                                                setDaysLate(numericValue);
                                                setResult(null);
                                            }}
                                            placeholder="0"
                                            className={`w-full p-4 pl-12 text-xl border-2 rounded-xl focus:ring-${baseBlue}-500 focus:border-${baseBlue}-500 transition-all border-gray-300`}
                                        />
                                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Dihitung sebagai <strong>{daysLate > 0 ? (Math.ceil(daysLate / 30)) : 0}</strong> bulan keterlambatan.
                                    </p>
                                </div>
                            </div>

                            {/* CALCULATE BUTTON */}
                            <button
                                onClick={calculateSimulation}
                                className={`w-full mt-6 py-4 text-lg font-bold text-white rounded-xl bg-gradient-to-r from-${baseBlue}-600 to-${accentCyan}-500 hover:from-${baseBlue}-700 hover:to-${accentCyan}-600 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5`}
                            >
                                <ChevronRight className="inline w-5 h-5 mr-2" />
                                Hitung Simulasi Tagihan
                            </button>
                        </div>
                        
                        {/* Column 2: Live Summary */}
                        <div className="lg:col-span-1">
                            {result ? (
                                <div className="p-6 sm:p-8 rounded-2xl bg-white shadow-2xl border border-gray-200 animate-fadeIn sticky top-20">
                                    <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                                        <CheckCircle className={`w-6 h-6 mr-2 text-${baseBlue}-500`} />
                                        Ringkasan Hasil
                                    </h4>

                                    <div className={`bg-${baseBlue}-50 p-4 rounded-xl mb-4 border-l-4 border-${baseBlue}-600`}>
                                        <p className={`text-sm font-semibold text-${baseBlue}-700`}>Angsuran Bulanan Normal:</p>
                                        <p className={`text-3xl font-extrabold text-${baseBlue}-900 mt-1`}>
                                            {formatCurrency(result.monthlyInstallmentBase)}
                                        </p>
                                    </div>
                                    
                                    {result.totalAccumulatedLateFee > 0 && (
                                        <div className="bg-red-50 p-4 rounded-xl mb-4 border-l-4 border-red-600 animate-fadeIn">
                                            <p className="text-sm font-semibold text-red-700 flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Total Denda Akumulasi ({result.lateMonths} Bln)
                                            </p>
                                            <p className="text-xl font-extrabold text-red-800 mt-1">
                                                {formatCurrency(result.totalAccumulatedLateFee)}
                                            </p>
                                        </div>
                                    )}

                                    <div className="mt-6 space-y-3">
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Pokok Pinjaman:</span>
                                            <span className="font-semibold">{formatCurrency(result.principal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Total Bunga ({result.totalRate}%/bln):</span>
                                            <span className="font-semibold text-red-500">{formatCurrency(result.totalInterest)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm text-gray-700">
                                            <span>Biaya Admin:</span>
                                            <span className="font-semibold">{formatCurrency(result.initialAdminFee)}</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total Kewajiban Akhir:</span>
                                            <span className={`text-${baseBlue}-600`}>{formatCurrency(result.totalRepayment)}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-8 rounded-2xl bg-white shadow-md text-center text-gray-500 sticky top-20">
                                    <Calculator className="w-8 h-8 mx-auto mb-2" />
                                    <p>Masukkan parameter pinjaman di sebelah kiri dan tekan Hitung untuk melihat ringkasan hasil secara langsung di sini.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* Detail Result Section */}
                {result && (
                    <section className="mt-12 animate-fadeIn">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
                            Rincian Lengkap Pembayaran
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <DetailItem
                                icon={DollarSign}
                                title="Pokok Pinjaman"
                                value={formatCurrency(result.principal)}
                                color="text-gray-600"
                            />
                            <DetailItem
                                icon={TrendingUp}
                                title="Total Bunga Selama Tenor"
                                value={formatCurrency(result.totalInterest)}
                                color="text-red-500"
                            />
                            <DetailItem
                                icon={CreditCard}
                                title={`Biaya Admin Awal`}
                                value={formatCurrency(result.initialAdminFee)}
                                color="text-yellow-600"
                            />
                            <DetailItem
                                icon={Calendar}
                                title="Total Kewajiban Akhir"
                                value={formatCurrency(result.totalRepayment)}
                                color={`text-${baseBlue}-600`}
                                isBold={true}
                            />
                        </div>

                        {result.totalAccumulatedLateFee > 0 && (
                            <div className="mt-8 p-6 bg-red-50 rounded-xl border-l-4 border-red-600">
                                <p className="text-lg font-bold text-red-800 mb-2 flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2" />
                                    Detail Denda Keterlambatan:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <p className="text-sm font-medium text-red-600">Denda Bulanan:</p>
                                    <p className="text-sm font-bold text-red-800">{formatCurrency(result.lateFeePerMonth)}</p>
                                    <p className="text-xs text-red-500 italic row-start-2 sm:row-start-1 sm:col-span-1 sm:text-right">{result.lateFeeDetails}</p>
                                    
                                    <p className="text-sm font-medium text-red-600 col-span-1 mt-2 border-t pt-2">Total Tagihan Saat Ini (Angsuran + Denda):</p>
                                    <p className="text-xl font-extrabold text-red-800 col-span-2 mt-2 border-t pt-2">{formatCurrency(result.totalDueWithLateFee)}</p>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </main>

            {/* FOOTER */}
            <footer className={`bg-gray-900 text-white mt-10 py-10 border-t-8 border-cyan-500`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="flex flex-col items-center justify-center mb-6">
                        <Smartphone className="w-8 h-8 text-cyan-400 mb-2" />
                        <p className="text-2xl font-extrabold text-white">PayLater Sim ID</p>
                    </div>

                    <p className="text-xs text-gray-400 max-w-xl mx-auto mb-6">
                        DISCLAIMER: Simulasi ini menggunakan asumsi <strong>bunga flat</strong> dan tarif rata-rata. Tarif dan denda aktual (dihitung per siklus 30 hari) dapat bervariasi sesuai kebijakan PayLater.
                    </p>
                    
                    <div className="border-t border-gray-700 pt-6">
                      <p className="mt-4 text-sm text-gray-400">
                        &copy; 2025 Simulasi Keuangan. Dibuat dengan <span className="text-red-500">♥</span> dan ☕.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default App;