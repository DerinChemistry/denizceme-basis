// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// import { getDatabase, ref, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBqg5uw-53WHdsCS7FFVkRrUI9inw3eRU",
//   authDomain: "denizceme-basis.firebaseapp.com",
//   projectId: "denizceme-basis",
//   storageBucket: "denizceme-basis.firebasestorage.app",
//   messagingSenderId: "278955607022",
//   appId: "1:278955607022:web:75c97de7bdd10858544ff"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// ... (Buradan sonrası, önceki JavaScript kodunun geri kalanı gelecek) ...
document.addEventListener('DOMContentLoaded', () => {
    // ... kalan kodlar ...
});

document.addEventListener('DOMContentLoaded', () => {
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
        overlay.classList.add('hidden'); // Blur ve overlay'i kaldır
        container.classList.add('active'); // Ana içeriği göster

        // Geçiş bittikten sonra overlay'i tamamen gizle
        overlay.addEventListener('transitionend', () => {
            overlay.style.display = 'none';
        }, { once: true });

        // Kullanıcının siteye başladığını işaretle (tekrar geldiğinde direkt başlasın)
        localStorage.setItem('startedDenizcemClicker', 'true');
    });

    // Denizcem resmine tıklanınca
    denizcemImage.addEventListener('click', () => {
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
        // Küçük bir gecikme ile hidden sınıfını kaldırarak geçiş efektini sağla
        setTimeout(() => {
            overlay.classList.remove('hidden');
        }, 10);
    });

    // Bağış butonu linkini ayarla (örnek Patreon linki, sen kendi linkini koymalısın)
    // donateButton.href = "https://www.patreon.com/your_profile"; // HTML'de zaten ayarlı

    // Sayfa yüklendiğinde, eğer daha önce başlanmışsa overlay'i gizle
    if (localStorage.getItem('startedDenizcemClicker')) {
        overlay.classList.add('hidden');
        container.classList.add('active');
        overlay.style.display = 'none';
    }
});
