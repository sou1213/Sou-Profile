export const localePaths = {
    ja: {
        home: "/index.html",
        work: "/work.html",
        blog: "/blog.html",
        blogPost: "/blog/first-hackathon.html"
    },
    en: {
        home: "/en/index.html",
        work: "/en/work.html",
        blog: "/en/blog.html",
        blogPost: "/en/blog/first-hackathon.html"
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
        },
        blog: {
            title: "ブログ | 学習と開発の記録 | 高橋壮介",
            description: "高橋壮介のブログ。アプリ開発やWeb制作を通じて学んだこと、試行錯誤の過程を紹介します。",
            canonical: "https://sou-profile.pages.dev/blog"
        },
        blogPost: {
            title: "初めてのハッカソンに参加してきた！ | 高橋壮介のブログ",
            description: "初めてのハッカソンで、仲間との約束とAIによる計画づくりを組み合わせたBet And StudyのUIを作って発表した体験を綴ります。",
            canonical: "https://sou-profile.pages.dev/blog/first-hackathon"
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
        },
        blog: {
            title: "Blog | Learning & Development Notes | Sosuke Takahashi",
            description: "Notes by Sosuke Takahashi on learning through app and web development.",
            canonical: "https://sou-profile.pages.dev/en/blog"
        },
        blogPost: {
            title: "My First Hackathon | Sosuke Takahashi's Blog",
            description: "My first hackathon: how an idea from a friend's promise became the Bet And Study UI, and what I learned from presenting it.",
            canonical: "https://sou-profile.pages.dev/en/blog/first-hackathon"
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
            blog: "Blog",
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
        blog: {
            eyebrow: "Learning & Development",
            title: "BLOG",
            lead: "アプリ開発やWeb制作を通じて学んだこと、試行錯誤の過程、日々の気づきを記録していきます。",
            latestTitle: "Latest Posts",
            readArticle: "記事を読む",
            backToBlog: "記事一覧へ戻る",
            article: {
                title: "初めてのハッカソンに参加してきた！",
                excerpt: "初めてのハッカソンで、友人の一言から生まれたBet And StudyのUIを作って発表した体験を綴ります。",
                sections: [
                    {
                        heading: "「近いし、楽しそうだし！」から始まった",
                        paragraphs: [
                            "今回、初めてハッカソンに参加しました！ きっかけは「近いし行くか！ 楽しそうだし！」という、わりと勢いのある理由です。",
                            "会場の第一印象は、「学校みたいで、温かそうな雰囲気だなぁ」というものでした。ただ、当日は道に迷ってしまい、到着が遅れてしまいました……。"
                        ]
                    },
                    {
                        heading: "2日目からの参加で、いきなり緊張",
                        paragraphs: [
                            "ハッカソンは2日間あり、私は開発をする2日目だけ参加しました。到着したときには、すでにチームと役割が決まっていて、正直「これ、チームに入りづらくない？」と思いました。",
                            "一方で、作るプロダクトはまだ決まっていませんでした。そこで運営の方にも協力していただき、何を作るか相談しました。"
                        ]
                    },
                    {
                        heading: "友人の一言から生まれたアイデア",
                        paragraphs: [
                            { before: "そこで作ることにしたのが、", strong: "Bet And Study", after: "というWebアプリケーションです。" },
                            "アイデアのきっかけは、以前、基本情報技術者の資格を取りたいと言っていた友人との会話でした。「来月までに勉強して取る」と話す友人が、「もし取れなかったら、お前の口座に5万円振り込むわ！ これならいけるわ」と言ったんです。",
                            "誰かとの約束や、達成できなかったときの負担があれば、「実行しなければ」という気持ちが生まれるのかもしれない。勉強だけでなく、タスクをこなすことが苦手な人にも役立つ仕組みにできないかと考えました。",
                            "そこから、仲間との約束とAIによる計画づくりを組み合わせた、Bet And Studyのアイデアにつながりました。"
                        ]
                    },
                    {
                        heading: "残り約1時間。WebアプリのUIを作って発表へ",
                        paragraphs: [
                            "時計を見ると、残りは約1時間。「うーん、無理かな？」と思いましたが、AIの力も借りながら、Bet And StudyのUIを作成しました。システムの機能までは実装せず、発表では作成した画面を見せて、なんとか発表までたどり着きました！",
                            "ただ、話す内容や技術の選定までは詰められておらず、エンジニアらしい説明はほとんどできませんでした。人前で話すのもうまくいかず、恥ずかしかったです。"
                        ]
                    },
                    {
                        heading: "発表でもらったフィードバック",
                        paragraphs: [
                            "発表後、Google Cloudの方から「面白いけれど、法律的に問題があるかもしれない」という趣旨のフィードバックをいただきました。実は制作中にもAIから同じ懸念を指摘されていたのですが、私が「気にせず進めて」と指示していました。"
                        ]
                    },
                    {
                        heading: "また参加してみたい！",
                        paragraphs: [
                            "初めてのハッカソンは、道に迷うところから始まって、発表でうまく話せず恥ずかしい思いもしました。でも、それも含めていろいろな経験ができました。またハッカソンに参加してみたいです！",
                            "最後に、クラスメソッドの方がその後の打ち上げに誘ってくださったのも、とてもうれしかったです。ありがとうございました！"
                        ]
                    }
                ]
            }
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
            blog: "Blog",
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
        blog: {
            eyebrow: "Learning & Development",
            title: "BLOG",
            lead: "Notes on what I learn while building apps and websites, the experiments along the way, and everyday discoveries.",
            latestTitle: "Latest Posts",
            readArticle: "Read article",
            backToBlog: "Back to Blog",
            article: {
                title: "I Went to My First Hackathon!",
                excerpt: "How a friend's promise inspired Bet And Study, and how we built its UI in time for my first hackathon presentation.",
                sections: [
                    {
                        heading: "It started with ‘It's close, and it sounds fun!’",
                        paragraphs: [
                            "I joined a hackathon for the first time! The reason was fairly spontaneous: ‘It's close by, so why not? It sounds fun!’",
                            "My first impression of the venue was that it felt a bit like a school, with a warm atmosphere. I got lost on the way there, though, and arrived late…"
                        ]
                    },
                    {
                        heading: "Joining on day two was nerve-racking",
                        paragraphs: [
                            "The hackathon lasted two days, and I joined only on the second day, when development took place. By the time I arrived, teams and roles had already been decided. Honestly, I wondered how I was supposed to join a team at that point.",
                            "The product itself had not been decided yet. With help from the organizers, we talked through what to build."
                        ]
                    },
                    {
                        heading: "An idea from something a friend said",
                        paragraphs: [
                            { before: "We decided to build a web app called ", strong: "Bet And Study", after: "." },
                            "The idea came from a conversation with a friend who wanted to earn Japan's Fundamental Information Technology Engineer certification. He said he would study and pass by the following month, then added, ‘If I don't pass, I'll transfer 50,000 yen to your bank account! That'll make me do it.’",
                            "I wondered whether a promise to someone, and the cost of not following through, could create the motivation to act. Could a similar idea help people who struggle to finish tasks, not just study?",
                            "That led to Bet And Study, which combines a commitment to friends with AI-assisted planning."
                        ]
                    },
                    {
                        heading: "About an hour left: building the UI and presenting it",
                        paragraphs: [
                            "When I checked the time, about an hour remained. I thought we might not make it, but with help from AI, I built the Bet And Study UI. We did not implement the underlying features. I showed the screens in our presentation, and we made it to the finish!",
                            "We had not fully worked out what to say or which technologies to use, so I could barely give an engineer's explanation. Speaking in front of everyone did not go well either, and I felt embarrassed."
                        ]
                    },
                    {
                        heading: "Feedback after the presentation",
                        paragraphs: [
                            "Afterward, someone from Google Cloud gave us feedback to the effect that the idea was interesting but might raise legal concerns. AI had raised the same concern while I was building it, but I had told it to keep going without worrying about it."
                        ]
                    },
                    {
                        heading: "I'd like to do it again!",
                        paragraphs: [
                            "My first hackathon started with getting lost and included an awkward presentation. Even so, the whole experience taught me a lot. I'd like to join another hackathon!",
                            "Finally, I was very happy that someone from Classmethod invited me to the gathering afterward. Thank you!"
                        ]
                    }
                ]
            }
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
