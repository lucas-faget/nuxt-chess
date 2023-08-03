<script lang="ts">
    import CustomButton from '@/components/CustomButton.vue';

	export default {
        components: { CustomButton },
        data() {
            return {
                articles: [
                    {
                        title: "Standard chess",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
						path: "/play",
                        image: "/assets/background/background.png"
                    },
                    {
                        title: "Fischer Random Chess",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
						path: "/play/960",
                        image: "/assets/background/background.png"
                    },
                    {
                        title: "Four-player chess",
                        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.",
						path: "/play/4player",
						image: "/assets/background/background.png"
                    }
                ]
            };
        }
	}
</script>

<template>
	<div class="learn">
		<article v-for="(article, index) in articles" :key="index">
            <div class="section">
                <div class="text">
                    <div class="title">{{ article.title }}</div>
                    <div class="description">{{ article.text }}</div>
                    <div style="display: flex;">
						<router-link :to="article.path">
                        	<CustomButton text="Try it out now" />
						</router-link>
                    </div>
                </div>
            </div>
            <div class="section">
                <img class="image" :src="article.image" alt="image" />
            </div>
        </article>
	</div>
</template>

<style scoped>
    .learn {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

	article {
        width: 85vw;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        gap: 60px;
    }

	@media screen and (min-width: 1000px) {
        article:nth-child(2n+1) {
			flex-direction: row;
		}

		article:nth-child(2n) {
			flex-direction: row-reverse;
		}
    }

    @media screen and (max-width: 999px) {
        .learn {
            margin-block: 60px;
            gap: 60px;
        }

        article {
            flex-direction: column;
        }
    }

    .section {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .text {
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    .image {
        width: min(100%, 520px);
        aspect-ratio: 1 / 1;
    }

    .title {
        font-size: 50px;
    }

    .description {
        color: var(--color-gray);
        font-size: 18px;
    }
</style>
