import { useLiveQuery } from "dexie-react-hooks";
import { db, type TakeawayOption, type HistoryItem } from "../lib/db";
import { useState } from "react";

export function useTakeawayOptions() {
  const options = useLiveQuery(() => db.options.toArray());
  
  const addOption = async (option: Omit<TakeawayOption, "id">) => {
    return await db.options.add(option);
  };

  const updateOption = async (id: number, updates: Partial<TakeawayOption>) => {
    return await db.options.update(id, updates);
  };

  const deleteOption = async (id: number) => {
    return await db.options.delete(id);
  };

  return {
    options: options ?? [],
    isLoading: options === undefined,
    addOption,
    updateOption,
    deleteOption
  };
}

export function useTakeawayHistory() {
  const history = useLiveQuery(() => 
    db.history.orderBy('date').reverse().limit(20).toArray()
  );

  const addToHistory = async (option: TakeawayOption, rating?: number) => {
    if (!option.id) return;
    
    // 1. Add to history table
    await db.history.add({
      optionId: option.id,
      optionName: option.name,
      date: new Date(),
      rating
    });

    // 2. Update lastOrderedAt on the option itself
    await db.options.update(option.id, {
      lastOrderedAt: new Date()
    });
  };

  return {
    history: history ?? [],
    isLoading: history === undefined,
    addToHistory
  };
}

export function useTakeawayOption(id: number) {
  const option = useLiveQuery(() => db.options.get(id), [id]);
  return { option, isLoading: option === undefined };
}
