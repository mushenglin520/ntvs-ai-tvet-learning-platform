import { expect,test,type Page } from "@playwright/test";

async function login(page:Page,loginId:string,password:string){await page.goto("/login");await page.getByLabel("帳號／學號").fill(loginId);await page.getByLabel("密碼").fill(password);await page.getByRole("button",{name:"登入",exact:true}).click();await expect(page).toHaveURL(/\/student$/);}

test("學生可完成自主練習並寫入成績診斷",async({page})=>{
  await login(page,"s115001","Student115!");
  await expect(page.getByRole("heading",{name:/今天要練哪一個弱點/})).toBeVisible();
  await page.getByRole("link",{name:/開始自主練習/}).click();
  await page.getByRole("button",{name:"開始練習"}).click();
  for(let i=0;i<5;i++){
    await page.locator(".option").first().click();
    await page.getByRole("button",{name:"提交答案"}).click();
    await expect(page.locator(".feedback")).toBeVisible();
    await page.getByRole("button",{name:i===4?"完成練習":"下一題"}).click();
  }
  await expect(page.getByText(/答對 \d+／5 題/)).toBeVisible();
  await page.getByRole("link",{name:"成績診斷"}).click();
  await expect(page.getByRole("heading",{name:"歷次紀錄"})).toBeVisible();
});

test("模擬考作答中不顯示答案，交卷後統一解析",async({page})=>{
  await login(page,"s115001","Student115!");
  await page.goto("/student/mock-exam");
  await page.locator('select[name="count"]').selectOption("3");
  await page.getByRole("button",{name:"開始模擬考"}).click();
  await expect(page.getByText("正確答案：")).toHaveCount(0);
  await page.locator("article").first().locator(".option").first().click();
  await page.getByRole("button",{name:"交卷"}).click();
  await expect(page.getByText(/答對 \d+／3 題/)).toBeVisible();
  await expect(page.getByText(/正確答案：/).first()).toBeVisible();
});
