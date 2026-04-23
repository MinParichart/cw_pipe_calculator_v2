<template>
  <div
    class="fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out shadow-xl"
    :class="{ '-translate-x-full': !isOpen, 'translate-x-0': isOpen }"
  >
    <!-- Sidebar Header -->
    <div class="flex items-center justify-between h-16 px-6 border-b">
      <div class="flex items-center">
        <svg
          class="h-8 w-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
        <span class="ml-2 text-lg font-bold text-gray-900"> CW Pipe Calc </span>
      </div>
      <!-- Close button (mobile only) -->
      <button
        @click="$emit('close')"
        class="md:hidden p-1 rounded-md hover:bg-gray-100"
      >
        <svg
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Sidebar Content -->
    <div class="overflow-y-auto h-[calc(100vh-4rem)] px-3 py-4">
      <!-- Main Navigation -->
      <div class="mb-6">
        <p
          class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          เมนูหลัก
        </p>
        <nav class="space-y-1">
          <!-- <NuxtLink
            to="/"
            class="sidebar-link"
            :class="{
              'sidebar-link-active': isActive('/') && route.path === '/'
            }"
            @click="$emit('navigate')"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>หน้าแรก</span>
          </NuxtLink> -->

          <!-- <NuxtLink
            to="/dashboard"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive('/dashboard') }"
            @click="$emit('navigate')"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            <span>Dashboard</span>
          </NuxtLink> -->

          <NuxtLink
            to="/projects"
            class="sidebar-link flex items-center justify-between group"
            :class="{
              'sidebar-link-active':
                isActive('/projects') && route.path !== '/projects/new'
            }"
            @click="$emit('navigate')"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
              <span>โปรเจกต์</span>
            </div>
          </NuxtLink>

          <!-- <NuxtLink
            to="/calculator"
            class="sidebar-link flex items-center justify-between group"
            :class="{ 'sidebar-link-active': isActive('/calculator') }"
            @click="$emit('navigate')"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>คำนวณขนาดท่อ</span>
            </div>
          </NuxtLink> -->
        </nav>
      </div>

      <!-- Tools Section -->
      <div class="mb-6">
        <p
          class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          เครื่องมือ
        </p>
        <nav class="space-y-1">
          <NuxtLink
            to="/projects/new"
            class="sidebar-link flex items-center justify-between group"
            :class="{ 'sidebar-link-active': isActive('/projects/new') }"
            @click="$emit('navigate')"
          >
            <div class="flex items-center">
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span>สร้างโปรเจกต์ใหม่</span>
            </div>
            <span
              class="px-2 py-0.5 text-xs font-semibold rounded bg-blue-600 text-white group-hover:bg-blue-600-dark transition-colors"
            >
              New
            </span>
          </NuxtLink>

          <!-- <a
            href="/calculator#hybrid-sizing"
            class="sidebar-link flex items-center justify-between group"
            @click="$emit('navigate')"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Hybrid Pipe Sizing</span>
            </div>
            <span class="px-2 py-0.5 text-xs font-semibold rounded bg-purple-600 text-white group-hover:bg-purple-600-dark transition-colors">
              เปรียบเทียบ
            </span>
          </a> -->

          <!-- <a
            href="/calculator#auto-suggest"
            class="sidebar-link flex items-center justify-between group"
            @click="$emit('navigate')"
          >
            <div class="flex items-center">
              <svg class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>Auto-Suggest Upsizing</span>
            </div>
            <span class="px-2 py-0.5 text-xs font-semibold rounded bg-orange-600 text-white group-hover:bg-orange-600-dark transition-colors">
              วิเคราะห์
            </span>
          </a> -->

          <NuxtLink
            to="/reference"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive('/reference') }"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span>ตารางอ้างอิง</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Settings Section -->
      <div>
        <p
          class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2"
        >
          ตั้งค่า
        </p>
        <nav class="space-y-1">
          <!-- <NuxtLink
            to="/settings"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive('/settings') }"
            @click="$emit('navigate')"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>ตั้งค่าระบบ</span>
          </NuxtLink> -->

          <NuxtLink
            to="/profile"
            class="sidebar-link"
            :class="{ 'sidebar-link-active': isActive('/profile') }"
            @click="$emit('navigate')"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>โปรไฟล์</span>
          </NuxtLink>

          <!-- <a
            href="https://github.com/anthropics/cw-pipe-calculator"
            target="_blank"
            rel="noopener noreferrer"
            class="sidebar-link"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>ความช่วยเหลือ</span>
            <svg
              class="h-4 w-4 ml-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a> -->
        </nav>
      </div>
    </div>

    <!-- User Info (Display Only) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
      <div class="flex items-center">
        <div
          class="h-10 w-10 rounded-full bg-blue-600 bg-opacity-10 flex items-center justify-center"
        >
          <span class="text-sm font-medium text-blue-600">
            {{ userInitials }}
          </span>
        </div>
        <div class="ml-3 min-w-0 flex-1">
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ user?.name || "ผู้ใช้" }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ user?.email || "" }}
          </p>
        </div>
        <NuxtLink
          to="/profile"
          class="p-1.5 rounded-md hover:bg-gray-200 text-gray-500 hover:text-blue-600 transition-colors"
          title="ตั้งค่าโปรไฟล์"
          @click="$emit('navigate')"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </NuxtLink>
      </div>
    </div>

    <!-- Overlay (mobile) -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
        @click="$emit('close')"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();
const route = useRoute();

defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  close: [];
  navigate: [];
}>();

const userInitials = computed(() => {
  if (!user.value?.name) return "U";
  return user.value.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

const isActive = (path: string) => {
  return route.path.startsWith(path);
};
</script>

<style scoped>
.sidebar-link {
  @apply flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors;
}

.sidebar-link-active {
  @apply bg-blue-50 bg-opacity-10 text-blue-600;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
