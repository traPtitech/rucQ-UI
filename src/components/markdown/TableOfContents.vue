<template>
  <div :class="$style.container">
    <div :class="$style.header">目次</div>
    <nav :class="$style.nav">
      <ul :class="$style.list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="[$style.item, $style[`level${heading.level}`]]"
        >
          <a
            :href="`#${heading.id}`"
            :class="$style.link"
            @click.prevent="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
type HeadingInfo = {
  id: string
  level: number
  text: string
}

defineProps<{
  headings: HeadingInfo[]
}>()

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}
</script>

<style module>
.container {
  background: #f8f9fa;
  border-left: 3px solid #0066ff;
  border-radius: 4px;
  padding: 16px;
  height: fit-content;
  max-height: 70vh;
  overflow-y: auto;
  position: sticky;
  top: 20px;
}

.header {
  font-weight: bold;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.nav {
  font-size: 13px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  margin-bottom: 4px;
}

.link {
  display: block;
  color: #666;
  text-decoration: none;
  padding: 4px 0;
  border-radius: 2px;
  transition: all 0.2s ease;
  line-height: 1.3;
}

.link:hover {
  color: #0066ff;
  background-color: rgba(0, 102, 255, 0.05);
  padding-left: 8px;
}

.level1 {
  font-weight: bold;
}

.level1 .link {
  font-size: 14px;
  color: #333;
}

.level2 .link {
  padding-left: 12px;
  font-size: 13px;
}

.level3 .link {
  padding-left: 24px;
  font-size: 12px;
}

.level4 .link {
  padding-left: 36px;
  font-size: 12px;
}

.level5 .link {
  padding-left: 48px;
  font-size: 11px;
}

.level6 .link {
  padding-left: 60px;
  font-size: 11px;
}
</style>
