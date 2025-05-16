<!-- components/profile/ProfileHeader.vue -->
<template>
  <div class="profile-header">
    <div class="profile-container">
      <div class="profile-avatar">
        <!-- Display initials if no profile photo -->
        <div class="avatar-initials">
          {{ getInitials() }}
        </div>
      </div>

      <div class="profile-info">
        <h1 class="profile-name">{{ user.firstName }} {{ user.lastName }}</h1>
        <p class="profile-tagline" v-if="topTraits && topTraits.length > 0">
          Known for being
          <span class="trait-highlight">{{ topTraits[0]?.trait?.positiveName || 'Not yet rated' }}</span>
          <span v-if="topTraits.length > 1">
            and <span class="trait-highlight">{{ topTraits[1]?.trait?.positiveName }}</span>
          </span>
        </p>
        <p class="profile-tagline" v-else>
          Share your profile with others to discover your personality traits
        </p>
      </div>
    </div>

    <div class="profile-stats">
      <div class="stat-item">
        <div class="stat-label">Ratings Received</div>
        <div class="stat-value">{{ totalRatings }}</div>
      </div>

      <div class="stat-divider"></div>

      <div class="stat-item">
        <div class="stat-label">Positive Ratings</div>
        <div class="stat-value">{{ positivePercentage }}%</div>
      </div>

      <div class="stat-divider"></div>

      <div class="stat-item">
        <div class="stat-label">Social Circles</div>
        <div class="stat-value">{{ circlesCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRatings } from '../../composables/useRatings'
import { useContacts } from '../../composables/useContacts'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  topTraits: {
    type: Array,
    default: () => []
  }
})

// Get composables
const { userRatings } = useRatings()
const { circles } = useContacts()

// Computed properties
const circlesCount = computed(() => {
  return circles.value.length
})

const totalRatings = computed(() => {
  let count = 0

  // Count all ratings across all circles and traits
  Object.values(userRatings.value).forEach(circleRatings => {
    Object.values(circleRatings).forEach(ratings => {
      count += ratings.length
    })
  })

  return count
})

const positivePercentage = computed(() => {
  let positiveCount = 0
  let totalCount = 0

  // Count positive ratings across all circles and traits
  Object.values(userRatings.value).forEach(circleRatings => {
    Object.values(circleRatings).forEach(ratings => {
      ratings.forEach(rating => {
        totalCount++
        if (rating > 0) positiveCount++
      })
    })
  })

  if (totalCount === 0) return 0

  return Math.round((positiveCount / totalCount) * 100)
})

// Get user initials for avatar
const getInitials = () => {
  if (!props.user) return '?'

  const firstName = props.user.firstName || ''
  const lastName = props.user.lastName || ''

  return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
}
</script>

<style scoped>
.profile-header {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar {
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  background-color: #f3f4f6;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-initials {
  font-size: 2rem;
  font-weight: 700;
  color: #4f46e5;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.profile-tagline {
  color: #6b7280;
  font-size: 1rem;
}

.trait-highlight {
  color: #4f46e5;
  font-weight: 600;
}

.profile-stats {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}

.stat-divider {
  width: 1px;
  height: 2.5rem;
  background-color: #e5e7eb;
}

@media (max-width: 640px) {
  .profile-container {
    flex-direction: column;
    text-align: center;
  }

  .profile-stats {
    flex-direction: column;
    gap: 1rem;
  }

  .stat-divider {
    width: 80%;
    height: 1px;
  }
}
</style>
