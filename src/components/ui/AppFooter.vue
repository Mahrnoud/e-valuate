<!-- components/ui/AppFooter.vue -->
<template>
  <footer class="app-footer">
    <div class="footer-container">
      <div class="footer-content">
        <p class="copyright">&copy; {{ currentYear }} Character Rating. All rights reserved.</p>
        <div class="footer-links">
          <a href="#" class="footer-link">Privacy Policy</a>
          <a href="#" class="footer-link">Terms of Service</a>
          <a href="#" class="footer-link">Contact Us</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

// Current year for copyright
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.app-footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  margin-top: 3rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media (max-width: 640px) {
  .footer-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

.copyright {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-link {
  color: #4b5563;
  font-size: 0.875rem;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-link:hover {
  color: #4f46e5;
  text-decoration: underline;
}
</style>
