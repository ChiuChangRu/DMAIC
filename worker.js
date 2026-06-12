// MedQA Worker v5.3-b01 — 因子判斷通則 + ISO配對防呆(10993/13485/11607) + MAUDE + 510k萃取
// 部署辨識：Ctrl+F 搜「v5.3-b01」或「PACKAGE_RE」搜得到 = 已是最新版
// WORKER_V53
// 既有：verification_plan + fishbone_to_doe + summarize_factors + identify_device + iso_crosscheck
// 部署：Cloudflare Workers，ANTHROPIC_API_KEY 存於 Secret

const ALLOWED_ORIGINS = [
  'https://chiuchangru.github.io',
];

// 地理限制：只允許這些國家/地區（Cloudflare CF-IPCountry）
const ALLOWED_COUNTRIES = ['TW'];

// 模型分流政策 - 全部降低成本
const TOOL_MODEL_POLICY = {
  boxplot: 'haiku', scatter: 'haiku', histogram: 'haiku',
  spc: 'haiku', msa: 'haiku', doe: 'haiku',
  hypothesis: 'haiku', capa: 'haiku',
  pb: 'haiku',
  fishbone: 'haiku',  // 省成本：魚骨圖改 haiku（原 sonnet）
};
const MODEL_MAP = {
  haiku:  'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-6',
  opus:   'claude-sonnet-4-6',  // opus 也導向 sonnet 省錢
};

// 各「模式」省成本分流：只有真正定義分析品質的步驟用 sonnet，其餘一律 haiku。
// 想調整成本/品質，只改這一張表即可。
const MODE_MODEL = {
  verification_plan: 'sonnet',  // 核心：因子→管道→工具→因果鏈，品質關鍵 → 保留 sonnet
  identify_device:   'haiku',   // 器材識別，haiku 足夠
  summarize_factors: 'sonnet', // 因子+關聯+驗證方式是報告品質命脈，用 sonnet（合併原 verification_plan，整體仍少一次呼叫）
  iso_crosscheck:    'haiku',   // 有確定性防幻覺閘保護，haiku 可
  plan_narrative:    'haiku',   // 嚴格提示+只用既有事實，haiku 可（省最多）
  interception_review:'haiku',  // 監控攔截力檢討：篩2-4個關鍵點，haiku 足夠
  fishbone_generate: 'haiku',
  fishbone_to_doe:   'haiku',
  navigate:          'haiku',
  stream_navigate:   'haiku',
  analyze:           'haiku'
};
function modeModel(mode){ return MODEL_MAP[MODE_MODEL[mode] || 'haiku']; }

