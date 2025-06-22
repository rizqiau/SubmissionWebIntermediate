const swRegister = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("/sw.js");
      console.log("Service worker registered successfully");
    } catch (error) {
      console.error("Failed to register service worker", error);
    }
  }
};

export default swRegister;
