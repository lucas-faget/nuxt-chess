<script lang="ts">
import CustomButton from "../components/CustomButton.vue";

export default {
    components: { CustomButton },
    data() {
        return {
            articles: [
                {
                    title: "Standard Chess",
                    text: "Chess is a board game for two players, called White and Black, each controlling an army of chess pieces, with the objective to checkmate the opponent's king.",
                    path: "/play",
                    image: "/assets/image/chessboard.jpg",
                    imageClass: "image-class-1",
                },
            ],
        };
    },
};
</script>

<template>
    <div class="articles">
        <article v-for="(article, index) in articles" :key="index">
            <div class="section">
                <div class="section-header">
                    <div class="title">{{ article.title }}</div>
                </div>
                <div class="section-content">
                    <div class="text">{{ article.text }}</div>
                    <div class="flex">
                        <router-link :to="article.path">
                            <CustomButton text="Try it out now" />
                        </router-link>
                    </div>
                </div>
            </div>
            <div class="section">
                <img
                    :class="['image', article.imageClass ?? '']"
                    :src="article.image"
                    alt="image"
                />
            </div>
        </article>
    </div>
</template>

<style scoped>
.image {
    width: min(100%, 520px);
}

.image-class-1 {
    border-radius: 50%;
    box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.3);
}
</style>
