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
  import emitter from 'mitt';
  import SvgSprite from '../components/SvgSprite.vue';
  import Nav from '../components/Nav.vue';
  import HomePageSection from '../components/HomePageSection.vue';
  import Toast from '../components/Toast.vue';
  import clientStorage, { STORAGE_KEY } from '../services/client-storage';
  import { env } from '../env';
  import { gqlQuery, gqlMutation } from '../services/gql-service';

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
        toastEventBus: emitter(),
        sections: [],
      };
    },
    created () {
      this.fetchHomePageSections();
    },
    methods: {
      fetchHomePageSections () {
        return gqlQuery(`
          homepageSections {
            _id
            articles {
              _id
              title
              slug
              image {
                url
                description
                credits
              }
              keywords {
                slug
              }
              views {
                count
              }
              publication_date
            }
            category {
              title
              slug
              color
            }
            order
          }
        `)
        .then(data => {
          if (data && data.homepageSections) {
            this.sections = data.homepageSections;
            console.info('homepage data', this.sections);
          } else {
            console.error('Could not get homepage sections', data);
            this.toastEventBus.emit('message', 'Could not get homepage data');
          }
        })
        .catch(error => {
          console.error(error);
          this.toastEventBus.emit('message', 'Could not get homepage data');
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
        return Promise.all(
          this.sections.map((section) => {
            return gqlMutation(`
              updateHomepageSection (
                id: "${section._id}",
                articleIds: [${section.articles.map(article => `"${article._id}"`).toString()}]
              ) {
                _id
              }
            `)
              .then(data => data?.updateHomepageSection);
          })
        )
          .then(updatedSections => {
            const allSuccessful = updatedSections.every(section => !!section._id);

            if (allSuccessful) {
              console.info('successfully published the Homepage', updatedSections);
              this.toastEventBus.emit('message', 'Successfully published');
            } else {
              console.error('Failed to publish', updatedSections);
              this.toastEventBus.emit('message', 'Failed to publish the Homepage');
            }
          })
          .catch(error => {
            console.error(error);
            this.toastEventBus.emit('message', 'Failed to publish the Homepage');
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