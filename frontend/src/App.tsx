import React, { useState, useEffect } from 'react';
import { SideNavBar } from './components/SideNavBar';
import { TopNavBar } from './components/TopNavBar';
import { DashboardView } from './components/DashboardView';
import { IntelligenceWorkspace } from './components/IntelligenceWorkspace';
import { SourceInspector } from './components/SourceInspector';
import { TopologyView } from './components/TopologyView';
import { MemoryView } from './components/MemoryView';
import { ActivityView } from './components/ActivityView';
import { SettingsView } from './components/SettingsView';
import { ConnectionsView } from './components/ConnectionsView';
import { CommandConsole } from './components/CommandConsole';
import { EvidenceModal } from './components/EvidenceModal';
import { DemoControlModal } from './components/DemoControlModal';
import { SearchModal } from './components/SearchModal';
import { AuditLogModal } from './components/AuditLogModal';
import { ChangeRadarView } from './components/ChangeRadarView';
import { ExportBriefingModal } from './components/ExportBriefingModal';
import {
  Message,
  EvidenceItem,
  ToolEvent,
  Connection,
  Memory,
  Conversation,
} from './types';
import {
  sendMessage,
  getConversations,
  getConnections,
  toggleConnection,
  getMemories,
  createMemory,
  updateMemory,
  deleteMemory,
  getDemoState,
  toggleDemoIssue42,
} from './api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [activityList, setActivityList] = useState<ToolEvent[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [issue42State, setIssue42State] = useState<string>('open');

  // Modals & Selection states
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [inspectedEvidence, setInspectedEvidence] = useState<EvidenceItem | null>(null);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isAuditLogModalOpen, setIsAuditLogModalOpen] = useState<boolean>(false);
  const [isExportBriefingOpen, setIsExportBriefingOpen] = useState<boolean>(false);

  // Initialize data on mount
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const [conns, mems, convs, demo] = await Promise.all([
        getConnections().catch(() => []),
        getMemories().catch(() => []),
        getConversations().catch(() => []),
        getDemoState().catch(() => ({ issue_42_state: 'open' })),
      ]);
      setConnections(conns);
      setMemories(mems);
      setConversations(convs);
      setIssue42State(demo.issue_42_state || 'open');

      if (convs.length > 0 && convs[0].messages.length > 0) {
        setActiveConversationId(convs[0].id);
        setMessages(convs[0].messages);
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendMessage(text, activeConversationId, isDemoMode);
      setActiveConversationId(response.conversation_id);

      const assistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        metadata: {
          citations: response.citations,
          tool_events: response.activity,
          run_id: response.run_id,
        },
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setEvidenceList(response.evidence || []);
      setActivityList(response.activity || []);

      // Refresh memories and conversations in background
      const [updatedMems, updatedConvs] = await Promise.all([
        getMemories().catch(() => []),
        getConversations().catch(() => []),
      ]);
      setMemories(updatedMems);
      setConversations(updatedConvs);
    } catch (err: any) {
      console.error('Send message failed:', err);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${err.message || 'Unable to connect to PulseDesk backend.'}`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleDemoState = async () => {
    try {
      const res = await toggleDemoIssue42();
      setIssue42State(res.current_state);
      // Rerun current query if messages exist or trigger synthesis
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
      if (lastUserMsg) {
        handleSendMessage(lastUserMsg.content);
      }
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const handleSelectCitation = (evidenceId: string) => {
    setSelectedEvidenceId(evidenceId);
    const item = evidenceList.find((e) => e.evidence_id === evidenceId);
    if (item) {
      setInspectedEvidence(item);
    } else {
      // Find fallback fixture
      if (evidenceId.includes('42')) {
        setInspectedEvidence({
          evidence_id: 'fixture:github:42',
          source_type: 'github_issue',
          external_id: 'issue#42',
          title: 'Release CI pipeline failing',
          snippet: 'Stripe webhook HMAC signature mismatch in staging test_checkout_intent_v2. Commit 9f2e81a.',
          url: 'https://github.com/pulsedesk/project-alpha/issues/42',
          observed_at: new Date().toISOString(),
          live_checked: true,
          metadata: { number: 42, state: issue42State, repo: 'pulsedesk/project-alpha' },
        });
      } else if (evidenceId.includes('approval')) {
        setInspectedEvidence({
          evidence_id: 'fixture:gmail:approval-1',
          source_type: 'gmail_message',
          external_id: 'approval-1',
          title: 'Gmail: Alpha staging approval (from approver@example.invalid)',
          snippet: 'Launch approval is on hold until the staging demo passes. Please ensure all integration CI pipelines are green.',
          url: 'https://mail.google.com/mail/u/0/#inbox/approval-1',
          observed_at: new Date().toISOString(),
          live_checked: true,
          metadata: { from: 'approver@example.invalid', subject: 'Alpha staging approval' },
        });
      } else if (evidenceId.includes('priority')) {
        setInspectedEvidence({
          evidence_id: 'memory:fixture:memory:priority',
          source_type: 'memory',
          external_id: 'fixture:memory:priority',
          title: 'Remembered Context: Priority',
          snippet: 'Project Alpha presentation is higher priority than documentation polish this week.',
          url: null,
          observed_at: new Date().toISOString(),
          live_checked: true,
          metadata: { provenance: 'explicit_user_request' },
        });
      }
    }
  };

  const handleToggleConnection = async (provider: string) => {
    try {
      await toggleConnection(provider);
      const updated = await getConnections();
      setConnections(updated);
    } catch (err) {
      console.error('Connection toggle failed:', err);
    }
  };

  const handleCreateMemory = async (content: string, type: string) => {
    try {
      await createMemory(content, type);
      const updated = await getMemories();
      setMemories(updated);
    } catch (err) {
      console.error('Create memory failed:', err);
    }
  };

  const handleUpdateMemory = async (id: string, content: string) => {
    try {
      await updateMemory(id, { content });
      const updated = await getMemories();
      setMemories(updated);
    } catch (err) {
      console.error('Update memory failed:', err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      const updated = await getMemories();
      setMemories(updated);
    } catch (err) {
      console.error('Delete memory failed:', err);
    }
  };

  return (
    <div className="bg-background text-on-surface antialiased overflow-x-hidden min-h-screen selection:bg-primary-container selection:text-on-primary-container font-body">
      {/* 1. Fixed Left Navigation Rail (68-72px, w-18) */}
      <SideNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onNewEntity={() => {
          setActiveTab('ask');
          setMessages([]);
        }}
        isDemoMode={isDemoMode}
        onOpenDemoControls={() => setIsDemoModalOpen(true)}
      />

      {/* 2. Fixed Top Navigation Bar */}
      <TopNavBar
        connections={connections}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onDeployIntelligence={() => {
          setActiveTab('ask');
          handleSendMessage('What is blocking Alpha launch and what changed since yesterday?');
        }}
        isDemoMode={isDemoMode}
        issue42State={issue42State}
        onToggleDemoState={handleToggleDemoState}
      />

      {/* 3. Main Workspace Viewport (Offset left by 72px for rail on desktop, top 64px for topbar) */}
      <main className="ml-0 md:ml-18 mt-16 min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Screen 1: Overview Dashboard */}
        {activeTab === 'overview' && (
          <DashboardView
            issue42State={issue42State}
            onOpenAuditLog={() => setIsAuditLogModalOpen(true)}
            onSelectEntityNode={(nodeId) => {
              console.log('Selected node:', nodeId);
            }}
            onDeployIntelligence={() => {
              setActiveTab('ask');
              handleSendMessage('What is blocking Alpha launch and what changed since yesterday?');
            }}
            onInspectEvidence={handleSelectCitation}
            onOpenExportBriefing={() => setIsExportBriefingOpen(true)}
            onNavigateToRadar={() => setActiveTab('radar')}
          />
        )}

        {/* Screen: Change Radar (Signature Feature) */}
        {activeTab === 'radar' && (
          <div className="-m-4 sm:-m-6 lg:-m-8 flex-1 flex flex-col">
            <ChangeRadarView
              issue42State={issue42State}
              onInspectEvidence={handleSelectCitation}
              onSynthesizeInChat={(prompt) => {
                setActiveTab('ask');
                handleSendMessage(prompt);
              }}
              onToggleDemoState={handleToggleDemoState}
            />
          </div>
        )}

        {/* Screen 2: Ask PulseDesk (Conversational Intelligence Workspace with Source Inspector) */}
        {activeTab === 'ask' && (
          <div className="flex-1 flex overflow-hidden -m-6 lg:-m-8">
            <IntelligenceWorkspace
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onSelectEvidence={handleSelectCitation}
              onToggleDemoState={handleToggleDemoState}
              isDemoMode={isDemoMode}
              issue42State={issue42State}
            />
            <SourceInspector
              evidenceList={evidenceList}
              activityList={activityList}
              selectedEvidenceId={selectedEvidenceId}
              onOpenEvidenceDetail={(item) => setInspectedEvidence(item)}
            />
          </div>
        )}

        {/* Screen 3: Full-Scale Living Topology View */}
        {activeTab === 'topology' && (
          <div className="-m-6 lg:-m-8 flex-1 flex flex-col">
            <TopologyView
              issue42State={issue42State}
              onInspectEvidence={handleSelectCitation}
            />
          </div>
        )}

        {/* Screen 4: Intelligence Stream View */}
        {activeTab === 'stream' && (
          <div className="flex-1 max-w-5xl w-full mx-auto pb-28">
            <ActivityView />
          </div>
        )}

        {/* Screen 5: Memory Studio */}
        {activeTab === 'memory' && (
          <div className="-m-6 lg:-m-8 flex-1 flex flex-col">
            <MemoryView
              memories={memories}
              conversations={conversations}
              onCreateMemory={handleCreateMemory}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
              onSelectConversation={(convId) => {
                const found = conversations.find((c) => c.id === convId);
                if (found) {
                  setActiveConversationId(found.id);
                  setMessages(found.messages);
                  setActiveTab('ask');
                }
              }}
            />
          </div>
        )}

        {/* Screen 6: Connections Center */}
        {activeTab === 'connections' && (
          <div className="-m-6 lg:-m-8 flex-1 flex flex-col">
            <ConnectionsView
              connections={connections}
              onToggleConnection={handleToggleConnection}
            />
          </div>
        )}

        {/* Screen 7: Settings */}
        {activeTab === 'settings' && (
          <div className="-m-6 lg:-m-8 flex-1 flex flex-col">
            <SettingsView />
          </div>
        )}
      </main>

      {/* 4. Docked AI Command Console (Visible on overview) */}
      {activeTab === 'overview' && (
        <CommandConsole
          onRunCommand={(cmd) => {
            setActiveTab('ask');
            handleSendMessage(cmd);
          }}
          isLoading={isLoading}
          issue42State={issue42State}
        />
      )}

      {/* 5. Modals & Dialogs */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelectResult={(prompt) => {
          setActiveTab('ask');
          handleSendMessage(prompt);
        }}
      />

      <AuditLogModal
        isOpen={isAuditLogModalOpen}
        onClose={() => setIsAuditLogModalOpen(false)}
        issue42State={issue42State}
      />

      <EvidenceModal
        evidence={inspectedEvidence}
        onClose={() => setInspectedEvidence(null)}
      />

      <ExportBriefingModal
        isOpen={isExportBriefingOpen}
        onClose={() => setIsExportBriefingOpen(false)}
        issue42State={issue42State}
      />

      <DemoControlModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        issue42State={issue42State}
        onToggleIssue42={handleToggleDemoState}
        onRunDemoQuery={() => {
          setActiveTab('ask');
          handleSendMessage('What is blocking Alpha launch and what changed since yesterday?');
        }}
      />
    </div>
  );
}
export default App;
