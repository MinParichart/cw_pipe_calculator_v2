<template>
  <div class="flow-tree-node">
    <!-- Node Content -->
    <div
      class="node-card"
      :class="getNodeCardClass()"
      @click="handleClick"
    >
      <!-- Source/fixture/junction node -->
      <div v-if="node.type === 'node'" class="node-content">
        <div class="flex items-center gap-3">
          <!-- Node Icon -->
          <div class="node-icon" :class="getNodeIconClass()">
            <svg v-if="node.node.type === 'SOURCE'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg v-else-if="node.node.type === 'FIXTURE'" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>

          <!-- Node Info -->
          <div class="flex-1">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-900">{{ node.node.label || `Node ${node.node.id}` }}</span>
              <span class="px-2 py-0.5 text-xs rounded-full" :class="getNodeBadgeClass()">
                {{ node.node.type }}
              </span>
            </div>

            <!-- Fixtures count if fixture node -->
            <div v-if="node.node.type === 'FIXTURE' && node.node.fixtures" class="text-xs text-gray-600 mt-1">
              {{ node.node.fixtures.length }} สุขภัณฑ์ ({{ calculateNodeFU(node.node) }} FU)
            </div>
          </div>
        </div>
      </div>

      <!-- Pipe Content -->
      <div v-else-if="node.type === 'pipe'" class="pipe-content">
        <div class="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors" @click.stop="handlePipeClick(node.pipe)">
          <!-- Pipe Icon -->
          <div class="pipe-icon">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          <!-- Pipe Info -->
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="font-medium text-gray-700">
                  {{ node.pipeLoad.fromNode }} → {{ node.pipeLoad.toNode }}
                </span>
                <span v-if="node.pipe.isCriticalPath" class="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-800">
                  Critical Path
                </span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="text-gray-600">{{ node.pipeLoad.length.toFixed(1) }}m</span>
                <span class="px-3 py-1 bg-blue-600 text-white rounded-full font-bold">
                  {{ node.pipeLoad.totalFU }} FU
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Children (recursive) -->
    <div v-if="hasChildren" class="children-container ml-8 mt-2">
      <div class="connector-line"></div>
      <div class="space-y-2">
        <FlowTreeNode
          v-for="(child, index) in node.children"
          :key="child.id || child.pipe?.id"
          :node="child"
          :level="level + 1"
          @click="selectNode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  node: any
  level: number
}>()

const emit = defineEmits<{
  click: [node: any]
}>()

const hasChildren = computed(() => {
  return props.node.children && props.node.children.length > 0
})

const getNodeCardClass = () => {
  if (props.node.type === 'node') {
    if (props.node.node.type === 'SOURCE') {
      return 'bg-blue-50 border-blue-200'
    } else if (props.node.node.type === 'FIXTURE') {
      return 'bg-purple-50 border-purple-200'
    } else {
      return 'bg-gray-50 border-gray-200'
    }
  }
  return 'bg-white border-gray-200'
}

const getNodeIconClass = () => {
  if (props.node.node.type === 'SOURCE') {
    return 'bg-blue-500 text-white'
  } else if (props.node.node.type === 'FIXTURE') {
    return 'bg-purple-500 text-white'
  } else {
    return 'bg-gray-500 text-white'
  }
}

const getNodeBadgeClass = () => {
  if (props.node.node.type === 'SOURCE') {
    return 'bg-blue-100 text-blue-800'
  } else if (props.node.node.type === 'FIXTURE') {
    return 'bg-purple-100 text-purple-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}

const calculateNodeFU = (node: any) => {
  if (!node.fixtures) return 0
  return node.fixtures.reduce((sum: number, f: any) => sum + (f.totalFU || 0), 0)
}

const handleClick = () => {
  if (props.node.type === 'pipe') {
    emit('click', props.node.pipe)
  }
}

const handlePipeClick = (pipe: any) => {
  emit('click', pipe)
}

const selectNode = (node: any) => {
  emit('click', node)
}
</script>

<style scoped>
.flow-tree-node {
  position: relative;
}

.node-card {
  border: 2px solid;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.2s;
}

.node-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.children-container {
  position: relative;
}

.connector-line {
  position: absolute;
  left: 24px;
  top: -16px;
  width: 2px;
  height: calc(100% - 16px);
  background: linear-gradient(to bottom, #d1d5db, #9ca3af);
}

.node-icon,
.pipe-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pipe-content {
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px;
  background: white;
  transition: all 0.2s;
}

.pipe-content:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
