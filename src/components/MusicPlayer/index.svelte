<!--
  MusicPlayer.svelte - 音乐播放器组件
  从Mizuki项目移植，支持本地和网络音乐播放
-->
<script lang="ts">
// 导入 Svelte 的生命周期函数和过渡效果
import { onDestroy, onMount } from "svelte";
import { slide } from "svelte/transition";

// 音乐播放器配置
import musicPlayerConfig from "../../config/music";

// 播放器模式，可选 "local" 或 "meting"，从本地配置中获取或使用默认值 "meting"
let mode = musicPlayerConfig.mode ?? "meting";
// Meting API 地址，从配置中获取或使用默认地址
let meting_api =
	musicPlayerConfig.meting_api ??
	"https://www.bilibili.uno/api?server=:server&type=:type&id=:id&auth=:auth&r=:r";
// Meting API 的 ID，从配置中获取或使用默认值
let meting_id = musicPlayerConfig.id ?? "14164869977";
// Meting API 的服务器，从配置中获取或使用默认值,有的meting的api源支持更多平台,一般来说,netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
let meting_server = musicPlayerConfig.server ?? "netease";
// Meting API 的类型，从配置中获取或使用默认值
let meting_type = musicPlayerConfig.type ?? "playlist";
// 播放状态，默认为 false (未播放)
let isPlaying = false;
// 播放器是否展开，默认为 false
let isExpanded = false;
// 播放器是否隐藏，默认为 true (最小化状态)
let isHidden = true;
// 是否显示播放列表，默认为 false
let showPlaylist = false;
// 当前播放时间，默认为 0
let currentTime = 0;
// 歌曲总时长，默认为 0
let duration = 0;
// 音量，默认为 0.7
let volume = 0.7;
// 是否静音，默认为 false
let isMuted = false;
// 是否正在加载，默认为 false
let isLoading = false;
// 是否随机播放，默认为 false
let isShuffled = false;
// 循环模式，0: 不循环, 1: 单曲循环, 2: 列表循环，默认为 0
let isRepeating = 0;
// 错误信息，默认为空字符串
let errorMessage = "";
// 是否显示错误信息，默认为 false
let showError = false;

// 当前歌曲信息
let currentSong = {
	title: "示例歌曲",
	artist: "示例艺术家",
	cover: "/sakura.png",
	url: "",
	duration: 0,
};

let playlist = [];
let currentIndex = 0;
let audio: HTMLAudioElement;
let progressBar: HTMLElement;
let volumeBar: HTMLElement;

