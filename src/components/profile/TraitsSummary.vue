<!-- components/profile/TraitsSummary.vue -->
<template>
  <div class="traits-summary">
    <div v-if="!traits || traits.length === 0" class="empty-traits">
      <p>No trait ratings to display yet.</p>
    </div>

    <div v-else class="trait-list">
      <div
          v-for="(traitData, index) in traits"
          :key="traitData.trait.id"
          class="trait-item"
      >
        <div class="trait-rank">{{ index + 1 }}</div>

        <div class="trait-content">
          <div class="trait-header">
            <h3 class="trait-name">{{ traitData.trait.positiveName }}</h3>
            <div class="trait-score">{{ formatScore(traitData.average) }}</div>
          </div>

          <div class="trait-progress">
            <div
                class="trait-progress-bar"
                :style="{ width: `${getProgressWidth(traitData.average)}%` }"
            ></div>
          </div>

          <div class="trait-stats">
            <div class="trait-stat">
              <div class="stat-label">Positive Ratings</div>
              <div class="stat-value">{{ traitData.positiveCount }}</div>
            </div>

            <div class="trait-stat">
              <div class="stat-label">Total Ratings</div>
              <div class="stat-value">{{ traitData.total }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  traits: {
    type: Array,
    default: () => []
  }
})

// Format score to two decimal places
const formatScore = (score) => {
  return (score * 100).toFixed(0) + '%'
}

// Calculate progress bar width (50% is neutral)
const getProgressWidth = (score) => {
  // Convert from -1...1 scale to 0...100 scale
  return ((score + 1) / 2) * 100
}
</script>

<style scoped>
.traits-summary {
  width: 100%;
}

.empty-traits {
  text-align: center;
  padding: 2rem;
  color: #6b7280;
  font-style: italic;
}

.trait-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.trait-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.trait-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: #4f46e5;
  color: white;
  font-weight: 700;
  border-radius: 9999px;
  flex-shrink: 0;
}

.trait-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.trait-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trait-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.trait-score {
  font-size: 0.875rem;
  font-weight: 700;
  color: #4f46e5;
}

.trait-progress {
  height: 0.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
}

.trait-progress-bar {
  height: 100%;
  background-color: #4f46e5;
  border-radius: 9999px;
}

.trait-stats {
  display: flex;
  gap: 1.5rem;
}

.trait-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #111827;
}
</style>
