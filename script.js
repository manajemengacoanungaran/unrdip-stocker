(function() {
    // Ambil semua elemen dengan class clickable-link
    const clickableItems = document.querySelectorAll('.clickable-link');
    
    // Fungsi untuk membuka link tanpa notifikasi apapun
    function openLink(url, itemName) {
        if (!url) return;
        if (url.startsWith('http://') || url.startsWith('https://')) {
            // Langsung buka di tab baru tanpa notifikasi
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.warn('URL tidak valid:', url);
        }
    }

    // Pasang event listener untuk setiap kartu (tanpa toast/notifikasi)
    clickableItems.forEach(item => {
        let linkUrl = item.getAttribute('data-link');
        let nameAttr = item.getAttribute('data-name');
        
        if (!linkUrl) {
            item.setAttribute('data-link', 'https://www.miegacoan.com');
            if(!nameAttr) item.setAttribute('data-name', 'Mie Gacoan');
            linkUrl = 'https://www.miegacoan.com';
        }
        
        // Event klik
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const finalUrl = item.getAttribute('data-link') || 'https://www.miegacoan.com';
            const finalName = item.getAttribute('data-name') || 'Menu';
            openLink(finalUrl, finalName);
        });
        
        // Aksesibilitas keyboard
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const finalUrl = item.getAttribute('data-link') || 'https://www.miegacoan.com';
                const finalName = item.getAttribute('data-name') || 'Menu';
                openLink(finalUrl, finalName);
            }
        });
    });
    
    
    console.log('STOCKER UNRDIP');
})();