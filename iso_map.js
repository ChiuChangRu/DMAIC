// iso_map v5.1（MedQA）
// ── MedQA ISO 對照資料（從 index.html 拆出，方便維護）──
// 維護方式：直接編輯本檔；新增/修改標準、章節都只動這裡。index.html 以 <script src="iso_map.js"> 載入。
// 規則：標準編號/章節以 ISO 正本為準；查不到公開目錄者用 clauses_note 標『待建檔』，勿自創條號。
window._ISO_MAP_EMBEDDED = {
 "_meta": {
  "schema": "iso_map v1.0",
  "purpose": "器材類別 → 適用 ISO 標準 → 該驗證的項目類別。供 MedQA verification_plan 做 ISO 對照與缺口紅旗。",
  "rules": [
   "no / title / edition：標準身分為 factual（來源：ISO 目錄 / Open Data）。AI 比對時只能引用本檔已列出的標準，不得自行生成編號（避免幻覺條號）。",
   "items：為驗證『項目類別』草稿，非正本條文逐字內容。一律以正本最新版次為準，需 RA 核可後將 items_status 改為 'RA_approved'。",
   "applies_to：用於判斷該標準是否適用於某器材的關鍵詞（intravascular / dialysis / balloon / introducer / needle / 通則 / 跨領域）。"
  ],
  "edition_note": "edition 為查詢當下的最新版次，採購/送審前請再確認是否被新版取代或廢止。",
  "last_reviewed": "2026-06 (seed)",
  "maintained_by": "RA"
 },
 "ics": {
  "11.040.25": {
   "title": "Syringes, needles and catheters｜注射器、針與導管",
   "standards": [
    {
     "no": "ISO 10555-1",
     "edition": "2023",
     "title": "Intravascular catheters — Sterile and single-use catheters — Part 1: General requirements",
     "title_zh": "血管內導管—無菌單次使用—第1部:通則",
     "applies_to": [
      "intravascular",
      "通則"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "耐腐蝕",
       "en": "corrosion resistance"
      },
      {
       "k": "峰值拉伸力(管身/接合)",
       "en": "peak tensile force"
      },
      {
       "k": "加壓不漏液",
       "en": "freedom from leakage during pressurization"
      },
      {
       "k": "抽吸不漏氣",
       "en": "freedom from leakage during aspiration"
      },
      {
       "k": "流速",
       "en": "flowrate"
      },
      {
       "k": "動力注射爆破壓",
       "en": "power injection burst pressure"
      },
      {
       "k": "接頭(hub)強度",
       "en": "hubs"
      },
      {
       "k": "可偵測性(顯影)",
       "en": "radio-detectability"
      },
      {
       "k": "塗層完整性/微粒",
       "en": "coating integrity / particulate (依設計適用)"
      },
      {
       "k": "遠端尖端剛性",
       "en": "distal tip stiffness (神經血管適用)"
      },
      {
       "k": "模擬使用/抗扭結/扭力",
       "en": "simulated use / kink / torque (依設計適用)"
      }
     ],
     "clauses": [
      {
       "no": "4.16",
       "title_zh": "模擬使用/抗扭結/扭力測試",
       "verified": true
      },
      {
       "no": "4.17",
       "title_zh": "塗層完整性/微粒測試",
       "verified": true
      },
      {
       "no": "4.18",
       "title_zh": "遠端尖端剛性(神經血管適用)",
       "verified": true
      },
      {
       "no": "Annex A",
       "title_zh": "耐腐蝕試驗",
       "verified": true
      },
      {
       "no": "Annex B",
       "title_zh": "峰值拉伸力(管身/接合/hub)",
       "verified": true
      },
      {
       "no": "Annex C",
       "title_zh": "加壓液體漏液試驗",
       "verified": true
      },
      {
       "no": "Annex D",
       "title_zh": "抽吸時空氣漏入hub試驗",
       "verified": true
      },
      {
       "no": "Annex E",
       "title_zh": "導管流速測定",
       "verified": true
      },
      {
       "no": "Annex F",
       "title_zh": "靜態爆破壓試驗",
       "verified": true
      },
      {
       "no": "Annex G",
       "title_zh": "動力注射流速/壓力試驗",
       "verified": true
      },
      {
       "no": "Annex I",
       "title_zh": "水下空氣漏氣(非破壞)試驗",
       "verified": true
      }
     ]
    },
    {
     "no": "ISO 10555-3",
     "edition": "2013",
     "title": "Intravascular catheters — Sterile and single-use catheters — Part 3: Central venous catheters",
     "title_zh": "第3部:中心靜脈導管(對應 HD 長期血管導管)",
     "applies_to": [
      "intravascular",
      "central-venous",
      "HD"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "(承 Part 1 通則)",
       "en": "general per Part 1"
      },
      {
       "k": "尺寸標示",
       "en": "size designation"
      },
      {
       "k": "管腔流速/可注射性",
       "en": "flow / injectability — RA 補"
      }
     ],
     "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。",
     "clauses": [
      {
       "no": "4.1",
       "title_zh": "一般要求(須符合10555-1，峰值拉伸力除外)",
       "verified": true
      },
      {
       "no": "4.2",
       "title_zh": "距離標記",
       "verified": true
      },
      {
       "no": "4.3",
       "title_zh": "管腔(lumen)標記",
       "verified": true
      },
      {
       "no": "4.4",
       "title_zh": "峰值拉伸力(軟尖≤20mm，見Table 1)",
       "verified": true
      },
      {
       "no": "4.5",
       "title_zh": "製造商應提供資訊",
       "verified": true
      }
     ],
     "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2013版)"
    },
    {
     "no": "ISO 10555-4",
     "edition": "2023",
     "title": "Intravascular catheters — Sterile and single-use catheters — Part 4: Balloon dilatation catheters",
     "title_zh": "第4部:球囊擴張導管",
     "applies_to": [
      "intravascular"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "額定爆破壓(RBP)",
       "en": "rated burst pressure"
      },
      {
       "k": "球囊順應性(直徑-壓力)",
       "en": "compliance"
      },
      {
       "k": "反覆充壓疲勞",
       "en": "fatigue / repeated inflation"
      },
      {
       "k": "球囊接合強度",
       "en": "balloon bond strength — RA 補"
      }
     ],
     "clauses": [
      {
       "no": "Annex C",
       "title_zh": "洩壓/充洩壓時間試驗",
       "verified": true
      },
      {
       "no": "Annex E",
       "title_zh": "穿越剖面(crossing profile)測定",
       "verified": true
      },
      {
       "no": "Annex F",
       "title_zh": "球囊移除試驗",
       "verified": true
      },
      {
       "no": "Annex G",
       "title_zh": "球囊材料選擇指引(資訊性)",
       "verified": true
      }
     ],
     "clauses_note": "2023版部分附錄(查到C/E/F/G)；爆破壓/順應性等其餘條文待RA依正本補"
    },
    {
     "no": "ISO 10555-8",
     "edition": "2024",
     "title": "Intravascular catheters — Sterile and single-use catheters — Part 8: Catheters for extracorporeal blood treatment",
     "title_zh": "第8部:體外血液處理用導管(血液透析)",
     "applies_to": [
      "intravascular",
      "dialysis",
      "HD",
      "extracorporeal"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "再循環率",
       "en": "recirculation rate"
      },
      {
       "k": "流量-壓力特性",
       "en": "flow vs pressure"
      },
      {
       "k": "管腔容積/填充量",
       "en": "priming/lumen volume — RA 補"
      },
      {
       "k": "(承 Part 1 通則:拉伸/漏液/接頭)",
       "en": "general per Part 1"
      }
     ],
     "clauses_note": "公開目錄未提供逐條，待RA依正本建檔"
    },
    {
     "no": "ISO 11070",
     "edition": "2014",
     "title": "Sterile single-use intravascular catheter introducers, dilators and guidewires",
     "title_zh": "無菌單次使用血管內導引器、擴張器與導絲(對應 Sheath/Guide/同軸導引針)",
     "applies_to": [
      "introducer",
      "sheath",
      "guidewire",
      "needle",
      "guide"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "導引器/擴張器拉伸",
       "en": "tensile"
      },
      {
       "k": "導絲彈性/抗扭結",
       "en": "guidewire flex/kink — RA 補"
      },
      {
       "k": "表面/微粒",
       "en": "surface / particulate — RA 補"
      }
     ],
     "clauses": [
      {
       "no": "5",
       "title_zh": "導引針額外要求",
       "verified": true
      },
      {
       "no": "6",
       "title_zh": "導引導管額外要求",
       "verified": true
      },
      {
       "no": "7",
       "title_zh": "鞘式導引器額外要求",
       "verified": true
      },
      {
       "no": "8",
       "title_zh": "導絲額外要求",
       "verified": true
      },
      {
       "no": "9",
       "title_zh": "擴張器額外要求",
       "verified": true
      },
      {
       "no": "Annex B",
       "title_zh": "耐腐蝕試驗",
       "verified": true
      },
      {
       "no": "Annex C",
       "title_zh": "導引導管/鞘/擴張器峰值拉伸力",
       "verified": true
      },
      {
       "no": "Annex D",
       "title_zh": "鞘式導引器加壓漏液試驗",
       "verified": true
      },
      {
       "no": "Annex E",
       "title_zh": "止血閥漏液試驗",
       "verified": true
      },
      {
       "no": "Annex F",
       "title_zh": "導絲斷裂試驗",
       "verified": true
      },
      {
       "no": "Annex G",
       "title_zh": "導絲抗彎曲損傷試驗",
       "verified": true
      }
     ]
    }
   ]
  },
  "11.040.40": {
   "title": "Implants for surgery / urology stents｜植入物與泌尿支架(DJ/Pigtail)",
   "_note": "輸尿管 DJ/Pigtail 支架非血管內導管，10555 不適用。主規格多為 ASTM F1828*（輸尿管支架），ISO 端以生物相容/滅菌/包裝為主。本區待 RA 依實際送審依據建檔。",
   "standards": [
    {
     "no": "ASTM F1828",
     "edition": "*非ISO,待確認",
     "title": "Standard Specification for Ureteral Stents",
     "title_zh": "輸尿管支架規格(ASTM,非ISO)*",
     "applies_to": [
      "ureteral",
      "DJ",
      "pigtail",
      "stent"
     ],
     "id_verified": false,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "拉伸/接合強度",
       "en": "tensile — RA 補"
      },
      {
       "k": "捲曲保持力(pigtail)",
       "en": "coil retention — RA 補"
      },
      {
       "k": "流速/側孔",
       "en": "flow — RA 補"
      }
     ]
    }
   ]
  },
  "11.040.10": {
   "title": "Anaesthetic, respiratory and reanimation equipment｜麻醉、呼吸及復甦設備",
   "standards": [
    {
     "no": "ISO 5361",
     "edition": "2023",
     "title": "Anaesthetic and respiratory equipment — Tracheal tubes and connectors",
     "title_zh": "氣管內管與接頭",
     "applies_to": [
      "tracheal",
      "airway",
      "respiratory"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "管徑/長度尺寸"
      },
      {
       "k": "氣囊密封性/充氣壓"
      },
      {
       "k": "15mm接頭相容"
      },
      {
       "k": "表面/無毛邊"
      },
      {
       "k": "抗扭結"
      },
      {
       "k": "Murphy孔(適用)"
      }
     ],
     "clauses": [
      {
       "no": "Annex E",
       "title_zh": "套囊疝出(herniation)試驗",
       "verified": true
      },
      {
       "no": "Annex F",
       "title_zh": "氣管密封試驗",
       "verified": true
      },
      {
       "no": "Annex H",
       "title_zh": "抗扭結試驗",
       "verified": true
      }
     ],
     "clauses_note": "另有尺寸公差/套囊/15mm接頭等條文(6.x)、Annex G風險辨識；逐條待RA補"
    },
    {
     "no": "ISO 5366",
     "edition": "2016",
     "title": "Anaesthetic and respiratory equipment — Tracheostomy tubes and connectors",
     "title_zh": "氣切管與接頭",
     "applies_to": [
      "tracheostomy",
      "airway",
      "respiratory"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "頸板/尺寸標示"
      },
      {
       "k": "氣囊密封性"
      },
      {
       "k": "15mm接頭相容"
      },
      {
       "k": "內外管配合(適用)"
      }
     ],
     "clauses": [
      {
       "no": "Annex B",
       "title_zh": "頸板與管身結合強度試驗",
       "verified": true
      },
      {
       "no": "Annex C",
       "title_zh": "套囊直徑測定",
       "verified": true
      },
      {
       "no": "Annex D",
       "title_zh": "套囊疝出試驗",
       "verified": true
      },
      {
       "no": "Annex E",
       "title_zh": "抗扭結試驗",
       "verified": true
      }
     ]
    },
    {
     "no": "ISO 8836",
     "edition": "2019",
     "title": "Suction catheters for use in the respiratory tract",
     "title_zh": "呼吸道抽吸導管(抽痰管)",
     "applies_to": [
      "suction",
      "airway",
      "respiratory"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "尺寸/管徑"
      },
      {
       "k": "抽吸端側孔"
      },
      {
       "k": "連接頭/控制閥"
      },
      {
       "k": "表面/微粒"
      },
      {
       "k": "抗扭結"
      }
     ],
     "clauses_note": "規範開放/封閉式抽吸導管尺寸與要求；公開目錄未提供逐條，待RA依正本建檔"
    },
    {
     "no": "ISO 5356-1",
     "edition": "*待確認",
     "title": "Anaesthetic and respiratory equipment — Conical connectors — Part 1: Cones and sockets",
     "title_zh": "麻醉呼吸圓錐連接器(15/22mm)",
     "applies_to": [
      "respiratory",
      "anaesthetic",
      "connector"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "錐度配合"
      },
      {
       "k": "漏氣"
      },
      {
       "k": "分離/結合力"
      }
     ]
    }
   ]
  },
  "11.040.20": {
   "title": "Transfusion, infusion and injection equipment｜輸血、輸液及注射設備",
   "standards": [
    {
     "no": "ISO 8637-2",
     "edition": "2024",
     "title": "Extracorporeal systems for blood purification — Part 2: Extracorporeal blood and fluid circuits",
     "title_zh": "體外血液循環回路(血液回路管/保護套)",
     "applies_to": [
      "dialysis",
      "extracorporeal",
      "bloodline",
      "HD"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "管路漏液/連接強度"
      },
      {
       "k": "血液相容性"
      },
      {
       "k": "抗扭結/抗塌陷"
      },
      {
       "k": "壓力監測埠/保護套完整性"
      },
      {
       "k": "管腔/流量"
      },
      {
       "k": "滅菌"
      }
     ]
    },
    {
     "no": "ISO 8536-4",
     "edition": "2019",
     "title": "Infusion equipment for medical use — Part 4: Infusion sets for single use, gravity feed",
     "title_zh": "單次使用重力式輸液套",
     "applies_to": [
      "infusion",
      "iv",
      "set"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "滴管/滴數"
      },
      {
       "k": "液體過濾器"
      },
      {
       "k": "流量"
      },
      {
       "k": "與容器/針相容"
      },
      {
       "k": "微粒污染"
      },
      {
       "k": "連接80369-7"
      }
     ]
    },
    {
     "no": "ISO 8536-8",
     "edition": "2015",
     "title": "Infusion equipment for medical use — Part 8: Infusion sets with pressure infusion apparatus",
     "title_zh": "加壓輸液套",
     "applies_to": [
      "infusion",
      "iv"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "耐壓/不漏"
      },
      {
       "k": "連接相容"
      },
      {
       "k": "流量"
      }
     ]
    },
    {
     "no": "ISO 15747",
     "edition": "2018",
     "title": "Plastic containers for intravenous injections",
     "title_zh": "靜脈注射用塑膠容器(IV軟袋)",
     "applies_to": [
      "iv-bag",
      "container",
      "infusion",
      "軟袋"
     ],
     "id_verified": true,
     "items_status": "draft_pending_RA",
     "items": [
      {
       "k": "密合性/不漏"
      },
      {
       "k": "穿刺/注射口完整性"
      },
      {
       "k": "透明度/微粒"
      },
      {
       "k": "物理/化學/生物試驗"
      },
      {
       "k": "標示/相容性"
      }
     ]
    }
   ]
  }
 },
 "cross_cutting": {
  "_note": "跨器材通用，幾乎所有無菌植入/介入器材都需涵蓋。AI 應視器材性質判斷是否納入。",
  "standards": [
   {
    "no": "ISO 10993-1",
    "edition": "2018",
    "title": "Biological evaluation of medical devices — Part 1: Evaluation and testing within a risk management process",
    "title_zh": "醫療器材生物相容性評估—第1部:風險管理流程內的評估與試驗",
    "applies_to": [
     "跨領域",
     "biocompat"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "細胞毒性",
      "en": "cytotoxicity"
     },
     {
      "k": "致敏性",
      "en": "sensitization"
     },
     {
      "k": "刺激/皮內反應",
      "en": "irritation"
     },
     {
      "k": "(依接觸類型與時間擴充)",
      "en": "per contact category/duration"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "生物相容評估之一般原則(於風險管理流程內)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "器材分類(依接觸性質與接觸時間)",
      "verified": true
     },
     {
      "no": "5.2",
      "title_zh": "依接觸性質分類(體表/外部連通/植入)",
      "verified": true
     },
     {
      "no": "5.3",
      "title_zh": "依接觸時間分類(短/長/持久)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "生物評估流程",
      "verified": true
     },
     {
      "no": "6.1",
      "title_zh": "生物風險分析之物理/化學資訊",
      "verified": true
     },
     {
      "no": "6.2",
      "title_zh": "缺口分析與生物終點選擇",
      "verified": true
     },
     {
      "no": "6.3",
      "title_zh": "生物試驗(評估用測試)",
      "verified": true
     },
     {
      "no": "7",
      "title_zh": "生物評估資料解讀與整體生物風險評估",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "生物風險評估應涵蓋之終點(資訊性)",
      "verified": true
     },
     {
      "no": "Annex B",
      "title_zh": "風險管理流程內執行生物評估之指引(資訊性)",
      "verified": true
     },
     {
      "no": "Annex C",
      "title_zh": "文獻回顧建議程序(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2018版/第5版,含2018-10更正)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11135",
    "edition": "2014",
    "title": "Sterilization of health care products — Ethylene oxide — Requirements for development, validation and routine control",
    "title_zh": "EO 環氧乙烷滅菌確效",
    "applies_to": [
     "跨領域",
     "sterilization-EO"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "滅菌確效(SAL 10^-6)",
      "en": "validation"
     },
     {
      "k": "EO/ECH 殘留",
      "en": "residuals (見 10993-7)"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "品質管理系統元素(文件、管理職責、產品實現)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "滅菌劑特性鑑定(EO)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "製程與設備特性鑑定",
      "verified": true
     },
     {
      "no": "7",
      "title_zh": "產品定義(材料/包裝/微生物品質)",
      "verified": true
     },
     {
      "no": "8",
      "title_zh": "製程定義(循環參數)",
      "verified": true
     },
     {
      "no": "9",
      "title_zh": "確效",
      "verified": true
     },
     {
      "no": "9.x",
      "title_zh": "安裝/操作/性能確效(IQ/OQ/PQ，含微生物PQ)",
      "verified": false
     },
     {
      "no": "10",
      "title_zh": "例行監測與控制",
      "verified": true
     },
     {
      "no": "11",
      "title_zh": "從滅菌放行產品(含參數放行)",
      "verified": true
     },
     {
      "no": "12",
      "title_zh": "維持製程有效性(再確效)",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "微生物方法(規範性)",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "單批放行(2018修訂)",
      "verified": true
     }
    ],
    "clauses_source": "ISO 官方/EN ISO/ANSI AAMI 一致 (2014版/第2版，含Amd1:2018 Annex E)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。標 verified:false 之子條為依範圍推得待正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11137-1",
    "edition": "2006",
    "title": "Sterilization of health care products — Radiation — Part 1: Requirements for development, validation and routine control",
    "title_zh": "輻射滅菌確效",
    "applies_to": [
     "跨領域",
     "sterilization-radiation"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "劑量確立(VDmax 等)",
      "en": "dose setting"
     },
     {
      "k": "材料相容性",
      "en": "material effects"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "品質管理系統元素(文件、管理職責、產品實現)",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "滅菌劑特性鑑定(輻射：60Co/137Cs/電子束/X射線)",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "製程與設備特性鑑定",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "產品定義(材料/包裝相容性)",
      "verified": false
     },
     {
      "no": "8",
      "title_zh": "製程定義(製程參數/劑量)",
      "verified": false
     },
     {
      "no": "9",
      "title_zh": "確效(IQ/OQ/PQ)",
      "verified": false
     },
     {
      "no": "10",
      "title_zh": "例行監測與控制",
      "verified": false
     },
     {
      "no": "11",
      "title_zh": "從滅菌放行產品",
      "verified": false
     },
     {
      "no": "12",
      "title_zh": "維持製程有效性(再確效)",
      "verified": false
     },
     {
      "no": "Annex B",
      "title_zh": "劑量設定與驗證(配合ISO 11137-2)",
      "verified": false
     }
    ],
    "clauses_source": "ISO/TC198 滅菌系列共通架構(與已確認之11135一致)；2006版/第2版，注意2025已改版",
    "clauses_note": "章節架構取自 ISO/TC198 滅菌系列共通編排(已由11135正本確認)，屬功能結構；未含規範正文。標 verified:false 之條為依共通架構推得，精確條號待該標準正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11607-1",
    "edition": "2019",
    "title": "Packaging for terminally sterilized medical devices — Part 1: Requirements for materials, sterile barrier systems and packaging systems",
    "title_zh": "最終滅菌器材包裝—無菌屏障系統",
    "applies_to": [
     "跨領域",
     "packaging"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "封口強度/完整性",
      "en": "seal strength/integrity"
     },
     {
      "k": "老化(實時/加速)",
      "en": "aging / shelf life"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般要求(風險管理、文件)",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "材料與預成型無菌屏障系統之要求",
      "verified": false
     },
     {
      "no": "5.x",
      "title_zh": "材料基本屬性(微生物屏障/相容滅菌/毒理)",
      "verified": false
     },
     {
      "no": "5.x",
      "title_zh": "密封強度、密封寬度、剝離特性(連續均勻、無分層/撕裂)",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "包裝系統設計與設計確效",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "無菌呈現之可用性評估(2019新增)",
      "verified": false
     }
    ],
    "clauses_source": "ISO OBP 範圍/ANSI AAMI 一致 (2019版/第2版，2024確認現行，含Amd1；僅收功能結構)",
    "clauses_note": "功能結構取自 ISO 官方範圍與一致權威整理；未含規範正文。標 verified:false 之條為依範圍/功能推得，精確條號待正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 80369-7",
    "edition": "*待確認",
    "title": "Small-bore connectors for liquids and gases in healthcare applications — Part 7: Connectors for intravascular or hypodermic applications",
    "title_zh": "小口徑連接器—第7部:血管內/皮下(取代舊 Luer ISO 594)",
    "applies_to": [
     "intravascular",
     "connector",
     "luer",
     "needle"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "接頭結合/漏液/分離力",
      "en": "leakage / separation / overriding"
     }
    ]
   },
   {
    "no": "ISO 7864",
    "edition": "*待確認",
    "title": "Sterile hypodermic needles for single use — Requirements and test methods",
    "title_zh": "無菌單次使用皮下注射針(對應針/同軸導引針)",
    "applies_to": [
     "needle",
     "guide"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "針管與針座結合強度",
      "en": "hub/needle bond"
     },
     {
      "k": "針尖穿刺力/銳利度",
      "en": "penetration / sharpness"
     },
     {
      "k": "通暢性/不漏液",
      "en": "patency"
     }
    ],
    "clauses": [
     {
      "no": "4.3",
      "title_zh": "清潔度",
      "verified": true
     },
     {
      "no": "4.4",
      "title_zh": "酸鹼度限值",
      "verified": true
     },
     {
      "no": "4.5",
      "title_zh": "可萃取金屬限值",
      "verified": true
     },
     {
      "no": "4.6",
      "title_zh": "尺寸標稱(管狀/錐狀針)",
      "verified": true
     },
     {
      "no": "4.7",
      "title_zh": "色碼(依ISO 6009)",
      "verified": true
     },
     {
      "no": "4.8",
      "title_zh": "針座(hub)/錐形接頭(依ISO 80369-7)",
      "verified": true
     },
     {
      "no": "4.9",
      "title_zh": "針帽(cap)",
      "verified": true
     },
     {
      "no": "4.10",
      "title_zh": "針管(尺寸公差/無瑕疵/潤滑)",
      "verified": true
     },
     {
      "no": "4.11",
      "title_zh": "針尖",
      "verified": true
     },
     {
      "no": "4.12",
      "title_zh": "針座與針管接合強度",
      "verified": true
     },
     {
      "no": "4.13",
      "title_zh": "管腔暢通(patency)",
      "verified": true
     },
     {
      "no": "4.14",
      "title_zh": "針扎傷害防護(sharps injury protection)",
      "verified": true
     },
     {
      "no": "4.15",
      "title_zh": "無菌與生物相容",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "包裝(單一/使用者包裝)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "製造商應提供資訊",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "萃取液製備方法",
      "verified": true
     },
     {
      "no": "Annex D",
      "title_zh": "穿刺/拔出力(drag force)試驗",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "針座-針管接合強度試驗",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2016版/第4版)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 9626",
    "edition": "*待確認",
    "title": "Stainless steel needle tubing for the manufacture of medical devices — Requirements and test methods",
    "title_zh": "醫療器材用不鏽鋼針管",
    "applies_to": [
     "needle",
     "guide",
     "tubing"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "尺寸/壁厚",
      "en": "dimensions"
     },
     {
      "k": "剛性/抗折",
      "en": "stiffness / breakage resistance"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "材料(不鏽鋼，須符合生物相容ISO 10993-1)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "尺寸(規格0.18–3.4mm)與壁厚標稱",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "表面/外觀(直度、圓度、無金屬污)",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "萃取液製備方法",
      "verified": true
     },
     {
      "no": "Annex B",
      "title_zh": "管材剛性(stiffness)試驗",
      "verified": true
     },
     {
      "no": "Annex C",
      "title_zh": "管材抗破壞(resistance to breakage)試驗",
      "verified": true
     },
     {
      "no": "Annex D",
      "title_zh": "抗腐蝕(corrosion)試驗",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "管材剛性試驗法之原理(資訊性)",
      "verified": false
     }
    ],
    "clauses_source": "ISO 官方範圍/附錄整理 (2016版/第2版；ANSI Blog + ISO目錄)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 14971",
    "edition": "2019*",
    "title": "Medical devices — Application of risk management to medical devices",
    "title_zh": "醫療器材風險管理",
    "applies_to": [
     "跨領域",
     "risk"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "風險分析/評估"
     },
     {
      "k": "風險控制措施"
     },
     {
      "k": "剩餘風險可接受性"
     },
     {
      "k": "風險效益"
     },
     {
      "k": "生產與上市後資訊"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "風險管理一般要求(含風險管理流程、職責、計畫、檔案)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "風險分析(危害鑑別與風險估計)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "風險評估(對照可接受準則)",
      "verified": true
     },
     {
      "no": "7",
      "title_zh": "風險控制(措施選擇、實施、驗證、剩餘風險)",
      "verified": true
     },
     {
      "no": "8",
      "title_zh": "整體剩餘風險評估(含效益-風險分析)",
      "verified": true
     },
     {
      "no": "9",
      "title_zh": "風險管理審查(上市前)",
      "verified": true
     },
     {
      "no": "10",
      "title_zh": "生產與後生產資訊(上市後監督回饋)",
      "verified": true
     }
    ],
    "clauses_source": "ISO 官方/多權威來源一致 (2019版/第3版；僅收主章)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 13485",
    "edition": "2016*",
    "title": "Medical devices — Quality management systems — Requirements for regulatory purposes",
    "title_zh": "醫療器材品質管理系統",
    "applies_to": [
     "跨領域",
     "qms"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "設計管制"
     },
     {
      "k": "製程確效"
     },
     {
      "k": "CAPA/不符合"
     },
     {
      "k": "供應商管制"
     },
     {
      "k": "可追溯性"
     }
    ]
   },
   {
    "no": "ISO 15223-1",
    "edition": "2021*",
    "title": "Medical devices — Symbols to be used with information to be supplied — Part 1: General requirements",
    "title_zh": "醫療器材標籤用符號",
    "applies_to": [
     "跨領域",
     "labeling"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "符號正確性"
     },
     {
      "k": "批號/序號"
     },
     {
      "k": "滅菌方式符號"
     },
     {
      "k": "有效期限"
     },
     {
      "k": "單次使用"
     }
    ]
   },
   {
    "no": "ISO 20417",
    "edition": "2021*",
    "title": "Medical devices — Information to be supplied by the manufacturer",
    "title_zh": "製造商應提供的資訊(IFU/標示)",
    "applies_to": [
     "跨領域",
     "labeling",
     "ifu"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "IFU 內容完整性"
     },
     {
      "k": "警告/禁忌"
     },
     {
      "k": "UDI/識別"
     },
     {
      "k": "製造商資訊"
     }
    ]
   },
   {
    "no": "IEC 62366-1",
    "edition": "2015*",
    "title": "Medical devices — Application of usability engineering to medical devices",
    "title_zh": "醫療器材可用性工程(人因)",
    "applies_to": [
     "跨領域",
     "usability"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "使用情境/使用者"
     },
     {
      "k": "使用相關風險"
     },
     {
      "k": "形成性評估"
     },
     {
      "k": "總結性評估"
     }
    ]
   },
   {
    "no": "ISO 17665",
    "edition": "2024",
    "title": "Sterilization of health care products — Moist heat",
    "title_zh": "濕熱(蒸氣)滅菌確效",
    "applies_to": [
     "跨領域",
     "sterilization-steam"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "滅菌確效(SAL 10^-6)"
     },
     {
      "k": "材料耐受性"
     },
     {
      "k": "週期參數"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "品質管理系統元素(文件、管理職責、產品實現)",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "滅菌劑特性鑑定(濕熱(飽和蒸氣/空氣-蒸氣混合等))",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "製程與設備特性鑑定",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "產品定義(材料/包裝相容性)",
      "verified": false
     },
     {
      "no": "8",
      "title_zh": "製程定義(製程參數/劑量)",
      "verified": false
     },
     {
      "no": "9",
      "title_zh": "確效(IQ/OQ/PQ)",
      "verified": false
     },
     {
      "no": "10",
      "title_zh": "例行監測與控制",
      "verified": false
     },
     {
      "no": "11",
      "title_zh": "從滅菌放行產品",
      "verified": false
     },
     {
      "no": "12",
      "title_zh": "維持製程有效性(再確效)",
      "verified": false
     },
     {
      "no": "Annex A",
      "title_zh": "濕熱滅菌原理與要求依據(資訊性)",
      "verified": true
     },
     {
      "no": "Annex F",
      "title_zh": "醫療機構應用指引(資訊性)",
      "verified": true
     },
     {
      "no": "Annex H",
      "title_zh": "工業應用指引(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP 範圍/ISO/TC198 共通架構；2024版(單一標準，取代17665-1:2006+TS-2+TS-3三合一)",
    "clauses_note": "章節架構取自 ISO/TC198 滅菌系列共通編排(已由11135正本確認)，屬功能結構；未含規範正文。標 verified:false 之條為依共通架構推得，精確條號待該標準正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11737-1",
    "edition": "2018",
    "title": "Sterilization of health care products — Microbiological methods — Part 1: Determination of a population of microorganisms on products",
    "title_zh": "生物負荷(Bioburden)測定",
    "applies_to": [
     "跨領域",
     "bioburden"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "生物負荷計數"
     },
     {
      "k": "回收率驗證"
     },
     {
      "k": "定期監測"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般要求(風險導向、量測不確定度考量)",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "生物負荷測定—樣本選取與抽樣",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "微生物回收方法(移除/洗提技術)",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "計數技術(平板計數/薄膜過濾/最大可能數MPN)",
      "verified": false
     },
     {
      "no": "8",
      "title_zh": "方法適用性試驗(回收效率/校正因子、LOD)",
      "verified": false
     },
     {
      "no": "9",
      "title_zh": "生物負荷資料解讀與微生物特性鑑定",
      "verified": false
     },
     {
      "no": "Annex A",
      "title_zh": "對Clause 1–9之指引(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO 官方範圍/ANSI AAMI 一致 (2018版/第3版，含Amd1:2021；僅收功能結構)",
    "clauses_note": "條號/標題取自 ISO 官方範圍與一致權威整理，屬事實性結構；未含規範正文。標 verified:false 之條為依範圍/功能推得，精確條號待正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11737-2",
    "edition": "2019",
    "title": "Sterilization of health care products — Microbiological methods — Part 2: Tests of sterility performed in the definition, validation and maintenance of a sterilization process",
    "title_zh": "滅菌確效用無菌試驗",
    "applies_to": [
     "跨領域",
     "sterility-test"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "無菌試驗"
     },
     {
      "k": "培養條件"
     },
     {
      "k": "確效用試驗"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般要求",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "無菌試驗—於製程定義/確效/維持之應用",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "試驗方法驗證(培養基適用性、控制懸浮液初始菌數)",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "無菌試驗執行(樣本、培養條件)",
      "verified": false
     },
     {
      "no": "8",
      "title_zh": "結果解讀與報告",
      "verified": false
     }
    ],
    "clauses_source": "ISO 官方範圍/多權威來源一致 (2019版/第3版；僅收功能結構)",
    "clauses_note": "條號/標題取自 ISO 官方範圍與一致權威整理，屬事實性結構；未含規範正文。標 verified:false 之條為依範圍/功能推得，精確條號待正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 11607-2",
    "edition": "2019",
    "title": "Packaging for terminally sterilized medical devices — Part 2: Validation requirements for forming, sealing and assembly processes",
    "title_zh": "最終滅菌包裝—成形/密封/組裝製程確效",
    "applies_to": [
     "跨領域",
     "packaging"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "封口製程確效(IQ/OQ/PQ)"
     },
     {
      "k": "封口參數"
     },
     {
      "k": "製程穩定性"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般要求",
      "verified": false
     },
     {
      "no": "5",
      "title_zh": "成形/密封/組裝製程開發",
      "verified": false
     },
     {
      "no": "6",
      "title_zh": "製程確效(IQ/OQ/PQ)",
      "verified": false
     },
     {
      "no": "6.x",
      "title_zh": "安裝確效IQ",
      "verified": false
     },
     {
      "no": "6.x",
      "title_zh": "操作確效OQ(製程參數範圍)",
      "verified": false
     },
     {
      "no": "6.x",
      "title_zh": "性能確效PQ(密封完整性/再現性)",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "正常操作中之製程管控與監測",
      "verified": false
     }
    ],
    "clauses_source": "ISO OBP 範圍/ANSI AAMI 一致 (2019版/第2版，含Amd1；僅收功能結構)",
    "clauses_note": "功能結構取自 ISO 官方範圍與一致權威整理；未含規範正文。標 verified:false 之條為依範圍/功能推得，精確條號待正本確認。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-4",
    "edition": "2017",
    "title": "Biological evaluation of medical devices — Part 4: Selection of tests for interactions with blood",
    "title_zh": "生物相容—血液相互作用(血液相容性)",
    "applies_to": [
     "跨領域",
     "biocompat",
     "blood"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "血栓形成"
     },
     {
      "k": "凝血"
     },
     {
      "k": "血小板"
     },
     {
      "k": "血液學"
     },
     {
      "k": "補體活化"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "縮寫術語",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "血液接觸器材類型(依10993-1分類)",
      "verified": true
     },
     {
      "no": "5.2",
      "title_zh": "外部連通器材(間接/直接接觸循環血液)",
      "verified": true
     },
     {
      "no": "5.3",
      "title_zh": "植入器材",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "血液交互作用之表徵",
      "verified": true
     },
     {
      "no": "6.1",
      "title_zh": "一般要求",
      "verified": true
     },
     {
      "no": "6.2",
      "title_zh": "試驗類別與血液交互作用(建議試驗)",
      "verified": true
     },
     {
      "no": "6.3",
      "title_zh": "試驗類型(in vitro / ex vivo / in vivo)",
      "verified": true
     },
     {
      "no": "Annex B",
      "title_zh": "建議實驗室試驗—原理/科學基礎/解讀(資訊性)",
      "verified": true
     },
     {
      "no": "Annex C",
      "title_zh": "血栓—in vivo 試驗法(資訊性)",
      "verified": true
     },
     {
      "no": "Annex D",
      "title_zh": "血液學/溶血—試驗與溶血性評估法(資訊性)",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "補體—試驗法(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2017版/第3版)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-5",
    "edition": "2009",
    "title": "Biological evaluation of medical devices — Part 5: Tests for in vitro cytotoxicity",
    "title_zh": "生物相容—體外細胞毒性",
    "applies_to": [
     "跨領域",
     "biocompat"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "細胞毒性(MTT/中性紅)"
     },
     {
      "k": "萃取/直接接觸"
     },
     {
      "k": "存活率判定"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "試樣與對照製備",
      "verified": true
     },
     {
      "no": "4.2",
      "title_zh": "材料液態萃取液製備",
      "verified": true
     },
     {
      "no": "4.3",
      "title_zh": "直接接觸試驗材料製備",
      "verified": true
     },
     {
      "no": "4.4",
      "title_zh": "對照組製備(陰/陽性、空白)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "細胞株",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "培養基",
      "verified": true
     },
     {
      "no": "7",
      "title_zh": "細胞庫培養製備",
      "verified": true
     },
     {
      "no": "8",
      "title_zh": "試驗程序(萃取液/直接接觸/間接接觸)",
      "verified": true
     },
     {
      "no": "8.2",
      "title_zh": "萃取液試驗",
      "verified": true
     },
     {
      "no": "8.3",
      "title_zh": "直接接觸試驗",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/官方目次 (2009版/第3版)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-7",
    "edition": "2008",
    "title": "Biological evaluation of medical devices — Part 7: Ethylene oxide sterilization residuals",
    "title_zh": "生物相容—EO 滅菌殘留",
    "applies_to": [
     "跨領域",
     "biocompat",
     "sterilization-EO"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "EO 殘留限值"
     },
     {
      "k": "ECH 殘留"
     },
     {
      "k": "萃取/分析方法"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "要求",
      "verified": true
     },
     {
      "no": "4.2",
      "title_zh": "器材分類(短期A/長期B/持久C接觸)",
      "verified": true
     },
     {
      "no": "4.3",
      "title_zh": "EO/ECH 容許限值",
      "verified": true
     },
     {
      "no": "4.4",
      "title_zh": "EO 與 ECH 殘留量測定",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "產品放行",
      "verified": true
     },
     {
      "no": "5.3",
      "title_zh": "以殘留消散曲線放行之程序",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "氣相層析圖評估(規範性)",
      "verified": true
     },
     {
      "no": "Annex B",
      "title_zh": "EO/ECH 氣相層析測定(資訊性)",
      "verified": true
     },
     {
      "no": "Annex C",
      "title_zh": "EO/ECH 殘留判定流程圖與指引(資訊性)",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "殘留 EO 測定之萃取條件(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2008版/第2版，含Amd 1:2019嬰幼兒限值)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-10",
    "edition": "2021",
    "title": "Biological evaluation of medical devices — Part 10: Tests for skin sensitization",
    "title_zh": "生物相容—皮膚致敏試驗",
    "applies_to": [
     "跨領域",
     "biocompat"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "致敏性(LLNA/GPMT)"
     },
     {
      "k": "萃取"
     },
     {
      "k": "判定"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般原則—階段式做法",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "試驗前考量(材料類型/化學組成資訊)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "皮膚致敏試驗",
      "verified": true
     },
     {
      "no": "6.1",
      "title_zh": "試驗方法選擇",
      "verified": true
     },
     {
      "no": "6.2",
      "title_zh": "小鼠局部淋巴結試驗(LLNA)",
      "verified": true
     },
     {
      "no": "6.3",
      "title_zh": "天竺鼠致敏試驗(GPMT/Buehler)",
      "verified": true
     },
     {
      "no": "Annex A",
      "title_zh": "試樣製備說明(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2021版/第4版；刺激試驗已移至10993-23)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-18",
    "edition": "2020",
    "title": "Biological evaluation of medical devices — Part 18: Chemical characterization of materials",
    "title_zh": "生物相容—材料化學特性鑑別(溶出/可萃取物)",
    "applies_to": [
     "跨領域",
     "biocompat",
     "chemical"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "可萃取/可溶出物"
     },
     {
      "k": "分析閾值(AET)"
     },
     {
      "k": "毒理風險評估(連 -17)"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "符號與縮寫",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "化學表徵程序",
      "verified": true
     },
     {
      "no": "5.2",
      "title_zh": "確立器材構型與材料組成(資訊蒐集/產生)",
      "verified": true
     },
     {
      "no": "5.3",
      "title_zh": "與臨床已確立材料之化學等效性評估",
      "verified": true
     },
     {
      "no": "5.4",
      "title_zh": "最壞情況化學釋放估計",
      "verified": true
     },
     {
      "no": "5.5",
      "title_zh": "建立分析評估閾值(AET)",
      "verified": true
     },
     {
      "no": "Annex C",
      "title_zh": "建立生物等效性之原則(資訊性)",
      "verified": true
     },
     {
      "no": "Annex D",
      "title_zh": "試樣萃取原則(資訊性)",
      "verified": true
     },
     {
      "no": "Annex E",
      "title_zh": "AET 計算與應用(資訊性)",
      "verified": true
     },
     {
      "no": "Annex F",
      "title_zh": "萃取物/溶出物分析方法驗證(資訊性)",
      "verified": true
     },
     {
      "no": "Annex G",
      "title_zh": "分析方法與化學資料之報告細節(資訊性)",
      "verified": true
     }
    ],
    "clauses_source": "ISO OBP/iTeh 官方預覽目次 (2020版/第2版)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)，屬事實性目次；未含規範正文。一律以正本最新版次為準，需 RA 核可。"
   },
   {
    "no": "ISO 10993-23",
    "edition": "2021",
    "title": "Biological evaluation of medical devices — Part 23: Tests for irritation",
    "title_zh": "生物相容—刺激性試驗",
    "applies_to": [
     "跨領域",
     "biocompat"
    ],
    "id_verified": true,
    "items_status": "draft_pending_RA",
    "items": [
     {
      "k": "刺激性(RhE 體外/體內)"
     },
     {
      "k": "萃取"
     },
     {
      "k": "判定"
     }
    ],
    "clauses": [
     {
      "no": "4",
      "title_zh": "一般考量—階段式做法(優先in silico/in vitro，再in vivo)",
      "verified": true
     },
     {
      "no": "5",
      "title_zh": "試驗前考量(材料化學資訊/暴露途徑)",
      "verified": true
     },
     {
      "no": "6",
      "title_zh": "刺激試驗程序",
      "verified": true
     },
     {
      "no": "6.x",
      "title_zh": "in vitro 皮膚刺激(重建人類表皮RhE模型，對應OECD 439)",
      "verified": false
     },
     {
      "no": "6.x",
      "title_zh": "in vivo 刺激試驗(必要時)",
      "verified": false
     },
     {
      "no": "7",
      "title_zh": "結果解讀關鍵因子",
      "verified": true
     }
    ],
    "clauses_source": "ISO 官方範圍/多權威來源一致 (2021版/第1版；刺激試驗，2021年自10993-10分出)",
    "clauses_note": "條號/標題取自 ISO 官方公開預覽目次(OBP/iTeh)或一致權威整理，屬事實性目次；未含規範正文。標 verified:false 之子條為依範圍推得待正本確認。一律以正本最新版次為準，需 RA 核可。"
   }
  ]
 }
};
