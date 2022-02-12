<template>
  <div class="home">
    <v-container>
      <v-row class="text-center">
        <v-col cols="12" class="mt-16">
          <v-textarea outlined auto-grow label="Paste doi's here (one per line)" v-model="dois"></v-textarea>
          <v-combobox outlined label="Select format (or type your own)" :items="formats" v-model="format" ref="combo"></v-combobox>
          <v-btn id="convert" color="primary" :disabled="inProgress" @click="convert">
            <v-icon v-if="inProgress">fas fa-spinner fa-spin</v-icon>
            <span v-else>Convert</span>
          </v-btn>
          <v-alert v-if="error" type="error" class="mt-8" style="white-space: pre;">{{ error }}</v-alert>
          <div v-if="result" class="mt-8">
            <v-textarea filled auto-grow :value="result"></v-textarea>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

function isResolved<T>(p: PromiseSettledResult<T>): p is PromiseFulfilledResult<T> {
  return p.status === 'fulfilled';
}

function isRejected<T>(p: PromiseSettledResult<T>): p is PromiseRejectedResult {
  return p.status === 'rejected';
}

export default Vue.extend({
  name: 'Home',
  data() {
    return {
      dois: '',
      result: '',
      format: '',
      error: null as string|null,
      inProgress: false,
      formats: [
        'apa',
        'bibtex',
        'mla',
        'nature',
        'science',
        'turabian-fullnote-bibliography',
        'vancouver',
      ],
    };
  },
  methods: {
    convertOne(doi: string, accept: string): Promise<string> {
      return fetch(`https://api.crossref.org/v1/works/${encodeURIComponent(doi)}/transform`, {
        headers: {
          Accept: accept,
        },
      }).then((res) => {
        if (!res.ok) {
          return res.text()
            .then((t) => this.handleErrorMsg(doi, t))
            .then((t) => Promise.reject(new Error(t)));
        }
        return res.text();
      }, () => {
        return Promise.reject(new Error('Failed to fetch data. Might be caused by unknown format.'));
      });
    },
    handleErrorMsg(doi: string, text: string): string {
      if (text === 'Resource not found.') {
        return `Invalid doi (${doi}).`;
      }
      return text;
    },
    convert(): void {
      // Blur combo to update the value.
      (this.$refs.combo as any).blur();
      this.$nextTick(() => {
        this.error = null;
        this.result = '';

        const dois = this.dois.split(/\r*\n+/g).filter((v) => v);
        if (!dois.length) {
          this.error = 'Provide at least one doi!';
          return;
        }
        if (!this.format) {
          this.error = 'Choose format!';
          return;
        }

        this.inProgress = true;
        const accept = this.format === 'bibtex' ? 'application/x-bibtex' : `text/x-bibliography; style=${this.format}`;
        const requests = dois.map((doi) => this.convertOne(doi, accept));
        Promise.allSettled(requests).then((results) => {
          this.error = results.filter(isRejected).map((p) => p.reason.toString()).join('\n');
          this.result = results.filter(isResolved).map((p) => p.value).join('\n');
        }, (err) => {
          this.error = err.toString();
        }).finally(() => {
          this.inProgress = false;
        });
      });
    },
  },
});
</script>

<style lang="less">
#convert {
  min-width: 200px;
}
</style>
