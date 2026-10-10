# ⚖️ San Andreas Penal Code (IME RolePlay & MotionLife)

[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub_Pages-blue?style=flat-square&logo=github)](https://beriapriliansya.github.io/PenalCode/)
[![Roleplay](https://img.shields.io/badge/RolePlay-San_Andreas_DOJ-red?style=flat-square)](https://github.com/beriapriliansya/PenalCode)
[![Bilingual](https://img.shields.io/badge/Language-IDN_%7C_ENG-green?style=flat-square)](https://github.com/beriapriliansya/PenalCode)

Sistem database hukum pidana interaktif dan **Kalkulator Dakwaan (MDT / MDC Arrest Docket)** resmi untuk komunitas GTA V RolePlay (**IME RolePlay** & **MotionLife RolePlay**).

---

## 🌐 Live Demo & Hosting
Aplikasi ini di-host secara gratis menggunakan **GitHub Pages**:
👉 **[https://beriapriliansya.github.io/PenalCode/](https://beriapriliansya.github.io/PenalCode/)**

---

## 🚀 Fitur Utama

- 📜 **244 Pasal Tindak Pidana Lengkap (Title 0 – Title 9)**:
  - **Title 0**: Offenses Against State Authority (Treason, Rebellion, Terrorism, Death Sentence)
  - **Title 1**: Offenses Against the Person (Assault, Battery, Murder, Kidnapping, Hostage Taking)
  - **Title 2**: Sexual Offenses & Public Decency (Stalking, Harassment, Indecent Exposure)
  - **Title 3**: Offenses Against Property (Theft, GTA, Robbery, Burglary, Arson)
  - **Title 4**: Crimes Against Public Administration (Bribery, Perjury, Resisting Arrest, Impersonating LEO)
  - **Title 5**: Offenses Against Public Order (Riot, Unlawful Assembly, Evading)
  - **Title 6**: Offenses Against Public Health (Narkotika Schedule I & II, Drug Trafficking)
  - **Title 7**: Crimes Against Public Safety & Security (Kepemilikan Senjata Ilegal Class 1-3, Peledak)
  - **Title 8**: Traffic Operations (Reckless Driving, Hit and Run, Street Racing, DUI, Nitrous Oxide)
  - **Title 9**: Parks and Wildlife Code (Perburuan Liar, Kekejaman Hewan)

- ⚖️ **MDT Arrest Calculator (Kalkulator Dakwaan Interaktif)**:
  - Tambah pasal dakwaan hanya dengan 1 klik (`+ Tambah Dakwaan`).
  - Atur kuantitas pelanggaran (x1, x2, dst.).
  - Otomatis menghitung: **Total Waktu Penjara (Bulan)** & **Total Denda ($)**.
  - Indikator peringatan otomatis jika tersangka terancam **HUT (Hold Until Trial)** atau **Sidang Pengadilan / Hukuman Mati**.
  - **Faktor Pemberat & Pengurang (*Sentencing Modifiers*)**:
    - Keterlibatan Geng (`+15 Bulan`, `+$20,000`)
    - Melawan Petugas / Resisting (`+10 Bulan`, `+$15,000`)
    - Pelaku Berulang / Repeat Offender (`+25% Penjara & Denda`)
    - Plea Bargain / Pengakuan Bersalah (`-25% Penjara`)
  - **1-Click Salin Format MDT (Discord)**: Salin laporan penahanan lengkap siap paste ke channel Discord log kepolisian atau MDT.

- 🌐 **Dukungan Bilingual (IDN 🇮🇩 / ENG 🇺🇸)**:
  - Beralih bahasa instan dengan satu tombol, menerjemahkan seluruh teks, judul pasal, deskripsi, dan sanksi.

- 📖 **11 Bab Doktrin Hukum & Definisi (Preamble – Bab 9)**:
  - Panduan lengkap mengenai *Person, Law Enforcement Officer, Accomplice, Culpability (Mens Rea), Self-Defense, Duress, Entrapment, Infancy*, dll.

- 🔫 **Katalog Klasifikasi Senjata Api (Weapon Tier)**:
  - Panduan legalitas dan contoh model senjata untuk **Class 1**, **Class 2**, **Class 3**, dan **Government-Issue** (*Pistol .50, SMG, AK47, Carbine, dll.*).

- 👮 **SOP Penegak Hukum & Prosedur Sipil (Title 10 – 12)**:
  - *Title 10*: Peningkatan Hukuman (*Sentencing Enhancements*).
  - *Title 11*: Wewenang dan perlindungan hukum bagi *Peace Officer* (LSPD, LSSD, SASP).
  - *Title 12*: Prosedur penahanan oleh warga sipil (*Citizen Detainment*).

- 🔍 **Pencarian Cepat & Filter Responsif**:
  - Pintasan keyboard: tekan `Ctrl + K` atau `/` untuk langsung mencari.
  - Filter kategori (*Felony, Misdemeanor, Infraction*).
  - Pilihan tampilan: *Grid Cards* atau *Table View*.
  - Dukungan Tema Gelap (*MDT Dark Mode*) & Mode Terang (*Light Mode*).

---

## 📁 Struktur File

```
PenalCode/
├── index.html            # Halaman utama (untuk web hosting / GitHub Pages)
├── penalcode.html        # Halaman alternatif
├── app.css               # Desain UI modern, glassmorphism & responsive
├── app.js                # Logika kalkulator, filter, search, & bilingual
├── penalcode_data.js     # Data penal code (244 pasal & 11 bab)
├── penalcode_data.json   # Raw JSON dataset
└── README.md             # Dokumentasi proyek
```

---

## 💻 Menjalankan Secara Lokal (XAMPP / Browser)

1. Letakkan folder ini di `C:\xampp\htdocs\PEnalcode\`
2. Buka peramban (browser) ke:
   ```
   http://localhost/PEnalcode/
   ```
   Atau cukup buka file `index.html` langsung dengan double-click di browser.

---

## 📄 Lisensi & Hak Cipta
Dibuat untuk keperluan roleplay komunitas **IME RolePlay** & **MotionLife RolePlay**.
Dikembangkan untuk mempermudah operasional Law Enforcement (LSPD/LSSD/SASP), Department of Justice (DOJ), pengacara, dan warga sipil.
