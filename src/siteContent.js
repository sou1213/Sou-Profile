export const localePaths = {
    ja: {
        home: "/index.html",
        work: "/work.html"
    },
    en: {
        home: "/en/index.html",
        work: "/en/work.html"
    }
};

export const pageMetadata = {
    ja: {
        home: {
            title: "高橋壮介 | Swift・iOSアプリ開発ポートフォリオ",
            description: "高橋壮介のSwift・iOSアプリ開発ポートフォリオ。iPadのSwift Playgroundsを使った学習、アプリ制作、Web制作の記録を紹介します。",
            canonical: "https://sou-profile.pages.dev/"
        },
        work: {
            title: "制作実績 | ChatGPT Touch Bar・iOS/Webアプリ | 高橋壮介",
            description: "高橋壮介がOSSとして公開するChatGPT Touch Barをはじめ、制作中のiOSアプリとWebアプリを紹介します。",
            canonical: "https://sou-profile.pages.dev/work"
        }
    },
    en: {
        home: {
            title: "Sosuke Takahashi | Swift & iOS Developer Portfolio",
            description: "Sosuke Takahashi's portfolio featuring Swift and iOS app development, open-source software, and web experiments.",
            canonical: "https://sou-profile.pages.dev/en/"
        },
        work: {
            title: "Selected Work | macOS, iOS & Web Apps | Sosuke Takahashi",
            description: "Explore Sosuke Takahashi's open-source macOS utility, iOS app in development, and experimental WebGL project.",
            canonical: "https://sou-profile.pages.dev/en/work"
        }
    }
};