const localPlaylist = [
    {
		id: 1,
		title: "だんご大家族",
		artist: "茶太",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music6/v4/d7/fb/e9/d7fbe9a3-8c0e-37c6-5908-2b4528746124/4933032004868_cover.png/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E3%81%A0%E3%82%93%E3%81%94%E5%A4%A7%E5%AE%B6%E6%97%8F%20-%20%E8%8C%B6%E5%A4%AA.flac",
		duration: 273,
	},
    {
		id: 2,
		title: "Beautiful World (Da Capo Version)",
		artist: "宇多田ヒカル",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e2/2c/0d/e22c0db8-27f6-7dc3-2d49-3a6e95e827fb/4547366488920.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/Beautiful%20World%20(Da%20Capo%20Version)%20-%20%E5%AE%87%E5%A4%9A%E7%94%B0%E3%83%92%E3%82%AB%E3%83%AB.flac",
		duration: 358,
	},
    {
		id: 3,
		title: "One Last Kiss",
		artist: "宇多田ヒカル",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/e2/2c/0d/e22c0db8-27f6-7dc3-2d49-3a6e95e827fb/4547366488920.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/One%20Last%20Kiss%20-%20%E5%AE%87%E5%A4%9A%E7%94%B0%E3%83%92%E3%82%AB%E3%83%AB.flac",
		duration: 252,
	},
    {
		id: 4,
		title: "Style",
		artist: "Taylor Swift",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/69/32/41/69324127-ac8b-eca6-c749-a93b34692eb6/00602537993765.rgb.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/Style%20-%20Taylor%20Swift.flac",
		duration: 231,
	},
    {
		id: 5,
		title: "ふわふわ時間",
		artist: "桜高軽音部",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/25/62/c3/mzi.inqpijjq.jpg/592x592bf.webp",
		url: "https://pb.xiaozhangya.xin/music/%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%E6%99%82%E9%96%93%20-%20%E6%A1%9C%E9%AB%98%E8%BB%BD%E9%9F%B3%E9%83%A8.flac",
		duration: 239,
	},
    {
		id: 6,
		title: "みちしるべ（路标）",
		artist: "茅原実里",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/75/c8/c4/75c8c47c-caff-649b-82a2-081d8a80d23a/4540774147137.png/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E3%81%BF%E3%81%A1%E3%81%97%E3%82%8B%E3%81%B9%20-%20%E8%8C%85%E5%8E%9F%E5%AE%9F%E9%87%8C.flac",
		duration: 286,
	},
    {
		id: 7,
		title: "青花瓷",
		artist: "周杰伦",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/b8/83/7f/b8837f2a-324a-f6ad-ff5a-0805e9210181/JAY.jpg/592x592bf.webp",
		url: "https://pb.xiaozhangya.xin/%E9%9D%92%E8%8A%B1%E7%93%B7.wav",
		duration: 237,
	},
    {
        id: 8,
        title: "发如雪",
        artist: "周杰伦",
        cover: "https://y.qq.com/music/photo_new/T002R300x300M0000024bjiL2aocxT_5.jpg?max_age=2592000",
        url: "https://music.904002.xyz/%E5%91%A8%E6%9D%B0%E4%BC%A6/发如雪.flac",
        duration: 240
    },
    {
       id: 9,
       title: "Love Story",
       artist: "Taylor Swift",
       cover: "https://is1-ssl.mzstatic.com/image/thumb/Video124/v4/7d/a3/88/7da388ea-28b6-acde-a2db-3586884bd28e/Job8bd8b474-05f4-47aa-b79e-7876585e3a01-110587237-PreviewImage_preview_image_nonvideo_sdr-Time1617126173244.png/592x592bb.webp",
       url: "https://pb.xiaozhangya.xin/music/Love%20Story%20(Taylor%E2%80%99s%20Version)%20-%20Taylor%20Swift.flac",
       duration: 235,
    },
	{
		id: 10,
		title: "アゲイン",
		artist: "横山克",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music124/v4/cc/80/bb/cc80bb6b-3f30-a9e5-d01c-b6b8bc787dc8/jacket_SVWC70044B00Z_550.jpg/592x592bf.webp",
		url: "https://pb.xiaozhangya.xin/music/%E3%82%A2%E3%82%B2%E3%82%A4%E3%83%B3%20-%20%E6%A8%AA%E5%B1%B1%E5%85%8B.flac",
		duration: 151,
	},
	{
		id: 11,
		title: "可惜没如果",
		artist: "林俊杰",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/57/5a/1b/575a1bc9-ca86-7549-e873-b55663ba6276/4711508105925.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E5%8F%AF%E6%83%9C%E6%B2%A1%E5%A6%82%E6%9E%9C%20-%20%E6%9E%97%E4%BF%8A%E6%9D%B0.mp3",
		duration: 292,
	},
    {
		id: 12,
		title: "天使にふれたよ!",
		artist: "放課後ティータイム",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/1f/4e/c7/1f4ec74e-53e5-f6da-9edd-04c003d55c95/mzi.ukjnjknz.png/592x592bf.webp",
		url: "https://pb.xiaozhangya.xin/music/%E5%A4%A9%E4%BD%BF%E3%81%AB%E3%81%B5%E3%82%8C%E3%81%9F%E3%82%88!%20-%20%E6%94%BE%E8%AA%B2%E5%BE%8C%E3%83%86%E3%82%A3%E3%83%BC%E3%82%BF%E3%82%A4%E3%83%A0.flac",
		duration: 281,
	},
    {
		id: 13,
		title: "将故事写成我们",
		artist: "林俊杰",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music113/v4/b4/60/09/b4600934-05dd-b5e6-7d41-46cdb2ac304a/190295343361.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E5%B0%86%E6%95%85%E4%BA%8B%E5%86%99%E6%88%90%E6%88%91%E4%BB%AC%20-%20%E6%9E%97%E4%BF%8A%E6%9D%B0.flac",
		duration: 335,
	},
    {
		id: 14,
		title: "時を刻む唄",
		artist: "Lia",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/1b/ae/07/1bae0761-e8de-48cd-b0c4-d61c5afa389b/4933032005384_cover.png/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E6%99%82%E3%82%92%E5%88%BB%E3%82%80%E5%94%84%20-%20Lia.flac",
		duration: 292,
	},
    {
		id: 15,
		title: "爱你",
		artist: "王心凌",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/a3/a9/7ba3a98a-0790-7733-5305-a742f224755a/cover.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E7%88%B1%E4%BD%A0%20-%20%E7%8E%8B%E5%BF%83%E5%87%8C.flac",
		duration: 220,
	},
    {
		id: 16,
		title: "第一次爱的人",
		artist: "王心凌",
		cover: "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/7b/a3/a9/7ba3a98a-0790-7733-5305-a742f224755a/cover.jpg/592x592bb.webp",
		url: "https://pb.xiaozhangya.xin/music/%E7%AC%AC%E4%B8%80%E6%AC%A1%E7%88%B1%E7%9A%84%E4%BA%BA%20-%20%E7%8E%8B%E5%BF%83%E5%87%8C.flac",
		duration: 229,
	},
];

