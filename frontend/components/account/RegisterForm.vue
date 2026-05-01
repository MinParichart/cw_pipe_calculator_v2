<template>
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
        ลงทะเบียน
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        หรือ
        <NuxtLink
          to="/"
          class="font-medium text-primary-600 hover:text-primary-500"
        >
          เข้าสู่ระบบ
        </NuxtLink>
      </p>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit" novalidate>
      <div v-if="error" class="rounded-md bg-danger-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-danger-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-danger-800">
              {{ error }}
            </h3>
          </div>
        </div>
      </div>

      <div class="rounded-md shadow-sm space-y-4">
        <!-- Username -->
        <div>
          <label for="username" class="label">
            Username <span class="text-danger-500">*</span>
          </label>
          <input
            id="username"
            v-model="form.username"
            name="username"
            type="text"
            autocomplete="username"
            required
            class="input"
            :class="{ 'border-danger-500': errors.username }"
            placeholder="username"
          />
          <p v-if="errors.username" class="mt-1 text-sm text-danger-600">
            {{ errors.username }}
          </p>
        </div>

        <!-- Email -->
        <div>
          <label for="email-address" class="label">
            Email <span class="text-danger-500">*</span>
          </label>
          <input
            id="email-address"
            v-model="form.email"
            name="email"
            type="text"
            autocomplete="email"
            required
            class="input"
            :class="{ 'border-danger-500': errors.email }"
            placeholder="your@email.com"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-danger-600">
            {{ errors.email }}
          </p>
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="label">
            Password <span class="text-danger-500">*</span>
          </label>
          <input
            id="password"
            v-model="form.password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            class="input"
            :class="{ 'border-danger-500': errors.password }"
            placeholder="••••••••"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-danger-600">
            {{ errors.password }}
          </p>
          <p v-else class="mt-1 text-xs text-gray-500">อย่างน้อย 8 ตัวอักษร</p>
        </div>

        <!-- Confirm Password -->
        <div>
          <label for="confirm-password" class="label">
            Confirm Password <span class="text-danger-500">*</span>
          </label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            name="confirm-password"
            type="password"
            autocomplete="new-password"
            required
            class="input"
            :class="{ 'border-danger-500': errors.confirmPassword }"
            placeholder="••••••••"
          />
          <p v-if="errors.confirmPassword" class="mt-1 text-sm text-danger-600">
            {{ errors.confirmPassword }}
          </p>
        </div>
      </div>

      <div>
        <button
          type="submit"
          :disabled="loading"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="loading">กำลังลงทะเบียน...</span>
          <span v-else>ลงทะเบียน</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
const { register } = useAuth();
const router = useRouter();
const toast = useToast();

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const loading = ref(false);
const error = ref("");
const errors = ref<Record<string, string>>({
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
});

const validateForm = (): boolean => {
  errors.value = {
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  let isValid = true;

  // U-SRS02: ตรวจสอบว่าข้อมูลครบถ้วน
  if (!form.value.username.trim()) {
    errors.value.username = "กรุณากรอก Username";
    isValid = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = "กรุณากรอก Email";
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = "กรุณากรอก Password";
    isValid = false;
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = "กรุณากรอก Confirm Password";
    isValid = false;
  }

  // U-SRS03: ตรวจสอบรูปแบบ Email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (form.value.email && !emailRegex.test(form.value.email)) {
    errors.value.email = "รูปแบบอีเมลไม่ถูกต้อง";
    isValid = false;
  }

  // U-SRS05: Password ต้องมีอย่างน้อย 8 ตัวอักษร (A3)
  if (form.value.password && form.value.password.length < 8) {
    errors.value.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    isValid = false;
  }

  // U-SRS06: Confirm Password ต้องตรงกับ Password (A2)
  if (
    form.value.password &&
    form.value.confirmPassword &&
    form.value.password !== form.value.confirmPassword
  ) {
    errors.value.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  error.value = "";

  const result = await register(
    form.value.email,
    form.value.password,
    form.value.username
  );

  if (result.success) {
    toast.success("ลงทะเบียนสำเร็จ");
    await router.push("/projects");
  } else {
    // A1: Email ซ้ำในระบบ
    if (
      result.error?.message?.includes("already exists") ||
      result.error?.message?.includes("duplicate")
    ) {
      errors.value.email = "อีเมลนี้ถูกใช้งานแล้ว";
    } else {
      // E1: ไม่สามารถบันทึกข้อมูลได้
      error.value =
        result.error?.message ||
        "ไม่สามารถสร้างบัญชีได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
    }
  }

  loading.value = false;
};
</script>
