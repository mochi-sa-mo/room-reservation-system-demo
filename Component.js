import { auth } from "./firebase.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/**
 * 共通のCSSをページに注入する（1回だけ実行される）
 */
function injectComponentStyles() {
    if (document.getElementById('component-styles')) return;

    const style = document.createElement('style');
    style.id = 'component-styles';
    style.innerHTML = `
        body.modal-open { overflow: hidden; }

        .header-actions { display: flex; align-items: center; }
        .hamburger { width: 25px; height: 18px; cursor: pointer; display: flex; flex-direction: column; justify-content: space-between; z-index: 1010; position: relative; }
        .hamburger span { display: block; height: 3px; width: 100%; background-color: #333; border-radius: 3px; transition: all 0.3s ease; }
        .hamburger.open span:nth-child(1) { transform: translateY(7.5px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7.5px) rotate(-45deg); }
        .side-menu { position: fixed; top: 0; right: -250px; width: 250px; height: 100%; background-color: #fff; box-shadow: -2px 0 5px rgba(0,0,0,0.1); transition: right 0.3s ease; z-index: 1005; padding-top: 70px; overflow-y: auto; -webkit-overflow-scrolling: touch; box-sizing: border-box; padding-bottom: 30px; overscroll-behavior: contain; }
        .side-menu.open { right: 0; }
        .side-menu ul { list-style: none; padding: 0; margin: 0; }
        .side-menu li { border-bottom: 1px solid #eee; }
        .side-menu li.menu-category { background-color: #f0f4f8; color: #555; font-size: 0.85em; padding: 8px 20px; font-weight: bold; border-bottom: 1px solid #e1e4e8; border-top: 1px solid #e1e4e8; margin-top: 10px; }
        .side-menu li.menu-category:first-child { margin-top: 0; border-top: none; }
        .side-menu a { display: block; padding: 15px 20px; text-decoration: none; color: #333; font-weight: bold; transition: background-color 0.2s; }
        .side-menu a:hover { background-color: #f5f7fa; }

        .menu-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; }
        .menu-overlay.open { display: block; }
    `;
    document.head.appendChild(style);
}

/**
 * 共通のログアウトモーダルを画面に準備する
 */
export function setupCommonModals() {
    injectComponentStyles();

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
    injectComponentStyles();

    let rightContent = '';
    let extraHtml = '';

    if (type === 'back') {
        rightContent = `<button class="btn-back" onclick="window.history.back()" style="background:#999; color:white; padding:10px 15px; border:none; border-radius:4px; font-weight:bold; cursor:pointer;">戻る</button>`;
    } 
    else if (type === 'dict-back') {
        rightContent = `
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="btn btn-info" id="btn-open-dict" style="background-color: #00bcd4; color: white; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">📖 名簿辞書設定</button>
                <button class="btn btn-nav" onclick="window.history.back()" style="background-color: #e0e0e0; color: #333; padding: 8px 16px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer;">← 戻る</button>
            </div>
        `;
    } 
    else if (type === 'hamburger') {
        rightContent = `
            <div class="header-actions">
                <div class="hamburger" id="hamburger-btn">
                    <span></span><span></span><span></span>
                </div>
            </div>
        `;

        const role = localStorage.getItem('userRole');
        let menuItems = '';

        if (role === 'admin' || role === 'sysadmin') {
            // 管理者用メニュー
            menuItems = `
                <li class="menu-category">管理者メニュー</li>
                <li><a href="admin_live_manager.html" style="color: #e91e63;">ライブ審査・管理</a></li>
                <li><a href="admin_rsvp_manager.html" style="color: #4caf50;">打ち上げ参加状況管理</a></li>
                <li><a href="admin_rsvp_pay.html" style="color: #ff00ff;">打ち上げ集金状況管理</a></li>
                <li><a href="admin_board.html" style="color: #ff9800;">掲示板の審査・管理</a></li>
            `;
        } else {
            // 一般部員用メニュー
            menuItems = `
                <li class="menu-category">部室予約</li>
                <li><a href="tsuika.html" style="color: #4caf50;">今週の追加予約</a></li>
                <li><a href="yoyaku.html" style="color: #4A90E2;">次週の予約</a></li>

                <li class="menu-category">バンド管理</li>
                <li><a href="band_register.html" style="color: #ff9800;">新規バンドを登録する</a></li>
                <li><a href="my_bands.html" style="color: #8e44ad;">所属バンドを確認する</a></li>

                <li class="menu-category">ライブ・掲示板</li>
                <li><a href="live_entry.html" style="color: #e91e63;">ライブエントリーをする</a></li>
                <li><a href="entry_status.html" style="color: #e65100;">審査状況・履歴を確認する</a></li>
                <li><a href="rsvp.html" style="color: #4caf50;">打ち上げの回答をする</a></li>
                <li><a href="board.html" style="color: #00bcd4;">掲示板へ</a></li>
            `;
        }

        // 余分な×ボタンを削除
        extraHtml = `
            <nav class="side-menu" id="side-menu">
                <ul>
                    ${menuItems}
                    <li class="menu-category">アカウント</li>
                    <li><a href="settings.html" style="color: #333;">パスワードの変更</a></li>
                    <li><a href="support.html" style="color: #4caf50;">サポート・お問い合わせ</a></li>
                    <li><a id="btn-menu-logout" style="color: #d0021b; cursor: pointer;">ログアウト</a></li>
                </ul>
            </nav>
            <div class="menu-overlay" id="menu-overlay"></div>
        `;
    }

    // ヘッダーの上下に padding を追加して縦幅を確保
    const headerHtml = `
        <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding: 10px 0; border-bottom: 2px solid #ccc; flex-wrap: wrap; gap: 10px; min-height: 40px;">
            <h1 style="margin:0; font-size:1.5em; color:#333;">${title}</h1>
            ${rightContent}
        </header>
    `;
    document.body.insertAdjacentHTML('afterbegin', headerHtml);

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
                    showLogoutModal();
                    return;
                }
                toggleMenu();
            });
        });
    }
}
