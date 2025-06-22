import CONFIG from "../config";

const PushNotification = {
  async init({ button }) {
    if (!this._checkAvailability()) return;

    this._button = button;
    await this._updateButtonState();

    this._button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const subscription = await navigator.serviceWorker.ready.then((sw) =>
        sw.pushManager.getSubscription()
      );

      if (subscription) {
        await this._unsubscribe();
      } else {
        await this._subscribe();
      }

      await this._updateButtonState();
    });
  },

  async _updateButtonState() {
    const subscription = await navigator.serviceWorker.ready.then((sw) =>
      sw.pushManager.getSubscription()
    );
    this._button.disabled = false;
    if (subscription) {
      this._button.textContent = "Matikan Notifikasi";
    } else {
      this._button.textContent = "Aktifkan Notifikasi";
    }
  },

  async _subscribe() {
    const permission = await this._requestPermission();
    if (permission !== "granted") return;

    try {
      const serviceWorkerRegistration = await navigator.serviceWorker.ready;
      const subscription =
        await serviceWorkerRegistration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this._urlBase64ToUint8Array(
            CONFIG.VAPID_PUBLIC_KEY
          ),
        });
      console.log("Successfully subscribed:", subscription);
    } catch (error) {
      console.error("Failed to subscribe:", error);
    }
  },

  async _unsubscribe() {
    const subscription = await navigator.serviceWorker.ready.then((sw) =>
      sw.pushManager.getSubscription()
    );
    if (subscription) {
      const unsubscribed = await subscription.unsubscribe();
      if (unsubscribed) {
        console.log("Successfully unsubscribed.");
      }
    }
  },

  _checkAvailability() {
    return "serviceWorker" in navigator && "PushManager" in window;
  },

  async _requestPermission() {
    return Notification.requestPermission();
  },

  _urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i += 1) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },
};

export default PushNotification;
