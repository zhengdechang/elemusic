<template>
    <div class="wrapper-singer">
        <router-link :to="{ path: '/artist', query: { id: item.id }}"  class="artists_item hover" :key="item.id" v-for="item in artists_list">
            <div class="faceImg">
                <el-image :src="item.picUrl + '?param=120y120'">
                    <div slot="placeholder" class="image-slot">
                        <i class="iconfont icon-placeholder"></i>
                    </div>
                </el-image>
            </div>
            <div class="info">
                <div class="name">{{item.name}}</div>
                <div class="albumSize">专辑：{{item.albumSize}}</div>
            </div>
        </router-link>
    </div>
</template>

<script>
    export default {
        name: "IndexSInger",
        props:['artists_list'],
    }
</script>

<style scoped lang="scss">
    .mv_list{
        margin: 0 30px;
    }
    .album_list{
        margin: 0 15px -10px 15px;
    }
    .home {
        margin-top: 90px - 10px;
        .section {
            width: 100%;
            margin-top: 20px;
            padding: 0 120px 50px 120px;
            background-color: #ffffff;
            box-sizing: border-box;
            .section-title {
                height: 60px;
                line-height: 60px;
                padding-top: 10px;
                font-size: 28px;
                font-weight: 500;
                text-align: center;
                color: #000000;
                box-sizing: border-box;
            }
        }
    }
    .recom_list{
        margin-left: 35px;
        margin-right: 15px;
    }
    .h_title {
        padding: 20px 0 0;
        text-align: center;

        h3 {
            padding: 20px 0;
            font-size: 28px;
            font-weight: 700;
        }

        span {
            display: inline-block;
            font-size: 16px;
            margin: 0 24px;
            color: #333;
            cursor: pointer;

            &.active {
                position: relative;
                font-weight: 600;
                color: #000;
                &:after {
                    position: absolute;
                    content: "";
                    left: 0;
                    bottom: 1px;
                    width: 100%;
                    height: 6px;
                    background:#d9d9d9;
                    z-index: -1;
                }
            }
        }
    }

    .wrapper-singer {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin:0 80px !important;
        /*margin:0 60px !important;*/
        margin-left: 13px !important;
        margin-right: 85px !important;
    }

    .toplist_item {
        position: relative;
        margin-bottom: 30px;

        .coverImg {
            position: absolute;
            top: 0;
            right: 30px;
            left: 30px;
            z-index: 0;
            height: 100% !important;

            &::before {
                position: absolute;
                top: 0;
                left: 0;
                z-index: 0;
                content: '';
                width: 100%;
                height: 100%;
            }

            ::v-deep img {
                filter: blur(60px);
                transform: scale(1.5);
            }
        }

        .toplist_wrapper {
            position: relative;
            z-index: 0;
        }

        &:hover {
            ::v-deep img {
                transform: scale(2);
            }
        }
    }

    .toplist_wrapper {
        padding: 30px 40px;
        height: 505px;

        .toplist_hd {
            position: relative;
            font-size: 24px;
            text-align: center;
            color: #fff;

            &::after {
                display: inline-block;
                content: '';
                position: absolute;
                bottom: -30px;
                left: 0;
                right: 0;
                width: 30px;
                height: 2px;
                margin: 0 auto;
                background-color: #fff;
            }
        }

        .toplist_songlist {
            padding-top: 80px;
        }

        .songitem {
            display: flex;
            padding-bottom: 20px;
            color: #fff;

            .songnum {
                padding-right: 10px;
                font-size: 18px;
            }

            .song_title {
                line-height: 24px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;
                padding-bottom: 5px;
                font-size: 14px;
                color: #fff;
            }

            .song_author {
                display: block;
                font-size: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
                word-break: break-all;

                a {
                    display: inline-block;
                    line-height: 20px;
                    font-size: 14px;
                    color: #fff;
                }
            }

            &:last-child {
                padding-bottom: 0;
            }
        }
    }

    .artists_item {
        width: 120px;
        margin-left: 50px;

        .el-image {
            transition: all .4s linear;
        }

        &:hover {
            .el-image {
                transform: rotateY(180deg);
            }
        }

        .faceImg {
            width: 120px;
            height: 120px;
            border-radius: 100%;
            overflow: hidden;
        }
    }
    .info {
        text-align: center;

        .name {
            line-height: 28px;
            font-size: 14px;
        }

        .albumSize {
            color: #999;
        }
    }

    .artists_list {
        padding-bottom: 40px;
        margin-bottom: 50px;
        margin-left: 35px;
        margin-right: 10px;
    }

    .toplist_img{
        height: 600px;
    }
    .toplist_img{
        height: 600px;
    }
    a {
        text-decoration: none;
        color: #333;
    }

    .hover:hover{
        color: #25c34eb8;
    }

</style>
