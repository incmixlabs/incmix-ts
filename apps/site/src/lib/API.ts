import { withId } from "@incmix/utils";

import { Page } from "./Page";
import { Site } from "./Site";

const getLocalStorageJSON = async <T>(
  key: string,
  defaultValue?: { value: T }
): Promise<T> => {
  const json = localStorage.getItem(key);
  if (json) {
    return JSON.parse(json);
  }
  if (defaultValue) {
    return defaultValue?.value;
  }
  throw new Error(`No local storage item found for key: ${key}`);
};

const setLocalStorageJSON = async <T>(key: string, value: T): Promise<T> => {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
};

const removeLocalStorageItem = async (key: string): Promise<void> => {
  localStorage.removeItem(key);
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type UP<T> = { value: Partial<T>; id: string };
type CP<T> = Omit<T, "id">;

const BasicCRUD = <T extends { id: string }>(key: string) => {
  const get = async (params: { id: string }) => {
    await delay(1000);
    return await getLocalStorageJSON<T>(`${key}-${params.id}`);
  };

  const update = async (params: UP<T>) => {
    await delay(1000);

    const oldValue = await get({ id: params.id });

    return await setLocalStorageJSON(`${key}-${params.id}`, {
      ...oldValue,
      ...params.value,
    });
  };

  const create = async (value: CP<T>) => {
    await delay(1000);
    const newValue = withId<T>(value);
    const res = await setLocalStorageJSON(`${key}-${newValue.id}`, newValue);
    const ids = await getLocalStorageJSON<string[]>(key, { value: [] });

    await setLocalStorageJSON(key, [...ids, res.id]);

    return res;
  };

  const deleteItem = async (params: { id: string }) => {
    await delay(1000);
    const res = await removeLocalStorageItem(`${key}-${params.id}`);

    const oldIds = await getLocalStorageJSON<string[]>(key, { value: [] });

    const newIds = oldIds.filter((id) => id !== params.id);

    await setLocalStorageJSON(key, newIds);

    return res;
  };

  const index = async (query?: undefined | { where: Partial<T> }) => {
    await delay(1000);
    const ids = await getLocalStorageJSON<string[]>(key, { value: [] });
    const all = await Promise.all(ids.map((id) => get({ id })));

    query = query || { where: {} };

    return all.filter((item) => {
      for (const key in query.where) {
        if (item[key] !== query.where[key]) {
          return false;
        }
      }
      return true;
    });
  };

  return {
    get,
    update,
    create,
    delete: deleteItem,
    index,
  };
};

export default {
  sites: BasicCRUD<Site>("sites"),
  pages: BasicCRUD<Page>("pages"),
};
