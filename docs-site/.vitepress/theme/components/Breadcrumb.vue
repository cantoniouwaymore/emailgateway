<template>
  <nav aria-label="Breadcrumb" class="breadcrumb-nav">
    <ol class="breadcrumb-list">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <a v-if="index === breadcrumbs.length - 1" href="#" @click.prevent="scrollToTop" class="breadcrumb-link">{{ crumb.title }}</a>
        <span v-else class="breadcrumb-text">{{ crumb.title }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'

const { site } = useData()
const route = useRoute()

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const breadcrumbs = computed(() => {
  const path = route.path
  console.log('Current path:', path) // Debug log
  const segments = path.split('/').filter(Boolean)
  console.log('Segments:', segments) // Debug log
  const crumbs = []
  
  // Skip home page - don't show breadcrumbs for root
  if (path === '/' || path === '/index.html') {
    return []
  }
  
  // Build breadcrumbs from path segments
  let currentPath = ''
  let cleanPath = ''
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    
    // Skip index files
    if (segment === 'index') return
    
    // Remove .html extension for processing
    const cleanSegment = segment.replace(/\.html$/, '')
    cleanPath += `/${cleanSegment}`
    
    // Get title from route or segment
    let title = cleanSegment
    if (cleanSegment === 'api') title = 'API Reference'
    else if (cleanSegment === 'guides') title = 'Guides'
    else if (cleanSegment === 'admin') title = 'Admin Dashboard'
    else if (cleanSegment === 'quick-start') title = 'Quick Start'
    else if (cleanSegment === 'architecture') title = 'Architecture'
    else if (cleanSegment === 'deployment') title = 'Deployment'
    else if (cleanSegment === 'developer') title = 'Developer Guide'
    else if (cleanSegment === 'templates') title = 'Templates'
    else if (cleanSegment === 'routee') title = 'Routee Integration'
    else if (cleanSegment === 'locale-system') title = 'Locale System'
    else if (cleanSegment === 'cleanup') title = 'Cleanup & Maintenance'
    else if (cleanSegment === 'monorepo-structure') title = 'Monorepo Structure'
    else {
      // For other segments, clean up the name
      title = cleanSegment.replace(/-/g, ' ')
      title = title.charAt(0).toUpperCase() + title.slice(1)
    }
    
    console.log(`Adding breadcrumb: ${title} (${cleanPath})`) // Debug log
    
    // Breadcrumbs are purely informational - no navigation
    crumbs.push({
      title,
      link: null
    })
  })
  
  console.log('Final breadcrumbs:', crumbs) // Debug log
  return crumbs
})
</script>

<style scoped>
.breadcrumb-nav {
  position: absolute;
  left: 590px; /* VitePress sidebar width + logo space */
  top: 0;
  right: 0px; /* Reduced right offset */
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  background: transparent;
  border: none;
  margin: 0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.25rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-text {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.breadcrumb-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--vp-c-bg-soft);
  transition: background-color 0.2s;
  cursor: pointer;
}

.breadcrumb-link:hover {
  background-color: var(--vp-c-bg-soft-hover);
}

.breadcrumb-separator {
  color: var(--vp-c-text-3);
  margin: 0 0.25rem;
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .breadcrumb-nav {
    left: 0;
    position: static;
    height: auto;
    padding: 0.5rem 1rem;
    border-bottom: 1px solid var(--vp-c-divider);
    background-color: var(--vp-c-bg-soft);
    margin-bottom: 1rem;
  }
}
</style>
