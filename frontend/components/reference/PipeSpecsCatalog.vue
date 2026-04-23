<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <svg class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <div>
          <h2 class="text-lg font-medium text-gray-900">Pipe Specs Catalog (ฐานข้อมูลท่อ PVC)</h2>
          <p class="text-sm text-gray-500">ขนาดและความหนาของท่อ PVC ตามมาตรฐานอุตสาหกรรม (TIS. 17-2532)</p>
        </div>
      </div>
      <button
        @click="exportData"
        class="btn btn-secondary text-sm flex items-center gap-1"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export
      </button>
    </div>

    <!-- Legend -->
    <div class="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-200">
      <h4 class="text-sm font-semibold text-blue-900 mb-2">คำอธิบาย:</h4>
      <ul class="text-xs text-blue-800 space-y-1">
        <li>• <strong>DN (ขนาดเส้นผ่านศูนย์กลางเฉลี่ย):</strong> ขนาดท่อตามเกณฑ์มาตรฐาน (Nominal Diameter)</li>
        <li>• <strong>OD (เส้นผ่านศูนย์กลางภายนอก):</strong> ค่าเฉลี่ยเป็นมิลลิเมตร</li>
        <li>• <strong>ความหนา (Wall Thickness):</strong> ค่าเฉลี่ย ± ค่าความคลาดเคลื่อน (Tolerance)</li>
        <li>• <strong>ชั้นคุณภาพ (Pressure Class):</strong> PVC 5, 7, 8.5, 10.5, 13.5 (kg/cm² หรือ bar)</li>
      </ul>
    </div>

    <!-- PVC Pipes Table -->
    <div class="overflow-x-auto border rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th rowspan="2" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              ชื่อขนาด<br>(DN/Size)<br>mm
            </th>
            <th rowspan="2" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              ชื่อขนาด<br>(DN/Size)<br>inches
            </th>
            <th rowspan="2" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              เส้นผ่านศูนย์กลาง<br>ภายนอกเฉลี่ย (OD)<br>mm
            </th>
            <th colspan="5" class="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              ชั้นคุณภาพ (Pressure Class) - ความหนา (mm)
            </th>
          </tr>
          <tr>
            <th class="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">
              PVC 5
            </th>
            <th class="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">
              PVC 7
            </th>
            <th class="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">
              PVC 8.5
            </th>
            <th class="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">
              PVC 10.5
            </th>
            <th class="px-2 py-2 text-center text-xs font-medium text-blue-600 bg-blue-50">
              PVC 13.5
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="pipe in filteredPipes"
            :key="pipe.dn"
            class="hover:bg-blue-50 transition-colors"
          >
            <td class="px-3 py-2 whitespace-nowrap text-center">
              <span class="font-bold text-gray-900">{{ pipe.dn }}</span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-center">
              <span class="font-bold text-gray-900">{{ pipe.in }}</span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-center text-sm font-medium text-gray-900">
              {{ pipe.od }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-700">
              {{ pipe.pvc5 || '-' }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-700">
              {{ pipe.pvc7 || '-' }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-700">
              {{ pipe.pvc85 || '-' }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-700">
              {{ pipe.pvc105 || '-' }}
            </td>
            <td class="px-2 py-2 whitespace-nowrap text-center text-sm text-gray-700">
              {{ pipe.pvc135 || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredPipes.length === 0" class="text-center py-12">
      <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-gray-500">ไม่พบข้อมูลท่อที่ค้นหา</p>
    </div>

    <!-- Summary -->
    <div class="mt-4 text-sm text-gray-600 text-center">
      แสดงทั้งหมด {{ filteredPipes.length }} ขนาด (DN) | มาตรฐาน: TIS. 17-2532
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  select: [pipe: any]
}>()

const toast = useToast()

// State
const searchQuery = ref('')

// PVC Pipes Data - Thai Industrial Standard TIS. 17-2532
const pvcPipes = [
  { dn: 18, in: '½', od: '22±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 20, in: '¾', od: '26±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.3±0.15', pvc135: '2.6±0.15' },
  { dn: 25, in: '1', od: '34±0.15', pvc5: '-', pvc7: '1.5±0.15', pvc85: '2.0±0.15', pvc105: '2.4±0.20', pvc135: '3.0±0.25' },
  { dn: 35, in: '1¼', od: '42±0.15', pvc5: '1.5±0.15', pvc7: '1.8±0.15', pvc85: '2.2±0.20', pvc105: '2.6±0.20', pvc135: '3.1±0.25' },
  { dn: 40, in: '1½', od: '48±0.15', pvc5: '1.5±0.15', pvc7: '1.9±0.15', pvc85: '2.3±0.20', pvc105: '2.8±0.20', pvc135: '3.5±0.25' },
  { dn: 55, in: '2', od: '60±0.15', pvc5: '1.8±0.20', pvc7: '2.4±0.20', pvc85: '2.9±0.25', pvc105: '3.5±0.25', pvc135: '4.3±0.30' },
  { dn: 65, in: '2½', od: '76±0.20', pvc5: '2.2±0.20', pvc7: '2.9±0.20', pvc85: '3.5±0.25', pvc105: '4.4±0.30', pvc135: '5.4±0.30' },
  { dn: 80, in: '3', od: '89±0.20', pvc5: '2.6±0.20', pvc7: '3.5±0.25', pvc85: '4.1±0.30', pvc105: '5.2±0.35', pvc135: '6.4±0.40' },
  { dn: 100, in: '4', od: '114±0.30', pvc5: '3.2±0.20', pvc7: '4.3±0.25', pvc85: '5.2±0.30', pvc105: '6.5±0.35', pvc135: '8.1±0.50' },
  { dn: 125, in: '5', od: '140±0.30', pvc5: '3.9±0.25', pvc7: '5.3±0.30', pvc85: '6.4±0.40', pvc105: '8.0±0.45', pvc135: '9.9±0.55' },
  { dn: 150, in: '6', od: '165±0.40', pvc5: '4.6±0.25', pvc7: '6.2±0.35', pvc85: '7.5±0.45', pvc105: '9.4±0.50', pvc135: '11.7±0.65' },
  { dn: 200, in: '8', od: '216±0.50', pvc5: '5.4±0.35', pvc7: '7.3±0.40', pvc85: '8.8±0.50', pvc105: '11.1±0.60', pvc135: '13.7±0.70' },
  { dn: 225, in: '-', od: '251±0.70', pvc5: '6.3±0.40', pvc7: '8.4±0.40', pvc85: '10.2±0.55', pvc105: '12.8±0.60', pvc135: '15.9±0.80' },
  { dn: 250, in: '10', od: '267±0.70', pvc5: '6.7±0.40', pvc7: '8.9±0.40', pvc85: '10.9±0.60', pvc105: '13.6±0.65', pvc135: '16.9±0.85' },
  { dn: 275, in: '-', od: '281±0.70', pvc5: '7.0±0.40', pvc7: '9.4±0.45', pvc85: '11.4±0.60', pvc105: '14.4±0.75', pvc135: '17.8±0.90' },
  { dn: 300, in: '12', od: '318±0.80', pvc5: '7.9±0.45', pvc7: '10.7±0.55', pvc85: '12.9±0.65', pvc105: '16.2±0.75', pvc135: '20.1±1.00' },
  { dn: 325, in: '-', od: '356±0.80', pvc5: '8.8±0.45', pvc7: '11.9±0.55', pvc85: '14.4±0.70', pvc105: '18.1±0.80', pvc135: '22.5±1.10' },
  { dn: 350, in: '14', od: '370±0.90', pvc5: '9.2±0.50', pvc7: '12.5±0.70', pvc85: '15.0±0.75', pvc105: '18.9±0.95', pvc135: '23.4±1.15' },
  { dn: 375, in: '-', od: '401±1.00', pvc5: '9.9±0.50', pvc7: '13.5±0.70', pvc85: '16.2±0.80', pvc105: '20.4±0.95', pvc135: '25.3±1.20' },
  { dn: 400, in: '16', od: '420±1.10', pvc5: '10.4±0.55', pvc7: '14.2±0.80', pvc85: '17.0±0.85', pvc105: '21.5±1.10', pvc135: '26.5±1.25' },
  { dn: 425, in: '-', od: '452±1.10', pvc5: '11.2±0.60', pvc7: '15.2±0.80', pvc85: '18.3±0.90', pvc105: '23.1±1.15', pvc135: '28.5±1.35' },
  { dn: 450, in: '18', od: '470±1.20', pvc5: '11.6±0.60', pvc7: '15.9±0.90', pvc85: '19.0±0.95', pvc105: '24.0±1.20', pvc135: '29.7±1.45' },
  { dn: 475, in: '-', od: '502±1.20', pvc5: '12.5±0.70', pvc7: '16.9±0.90', pvc85: '20.3±1.00', pvc105: '25.6±1.25', pvc135: '31.6±1.45' },
  { dn: 500, in: '20', od: '520±1.30', pvc5: '12.9±0.70', pvc7: '17.6±1.00', pvc85: '21.0±1.00', pvc105: '26.6±1.35', pvc135: '32.8±1.55' },
  { dn: 550, in: '22', od: '562±1.30', pvc5: '13.9±0.75', pvc7: '18.9±1.00', pvc85: '22.7±1.10', pvc105: '28.6±1.35', pvc135: '35.4±1.65' },
  { dn: 600, in: '24', od: '630±1.60', pvc5: '15.5±0.75', pvc7: '21.2±1.10', pvc85: '25.4±1.20', pvc105: '32.0±1.45', pvc135: '39.7±1.85' },
  { dn: 700, in: '28', od: '712±1.80', pvc5: '17.6±0.90', pvc7: '23.8±1.10', pvc85: '28.6±1.25', pvc105: '36.0±1.45', pvc135: '-' },
  { dn: 800, in: '32', od: '802±1.80', pvc5: '19.8±1.00', pvc7: '26.7±1.15', pvc85: '32.2±1.40', pvc105: '-', pvc135: '-' },
  { dn: 900, in: '36', od: '902±1.80', pvc5: '22.2±1.10', pvc7: '30.1±1.35', pvc85: '36.1±1.45', pvc105: '-', pvc135: '-' },
  { dn: 1000, in: '40', od: '1002±1.80', pvc5: '24.6±1.15', pvc7: '33.3±1.40', pvc85: '-', pvc105: '-', pvc135: '-' }
];

// Computed
const filteredPipes = computed(() => {
  let result = pvcPipes

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(pipe =>
      pipe.dn.toString().includes(query) ||
      pipe.od.toString().includes(query) ||
      pipe.pvc5?.includes(query) ||
      pipe.pvc7?.includes(query) ||
      pipe.pvc85?.includes(query) ||
      pipe.pvc105?.includes(query) ||
      pipe.pvc135?.includes(query)
    )
  }

  return result
})

// Methods
const exportData = () => {
  const headers = ['DN (mm)', 'OD (mm)', 'PVC 5', 'PVC 7', 'PVC 8.5', 'PVC 10.5', 'PVC 13.5']
  const data = filteredPipes.value.map(pipe => [
    pipe.dn,
    pipe.od,
    pipe.pvc5 || '-',
    pipe.pvc7 || '-',
    pipe.pvc85 || '-',
    pipe.pvc105 || '-',
    pipe.pvc135 || '-',
  ])

  const csv = [
    headers.join(','),
    ...data.map(row => row.join(',')),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'pvc_pipe_specs_catalog.csv'
  a.click()
  URL.revokeObjectURL(url)

  toast.success('Export ข้อมูลเรียบร้อย')
}
</script>
