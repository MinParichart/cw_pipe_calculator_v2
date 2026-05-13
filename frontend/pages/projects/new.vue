<template>
  <div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="mb-6">
        <button
          @click="$router.back()"
          class="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <svg
            class="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          ย้อนกลับ
        </button>
        <h1 class="mt-4 text-3xl font-bold text-gray-900">สร้างโปรเจกต์ใหม่</h1>
      </div>

      <!-- Form -->
      <div class="bg-white shadow rounded-lg p-6">
        <form @submit.prevent="handleCreate" novalidate class="space-y-6">
          <!-- Project Name -->
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              ชื่อโปรเจกต์ <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="เช่น บ้านพักอาศัย 2 ชั้น"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">
              {{ errors.name }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label
              for="description"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              รายละเอียด (ไม่บังคับ)
            </label>
            <textarea
              id="description"
              v-model="form.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="ระบุรายละเอียดเพิ่มเติมเกี่ยวกับโปรเจกต์..."
            />
          </div>

          <!-- Building Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ประเภทอาคาร <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label
                v-for="type in buildingTypes"
                :key="type.value"
                class="relative flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{
                  'border-blue-500 bg-blue-50':
                    form.buildingType === type.value,
                  'border-red-500':
                    errors.buildingType && form.buildingType !== type.value,
                  'border-gray-300':
                    !errors.buildingType && form.buildingType !== type.value,
                  'opacity-50 cursor-not-allowed bg-gray-100': type.disabled,
                  'cursor-pointer': !type.disabled
                }"
              >
                <input
                  v-model="form.buildingType"
                  type="radio"
                  :value="type.value"
                  :disabled="type.disabled"
                  class="sr-only"
                />
                <div class="flex items-center">
                  <svg
                    class="h-6 w-6"
                    :class="type.disabled ? 'text-gray-400' : 'text-blue-600'"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <div class="ml-2">
                    <span
                      class="text-sm font-medium"
                      :class="type.disabled ? 'text-gray-500' : 'text-gray-900'"
                    >
                      {{ type.label }}
                    </span>
                    <span
                      v-if="type.disabled"
                      class="block text-xs text-gray-400"
                    >
                      (ยังไม่รองรับ)
                    </span>
                  </div>
                </div>
              </label>
            </div>
            <p v-if="errors.buildingType" class="mt-1 text-sm text-red-600">
              {{ errors.buildingType }}
            </p>
          </div>

          <!-- Number of Floors -->
          <div>
            <label
              for="floors"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              จำนวนชั้น <span class="text-red-500">*</span>
            </label>
            <input
              id="floors"
              v-model="form.floors"
              type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :class="{ 'border-red-500': errors.floors }"
              placeholder="1"
            />
            <p v-if="errors.floors" class="mt-1 text-sm text-red-600">
              {{ errors.floors }}
            </p>
            <p class="mt-1 text-sm text-gray-500">ระบบรองรับสูงสุด 2 ชั้น</p>
          </div>

          <!-- Divider -->
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              เกณฑ์การออกแบบ
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              ตั้งค่าพารามิเตอร์สำหรับการคำนวณขนาดท่อน้ำดี
            </p>
          </div>

          <!-- PVC Class -->
          <div>
            <label
              for="pvcClass"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              ชั้นคุณภาพท่อ PVC (PVC Class) <span class="text-red-500">*</span>
            </label>
            <select
              id="pvcClass"
              v-model.number="form.pvcClass"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option
                v-for="option in pvcClassOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <div class="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2">
                <svg
                  class="h-4 w-4 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-xs text-blue-800">
                  <strong>PVC Class:</strong> {{ form.pvcClass }} bar
                </span>
              </div>
              <p class="text-xs text-blue-700 mt-1">
                {{
                  pvcClassOptions.find((opt) => opt.value === form.pvcClass)
                    ?.desc
                }}
              </p>
            </div>
          </div>

          <!-- Minor Loss Factor -->
          <div>
            <label
              for="minorLoss"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Minor Loss Factor <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                id="minorLoss"
                v-model.number="form.minorLossFactor"
                type="number"
                step="1"
                min="0"
                max="50"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <span class="absolute right-4 top-2 text-gray-500 text-sm"
                >%</span
              >
            </div>
            <p class="mt-1 text-sm text-gray-500">
              ค่าน้ำหนักที่เสียจากข้องอ ตัวแยก วาล์ว ฯลฯ (แนะนำ: 30%)
            </p>
          </div>

          <!-- Locked Settings Info -->
          <div class="space-y-4">
            <!-- Curve Mode -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                โหมดการคำนวณ Curve
              </label>
              <div class="relative">
                <input
                  value="Hunter's Curve"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <span class="absolute right-4 top-2 text-xs text-gray-400"
                  >🔒 ล็อค</span
                >
              </div>
              <p class="mt-1 text-sm text-gray-500">
                มาตรฐาน Hunter's Curve สำหรับระบบท่อน้ำดี
              </p>
            </div>

            <!-- C-Factor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ชนิดท่อ (C-Factor)
              </label>
              <div class="relative">
                <input
                  value="PVC (150)"
                  disabled
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <span class="absolute right-4 top-2 text-xs text-gray-400"
                  >🔒 ล็อค</span
                >
              </div>
              <p class="mt-1 text-sm text-gray-500">
                ค่า C-Factor สำหรับคำนวณความสูญเสียดัน (Hazen-Williams)
              </p>
            </div>

            <!-- Critical Endpoint Auto -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <svg
                  class="h-5 w-5 text-blue-600 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-blue-900">
                    Critical Endpoint
                  </h4>
                  <p class="text-xs text-blue-700 mt-1">
                    ระบบจะระบุจุดวิกฤต (จุดที่มีความดันต่ำสุด) โดยอัตโนมัติจาก
                    Network Diagram
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              @click="$router.back()"
              class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading">กำลังสร้าง...</span>
              <span v-else>สร้างโปรเจกต์</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { projectsApi } from "~/composables/useApi";

