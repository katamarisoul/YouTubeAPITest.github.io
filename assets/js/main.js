import { YouTubePlayerAPI } from "./utils/YouTubePlayerAPI .js";

document.addEventListener('DOMContentLoaded', () => {
    const targetElements = document.querySelectorAll('.js-youtube');
    const iframeElements = document.querySelectorAll('.js-youtube-player');

    const players = new YouTubePlayerAPI(iframeElements, {
        onPlayerReady: (event) => {
            const target = event.target;
            const targetElement = target.g;
            const videoTitle = target.videoTitle;
            targetElement.inert = true;
            const buttonElement = targetElement.parentElement.querySelector('.js-youtube-play-trigger');
            buttonElement.setAttribute('aria-label', `ビデオ：${videoTitle}を再生する`);
        }
    });

    targetElements.forEach((targetElement, index) => {
        const buttonElement = targetElement.querySelector('.js-youtube-play-trigger');
        const thumbnailElement = targetElement.querySelector('.js-youtube-thumbnail');

        buttonElement.addEventListener('click', () => {
            buttonElement.classList.add('is-hidden');
            thumbnailElement.classList.add('is-hidden');
            buttonElement.inert = true;
            players.play(index);
            const iframeElement = players.getIframe(index);
            iframeElement.inert = false;
            iframeElement.focus();
        });
    });
});
