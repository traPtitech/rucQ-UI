<template>
  <div>
    <div :class="$style.header">目次</div>
    <nav :class="$style.nav">
      <ul :class="$style.list">
        <li
          v-for="heading in headings"
          :key="heading.id"
          :class="[$style.item, { [$style.level1]: heading.level === 1 }]"
        >
          <a
            :href="`#${heading.id}`"
            :class="$style.link"
            :style="getLinkStyle(heading.level)"
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
      block: 'center',
    })
  }
}

const getLinkStyle = (level: number) => ({
  paddingLeft: `${4 + (level - 1) * 12}px`,
  fontSize: `${Math.max(11, 14 - (level - 1))}px`,
  color: level === 1 ? '#333' : '#666',
  fontWeight: level === 1 ? 'bold' : 'normal',
})
</script>

<style module>
.header {
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.nav {
  font-size: 14px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.link {
  display: block;
  text-decoration: none;
  padding: 6px 0;
  border-radius: 2px;
  line-height: 1.3;
}

.link:hover {
  color: #0066ff !important;
  background-color: rgba(0, 102, 255, 0.05);
}
</style>
