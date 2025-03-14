"use client"

import React from 'react';
import { WeekView } from './WeekView';
import { DailySchedule } from './DailySchedule';

export function Calendar() {
  return (
    <div className="flex flex-col w-full h-screen shadow-lg overflow-hidden sm:max-w-md sm:rounded-lg">
      <div className="bg-gradient-header text-white p-4">
        <h1 className="text-xl font-bold mb-2">Your Schedule</h1>
        <WeekView />
      </div>
      <div className="flex-1 bg-white overflow-y-auto">
        <DailySchedule />
      </div>
    </div>
  );
} 