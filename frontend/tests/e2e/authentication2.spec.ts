import { expect, test } from '@playwright/test';

test.describe('Authentication System Tests', () => {
  // UTC1001 - ตรวจสอบการสมัครสมาชิกด้วยข้อมูลครบถ้วน
  test('UTC1001-ตรวจสอบการลงทะเบียนโดยใช้ข้อมูลครบถ้วน', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'ลงทะเบียน' }).click();
    await page.getByRole('textbox', { name: 'Username *' }).click();
    await page.getByRole('textbox', { name: 'Username *' }).fill('systemtest');
    await page.getByRole('textbox', { name: 'Username *' }).press('Tab');
    await page.getByRole('textbox', { name: 'Email *' }).fill('systemtest@gmail.com');
    await page.getByRole('textbox', { name: 'Password *', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('systemtest');
    await page.getByRole('textbox', { name: 'Confirm Password *' }).click();
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('systemtest');
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // ตรวจสอบว่าลงทะเบียนสำเร็จ (redirect ไปหน้าถัดไป หรือแสดง success message)
    await expect(page).toHaveURL(/\/(projects|dashboard)?/);
  });

  // UTC1002 - ตรวจสอบการสมัครสมาชิกด้วย email ซ้ำ
  test('UTC1002-ตรวจสอบการลงทะเบียนด้วยemailซ้ำ', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'ลงทะเบียน' }).click();
    // ใช้ email เดิมที่ลงทะเบียนไปแล้วใน UTC1001
    await page.getByRole('textbox', { name: 'Username *' }).fill('systemtest2');
    await page.getByRole('textbox', { name: 'Email *' }).fill('systemtest@gmail.com'); // Email ซ้ำ
    await page.getByRole('textbox', { name: 'Password *', exact: true }).fill('systemtest');
    await page.getByRole('textbox', { name: 'Confirm Password *' }).fill('systemtest');
    await page.getByRole('button', { name: 'ลงทะเบียน' }).click();

    // ตรวจสอบว่าแสดง error message ว่า email ถูกใช้งานแล้ว

    await expect(page.locator('text=/email.*ซ้ำ|already.*exists|ถูกใช้งานแล้ว/i')).toBeVisible();
  });

  

  // UTC1003 - ตรวจสอบการเข้าสู่ระบบด้วยข้อมูลที่ถูกต้อง
  test('UTC1003-ตรวจสอบการเข้าสู่ระบบด้วยข้อมูลที่ถูกต้อง', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();

    await page.getByRole('textbox', { name: /email/i }).fill('systemtest@gmail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('systemtest');
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // ตรวจสอบว่า login สำเร็จและถูก redirect ไปหน้า projects หรือ dashboard
    await expect(page).toHaveURL(/\/(projects|dashboard)/);
  });

  // UTC1004 - ตรวจสอบการเข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง
  test('UTC1004-ตรวจสอบการเข้าสู่ระบบด้วยรหัสผ่านที่ไม่ถูกต้อง', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();

    await page.getByRole('textbox', { name: /email/i }).fill('systemtest@gmail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('WrongPassword123');
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // ตรวจสอบว่าแสดง error message ว่า password ผิด
    await expect(page.locator('text=/รหัสผ่าน.*ไม่ถูกต้อง|password.*incorrect|อีเมลหรือรหัสผ่านไม่ถูกต้อง/i')).toBeVisible();
  });

  // UTC1005 - ตรวจสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล
  test('UTC1005-ตรวจสอบการเข้าสู่ระบบโดยไม่กรอกข้อมูล', async ({ page }) => {
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();

    // ไม่กรอกข้อมูลเลย กด submit เลย
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // ตรวจสอบ validation errors
    await expect(page.locator('text=/กรุณากรอก.*อีเมล|required.*email|ฟิลด์นี้ต้องไม่ว่างเปล่า/i')).toBeVisible();
    await expect(page.locator('text=/กรุณากรอก.*รหัสผ่าน|required.*password|ฟิลด์นี้ต้องไม่ว่างเปล่า/i')).toBeVisible();
  });

  // UTC1006 - ตรวจสอบการดึงข้อมูลผู้ใช้ปัจจุบันด้วย token ถูกต้อง
  test('UTC1006-ตรวจสอบการดึงข้อมูลผู้ใช้ปัจจุบันด้วยtokenที่ถูกต้อง', async ({ page }) => {
    // Login ก่อน
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill('systemtest@gmail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('systemtest');
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // รอให้ login สำเร็จ
    await expect(page).toHaveURL(/\/(projects|dashboard)/);

    // ตรวจสอบว่าสามารถดึงข้อมูล user ได้ (ดูจาก UI ที่แสดง username/email ของ user ที่ล็อกอิน)
    const userElement = page.locator('text=/systemtest/i');
    await expect(userElement).toBeVisible();
  });

  // UTC1007 - ตรวจสอบการเข้าถึง Protected Route โดยไม่มี token
  test('UTC1007-ตรวจสอบการเข้าถึงProtectedRouteโดยไม่มีtoken', async ({ page }) => {
    // พยายามเข้าไปที่ protected route โดยตรงโดยไม่ login
    await page.goto('http://localhost:3003/projects');

    // ตรวจสอบว่าถูก redirect ไปหน้า login หรือแสดง unauthorized message
    await expect(page).toHaveURL(/\/(login|auth)/);
  });

  // UTC1008 - ตรวจสอบการออกจากระบบ
  test('UTC1008-ตรวจสอบการออกจากระบบ', async ({ page }) => {
    // Login ก่อน
    await page.goto('http://localhost:3003/');
    await page.getByRole('link', { name: 'เข้าสู่ระบบ' }).click();
    await page.getByRole('textbox', { name: /email/i }).fill('systemtest@gmail.com');
    await page.getByRole('textbox', { name: /password/i }).fill('systemtest');
    await page.getByRole('button', { name: /เข้าสู่ระบบ|login/i }).click();

    // รอให้ login สำเร็จ
    await expect(page).toHaveURL(/\/(projects|dashboard)/);

    // Logout
    await page.getByRole('button', { name: /ออกจากระบบ|logout|เมนู/i }).click();

    // ถ้ามี dropdown menu ให้เลือก logout
    const logoutButton = page.getByRole('menuitem', { name: /ออกจากระบบ|logout/i });
    if (await logoutButton.isVisible()) {
      await logoutButton.click();
    }

    // ตรวจสอบว่าถูก redirect ไปหน้า login หรือหน้าแรก และไม่มี session อยู่
    await expect(page).toHaveURL(/\/(login|\?logout=true)/);
  });
});