async function fetchMetingPlaylist() {
	if (!meting_api || !meting_id) return;
	isLoading = true;
	const apiUrl = meting_api
		.replace(":server", meting_server)
		.replace(":type", meting_type)
		.replace(":id", meting_id)
		.replace(":auth", "")
		.replace(":r", Date.now().toString());
	try {
		const res = await fetch(apiUrl);
		if (!res.ok) throw new Error("meting api error");
		const list = await res.json();
		playlist = list.map((song) => {
			let title = song.name ?? song.title ?? "未知歌曲";
			let artist = song.artist ?? song.author ?? "未知艺术家";
			let dur = song.duration ?? 0;
			if (dur > 10000) dur = Math.floor(dur / 1000);
			if (!Number.isFinite(dur) || dur <= 0) dur = 0;
			return {
				id: song.id,
				title,
				artist,
				cover: song.pic ?? "",
				url: song.url ?? "",
				duration: dur,
			};
		});
		if (playlist.length > 0) {
			loadSong(playlist[0]);
		}
		isLoading = false;
	} catch (e) {
		showErrorMessage("Meting 歌单获取失败");
		isLoading = false;
	}
}

function togglePlay() {
	if (!audio || !currentSong.url) return;
	if (isPlaying) {
		audio.pause();
	} else {
		audio.play();
	}
}

function toggleExpanded() {
	isExpanded = !isExpanded;
	if (isExpanded) {
		showPlaylist = false;
		isHidden = false;
	}
}

function toggleHidden() {
	isHidden = !isHidden;
	if (isHidden) {
		isExpanded = false;
		showPlaylist = false;
	}
}

function togglePlaylist() {
	showPlaylist = !showPlaylist;
}

function toggleShuffle() {
	isShuffled = !isShuffled;
}

function toggleRepeat() {
	isRepeating = (isRepeating + 1) % 3;
}

function previousSong() {
	if (playlist.length <= 1) return;
	const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
	playSong(newIndex);
}

function nextSong() {
	if (playlist.length <= 1) return;
	let newIndex: number;
	if (isShuffled) {
		do {
			newIndex = Math.floor(Math.random() * playlist.length);
		} while (newIndex === currentIndex && playlist.length > 1);
	} else {
		newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
	}
	playSong(newIndex);
}