export const siteContent = {
    ja: {
        nav: {
            label: "メインナビゲーション",
            markLabel: "SOU LOG ホーム",
            home: "Home",
            work: "Work",
            switchToLight: "ライトモードへ切り替える",
            switchToDark: "ダークモードへ切り替える",
            light: "Light",
            dark: "Dark",
            switchLanguage: "英語に切り替える",
            targetLanguage: "EN"
        },
        home: {
            name: "高橋 壮介",
            currentState: [
                "「知的好奇心」に従って、自分の手で何かを作れるようになるための試行錯誤中...。",
                "将来スイスを拠点に多様なライフスタイルを実現することを目標としていますが、現在はその土台作りとして「アプリ開発」に一点集中して取り組んでいます。"
            ],
            currentFocus: "iPadのSwift Playgroundsのみを用いて、プログラミングの基礎学習からアプリの作成までを一貫して行っています。まずはこの領域で「形にする」経験を積むことに集中しています。",
            mindset: "昨日分からなかったことが、今日分かるようになる過程を楽しみながら学んでいます。「尽きない好奇心」と毎日1％の努力を大切にしています。",
            socialLabel: "SNSリンク",
            xLabel: "Xプロフィールを開く",
            githubLabel: "GitHubプロフィールを開く"
        },
        shared: {
            technologies: "使用技術"
        },
        work: {
            eyebrow: "Selected Work",
            title: "WORK",
            lead: "完成品だけでなく、考えながら形にしている途中のプロジェクトも制作記録として掲載しています。",
            touchBar: {
                sectionTitle: "macOS Application / Open Source",
                status: "Open Source",
                title: "ChatGPT Touch Bar",
                imageAlt: "ChatGPT Touch Barの概要と利用枠メーターを示す画像",
                intro: "ChatGPT/Codexアプリ、またはSafariのChatGPTタブを使用している間、Codexの利用状況をMacBook ProのTouch Barに表示するmacOS常駐ヘルパーです。",
                readMore: "続きを見る",
                closeDetails: "詳細を閉じる",
                details: [
                    "5時間枠と週次枠の残り容量、次のリセット時刻を手元で確認できます。対象外のアプリやWebサイトへ切り替えると、Touch Barは自動的に通常の表示へ戻ります。",
                    "既存のCodex認証を利用してローカルで動作し、APIキーや有料の開発者APIは必要ありません。アクセス解析、テレメトリ、外部データベースを使用せず、Safari連携では現在のタブURLだけを確認します。"
                ],
                touchBarAlt: "SafariでChatGPTを使用しているときのTouch Bar表示",
                touchBarCaption: "SafariでChatGPTを使用中のTouch Bar表示",
                features: [
                    "Codexの5時間枠・週次枠の残り容量を表示",
                    "次回リセット時刻と30秒ごとの自動更新",
                    "ChatGPT/CodexデスクトップアプリとSafariに対応",
                    "利用状況に応じたTouch Barの表示・復元"
                ],
                notice: "Touch Bar搭載MacBook ProとmacOS 12以降が必要です。署名済みバイナリはまだ公開していないため、現在はソースコードからビルドして利用します。",
                action: "View on GitHub",
                license: "MIT License"
            },
            taskManager: {
                sectionTitle: "iOS Application",
                status: "In Development",
                title: "TaskManager",
                paragraphs: [
                    "Apple Pencilでその日の予定を書き、時間と完了状況を管理するiPad向けの一日計画アプリです。毎日のタスクを作成する人に向けて、手で書くからこそ得られる「今日の計画を作った」という実感を大切にしています。",
                    "制作のきっかけは、Goodnotesに毎日のタスクを書いていたことでした。キーボードで入力するよりも自分の手で書く方が好きな人や、書く行為を通して予定と向き合いたい人が、自然に使えるアプリを目指しています。",
                    "また、日本では手書きに特化したタスク管理アプリがまだ多くないと感じたことから、機能を詰め込みすぎず、毎日迷わず使えるシンプルさと使いやすさを大切にしています。"
                ],
                features: [
                    "Apple Pencilで書いた予定の保存と文字認識",
                    "朝・午後・夜に分けた一日の計画と完了管理",
                    "手書きによる開始・終了時刻の入力とローカル通知",
                    "未完了タスクの日次繰越、履歴、バックアップ"
                ],
                notice: "現在は開発・検証中で、App Storeにはまだ公開していません。ダウンロードリンクは公開後に追加予定です。",
                availability: "App Store: Not yet available"
            },
            wallpaper: {
                sectionTitle: "Web Application",
                status: "Work in Progress",
                title: "Your Feel Of Wallpaper",
                paragraphs: [
                    "気分や時間帯に合う「壁紙 × 音楽」の組み合わせを、誰かのコメントと一緒に探索するWebアプリケーションです。",
                    "朝・昼・夕方・夜で画面全体の雰囲気が変わり、奥行きのある空間をスクロールしながら投稿を探せるプロトタイプを制作しています。"
                ],
                features: [
                    "時間帯に連動する背景と投稿の切り替え",
                    "奥行きスクロールによる投稿探索",
                    "壁紙、コメント、タグ、外部音楽リンクの詳細表示",
                    "キーボード操作とReduced Motionへの対応"
                ],
                notice: "現在は開発途中です。ログイン、実際の投稿、検索、データ保存などは未実装で、表示内容にはモックデータを使用しています。",
                action: "Live Preview",
                source: "Source code: Private"
            }
        }
    },
    en: {
        nav: {
            label: "Main navigation",
            markLabel: "SOU LOG home",
            home: "Home",
            work: "Work",
            switchToLight: "Switch to light mode",
            switchToDark: "Switch to dark mode",
            light: "Light",
            dark: "Dark",
            switchLanguage: "Switch to Japanese",
            targetLanguage: "JP"
        },
        home: {
            name: "Sosuke Takahashi",
            currentState: [
                "Driven by intellectual curiosity, I am learning through trial and error how to turn ideas into things I can build with my own hands.",
                "My long-term goal is to base myself in Switzerland and create a flexible, diverse way of living. Right now, I am focused on app development as the foundation for that path."
            ],
            currentFocus: "Using only Swift Playgrounds on iPad, I am learning programming fundamentals and building apps in one continuous process. My current priority is gaining experience in taking an idea all the way to a working form.",
            mindset: "I enjoy the process of understanding today what I could not understand yesterday. I value enduring curiosity and improving by one percent every day.",
            socialLabel: "Social links",
            xLabel: "Open X profile",
            githubLabel: "Open GitHub profile"
        },
        shared: {
            technologies: "Technologies used"
        },
        work: {
            eyebrow: "Selected Work",
            title: "WORK",
            lead: "I document not only finished products, but also projects that are still taking shape as I think, build, and learn.",
            touchBar: {
                sectionTitle: "macOS Application / Open Source",
                status: "Open Source",
                title: "ChatGPT Touch Bar",
                imageAlt: "Overview of ChatGPT Touch Bar with Codex usage meters",
                intro: "While I am using the ChatGPT or Codex app, or a ChatGPT tab in Safari, this macOS helper displays my Codex usage on a MacBook Pro Touch Bar.",
                readMore: "Read more",
                closeDetails: "Close details",
                details: [
                    "It shows the remaining capacity in the five-hour and weekly windows, together with the next reset time. When I switch to an unrelated app or website, the Touch Bar automatically returns to its normal controls.",
                    "It runs locally with the existing Codex sign-in, so no API key or paid developer API is required. It uses no analytics, telemetry, or external database; the Safari integration checks only the URL of the current tab."
                ],
                touchBarAlt: "Touch Bar display while ChatGPT is open in Safari",
                touchBarCaption: "Touch Bar display while using ChatGPT in Safari",
                features: [
                    "Shows the remaining capacity in the Codex five-hour and weekly windows",
                    "Displays the next reset time and refreshes automatically every 30 seconds",
                    "Supports the ChatGPT and Codex desktop apps as well as Safari",
                    "Shows or restores the Touch Bar interface according to the current context"
                ],
                notice: "Requires a MacBook Pro with Touch Bar and macOS 12 or later. A signed binary is not available yet, so it currently needs to be built from source.",
                action: "View on GitHub",
                license: "MIT License"
            },
            taskManager: {
                sectionTitle: "iOS Application",
                status: "In Development",
                title: "TaskManager",
                paragraphs: [
                    "TaskManager is an iPad daily planner for writing a schedule with Apple Pencil and keeping track of time and completion. It is designed for people who plan every day and value the feeling of having shaped the day by hand.",
                    "The idea came from writing my daily tasks in Goodnotes. I want the app to feel natural for people who prefer handwriting to typing and use the act of writing to engage more intentionally with their plans.",
                    "Because relatively few task-management apps in Japan focus on handwriting, I am prioritizing clarity and everyday ease of use instead of packing in more features."
                ],
                features: [
                    "Stores handwritten plans and recognizes text written with Apple Pencil",
                    "Organizes the day into morning, afternoon, and evening with completion tracking",
                    "Accepts handwritten start and end times and schedules local notifications",
                    "Carries over unfinished tasks and provides history and backup"
                ],
                notice: "The app is currently in development and testing and is not yet available on the App Store. A download link will be added after release.",
                availability: "App Store: Not yet available"
            },
            wallpaper: {
                sectionTitle: "Web Application",
                status: "Work in Progress",
                title: "Your Feel Of Wallpaper",
                paragraphs: [
                    "A web application for exploring combinations of wallpaper and music that fit a mood or time of day, accompanied by comments from other people.",
                    "The atmosphere changes across morning, daytime, evening, and night while users browse posts by scrolling through a space with a sense of depth."
                ],
                features: [
                    "Changes the background and posts according to the time of day",
                    "Uses depth-based scrolling to explore posts",
                    "Shows wallpaper, comments, tags, and links to music services",
                    "Supports keyboard controls and Reduced Motion"
                ],
                notice: "This project is still in development. Sign-in, real posts, search, and data storage are not implemented; the current content uses mock data.",
                action: "Live Preview",
                source: "Source code: Private"
            }
        }
    }
};
