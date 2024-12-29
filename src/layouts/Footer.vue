<script setup></script>

<template>
    <div class="footer">
        <img src="/src/assets/images/gray-logo.svg" alt="logo" class="logo" />
        <div class="social-logo">
            <img src="/src/assets/images/Vk.svg" alt="Vk" />
            <img src="/src/assets/images/Pinterest.svg" alt="Pinterest" />
            <img src="/src/assets/images/Instagram.svg" alt="Instagram" />
            <img src="/src/assets/images/Twitter.svg" alt="Twitter" />
            <img src="/src/assets/images/Facebook.svg" alt="Facebook" />
        </div>
        <p>All Rights Reserved 2018 3layers</p>
    </div>
</template>

<style scoped>
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
}

.footer .logo {
    width: 80px;
    height: 20px;
}

.footer .social-logo {
    display: flex;
    align-items: center;
}

.footer .social-logo img {
    width: 16px;
    height: 16px;
    margin-right: 6px;
}

.footer p {
    font-size: 1.2rem;
    color: var(--gray-color);
}

@media (max-width: 768px) {
    .footer {
        flex-direction: column;
        align-items: center;
    }

    .footer .social-logo {
        margin-top: 10px;
    }

    .footer p {
        margin-top: 10px;
    }
}

@media (max-width: 480px) {
    .footer p {
        font-size: 1rem;
    }
}
</style>
