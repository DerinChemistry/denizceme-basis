// Firebase SDK'sını içe aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// BURAYA KENDİ FIREBASE YAPILANDIRMA KODUNU YAPIŞTIR!
// Örnek:
const firebaseConfig = {
  apiKey: "AIzaSyBqg5uw-53WHdssC5TfFVKkrUI9inw3eRU",
  authDomain: "denizceme-basis.firebaseapp.com",
  projectId: "denizceme-basis",
  storageBucket: "denizceme-basis.firebasestorage.app",
  messagingSenderId: "278955607022",
  appId: "1:278955667922:web:75c97de7bdd10858544fF", 
  databaseURL: "https://denizceme-basis-default-rtdb.firebaseio.com" 
};

// Firebase SDK importları kaldırıldı, çünkü toplam basma sayısı kaldırıldı.

document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlerini al
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.container');
    const denizcemImage = document.getElementById('denizcemImage');
    const personalClickCountSpan = document.getElementById('personalClickCount');
    // const totalClickCountSpan = document.getElementById('totalClickCount'); // Kaldırıldı
    const restartButton = document.getElementById('restartButton');
    const donateButton = document.querySelector('.donate-button'); // Bağış butonu

    // Kişisel tıklama sayısını localStorage'dan al (tarayıcı kapansa da kalıcı)
    let personalClickCount = localStorage.getItem('personalClickCountDenizcem') || 0;
    personalClickCountSpan.textContent = personalClickCount;

    // Firebase ile ilgili kodlar kaldırıldı.
    // const totalClicksRef = ref(database, 'totalClicks'); // Kaldırıldı
    // onValue(totalClicksRef, (...) => {...}); // Kaldırıldı

    // "Başla" butonuna tıklanınca
    startButton.addEventListener('click', () => {
        // Overlay'i gizle ve tıklama olaylarını engelle
        overlay.classList.add('hidden');
        overlay.style.pointerEvents = 'none';

        // Ana içeriği göster
        container.classList.add('active');
        container.style.display = 'flex'; // Display'i flex olarak ayarla

        // Geçiş bittikten sonra overlay'i tamamen gizle
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 550); // CSS geçiş süresinden biraz daha uzun

        // Kullanıcının siteye başladığını işaretle
        localStorage.setItem('startedDenizcemClicker', 'true');
    });

    // Denizcem resmine tıklanınca
    denizcemImage.addEventListener('click', () => {
        // Kişisel sayacı artır ve güncelle
        personalClickCount++;
        personalClickCountSpan.textContent = personalClickCount;
        localStorage.setItem('personalClickCountDenizcem', personalClickCount);

        // Firebase ile ilgili kodlar kaldırıldı.
        // runTransaction(totalClicksRef, (...) => {...}); // Kaldırıldı

        // Tıklama animasyonu
        denizcemImage.style.transform = 'scale(0.97)';
        setTimeout(() => {
            denizcemImage.style.transform = 'scale(1)';
        }, 100);
    });

    // "Yeniden Başla" butonuna tıklanınca
    restartButton.addEventListener('click', () => {
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
        overlay.classList.remove('hidden'); // Gizli sınıfını kaldır
        overlay.style.pointerEvents = 'auto'; // Tıklama olaylarını tekrar etkinleştir!

        // Küçük bir gecikme ile hidden sınıfını kaldırarak geçiş efektini sağla (zaten kaldırıldı)
        // setTimeout(() => { overlay.classList.remove('hidden'); }, 10); // Gerek kalmadı
    });

    // Sayfa yüklendiğinde, eğer daha önce başlanmışsa overlay'i gizle
    if (localStorage.getItem('startedDenizcemClicker')) {
        overlay.classList.add('hidden');
        container.classList.add('active');
        overlay.style.display = 'none';
        overlay.style.pointerEvents = 'none';
        container.style.display = 'flex'; // Container'ı göster
    } else {
        // Eğer ilk kez geliyorsa veya yeniden başlatıldıysa overlay'i göster
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
        overlay.style.pointerEvents = 'auto';
        container.style.display = 'none';
        container.classList.remove('active');
    }
});

