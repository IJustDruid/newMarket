export const tg = window.Telegram.WebApp;

export let currentUser = null;

export function initTelegram() {
  tg.ready();
  tg.expand();

  currentUser = tg.initDataUnsafe.user
    ? tg.initDataUnsafe.user
    : { id: "guest_" + Date.now(), first_name: "Гість" };

  tg.BackButton.show();
  tg.BackButton.onClick(() => tg.close());
}
