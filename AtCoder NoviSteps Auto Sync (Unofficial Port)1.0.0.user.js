// ==UserScript==
// @name         AtCoder NoviSteps Auto Sync (Unofficial Port)
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  This tool automatically syncs your AtCoder acceptance (AC) status with AtCoder NoviSteps.
// @author       kirameku
// @match        https://atcoder-novisteps.vercel.app/*
// @supportURL   https://github.com/kirameku26/AtCoder-NoviSteps-Auto-Sync-Unofficial-port
// @license      MIT
// @icon         https://atcoder.jp/favicon.ico
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      kenkoooo.com
// @downloadURL https://update.greasyfork.org/scripts/579674/AtCoder%20NoviSteps%20Auto%20Sync%20%28Unofficial%20Port%29.user.js
// @updateURL https://update.greasyfork.org/scripts/579674/AtCoder%20NoviSteps%20Auto%20Sync%20%28Unofficial%20Port%29.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  GM_addStyle(`
@keyframes ns-slide-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ns-fade-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

@keyframes ns-btn-appear {
  from {
    opacity: 0;
    transform: translateY(16px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

#ns-sync-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  padding: 11px 24px;
  background: #5cb88a;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 0 2px 10px rgba(34, 197, 94, 0.18);
  transition: all 0.2s ease;
  overflow: hidden;
  animation: ns-btn-appear 0.3s ease;
}

#ns-sync-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
}

#ns-sync-btn:not(:disabled):active {
  transform: translateY(0);
}

#ns-sync-btn.ns-busy {
  cursor: wait;
  opacity: 0.85;
}

#ns-sync-progress {
  display: block;
  width: 0%;
  height: 3px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 0 0 10px 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  transition: width 0.3s ease;
}

.ns-toast {
  position: fixed;
  bottom: 80px;
  right: 24px;
  z-index: 999998;
  padding: 12px 20px;
  max-width: 320px;
  border: 1px solid;
  border-radius: 10px;
  font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif;
  font-size: 13px;
  line-height: 1.7;
  white-space: pre-line;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: ns-slide-up 0.25s ease;
}

.ns-toast-success {
  background: #ecfdf5;
  border-color: #86efac;
  color: #065f46;
}

.ns-toast-error {
  background: #fef2f2;
  border-color: #fca5a5;
  color: #991b1b;
}

.ns-toast-info {
  background: #f0f9ff;
  border-color: #93c5fd;
  color: #1e40af;
}

.ns-confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000000;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ns-slide-up 0.2s ease;
}

.ns-confirm-card {
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  max-width: 340px;
  width: 88%;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  font-family: "Hiragino Kaku Gothic ProN", "Noto Sans JP", system-ui, sans-serif;
}

.ns-confirm-message {
  margin: 0 0 22px;
  font-size: 14px;
  line-height: 1.8;
  color: #374151;
  white-space: pre-line;
}

.ns-confirm-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.ns-confirm-btn {
  padding: 9px 26px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.15s ease;
  font-family: inherit;
}

.ns-confirm-btn-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.ns-confirm-btn-secondary:hover {
  background: #e5e7eb;
}

.ns-confirm-btn-primary {
  background: #22c55e;
  color: #fff;
}

