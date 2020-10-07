<template>
  <div class="HomePage">
    <SvgSprite></SvgSprite>

    <Nav
      :title="'Homepage'"
      @publish="onPublish"
      @preview="onPreview"
    ></Nav>

    <HomePageSection
      v-for="(section, index) in sections"
      :key="section._id"
      :index="index"
      :section="section"
      @update="onHomePageSectionUpdate"
    ></HomePageSection>

    <Toast :event-bus="toastEventBus"></Toast>
  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from 'axios';
  import SvgSprite from '../components/SvgSprite.vue';
  import Nav from '../components/Nav.vue';
  import HomePageSection from '../components/HomePageSection.vue';
  import Toast from '../components/Toast.vue';
  import clientStorage, { STORAGE_KEY } from '../services/client-storage';
  import { env } from '../env';

  // interface HomepageSection {
  //   _id: string;
  //   category: {
  //     title: string;
  //     slug: string;
  //     color: string;
  //   };
  //   articles: Array<HomepageSectionArticle>;
  //   views: {
  //     count: number;
  //   };
  // }

  export default {
    name: 'HomePage',
    components: {
      SvgSprite,
      Nav,
      HomePageSection,
      Toast,
    },
    data () {
      return {
        toastEventBus: new Vue(),
        sections: [],
      };
    },
    created () {
      this.fetchHomePageSections();
    },
    methods: {
      fetchHomePageSections () {
        return axios
          .get(`${env.API_HOST}/api/v1/homepage-section`)
          .then(response => {
            if (response.status === 200) {
              this.sections = response.data;
              console.info('homepage data', this.sections);
            } else {
              console.error('Could not get homepage sections', response);
              this.toastEventBus.$emit('message', 'Could not get homepage data');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.$emit('message', 'Could not get homepage data');
          });
      },

      onHomePageSectionUpdate ({ index, section }) {
        if (section) {
          this.sections = [
            ...this.sections.slice(0, index),
            section,
            ...this.sections.slice(index + 1)
          ];
        }
      },

      onPublish () {
        const token = clientStorage.get(STORAGE_KEY.AUTH_TOKEN);
        const updateHomepageSectionsRequests = this.sections
          .map((section) => {
            return axios.post(
              `${env.API_HOST}/api/v1/homepage-section`,
              section,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
          });

        return axios
          .all(updateHomepageSectionsRequests)
          .then(results => {
            let isSuccessful = true;
            results.forEach(sectionResult => {
              if (sectionResult.status !== 200) {
                isSuccessful = false;
              }
            });

            if (isSuccessful) {
              console.info('successfully published the Homepage', results);
              this.toastEventBus.$emit('message', 'Successfully published');
            } else {
              console.error('Failed to publish', results);
              this.toastEventBus.$emit('message', 'Failed to publish the Homepage');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.$emit('message', 'Failed to publish the Homepage');
          });
      },

      onPreview () {
        clientStorage.save(STORAGE_KEY.HOMEPAGE_DATA, this.sections);
        window.open(`${env.WWW_HOST}/homepage/preview`, '_blank');
      },
    }
  };
</script>

<style lang="scss">
  .HomePage {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.02);
  }
</style>