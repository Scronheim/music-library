<template>
  <div>
    <div id="player">
      <audio style="display: none" controls id="playerHtml" v-bind:src="'file:///'+currentSong.path"></audio>
    </div>
    <input type="text" class="form-control" v-model="filter" placeholder="Filter">
    <table class="table table-bordered">
      <thead>
      <th>Play</th>
      <th>Group</th>
      <th>Album</th>
      <th>Song</th>
      <th>Genre</th>
      <th>Year</th>
      </thead>
      <tbody>
      <tr v-for="(item, index) in filteredSong">
        <td>
          <button type="button" class="btn btn-success" v-on:click="play(item, index)">Play</button>
        </td>
        <td>{{ item.common.artist }}</td>
        <td>{{ item.common.album }}</td>
        <td>{{ item.common.title }}</td>
        <td><template v-for="g in item.common.genre">{{ g }}</template></td>
        <td>{{ item.common.year }}</td>
      </tr>
      </tbody>
    </table>
    <div id="footer" class="card" v-if="showPlayer">
      <!--      <img src="" class="card-img-top" alt="...">-->
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col">
              <h5 class="card-title">{{ currentSong.common.artist }}</h5>
              <p class="card-text">{{ currentSong.common.title }}</p>
            </div>
            <div class="col text-center">
              <img v-if="shuffle" src="../static/img/shuffle-on.svg" style="margin-right: 20px;cursor: pointer" width="30px" v-on:click="shuffle = !shuffle">
              <img v-else src="../static/img/shuffle-off.svg" style="margin-right: 20px;cursor: pointer" width="30px" v-on:click="shuffle = !shuffle">
              <img src="../static/img/prev-song.svg" width="30px" style="cursor: pointer" v-on:click="prevSong()" title="Previous song">
              <img v-if="currentPlayerState" class="" src="../static/img/pause.svg" width="70px" style="cursor: pointer" v-on:click="pause()" title="Pause">
              <img v-else class="" src="../static/img/play.svg" width="70px" style="cursor: pointer" v-on:click="play(currentSong)" title="Play">
              <img src="../static/img/next-song.svg" width="30px" style="cursor: pointer" v-on:click="nextSong()" title="Next song">
            </div>
            <div class="col">
              <input id="volume" class="volume" type="range" min="0" max="100" step="1" value="50" v-on:input="setVolume($event)" v-on:change="setVolume($event)"/><br/>
              Current volume: {{ player.volume*100 }}<br/>
              <input id="duration" class="volume" type="range" min="0" v-bind:max="currentSong.format.duration" step="1" value="50" v-model="player.currentTime"/><br/>
              Current time: {{ currentSongTime }}/{{ currentSongDuration }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import 'bootstrap';
    import 'bootstrap/dist/css/bootstrap.min.css';
    import glob from 'glob';
    import * as mm from 'music-metadata';
    import _ from 'lodash';
    import moment from 'moment';

    export default {
        name: 'app',
        computed: {
            filteredSong: function () {
                let self = this;
                return this.humanFileList.filter(
                    function (o) {
                        return ((self.filter === '') || ((o.common.artist.toUpperCase().indexOf(self.filter.toUpperCase()) >= 0))
                            || (o.common.title.toUpperCase().indexOf(self.filter.toUpperCase()) >= 0)
                            || (o.common.album.toUpperCase().indexOf(self.filter.toUpperCase()) >= 0)
                        )
                    }
                )
            },
        },
        data() {
            return {
                pathToMusic: 'E:\\MuSIC\\Rammstein\\',
                fileList: [],
                humanFileList: [],
                filter: '',
                player: '',
                volume: '',
                currentSong: {},
                currentPlayerState: false,
                currentSongTime: '',
                currentSongDuration: '',
                showPlayer: false,
                showHtmlPlayer: false,
                shuffle: false,
            }
        },
        methods: {
            play(song, index) {
                this.currentSong = song;
                this.currentSong.index = index;
                this.currentSongDuration = moment.utc(this.currentSong.format.duration*1000).format('mm:ss');
                this.currentSongTime = moment.utc(this.currentSong.format.duration*1000).format('mm:ss');
                this.player = document.getElementById('playerHtml');
                this.volume = document.getElementById('volume');
                setTimeout(() => {
                    this.player.play();
                    this.currentPlayerState = true;
                    this.showPlayer = true;
                }, 100);
                setInterval(() => {
                    this.currentSongTime = moment.utc(this.player.currentTime*1000).format('mm:ss');
                }, 500);
            },
            pause() {
                this.player.pause();
                this.currentPlayerState = false;
            },
            nextSong() {
                if (this.shuffle) {
                    let random = _.random(0, this.humanFileList.length);
                    this.currentSong = this.humanFileList[random];
                    this.currentSong.index = random;
                    setTimeout(() => {
                        this.player.play();
                    }, 100);
                } else {
                    let index = this.currentSong.index;
                    this.currentSong = this.humanFileList[index + 1];
                    this.currentSong.index = index + 1;
                    setTimeout(() => {
                        this.player.play();
                    }, 100);
                }
            },
            prevSong() {
                let index = this.currentSong.index;
                this.currentSong = this.humanFileList[index-1];
                this.currentSong.index = index-1;
                setTimeout(() => {
                    this.player.play();
                }, 100);
            },
            setVolume(event) {
                this.player.volume = event.target.value / 100;
                this.$forceUpdate();
            },
            async parseFiles(audioFiles) {
                for (const audioFile of audioFiles) {
                    // await will ensure the metadata parsing is completed before we move on to the next file
                    await mm.parseFile(audioFile)
                        .then((metadata) => {
                            metadata.path = audioFile;
                            this.humanFileList.push(metadata);
                        });
                }
            }
        },
        mounted () {
            let pattern;
            if (process.platform === "win32") {
                pattern = `${this.pathToMusic}\**\\*.mp3`;
            } else if (process.platform === "linux") {
                pattern = `${this.pathToMusic}**/*.mp3`;
            }
            glob(pattern, ((error, files) => {
                this.fileList = files;
                this.parseFiles(files);
            }));
        }
    }
</script>

<style scoped>
  @import url(https://fonts.googleapis.com/css?family=Raleway:500);
  #footer {
    position: sticky;
    bottom: 0;
    width: 100%;
  }
  #player i {
    position: absolute;
    margin-top: -6px;
    color: #666;
  }
  #player i.fa-volume-down {
    margin-left: -8px;
  }
  #player i.fa-volume-up {
    margin-right: -8px;
    right: 0;
  }

  .volume {
    position: absolute;
    left: 24px;
    margin: 0 auto;
    height: 5px;
    width: 300px;
    background: #555;
    border-radius: 15px;
  }

</style>