const router = useRouter();
const toast = useToast();

const form = ref({
  name: "",
  description: "",
  buildingType: "APARTMENT" as
    | "APARTMENT"
    | "OFFICE"
    | "HOSPITAL"
    | "SCHOOL"
    | "HOTEL",
  floors: "1",
  // Design Criteria
  pvcClass: 7, // Default PVC Class เป็น 7
  minorLossFactor: 15 // Default 15%
});

const loading = ref(false);
const errors = ref<{
  name?: string;
  buildingType?: string;
  floors?: string;
}>({});

const buildingTypes = [
  { value: "APARTMENT", label: "ที่พักอาศัย", disabled: false },
  { value: "OFFICE", label: "สำนักงาน", disabled: true },
  { value: "HOSPITAL", label: "โรงพยาบาล", disabled: true },
  { value: "SCHOOL", label: "โรงเรียน", disabled: true },
  { value: "HOTEL", label: "โรงแรม", disabled: true }
];

const pvcClassOptions = [
  {
    value: 5,
    label: "PVC 5 (5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 5 (ความดัน 5 bar)"
  },
  {
    value: 7,
    label: "PVC 7 (7 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 7 (ความดัน 7 bar)"
  },
  {
    value: 8.5,
    label: "PVC 8.5 (8.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 8.5 (ความดัน 8.5 bar)"
  },
  {
    value: 10.5,
    label: "PVC 10.5 (10.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 10.5 (ความดัน 10.5 bar)"
  },
  {
    value: 13.5,
    label: "PVC 13.5 (13.5 bar)",
    desc: "ท่อ PVC ชั้นคุณภาพ 13.5 (ความดัน 13.5 bar)"
  }
];

const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {};

  // A1: Project Name ว่าง
  if (!form.value.name || form.value.name.trim() === "") {
    errors.value.name = "กรุณากรอกชื่อโปรเจกต์";
    isValid = false;
  }

  // Validate Building Type
  const selectedBuildingType = buildingTypes.find(
    (bt) => bt.value === form.value.buildingType
  );
  if (
    !form.value.buildingType ||
    !selectedBuildingType ||
    selectedBuildingType.disabled
  ) {
    errors.value.buildingType = "กรุณาเลือกประเภทอาคารที่รองรับ";
    isValid = false;
  }

  // Validate Floors (ต้องอยู่ในช่วง 1-2)
  const floorsNum = parseInt(form.value.floors);
  if (
    !form.value.floors ||
    isNaN(floorsNum) ||
    floorsNum < 1 ||
    floorsNum > 2
  ) {
    errors.value.floors = "กรุณาระบุจำนวนชั้น (1-2)";
    isValid = false;
  }

  return isValid;
};

const handleCreate = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    console.log("Creating project with data:", form.value);

    const newProject = await projectsApi.create({
      name: form.value.name,
      description: form.value.description,
      criteria: {
        buildingType: form.value.buildingType,
        floors: parseInt(form.value.floors),
        pvcClass: form.value.pvcClass,
        minorLossFactor: form.value.minorLossFactor
      }
    });

    console.log("Project created successfully:", newProject);

    toast.success("สร้างโปรเจกต์สำเร็จ");

    // Navigate to project detail page
    if (newProject?.id) {
      await router.push(`/projects/${newProject.id}`);
    } else {
      console.error("Invalid response:", newProject);
      toast.error("รับข้อมูลโปรเจกต์ไม่ถูกต้อง");
      await router.push("/projects");
    }
  } catch (error: any) {
    console.error("Create project error:", error);

    // Show more detailed error
    if (
      error.message?.includes("401") ||
      error.message?.includes("Unauthorized")
    ) {
      toast.error("กรุณา Login ก่อนสร้างโปรเจกต์");
      setTimeout(() => router.push("/"), 2000);
    } else {
      toast.error(error.message || "สร้างโปรเจกต์ล้มเหลือ");
    }
  } finally {
    loading.value = false;
  }
};

// Define page meta for layout
definePageMeta({
  layout: "dashboard"
});
</script>
