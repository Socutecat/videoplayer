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
        this._toggleBtn.textContent = this._video.paused ? '❚ ❚' : '►';
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

    ///обработка громкости звука
    _musicChange() {
        this._video.volume = this._volume.value;
    }

    //обработка скорости воспроизведения видео
    _playbackChange() {
        this._video.playbackRate = this._playback.value;
    }


    /**
     * обработка скипа видео
     * @param {*} event 
     */
    _onSkipChange(event) {
        console.log(event);
        this._seek(Number(event.target.dataset.skip));
    }


    // метод указывает на кол-во секунд скипа
    _seek(secs) {
        this._video.currentTime += secs;
    }

    // UI элементы
    _setElements() {
        this._videoContainer = document.querySelector(this._settings.videoPlayerContainer);
        this._video = this._videoContainer.querySelector('video');
        this._toggleBtn = this._videoContainer.querySelector('.toggle');
        this._progress = this._videoContainer.querySelector('.progress__filled');
        this._progressContainer = this._videoContainer.querySelector('.progress');
        this._volume = this._videoContainer.querySelector('input[name=volume]');
        this._playback = this._videoContainer.querySelector('input[name=playbackRate]');
        this._skipsBtn = this._videoContainer.querySelectorAll('[data-skip]');
    }
    // инициализируем события 
    _setEvents() {
        this._video.addEventListener('click', () => this.toggle());
        this._toggleBtn.addEventListener('click', () => this.toggle());
        this._video.addEventListener('timeupdate', () => this._videoProgressHandler());
        this._progressContainer.addEventListener('click', (e) => this._peremotka(e));


        // вешаем обработчик и слушаем изменение громкости звука
        this._volume.addEventListener('click', () => this._musicChange());


        // вешаем обработчик и слушаем изменение скорости воспроизведение видео
        this._playback.addEventListener('change', () => this._playbackChange());

        // перебираем массив кнопок, вешаем обработчик и слушаем скип.
        this._skipsBtn.forEach(button => button.addEventListener('click', (e) => this._onSkipChange(e)));
    }


        // создаем новый шаблон видео разметки
    _createVideoTemplate() {
        return `
        <div class="player">
            <video class="player__video viewer" src="${this._settings.videoUrl}" > </video>
            <div class="player__controls">
              <div class="progress">
              <div class="progress__filled"></div>
              </div>
              <button class="player__button toggle" title="Toggle Play">►</button>
              <input type="range" name="volume" class="player__slider" min=0 max="1" step="0.05" value="${this._settings.volume}">
              <input type="range" name="playbackRate" class="player__slider" min="0.5" max="2" step="0.1" value="1">
              <button data-skip="-${this._settings.skip}" class="player__button">« ${this._settings.skip}s</button>
              <button data-skip="${this._settings.skip}" class="player__button">${this._settings.skip}s »</button>
            </div>
      </div>
        `;
    }
    // дефолтные настройки
    static get DefaultSettings() {
        return {
            videoUrl: '',
            videoPlayerContainer: 'body',
            volume: 1,
            skip: 2
        }
    }
}


const playerInstance = new VideoPlayer({
    videoUrl: 'video/mov_bbb.mp4'
});

playerInstance.init();