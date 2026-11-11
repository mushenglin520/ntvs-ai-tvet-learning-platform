export const demoUsers = [
  { id: 1, loginId: "admin01", password: "Admin115!", name: "系統管理員（示範）", role: "admin", classCode: null },
  { id: 2, loginId: "teacher01", password: "Teach115!", name: "林老師（示範）", role: "teacher", classCode: null },
  { id: 3, loginId: "s115001", password: "Student115!", name: "陳同學（示範）", role: "student", classCode: "汽三甲" },
];

const officialLabel = "歷屆題型示範（虛構題，非官方統測原題）";
const aiLabel = "AI 模擬題（本機規則產生，非官方試題）";

export const demoQuestions = [
  {
    sourceType: "official", unitId: 1, difficulty: "基礎", status: "approved", originalNo: "DEMO-O-01",
    stem: "一物體受到 20 N 的水平力作用，若質量為 5 kg 且忽略摩擦，其加速度為何？",
    options: { A: "2 m/s²", B: "4 m/s²", C: "10 m/s²", D: "100 m/s²" }, answer: "B",
    explanation: "依牛頓第二運動定律 F＝ma，a＝20÷5＝4 m/s²。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 1, difficulty: "基礎", status: "approved", originalNo: "DEMO-O-02",
    stem: "使用長扳手比短扳手較容易旋鬆螺帽，主要是增加哪一個物理量？",
    options: { A: "力矩", B: "功率", C: "質量", D: "速度" }, answer: "A",
    explanation: "力矩為力與力臂的乘積；施力相同時，力臂越長，力矩越大。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 1, difficulty: "進階", status: "approved", originalNo: "DEMO-O-03",
    stem: "某機件輸入功為 500 J，輸出有用功為 400 J，其機械效率為何？",
    options: { A: "20%", B: "50%", C: "80%", D: "125%" }, answer: "C",
    explanation: "效率＝輸出功÷輸入功×100%＝400÷500×100%＝80%。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 2, difficulty: "基礎", status: "approved", originalNo: "DEMO-O-04",
    stem: "四行程汽油引擎完成一次完整循環，曲軸共旋轉幾圈？",
    options: { A: "半圈", B: "一圈", C: "兩圈", D: "四圈" }, answer: "C",
    explanation: "進氣、壓縮、動力、排氣四行程需曲軸旋轉兩圈。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 2, difficulty: "進階", status: "approved", originalNo: "DEMO-O-05",
    stem: "汽油引擎點火順序設計的主要目的之一為何？",
    options: { A: "增加輪胎抓地力", B: "使引擎運轉較平順", C: "降低煞車油沸點", D: "提高電瓶電壓" }, answer: "B",
    explanation: "合理的點火順序可平衡各缸動力輸出，降低振動，使引擎運轉平順。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 2, difficulty: "進階", status: "approved", originalNo: "DEMO-O-06",
    stem: "引擎壓縮比提高，在其他條件相同且未發生爆震時，通常會使熱效率如何變化？",
    options: { A: "提高", B: "降低", C: "完全不變", D: "必為零" }, answer: "A",
    explanation: "在合理範圍內提高壓縮比，通常可提升理論熱效率，但仍受爆震與設計限制。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 3, difficulty: "基礎", status: "approved", originalNo: "DEMO-O-07",
    stem: "車輛轉彎時，差速器最主要的作用為何？",
    options: { A: "讓左右驅動輪可有不同轉速", B: "提高引擎壓縮比", C: "降低冷卻水溫", D: "固定方向盤" }, answer: "A",
    explanation: "轉彎時內外輪路徑不同，差速器允許左右驅動輪以不同轉速旋轉。", sourceLabel: officialLabel,
  },
  {
    sourceType: "official", unitId: 3, difficulty: "進階", status: "approved", originalNo: "DEMO-O-08",
    stem: "液壓煞車系統主要應用哪一項原理傳遞壓力？",
    options: { A: "帕斯卡原理", B: "阿基米德原理", C: "電磁感應", D: "熱輻射" }, answer: "A",
    explanation: "密閉液體所受壓力可向各方向等量傳遞，這是帕斯卡原理。", sourceLabel: officialLabel,
  },
  {
    sourceType: "ai", unitId: 1, difficulty: "基礎", status: "approved", originalNo: "DEMO-AI-01",
    stem: "某槓桿的施力臂為抗力臂的 3 倍。忽略損失時，理想機械利益為何？",
    options: { A: "1/3", B: "1", C: "3", D: "9" }, answer: "C",
    explanation: "理想機械利益＝施力臂÷抗力臂＝3。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 1, difficulty: "挑戰", status: "approved", originalNo: "DEMO-AI-02",
    stem: "車輛以等速度直線行駛時，若合力為零，下列敘述何者正確？",
    options: { A: "車輛一定靜止", B: "加速度為零", C: "動能必為零", D: "沒有任何力作用" }, answer: "B",
    explanation: "合力為零代表加速度為零；物體仍可保持等速度運動。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 2, difficulty: "基礎", status: "approved", originalNo: "DEMO-AI-03",
    stem: "四行程引擎中，進氣門通常在何種行程開啟以吸入混合氣或空氣？",
    options: { A: "進氣行程", B: "壓縮行程", C: "動力行程", D: "排氣行程末後永不開啟" }, answer: "A",
    explanation: "進氣行程活塞下行，進氣門開啟，使新鮮氣體進入汽缸。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 2, difficulty: "進階", status: "approved", originalNo: "DEMO-AI-04",
    stem: "冷卻系統中的節溫器主要依據哪一項狀態調節冷卻液流量？",
    options: { A: "車速", B: "冷卻液溫度", C: "輪胎壓力", D: "音響音量" }, answer: "B",
    explanation: "節溫器會依冷卻液溫度開閉，協助引擎維持適當工作溫度。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 2, difficulty: "挑戰", status: "approved", originalNo: "DEMO-AI-05",
    stem: "若引擎機油黏度過低且工作溫度偏高，最可能造成哪一項風險？",
    options: { A: "油膜承載能力不足", B: "輪胎花紋加深", C: "煞車踏板自動升高", D: "車燈亮度固定增加" }, answer: "A",
    explanation: "黏度過低可能使高溫下油膜不足，增加機件直接接觸與磨耗風險。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 3, difficulty: "基礎", status: "approved", originalNo: "DEMO-AI-06",
    stem: "輪胎胎壓明顯不足時，較可能出現哪一種現象？",
    options: { A: "滾動阻力增加", B: "車重歸零", C: "煞車油自動增加", D: "方向盤完全鎖死" }, answer: "A",
    explanation: "胎壓不足會增加輪胎變形與滾動阻力，也可能造成異常磨耗。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 3, difficulty: "進階", status: "approved", originalNo: "DEMO-AI-07",
    stem: "ABS 防鎖死煞車系統作動時，主要控制目標為何？",
    options: { A: "避免車輪長時間鎖死", B: "關閉所有車燈", C: "提高引擎壓縮比", D: "固定左右輪轉速相同" }, answer: "A",
    explanation: "ABS 調節煞車壓力，避免車輪持續鎖死，以保留較佳的轉向控制能力。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 3, difficulty: "挑戰", status: "approved", originalNo: "DEMO-AI-08",
    stem: "車輛高速行駛時方向盤持續規律抖動，最適合優先檢查哪一項？",
    options: { A: "車輪動平衡", B: "座椅顏色", C: "雨刷水香味", D: "音響電台" }, answer: "A",
    explanation: "特定車速出現規律抖動，常見原因之一為車輪動平衡不良，仍應由合格人員完整檢查。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 2, difficulty: "進階", status: "pending", originalNo: "DRAFT-AI-01",
    stem: "【待審】曲軸位置感知器訊號異常時，最可能直接影響哪項控制？",
    options: { A: "點火與噴油時序", B: "車門顏色", C: "輪胎尺寸標示", D: "座椅角度" }, answer: "A",
    explanation: "曲軸位置是引擎控制單元判斷轉速與相位的重要依據；本題須由教師確認用詞。", sourceLabel: aiLabel,
  },
  {
    sourceType: "ai", unitId: 3, difficulty: "進階", status: "pending", originalNo: "DRAFT-AI-02",
    stem: "【待審】避震器阻尼不足時，車身經過起伏路面後可能出現何種現象？",
    options: { A: "持續上下擺動", B: "引擎排氣量增加", C: "燃油辛烷值提高", D: "車牌自動變更" }, answer: "A",
    explanation: "阻尼不足可能使車身振動衰減較慢；本題情境與措辭須由教師審核。", sourceLabel: aiLabel,
  },
];
