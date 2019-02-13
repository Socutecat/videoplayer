class VideoPlayer {
    constructor(settings) {
        this._settings = Object.assign(VideoPlayer.DefaultSettings, settings);
    }

    init() {
        if (!this._settings.videoUrl) return console.error('Provide video Url');
        if (!this._settings.videoPlayerContainer) return console.error('Please provide video player container');

        // Создаем разметку для video
        this._addTemplate();
        // Найти все элементы управления
        this._setElements();
        // Установить обработчики событий
        this._setEvents();
    }

    toggle() {
        const method = this._video.paused ? 'play' : 'pause';
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' :  '►';
        this._video[method]();
    }

    _videoProgressHandler() {
        const percent = (this._video.currentTime / this._video.duration) * 100;
        this._progress.style.flexBasis = `${percent}%`;
    }

    _peremotka(event) {
        this._video.currentTime = (event.offsetX / this._progressContainer.offsetWidth) * this._video.duration;
    }

    _addTemplate() {
        const template = this._createVideoTemplate();
        const container = document.querySelector(this._settings.videoPlayerContainer);
        container ? container.insertAdjacentHTML('afterbegin', template) : console.error('Video container was not found');
    }

    _setElements() {
        this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
        this._video = this._videoContainer.querySelector('video');
        this._toggleBtn = this._videoContainer.querySelector('.toggle');
        this._progress = this._videoContainer.querySelector('.progress__filled');
        this._progressContainer = this._videoContainer.querySelector('.progress');
    }

    _setEvents() {
        this._video.addEventListener('click', () => this.toggle());
        this._toggleBtn.addEventListener('click', () => this.toggle());
        this._video.addEventListener('timeupdate', () => this._videoProgressHandler());
        this._progressContainer.addEventListener('click', (e) => this._peremotka(e));
    }

    _createVideoTemplate() {
        return `
        <div class="player">
            <video class="player__video viewer" src="${this._settings.videoUrl}"> </video>
            <div class="player__controls">
              <div class="progress">
              <div class="progress__filled"></div>
              </div>
              <button class="player__button toggle" title="Toggle Play">►</button>
              <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
              <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
              <button data-skip="-1" class="player__button">« 1s</button>
              <button data-skip="1" class="player__button">1s »</button>
            </div>
      </div>
        `;
    }

    static get DefaultSettings() {
        return {
            videoUrl: '',
            videoPlayerContainer: 'body',
            volume: 1
        }
    }
}


const playerInstance = new VideoPlayer({
    videoUrl: 'video/mov_bbb.mp4'
});

playerInstance.init();
