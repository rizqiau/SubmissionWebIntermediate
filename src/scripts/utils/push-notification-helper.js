import CONFIG from "../config";
import {
  subscribePushNotification,
  unsubscribePushNotification,
} from "../data/api";

const PushNotification = {
  async init({ button }) {
    if (!this._checkAvailability()) return;

    this._button = button;
    await this._updateButtonState();

    this._button.addEventListener("click", async (event) => {
      event.stopPropagation();
      this._button.disabled = true;

      const subscription = await navigator.serviceWorker.ready.then((sw) =>
        sw.pushManager.getSubscription()
      );

      if (subscription) {
        await this._unsubscribe(subscription);
      } else {
        await this._subscribe();
      }

      await this._updateButtonState();
    });
  },

  async _updateButtonState() {
    try {
      const subscription = await navigator.serviceWorker.ready.then((sw) =>
        sw.pushManager.getSubscription()
      );
      this._button.disabled = false;
      if (subscription) {
        this._button.textContent = "Matikan Notifikasi";
      } else {
        this._button.textContent = "Aktifkan Notifikasi";
      }
    } catch (error) {
      console.error("Error updating button state:", error);
      this._button.disabled = true;
      this._button.textContent = "Error";
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

      const response = await subscribePushNotification(subscription);
      console.log("Server response for subscribe:", response);
      alert("Berhasil mengaktifkan notifikasi!");
    } catch (error) {
      console.error("Failed to subscribe:", error);
      alert("Gagal mengaktifkan notifikasi. Silakan coba lagi.");
    }
  },

  async _unsubscribe(subscription) {
    try {
      const unsubscribed = await subscription.unsubscribe();
      if (unsubscribed) {
        const response = await unsubscribePushNotification(subscription);
        console.log("Server response for unsubscribe:", response);
        alert("Berhasil mematikan notifikasi!");
      }
    } catch (error) {
      console.error("Failed to unsubscribe:", error);
      alert("Gagal mematikan notifikasi. Silakan coba lagi.");
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
