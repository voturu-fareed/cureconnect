/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  FavoritePerson,
  HealthRecord,
  SmartWatchVitals,
  EmergencyHospital,
  PoliceStation,
  NeighborUser,
  DayHistoryItem,
  FavoritePersonNotification,
  CaseTrackingDetail,
} from './types';
import {
  STORAGE_KEYS,
  defaultUserProfile,
  defaultFavoritePerson,
  initialHealthRecords,
  initialDayHistory,
  initialVitals,
  mockNearbyHospitals,
  mockPoliceStations,
  mockNeighbors,
  mockNearbyRehabCenters,
  initialNotifications,
  initialCaseDetail,
  loadFromStorage,
  saveToStorage,
} from './utils/storage';
import { Navigation, ActiveTab } from './components/Navigation';
import { AvatarVideoCall } from './components/AvatarVideoCall';
import { BluetoothVitals } from './components/BluetoothVitals';
import { HealthRecordsVault } from './components/HealthRecordsVault';
import { NeighborNetwork } from './components/NeighborNetwork';
import { CaseTracker } from './components/CaseTracker';
import { DayHistoryTimeline } from './components/DayHistoryTimeline';
import { EmergencyRadarModal } from './components/EmergencyRadarModal';
import { AuthModal } from './components/AuthModal';
import { SettingsModal } from './components/SettingsModal';
import { FavoritePersonNotifier } from './components/FavoritePersonNotifier';
import { StressCounselingModal } from './components/StressCounselingModal';

