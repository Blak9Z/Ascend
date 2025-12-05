export type QuestStatus = "locked" | "in_progress" | "completed";

export type QuestStepStatus = "todo" | "in_progress" | "done";

export type QuestStep = {
  id: string;
  label: string;
  status: QuestStepStatus;
  evidence?: string;
};

export type Quest = {
  id: string;
  title: string;
  summary: string;
  category: string;
  xp: number;
  badge: string;
  status: QuestStatus;
  progress: number;
  difficulty: "starter" | "skilled" | "legendary";
  estimatedMinutes: number;
  steps: QuestStep[];
  tags?: string[];
};
