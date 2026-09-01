import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/**
 * 共通のログアウトモーダルを画面に準備する
 */
export function setupCommonModals() {
    // 画面の最後に共通モーダルのHTMLを注入
    document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="common-logout-modal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9999; justify-content:center; align-items:center;">
            <div style="background:#fff; padding:20px; border-radius:8px; width:90%; max-width:350px; text-align:center; border-top: 5px solid #d0021b; box-shadow: 0 4px 15px rgba(0,0,0,0.3);">
                <h3 style="margin-top:0; border-bottom:2px solid #d0021b; padding-bottom:5px;">ログアウト</h3>
                <p style="color:#555; margin:15px 0; font-size: 0.95em; line-height: 1.5; text-align: left;">システムからログアウトします。<br>よろしいですか？</p>
                <div style="display:flex; gap:10px; margin-top:20px;">
                    <button id="btn-common-logout-cancel" style="flex:1; padding:12px; background:#999; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">キャンセル</button>
                    <button id="btn-common-logout-execute" style="flex:1; padding:12px; background:#d0021b; color:#fff; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">実行する</button>
                </div>
            </div>
        </div>
    `);

    document.getElementById('btn-common-logout-cancel').addEventListener('click', () => {
        document.getElementById('common-logout-modal').style.display = 'none';
        document.body.classList.remove('modal-open');
    });

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
            btn.textContent = '実行する';
        }
    });
}

/**
 * ログアウトモーダルを表示する関数
 */
export function showLogoutModal() {
    document.getElementById('common-logout-modal').style.display = 'flex';
    document.body.classList.add('modal-open');
}

/**
 * ページ上部にヘッダー（と必要なメニュー）を自動生成する
 * @param {string} title - 画面左上に表示するタイトル
 * @param {string} type - 'back' | 'dict-back' | 'hamburger'
 */
export function setupHeader(title, type = 'back') {
    let rightContent = '';
    let extraHtml = '';

    // パターン1: 戻るのみ
    if (type === 'back') {
        rightContent = `<button class="btn-back" onclick="window.history.back()" style="background:#999; color:white; padding:10px 15px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">戻る</button>`;
    } 
    // パターン2: 名簿辞書 ＋ 戻る
    else if (type === 'dict-back') {
        rightContent = `
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-info" id="btn-open-dict" style="background-color: #00bcd4; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">📖 名簿辞書設定</button>
                <button class="btn btn-nav" onclick="window.history.back()" style="background-color: #e0e0e0; color: #333; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">← 戻る</button>
            </div>
        `;
    } 
    // パターン3: ハンバーガーメニュー
    else if (type === 'hamburger') {
        rightContent = `
            <div class="header-actions">
                <div class="hamburger" id="hamburger-btn">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;
        // 横から出るメニューもここで一緒に作ってしまう
        extraHtml = `
            <nav class="side-menu" id="side-menu">
                <ul>
                    <li class="menu-category">管理者メニュー</li>
                    <li><a href="admin_live_manager.html" style="color: #e91e63;">ライブ審査・管理</a></li>
                    <li><a href="admin_rsvp_manager.html" style="color: #4caf50;">打ち上げ参加状況管理</a></li>
                    <li><a href="admin_rsvp_pay.html" style="color: #ff00ff;">打ち上げ集金状況管理</a></li>
                    <li><a href="admin_board.html" style="color: #ff9800;">掲示板の審査・管理</a></li>
                    <li class="menu-category">アカウント</li>
                    <li><a href="settings.html" style="color: #4A90E2;">パスワード変更</a></li>
                    <li><a id="btn-menu-logout" style="color: #d0021b; cursor: pointer;">ログアウト</a></li>
                </ul>
            </nav>
            <div class="menu-overlay" id="menu-overlay"></div>
        `;
    }

    // bodyの一番上にヘッダーを差し込む
    const headerHtml = `
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #ccc; flex-wrap: wrap; gap: 10px;">
            <h1 style="margin:0; font-size:1.5em;">${title}</h1>
            ${rightContent}
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

    // メニュー用のHTMLがあれば追加して、動作を設定する
    if (extraHtml) {
        document.body.insertAdjacentHTML('beforeend', extraHtml);

        const hamburgerBtn = document.getElementById('hamburger-btn');
        const sideMenu = document.getElementById('side-menu');
        const menuOverlay = document.getElementById('menu-overlay');

        const toggleMenu = () => {
            hamburgerBtn.classList.toggle('open');
            sideMenu.classList.toggle('open');
            menuOverlay.classList.toggle('open');
            document.body.classList.toggle('modal-open');
        };

        hamburgerBtn.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('click', toggleMenu);
        menuOverlay.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        document.querySelectorAll('#side-menu a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (e.target.id === 'btn-menu-logout') {
                    showLogoutModal(); // 共通のログアウト画面を呼び出す
                    return;
                }
                toggleMenu();
            });
        });
    }
}
