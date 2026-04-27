window.addEventListener('scroll', () => {
    const navContent = document.getElementById('nav-content');
    const mainNav = document.getElementById('main-nav');
    
    if (window.scrollY > 20) {
        navContent.classList.add('nav-scrolled');
        mainNav.style.transform = 'translateX(-50%) translateY(-10px)';
        mainNav.style.width = '90%';
    } else {
        navContent.classList.remove('nav-scrolled');
        mainNav.style.transform = 'translateX(-50%) translateY(0)';
        mainNav.style.width = '95%';
    }
});