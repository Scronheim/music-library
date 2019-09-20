<template>
    <div>
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
                    <button type="button" class="btn btn-success" v-on:click="play(item.path)">Play</button>
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
    </div>
</template>

<script>
  import 'bootstrap';
  import 'bootstrap/dist/css/bootstrap.min.css';
  import glob from 'glob';
  import * as mm from 'music-metadata';
  import _ from 'lodash';
  const { createAudio } = require('node-mp3-player');
  const Audio = createAudio();

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
        pathToMusic: '/media/scronheim/Music/',
        fileList: [],
        humanFileList: [],
        filter: '',
        audio: ''
      }
    },
    methods: {
      async play(path) {
        const myFile = Audio(path)
        console.log(myFile.volume())
      },
      stop() {

      }
    },
    created () {
      glob(this.pathToMusic + '**/*.mp3', ((error, files) => {
        this.fileList = files;
        _.forEach(this.fileList, ((value, key) => {
          mm.parseFile(value)
            .then((metadata) => {
              metadata.path = value
              this.humanFileList.push(metadata);
            })
        }))
      }));
    }
  }
</script>

<style scoped>

</style>
