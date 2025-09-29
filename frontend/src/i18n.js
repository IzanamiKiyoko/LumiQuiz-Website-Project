import { info } from "autoprefixer";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            rotate_device: "Please rotate your device to landscape mode for the best experience.",
            lobby_title: "{{name}}'s lobby",
            pin_code: "Pin code",
            waiting_for_player: "Waiting for players",
            start_game: "Start game",
            play_with_everyone: "Play with everyone",
            setting: "Setting",
            players: "Players",
            music: "Music",
            sound: "Sound",
            time_per_slide: "Time per slide (seconds)",
            fullscreen: "Fullscreen",
            language: "Language",
            leave_lobby: "Leave lobby",
            confirm: "Confirm",
            cancel: "Cancel",
            warning: "Warning",
            notification: "Notification",
            minus_point: "Minus point",
            infomation: "Information",
            spectator_view: "Status viewer",
        },
    },
    vi: {
        translation: {
            rotate_device: "Vui lòng xoay ngang màn hình để có trải nghiệm tốt nhất.",
            lobby_title: "Phòng chờ của {{name}}",
            pin_code: "Mã pin",
            waiting_for_player: "Đang chờ người chơi",
            start_game: "Bắt đầu trò chơi",
            play_with_everyone: "Chơi với mọi người",
            setting: "Cài đặt",
            players: "Người chơi",
            music: "Nhạc",
            sound: "Âm thanh",
            time_per_slide: "Thời gian mỗi slide (giây)",
            fullscreen: "Toàn màn hình",
            language: "Ngôn ngữ",
            leave_lobby: "Rời phòng",
            confirm: "Xác nhận",
            cancel: "Hủy",
            warning: "Cảnh báo",
            notification: "Thông báo",
            minus_point: "Điểm trừ",
            infomation: "Thông tin",
            spectator_view: "Trạng thái người xem"
        },
    },
};

i18n
    .use(initReactI18next) // tích hợp vào React
    .init({
        resources,
        lng: "vi", // ngôn ngữ mặc định
        fallbackLng: "vi", // nếu không tìm thấy thì fallback
        interpolation: {
            escapeValue: false, // React tự escape rồi
        },
    });

export default i18n;
