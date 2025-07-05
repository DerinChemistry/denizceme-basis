// Firebase SDK'sını içe aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// BURAYA KENDİ FIREBASE YAPILANDIRMA KODUNU YAPIŞTIR!
// Örnek:
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL" // Bu satır önemli!
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Realtime Database servisini al

console.log('Script loaded and Firebase initialized.'); // Debug log

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired.'); // Debug log

    // HTML elementlerini al
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.container');
    const denizcemImage = document.getElementById('denizcemImage');
    const personalClickCountSpan = document.getElementById('personalClickCount');
    const totalClickCountSpan = document.getElementById('totalClickCount');
    const restartButton = document.getElementById('restartButton');
    const donateButton = document.querySelector('.donate-button'); // Bağış butonu

    // Kişisel tıklama sayısını localStorage'dan al (tarayıcı kapansa da kalıcı)
    // Bu, senin kendi tarayıcındaki basma sayını tutar ve sıfırlanmaz.
    let personalClickCount = localStorage.getItem('personalClickCountDenizcem') || 0;
    personalClickCountSpan.textContent = personalClickCount;

    // Firebase Realtime Database'deki 'totalClicks' düğümüne referans
    const totalClicksRef = ref(database, 'totalClicks');

    // Firebase'den toplam tıklama sayısını dinle ve güncelleyince ekrana yansıt
    // Bu kısım, veritabanındaki değişiklikleri anında yakalar ve ekrana yansıtır.
    // Bu sayede tüm kullanıcıların toplam basma sayısı her zaman güncel kalır.
    onValue(totalClicksRef, (snapshot) => {
        const data = snapshot.val(); // Güncel veriyi al
        totalClickCountSpan.textContent = data || 0; // Eğer veri yoksa 0 göster
    }, (error) => {
        // Hata durumunda konsola yazdır (debug için önemli)
        console.error("Firebase'den veri okunurken hata oluştu:", error);
        totalClickCountSpan.textContent = "Hata!"; // Kullanıcıya hata olduğunu göster
    });

    // "Başla" butonuna tıklanınca
    startButton.addEventListener('click', () => {
        console.log('Start button clicked!'); // Debug log
        overlay.classList.add('hidden'); // Blur ve opacity: 0 uygula
        overlay.style.pointerEvents = 'none'; // Tıklama olaylarını hemen engelle!
        container.classList.add('active'); // Ana içeriği göster

        // Overlay'i geçiş süresi sonunda tamamen gizle
        // CSS'teki transition süresi 0.5s (500ms) olduğu için 550ms sonra display: none yapıyoruz.
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 550); // Biraz daha uzun süre vererek görsel geçişin tamamlandığından emin oluyoruz.

        // Kullanıcının siteye başladığını işaretle (tekrar geldiğinde direkt başlasın)
        localStorage.setItem('startedDenizcemClicker', 'true');
    });

    // Denizcem resmine tıklanınca
    denizcemImage.addEventListener('click', () => {
        console.log('Denizcem image clicked!'); // Debug log
        // Kişisel sayacı artır ve güncelle
        personalClickCount++;
        personalClickCountSpan.textContent = personalClickCount;
        localStorage.setItem('personalClickCountDenizcem', personalClickCount);

        // Firebase'deki toplam tıklama sayısını artır (atomik işlem ile çakışmaları engeller)
        // Bu işlem, birden fazla kullanıcının aynı anda tıklaması durumunda bile doğru artışı sağlar.
        runTransaction(totalClicksRef, (currentClicks) => {
            return (currentClicks || 0) + 1;
        }).catch(error => {
            console.error("Firebase'e yazılırken hata oluştu:", error);
        });

        // Tıklama animasyonu
        denizcemImage.style.transform = 'scale(0.97)';
        setTimeout(() => {
            denizcemImage.style.transform = 'scale(1)';
        }, 100);
    });

    // "Yeniden Başla" butonuna tıklanınca
    restartButton.addEventListener('click', () => {
        console.log('Restart button clicked!'); // Debug log
        // Kişisel sayacı sıfırla ve localStorage'dan sil
        personalClickCount = 0;
        personalClickCountSpan.textContent = personalClickCount;
        localStorage.removeItem('personalClickCountDenizcem');
        localStorage.removeItem('startedDenizcemClicker'); // Başlangıç ekranına dönmek için

        // Ana içeriği gizle
        container.classList.remove('active');
        container.style.display = 'none';

        // Overlay'i tekrar göster (blur efektiyle birlikte)
        overlay.style.display = 'flex';
        overlay.style.pointerEvents = 'auto'; // Tıklama olaylarını tekrar etkinleştir!

        // Küçük bir gecikme ile hidden sınıfını kaldırarak geçiş efektini sağla
        setTimeout(() => {
            overlay.classList.remove('hidden');
        }, 10);
    });

    // Sayfa yüklendiğinde, eğer daha önce başlanmışsa overlay'i gizle
    if (localStorage.getItem('startedDenizcemClicker')) {
        console.log('Site previously started, hiding overlay.'); // Debug log
        overlay.classList.add('hidden');
        container.classList.add('active');
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none'; // Yüklenirken de tıklamaları engellemesin
    }
});