// 每個工具的三問題模板
const TOOL_QUESTIONS = {

  // ── DOE：依設計類型自動對應 ──
  // statsText 前端會帶入設計類型關鍵字（全因子 / Fractional / Plackett-Burman）
  // 三個問題對全部設計通用，AI 根據 statsText 內容自行判斷
  doe: {
    q1: '數據品質與設計適切性：殘差常態性、重複次數是否足夠；若為部分因子請說明 Resolution 等級對結論的限制；若為 PB 設計請說明篩選用途與交互作用無法估計的限制',
    q2: '顯著因子判讀：哪些因子（主效應/交互作用）顯著、效應大小與方向；若為 Fractional 需提醒 Alias 混淆風險；若為 PB 建議帶入全因子確認',
    q3: '製程優化建議：依顯著因子給出參數調整方向；若數據不合理說明原因並建議重新試驗（包含是否需升級設計類型）',
  },

  scatter: {
    q1: '相關強度與方向（Pearson r、R²）、樣本數是否足夠',
    q2: '線性或非線性關係、是否有離群值影響相關性',
    q3: '相關不等於因果的提醒，以及後續驗證建議',
  },

  msa: {
    q1: '%GRR 可接受性判定（<10% 優良 / 10–30% 可接受 / >30% 不可接受）',
    q2: '變異來源分析：重複性 (EV) vs 再現性 (AV) 何者主導',
    q3: 'ndc 是否 ≥5、量測系統是否需改善及改善方向',
  },

  spc: {
    q1: '製程是否在管制內（Nelson 規則觸發情況）、數據穩定性評估',
    q2: '製程能力 Cp/Cpk 評估、是否滿足規格要求',
    q3: '製程改善建議或異常調查方向',
  },

  histogram: {
    q1: '常態性檢定結果（Shapiro-Wilk / Anderson-Darling）、分布形狀描述',
    q2: '偏態、峰態係數解讀、是否有離群值或雙峰現象',
    q3: '製程能力適用性與後續分析工具建議',
  },

  hypothesis: {
    q1: '檢定結果與 p 值判讀、前提假設（常態性、變異數齊一性）是否滿足',
    q2: '效應量（Cohen\'s d）大小、檢定力是否足夠、樣本數是否充足',
    q3: '統計結論與實務意義（統計顯著 ≠ 實務重要，需結合工程判斷）',
  },

  boxplot: {
    q1: '各組分布特徵：中位數、IQR、對稱性、是否有離群值',
    q2: '組間差異比較：位置（中位數）與離散程度（IQR）是否有明顯差異',
    q3: '是否需要進一步假設檢定（如 t-test / ANOVA）確認差異顯著性',
  },

  fishbone: {
    q1: '根本原因完整性：6M 各類別原因是否涵蓋、哪個類別原因最集中',
    q2: '最可能的關鍵根因（優先順序）：依原因數量與製程邏輯判斷',
    q3: '後續驗證建議：推薦使用哪些統計工具（DOE、假設檢定、SPC 等）進行確認',
  },

  pb: {
    q1: 'PB 設計適切性：實驗次數是否足夠、主效應估計可靠性、交互作用混淆的限制說明',
    q2: '顯著因子判讀：哪些因子效應顯著（依效應值大小與 Half-Normal Plot）、方向為正或負',
    q3: '後續建議：顯著因子是否足夠（2-4個）帶入全因子 DOE；若無顯著因子可能的原因',
  },
};

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // 來源網域限制
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: '來源不允許' }), {
        status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }

    // 地理限制
    const country = request.headers.get('CF-IPCountry') || '';
    if (country && !ALLOWED_COUNTRIES.includes(country)) {
      return new Response(JSON.stringify({ error: '此服務僅限特定地區使用' }), {
        status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }

    try {
      // 次數限制：每 IP 每分鐘最多 20 次
      const RATE_LIMIT = 20;
      const RATE_WINDOW = 60;
      const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
      if (env.RATE_KV) {
        try {
          const key = 'rl:' + clientIP;
          const cur = await env.RATE_KV.get(key);
          const count = cur ? parseInt(cur) : 0;
          if (count >= RATE_LIMIT) {
            return new Response(JSON.stringify({ error: '請求過於頻繁，請稍後再試（每分鐘上限 ' + RATE_LIMIT + ' 次）' }), {
              status: 429, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
            });
          }
          await env.RATE_KV.put(key, String(count + 1), { expirationTtl: RATE_WINDOW });
        } catch (e) { /* KV 失敗不阻擋正常請求 */ }
      }

      const body = await request.json();

      // 輸入長度限制
      const msgs = body.messages || [];
      const rawLen = JSON.stringify(msgs).length;
      if (rawLen > 30000) {
        return new Response(JSON.stringify({ error: '輸入過長（上限 30000 字元）' }), {
          status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
        });
      }
      if (msgs.length > 30) {
        return new Response(JSON.stringify({ error: '對話過長（上限 30 則），請重新開始' }), {
          status: 413, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
        });
      }

      // 合法 mode 限制
      const mode = body.mode || 'chat';
      const VALID_MODES = ['navigate', 'analyze', 'chat', 'fishbone_generate', 'identify_device', 'summarize_factors', 'verification_plan', 'iso_crosscheck', 'iso_factor_match', 'plan_narrative', 'interception_review', 'fda_verification', 'stream_navigate', 'fishbone_to_doe', 'version'];
      if (!VALID_MODES.includes(mode)) {
        return new Response(JSON.stringify({ error: '無效的 mode' }), {
          status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
        });
      }

      // ══ version：回傳 Worker 版本 ══
      if (mode === 'version') {
        return json({ mode: 'version', version: 'v5.3-b01', features: ['因子判斷通則','ISO配對防呆(10993/13485/11607)','MAUDE','510k萃取','510k標紅中英'] }, origin);
      }

      // ══ fishbone_to_doe：魚骨圖因子轉換為 DOE 實驗設計格式 ══
      if (mode === 'fishbone_to_doe') {
        const resp = await callClaude(env, modeModel('fishbone_to_doe'), {
          max_tokens: 800,
          system: `你是實驗設計（DOE）專家，將魚骨圖選出的可調變因子轉換成 DOE 實驗格式。
規則：
- 只處理可主動設定高低水準的連續因子（溫度、時間、壓力、濃度、速度等）
- 每個因子給出合理的低水準和高水準建議（根據製程常識）
- 單位要具體（°C、min、%、mm 等）
- 繁體中文`,
          tools: [{
            name: 'doe_factors',
            description: '轉換後的 DOE 因子清單',
            input_schema: {
              type: 'object',
              properties: {
                factors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      factor:   { type: 'string', description: '因子名稱' },
                      unit:     { type: 'string', description: '單位（°C/min/%/mm 等）' },
                      low:      { type: 'string', description: '低水準數值' },
                      high:     { type: 'string', description: '高水準數值' },
                      original: { type: 'string', description: '原始因子名稱' }
                    },
                    required: ['factor','unit','low','high','original']
                  }
                }
              },
              required: ['factors']
            }
          }],
          tool_choice: { type: 'tool', name: 'doe_factors' },
          messages: body.messages || []
        });
        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const factors = (tu && tu.input && tu.input.factors) || null;
        return json({ mode: 'fishbone_to_doe', factors }, origin);
      }

      // ══ stream_navigate：串流版 CAPA 對話 ══
      if (mode === 'stream_navigate') {
        const deviceContext = body.deviceInfo ? `
【已確認的醫療器材】
器材：${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
用途：${body.deviceInfo.indication}
關鍵品質特性：${(body.deviceInfo.key_quality||[]).join('、')}
絕對不能提及的失效原因：${(body.deviceInfo.cannot_be||[]).join('、')}
` : '';

        const surveyContext = body.surveyData ? `
【使用者問卷答案】
- 問題出現時機：${body.surveyData.timing || '未填'}
- 發現階段：${body.surveyData.stage || '未填'}
- 是否有量化數據：${body.surveyData.data || '未填'}
- 近期是否有變更：${body.surveyData.change || '未填'}
請根據以上問卷答案分析問題方向，只針對【不明確或矛盾】的地方追問。` : '';

        const maudeContext = (body.maudeProblems && body.maudeProblems.length) ? `
【FDA MAUDE 同類產品真實不良事件】
同類產品在 FDA 不良事件資料庫中常見的問題類型：${body.maudeProblems.join('、')}
追問時可參考這些真實案例，主動詢問使用者「這次的問題是否與其中某類相關」，讓追問更具體。但不要假設使用者的問題一定是這些；以使用者實際描述為準。` : '';

        const streamResp = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'tools-2024-04-04',
          },
          body: JSON.stringify({
            model: modeModel('stream_navigate'),
            max_tokens: 800,
            stream: true,
            system: `你是醫療器材品質工程師的 CAPA 引導助理，遵循 DMAIC 流程。你的任務是「問出問題的關鍵成因」，不是閒聊。
${deviceContext}
${surveyContext}
${maudeContext}

核心原則：
- DMAIC 的 D（Define）階段必須先用魚骨圖釐清根本原因，【魚骨圖永遠是第一個推薦工具】。
- 你的價值在於「逼出關鍵成因」。每一輪追問都要往「最可能的根因」鑽，不要問空泛的背景題。

【關鍵成因探問策略 — 一定要鑽到這些點】
依問卷答案決定主攻方向，鎖定後深入追問，不要每個方向都淺淺問一句：
- 發生規律=「偶發/零星/間歇」→ 這是最難的一種，主攻「獨立事件」：是否某段時間、某台機、某位操作者、某批料才出現？是否伴隨某個動作（換模、清機、換班、補料）？偶發常來自製程偶發失控或單一人為，要問出那個「觸發點」。
- 出現時機=「新產品一開始」→ 主攻設計/材料：規格、選材、公差是否驗證過。
- 「以前OK最近才有」→ 主攻製程變異：最近改了什麼（料、機、參數、人、環境、SOP）。
- 只有某些批次/某些人機 → 主攻差異源：批次/供應商/機台/操作者比較。
- 一定要問到「製程關鍵參數」與「操作是否有異常」：例如關鍵製程步驟的參數設定、是否有偏離 SOP 的操作、是否有非標準的臨時處置。

【放行判準 — 何時可進魚骨圖】
- 當你已問出「指向某類根因的具體線索」（例如鎖定到某製程步驟、某操作異常、某變更），即可收斂並推薦魚骨圖。
- 若連續追問 2-3 輪仍問不出具體線索（使用者一直「不知道」），不要無限追問，誠實說明「現有資訊有限，先用魚骨圖展開所有可能因子，再逐一排查」並放行。
- 不要在資訊不足時假裝已找到根因。

對話規則：
- 問「現象」不問「原因」，避免專業術語，一次聚焦一個關鍵點（不要一次丟 5 個問題）。
- 使用者說「不知道」→ 換個更具體、更好回答的角度問同一件事。
- 有問卷資料時最多再追問 1-3 輪；無問卷時最多 5 輪。問到關鍵線索就收斂。
- 推薦時說明「為什麼用這個工具」（20字內）。
- **推薦格式**：簡短說明後，最後一行必須是 [TOOLS: fishbone, tool2, ...]
- 回應總長度 300 字以內。

可推薦工具：fishbone, spc, msa, histogram, hypothesis, scatter, boxplot, pb
繁體中文，讓非統計背景的工程師也能理解`,
            messages: body.messages,
          })
        });

        // SSE 串流轉發
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();

        (async () => {
          const reader = streamResp.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          let buffer = '';

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              buffer = lines.pop() || '';

              for (const line of lines) {
                if (!line.startsWith('data: ')) continue;
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                    fullText += parsed.delta.text;
                    await writer.write(encoder.encode('data: ' + JSON.stringify({ text: parsed.delta.text }) + '\n\n'));
                  }
                  if (parsed.type === 'message_stop') {
                    // 提取工具推薦
                    const m = fullText.match(/\[TOOLS:\s*([^\]]+)\]/);
                    const tools = m ? m[1].split(',').map(t=>t.trim()).filter(Boolean) : [];
                    await writer.write(encoder.encode('data: ' + JSON.stringify({ done: true, fullText, tools }) + '\n\n'));
                  }
                } catch(e) {}
              }
            }
          } finally {
            await writer.close();
          }
        })();

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': corsHeaders(origin)['Access-Control-Allow-Origin'],
            'Access-Control-Allow-Headers': corsHeaders(origin)['Access-Control-Allow-Headers'],
          }
        });
      }

      // ══ verification_plan：為每個因子建議驗證計畫 ══
      if (mode === 'verification_plan') {
        const deviceCtx = body.deviceInfo ? `
【已確認器材】${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
關鍵品質：${(body.deviceInfo.key_quality||[]).join('、')}
` : '';

        const factors = body.factors || [];

        const resp = await callClaude(env, modeModel('verification_plan'), {  // 改用 sonnet 省成本
          max_tokens: 8000,
          system: `你是醫療器材 CAPA 驗證策略專家。為每個因子判斷該走哪種「驗證/矯正管道」，不要把所有因子都硬塞進統計實驗。
${deviceCtx}

【判斷順序（決策樹，依序判斷，命中即停）】
1. 製造商無法控制（病人狀態、臨床決策、臨床留置天數）→ pipeline=uncontrollable
2. 臨床使用/操作/人員手法/說明書 → pipeline=use_side（subtype：可用性人因62366 / IFU標示 / 教育訓練）
3. 「是否符合某 ISO 規範」的問題 → pipeline=compliance、iso_relevant=true（subtype：ISO規範符合性 / 生物相容10993 / 滅菌包裝確效 / 製程確效IQ-OQ-PQ / 品質系統13485）
4. 風險測不到或需證據 → pipeline=method_dev（量測方法開發 / 替代指標）或 pipeline=risk_evidence（風險管理14971 / 臨床評估14155 / 上市後監督PMS）
5. 供應商/來料品質 → pipeline=supplier
6. 可調變的設計/製程參數且量測可行 → pipeline=experiment（subtype 依下列準則嚴格區分）

【experiment 類 subtype 選用準則（重要，勿混用）】
- DOE / PB / 田口：因子必須是「可主動調變、且可量化設定」的製程/設計參數（連續或可分階的 X，如溫度℃、時間秒、壓力、轉速、濃度%、間隙mm）。只有這種「可設定數值去做實驗」的才給 DOE。
  · 多個可量化因子要找最佳組合/交互作用 → DOE；因子很多要先篩主效應 → PB。
  · 反例：抽象、難以設定數值的因子（如「操作手法」「設計裕度」「材料相容性」「儲存條件」）→ 不可給 DOE，改走 method_dev 或 use_side。
- SPC：因子是「現有產線已在量測、需持續監控其穩定性」的特性（也是 X，但屬監測而非調變）。重點是製程管控/漂移偵測，不是去調參數做實驗。
  · 反例：需要調變去找最佳值的參數 → 不適合 SPC（那是 DOE）。
- MSA：因子涉及「量測/檢測數據是否可信」——要釐清變異來自人為(操作者)或檢測手法/設備(量測系統)。用於驗證量測方法本身的再現性/再生性(Gage R&R)。
  · 凡因子與「檢測結果不一致、量測誤差、操作者間差異、設備量測能力」有關 → MSA。
- 假設檢定：單純比較兩批/兩群組是否有顯著差異（如新舊料、A/B 供應商），不需設計矩陣。

【鐵則】
- 不是每個因子都要 DOE/SPC/MSA。測不到的風險請走 method_dev / risk_evidence，不要硬給統計工具。
- 只有 compliance 類 iso_relevant=true，其餘一律 false。
- subtype 一律用上面括號內的詞。
- verification = 該管道下的具體建議動作（30字內，語氣符合管道：做實驗 / 查核ISO條文 / 開發量測法 / 訓練考核 / 修訂IFU / 列入風險檔 / 供應商稽核…）。
- link = 每個因子都要寫出它如何導致「使用者陳述的問題」的因果路徑（因子→中間機制→問題現象）。例：問題=「pigtail loop retention 不足」→「基材熱彈性記憶」link 寫「熱彈性記憶不足→定型後回彈→loop retention 下降」。與問題明顯無關的因子不要列。

繁體中文，務實、不學術`,

          tools: [{
            name: 'verification_plan',
            description: '為每個因子產生驗證計畫',
            input_schema: {
              type: 'object',
              properties: {
                plans: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      factor:       { type: 'string' },
                      risk:         { type: 'string', enum: ['high','medium','low'] },
                      pipeline:     { type: 'string', enum: ['experiment','compliance','method_dev','risk_evidence','use_side','supplier','uncontrollable'] },
                      subtype:      { type: 'string', description: '細項，如 DOE/SPC/MSA/假設檢定/ISO規範符合性/生物相容(10993)/滅菌包裝確效/製程確效IQ-OQ-PQ/品質系統(13485)/風險管理(14971)/臨床評估(14155)/上市後監督PMS/量測方法開發/替代指標/可用性人因(62366)/IFU標示/教育訓練/供應商管控/不可控' },
                      verification: { type: 'string', description: '建議動作（30字內）' },
                      link:         { type: 'string', description: '關聯鏈：此因子如何導致使用者陳述的問題（≤25字，「因子→中間機制→問題現象」）' },
                      iso_relevant: { type: 'boolean', description: '是否需對照ISO規範條文（僅compliance類true）' },
                      data_needed:  { type: 'string', enum: ['已有數據','需收集數據','需開發量測方法'] },
                      priority:     { type: 'number' }
                    },
                    required: ['factor','pipeline','verification']
                  }
                },
                summary: { type: 'string' }
              },
              required: ['plans','summary']
            }
          }],
          tool_choice: { type: 'tool', name: 'verification_plan' },
          messages: [{
            role: 'user',
            content: `問題：${body.problem || '未知'}\n\n需要驗證的因子：\n${factors.map(f => `- [${f.cat||''}] ${f.name}（風險：${f.risk}）`).join('\n')}\n\n請為每個因子設計驗證計畫。`
          }]
        });

        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || {};
        if(!Array.isArray(result.plans)) result.plans = [];
        const debugInfo = {
          stop_reason: resp.stop_reason,
          tool_fired: !!tu,
          n_plans: result.plans.length,
          n_factors: factors.length,
          content_types: (resp.content||[]).map(c=>c.type)
        };
        return json({ mode: 'verification_plan', result, _debug: debugInfo }, origin);
      }

      // ══ iso_crosscheck：ISO 對照 — 把因子/驗證計畫對照 ISO 應驗項目，標出缺口 ══
      // 重要：模型只能引用 body.isoStandards 內實際存在的標準與項目，嚴禁自行生成標準編號或條號。
      if (mode === 'iso_crosscheck') {
        const deviceCtx = body.deviceInfo ? `
【已確認器材】${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
用途：${body.deviceInfo.indication}
關鍵品質：${(body.deviceInfo.key_quality||[]).join('、')}` : '';

        const isoStandards = Array.isArray(body.isoStandards) ? body.isoStandards : [];
        const plans = Array.isArray(body.plans) ? body.plans : [];
        const factors = Array.isArray(body.factors) ? body.factors : [];

        // 把可引用的標準清單轉成精簡文字（編號/標題/適用關鍵詞/項目/已建檔章節）
        const stdText = isoStandards.map(s => {
          const items = (s.items||[]).map(i => i.k).join('、');
          const cls = (s.clauses||[]).map(c => `${c.no} ${c.title_zh||c.title_en||''}${c.verified===false?'(未核)':''}`).join('；');
          return `- ${s.no}${s.edition?(' ('+s.edition+')'):''}｜${s.title_zh||s.title}｜適用:${(s.applies_to||[]).join('/')}｜應驗項目:[${items}]｜已建檔章節:[${cls||'（無，章節待建檔）'}]`;
        }).join('\n');

        // 目前計畫已涵蓋的因子/驗證
        const planText = plans.length
          ? plans.map(p => `- 因子「${p.factor}」→ 驗證:${p.verification||''}（工具:${p.tool||''}）`).join('\n')
          : factors.map(f => `- 因子「${f.name||f}」`).join('\n');

        const resp = await callClaude(env, modeModel('iso_crosscheck'), {
          max_tokens: 3500,
          system: `你是醫療器材法規/驗證稽核專家。任務：以「問題分析出來的因子」為主軸，逐因子對照對應的 ISO 規範與章節，判斷該因子相關的 ISO 要求有沒有在驗證計畫裡做確實。
${deviceCtx}

【核心原則 — 因子導向，不是攤標準全清單】
- 主軸是「使用者的問題因子」。針對每個因子，找出它對應到清單裡哪個標準的哪個應驗項目／章節。
- 不要把某標準的所有項目全列成缺口；只列「與本案因子相關」的。與因子無關的項目不要列。

【絕對規則 — 防止幻覺（最重要）】
1. 只能引用〈可引用標準清單〉裡實際存在的標準編號、項目與「已建檔章節」。
2. clause（章節）只能填該標準「已建檔章節」清單中列出的；**嚴禁自行發明、推測或補充任何章節號／Annex 代號**。
3. 若某標準的「已建檔章節」為空或找不到對應章節 → clause 一律填「（章節待建檔）」。標「(未核)」的章節仍可引用，但要在 note 提醒「章節待核可」。
4. 不要捏造允收數值或準則；項目為類別草稿。

【判讀每個因子】
- standard：該因子對應的標準編號（取自清單）。
- clause：對應章節（取自該標準已建檔章節；沒有就「（章節待建檔）」）。
- item：對應的應驗項目（取自清單）。
- status：covered＝計畫已明確涵蓋；partial＝有相關因子但驗證不完整；gap＝ISO 應驗但計畫沒涵蓋（CAPA 風險）。
- covered_by：對應的因子/驗證名稱；note：20字內提醒（如「以正本最新版次為準」）。

【特別注意 — 別把「材料間相容/接合」誤判成生物相容】
- 「黏合、溶脹、接合強度」等屬接合完整性/材料工程 → 對應導管本體標準（如 ISO 10555-1 的接頭/拉伸條款），不是 ISO 10993。
- ISO 10993 只在「材料對人體/血液的生物安全（細胞毒性/致敏/血液相容/化學溶出）」時才引用。

【特別注意 — ISO 11607 是「無菌包裝封口」，不是「導管接合」】
- ISO 11607（最終滅菌包裝成形/密封/組裝確效）的「密封」指的是【無菌包裝袋/泡殼的封口】，只配「包裝、封口、無菌屏障」類因子。
- 「導管 Hub 熱熔接合漏水、壓合、熔接界面」等屬【導管本體接合完整性】，對應 ISO 10555-1 的接頭/拉伸/洩漏條款，【絕不是 ISO 11607】。看到「接合、熱熔、壓合、Hub、漏水」不要配 11607。

【特別注意 — 通用品質/風險標準不要逐因子氾濫（重要）】
- ISO 13485（品質管理系統）、ISO 14971（風險管理）、ISO 62366（可用性）是「全器材通用」的框架標準，幾乎任何因子都能勉強扯上關係，但這樣配【沒有鑑別力、等於沒講】。
- 規則：13485/14971/62366 只在「該因子的本質就是該框架的核心議題」時才配——例如 14971 只配「需要風險分析/FMEA 才能判定」的因子；62366 只配「使用者操作介面/人因」因子；13485 原則上【不配給個別技術因子】（製程確效、設備管理屬全廠 QMS，列為器材級通用即可，不要每個因子都掛 13485）。
- 寧可讓某因子「沒有對應 ISO」（留空，由 K number 510k 驗證補），也不要用 13485 這種萬用標準填滿每個因子。一個因子若只能對到 13485，多半代表 iso_map 還沒有更貼切的專屬標準 → 該因子的 ISO 留空，不要硬配 13485。

繁體中文，務實，不要學術長文。`,
          tools: [{
            name: 'iso_crosscheck',
            description: 'ISO 應驗項目與驗證計畫的覆蓋比對，標出缺口',
            input_schema: {
              type: 'object',
              properties: {
                applicable: {
                  type: 'array',
                  description: '判定適用於本器材的標準（只能取自清單）',
                  items: { type: 'object', properties: {
                    no: { type: 'string' },
                    reason: { type: 'string', description: '為何適用，15字內' }
                  }, required: ['no'] }
                },
                items: {
                  type: 'array',
                  description: '逐因子對照：每個問題因子對應的 ISO 標準+章節+覆蓋判讀',
                  items: { type: 'object', properties: {
                    factor:     { type: 'string', description: '對應的問題因子名稱' },
                    standard:   { type: 'string', description: '標準編號（取自清單）' },
                    clause:     { type: 'string', description: '對應章節（僅取自該標準「已建檔章節」；無則填「（章節待建檔）」，嚴禁自創）' },
                    item:       { type: 'string', description: '應驗項目（取自清單）' },
                    status:     { type: 'string', enum: ['covered','partial','gap'] },
                    covered_by: { type: 'string', description: '對應因子/驗證名稱；gap 留空' },
                    note:       { type: 'string', description: '20字內提醒' }
                  }, required: ['standard','status'] }
                },
                summary: { type: 'string', description: '缺口總結與建議，50字內' }
              },
              required: ['items']
            }
          }],
          tool_choice: { type: 'tool', name: 'iso_crosscheck' },
          messages: [{
            role: 'user',
            content: `問題：${body.problem || '未知'}

〈可引用標準清單〉（只能引用這些；clause 只能取自各標準的「已建檔章節」）：
${stdText || '(無，請回傳空結果)'}

〈問題分析出來的因子與驗證計畫〉：
${planText || '(無)'}

請以「每個因子」為主軸：找出該因子對應的標準與章節（clause 只填已建檔章節，沒有就「（章節待建檔）」），判讀 covered/partial/gap。只列與因子相關的，不要攤標準全清單。`
          }]
        });

        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || {};
        if(!Array.isArray(result.items)) result.items = [];
        if(!Array.isArray(result.applicable)) result.applicable = [];

        // ── 確定性防幻覺閘（後端強制，零信任 AI 輸出）──
        // 規則：
        //  1) standard 必須在送入的 isoStandards 清單內，否則整筆丟棄（AI 自創編號）。
        //  2) clause 必須是該標準「已建檔章節」(clauses[].no) 之一；不符一律改「（章節待建檔）」。
        //  3) applicable 的 no 同樣必須在清單內，否則丟棄。
        // 這確保前端與 Word 永遠不會出現 iso_map 沒有的條號。
        (function gateIsoCrosscheck(){
          const stdByNo = {};
          isoStandards.forEach(s => { if(s && s.no) stdByNo[s.no] = s; });
          const clauseSet = {};   // no -> Set(章節號)
          isoStandards.forEach(s => {
            if(!s || !s.no) return;
            const set = new Set();
            (s.clauses || []).forEach(c => { if(c && c.no) set.add(String(c.no).trim()); });
            clauseSet[s.no] = set;
          });
          let droppedStd = 0, fixedClause = 0;
          result.items = result.items.filter(it => {
            if(!it || !stdByNo[it.standard]){ droppedStd++; return false; }
            const cl = String(it.clause || '').trim();
            const isWaitMark = !cl || cl.indexOf('待建檔') >= 0;
            if(!isWaitMark && !(clauseSet[it.standard] && clauseSet[it.standard].has(cl))){
              it.clause = '（章節待建檔）';   // AI 給了清單外章節 → 強制降級
              it.note = (it.note ? it.note + '；' : '') + '原章節未建檔已降級';
              fixedClause++;
            } else if(isWaitMark){
              it.clause = '（章節待建檔）';
            }
            return true;
          });
          result.applicable = result.applicable.filter(a => a && stdByNo[a.no]);

          // 通用標準氾濫防呆：13485/14971/62366 是全器材框架標準，若被配給多個因子＝沒鑑別力。
          // 統計每個通用標準被配給的因子數，>1 就從 items 移除（保留在 applicable 當器材級通用）。
          const GENERIC_RE = /13485|14971|62366/;
          const genericCount = {};   // standard -> 配給幾個不同因子
          result.items.forEach(it => {
            if(it && it.standard && GENERIC_RE.test(it.standard)){
              genericCount[it.standard] = (genericCount[it.standard]||0) + 1;
            }
          });
          let droppedGeneric = 0;
          const movedGeneric = new Set();
          result.items = result.items.filter(it => {
            if(it && it.standard && GENERIC_RE.test(it.standard) && (genericCount[it.standard]||0) > 1){
              movedGeneric.add(it.standard); droppedGeneric++; return false;  // 氾濫 → 從逐因子移除
            }
            return true;
          });
          // 移除的通用標準補進 applicable（器材級通用，只列一次）
          movedGeneric.forEach(no => {
            if(!result.applicable.some(a => a.no === no) && stdByNo[no]){
              result.applicable.push({ no:no, title_zh:(stdByNo[no].title_zh||stdByNo[no].title||''), title:(stdByNo[no].title||''), _generic:true });
            }
          });

          result._gate = { droppedStd, fixedClause, droppedGeneric };
        })();

        const debugInfo = {
          stop_reason: resp.stop_reason,
          tool_fired: !!tu,
          n_applicable: result.applicable.length,
          n_items: result.items.length,
          gate: result._gate,
          content_types: (resp.content||[]).map(c=>c.type)
        };
        return json({ mode: 'iso_crosscheck', result, _debug: debugInfo }, origin);
      }

      // ══ plan_narrative：計畫書敘事（受控，僅依既有事實生成三段文字，不新增事實）══
      // 目的：Word 計畫書原本只有表格、讀來空洞。此模式只把「已確認的器材／問題／因子／
      //       驗證計畫／ISO 對照」整理成可讀的執行摘要、根本原因論述、結論與後續行動。
      // 鐵則（系統提示強制 + 前端標註）：不得引入任何輸入中沒有的事實、數值、標準或條號；
      //       凡屬判斷/推測一律在句中以（*）標記；語氣務實、非行銷、不誇大。
      if (mode === 'plan_narrative') {
        const dev = body.deviceInfo || {};
        const problem = body.problem || '';
        const plans = Array.isArray(body.plans) ? body.plans : [];
        const factors = body.factors || {};   // {man:[...],...} 已確認因子
        const iso = body.iso || {};            // {applicable:[], items:[]}
        const spcChars = Array.isArray(body.spcCharacteristics) ? body.spcCharacteristics.filter(Boolean) : [];

        // 把事實整理成精簡文字餵給模型（只給事實，不給模型發揮空間）
        const factorLines = [];
        ['man','machine','material','method','measure','env'].forEach(c => {
          (factors[c] || []).forEach(f => {
            factorLines.push(`- [${c}] ${f.name}（風險:${f.risk||'?'}）${f.link?('｜關聯:'+f.link):''}${f.speculative?'｜（推測）':''}`);
          });
        });
        const planLines = plans.map(p =>
          `- 因子「${p.factor}」→管道:${p.pipeline||'?'}／${p.subtype||p.tool||''}｜動作:${p.verification||''}`).join('\n');
        const isoApps = (iso.applicable || []).map(a => `${a.no}（${a.reason||''}）`).join('、');
        const isoGap = (iso.items || []).filter(i => i.status === 'gap')
          .map(i => `${i.factor||''}↔${i.standard||''}`).join('、');
        // 問卷中的「檢測手法/出貨檢驗/卡關機制」相關資訊（供檢測手法檢討與 Poka-Yoke 建議）
        const detectionInfo = body.detectionMethod || '';

        const resp = await callClaude(env, modeModel('plan_narrative'), {
          max_tokens: 2200,
          system: `你是醫療器材 CAPA 文件撰稿者。任務：把下方「已確認的分析結果」改寫成計畫書用的三段敘事。

【最重要鐵則 — 不得幻覺】
1. 只能使用輸入中已出現的事實（器材、問題、因子、驗證管道、ISO 標準編號）。
2. 嚴禁新增任何輸入中沒有的：數值、允收準則、標準編號、條號、檢測方法名稱、法規條文。
3. 凡屬你的判斷或推論（非輸入明列的事實），必須在該句以（*）標記。
4. 不要逐字複製因子清單；用連貫文句敘述其邏輯。語氣務實、客觀，**不得行銷化、不得誇大嚴重性**。
5. 繁體中文，禁用簡體字。每段 3～6 句，精煉。

【三段結構】
- executive_summary：本案在做什麼、針對什麼問題、整體處置方向（不重列表格）。
- root_cause_narrative：把因子如何導向問題的邏輯串成論述（用 link 關聯資訊）；指出主要風險因子。
- conclusion：後續行動建議與待辦（如待補驗證、ISO 缺口、需 RA 核可事項）；若有 gap 要點出。

【SPC 觀察原因（若有提供 SPC 監控特徵）】
- 針對每個 SPC 監控特徵，寫一句「為何要持續以管制圖監控此特徵」的觀察原因（30字內、務實、扣回問題或製程穩定性），放入 spc_reasons（key=特徵名、value=原因）。不得新增規格數值或條號。

【檢測手法檢討（detection_review_gates，務必產出，結構化）】
背景：許多醫療器材不良在客戶端才被發現，代表「出貨前檢測/卡關失效」。程式已定義固定的「四道閘」骨架，你只需為每道閘填三個短欄位：現況(status，一句扣回本案)、風險(risk: high/medium/low)、對策(action，一句)。不要寫長篇散文。
- method（方法偵測力）：現行檢測對「本案失效模式」有無偵測力？是否驗不到（微洩漏目視驗不出等）。
- people（人員一致性）：是否依賴人工目視判定、操作者間易不一致、抽樣主觀。
- sampling（樣本數量與分層）：抽樣量對偶發/低率缺陷的攔截力；是否涵蓋失效分層（模穴/時段/批次/班別）。不得捏造 p/n 數值。
- boundary（監控範圍邊界）：本案失效是否屬「出廠當下不存在、時間/使用累積才顯現」（老化型）；若是則出貨抽樣無效，須移設計驗證或上市後監督。
另填 poka_yoke：1-3 項防呆，優先源頭預防＞線上自動偵測＞警示，每項註明擋哪道閘。
凡推論標（*）；不得捏造既有檢測設備或數據。`,
          tools: [{
            name: 'plan_narrative',
            description: '計畫書三段敘事',
            input_schema: {
              type: 'object',
              properties: {
                executive_summary:   { type: 'string', description: '執行摘要（3-6句）' },
                root_cause_narrative:{ type: 'string', description: '根本原因論述（3-6句）' },
                conclusion:          { type: 'string', description: '結論與後續行動（3-6句）' },
                spc_reasons:         { type: 'object', description: 'SPC 監控特徵的觀察原因，key=特徵名、value=原因（30字內）；無 SPC 特徵時可省略' },
                detection_review_gates: {
                  type: 'object',
                  description: '四道閘檢測檢討（程式已定四道閘骨架，你只填每道閘的三個短欄位）',
                  properties: {
                    method:   { type:'object', properties:{ status:{type:'string',description:'方法偵測力現況（一句，扣回本案，≤30字）'}, risk:{type:'string',enum:['high','medium','low']}, action:{type:'string',description:'對策（一句，≤30字）'} } },
                    people:   { type:'object', properties:{ status:{type:'string',description:'人員一致性現況（一句，≤30字）'}, risk:{type:'string',enum:['high','medium','low']}, action:{type:'string',description:'對策（一句，≤30字）'} } },
                    sampling: { type:'object', properties:{ status:{type:'string',description:'樣本數量與分層現況（一句，≤30字）'}, risk:{type:'string',enum:['high','medium','low']}, action:{type:'string',description:'對策（一句，≤30字）'} } },
                    boundary: { type:'object', properties:{ status:{type:'string',description:'監控範圍邊界現況：是否屬老化型出貨驗不到（一句，≤30字）'}, risk:{type:'string',enum:['high','medium','low']}, action:{type:'string',description:'對策（一句，≤30字）'} } }
                  }
                },
                poka_yoke: { type:'array', items:{ type:'object', properties:{ measure:{type:'string',description:'防呆機制（一句）'}, gate:{type:'string',description:'擋住哪道閘：method/people/sampling/boundary'} } }, description:'1-3項防呆，優先源頭預防＞線上自動偵測＞警示' }
              }
            }
          }],
          tool_choice: { type: 'tool', name: 'plan_narrative' },
          messages: [{
            role: 'user',
            content: `【已確認器材】${dev.confirmed_name||'—'}｜材料:${dev.material||'—'}｜結構:${dev.structure||'—'}｜用途:${dev.indication||'—'}
【問題現象】${problem || '（未填）'}
【已確認因子】
${factorLines.join('\n') || '（無）'}
【驗證計畫】
${planLines || '（無）'}
【ISO 已判定適用】${isoApps || '（無）'}
【ISO 缺口(gap)】${isoGap || '（無）'}
【SPC 監控特徵】${spcChars.length ? spcChars.join('、') : '（無）'}
【現行檢測手法(問卷)】${detectionInfo || '（問卷未揭露）'}

請只依上述事實，生成三段敘事；若有 SPC 監控特徵，另為每個特徵寫一句觀察原因（spc_reasons）；並務必產出 detection_review（檢測手法檢討＋Poka-Yoke 防呆建議）。推論標（*），不得新增事實。`
          }]
        });

        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || {};
        const debugInfo = { stop_reason: resp.stop_reason, tool_fired: !!tu };
        return json({ mode: 'plan_narrative', result, _debug: debugInfo }, origin);
      }

      // ══ interception_review：監控攔截力檢討（聚焦，不對全因子套用）══
      // 只篩出「真正該檢討偵測力」的少數監控點，逐點做四維檢討，避免每個因子都寫罐頭建議流於空談。
      if (mode === 'interception_review') {
        const dev = body.deviceInfo || {};
        const problem = body.problem || '';
        const factors = body.factors || {};
        const plans = Array.isArray(body.plans) ? body.plans : [];
        const spcChars = Array.isArray(body.spcCharacteristics) ? body.spcCharacteristics.filter(Boolean) : [];

        const factorLines = [];
        ['man','machine','material','method','measure','env'].forEach(c => {
          (factors[c] || []).forEach(f => {
            factorLines.push(`- [${c}] ${f.name}（風險:${f.risk||'?'}）${f.link?('｜關聯:'+f.link):''}`);
          });
        });
        const planLines = plans.map(p =>
          `- 因子「${p.factor}」→管道:${p.pipeline||'?'}／${p.subtype||''}`).join('\n');

        const resp = await callClaude(env, modeModel('interception_review'), {
          max_tokens: 2000,
          system: `你是醫療器材品質工程師，專長「監控/檢測為何攔不住客戶端逃逸的不良」。

【核心觀念（你的判斷依據）】
監控要能攔到問題，須同時成立四道閘，任一不成立即失效：
① 方法偵測力：現行檢測對「此失效模式」有沒有偵測力（靈敏度/漏檢率）。方法看不到，再多抽樣也沒用。
② 人員一致性：目視/判定的操作者間一致性（屬性一致性/再現性），以及「樣本怎麼抽」的主觀性。
③ 樣本數量與分層代表性：數量＝統計攔截機率 1−(1−p)ⁿ；分層＝樣本是否涵蓋失效的發生型態（模穴/時段/批次/班別）。數量夠但未分層仍會漏。
④ 監控範圍邊界：有些失效（長期老化、特定使用情境累積劣化）出廠當下根本不存在，任何出貨抽樣都無效，須移到設計驗證或上市後監督。

【最重要：聚焦，不要氾濫】
- 絕對不要對所有因子都做檢討（每個都寫「提升靈敏度/加強訓練/增加樣本」是空話，會稀釋重點）。
- 只挑「真正該擔心偵測力」的監控點：同時滿足(高風險) 且 (走檢測/監控/出貨檢驗類，或失效屬偶發/低率/客戶端逃逸型)。
- 若提供了「SPC 監控特徵」，優先納入這些。
- 總數嚴格控制在 2～4 個。寧缺勿濫；若真的沒有值得深入的，回空陣列。

【每個監控點輸出】務實、具體、扣回本案，每欄 1～2 句：
- method：①現行檢測為何可能漏掉此失效（或它的偵測力侷限）。
- personnel：②人員/抽樣執行的一致性風險。
- sampling：③樣本數量與分層代表性的疑慮（可用 1−(1−p)ⁿ 觀念說明，但不得捏造具體 p/n 數值，除非輸入有提供；沒有就以定性說明並標(*)）。
- escape_risk：綜合判斷此監控點的逃逸風險（高/中/低＋一句理由）。
- disposition_hint：判定傾向——a維持／b強化代表性／c本質無效需改方法或移到開發/上市後——僅給傾向與理由，最終由 RA/工程定案。

繁體中文、禁簡體。凡推論標(*)，不得捏造既有檢測設備或數據。`,
          tools: [{
            name: 'interception_review',
            description: '監控攔截力檢討（聚焦2-4點）',
            input_schema: {
              type: 'object',
              properties: {
                reviews: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      factor:          { type: 'string', description: '監控點/因子名' },
                      method:          { type: 'string', description: '①方法偵測力檢討' },
                      personnel:       { type: 'string', description: '②人員/抽樣一致性' },
                      sampling:        { type: 'string', description: '③樣本數量與分層代表性' },
                      escape_risk:     { type: 'string', description: '逃逸風險(高/中/低+理由)' },
                      disposition_hint:{ type: 'string', description: '判定傾向(a維持/b強化/c改方法)+理由' }
                    },
                    required: ['factor','method','escape_risk']
                  }
                },
                note: { type: 'string', description: '一句總結（若無值得深入者，說明原因）' }
              },
              required: ['reviews']
            }
          }],
          tool_choice: { type: 'tool', name: 'interception_review' },
          messages: [{
            role: 'user',
            content: `【器材】${dev.confirmed_name||'—'}｜材料:${dev.material||'—'}
【問題現象】${problem || '（未填）'}
【因子】
${factorLines.join('\n') || '（無）'}
【驗證計畫管道】
${planLines || '（無）'}
【SPC 監控特徵(優先納入)】${spcChars.length ? spcChars.join('、') : '（無）'}

請只挑 2～4 個真正該檢討偵測力的關鍵監控點做四維檢討；其餘因子不要列。`
          }]
        });

        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || {};
        if(!Array.isArray(result.reviews)) result.reviews = [];
        if(result.reviews.length > 4) result.reviews = result.reviews.slice(0,4);
        return json({ mode: 'interception_review', result, _debug: { tool_fired: !!tu, n: result.reviews.length } }, origin);
      }

      // ══ fda_verification：查同類 510(k)→抓 summary PDF→萃取真實驗證項目與 ISO 標準 ══
      if (mode === 'fda_verification') {
        const deviceNameEn = body.deviceNameEn || body.deviceName || '';
        const productCodes = body.productCodes || (body.productCode ? [body.productCode] : []);
        const factors = body.factors || '';
        const fdaKey = env.FDA_API_KEY || body.fdaKey || '';
        const maxN = Math.min(body.maxN || 5, 5);

        let kList = [];
        try {
          const q = productCodes.length
            ? '(' + productCodes.map(c=>`product_code:${encodeURIComponent(c)}`).join('+') + ')'
            : `device_name:"${encodeURIComponent(deviceNameEn)}"`;
          const url = `https://api.fda.gov/device/510k.json?${fdaKey?('api_key='+fdaKey+'&'):''}search=${q}&limit=${maxN}&sort=decision_date:desc`;
          const r = await fetch(url);
          const j = await r.json();
          if (j.results) kList = j.results.map(x => ({ k:x.k_number, name:x.device_name, applicant:x.applicant, date:x.decision_date, pc:x.product_code }));
        } catch(e) {
          return json({ mode:'fda_verification', result:null, error:'openFDA 查詢失敗：'+(e.message||'') }, origin);
        }
        if (!kList.length) return json({ mode:'fda_verification', result:{ devices:[], extracted:[] }, note:'查無同類 510(k) 記錄' }, origin);

        const docs = [];
        for (const item of kList.slice(0, Math.min(maxN,3))) {
          const knum = item.k;
          if (!knum) continue;
          let yy = knum.length>=3 ? knum.slice(1,3) : '';
          const tryUrls = [
            `https://www.accessdata.fda.gov/cdrh_docs/pdf${yy}/${knum}.pdf`,
            `https://www.accessdata.fda.gov/cdrh_docs/pdf/${knum}.pdf`
          ];
          let b64 = null;
          for (const u of tryUrls) {
            try {
              const pr = await fetch(u);
              if (pr.ok) {
                const buf = await pr.arrayBuffer();
                let bin=''; const bytes=new Uint8Array(buf);
                for (let i=0;i<bytes.length;i++) bin+=String.fromCharCode(bytes[i]);
                b64 = btoa(bin);
                break;
              }
            } catch(e) {}
          }
          if (b64) docs.push({ k:knum, name:item.name, applicant:item.applicant, date:item.date, pdf:b64 });
        }

        if (!docs.length) {
          return json({ mode:'fda_verification', result:{ devices:kList, extracted:[] }, note:'查到 K 號但無法取得 summary PDF（可能為舊式掃描檔）' }, origin);
        }

        const content = [];
        docs.forEach((d,i) => {
          content.push({ type:'document', source:{ type:'base64', media_type:'application/pdf', data:d.pdf } });
          content.push({ type:'text', text:`↑ 上面是同類產品 510(k) 第${i+1}份（${d.k}，${d.applicant||''}，${d.date||''}）。` });
        });
        content.push({ type:'text', text:`本案因子：\n${factors||'(未提供)'}\n\n請從上述 ${docs.length} 份 510(k) summary 的「Performance Data / 性能測試」段落，萃取真實的「驗證項目」與「引用標準(ISO/IEC/ASTM)」，並指出哪些對應到本案因子。只萃取文件中實際出現的內容，不可自行補充未出現的標準。` });

        const resp = await callClaude(env, MODEL_MAP.haiku, {
          max_tokens: 2500,
          system:`你是醫療器材法規工程師。從 510(k) summary 的 Performance Data 段落，萃取「同類產品實際做過的驗證項目與引用標準」。
【鐵則】只能萃取文件中「實際出現」的標準編號與測試項目，逐字為憑；文件沒寫的絕不補充、不可推測。每個標準要標出處 K 號。繁體中文。`,
          tools:[{
            name:'fda_verification',
            description:'萃取510k驗證項目與標準',
            input_schema:{ type:'object', properties:{
              extracted:{ type:'array', items:{ type:'object', properties:{
                k:{type:'string'}, device:{type:'string'},
                tests:{ type:'array', items:{type:'string'} },
                standards:{ type:'array', items:{type:'string'} }
              }}},
              matched_to_factors:{ type:'array', items:{ type:'object', properties:{
                factor:{type:'string'}, suggestion:{type:'string'}
              }}},
              summary:{ type:'string' }
            }, required:['extracted'] }
          }],
          tool_choice:{ type:'tool', name:'fda_verification' },
          messages:[{ role:'user', content }]
        });

        if (resp._httpError) return json({ mode:'fda_verification', result:null, error:resp._errorMessage }, origin);
        const tu2 = resp.content && resp.content.find(c => c.type==='tool_use');
        const result = (tu2 && tu2.input) || { extracted:[] };
        result.devices = kList;
        return json({ mode:'fda_verification', result, _debug:{ k_found:kList.length, pdf_extracted:docs.length } }, origin);
      }

      // ══ iso_factor_match：把查到的 ISO（510k萃取+iso_map+ai_hint）配對到各因子 ══
      // 來源優先序：510k萃取/iso_map 為主、ai_hint 為輔。AI 配對，使用者可手動調整。
      if (mode === 'iso_factor_match') {
        const factors = body.factors || [];       // [{name, cat, link}]
        const standards = body.standards || [];    // [{no, title, source, items}]  source: fda510k|iso_map|ai_hint
        if (!factors.length || !standards.length) {
          return json({ mode:'iso_factor_match', result:{ matches:[], unmatched:[] }, note:'因子或標準清單為空' }, origin);
        }
        const facLines = factors.map((f,i)=>`${i+1}. ${f.name}${f.link?('（'+f.link.slice(0,50)+'）'):''}`).join('\n');
        const stdLines = standards.map(s=>`- ${s.no}（${s.title||''}）[來源:${s.source||'?'}]${s.items?('｜驗證項目:'+(Array.isArray(s.items)?s.items.join('、'):s.items)):''}`).join('\n');

        const resp = await callClaude(env, MODEL_MAP.haiku, {
          max_tokens: 2500,
          system:`你是醫療器材法規工程師。把「已查證的 ISO 標準清單」配對到「魚骨圖因子」，判斷每條標準是否真的能驗證該因子。
【最高原則：寧缺勿濫，不相關就不要配】
- 只有當標準的測試主題「直接驗證」該因子的失效機制時，才可配對。主題不相關就絕對不要硬塞，寧可放進 unmatched。
- 嚴禁亂塞：生物相容性(ISO 10993 系列)只能配給「材料毒性/組織接觸/溶出物」類因子，絕不可配給「操作手法、培訓、力道、磨損、尺寸公差、製程參數」這類因子（它們與生物相容性無關）。
- 滅菌標準(11135/11137/17665)只配滅菌/無菌因子；包裝標準(11607)只配密封/包裝完整性因子；尺寸/性能/機械標準才配結構/製程/力學因子。
【配對方式】
- 一條標準可對多個「主題真的相關」的因子；一個因子可有多條相關標準；但若某因子找不到主題相關的標準，就讓它沒有 ISO（不要硬給）。
- 只能用清單中實際提供的標準，不可自行新增。
- 來源優先：[來源:fda510k]、[來源:iso_map] 為可靠主來源；[來源:ai_hint] 為輔助，採用時在 why 標「AI推測」。
- 對不到任何因子的標準（特別是生物相容、滅菌這種「器材級」標準），放進 unmatched，它們會以「同類 510k 參考標準」列出、標 K number，而非硬掛到因子。
繁體中文。`,
          tools:[{
            name:'iso_factor_match',
            description:'ISO配對到因子',
            input_schema:{ type:'object', properties:{
              matches:{ type:'array', items:{ type:'object', properties:{
                factor:{ type:'string', description:'因子名稱（需與輸入一致）' },
                standards:{ type:'array', items:{ type:'object', properties:{
                  no:{type:'string'}, source:{type:'string',description:'fda510k|iso_map|ai_hint'},
                  why:{type:'string',description:'為何此標準驗證此因子（20字內）'}
                }}}
              }}},
              unmatched:{ type:'array', items:{type:'string'}, description:'對不到因子的標準編號（器材級通用）' }
            }, required:['matches'] }
          }],
          tool_choice:{ type:'tool', name:'iso_factor_match' },
          messages:[{ role:'user', content:`【因子清單】\n${facLines}\n\n【已查證 ISO 標準清單】\n${stdLines}\n\n請把標準配對到因子。` }]
        });

        if (resp._httpError) return json({ mode:'iso_factor_match', result:null, error:resp._errorMessage }, origin);
        const tu3 = resp.content && resp.content.find(c => c.type==='tool_use');
        const result = (tu3 && tu3.input) || { matches:[], unmatched:[] };

        // 程式防呆：強制擋掉主題明顯不相關的硬塞配對（即使 AI 還是亂配）
        // 生物相容(10993)、滅菌(11135/11137/17665/11737)只能配「材料/接觸/滅菌」類因子
        const BIO_RE = /10993/;
        const STERILE_RE = /11135|11137|17665|11737/;
        const PACKAGE_RE = /11607/;   // 無菌包裝成形/密封/組裝確效（是「包裝袋封口」，不是導管Hub接合）
        const movedToUnmatched = new Set();
        (result.matches||[]).forEach(m => {
          const fname = String(m.factor||'');
          const factorIsMaterial = /材料|溶出|塗層|生物相容|組織接觸|毒性|殘留|塑化劑|添加劑/.test(fname);
          const factorIsSterile = /滅菌|無菌|滅菌確效|sterli|生物負荷|bioburden/i.test(fname);
          // 「包裝封口」因子才配 11607；導管Hub熱熔接合的「密封/接合」不算包裝
          const factorIsPackage = /包裝|封口|無菌屏障|packag|pouch|tray|seal.*pack/i.test(fname) && !/熱熔|壓合|hub|接合|導管|管材/i.test(fname);
          m.standards = (m.standards||[]).filter(st => {
            const no = String(st.no||'');
            if (BIO_RE.test(no) && !factorIsMaterial) { movedToUnmatched.add(no); return false; }   // 10993 只配材料類
            if (STERILE_RE.test(no) && !factorIsSterile) { movedToUnmatched.add(no); return false; } // 滅菌只配滅菌類
            if (PACKAGE_RE.test(no) && !factorIsPackage) { movedToUnmatched.add(no); return false; } // 11607 只配包裝封口類，不配導管接合
            return true;
          });
        });
        // 被擋掉的標準併入 unmatched（去重）
        result.unmatched = Array.from(new Set([...(result.unmatched||[]), ...movedToUnmatched]));
        // 清掉沒有任何標準的 match 項
        result.matches = (result.matches||[]).filter(m => (m.standards||[]).length>0);
        return json({ mode:'iso_factor_match', result }, origin);
      }

      // ══ summarize_factors：整理因子清單供使用者確認 ══
      if (mode === 'summarize_factors') {
        const deviceCtx = body.deviceInfo ? `
【已確認器材】${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
關鍵品質：${(body.deviceInfo.key_quality||[]).join('、')}
絕對不能列的因子：${(body.deviceInfo.cannot_be||[]).join('、')}
` : '';

        const factorItem = {
          type: 'object',
          properties: {
            name:        { type: 'string', description: '因子名稱（10字以內）' },
            risk:        { type: 'string', enum: ['high','medium','low'] },
            risk_reason: { type: 'string', description: '【必填】判定此風險高低的原因（為何高/中/低，20-35字，扣回對問題的影響程度與發生可能）' },
            basis:       { type: 'string', description: '依據來源（20字內）' },
            nature:      { type: 'string', enum: ['adjustable','observed','method','group_compare','compliance','other'],
                           description: '【必填，最重要】因子的本質性質，決定後續用什麼工具（工具由程式依此強制對應，你不要自己選工具）：\n- adjustable=可主動設定數值的連續/可調參數（溫度、時間、壓力、濃度、速度、厚度、比例…，含名稱有「控制/設定/調整」者）→ 程式對應 DOE\n- observed=被動發生、無法調整的現象或設備狀態（老化、磨損、漂移、衰退、批次間既成差異）→ 程式對應 SPC 監控\n- method=量測/判定/操作手法的可信度與一致性（量具精度、判定標準、操作者手法、量測重複性）→ 程式對應 MSA\n- group_compare=不同群組的比較（批次A vs B、供應商X vs Y）→ 程式對應 假設檢定\n- compliance=規範符合性（材料/滅菌/包裝/生物相容、文件流程、設計管制）→ 程式對應 ISO確認/GMP\n- other=以上皆非' },
            level_hint:  { type: 'string', description: '若 nature=adjustable，給「建議調變範圍/水準」供實驗設計帶入（如「熔封溫度 180–200°C」「保壓時間 2–5s」）；不確定具體數值就寫定性範圍並標(*)，不要編造精確值。非 adjustable 留空' },
            link:        { type: 'string', description: '【必填】因子對問題的關聯說明（root cause）：此因子如何導致使用者陳述的問題，寫出完整因果路徑「因子→中間機制→問題現象」，要具體、扣回本案、可成段論述（40-70字），不可空泛' },
            control_method:{ type: 'string', description: '【必填】此因子的「卡控方式」論述：實務上要如何防堵/驗證這個因子，明確指出是靠哪種手段——作業標準化(SOP)、使用說明(IFU)、設計驗證(DV)、製程確效(IQ/OQ/PQ)、製程監控(SPC)、量測系統分析(MSA)、統計實驗(DOE)、或 ISO 標準符合性查核(並指出目前是否確實落實/有無缺口)。30-60字，可執行，不可寫「進行驗證」這種空話' },
            iso_hint:    { type: 'string', description: '若 control_method 涉及 ISO 標準，寫出可能適用的標準編號（如「ISO 11607-1」），不確定就留空，不要編造' },
            speculative: { type: 'boolean', description: '若無法說出與本問題的明確因果關聯，設為 true（前端會標「推測*」）' }
          },
          required: ['name','risk','risk_reason','nature','link','control_method']
        };

        const resp = await callClaude(env, (body.fastMode ? MODEL_MAP.haiku : modeModel('summarize_factors')), {
          max_tokens: body.fastMode ? 2000 : 2400,
          system: `你是醫療器材品質專家，根據對話內容整理魚骨圖 6M 因子清單。這份輸出會直接成為改善計畫書的主體，品質要求高：每個因子都要講清楚「為什麼導致問題」「風險為何高/低」「實務上怎麼卡控」。
${deviceCtx}

【立場基礎 — 嚴禁杜撰，最高原則】
- 你只能根據「問卷答案」與「對話中使用者明確講過的內容」推論。使用者沒講的製程細節、設備、數據，一律不可當成事實寫出。
- 需要補充的工程推論，必須在該句尾標（*）表示「此為推論、待查證」，不可把推論寫成既定事實。
- 不確定的因子寧可標 speculative:true，也不可編造一條看似合理卻無依據的關聯。

【問卷 → 因子方向的明確連結 — 必須遵守（硬規則，非參考）】
- 發生規律=「偶發/零星/間歇」→ 必須納入「製程偶發失控、單一操作者人為、獨立污染/混料事件、設備間歇異常」這類因子，並在 link 說明其偶發性如何對應問題；不可只列穩定性因子。
- 出現時機=「新產品一開始」→ 因子重心放在設計/選材/公差未驗證。
- 「以前OK最近才有」→ 因子重心放在近期變更（料/機/參數/人/環境/SOP）。
- 只有某些批次/人機 → 因子重心放在批次、供應商、機台、操作者差異。
- 近期變更欄有填 → 對應變更項必須出現在因子裡。
- 問卷與對話資訊不足以支撐某方向時，誠實少列，不要灌水湊數。

【因子性質 nature — 必填，最重要：你只判性質，不選工具】
工具(DOE/SPC/MSA…)由程式依 nature 自動對應，你絕對不要自己決定工具，只要正確判斷每個因子的「本質性質」：
- adjustable（可調變參數）：能主動設定數值的連續/可調參數——溫度、時間、壓力、濃度、速度、厚度、比例、角度。即使名稱含「控制/設定/調整」也算 adjustable。→ 程式會給 DOE。
- observed（觀測現象）：被動發生、**無法調整**的現象或設備狀態——老化、磨損、漂移、衰退、既成的批次間差異。→ 程式會給 SPC 監控。
- method（手法/量測）：量測或判定方法的可信度與一致性——量具精度、判定標準、操作者手法、量測重複性。→ 程式會給 MSA。
- group_compare（群組比較）：不同群組比較——批次A vs B、供應商X vs Y。→ 程式會給假設檢定。
- compliance（規範符合性）：材料/滅菌/包裝/生物相容、文件流程、設計管制。→ 程式會給 ISO確認/GMP。
- other：以上皆非。
【關鍵判斷紀律 — 違反就是錯】
· 「設備老化/磨損/漂移/衰退」= observed（不是 adjustable！這些不能調，只能監控）。
· 「溫度/時間/壓力 的設定值」= adjustable（這些能調，要做實驗找最佳值）。
· 「操作手法/判定一致性/量測誤差」= method。
· 一個因子若無法「主動設定一個數值去做實驗」，就絕對不是 adjustable。
· adjustable 因子必須在 level_hint 給出建議調變範圍（供實驗設計帶入），不確定就給定性範圍標(*)，不可編造精確值。

【關聯說明 link — 必填】
- 讀懂使用者陳述的「問題現象」。link 寫出完整因果路徑「因子→中間機制→問題現象」，扣回本案、可成段論述（40-70字），不可空泛。
  例：問題=「軟袋注射口漏液」→「熔封模溫漂移」的 link：「熔封溫度低於 TPU 熔流區→注射口與袋體界面未完全互融→形成微小未熔合通道→受輸液壓力時沿通道滲漏」。
- 寫不出對應本問題的因果路徑 → 設 speculative:true，不要硬湊；明顯無關的不列。

【風險原因 risk_reason — 必填】說明為何判 high/medium/low（看對問題的影響嚴重度＋發生可能），不要只給形容詞。

【卡控方式 control_method — 必填】論述實務上怎麼防堵/驗證此因子：明確指出靠 SOP／IFU／設計驗證(DV)／製程確效(IQ/OQ/PQ)／製程監控(SPC)／量測系統分析(MSA)／統計實驗(DOE)／或 ISO 標準符合性（並指出目前是否確實落實、有無缺口）。可執行，不可寫「進行驗證」這種空話。涉及 ISO 時 iso_hint 寫編號。

【因子判斷通則 — 軟體大腦，務必逐項執行】
產生 6M 因子時，不要只想「直接成因」，而要沿下列三層框架系統性掃描，確保因子全面、不漏關鍵面向：

(A)【失效鏈骨架 — 完整掃描每一關】沿「設計→來料(供應商)→製程(機台/治具/參數)→出貨檢驗(量測/抽樣)→包裝滅菌→運輸儲存→臨床使用」逐關自問「這一關是否可能貢獻此失效」。每一關若有合理因子就列出，避免只集中在 1-2 關。

(B)【FMEA 雙軸 — 每個失效都問兩件事】
- 發生(Occurrence)：為何會產生此失效？（彈簧、尺寸、手法、材料…等直接成因）
- 流出(Detection)：為何出貨前沒攔住它流到下游/客戶端？→ 這對應「量測」與「方法」構面的「檢測逃逸因子」。只要問題是在下游/客戶端/臨床才發現，量測與方法【絕不可空或只有低風險】，必須列至少一個中或高風險的檢測逃逸因子（如：出廠檢驗未涵蓋此失效／抽樣量不足以攔偶發／量測方法無偵測力／製程缺管制點）。

(C)【問題類型聚焦 — 依特徵加重該查的構面】依問卷/描述的問題特徵，加重對應構面的風險判定：
- 偶發/低率 → 量測抽樣代表性、製程穩定性(SPC)、邊界值產品逃逸。
- 只有特定批次 → 材料/供應商、來料檢驗。
- 只有特定機台/產線 → 機器、治具、製程參數。
- 只有特定人員 → 人員手法、培訓、可用性人因。
- 尺寸/幾何 → 機器、模具、製程方法、量測系統。
- 隨使用時間/次數才出現(老化磨損) → 設計裕度、上市後監督；提醒「出貨抽樣對老化型失效無效，須移設計驗證或PMS」。

【6M 完整覆蓋】每一個 6M 類別（人員/機器/材料/方法/量測/環境）都至少列 2-3 個因子，不可有空類別。高風險因子（與線索吻合者）標 high；低風險廣度補充標 low 並可標 speculative。
規則：每類別至少 2-3 個、依上述通則確保「發生+流出」雙面與失效鏈各關都涵蓋、不可捏造具體數據、繁體中文（禁簡體）。`,
          tools: [{
            name: 'factor_summary',
            description: '整理 6M 因子清單，每個因子含建議工具',
            input_schema: {
              type: 'object',
              properties: {
                man:      { type: 'array', items: factorItem },
                machine:  { type: 'array', items: factorItem },
                material: { type: 'array', items: factorItem },
                method:   { type: 'array', items: factorItem },
                measure:  { type: 'array', items: factorItem },
                env:      { type: 'array', items: factorItem },
                summary:  { type: 'string', description: '整體分析摘要（50字內）' }
              },
              required: ['man','machine','material','method','measure','env','summary']
            }
          }],
          tool_choice: { type: 'tool', name: 'factor_summary' },
          messages: body.messages
        });
        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || null;
        if(resp._httpError){ return json({ mode: 'summarize_factors', result: null, error: resp._errorMessage }, origin); }
        // 程式強制：依 AI 判定的因子性質 nature，硬性對應分析工具（AI 無法再自由選工具）。
        // adjustable→DOE（多個可調可改 PB）、observed→SPC、method→MSA、group_compare→假設檢定、compliance→none(ISO/GMP)
        if(result){
          const NATURE_TOOL = { adjustable:'doe', observed:'spc', method:'msa', group_compare:'hypothesis', training:'train', compliance:'none', other:'none' };
          // 程式關鍵字防呆：即使 AI 判錯 nature，用因子名稱關鍵字強制修正（雙保險，不純靠 AI）
          // 規則：可調參數→DOE、監控數據→SPC、量測判定→MSA、人員訓練→教育訓練、環境行政法規→ISO
          function correctNature(name, aiNature, cat){
            const n = String(name||'');
            // 量測/判定/手法 → method → MSA（先判，避免「判定一致」被其他規則搶走）
            if(/量測|測量|判定|判讀|檢測誤差|重複性|再現性|量具|校正|目視判定|讀值|計量誤差|Gage|GR&R/.test(n)) return 'method';
            // 人員訓練/技能/操作手法 → training → 教育訓練（你的規則：跟人員有關＝教育訓練或MSA）
            if(/訓練|培訓|教育|技能|熟練|手法|施力|操作一致|作業一致|遵循|SOP遵守|人為操作|操作差異|裝配手法|使用者操作|終端使用者|客戶操作|客戶使用|操作熟悉|經驗不足|認知/.test(n)) return 'training';
            // 觀測現象（被動、不可調）→ observed → SPC
            if(/老化|磨損|漂移|衰退|衰減|劣化|疲勞|鬆動|鬆脫|不穩定|波動|偏移|偏差|變異|退化|積垢|污染累積/.test(n)) return 'observed';
            // 群組比較 → hypothesis
            if(/批次間|供應商|廠商|料號比較|新舊料|對照組|兩組|群組比較/.test(n)) return 'group_compare';
            // 可調參數（主動設定數值）→ adjustable → DOE
            if(/(溫度|時間|壓力|濃度|速度|轉速|流量|厚度|比例|角度|功率|電流|電壓|劑量|張力|間隙|進給)(設定|控制|參數|條件|值)?/.test(n)
               && !/漂移|不穩定|波動|偏移|老化/.test(n)) return 'adjustable';
            // 環境/行政/法規/文件 → compliance → ISO（你的規則：跟環境與行政有關＝ISO）
            if(/環境|溫濕度|潔淨度|無塵|法規|文件|紀錄|記錄管理|流程|稽核|變更管制|設計管制|滅菌確效|包裝確效|生物相容|材料符合/.test(n)) return 'compliance';
            if(cat==='env') return 'compliance';  // 環境類別預設偏 ISO
            return aiNature;
          }
          ['man','machine','material','method','measure','env'].forEach(function(cat){
            if(Array.isArray(result[cat])){
              result[cat].forEach(function(f){
                f._aiNature = f.nature;  // 保留 AI 原判，供除錯
                f.nature = correctNature(f.name, f.nature, cat);
              });
              const adjustables = result[cat].filter(function(f){ return f.nature==='adjustable'; });
              result[cat].forEach(function(f){
                const nat = NATURE_TOOL[f.nature] ? f.nature : 'other';
                f.nature = nat;
                f.tool = NATURE_TOOL[nat];
                if(f.tool==='doe' && adjustables.length>=5) f.tool='pb';
                f.verify_method = ({doe:'統計實驗',pb:'統計實驗',spc:'製程監控',msa:'量測系統分析(MSA)',hypothesis:'統計實驗',train:'教育訓練',none:(f.nature==='compliance'?'ISO/GMP符合性':'文件/工程評估')})[f.tool];
              });
            }
          });
        }
        return json({ mode: 'summarize_factors', result }, origin);
      }

      // ══ identify_device：醫療器材識別 ══
      if (mode === 'identify_device') {
        const deviceName = body.deviceName || '';
        const deviceNameEn = body.deviceNameEn || deviceName;
        const fdaData = body.fdaData || '';

        const resp = await callClaude(env, modeModel('identify_device'), {
          max_tokens: 600,
          system: `你是醫療器材專家，根據器材名稱和 FDA 資料庫資訊，識別並說明這個醫療器材。
必須呼叫 device_info 工具輸出結構化資訊。
務必依固定字彙填寫 category_keys（本器材屬於哪些類別），這會決定後續 ISO 對照要拿哪些標準來比——分類錯會掛錯標準，請謹慎、寧缺勿濫。
用繁體中文填寫（英文術語保留英文），資訊要精確、實用。`,
          tools: [{
            name: 'device_info',
            description: '醫療器材識別結果',
            input_schema: {
              type: 'object',
              properties: {
                confirmed_name: { type: 'string', description: '確認的器材中文名稱（含英文）' },
                device_class: { type: 'string', description: 'FDA Class I/II/III' },
                material: { type: 'string', description: '主要材料（具體，如：316L不銹鋼、PEBAX、聚氨酯）' },
                structure: { type: 'string', description: '結構描述（50字內）' },
                indication: { type: 'string', description: '適應症/用途（30字內）' },
                key_quality: { type: 'array', items: { type: 'string' }, description: '關鍵品質特性（3-5項，如：硬度、親水性、密封性）' },
                category_keys: { type: 'array', items: { type: 'string', enum: ['intravascular','central-venous','dialysis','extracorporeal','bloodline','HD','balloon','introducer','sheath','guidewire','needle','guide','ureteral','stent','connector','luer','syringe','tubing','tracheal','tracheostomy','airway','suction','respiratory','anaesthetic','infusion','iv','iv-bag','container','biliary','drainage','urine-bag','other'] }, description: '器材分類關鍵詞（從清單擇一或多選，供 ISO 對照做確定性過濾）。血管內導管=intravascular（中心靜脈+central-venous、血液透析導管+dialysis、球囊+balloon）；血液回路管/體外循環=extracorporeal+bloodline+dialysis；導引器/鞘=introducer/sheath；導絲=guidewire；皮下/切片針=needle；同軸導引針=needle+guide；輸尿管支架=ureteral+stent；魯爾接頭=connector/luer；注射筒/針筒/高壓顯影注射器=syringe（高壓顯影注射器另加 intravascular）；不鏽鋼針管=tubing；氣管內管=tracheal+airway+respiratory；氣切管=tracheostomy+airway+respiratory；抽痰管=suction+respiratory；麻醉/氧氣面罩=respiratory+anaesthetic；輸液套=infusion+iv；IV軟袋=iv-bag+container+infusion；膽道/鼻膽=biliary；引流管/袋=drainage；尿袋=urine-bag；都不符=other。寧可少給也不要硬塞不相關類別。' },
                fda_search_name: { type: 'string', description: '【供 FDA 510k 查詢用】此器材在 FDA 資料庫的「正式英文通用名稱」，要用 FDA 慣用的器材分類名稱，不是字面直譯。例：高壓顯影注射筒→"angiographic injector"（FDA 870.1650 的正式名稱）；注射筒→"piston syringe"；中心靜脈導管→"catheter, intravascular"。用最可能在 openFDA device_name 查到結果的詞。' },
                product_code_guess: { type: 'string', description: '若你確知此器材的 FDA product code（3碼字母），填入；不確定就留空，不要亂猜。例：高壓顯影注射器常為 DXT/870.1650。' },
                cannot_be: { type: 'array', items: { type: 'string' }, description: '不可能的失效原因（2-4項，用於排除錯誤的魚骨圖因子）' },
                confidence: { type: 'number', description: '識別信心度 0-100' }
              },
              required: ['confirmed_name','material','structure','indication','key_quality','cannot_be','confidence','fda_search_name']
            }
          }],
          tool_choice: { type: 'tool', name: 'device_info' },
          messages: [{
            role: 'user',
            content: `器材中文名稱：${deviceName}\n器材英文名稱：${deviceNameEn}\n\nFDA 510k 資料庫資訊：\n${fdaData || '(無 FDA 資料，請根據器材名稱推斷)'}\n\n請識別這個醫療器材並填入詳細資訊。`
          }]
        });

        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || null;
        // 回傳 debug 資訊幫助診斷
        return json({
          mode: 'identify_device',
          result,
          _debug: result ? null : {
            stop_reason: resp.stop_reason,
            content_types: (resp.content||[]).map(c=>c.type),
            api_error: resp.error
          }
        }, origin);
      }

      // 決定使用的模型
      const toolId = body.toolId || 'capa';
      const modelTier = TOOL_MODEL_POLICY[toolId] || 'sonnet';
      const model = MODEL_MAP[modelTier];

      // ══ navigate：CAPA 導航助理 ══
      if (mode === 'navigate') {
        // 器材知識 context
        const deviceContext = body.deviceInfo ? `
【已確認的醫療器材】
器材：${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
用途：${body.deviceInfo.indication}
關鍵品質特性：${(body.deviceInfo.key_quality||[]).join('、')}
絕對不能提及的失效原因：${(body.deviceInfo.cannot_be||[]).join('、')}
` : '';

        // 問卷 context
        const surveyContext = body.surveyData ? `
【使用者問卷答案】
- 問題出現時機：${body.surveyData.timing || '未填'}
- 發現階段：${body.surveyData.stage || '未填'}
- 是否有量化數據：${body.surveyData.data || '未填'}
- 近期是否有變更：${body.surveyData.change || '未填'}
請根據以上問卷答案分析問題方向，只針對【不明確或矛盾】的地方追問。` : '';

        const resp = await callClaude(env, modeModel('navigate'), {
          max_tokens: 800,
          system: `你是醫療器材品質工程師的 CAPA 引導助理，遵循 DMAIC 流程。
${deviceContext}
${surveyContext}

核心原則：
- DMAIC 的 D（Define）階段必須先用魚骨圖釐清根本原因
- 【魚骨圖永遠是第一個推薦工具】
- 根因未確認前，直接做統計分析方向可能錯誤
- 問診時必須根據已確認的器材特性，問出符合該器材的具體問題

問題判斷邏輯（根據問卷答案）：
- 新產品一開始就有 → 設計問題方向（DOE、材料驗證）
- 以前OK最近才有 → 製程變異（SPC、假設檢定）
- 只有某些批次 → 材料/供應商差異（假設檢定、SPC）
- 只有某些人/機台 → 人員設備差異（MSA）
- 有近期變更 → 變更管理，對照組比較（假設檢定）

對話規則：
- 問題要問「現象」不問「原因」，避免使用專業術語
- 若使用者說「不知道」→ 換個角度問同一件事
- 有問卷資料時，最多再追問 1-3 輪；無問卷資料時，最多追問 5 輪
- 推薦時說明「為什麼用這個工具」（每個工具 20 字內）
- **推薦格式**：簡短說明後，最後一行必須是 [TOOLS: fishbone, tool2, ...]
- 回應總長度控制在 300 字以內

可推薦工具：fishbone, spc, msa, histogram, hypothesis, scatter, boxplot, pb
繁體中文，讓非統計背景的工程師也能理解`,
          messages: body.messages,
        });
        const text = (resp.content && resp.content[0] && resp.content[0].text) || '';
        const m = text.match(/\[TOOLS:\s*([^\]]+)\]/);
        let tools = m ? m[1].split(',').map(t => t.trim()).filter(Boolean) : [];
        // 保險：推薦清單有工具時，魚骨圖永遠排第一
        if (tools.length > 0 && !tools.includes('fishbone')) {
          tools = ['fishbone', ...tools];
        } else if (tools.length > 0 && tools[0] !== 'fishbone') {
          tools = ['fishbone', ...tools.filter(t => t !== 'fishbone')];
        }
        const clean = text.replace(/\[TOOLS:[^\]]+\]/, '').trim();
        return json({ mode: 'navigate', text: clean, tools, done: tools.length > 0 }, origin);
      }

      // ══ fishbone_generate：魚骨圖 6M 建議生成（模型可選）══
      if (mode === 'fishbone_generate') {
        // 使用者可選模型：sonnet（省 token）或 opus（品質較高）
        const fbModel = modeModel('fishbone_generate');  // 省成本：固定 haiku（原預設 sonnet/可選 opus）
        const deviceCtx = body.deviceInfo ? `
【已確認器材】${body.deviceInfo.confirmed_name}
材料：${body.deviceInfo.material}
結構：${body.deviceInfo.structure}
關鍵品質：${(body.deviceInfo.key_quality||[]).join('、')}
絕對不能列的因子：${(body.deviceInfo.cannot_be||[]).join('、')}
` : '';
        const resp = await callClaude(env, fbModel, {
          max_tokens: 2000,
          system: `你是醫療器材製程與設計品質專家，擅長根本原因分析（RCA）。
${deviceCtx}
【醫療器材常識 - 必須遵守】
- 注射針、採血針、檢體針的針管：100% 不銹鋼（304/316L），材質固定，硬度不是變因
- 針管表面：出廠前已電解拋光，表面粗糙度是規格項目不是製程變因
- 塑膠件（hub、座體）：PC/ABS/PP，射出成型
- 親水塗層：導管類才有，針頭通常無
- 密封件：橡膠/TPE，有批次差異

【分析規則】
1. 根據問題類型聚焦：
   - 設計階段 → 著重設計參數、規格定義、幾何尺寸
   - 製程問題 → 著重製程參數、設備、操作條件
   - 客戶端 → 著重量測方法、使用條件
2. 對話/問卷已排除的方向 → 回傳空陣列 []
3. 沒有依據的類別 → 回傳空陣列 []
4. 嚴禁列出違反材料常識的原因（如「針管硬度不足」「針管表面粗糙」）
5. 每個類別 3-5 個原因，具體貼近實際製程，10字以內
6. 風險等級：high（直接影響功能安全）/ medium（影響穩定性）/ low（間接影響）
7. 繁體中文`,
          tools: [{
            name: 'fishbone_causes',
            description: '輸出魚骨圖 6M 根本原因建議，已排除的類別回傳空陣列 []',
            input_schema: {
              type: 'object',
              properties: {
                man:      { type: 'array', description: '人員 Man（若已排除回傳 []）', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
                machine:  { type: 'array', description: '機器 Machine（若已排除回傳 []）', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
                material: { type: 'array', description: '材料 Material', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
                method:   { type: 'array', description: '方法 Method', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
                measure:  { type: 'array', description: '量測 Measurement', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
                env:      { type: 'array', description: '環境 Environment', items: { type: 'object', properties: { name: { type: 'string' }, risk: { type: 'string', enum: ['high','medium','low'] } }, required: ['name','risk'] } },
              },
              required: ['man', 'machine', 'material', 'method', 'measure', 'env'],
            },
          }],
          tool_choice: { type: 'tool', name: 'fishbone_causes' },
          messages: body.messages,
        });
        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || null;
        // 若 result 為 null，回傳詳細錯誤
        if (!result) {
          const errDetail = resp.error ? JSON.stringify(resp.error) :
            (resp.content ? resp.content.map(c=>c.type+':'+(c.text||'').slice(0,100)).join('|') : 'empty response');
          return json({ mode: 'fishbone_generate', result: null, error: errDetail }, origin);
        }
        return json({ mode: 'fishbone_generate', result }, origin);
      }

      // ══ analyze：工具分流三問題判讀 ══
      if (mode === 'analyze') {
        const q = TOOL_QUESTIONS[toolId] || TOOL_QUESTIONS.spc;
        const resp = await callClaude(env, model, {
          max_tokens: 1000,
          system: `你是醫療器材品質工程師的統計分析助理。
根據提供的統計數據，必須呼叫 report_analysis 工具填入三個問題判讀。
每欄 100 字以內，繁體中文，只說統計判讀，不引用 ISO 條文編號。
若為 DOE 分析，請根據 statsText 中的設計類型（全因子/部分因子/Plackett-Burman）給出對應的判讀重點。`,
          tools: [{
            name: 'report_analysis',
            description: '輸出統計分析三問題結構化判讀',
            input_schema: {
              type: 'object',
              properties: {
                q1: { type: 'string', description: q.q1 },
                q2: { type: 'string', description: q.q2 },
                q3: { type: 'string', description: q.q3 },
              },
              required: ['q1', 'q2', 'q3'],
            },
          }],
          tool_choice: { type: 'tool', name: 'report_analysis' },
          messages: body.messages,
        });
        const tu = resp.content && resp.content.find(c => c.type === 'tool_use');
        const result = (tu && tu.input) || { q1: '無法判讀，請重試', q2: '無法判讀，請重試', q3: '無法判讀，請重試' };
        return json({ mode: 'analyze', toolId, labels: q, result }, origin);
      }

      // ══ chat：自由對話（追問）══
      const resp = await callClaude(env, model, {
        max_tokens: 600,
        system: body.system || '你是醫療器材品質工程師的 AI 助理。繁體中文，簡潔專業，不超過 200 字。',
        messages: body.messages,
      });
      return json(resp, origin);

    } catch (err) {
      return new Response(JSON.stringify({ error: '伺服器處理失敗，請稍後再試' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
      });
    }
  }
};

async function callClaude(env, model, payload) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'tools-2024-04-04',
    },
    body: JSON.stringify({ model, ...payload }),
  });
  // 缺陷修正：檢查 HTTP 狀態，讓限流(429)/金鑰錯(401)/額度(402)/過載(529) 明確回報，不再靜默變「空結果」
  if (!r.ok) {
    let detail = '';
    try { const e = await r.json(); detail = (e.error && e.error.message) || JSON.stringify(e); } catch(_) { detail = await r.text().catch(()=> ''); }
    const hint = r.status === 429 ? '（API 限流，請稍候再試）'
      : r.status === 401 ? '（API 金鑰無效或過期）'
      : (r.status === 400 && /credit|balance|billing/i.test(detail)) ? '（帳戶額度不足，請至 Anthropic Console 加值）'
      : r.status === 529 ? '（Anthropic 服務暫時過載，請稍候再試）' : '';
    return { _httpError: r.status, _errorMessage: 'API 錯誤 ' + r.status + ' ' + hint + (detail ? '：' + detail.slice(0,200) : ''), content: [] };
  }
  return await r.json();
}

function json(obj, origin) {
  return new Response(JSON.stringify(obj), {
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}
