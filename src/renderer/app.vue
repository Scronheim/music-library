<template>
  <div>
    <div id="player">
      <audio style="display: none" controls id="playerHtml" v-bind:src="'file:///'+currentSong.path"></audio>
    </div>
    <input type="text" class="form-control" v-model="filter" placeholder="Filter">
    <table class="table table-bordered" v-if="showTable">
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
      <div class="card-body">
        <div class="row">
          <div class="col-1">
            <img v-bind:src="getPicture" class="img-thumbnail">
          </div>
          <div class="col-3">
            <h5 class="card-title">{{ currentSong.common.artist }}</h5>
            <p class="card-text">{{ currentSong.common.title }} ({{ currentSong.common.album }})</p>
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
</template>

<script>
  import 'bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import glob from 'glob';
  import * as mm from 'music-metadata';
  import _ from 'lodash';
  import moment from 'moment';
  const sqlite = require('sqlite3').verbose();

  import no_cover from '../static/img/no-cover.png';

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
      getPicture() {
        if (this.currentSong.common.hasOwnProperty('picture')) {
          let u8 = new Uint8Array(this.currentSong.common.picture[0].data);
          let blob = new Blob([u8], {'type': 'image/png'});
          return URL.createObjectURL(blob); //possibly `webkitURL` or another vendor prefix for old browsers.
        } else {
          return no_cover;
        }
      },
    },
    data() {
      return {
        pathToMusic: 'E:\\MuSIC\\Cypecore\\',
        humanFileList: [],
        filter: '',
        player: '',
        volume: '',
        db: null,
        dbResult: null,
        currentSong: {},
        currentPlayerState: false,
        currentSongTime: '',
        currentSongDuration: '',
        showPlayer: false,
        showHtmlPlayer: false,
        showTable: false,
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
          if (this.currentSong === undefined) {
            index = -1
          }
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
                this.db.run('INSERT INTO music(data) VALUES(?)', [metadata]);
                this.humanFileList.push(metadata);
              });
        }
      }
    },
    mounted () {
      this.db = new sqlite.Database('src/music.db', (error) => {
        if (error) {
          console.log(error.message);
        }
      });
      let pattern;
      if (process.platform === "win32") {
        pattern = `${this.pathToMusic}\**\\*.mp3`;
      } else if (process.platform === "linux") {
        pattern = `${this.pathToMusic}**/*.mp3`;
      }
      glob(pattern, ((error, files) => {
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
