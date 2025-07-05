document.addEventListener('DOMContentLoaded', () => {
    // HTML elementlerini al
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.container');
    const denizcemImage = document.getElementById('denizcemImage');
    const personalClickCountSpan = document.getElementById('personalClickCount');
    const restartButton = document.getElementById('restartButton');
    const donateButton = document.querySelector('.donate-button'); // Bağış butonu

    // Onay modalı elementleri
    const confirmModal = document.getElementById('confirmModal');
    const confirmYesButton = document.getElementById('confirmYes');
    const confirmNoButton = document.getElementById('confirmNo');

    // Kişisel tıklama sayısını localStorage'dan al (tarayıcı kapansa da kalıcı)
    let personalClickCount = localStorage.getItem('personalClickCountDenizcem') || 0;
    personalClickCountSpan.textContent = personalClickCount;

    // Sayfa yüklendiğinde, eğer daha önce başlanmışsa overlay'i gizle
    // Aksi takdirde overlay'i göster ve ana içeriği gizle
    if (localStorage.getItem('startedDenizcemClicker')) {
        overlay.classList.add('hidden');
        overlay.style.pointerEvents = 'none';
        overlay.style.display = 'none'; // Direkt gizle

        container.classList.add('active');
        container.style.display = 'flex'; // Container'ı göster
    } else {
        // İlk kez geliyorsa veya yeniden başlatıldıysa overlay'i göster
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden');
        overlay.style.pointerEvents = 'auto';

        container.style.display = 'none'; // Ana içeriği gizle
        container.classList.remove('active');
    }

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

        // Tıklama animasyonu
        denizcemImage.style.transform = 'scale(0.97)';
        setTimeout(() => {
            denizcemImage.style.transform = 'scale(1)';
        }, 100);
    });

    // "Yeniden Başla" butonuna tıklanınca (Onay modalını göster)
    restartButton.addEventListener('click', () => {
        confirmModal.classList.add('visible'); // Modalı görünür yap
    });

    // Onay modalındaki "Evet, eminim" butonuna tıklanınca
    confirmYesButton.addEventListener('click', () => {
        // Kişisel sayacı sıfırla ve localStorage'dan sil
        personalClickCount = 0;
        personalClickCountSpan.textContent = personalClickCount;
        localStorage.removeItem('personalClickCountDenizcem');
        localStorage.removeItem('startedDenizcemClicker'); // Başlangıç ekranına dönmek için

        // Modalı gizle
        confirmModal.classList.remove('visible');

        // Ana içeriği gizle
        container.classList.remove('active');
        container.style.display = 'none';

        // Overlay'i tekrar göster (blur efektiyle birlikte)
        overlay.style.display = 'flex';
        overlay.classList.remove('hidden'); // Gizli sınıfını kaldır
        overlay.style.pointerEvents = 'auto'; // Tıklama olaylarını tekrar etkinleştir!
    });

    // Onay modalındaki "Hayır, vazgeçtim" butonuna tıklanınca
    confirmNoButton.addEventListener('click', () => {
        confirmModal.classList.remove('visible'); // Modalı gizle
    });
});
