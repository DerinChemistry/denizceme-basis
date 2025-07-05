document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('overlay');
    const startButton = document.getElementById('startButton');
    const container = document.querySelector('.container');
    const denizcemImage = document.getElementById('denizcemImage');
    const personalClickCountSpan = document.getElementById('personalClickCount');
    const totalClickCountSpan = document.getElementById('totalClickCount');

    // Tarayıcı kapatılıp açılsa bile kişisel sayacı tutmak için localStorage kullanıyoruz
    let personalClickCount = localStorage.getItem('personalClickCountDenizcem') || 0;
    personalClickCountSpan.textContent = personalClickCount;

    // Toplam tıklama sayısı (tüm ziyaretçilerin) için basit bir çözüm.
    // Gerçek bir veritabanı olmadan bu sayıyı sunucu tarafında tutmak mümkün değil.
    // Ancak demo amaçlı veya sınırlı bir senaryo için bu şekilde gösterebiliriz.
    // Her sayfa yüklenişinde artan bir değer gibi davranacak.
    // Gerçek bir web sitesinde bu kısım bir API'ye bağlanmalıydı.
    let totalClickCount = sessionStorage.getItem('totalClickCountDenizcem') || 0;
    totalClickCountSpan.textContent = totalClickCount;


    // Başla butonuna tıklanınca
    startButton.addEventListener('click', () => {
        overlay.classList.add('hidden'); // Blur'u ve overlay'i kaldır
        container.classList.add('active'); // Ana içeriği göster

        // Overlay tamamen gizlendikten sonra display'i none yap
        overlay.addEventListener('transitionend', () => {
            overlay.style.display = 'none';
        }, { once: true });
    });

    // Denizcem resmine tıklanınca
    denizcemImage.addEventListener('click', () => {
        personalClickCount++;
        totalClickCount++;

        personalClickCountSpan.textContent = personalClickCount;
        totalClickCountSpan.textContent = totalClickCount;

        // Sayacı localStorage'a kaydet
        localStorage.setItem('personalClickCountDenizcem', personalClickCount);
        sessionStorage.setItem('totalClickCountDenizcem', totalClickCount); // Sadece oturum süresince tutar

        // Eğer 'Toplam Basma Sayısı'nı kalıcı yapmak istersen, bunu da bir server'a göndermen gerekir.
        // GitHub Pages gibi statik sitelerde bu mümkün değil.
        // Sadece kendi tarayıcında oturum süresince değişen bir "toplam" göstermiş oluyoruz.
        // Gerçek bir "tüm herkesin toplamı" için bir backend (sunucu) ve veritabanı şart.
        // Bu haliyle, her kullanıcı kendi tarayıcısında kendi toplam sayısını görecektir.
    });

    // Sayfa ilk yüklendiğinde, eğer daha önce başlanmışsa overlay'i gizle
    if (localStorage.getItem('startedDenizcemClicker')) {
        overlay.classList.add('hidden');
        container.classList.add('active');
        overlay.style.display = 'none'; // Direkt gizle
    } else {
        // İlk kez geliyorsa başla butonuna basıldığında kaydedelim
        startButton.addEventListener('click', () => {
            localStorage.setItem('startedDenizcemClicker', 'true');
        }, { once: true });
    }
});