import { openDB } from "idb";
import CONFIG from "../config";

const { DATABASE_NAME, DATABASE_VERSION, OBJECT_STORE_NAME } = CONFIG;

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_NAME, { keyPath: "id" });
  },
});

const StoryDatabase = {
  async getStory(id) {
    if (!id) {
      return null;
    }
    return (await dbPromise).get(OBJECT_STORE_NAME, id);
  },
  async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_NAME);
  },
  async putStory(story) {
    if (!story.hasOwnProperty("id")) {
      return;
    }
    return (await dbPromise).put(OBJECT_STORE_NAME, story);
  },
  async deleteStory(id) {
    if (!id) {
      return;
    }
    return (await dbPromise).delete(OBJECT_STORE_NAME, id);
  },
  async clearStories() {
    return (await dbPromise).clear(OBJECT_STORE_NAME);
  },
};

export default StoryDatabase;
