<!-- components/profile/CircleStatus.vue -->
<template>
  <div class="circle-status">
    <div class="circle-header">
      <h3 class="circle-name">{{ circleName }}</h3>
      <div
          class="status-indicator"
          :class="statusClass"
          :title="statusTitle"
      >
        <svg v-if="status.status === 'positive'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="status.status === 'negative'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clip-rule="evenodd" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="icon">
          <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div v-if="!status.hasEnoughRatings" class="pending-status">
      <p class="pending-message">
        Waiting for more ratings
      </p>
      <div class="pending-count">
        <span class="current">{{ getRatingCount() }}</span> / <span class="needed">5</span> ratings
      </div>
    </div>

    <div v-else class="status-content">
      <div class="percentage-display">
        <div class="percentage-value">{{ Math.round(status.positivePercentage) }}%</div>
        <div class="percentage-label">Positive</div>
      </div>

      <div class="rating-bar">
        <div
            class="positive-bar"
            :style="{ width: `${status.positivePercentage}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRatings } from '../../composables/useRatings'

// Props
const props = defineProps({
  circleName: {
    type: String,
    required: true
  },
  status: {
    type: Object,
    required: true,
    default: () => ({
      status: 'neutral',
      hasEnoughRatings: false,
      positivePercentage: 0
    })
  }
})

// Get ratings composable
const { userRatings } = useRatings()

// Computed properties
const statusClass = computed(() => {
  if (!props.status.hasEnoughRatings) return 'neutral'
  return props.status.status
})

const statusTitle = computed(() => {
  if (!props.status.hasEnoughRatings) {
    return 'Waiting for at least 5 ratings'
  }

  return props.status.status === 'positive'
      ? 'Mostly positive perception'
      : 'Mostly negative perception'
})

// Get the total number of ratings for this circle
const getRatingCount = () => {
  if (!props.status.circleId) return 0

  const circleRatings = userRatings.value[props.status.circleId]
  if (!circleRatings) return 0

  let count = 0
  Object.values(circleRatings).forEach(ratings => {
    count += ratings.length
  })

  return count
}
</script>

<style scoped>
.circle-status {
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.circle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.circle-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.status-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

.status-indicator.positive {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-indicator.negative {
  background-color: #fee2e2;
  color: #dc2626;
}

.status-indicator.neutral {
  background-color: #f3f4f6;
  color: #9ca3af;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.pending-status {
  text-align: center;
  padding: 1rem 0;
}

.pending-message {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.pending-count {
  font-size: 0.875rem;
  font-weight: 600;
}

.current {
  color: #4f46e5;
}

.needed {
  color: #6b7280;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.percentage-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.percentage-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.percentage-label {
  font-size: 0.75rem;
  color: #6b7280;
}

.rating-bar {
  height: 0.5rem;
  background-color: #fee2e2;
  border-radius: 9999px;
  overflow: hidden;
}

.positive-bar {
  height: 100%;
  background-color: #16a34a;
  border-radius: 9999px;
}
</style>