export default function App() {
  // Application State with Local Persistence
  const [user, setUser] = useState<UserProfile>(() =>
    loadFromStorage(STORAGE_KEYS.USER_PROFILE, defaultUserProfile)
  );
  const [favoritePerson, setFavoritePerson] = useState<FavoritePerson>(() => {
    const stored = loadFromStorage(STORAGE_KEYS.FAVORITE_PERSON, defaultFavoritePerson);
    // User requested to delete the uploaded photo and restore the first avatar
    const cleaned = {
      ...stored,
      photoUrl: '',
      isAvatarEnabled: false,
    };
    saveToStorage(STORAGE_KEYS.FAVORITE_PERSON, cleaned);
    return cleaned;
  });
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.HEALTH_RECORDS, initialHealthRecords)
  );
  const [vitals, setVitals] = useState<SmartWatchVitals>(() =>
    loadFromStorage(STORAGE_KEYS.WATCH_VITALS, initialVitals)
  );
  const [neighbors, setNeighbors] = useState<NeighborUser[]>(() =>
    loadFromStorage(STORAGE_KEYS.NEIGHBORS, mockNeighbors)
  );
  const [dayHistory, setDayHistory] = useState<DayHistoryItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.DAY_HISTORY, initialDayHistory)
  );
  const [notifications, setNotifications] = useState<FavoritePersonNotification[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, initialNotifications)
  );
  const [caseDetail, setCaseDetail] = useState<CaseTrackingDetail>(() =>
    loadFromStorage(STORAGE_KEYS.CASE_TRACKING, initialCaseDetail)
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() =>
    loadFromStorage(STORAGE_KEYS.IS_LOGGED_IN, true)
  );

  // UI Active Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('video-call');
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [emergencyType, setEmergencyType] = useState<'hospital' | 'police'>('hospital');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [counselingModalOpen, setCounselingModalOpen] = useState(false);

  // Persist state updates to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.FAVORITE_PERSON, favoritePerson);
  }, [favoritePerson]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HEALTH_RECORDS, healthRecords);
  }, [healthRecords]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WATCH_VITALS, vitals);
  }, [vitals]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NEIGHBORS, neighbors);
  }, [neighbors]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.DAY_HISTORY, dayHistory);
  }, [dayHistory]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CASE_TRACKING, caseDetail);
  }, [caseDetail]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  // Handlers
  const handleOpenEmergency = (type: 'hospital' | 'police') => {
    setEmergencyType(type);
    setEmergencyModalOpen(true);
  };

  const handleSaveProfile = (updatedUser: UserProfile, updatedFav: FavoritePerson) => {
    setUser(updatedUser);
    setFavoritePerson(updatedFav);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthModalOpen(true);
  };

  const handleVerifyNeighbor = (id: string, isSafe: boolean) => {
    setNeighbors((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              verifiedSafeByUser: isSafe,
              status: isSafe ? 'Safe' : 'Pending Daily Check-in',
            }
          : n
      )
    );
  };

  const handleUserMarkSelfSafe = () => {
    setUser((prev) => ({ ...prev, isSafe: true }));
  };

  const handleTriggerEmergencyEscalation = () => {
    handleOpenEmergency('hospital');
  };

  const handleAddDayHistory = (item: DayHistoryItem) => {
    setDayHistory((prev) => [item, ...prev]);
  };

  const handleAddHealthRecord = (rec: HealthRecord) => {
    setHealthRecords((prev) => [rec, ...prev]);
  };

  const handleDeleteHealthRecord = (id: string) => {
    setHealthRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReplyNotification = (id: string, replyText: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'replied',
              userReply: replyText,
            }
          : n
      )
    );
  };

  const handleAddNotification = (notif: FavoritePersonNotification) => {
    setNotifications((prev) => [notif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'settings') {
            setSettingsModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        onOpenEmergency={handleOpenEmergency}
        user={user}
        onOpenProfile={() => setAuthModalOpen(true)}
        onOpenCounseling={() => setCounselingModalOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 w-full pb-16">
        {activeTab === 'video-call' && (
          <AvatarVideoCall
            user={user}
            favoritePerson={favoritePerson}
            onUpdateFavoritePerson={(updated) => setFavoritePerson(updated)}
            healthRecords={healthRecords}
            onAddDayHistory={handleAddDayHistory}
            onOpenEmergency={handleOpenEmergency}
            onOpenCounseling={() => setCounselingModalOpen(true)}
          />
        )}

        {activeTab === 'vitals' && (
          <BluetoothVitals
            vitals={vitals}
            onUpdateVitals={setVitals}
            onTriggerCompanionSession={(reason) => {
              setActiveTab('video-call');
            }}
          />
        )}

        {activeTab === 'records' && (
          <HealthRecordsVault
            records={healthRecords}
            onAddRecord={handleAddHealthRecord}
            onDeleteRecord={handleDeleteHealthRecord}
            onOpenVideoCall={() => setActiveTab('video-call')}
          />
        )}

        {activeTab === 'neighbors' && (
          <NeighborNetwork
            neighbors={neighbors}
            user={user}
            onVerifyNeighbor={handleVerifyNeighbor}
            onUserMarkSelfSafe={handleUserMarkSelfSafe}
            onTriggerEmergencyEscalation={handleTriggerEmergencyEscalation}
          />
        )}

        {activeTab === 'case' && (
          <CaseTracker
            user={user}
            initialCaseDetail={caseDetail}
            onUpdateCase={setCaseDetail}
            onOpenCompanion={() => setActiveTab('video-call')}
            rehabCenters={mockNearbyRehabCenters}
            onOpenCounseling={() => setCounselingModalOpen(true)}
          />
        )}

        {activeTab === 'history' && (
          <DayHistoryTimeline
            historyItems={dayHistory}
            onAddHistoryItem={handleAddDayHistory}
            onOpenCompanion={() => setActiveTab('video-call')}
          />
        )}
      </main>

      {/* Floating Incoming Notification from Favorite Person */}
      <FavoritePersonNotifier
        favoritePerson={favoritePerson}
        user={user}
        notifications={notifications}
        onReplyNotification={handleReplyNotification}
        onOpenVideoCall={() => setActiveTab('video-call')}
        onAddNotification={handleAddNotification}
      />

      {/* Dedicated Stress-Decreasing AI Counseling & Rehab Centers Modal */}
      <StressCounselingModal
        isOpen={counselingModalOpen}
        onClose={() => setCounselingModalOpen(false)}
        user={user}
        favoritePerson={favoritePerson}
        vitals={vitals}
        rehabCenters={mockNearbyRehabCenters}
        onOpenVideoCall={() => {
          setCounselingModalOpen(false);
          setActiveTab('video-call');
        }}
      />

      {/* Emergency Radar Modal (Hospital & Police SOS with 5m Scanning) */}
      <EmergencyRadarModal
        isOpen={emergencyModalOpen}
        onClose={() => setEmergencyModalOpen(false)}
        type={emergencyType}
        user={user}
        vitals={vitals}
        hospitals={mockNearbyHospitals}
        policeStations={mockPoliceStations}
      />

      {/* User Login & Profile Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        user={user}
        favoritePerson={favoritePerson}
        onSaveProfile={handleSaveProfile}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Settings Modal (Language, Ratings, Terms & Conditions, Clear History) */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        user={user}
        onUpdateLanguage={(lang) => setUser((prev) => ({ ...prev, language: lang }))}
        onClearHistory={() => setDayHistory([])}
        onLogout={handleLogout}
        historyCount={dayHistory.length}
      />
    </div>
  );
}