function playSong(index: number) {
	if (index < 0 || index >= playlist.length) return;
	const wasPlaying = isPlaying;
	currentIndex = index;
	if (audio) audio.pause();
	loadSong(playlist[currentIndex]);
	if (wasPlaying || !isPlaying) {
		setTimeout(() => {
			if (!audio) return;
			if (audio.readyState >= 2) {
				audio.play().catch(() => {});
			} else {
				audio.addEventListener(
					"canplay",
					() => {
						audio.play().catch(() => {});
					},
					{ once: true },
				);
			}
		}, 100);
	}
}

function getAssetPath(path: string): string {
	if (path.startsWith("http://") || path.startsWith("https://")) return path;
	if (path.startsWith("/")) return path;
	return `/${path}`;
}

function loadSong(song: typeof currentSong) {
	if (!song || !audio) return;
	currentSong = { ...song };
	if (song.url) {
		isLoading = true;
		audio.pause();
		audio.currentTime = 0;
		currentTime = 0;
		duration = song.duration ?? 0;
		audio.removeEventListener("loadeddata", handleLoadSuccess);
		audio.removeEventListener("error", handleLoadError);
		audio.removeEventListener("loadstart", handleLoadStart);
		audio.addEventListener("loadeddata", handleLoadSuccess, { once: true });
		audio.addEventListener("error", handleLoadError, { once: true });
		audio.addEventListener("loadstart", handleLoadStart, { once: true });
		audio.src = getAssetPath(song.url);
		audio.load();
	} else {
		isLoading = false;
	}
}

function handleLoadSuccess() {
	isLoading = false;
	if (audio?.duration && audio.duration > 1) {
		duration = Math.floor(audio.duration);
		if (playlist[currentIndex]) playlist[currentIndex].duration = duration;
		currentSong.duration = duration;
	}
}

function handleLoadError(event: Event) {
	isLoading = false;
	showErrorMessage(`无法播放 "${currentSong.title}"，正在尝试下一首...`);
	if (playlist.length > 1) setTimeout(() => nextSong(), 1000);
	else showErrorMessage("播放列表中没有可用的歌曲");
}

function handleLoadStart() {}

function showErrorMessage(message: string) {
	errorMessage = message;
	showError = true;
	setTimeout(() => {
		showError = false;
	}, 3000);
}
function hideError() {
	showError = false;
}

function setProgress(event: MouseEvent) {
	if (!audio || !progressBar) return;
	const rect = progressBar.getBoundingClientRect();
	const percent = (event.clientX - rect.left) / rect.width;
	const newTime = percent * duration;
	audio.currentTime = newTime;
	currentTime = newTime;
}

function setVolume(event: MouseEvent) {
	if (!audio || !volumeBar) return;
	const rect = volumeBar.getBoundingClientRect();
	const percent = Math.max(
		0,
		Math.min(1, (event.clientX - rect.left) / rect.width),
	);
	volume = percent;
	audio.volume = volume;
	isMuted = volume === 0;
}

function toggleMute() {
	if (!audio) return;
	isMuted = !isMuted;
	audio.muted = isMuted;
}

