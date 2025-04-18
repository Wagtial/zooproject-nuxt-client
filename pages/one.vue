<template>
  <q-page class="q-pa-md">
    <!-- Header -->
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="https://zoo-project.org/img/zoo-sun-logo.png" alt="Logo">
          </q-avatar>
          {{ providerName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Main Content -->
    <main>
      <h1>{{ pageTitle }}</h1>
      <p v-if="description">{{ description }}</p>

      <!-- Inputs Section -->
      <q-form @submit="onSubmit" class="q-gutter-md">
        <h3>Inputs</h3>
        <q-card v-for="(input, index) in inputs" :key="index" class="q-mb-md">
          <q-card-section>
            <div class="text-h6">{{ input.title }}</div>
            <p>{{ input.description }}</p>
            <q-input v-model="input.value" :label="input.title" :required="input.required" />
          </q-card-section>
        </q-card>

        <!-- Outputs Section -->
        <h3>Outputs</h3>
        <q-card v-for="(output, index) in outputs" :key="index" class="q-mb-md">
          <q-card-section>
            <div class="text-h6">{{ output.title }}</div>
            <p>{{ output.description }}</p>
            <q-select v-model="output.format" :options="output.formats" label="Format" />
          </q-card-section>
        </q-card>

        <!-- Execution Options -->
        <h3>Execution Options</h3>
        <q-card class="q-mb-md">
          <q-card-section>
            <q-select v-model="executionMode" :options="['async', 'sync']" label="Mode" />
          </q-card-section>
        </q-card>

        <q-btn type="submit" color="primary" label="Submit" />
      </q-form>

      <!-- Jobs Table -->
      <q-table
        v-if="jobs.length > 0"
        :rows="jobs"
        :columns="jobColumns"
        row-key="jobID"
        class="q-mt-md"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn-dropdown color="primary" label="Actions">
              <q-list>
                <q-item clickable v-close-popup @click="deleteJob(props.row)">
                  <q-item-section>Delete</q-item-section>
                </q-item>
                <q-item clickable v-close-popup @click="viewJob(props.row)">
                  <q-item-section>View</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </q-td>
        </template>
      </q-table>
    </main>

    <!-- Footer -->
    <footer class="q-mt-md text-muted">
      Powered by <a href="http://www.zoo-project.org/" target="_blank">ZOO-Project</a>
    </footer>

    <!-- Modal for Job Details -->
    <q-dialog v-model="showModal">
      <q-card>
        <q-card-section>
          <div class="text-h6">Job Details</div>
        </q-card-section>
        <q-card-section>
          <pre>{{ selectedJob }}</pre>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      providerName: 'Provider Name',
      pageTitle: 'Landing Page',
      description: '',
      inputs: [],
      outputs: [],
      executionMode: 'async',
      jobs: [],
      jobColumns: [
        { name: 'jobID', label: 'Job ID', field: 'jobID' },
        { name: 'message', label: 'Message', field: 'message' },
        { name: 'actions', label: 'Actions', field: 'actions' }
      ],
      showModal: false,
      selectedJob: null
    };
  },
  methods: {
    onSubmit() {
      // Handle form submission
      console.log('Form submitted');
    },
    deleteJob(job) {
      // Handle job deletion
      console.log('Deleting job:', job);
    },
    viewJob(job) {
      this.selectedJob = job;
      this.showModal = true;
    }
  },
  mounted() {
    // Fetch data from API or other sources
    this.inputs = [
      { title: 'Input 1', description: 'Description for Input 1', value: '', required: true },
      { title: 'Input 2', description: 'Description for Input 2', value: '', required: false }
    ];
    this.outputs = [
      { title: 'Output 1', description: 'Description for Output 1', format: '', formats: ['JSON', 'XML'] },
      { title: 'Output 2', description: 'Description for Output 2', format: '', formats: ['CSV', 'TXT'] }
    ];
    this.jobs = [
      { jobID: '123', message: 'Job completed successfully' },
      { jobID: '456', message: 'Job failed' }
    ];
  }
};
</script>

<style scoped>
/* Add custom styles here */
</style>