.ns-confirm-btn-primary:hover {
  background: #16a34a;
}
`);
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();

  let USER_ID = _GM_getValue("atcoder_user_id", ""); // ここに AtCoder ID を入力
  const STORAGE_KEY = `synced`;
  const SYNC_RESULT_KEY = "sync_result";
  const TOAST_DURATION_MS = 4000;
  const TOAST_FADE_DURATION_MS = 250;
  const TOAST_RELOAD_DELAY_MS = 500;
  const ATCODER_REQUEST_DELAY_BASE_MS = 1100;
  const ATCODER_REQUEST_DELAY_JITTER_MS = 100;
  const NOVISTEPS_REQUEST_DELAY_BASE_MS = 1000;
  const NOVISTEPS_REQUEST_DELAY_JITTER_MS = 500;
  const PROBLEMS_UPDATE_PATH = "/problems?/update";
  const ATCODER_SUBMISSIONS_API =
    "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions";

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const getDelayMs = (baseMs, jitterMs) => baseMs + Math.random() * jitterMs;

  const getAtCoderDelayMs = () =>
    getDelayMs(ATCODER_REQUEST_DELAY_BASE_MS, ATCODER_REQUEST_DELAY_JITTER_MS);

  const getNoviStepsDelayMs = () =>
    getDelayMs(
      NOVISTEPS_REQUEST_DELAY_BASE_MS,
      NOVISTEPS_REQUEST_DELAY_JITTER_MS,
    );

  function init() {
    _GM_registerMenuCommand("ユーザー名の設定 (AtCoder NoviSteps Auto Sync)", () => {
      const currentN = _GM_getValue("atcoder_user_id", "");
      const input = prompt(
        "あなたのAtCoderのユーザーidを入力してください:",
        String(currentN)
      );
      console.log(input);
      if (input !== null && input.trim() !== "") {
        const newN = input;
        _GM_setValue("atcoder_user_id", newN);
        alert("ユーザーIDを保存しました: " + newN);
      }
    });
    USER_ID = _GM_getValue("atcoder_user_id", "");
  }

  function createSyncRequestBody(problemId) {
    const formData = new FormData();
    formData.append("taskId", problemId);
    formData.append("submissionStatus", "ac");
    return formData;
  }

  function getAcceptedProblemIds(submissions) {
    return [
      ...new Set(
        submissions
          .filter((item) => item.result === "AC")
          .map((item) => item.problem_id),
      ),
    ];
  }

  function gmFetch(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                // fetch の response.ok と同等のチェック
                if (response.status >= 200 && response.status < 300) {
                    resolve(response);
                } else {
                    reject(new Error(`Failed to fetch submissions: ${response.status}`));
                }
            },
            onerror: function(error) {
                reject(error);
            }
        });
    });
  }

  async function fetchAcceptedProblemIds(userId, fromSecond) {
    const url = `${ATCODER_SUBMISSIONS_API}?user=${encodeURIComponent(userId)}&from_second=${fromSecond}`;

    const response = await gmFetch(url);

    const submissions = JSON.parse(response.responseText);

    const maxEpochSecond = submissions.reduce(
      (max, item) => Math.max(max, item.epoch_second),
      0,
    );

    return {
      acceptedProblemIds: getAcceptedProblemIds(submissions),
      submissionsCount: submissions.length,
      nextFromSecond: maxEpochSecond,
    };
  }

  async function fetchAcceptedAllProblemIds(userId) {
    const acceptedAllProblemIds = new Set();
    let fromSecond = 0;

    while (true) {
      const { acceptedProblemIds, submissionsCount, nextFromSecond } =
        await fetchAcceptedProblemIds(userId, fromSecond);

      acceptedProblemIds.forEach((id) => acceptedAllProblemIds.add(id));

      if (submissionsCount === 0) {
        break;
      }

      if (nextFromSecond < fromSecond) {
        throw new Error("Unexpected submissions order from Problems API");
      }

      fromSecond = nextFromSecond + 1; // 次のリクエストでは前回の最終秒数の次から取得する
      await wait(getAtCoderDelayMs());
    }

    return [...acceptedAllProblemIds];
  }

  async function syncProblem(problemId) {
    return fetch(PROBLEMS_UPDATE_PATH, {
      method: "POST",
      body: createSyncRequestBody(problemId),
      headers: { "x-sveltekit-action": "true" },
    });
  }

  // ========================================
  // トースト通知（alert の代わり）
  // ========================================
  function showToast(message, type) {
    const old = document.getElementById("ns-toast");
    if (old) old.remove();

    const el = document.createElement("div");
    el.id = "ns-toast";
    el.className = `ns-toast ns-toast-${type || "info"}`;
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => {
      el.style.animation = `ns-fade-out ${TOAST_FADE_DURATION_MS}ms ease forwards`;
      setTimeout(() => el.remove(), TOAST_FADE_DURATION_MS);
    }, TOAST_DURATION_MS);
  }

  // ========================================
  // 確認モーダル（confirm の代わり）
  // ========================================
  function showConfirm(message) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "ns-confirm-overlay";

      const card = document.createElement("div");
      card.className = "ns-confirm-card";

      const msg = document.createElement("p");
      msg.textContent = message;
      msg.className = "ns-confirm-message";

      const btnRow = document.createElement("div");
      btnRow.className = "ns-confirm-actions";

      const makeBtn = (text, primary) => {
        const b = document.createElement("button");
        b.textContent = text;
        b.className = `ns-confirm-btn ${
          primary ? "ns-confirm-btn-primary" : "ns-confirm-btn-secondary"
        }`;
        return b;
      };

      const close = (result) => {
        overlay.remove();
        resolve(result);
      };

      const cancelBtn = makeBtn("やめておく", false);
      const okBtn = makeBtn("同期する", true);

      cancelBtn.addEventListener("click", () => close(false));
      okBtn.addEventListener("click", () => close(true));

      btnRow.append(cancelBtn, okBtn);
      card.append(msg, btnRow);
      overlay.appendChild(card);
      document.body.appendChild(overlay);
    });
  }

  // ========================================
  // リロード後の通知
  // ========================================
  const syncResult = sessionStorage.getItem(SYNC_RESULT_KEY);
  if (syncResult) {
    sessionStorage.removeItem(SYNC_RESULT_KEY);
    setTimeout(() => showToast(syncResult, "success"), TOAST_RELOAD_DELAY_MS);
  }

  // ========================================
  // 同期済みリストの読み書き
  // ========================================
  const getSyncedIds = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(parsed) ? parsed : []);
    } catch {
      return new Set();
    }
  };

  const saveSyncedIds = (idSet) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...idSet]));
  };

  // ========================================
  // 同期ボタンの注入
  // ========================================
  function injectSyncButton() {

    if (document.getElementById("ns-sync-btn") || !document.body) return;

    const btn = document.createElement("button");
    btn.id = "ns-sync-btn";

    const label = document.createElement("span");
    label.id = "ns-sync-label";
    label.textContent = "AC を同期";

    const progress = document.createElement("span");
    progress.id = "ns-sync-progress";

    btn.append(label, progress);

    function resetBtn() {
      label.textContent = "AC を同期";
      btn.disabled = false;
      btn.classList.remove("ns-busy");
      progress.style.width = "0%";
    }

    function setBusy(text) {
      btn.disabled = true;
      btn.classList.add("ns-busy");
      label.textContent = text;
    }

    btn.addEventListener("click", async () => {
      if (!USER_ID) {
        showToast(
          "AtCoder ID が設定されていません。\nユーザー名の設定 を確認してください。",
          "error",
        );
        return;
      }

      setBusy("確認中…");

      try {
        const allAcIds = await fetchAcceptedAllProblemIds(USER_ID);

        const syncedIds = getSyncedIds();
        const tasksToSync = allAcIds.filter((id) => !syncedIds.has(id));

        if (tasksToSync.length === 0) {
          showToast("すべて同期済みです！", "success");
          resetBtn();
          return;
        }

        resetBtn();
        const ok = await showConfirm(
          `新しく ${tasksToSync.length} 問の AC が見つかりました！\nNoviSteps に同期しますか？`,
        );
        if (!ok) return;

        setBusy("同期中…");

        let successCount = 0;
        for (let i = 0; i < tasksToSync.length; i++) {
          const pid = tasksToSync[i];
          const response = await syncProblem(pid);

          if (response.ok) {
            successCount++;
            syncedIds.add(pid);
          }

          const pct = Math.round(((i + 1) / tasksToSync.length) * 100);
          label.textContent = `同期中… ${i + 1} / ${tasksToSync.length}`;
          progress.style.width = `${pct}%`;
          await wait(getNoviStepsDelayMs());
        }

        saveSyncedIds(syncedIds);

        sessionStorage.setItem(
          SYNC_RESULT_KEY,
          `同期が完了しました！\n${successCount} 問を追加しました`,
        );
        location.reload();
      } catch (e) {
        console.error(e);
        showToast(
          "同期に失敗しました。\nしばらくしてからもう一度お試しください。",
          "error",
        );
        label.textContent = "もう一度試す";
        btn.disabled = false;
        btn.classList.remove("ns-busy");
      }
    });

    document.body.appendChild(btn);
  }

  // 初回ボタン注入
  if (document.readyState === "loading"){
      if(!document.contentType.includes('application/json')) document.addEventListener("DOMContentLoaded", injectSyncButton);
  }
  else{
      init();
      if(!document.contentType.includes('application/json')) injectSyncButton();
  }
  if(!document.contentType.includes('application/json')) {
      new MutationObserver(injectSyncButton).observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
  }
})();
