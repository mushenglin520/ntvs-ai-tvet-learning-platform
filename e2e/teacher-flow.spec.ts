import { expect,test } from "@playwright/test";

test("教師可審核待審題並留下備註",async({page})=>{
  await page.goto("/login");
  await page.getByLabel("帳號／學號").fill("teacher01");
  await page.getByLabel("密碼").fill("Teach115!");
  await page.getByRole("button",{name:"登入",exact:true}).click();
  await page.getByRole("link",{name:/進入審題/}).click();
  await expect(page.getByText(/待審清單已清空/)).toHaveCount(0);
  await page.getByLabel("審核備註（必填）").fill("答案與解析一致，通過示範審核。");
  await page.getByRole("button",{name:/通過並發布/}).click();
  await expect(page.getByText(/已完成「通過」並保存紀錄/)).toBeVisible();
});
