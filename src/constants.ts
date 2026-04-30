import { SiteSettings, Product, FAQ, Testimonial } from './types';

export const defaultSettings: SiteSettings = {
  headline: "Keripik Bawang Klasik! Wangi, Gurih, & Kriuknya Bikin Lupa Waktu.",
  description: "Ngemil Snack Asik yuk! Keripik bawang jadul dengan potongan kotak tipis yang pas di mulut. Perpaduan wangi bawang dan irisan seledrinya dijamin bikin tangan ga bisa berhenti nyomot. Teman paling pas buat segala suasana!",
  heroImage: "https://images.unsplash.com/photo-1613919113166-704944fd6ab9?auto=format&fit=crop&q=80&w=800",
  processImage: "https://images.unsplash.com/photo-1563223552-30d01fda3bc6?auto=format&fit=crop&q=80&w=800",
  processHeadline: "Kenapa Bikin Ketagihan?",
  processDescription: "Sadar nggak sih kalau keripik bawang tuh cemilan yang nggak lekang oleh waktu? Kami pertahankan bentuk kotak klasik dengan taburan seledri wangi yang bikin rindu.",
  processBadge: "Rahasia Dapur",
  featuresHeadline: "Kenapa Kamu Wajib Nyobain?",
  featuresDescription: "Bukan sekadar keripik biasa. Snack Asik dibikin pakai cinta biar tiap gigitannya ngasih pengalaman ngemil yang beda.",
  whatsappNumber: "089652074866",
  location: "Jl. Kubang Welingi",
  instagramLink: "https://instagram.com",
  facebookLink: "https://facebook.com",
  tiktokLink: "https://tiktok.com",
  youtubeLink: "https://youtube.com",
  googleSiteVerification: "",
  googleAnalyticsId: "",
  googleTagManagerId: "",
  headScripts: "",
  bodyScripts: "",
};

export const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: "Kemasan Pouch Keluarga",
    price: "Rp 15.000",
    description: "Kemasan pouch transparan dengan ziplock. Praktis ditutup lagi, dijamin tetap garing walaupun dimakan pelan-pelan (kalau bisa bertahan lama!).",
    weight: "200g",
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bb087?auto=format&fit=crop&q=80&w=400",
    order: 1
  }
];

export const defaultFAQs: FAQ[] = [
  {
    id: 'f1',
    question: "Tahan berapa lama kerenyahannya?",
    answer: "Sangat awet! Kemasan pouch kami sudah dilengkapi ziplock. Pastikan klip tertutup rapat, kerenyahannya bisa tahan berminggu-minggu di suhu ruang.",
    order: 1
  }
];

export const defaultTestimonials: Testimonial[] = [
  {
    id: 't1',
    name: "Sinta Rahmawati",
    text: "Bentuk kotaknya pas banget buat sekali hap. Wangi seledri sama bawangnya berasa banget, ngingetin sama kue bawang buatan nenek. Buat temen nonton Netflix emang paling the best!",
    role: "Pecinta Cemilan Gurih",
    order: 1
  }
];
