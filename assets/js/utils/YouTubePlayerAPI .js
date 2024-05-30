
export class YouTubePlayerAPI {
    constructor(nodeList, options = {}) {
        this._iframeElements = nodeList;
        this._playerArray = [];
        this._options = {
            onPlayerReady: options.onPlayerReady ? options.onPlayerReady : () => {}
        }

        this.#initialize();
    }

    #initialize() {
        // 条件を満たした場合、APIを追加
        this.#addYoutubeAPI();

        // APIの準備が完了したら発火
        window.onYouTubeIframeAPIReady = () => {
            this._iframeElements.forEach(iframeElement => {
                const videoId = iframeElement.dataset.videoId;
                const player = this.#createPlayer(iframeElement, videoId);
                this._playerArray.push(player);
            });
        }
    }

    /**
     * ページ読み込み時に条件を満たした場合、APIを追加するメソッド
     * @private
     */
    #addYoutubeAPI() {
        // iframeに変更する要素が存在するかつ、YouTube Player APIが埋め込まれていない場合
        if(this._iframeElements.length > 0 && !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            // 新しいscript要素を生成
            const scriptElement = document.createElement("script");
            // script要素のsrc属性にYouTube Player APIを設定
            scriptElement.src = "https://www.youtube.com/iframe_api";
            // ページ内の最初のscript要素を取得
            const firstScriptElement = document.getElementsByTagName("script")[0];
            // 生成したscript要素を最初のscript要素の前に挿入
            firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement);
        }
    }

    #createPlayer(iframeElement, videoId) {
        return new YT.Player(iframeElement, {
            width: "560",
            height: "315",
            videoId: videoId,
            // 「playerVars」に設定できる値
            // https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5&hl=ja
            playerVars: {
                rel: 0, // 関連動画を非表示
                playsinline: 1, // iOS時はインライン再生
            },
            events: {
                // プレーヤーの読み込み後に発火
                onReady: event => this._options.onPlayerReady(event),
            },
        });
    }

    /**
     * プレイヤーを再生するメソッド
     * @public
     */
    play(index) {
        if(this._playerArray) this._playerArray[index].playVideo();
    }

    /**
     * プレイヤーを停止するメソッド
     * @public
     */
    pause(index) {
        if(this._playerArray) this._playerArray[index].pauseVideo();
    }

    getIframe(index) {
        if(this._playerArray) return this._playerArray[index].getIframe();
    }
}
