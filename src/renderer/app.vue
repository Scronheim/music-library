<template>
  <div>
    <audio style="display: none" controls id="playerHtml" v-bind:src="'file:///'+currentPath"></audio>
    <input type="text" class="form-control" v-model="filter">
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
      <tr v-for="item in filteredSong">
        <td>
          <button type="button" class="btn btn-success" v-on:click="play(item)">Play</button>
          <button type="button" class="btn btn-danger" v-on:click="stop()">Stop</button>
        </td>
        <td>{{ item.common.artist }}</td>
        <td>{{ item.common.album }}</td>
        <td>{{ item.common.title }}</td>
        <td><template v-for="g in item.common.genre">{{ g }}</template></td>
        <td>{{ item.common.year }}</td>
      </tr>
      </tbody>
    </table>
    <div id="footer" class="card" v-show="showPlayer">
      <!--      <img src="" class="card-img-top" alt="...">-->
      <div class="card-body">
        <div class="container">
          <div class="row">
            <div class="col">
              <h5 class="card-title">{{ currentSong.common.artist }}</h5>
              <p class="card-text">{{ currentSong.common.title }}</p>
            </div>
            <div class="col text-center">
              <img v-if="currentPlayerState" class="" src="../static/img/pause.svg" width="70px"  v-on:click="stop()">
              <img v-else class="" src="../static/img/play.svg" width="70px"  v-on:click="play(currentSong)">
            </div>
            <div class="col">
              <input id="volume" type="range" min="0" max="100" step="1" value="100" v-on:input="setVolume($event)" v-on:change="setVolume($event)"/>
              Current volume: {{ player.volume*100 }}
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
                pathToMusic: 'E:\\MuSIC\\',
                fileList: [],
                humanFileList: [],
                filter: '',
                player: '',
                volume: '',
                currentPath: '',
                currentSong: {
                    common: {
                        artist: '',
                        album: '',
                        title: ''
                    }
                },
                currentPlayerState: false,
                showPlayer: false,
                showHtmlPlayer: false
            }
        },
        methods: {
            play(song) {
                this.currentSong = song;
                this.currentPath = song.path;
                this.player = document.getElementById('playerHtml');
                this.volume = document.getElementById('volume');
                setTimeout(() => {
                    this.player.play();
                    this.player.volume = 1;
                    this.currentPlayerState = true;
                    this.showPlayer = true;
                }, 100);
            },
            stop() {
                this.player.pause();
                this.currentPlayerState = false;
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
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  body {
    background: #2a2a2a;
    font-family: Raleway,serif;
  }

  h1 {
    text-align: center;
    font-size: 34px;
    padding-top: 40px;
    color: #FFF;
  }
  #player {
    width: 350px;
    height: 50px;
    position: relative;
    margin: 0 auto;
    top: 30px;
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

  #volume {
    position: absolute;
    left: 24px;
    margin: 0 auto;
    height: 5px;
    width: 300px;
    background: #555;
    border-radius: 15px;
  }
  #volume .ui-slider-range-min {
    height: 5px;
    width: 300px;
    position: absolute;
    background: #2ecc71;
    border: none;
    border-radius: 10px;
    outline: none;
  }
  #volume .ui-slider-handle {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    background: #FFF;
    position: absolute;
    margin-left: -8px;
    margin-top: -8px;
    cursor: pointer;
    outline: none;
  }

</style>
