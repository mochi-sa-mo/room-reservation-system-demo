import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/**
 * 共通のモーダル（ログアウト確認など）を画面に追加し、動作を設定する
 */
export function setupCommonModals() {
    // 画面の最後に共通モーダルのHTMLを注入
    document.body.insertAdjacentHTML('beforeend', `
        <!-- 共通ログアウトモーダル -->
        <div class="modal-overlay" id="common-logout-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:#fff; padding:20px; border-radius:8px; width:90%; max-width:350px; text-align:center; border-top: 5px solid #d0021b; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h3 style="margin-top:0; border-bottom:1px solid #ccc; padding-bottom:10px;">ログアウトの確認</h3>
                <p style="color:#555; margin:15px 0;">システムからログアウトしますか？</p>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="btn-common-logout-cancel" style="flex:1; padding:10px; background:#999; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">キャンセル</button>
                    <button id="btn-common-logout-execute" style="flex:1; padding:10px; background:#d0021b; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">ログアウト</button>
                </div>
            </div>
        </div>
    `);

    // キャンセルボタンの動作
    document.getElementById('btn-common-logout-cancel').addEventListener('click', () => {
        document.getElementById('common-logout-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    });

    // ログアウト実行ボタンの動作
    document.getElementById('btn-common-logout-execute').addEventListener('click', async () => {
        const btn = document.getElementById('btn-common-logout-execute');
        btn.disabled = true;
        btn.textContent = '処理中...';
        try {
            await signOut(auth);
            localStorage.removeItem('userRole');
            sessionStorage.removeItem('adminNameDictionary');
            window.location.replace('login.html');
        } catch (error) {
            console.error(error);
            alert("ログアウトに失敗しました。");
            btn.disabled = false;
            btn.textContent = 'ログアウト';
        }
    });
}

/**
 * どこからでもログアウトモーダルを呼び出せる関数
 */
export function showLogoutModal() {
    document.getElementById('common-logout-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

/**
 * パターンに応じたヘッダーを描画する
 * @param {string} title - ヘッダーに表示するタイトル
 * @param {string} type - 'back' (戻るのみ), 'dict-back' (名簿＋戻る), 'hamburger' (メニュー)
 * @returns {string} - 生成されたヘッダーのHTMLテキスト
 */
export function renderHeader(title, type = 'back') {
    let rightContent = '';

    if (type === 'back') {
        // パターンA: 戻るボタンのみ
        rightContent = `<button onclick="window.history.back()" style="background:#999; color:white; padding:8px 16px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">← 戻る</button>`;
    
    } else if (type === 'dict-back') {
        // パターンB: 名簿辞書設定 + 戻るボタン
        rightContent = `
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button id="btn-open-dict" style="background:#00bcd4; color:white; padding:8px 16px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">📖 名簿辞書設定</button>
                <button onclick="window.history.back()" style="background:#e0e0e0; color:#333; padding:8px 16px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">← 戻る</button>
            </div>
        `;
    
    } else if (type === 'hamburger') {
        // パターンC: ハンバーガーメニュー
        rightContent = `
            <div id="hamburger-btn" style="width:25px; height:18px; cursor:pointer; display:flex; flex-direction:column; justify-content:space-between; z-index:1010; position:relative;">
                <span style="display:block; height:3px; width:100%; background:#333; border-radius:3px; transition:all 0.3s ease;"></span>
                <span style="display:block; height:3px; width:100%; background:#333; border-radius:3px; transition:all 0.3s ease;"></span>
                <span style="display:block; height:3px; width:100%; background:#333; border-radius:3px; transition:all 0.3s ease;"></span>
            </div>
        `;
    }

    // ヘッダーのHTMLを返す
    return `
        <header style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; padding-bottom:10px; border-bottom:2px solid #ccc; flex-wrap:wrap; gap:10px;">
            <h1 style="margin:0; font-size:1.5em; color:#333;">${title}</h1>
            ${rightContent}
        </header>
    `;
}