function formatTime(seconds: number): string {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function handleAudioEvents() {
	if (!audio) return;
	audio.addEventListener("play", () => {
		isPlaying = true;
	});
	audio.addEventListener("pause", () => {
		isPlaying = false;
	});
	audio.addEventListener("timeupdate", () => {
		currentTime = audio.currentTime;
	});
	audio.addEventListener("ended", () => {
		if (isRepeating === 1) {
			audio.currentTime = 0;
			audio.play().catch(() => {});
		} else if (
			isRepeating === 2 ||
			currentIndex < playlist.length - 1 ||
			isShuffled
		) {
			nextSong();
		} else {
			isPlaying = false;
		}
	});
	audio.addEventListener("error", (event) => {
		isLoading = false;
	});
	audio.addEventListener("stalled", () => {});
	audio.addEventListener("waiting", () => {});
}

onMount(() => {
	audio = new Audio();
	audio.volume = volume;
	handleAudioEvents();
	if (!musicPlayerConfig.enable) {
		return;
	}
	if (mode === "meting") {
		fetchMetingPlaylist();
	} else {
		playlist = localPlaylist;
		if (playlist.length > 0) loadSong(playlist[0]);
	}
});

onDestroy(() => {
	if (audio) {
		audio.pause();
		audio.src = "";
	}
});
</script>

{#if musicPlayerConfig.enable}
{#if showError}
<div class="fixed bottom-20 left-4 z-[60] max-w-sm">
    <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-xl flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span class="text-sm flex-1">{errorMessage}</span>
        <button on:click={hideError} class="text-white-80 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    </div>
</div>
{/if}

<div class="music-player fixed bottom-4 left-4 z-50 transition-all duration-300 ease-in-out"
     class:expanded={isExpanded}
     class:hidden-mode={isHidden}>
    <!-- 隐藏状态的小圆球 -->
    <div class="orb-player w-12 h-12 bg-primary rounded-full shadow-lg shadow-orb cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center hover:scale-110 active:scale-95"
         class:opacity-0={!isHidden}
         class:scale-0={!isHidden}
         class:pointer-events-none={!isHidden}
         on:click={toggleHidden}
         on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleHidden();
            }
         }}
         role="button"
         tabindex="0"
         aria-label="显示音乐播放器">
        {#if isLoading}
            <svg class="text-white text-lg animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
        {:else if isPlaying}
            <div class="flex space-x-0.5">
                <div class="w-0.5 h-3 bg-white rounded-full animate-pulse"></div>
                <div class="w-0.5 h-4 bg-white rounded-full animate-pulse" style="animation-delay: 150ms;"></div>
                <div class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
            </div>
        {:else}
            <svg class="text-white text-lg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
        {/if}
    </div>
    
    <!-- 收缩状态的迷你播放器（封面圆形） -->
    <div class="mini-player bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-3 transition-all duration-500 ease-in-out backdrop-blur-md dark:backdrop-blur-md border border-white-20 dark:border-gray-700-50 hover:shadow-lg"
         class:opacity-0={isExpanded || isHidden}
         class:scale-95={isExpanded || isHidden}
         class:pointer-events-none={isExpanded || isHidden}
         on:click={toggleExpanded}
         on:keydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleExpanded();
            }
         }}
         role="button"
         tabindex="0"
         aria-label="展开音乐播放器">
        <div class="flex items-center gap-3 cursor-pointer">
            <div class="cover-container relative w-12 h-12 rounded-full overflow-hidden shadow-md">
                <img src={getAssetPath(currentSong.cover)} alt="封面"
                     class="w-full h-full object-cover transition-transform duration-300"
                     class:spinning={isPlaying && !isLoading}
                     class:animate-pulse={isLoading} />
                <div class="absolute inset-0 bg-black-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    {#if isLoading}
                        <svg class="text-white text-xl animate-spin" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                    {:else if isPlaying}
                        <svg class="text-white text-xl" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                    {:else}
                        <svg class="text-white text-xl" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    {/if}
                </div>
                <div class="absolute inset-0 ring-1 ring-white-20 dark:ring-black-20 rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{currentSong.title}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 truncate">{currentSong.artist}</div>
            </div>
            <div class="flex items-center gap-1">
                <button class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                        on:click|stopPropagation={toggleHidden}
                        title="隐藏播放器">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 dark:text-gray-300"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                </button>
                <button class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                        on:click|stopPropagation={toggleExpanded}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 dark:text-gray-300"><polyline points="18 15 12 9 6 15"></polyline></svg>
                </button>
            </div>
        </div>
    </div>
    
    <!-- 展开状态的完整播放器（封面圆形） -->
    <div class="expanded-player bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out backdrop-blur-md dark:backdrop-blur-md border border-white-20 dark:border-gray-700-50"
         class:opacity-0={!isExpanded}
         class:scale-95={!isExpanded}
         class:pointer-events-none={!isExpanded}
         class:shadow-player-active={isExpanded}>
        <div class="flex items-center gap-4 mb-4">
            <div class="cover-container relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-md">
                <img src={getAssetPath(currentSong.cover)} alt="封面"
                     class="w-full h-full object-cover transition-transform duration-300 hover:brightness-110"
                     class:spinning={isPlaying && !isLoading}
                     class:animate-pulse={isLoading} />
                <div class="absolute inset-0 ring-2 ring-white-20 dark:ring-black-20 rounded-full"></div>
            </div>
            <div class="flex-1 min-w-0">
                <div class="song-title text-lg font-bold text-gray-900 dark:text-gray-100 truncate mb-1">{currentSong.title}</div>
                <div class="song-artist text-sm text-gray-500 dark:text-gray-400 truncate">{currentSong.artist}</div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>
            <div class="flex items-center gap-1">
                <button class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                        on:click={toggleHidden}
                        title="隐藏播放器">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 dark:text-gray-300"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" y1="2" x2="22" y2="22"></line></svg>
                </button>
                <button class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                        on:click={toggleExpanded}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-600 dark:text-gray-300"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
            </div>
        </div>
        <div class="progress-section mb-4">
            <div class="progress-bar flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                 bind:this={progressBar}
                 on:click={setProgress}
                 on:keydown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         const rect = progressBar.getBoundingClientRect();
                         const percent = 0.5;
                         const newTime = percent * duration;
                         if (audio) {
                             audio.currentTime = newTime;
                             currentTime = newTime;
                         }
                     }
                 }}
                 role="slider"
                 tabindex="0"
                 aria-label="播放进度"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 aria-valuenow={duration > 0 ? (currentTime / duration * 100) : 0}>
                <div class="h-full bg-primary rounded-full transition-all duration-100 shadow-sm"
                     style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%"></div>
            </div>
        </div>
        <div class="controls flex items-center justify-center gap-2 mb-4">
            <!-- 随机按钮高亮 -->
            <button class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    class:bg-primary={isShuffled}
                    class:text-white={isShuffled}
                    class:shadow-md={isShuffled}
                    class:shadow-player-button={isShuffled}
                    on:click={toggleShuffle}
                    disabled={playlist.length <= 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"></polyline><line x1="4" y1="20" x2="21" y2="3"></line><polyline points="21 16 21 21 16 21"></polyline><line x1="15" y1="15" x2="21" y2="21"></line><line x1="4" y1="4" x2="9" y2="9"></line></svg>
            </button>
            <button class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95" on:click={previousSong}
                    disabled={playlist.length <= 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="19 20 9 12 19 4 19 20"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
            </button>
            <button class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 active:scale-95"
                    class:opacity-50={isLoading}
                    class:shadow-play-button={!isLoading}
                    disabled={isLoading}
                    on:click={togglePlay}>
                <div class="relative z-10">
                {#if isLoading}
                    <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                {:else if isPlaying}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                {/if}
                </div>
                <div class="absolute inset-0 rounded-full bg-gradient-to-br from-primary-light to-primary-dark blur-sm"></div>
            </button>
            <button class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover:scale-110 active:scale-95" on:click={nextSong}
                    disabled={playlist.length <= 1}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 4 15 12 5 20 5 4"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            </button>
            <!-- 循环按钮高亮 -->
            <button class="w-10 h-10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    class:bg-primary={isRepeating > 0}
                    class:text-white={isRepeating > 0}
                    class:shadow-md={isRepeating > 0}
                    class:shadow-player-button={isRepeating > 0}
                    on:click={toggleRepeat}>
                {#if isRepeating === 1}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path><rect x="11" y="10" width="2" height="4"></rect></svg>
                {:else if isRepeating === 2}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                {:else}
                    <svg class="opacity-50" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"></polyline><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><polyline points="7 23 3 19 7 15"></polyline><path d="M21 13v2a4 4 0 0 1-4 4H3"></path></svg>
                {/if}
            </button>
        </div>
        <div class="bottom-controls flex items-center gap-2">
            <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" on:click={toggleMute}>
                {#if isMuted || volume === 0}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
                {:else if volume < 0.5}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                {/if}
            </button>
            <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
                 bind:this={volumeBar}
                 on:click={setVolume}
                 on:keydown={(e) => {
                     if (e.key === 'Enter' || e.key === ' ') {
                         e.preventDefault();
                         if (e.key === 'Enter') toggleMute();
                     }
                 }}
                 role="slider"
                 tabindex="0"
                 aria-label="音量控制"
                 aria-valuemin="0"
                 aria-valuemax="100"
                 aria-valuenow={volume * 100}>
                <div class="h-full bg-primary rounded-full transition-all duration-100 shadow-sm"
                     style="width: {volume * 100}%"></div>
            </div>
            <button class="w-8 h-8 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    class:text-primary={showPlaylist}
                    on:click={togglePlaylist}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
        </div>
    </div>
    {#if showPlaylist}
        <div class="playlist-panel bg-white dark:bg-gray-800 rounded-xl shadow-xl fixed left-4 w-80 max-h-80 overflow-hidden z-50 backdrop-blur-md dark:backdrop-blur-md border border-white-20 dark:border-gray-700-50 shadow-player-light"
             transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="playlist-header flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">播放列表</h3>
                <button class="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center" on:click={togglePlaylist}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="playlist-content overflow-y-auto max-h-80">
                {#each playlist as song, index}
                    <div class="playlist-item flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                         class:bg-gray-50={index === currentIndex && !isPlaying}
                         class:bg-gray-100={index === currentIndex && isPlaying}
                         class:dark:bg-gray-800={index === currentIndex && !isPlaying}
                         class:dark:bg-gray-700={index === currentIndex && isPlaying}
                         class:text-primary={index === currentIndex}
                         on:click={() => playSong(index)}
                         on:keydown={(e) => {
                             if (e.key === 'Enter' || e.key === ' ') {
                                 e.preventDefault();
                                 playSong(index);
                             }
                         }}
                         role="button"
                         tabindex="0"
                         aria-label="播放 {song.title} - {song.artist}">
                        <div class="w-6 h-6 flex items-center justify-center">
                            {#if index === currentIndex && isPlaying}
                                <svg class="text-primary animate-pulse" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
                            {:else if index === currentIndex}
                                <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
                            {:else}
                                <span class="text-sm text-gray-400 dark:text-gray-500">{index + 1}</span>
                            {/if}
                        </div>
                        <!-- 歌单列表内封面仍为圆角矩形 -->
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                            <img src={getAssetPath(song.cover)} alt={song.title} class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium truncate" class:text-primary={index === currentIndex} class:text-gray-900={index !== currentIndex} class:dark:text-gray-100={index !== currentIndex}>
                                {song.title}
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="text-sm text-gray-500 dark:text-gray-400 truncate" class:text-primary={index === currentIndex}>
                                    {song.artist}
                                </div>
                                <div class="text-xs text-gray-400 dark:text-gray-500">
                                    {formatTime(song.duration)}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style lang="postcss">
.orb-player {
	position: relative;
	backdrop-filter: blur(10px);
	-webkit-backdrop-filter: blur(10px);
	z-index: 1;
}
.orb-player::before {
	content: '';
	position: absolute;
	inset: -2px;
	background: linear-gradient(45deg, var(--primary-color), transparent, var(--primary-color));
	border-radius: 50%;
	z-index: -1;
	opacity: 0;
	transition: opacity 0.3s ease;
}
.orb-player::after {
	content: '';
	position: absolute;
	inset: 0;
	border-radius: 50%;
	background: radial-gradient(circle at center, var(--primary-color), transparent);
	z-index: -2;
	filter: blur(4px);
	opacity: 0.5;
}
.orb-player:hover::before {
	opacity: 0.5;
	animation: rotate 2s linear infinite;
}
.orb-player .animate-pulse {
	animation: musicWave 1.5s ease-in-out infinite;
}
@keyframes rotate {
	from { transform: rotate(0deg); }
	to { transform: rotate(360deg); }
}
@keyframes musicWave {
	0%, 100% { transform: scaleY(0.5); }
	50% { transform: scaleY(1); }
}
.music-player.hidden-mode {
	width: 48px;
	height: 48px;
}
.music-player {
    max-width: 320px;
    user-select: none;
}
.mini-player {
    width: 280px;
    position: absolute;
    bottom: 0;
    left: 0;
}
.expanded-player {
    width: 320px;
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
.progress-section div:hover,
.bottom-controls > div:hover {
    transform: scaleY(1.2);
    transition: transform 0.2s ease;
}
@media (max-width: 768px) {
    .music-player {
        max-width: 280px;
        left: 8px !important;
        bottom: 8px !important;
    }
    .music-player.expanded {
        width: calc(100vw - 16px);
        max-width: none;
        left: 8px !important;
        right: 8px !important;
    }
    .playlist-panel {
        width: calc(100vw - 16px) !important;
        left: 8px !important;
        right: 8px !important;
        max-width: none;
        bottom: 80px !important; /* 调整位置至播放器正上方 */
        top: auto !important;
    }
    .controls {
        gap: 8px;
    }
    .controls button {
        width: 36px;
        height: 36px;
    }
    .controls button:nth-child(3) {
        width: 44px;
        height: 44px;
    }
}
@media (max-width: 480px) {
    .music-player {
        max-width: 260px;
    }
    .song-title {
        font-size: 14px;
    }
    .song-artist {
        font-size: 12px;
    }
    .controls {
        gap: 6px;
        margin-bottom: 12px;
    }
    .controls button {
        width: 32px;
        height: 32px;
    }
    .controls button:nth-child(3) {
        width: 40px;
        height: 40px;
    }
    .playlist-item {
        padding: 8px 12px;
    }
    .playlist-item .w-10 {
        width: 32px;
        height: 32px;
    }
}
@keyframes slide-up {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}
.animate-slide-up {
    animation: slide-up 0.3s ease-out;
}
@media (hover: none) and (pointer: coarse) {
    .music-player button,
    .playlist-item {
        min-height: 44px;
    }
    .progress-section > div,
    .bottom-controls > div:nth-child(2) {
        height: 12px;
    }
}
/* 自定义旋转动画，停止时保持当前位置 */
@keyframes spin-continuous {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.cover-container img {
    animation: spin-continuous 3s linear infinite;
    animation-play-state: paused;
}

.cover-container img.spinning {
    animation-play-state: running;
}

/* 主题相关 */
.bg-primary {
    background-color: var(--primary-color);
}
.text-primary {
    color: var(--primary-color);
}
.shadow-player-active {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}
.shadow-player-button {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
.shadow-play-button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
.shadow-player-light {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.border-primary {
    border-color: var(--primary-color);
}

.dark .shadow-player-active {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}
.dark .shadow-player-button {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
}
.dark .shadow-play-button {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}
.dark .shadow-player-light {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.shadow-orb {
    box-shadow: 0 4px 10px var(--primary-color-40);
}
.from-primary-light {
    --tw-gradient-from: var(--primary-color-50);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
}
.to-primary-dark {
    --tw-gradient-to: var(--primary-color-80);
}
.text-white-80 {
    color: rgba(255, 255, 255, 0.8);
}
.bg-black-20 {
    background-color: rgba(0, 0, 0, 0.2);
}
.border-white-20 {
    border-color: rgba(255, 255, 255, 0.2);
}
.border-gray-700-50 {
    border-color: rgba(55, 65, 81, 0.5);
}
.ring-white-20 {
    --tw-ring-color: rgba(255, 255, 255, 0.2);
}
.ring-black-20 {
    --tw-ring-color: rgba(0, 0, 0, 0.2);
}

/* 播放列表样式 */
.playlist-panel {
    position: fixed;
    bottom: 96px; /* 放置在播放器正上方 */
    left: 16px;
    max-height: calc(100vh - 200px); /* 限制最大高度 */
    z-index: 49; /* 确保在播放器下方 */
    margin-bottom: 12px; /* 与播放器保持适当间距 */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    transform-origin: bottom left; /* 从播放器位置展开 */
}

/* 播放列表和播放器之间的连接效果 */
.playlist-panel::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 20px;
    width: 20px;
    height: 10px;
    background-color: white;
    clip-path: polygon(0 0, 100% 0, 50% 100%);
}

/* 暗黑模式下的箭头颜色 */
.dark .playlist-panel::after {
    background-color: #1f2937; /* dark:bg-gray-800 的颜色 */
}
</style>
{/if}
